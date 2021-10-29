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
    setNextLinkId();
}

var customerInfo = null;
$(function () {
    

    $.ajax({
        type: "POST",
        async: false,
        url: "/StuHome/GetCustomerInfoById",
        data: { "CustomerId": $("#CustomerId").val()},
        dataType: "json",
        success: function (data) {
            if (Array.isArray(data)) {
                if (data.length > 0) {
                    customerInfo = data[0];
                    doBusiness = customerInfo.BusinessName;
                    CaseDescription = customerInfo.CaseDescription;
                    $('#CaseDescription').html(HTMLDecode(CaseDescription));
                }
            }

        },
        error: function (error) {

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
                        r.SubLinkId = r.SubLinkId == 20 ? 2.5 : r.SubLinkId;
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

    var xingxiang = getXingxiangByAppearance();//形象区分
    var guitai = getGuitaiByBusiness();//柜面区分 高柜低柜
    var BgSrc = `/flash/${xingxiang}/start02-1-1.jpg`;
    $('#bj').attr('src', BgSrc);


    //播放客户走进银行 warning
    if (linkId == 2) {
        playVideo(2, null);
        
    }
    else {
        showImg();
    }

    initMarketList();
    
})

function huanying() {
    /*if (linkId != 2) {
        kouchumanyidu();
        return;
    }*/
    if (hasNextLinkId(2)) {
        kouchumanyidu();
        return;
    }
    layer.closeAll();
    handleZX(jiedaiEnd,[1])
    

}
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
    strIndex = 0;
    var su = linkId;
    su = su == 2.5 ? 20 : su;
    if (InquiriesList.length > 0 && (su == InquiriesList[0].LinkNumber)) {
        //一条代表一个问答
        var str = InquiriesList[quiriesIndex] && InquiriesList[quiriesIndex].CustomerQuestion;
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
//接待弹窗
function jiedai() {

    var Recording = customerInfo.Recording;
    if (Recording != null && Recording.length > 0) {
        playSound(Recording, 0);
    }

    
    $("#doBusinessText").text(customerInfo.Prologue);

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
        content: $("#jiedai")
    });
}

function jiedaiEnd(t) {
    if (t === 2) {
        if (!$("#yewuSel").val()) {
            layer.msg("请选择取号类型", { icon: 2 });
            return;
        }
        t = undefined
    }
    var data = getBaseSubmitInfo();
    data["Types"] = "1";
    data["LinkId"] = "2";
    data["OperationName"] = linkOperDict["2"];
    data["StuOperationalAnswers"] = "接待完成";

    // 扩展参数 string  type
    StudentOperateSubmit(data, jiedaiEndBack,t);



    //layer.closeAll();
    //linkId++;
    
}

function jiedaiEndBack(result,t)
{
    layer.closeAll();
    
    if (result == "1") {
        setLinkId(2.5);
        $(".bot8").attr("onclick","quhaohouyindao(1)")
    }
    
}





var getNumber;
//取号
function quhao() {
    /*if (linkId != 3) {
        kouchumanyidu();
        return;
    }*/
    if (linkId == 2) return kouchumanyidu();
    if (hasNextLinkId(3)) {
        kouchumanyidu();
        var lid = linkId;
        if (lid > 3) {
            return;
        } else setLinkId(3)
    }
    handleZX(setQuHao, [])
    
}

function setQuHao() {
    var ranNumber = Math.floor(Math.random() * 1000000 + 1)
    if (ranNumber >= 1000000) ranNumber = 999999;


    getNumber = ranNumber.toString();
    while (getNumber.length < 6) {
        getNumber = "0" + getNumber;
    }

    $("#getNumberText").text(`取号牌：${getNumber}`);
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['800px', '400px'],
        type: 1,

        skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#digei")
    });
}

function GetBusinessByType(t) {
    var v = t.value;
    if (!v) {
        $("#getNumber2Text").text("");
        return;
    }
    $("#getNumber2Text").text(v + "：" + getNumber);
}

//递给客户
function geikehu() {
    
    
    var s = $("#yewuSel").val().trim();
    $("#bankTypeStr").html(s);
    $("#getNumber2Text").text(`取号牌：${getNumber}`);
    layer.closeAll();
    layer.open({
        title:false,
        //btn: ['确定'],
        area: ['800px', '400px'],
        type: 1,
   
        skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#digei")
    });
}

////根据业务类型获得业务
//function GetBusinessByType() {

//    var typeName = $("#yewuSel option:selected").val();
//    {
//        //新增OK
//        $.ajax({
//            url: '/HallProcess/GetBusinessByType',
//            Type: 'POST',
//            data: { "TypeName": typeName },
//            async: false,
//            success: function (data) {
//                $("#yewuSubSel").empty();
//                var json = JSON.parse(data);
//                var html = " <option value=\"请选择业务\">请选择业务</option>";
//                for (var i = 0; i < json.length; i++) {
//                    html += "<option value=\"" + json[i].ID + "\">" + json[i].BusinessName + "</option>";
//                }
//                $("#yewuSubSel").append(html);
//            }
//        });
//    }
//}


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

