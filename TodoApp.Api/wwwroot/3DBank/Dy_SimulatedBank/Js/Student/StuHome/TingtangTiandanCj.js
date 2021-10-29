

var linkId;

var doBusiness = "";
var CaseDescription = "";
var taskInfoInTypes = [];
function setLinkId(_linkId) {
    if (_linkId == linkId) {
        return;
    }
    $("#LinkId").val(_linkId);
    linkId = _linkId;
    showjindutiao(linkId);
    getInquiriesByLinkId(linkId);
    //获取下一步
    setNextLinkId();
}

var customerInfo = null;

var yishenheFormList=[];
$(function () {

   

    $.ajax({
        type: "POST",
        async: false,
        url: "/StuHome/GetCustomerInfoById",
        data: { "CustomerId": $("#CustomerId").val() },
        dataType: "json",
        success: function (data) {
            if (Array.isArray(data)) {
                if (data.length > 0) {
                    customerInfo = data[0];
                    doBusiness = customerInfo.BusinessName;
                    CaseDescription = customerInfo.CaseDescription;
                }
            }

        },
        error: function (error) {

        }
    });

    window.addEventListener('message', function (e) {
        if (e.data.substring(0, 5) == "hecha") {

            var formid = e.data.split(':')[1];
            var index = $.inArray(formid, yishenheFormList);
            if (index < 0) {
                yishenheFormList.push(formid);
                shenhedanju();
            }
        }
    });
    $.ajax({
        type: "POST",
        async: false,
        url: "/StuHome/GetTaskDetailTypeInfo",
        data: { "TaskId": $("#TaskId").val() },
        dataType: "json",
        success: function (d) {
            if (Array.isArray(d)) {
                if (d.length > 0) {
                    var lidArr = {};
                    d.forEach(r => {
                        if (lidArr[r.SubLinkId]) {
                            lidArr[r.SubLinkId].OperationName = lidArr[r.SubLinkId].OperationName + ';' + r.OperationName
                            lidArr[r.SubLinkId].Answer = lidArr[r.SubLinkId].Answer + ';' + r.Answer
                            lidArr[r.SubLinkId].FormId = lidArr[r.SubLinkId].FormId + ';' + r.FormId
                            lidArr[r.SubLinkId].Types = lidArr[r.SubLinkId].Types + ';' + r.Types
                        } else {
                            lidArr[r.SubLinkId] = r
                        }
                    })
                    if (lidArr["8"] === undefined) {
                        lidArr["8"] = {}
                        lidArr["8"].OperationName = "单据收取"
                        lidArr["8"].Answer = ""
                        lidArr["8"].FormId = ""
                        lidArr["8"].Types = "1"
                        lidArr["8"].SubLinkId = 8
                    }
                    taskInfoInTypes = Object.values(lidArr);
                }
            }
        }
    })
    setLinkId($("#LinkId").val());

    initTiandanList();

    var xingxiang = getXingxiangByAppearance();//形象区分
    var guitai = getGuitaiByBusiness();//柜面区分 高柜低柜
    var BgSrc = `/flash/${xingxiang}/end04-3-1.jpg`;
    $('#bj').attr('src', BgSrc);

    //播放客户走向填单台动画 在TingtangCj执行过了
    //playVideo(linkId);
    showImg();
    
})

var quiriesIndex = 0;
var strArrat = [];
var strIndex = 0;
var method = "";
var rests = [];
var lastIndex = 99;
//对话框 ——all
function handleZX(action, rest) {
    method = action
    rests = rest
    var su = linkId;
    su = su == 2.5 ? 20 : su;
    if (InquiriesList.length > 0 && su == InquiriesList[0].LinkNumber) {
        //一条代表一个问答
        var str = InquiriesList[quiriesIndex] && InquiriesList[quiriesIndex].CustomerQuestion
        quiriesIndex = 0;
        if (str) {
            strArrat = str.split("|");
            lastIndex = strArrat.length;
            if (lastIndex == 1) {
                askImgClick(strArrat[strIndex])
            } else {
                alertS(strArrat[strIndex])
            }
        }
    } else {
        action(...rest)
    }
}