//递给客户  区号操作判断对错
function quhaojieguo() {
    layer.closeAll()
    var v = $("#yewuSel").val().trim();
    if (v === "") {
        layer.msg("请选择取号类型")
        return;
    }
    var data = getBaseSubmitInfo();
    data["Types"] = "1";
    data["LinkId"] = "3";
    data["OperationName"] = linkOperDict["3"];
    var busName = $("#yewuSel").val().trim();
    data["StuOperationalAnswers"] = busName;
    //扩展 

    StudentOperateSubmit(data, quhaojieguoBack);
    //StudentOperateSubmit(data, quhaojieguoBack);

    
}

function quhaojieguoBack(result) {

    layer.closeAll();
    if (result == "1" || result == "2") {
        setLinkId(4);
        $(".bot8").attr("onclick", "quhaohouyindao(2)")
    } else if (result == "3") {
        jieguoAlert(geikehu, "操作不正确，请重新选择", "已出错")
    }

}

//取号后引导
function quhaohouyindao(t)
{
    if (linkId == 2) return kouchumanyidu();
    if (t == 1) {//2.5
        if (hasNextLinkId(2.5)) {
            kouchumanyidu();
            var lid = linkId;
            if (lid > 2.5) {
                return;
            } else setLinkId(2.5)
        }
        $("#doBusinessName").text(doBusiness);
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
            content: $("#yindaokehu")
        });
    } else {//4
        if (hasNextLinkId(4)) {
            kouchumanyidu();
            var lid = linkId;
            if (lid > 4) {
                return;
            } else setLinkId(4)
        }
        $("#doBusinessName").text(doBusiness);
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
            content: $("#quhaohouyindao")
        });
    }

    

}

//接待分流引导

function yindaokehuEnd() {
    layer.closeAll()
    var v = $("input[name='yindaofenliu']:checked").val()
    if (v === undefined) {
        layer.msg("请选择！");
        return;
    }
    var data = getBaseSubmitInfo();
    data["Types"] = "1";
    data["LinkId"] = "20";
    data["OperationName"] = linkOperDict["20"];
    var denghouqu = v;
    data["StuOperationalAnswers"] = denghouqu;
    lastDenghouqu = denghouqu;//记录选择答案
    StudentOperateSubmit(data, handleZX, yindaokehuEndBack);
    //StudentOperateSubmit(data, yindaokehuEndBack);
}
function yindaokehuEndBack(result) {
    layer.closeAll();
    var data = getBaseSubmitInfo();
    data["LinkId"] = "20";
    if (result == "1" || result == "2") {
        if (lastDenghouqu == "取号") {
            setLinkId(3);
            $(".bot8").attr("onclick", "quhaohouyindao(2)")
        } else {
            setLinkId(3);
            $(".bot8").attr("onclick", "quhaohouyindao(2)")
        }
        
       
    } else if (result == "3") {
        jieguoAlert(geikehu, "操作不正确，请重新选择", "已出错")
    }
}
var lastDenghouqu = "";

//取号后引导结果
function quhaohouyindaoEnd()
{
    layer.closeAll();
    var v = $("input[name='denghouqu']:checked").val()
    if (v === undefined) {
        layer.msg("请选择！");
        return;
    }
    var data = getBaseSubmitInfo();
    data["Types"] = "1";
    data["LinkId"] = "4";
    data["OperationName"] = linkOperDict["4"];
    var denghouqu = $("input[name='denghouqu']:checked").val();
    data["StuOperationalAnswers"] = denghouqu;
    lastDenghouqu = denghouqu;//记录选择答案
    StudentOperateSubmit(data, handleZX, quhaohouyindaoEndBack);//handleZX(jiedaiEnd,[1]) quhaohouyindaoEndBack

}

function quhaohouyindaoEndBack(result) {

    layer.closeAll();
    var data = getBaseSubmitInfo();
    data["LinkId"] = "4";
    if (result == "1" || result == "2") {
        if (lastDenghouqu == "填单台") {//去填单台
            $.ajax({
                type: "POST",//方法类型
                dataType: "text",//预期服务器返回的数据类型
                url: "/StuHome/TingtangToTiandan",//url
                data: data,
                success: function (result) {
                    if (result == "1") {
                        layer.closeAll();//关闭所有弹出框

                        //播放走向填单台视频
                        playVideo(4, TingtangToTiandan);
                        //$("#bj").attr("src", "/Img/tingtangtiandan_bj.jpg")
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
        }
        else if (lastDenghouqu == "服务等候区" || lastDenghouqu == "自助服务区") {//去柜面
            $.ajax({
                type: "POST",//方法类型
                dataType: "text",//预期服务器返回的数据类型
                url: "/StuHome/TingtangToTiandan",//url
                data: data,
                success: function (result) {
                    if (result == "1") {
                        layer.closeAll();//关闭所有弹出框

                        //播放走向填单台视频
                        playVideo(4, TingtangToTiandan);
                        //$("#bj").attr("src", "/Img/tingtangtiandan_bj.jpg")
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
        }

        //setLinkId(5);
        //window.location.href = `/HallProcess/FillForm`;
        //alert("跳转填单台");
    } else if (result == "3") {
        jieguoAlert(quhaohouyindao, "操作不正确，请重新选择", "已出错")
    }

}

function TingtangToTiandan() {
    window.location.href = `/StuHome/StudentHome?TotalResultId=${$("#TotalResultId").val()}&TaskId=${$("#TaskId").val()}`;
}


function initMarketList() {

    $.ajax({
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "/StuHome/GetCommonSelectOptions",//url
        data: { ModeId: 15 },
        success: function (result) {

            var data = result;
            var html = '';

            for (var j = 0; j < data.length; j++) {
                var item = data[j];
                var name = item.name;
                var value = item.value;
                var str = `<li>
                    ${name}
                    <span class="yx_xz">
                        <input id="chanpininput${j}" type="checkbox" name="chanpinliebiao" value="${value}">
                        <label class="zt_lable" for="chanpininput${j}"></label>
                    </span>
                </li>`
                html += str;
            }

            $(`#yingxiaozhuanjieList`).html(html);
            

        },
        error: function (result) {
            //layer.closeAll();//关闭所有弹出框
            //layer.msg(result, { icon: 2 });
        }
    });
}




function Yinxiaozhuanjie() {
    setLinkId(16);
    layer.closeAll();
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['800px', '500px'],
        type: 1,
        skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#yingxiaozhuanjie")
    });
}

function jinxingtuijie() {

    var productId = Array.from($('input:checkbox[name="chanpinliebiao"]:checked')).map(r => r.value).join(",");//$('input:checkbox[name="chanpinliebiao"]:checked').val();
    if (productId == undefined) {
        layer.msg("请选择产品！");
        return;
    }
    var fuwuName = Array.from($('input:radio[name="fuwuquyu"]:checked')).map(r => r.value).join(",")//$('input:checkbox[name="fuwuquyu"]:checked').val();
    if (fuwuName == undefined) {
        layer.msg("请服务区域！");
        return;
    }

    var answer = productId + "," + fuwuName;

    var data = getBaseSubmitInfo();
    data["Types"] = "1";
    data["LinkId"] = "16";
    data["OperationName"] = linkOperDict["16"];
    data["StuOperationalAnswers"] = answer;

    StudentOperateSubmit(data,jinxingtuijieBack);
    //StudentOperateSubmit(data, jinxingtuijieBack);
}

function jinxingtuijieBack(result) {
    if (result == "1" || result == "2") {
        layer.closeAll();
    } else if ( result == "3") {
        jieguoAlert(Yinxiaozhuanjie, "操作不正确，请重新选择", "已出错")
    }
}


function songbiekehu() {
    //if (linkId != 16) {
    //    kouchumanyidu();
    //    return;
    //}
    if (linkId == 2) return kouchumanyidu();
    if (hasNextLinkId(16)) {
        kouchumanyidu();
        var lid = linkId;
        if (lid > 16) {
            return;
        } else setLinkId(16)
    }
    layer.closeAll();
    handleZX(jinxingsongbie, [])
    //layer.open({
    //    title: false,
    //    //btn: ['确定'],
    //    area: ['600px', '280px'],
    //    type: 1,
    //    skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
    //    closeBtn: false, //显示关闭按钮
    //    anim: 2,
    //    shadeClose: false, //开启遮罩关闭
    //    content: $("#songbiekehu")
    //});
}

function jinxingsongbie() {

    var data = getBaseSubmitInfo();
    data["Types"] = "1";
    data["LinkId"] = "161";
    data["OperationName"] = linkOperDict["161"];
    data["StuOperationalAnswers"] = "送别完成";


    StudentOperateSubmit(data, jinxingsongbieBack);
}

function jinxingsongbieBack(result) {
    if (result == 1) {
        NextCustomer();
    }
}

function NextCustomer() {
    var data = getBaseSubmitInfo();
    data["LinkId"] = "161";
    $.ajax({
        type: "POST",//方法类型
        dataType: "text",//预期服务器返回的数据类型
        url: "/StuHome/NextCustomer",//url
        data: data,
        success: function (result) {
            if (result == "1") {
                layer.closeAll();//关闭所有弹出框
                sessionStorage.setItem("manyidu", $("#manyidu").html());
                window.location.href = `/StuHome/StudentHome?TotalResultId=${$("#TotalResultId").val()}&TaskId=${$("#TaskId").val()}`;

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
}