function alertS(str) {
    str = str.replace(/^问:/, "");
    str = str.replace(/^答:/, "");
    $("#all_title").html(str)
    layer.open({
        title: false,
        area: ['600px', '280px'],
        type: 1,
        skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#duihuakuang"),
        end: function () {
            strIndex++
            if (lastIndex - 1 == strIndex) {
                askImgClick(strArrat[strIndex])
            }
            if (lastIndex - 1 > strIndex) {
                alertS(strArrat[strIndex])
            }
        }
    });
}
//操作出错弹窗
function jieguoAlert(funcName, msg1, msg2) {
    $("#jieguoMessage1").text(msg1);
    $("#jieguoMessage2").text(msg2);
    $("#jieguoBtn").unbind("click");
    $("#jieguoBtn").bind("click", function () {
        layer.closeAll();
        funcName();
    });

    var times = ErrorTimes[ErrorTimes.length - 1].times;
    $("#ErrorTimes").children().each(function (i) {
        if (i < times) {
            $(this).show();
        } else {
            $(this).hide();
        }
    })
    if (times >= 3) {
        $("#ErrorLookAnalysis").show();
    } else {
        $("#ErrorLookAnalysis").hide();
    }



    layer.closeAll();
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['600px', '280px'],
        type: 1,
        skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#jieguo")
    });

}

var tiandanList = null;
function initTiandanList() {
    $("#tiandanlist").empty();
    $.ajax({
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "/StuHome/GetCommonSelectOptions",//url
        data: { ModeId: "5" },
        success: function (result) {
            $("#tiandanlist").empty();
            tiandanList = result;
            var data = result;
            var html = '';
            for (var i = 0; i < data.length; i++) {

                var item = data[i];
                var name = item.name;
                var value = item.value;

                var str = `<li data-name="${name}" data-value="${value}">
                    <p class="danjuimg_map">
                        <img onclick="danjutupian(this);" src="${getFormImgSrcByFormName(name)}" />
                    </p>
                    <p class="danju_name">
                        <span>
                            <input type="checkbox" id="xuanzedanju${i}" name="checkForm" value="${value}">
                            <label class="zt_lable" for="xuanzedanju${i}"></label>
                        </span>
                        <span>${name}</span>
                    </p>
                </li>`
                html += str;
            }
            $("#tiandanlist").html(html);

        },
        error: function (result) {
            //layer.closeAll();//关闭所有弹出框
            layer.msg(result, { icon: 2 });
        }
    });
}

//填单  选择单据
function tiandan() {
    /*if (linkId != 5) {
        kouchumanyidu();
        return;
    }*/
    if (linkId == 2) return kouchumanyidu();
    if (hasNextLinkId(5)) {
        kouchumanyidu();
        var lid = linkId;
        if (lid > 5) {
            return;
        } else setLinkId(5)
    }
  
    layer.closeAll();
    handleZX(selectLayer, [])

}

function selectLayer() {
    $("#businessName").text(doBusiness);
    layer.closeAll();
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1000px', '700px'],
        type: 1,
        skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#tiandan")
    });
}

var lastXuanzedanjuStr;
//填单  选取单据递给客户填
function xuanzedanju()
{
    var xuanzedanjus = [];

    $("input[name='checkForm']:checked").each(function () {
        xuanzedanjus.push($(this).val());
    });
    var xuanzedanjuStr = xuanzedanjus.join(',');

    var data = getBaseSubmitInfo();
    data["Types"] = "1";
    data["LinkId"] = "5";
    data["OperationName"] = "单据填单";
    data["StuOperationalAnswers"] = xuanzedanjuStr;
    lastXuanzedanjuStr = xuanzedanjuStr;
    StudentOperateSubmit(data, xuanzedanjuBack);

    
}

//扩展
function tianxieDan() {
    var xuanzedanjus = [];
    var xuntile = []
    $("input[name='checkForm']:checked").each(function () {
        xuanzedanjus.push($(this).val());
        xuntile.push($(this).parent().next().html().trim());
    });
    //var xuanzedanjuStr = xuanzedanjus.join(',');
    if (xuanzedanjus.length === 0) {
        layer.msg("请选择你要填写的单据", {icon:2})
        return;
    }
    arrI = 0;
    isxieDan = false;
    var taskid = $("#TaskId").val().trim()
    var customerid = $("#CustomerId").val().trim()
    var TotalResultId = $("#TotalResultId").val().trim()
    var ExamId = $("#ExamId").val().trim()
    var LinkId = $("#LinkId").val().trim()
    var FormType = 9
    var d = { xuanzedanjus, taskid, customerid, TotalResultId, ExamId, LinkId, FormType, xuntile}
    alertIntianxieDan(d)
}
var arrI = 0;
var isxieDan = false;
function alertIntianxieDan({ xuanzedanjus, taskid, TotalResultId, ExamId, LinkId, customerid, FormType, xuntile }) {
    var formname = xuntile[arrI]
    var formid = xuanzedanjus[arrI]
    layer.open({
        type: 2,
        title: formname,
        skin: 'layui-layer-lan', //样式类名
        shadeClose: true,
        shade: false,
        maxmin: true, //开启最大化最小化按钮
        area: ['1250px', '700px'],
        content: "/Abz_Form/Form_" + formid + "?TaskId=" + taskid + "&CustomerId=" + customerid + "&TotalResultId=" + TotalResultId + "&ExamId=" + ExamId + "&LinkId=" + LinkId + "&FormType=" + FormType + "&FormId=" + formid + "&yzBz=true",
        cancel: function () {
            isxieDan = true;
        },
        end: function () {
            if (isxieDan) {
                return;
            }
            arrI++
            if (xuntile[arrI] !== undefined) {
                layer.msg("现在打开" + xuntile[arrI]+"请稍等...", { icon: 1 }, function () {
                    alertIntianxieDan({ xuanzedanjus, taskid, TotalResultId, ExamId, LinkId, customerid, FormType, xuntile })
                })
                
            } else {
                xuanzedanju() 
                //xuanzedanjuBack("1")————lzy 取消以前提交填单
            }
        }
    });
}

function xuanzedanjuBack(result) {
    layer.closeAll();
    if (result == "1" || result == "2") {
        playVideo(501, shenhedanju);
        //$("#bj").attr("src", "/Img/tingtangtiandan_bj2.jpg")
    } else if ( result == "3") {
        jieguoAlert(tiandan, "操作不正确，请重新选择", "已出错")
    }

}



function shenhedanju()
{
    layer.closeAll();

    setTimeout(function () {
        layer.open({
            title: false,
            //btn: ['确定'],
            area: ['1000px', '700px'],
            type: 1,
            skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
            closeBtn: false, //显示关闭按钮
            anim: 2,
            shadeClose: false, //开启遮罩关闭
            content: $("#yaoshenhe")
        }); }, 200);  

    

    $("#tiandanshenhelist").empty();
    var xuanzeItemList = [];
    var xuanzeList = lastXuanzedanjuStr.split(',');
    for (var i = 0; i < xuanzeList.length; i++) {
        var xuanzeform = xuanzeList[i];
        for (var j = 0; j < tiandanList.length; j++) {
            var item = tiandanList[j];
            if (item.value == xuanzeform) {
                xuanzeItemList.push(item);
                break;
            }
        }
    }
    var data = xuanzeItemList;
    var html = '';
    for (var i = 0; i < data.length; i++) {
        
        var item = data[i];
        var name = item.name;
        var value = item.value;

        var index = $.inArray(value, yishenheFormList);

        

        var str = `<li data-name="${name}" data-value="${value}" onclick = "shenhe(this)">
				        <img class="yishenico" src="/img/public3D/ico_yishen.png" hidden/>
				        <p class="danjuimg_map">
					        <img src="${getFormImgSrcByFormName(name)}"/>
				        </p>
				        <p class="danju_name">
					        <span>${name}</span> 
				        </p>
			        </li>`;
        if (index >= 0) {
            str = `<li data-name="${name}" data-value="${value}" onclick = "shenhe(this)">
				        <img class="yishenico" src="/img/public3D/ico_yishen.png" />
				        <p class="danjuimg_map">
					        <img src="${getFormImgSrcByFormName(name)}"/>
				        </p>
				        <p class="danju_name">
					        <span>${name}</span> 
				        </p>
			        </li>`;
        }
            
        html += str;
    }
    $("#tiandanshenhelist").html(html);

    

}

function wanchengshenhe() {
    if (linkId == 2) return kouchumanyidu();
    if (hasNextLinkId(5)) {
        kouchumanyidu();
        var lid = linkId;
        if (lid > 5) {
            return;
        } else setLinkId(5)
    }
    layer.closeAll();
    //playVideo(503, tiandanshenhewancheng)
    tiandanshenhewancheng();
}

function tiandanshenhewancheng() {

    //$('#bj').attr('src', '/Img/tingtangsongbie_bj.jpg');
    setLinkId(6);
}

var lastFormIndex;
//请您填写   不同表单用不同html
function shenhe(obj) {
    var name = $(obj).data("name")
    var value = $(obj).data("value")
    //2
    var src = `/ABZ_Form/Form_${value}?FormType=8&FormId=${value}&TotalResultId=${$("#TotalResultId").val()}&ExamId=${$("#ExamId").val()}&TaskId=${$("#TaskId").val()}&CustomerId=${$("#CustomerId").val()}&LinkId=${$("#LinkId").val()}`;
    $("#shenheoneName").text(name);
    $("#shenheoneIframe").attr("src", src);
    CheckTimeOut();
    lastFormIndex = layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1200px', '750px'],
        type: 1,
        skin: 'layer-yisijia', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        shade: 0.8,
        offset: '30px',
        content: $("#shenheone")
    });
    //layer.full(index);
}

//填单后引导
function tiandanhouyindao() {
    /*if (linkId != 6) {
        kouchumanyidu();
        return;
    }*/
    if (linkId == 2) return kouchumanyidu();
    if (hasNextLinkId(6)) {
        kouchumanyidu();
        var lid = linkId;
        if (lid > 6) {
            return;
        } else setLinkId(6)
    }
    //$("#doBusinessName").text(doBusiness);
    layer.closeAll();
    tianwandanyindao()
}

function tianwandanyindao() {
    layer.closeAll();
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['800px', '240px'],
        type: 1,
        skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#tiandanhouyindao"),
        end: function () {
            handleZX(tiandanhouyindaoEnd, [])
        }
    });
}

//取号后引导结果
function tiandanhouyindaoEnd() {
    var denghouqu = $("input[name='denghouqu']:checked").val();

    var data = getBaseSubmitInfo();
    data["Types"] = "1";
    data["LinkId"] = "6";
    data["OperationName"] = linkOperDict["6"];
    data["StuOperationalAnswers"] = denghouqu;


    StudentOperateSubmit(data, tiandanhouyindaoEndBack);

    
}

function tiandanhouyindaoEndBack(result) {

    layer.closeAll();
    var data = getBaseSubmitInfo();
    data["LinkId"] = "6";
    if (result == "1" || result == "2") {

        $.ajax({
            type: "POST",//方法类型
            dataType: "text",//预期服务器返回的数据类型
            url: "/StuHome/TiandanToGuimian",//url
            data: data,
            success: function (result) {
                if (result == "1") {
                    layer.closeAll();//关闭所有弹出框

                    setLinkId(7);
                    //播放填单台走向服务等候区视频
                    playVideo(6, TiandanToFuwuqu);


                }
                else
                    if (result == "-1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('执行失败', { icon: 2 });
                    } else {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg(result, { icon: 2 });
                    }
            },
            error: function (result) {
                layer.closeAll();//关闭所有弹出框
                layer.msg(result, { icon: 2 });
            }
        });

        //setLinkId(5);
        //window.location.href = `/HallProcess/FillForm`;
        //alert("跳转填单台");
    } else if (result == "3") {
        jieguoAlert(quhaohouyindao, "操作不正确，请重新选择", "已出错")
    }

}

function TiandanToFuwuqu() {
    window.location.href = `/StuHome/StudentHome?TotalResultId=${$("#TotalResultId").val()}&TaskId=${$("#TaskId").val()}`;

}




//选择单据大图弹窗
function danjutupian(obj) {
    var value = $(obj).parent().parent().data("value");
    var name = $(obj).parent().parent().data("name");
    initDanjudatuForm(value, name);
    
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1100px', '650px'],
        type: 1,
        skin: 'layer-yisijia', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        shade: 0.8,
        content: $("#danjutupian")
    });
}


var selectdanjudatuValue;
function initDanjudatuForm(value, name) {

    var check = false;
    $("#tiandanlist").find("input[name=checkForm]").each(function () {
        if ($(this).val() == value) {
            check = $(this).prop("checked");
        }
    });
    $("#xuanzedandatu").prop("checked", check);

    $("#xuanzedandatu").data("value", value);
    selectdanjudatuValue = value;
    $("#xuanzedanjuName").text(name);
    $("#danjudatuImg").attr("src", getFormImgSrcByFormName(name));

}



function xuanzedandatuClick(obj) {
    var check = $(obj).prop("checked");
    var value = $(obj).data("value");
    $("#tiandanlist").find("input[name=checkForm]").each(function () {
        if ($(this).val() == value) {
            $(this).prop("checked", check);
        }
    });
}

function xuanzedandatuZuo(){
    xuanzedandatuByIndex(-1);
}


function xuanzedandatuYou() {
    xuanzedandatuByIndex(1);
}

function xuanzedandatuByIndex(index) {

    var formList = $("#tiandanlist").find("input[name=checkForm]");

    var i = 0;
    formList.each(function () {
        if ($(this).val() == selectdanjudatuValue) {
            return false;
        }
        i++;
    });
    i = i + index;
    if (i > formList.length - 1) {
        i = formList.length - 1
    }
    if (i < 0) {
        i = 0;
    }
    var value = formList.eq(i).parent().parent().parent().data("value");
    var name = formList.eq(i).parent().parent().parent().data("name");
    initDanjudatuForm(value, name);

}

