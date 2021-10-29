
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
                    $('#CaseDescription').html(HTMLDecode(CaseDescription));
                    if (customerInfo.BusinessType.trim() == "对公业务" && customerInfo.BusinessName !== "单位活期存款") {
                        $("#shouquxianjinDiv").hide();
                        $("#xianjinchuliHuanjie").hide();
                        $("#totalTaskCount").text("8");
                        
                    }
                    
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
    var BgSrc = `/flash/${xingxiang}/end07-1-1.jpg`;
    if (guitai == 2) {
        BgSrc = `/flash/${xingxiang}/end07-1-2.jpg`;
    }
    $('#bj').attr('src', BgSrc);

    if (linkId == 7) {
        //播放客户从厅堂走进柜面 warning
        playVideo(7, null);
    }
    else {
        showImg();
    }

    initTiandanList();

    if (guitai == 2) {
        //jiezhi_diannao_digui
        //jiezhi_yz_digui
        //jiezhi_sfzyz_digui
        //jiezhi_wjj_digui
        $(".jiezhi_diannao").removeClass("jiezhi_diannao").addClass("jiezhi_diannao_digui");
        $(".jiezhi_yz").removeClass("jiezhi_yz").addClass("jiezhi_yz_digui");
        $(".jiezhi_sfzyz").removeClass("jiezhi_sfzyz").addClass("jiezhi_sfzyz_digui");
        $(".jiezhi_wjj").removeClass("jiezhi_wjj").addClass("jiezhi_wjj_digui");
        $(".xiandayin").removeClass("xiandayin").addClass("xiandayin_digui");
    }


    window.addEventListener('message', function (e) {
        if (e.data.substring(0, 5) == "zuoti") {
            var formid = e.data.split(':')[1];


            if (formid == "130101" || formid == "130102" || formid == "130103" || formid == "130104" || formid == "130105" || formid == "130106" || formid == "130107" || formid == "120235") {
                layer.close(zuotiLayerIndex);
                var name = searchFormNameByNo(formid);
                var src = getFormImgSrcByFormName(name);
                AddInventoryItem(name, formid, src);
            }

        }
    });

    //页面刷新的时候会清除打印文件
    var sName = "printName";
    localStorage.setItem(sName,"");


    //当前窗口得到焦点 
    window.onfocus = function () {
        var sName = "printName";
        var lStorage = localStorage.getItem(sName);
        if (lStorage != null && lStorage != undefined && lStorage.length > 0) {
            $("#drag4").show();
        }
    };
    var $input = $("#txtActualMoney")
        
    $input.on("keypress", function (e) {
        filterNum(e);
    }).on("keyup", function (e) {
        var val = $(this).val();
        val = formatCurrency(val);

            $(this).val(val);
        }).on("blur", function () {
            var val = $(this).val();
            $(this).val(val+".00");
        });

    if (typeof OpenGuide !== undefined && $("#zhiyincao").css("display")==="none") {
        setTimeout(function () {  OpenGuide() }, 300)
    }

})
// 只允许数字及后退
var filterNum = function (e) {
    // 数字和后退键以外禁用
    if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8) {
        e.preventDefault();
        return false;
    }
},
    // 格式化金额
formatCurrency = function (num) {

        num = num.toString().replace(/\$|\,/g, '');

        if (isNaN(num)) {
            num = "0";
        }

        var sign, cents;  // 正负  小数

        sign = ((Number(num) >= 0) ? '' : '-');  //   正负
        num = Math.abs(num * 100 + 0.50000000001);
        cents = num % 100;

        num = Math.floor(num / 100).toString();
        if (cents < 10) {
            cents = '0' + cents;
        }

        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
                num.substring(num.length - (4 * i + 3));
        }

        return (sign + num);  // + '.' + cents;
    },
getCurrency = function (num) {
        return num.replace(/\$|\,/g, '');
    };


function initTiandanList() {
    initTiandanListItem("danjulist8", 8);
    initTiandanListItem("danjulist91", 91);
    initTiandanListItem("danjulist92", 92);
    initTiandanListItem("danjulist93", 93);
    initTiandanListItem("danjulist11", 11);

    //初始化营销转介选项
    initMarketList();
    //初始化打印选项
    initPrintList();
}

var tiandanList = {};
function initTiandanListItem(objId, modeid) {
    $(`#${objId}`).empty();
    $.ajax({
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "/StuHome/GetCommonSelectOptions",//url
        data: { ModeId: modeid },
        success: function (result) {
            tiandanList[modeid] = result;
            if (tiandanList[8] != undefined && tiandanList[91] != undefined && tiandanList[92] != undefined && tiandanList[93] != undefined && tiandanList[11] != undefined ) {
                GetInventoryItem();
            }
            var data = result;
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var name = item.name;
                var value = item.value;
                var str =`<li data-name="${name}" data-value="${value}">
				    <p class="danjuimg_map">
					    <img onclick="danjutupian(this);"  src="${getFormImgSrcByFormName(name)}"/>
				    </p>
				    <p class="danju_name">
					    <span><input id="${objId}shouquziliao${i}" type="checkbox" name="checkForm" value="${value}">
					    <label class="zt_lable" for="${objId}shouquziliao${i}"></label></span>
					
					    <span>${name}</span> 
				    </p>
			    </li>`

                //var str = `<div class="col-sm-3" data-name="${name}" data-value="${value}">
                //                <p><img src="/Img/ico_jia.png" /></p>
                //                <p class="m-t-sm"><input type="checkbox" class="i-checks" name="checkForm" value="${value}"><span class="m-l-sm  ">${name}</span></p>
                //            </div>`;
                if (modeid == 11) {
                    str = `<li data-name="${name}" data-value="${value}" onclick="DoFormTopic(this)">
				            <p class="danjuimg_map">
					            <img  src="${getFormImgSrcByFormName(name)}"/>
				            </p>
				            <p class="danju_name">
					            <span>${name}</span> 
				            </p>
			            </li>`
                    //str = `<div class="col-sm-3" data-name="${name}" data-value="${value}" onclick="DoFormTopic(this)">
                    //            <p><img src="/Img/ico_jia.png" /></p>
                    //            <p class="m-t-sm"><span class="m-l-sm  ">${name}</span></p>
                    //        </div>`;
                }
                html += str;
            }
            $(`#${objId}`).html(html);
            //$(`#${objId}`).find('input').iCheck({
            //    checkboxClass: 'icheckbox_flat-blue',
            //    radioClass: 'iradio_flat-blue'
            //});

        },
        error: function (result) {
            //layer.closeAll();//关闭所有弹出框
            layer.msg(result, { icon: 2 });
        }
    });
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

function initPrintList() {
    $.ajax({
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "/StuHome/GetCommonSelectOptions",//url
        data: { ModeId: 13 },
        success: function (result) {
            tiandanList[13] = result;
        },
        error: function (result) {
            //layer.closeAll();//关闭所有弹出框
            //layer.msg(result, { icon: 2 });
        }
    });
}

function huanying() {
    /*if (linkId != 7) {
        kouchumanyidu();
        return;
    }*/
    if (hasNextLinkId(7)) {
        kouchumanyidu();
        return;
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
        content: $("#huanying")
    });

}

//接待弹窗
function jiedai() {


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

//当前接待结束，进行下一个环节
function jiedaiEnd() {
    var data = getBaseSubmitInfo();
    data["Types"] = "1";
    data["LinkId"] = "7";
    data["OperationName"] = linkOperDict["7"];
    data["StuOperationalAnswers"] = "接待完成";


    StudentOperateSubmit(data, jiedaiEndBack);
}

function jiedaiEndBack(result) {
    layer.closeAll();
    if (result == "1") {
        setLinkId(8);
    }
}


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

//收取单据
function shouqdanju() {
    /*if (linkId != 8) {
        kouchumanyidu();
        return;
    }*/
    if (linkId == 7) return kouchumanyidu();
    if (hasNextLinkId(8)) {
        kouchumanyidu();
        var lid = linkId;
        if (lid > 8) {
            return;
        } else setLinkId(8)
    }
    $("#businessName").text(doBusiness);
    layer.closeAll();
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1000px', '550px'],
        type: 1,
        skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        //offset: '30px',
        shadeClose: false, //开启遮罩关闭
        content: $("#shouqdanju")
    });

}



$(document).ready(function () {

    $(".jd_btn").click(function () {
        $("#jd_con").slideToggle("slow");
        $(this).toggleClass("qie"); return false;
    });
});


var lastDanjuList8;
var lastDanjuList91;
var lastDanjuList92;
var lastDanjuList93;
//提交收取的单据
function tijiaodanju() {

    lastDanjuList8 = [];

    $("#danjulist8").find("input[name='checkForm']:checked").each(function () {
        lastDanjuList8.push($(this).val());
    });
    var xuanzedanjuStr = lastDanjuList8.join(',');

    var data = getBaseSubmitInfo();
    data["Types"] = "1";
    data["LinkId"] = "8";
    data["OperationName"] = "单据收取";
    data["StuOperationalAnswers"] = xuanzedanjuStr;


    StudentOperateSubmit(data, tijiaodanjuBack);

    
   
}



function tijiaodanjuBack(result) {
    if (result == "1" || result == "2") {
        tijiaodanju91();
    } else if ( result == "3") {
        jieguoAlert(shouqdanju, "操作不正确，请重新选择", "已出错")
    }
}

function tijiaodanju91() {

    lastDanjuList91 = [];

    $("#danjulist91").find("input[name='checkForm']:checked").each(function () {
        lastDanjuList91.push($(this).val());
    });
    var xuanzedanjuStr = lastDanjuList91.join(',');

    var data = getBaseSubmitInfo();
    data["Types"] = "1";
    data["LinkId"] = "91";
    data["OperationName"] = "身份证收取";
    data["StuOperationalAnswers"] = xuanzedanjuStr;


    StudentOperateSubmit(data, tijiaodanju91Back);

}

function tijiaodanju91Back(result) {
    if (result == "1" || result == "2") {
        tijiaodanju92();
    } else if (result == "3") {
        jieguoAlert(shouqdanju, "操作不正确，请重新选择", "已出错")
    }
}

function tijiaodanju92() {

    lastDanjuList92 = [];
    lastDanjuList93 = [];
    $("#danjulist92").find("input[name='checkForm']:checked").each(function () {
        lastDanjuList92.push($(this).val());
    });
    $("#danjulist93").find("input[name='checkForm']:checked").each(function () {
        lastDanjuList93.push($(this).val());
    });
    var xuanzedanjuStr = `${lastDanjuList92.join(',')}${lastDanjuList93.length > 0 ? `,${lastDanjuList93.join(',')}`:''}`;
    var data = getBaseSubmitInfo();
    data["Types"] = "1";
    data["LinkId"] = "92";
    data["OperationName"] = "非身份证收取";
    data["StuOperationalAnswers"] = xuanzedanjuStr;


    StudentOperateSubmit(data, tijiaodanju92Back);

}

function tijiaodanju92Back(result) {
    if (result == "1" || result == "2") {
        //jiedaiEnd();
        //播放客户去往填单台动画
        //window.location.href = `/HallProcess/FillForm`;
        layer.closeAll();

        playVideo(8, tijiaodanjuAction);
        
    } else if (result == "3") {
        jieguoAlert(shouqdanju, "操作不正确，请重新选择", "已出错")
    }
}



function tijiaodanjuAction() {
    $("#drag1").css("display", "block");//显示单据
    divShow = false;
    $("#wupin_btn").click();//触发物品栏点击事件
    setLinkId(9);
}



//收取资料
//function ziliaoshouqu() {
//    if (linkId != 9) {
//        kouchumanyidu();
//        return;
//    }
//    $("#zlbusinessName").text(doBusiness);
//    layer.closeAll();
//    layer.open({
//        title: '资料收取与效验',
//        //btn: ['确定'],
//        area: ['700px', '400px'],
//        type: 1,
//        offset: 'b',
//        skin: 'layui-layer-lan', //样式类名
//        closeBtn: 1, //显示关闭按钮
//        anim: 2,
//        shadeClose: false, //开启遮罩关闭
//        content: $("#ziliaoshouqu")
//    });
//}





//操作出错弹窗
//function jieguoAlert(funcName, msg1, msg2) {
//    $("#jieguoMessage1").text(msg1);
//    $("#jieguoMessage2").text(msg2);
//    $("#jieguoBtn").unbind("click");
//    $("#jieguoBtn").bind("click", funcName);


//    layer.closeAll();
//    layer.open({
//        title: false,
//        //btn: ['确定'],
//        area: ['400px', '270px'],
//        type: 1,
//        //offset: 'b',
//        skin: 'style_jieguo', //样式类名
//        closeBtn: false, //显示关闭按钮
//        anim: 2,
//        shadeClose: false, //开启遮罩关闭
//        content: $("#jieguo")
//    });

//}

//柜员填单弹窗
function guiyuantiandan() {
    /*if (linkId > 11 || linkId == 7) {
        kouchumanyidu();
        return;
    }*/
    if (linkId == 7) return kouchumanyidu();
    if (hasNextLinkId(11)) {
        kouchumanyidu();
        var lid = linkId;
        if (lid > 11) {
            return;
        } else setLinkId(11)
    }
    $("#gytdbusinessName").text(doBusiness);
    layer.closeAll();
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1000px', '700px'],
        type: 1,
        skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        offset: '30px',
        shadeClose: false, //开启遮罩关闭
        content: $("#guiyuantiandan")
    });
}

//柜员填单提交
function guiyuantiandantijiao() {
    layer.closeAll();
    setLinkId(12);
}



//收取现金
function CashCollection() {
    /*if (linkId > 10 || linkId == 7) {
        kouchumanyidu();
        return;
    }*/
    if (linkId == 7) return kouchumanyidu();
    if (hasNextLinkId(10)) {
        kouchumanyidu();
        var lid = linkId;
        if (lid > 10) {
            return;
        } else setLinkId(10)
    }
    //$("#gytdbusinessName").text(doBusiness);
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
        content: $("#xianjinchuli")
    });
}

//请你提交
function qingnitijiao() {
    layer.closeAll();
    $("#drag3").css("display", "block");//显示现金图片
}

//打开验钞窗口
function openyanchaochuangkou() {

    //GetCashEditTaskDetailInfo

    $.ajax({
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "/StuHome/GetCashEditTaskDetailInfo",//url
        data: { TaskId: $("#TaskId").val(), CustomerId: $("#CustomerId ").val() },
        success: function (result) {
            if (result.length > 0) {
                var item = result[0];
                $("#CashTaskDetailId").val(item["ID"]);
                var Answer = item["Answer"];
                var answerArr = Answer.split(",");
                $("#txtShowMoney").text(formatCurrency(answerArr[0])+".00");

                LoadDiscernCashDetailInfo();
                openxianjinchulitijiao();

            }
            else {
                layer.msg("任务未开启！");
            }

        },
        error: function (result) {

        }
    });
}

function openxianjinchulitijiao() {
    layer.closeAll();
    //layer.open({
    //    title: '假币残币处理',
    //    //btn: ['确定'],
    //    area: ['700px', '400px'],
    //    type: 1,
    //    offset: 'b',
    //    skin: 'layui-layer-lan', //样式类名
    //    closeBtn: 1, //显示关闭按钮
    //    anim: 2,
    //    shadeClose: false, //开启遮罩关闭
    //    content: $("#openchuangkou")
    //});

    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1000px', '500px'],
        type: 1,
        skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#shouqian")
    });

}

//完成处理
function CompleteCashProcessing() {

    var data = getBaseSubmitInfo();
    data["Types"] = "1";
    data["LinkId"] = "10";
    data["OperationName"] = linkOperDict["10"];

    data["StuOperationalAnswers"] = `${$("#txtShowMoney").text().trim().replace(/,/g, "").split(".")[0]},${$("#txtActualMoney").val().trim().replace(/,/g, "").split(".")[0]}`;


    StudentOperateSubmit(data, CompleteCashProcessingBack);

}

function CompleteCashProcessingBack(result) {
    if (result == "1" || result == "2" ) {
        layer.closeAll();


        //如果题目中出现假币
        if (hasJiabi) {

            var formid = "140301";
            var name = "假钞";
            var src = getFormImgSrcByFormName(name);
            AddInventoryItem(name, formid, src);
        }


        setLinkId(11);
    }
    else if (result == "3") {
        jieguoAlert(openxianjinchulitijiao, "操作不正确，请重新选择", "已出错")
    }
}

////介质我的电脑桌面
//function mybrain() {
//    if (linkId != 11 && linkId != 12) {
//        kouchumanyidu();
//        return;
//    }
//    layer.open({
//        title: '我的电脑',
//        //btn: ['确定'],
//        area: ['1000px', 'auto'],
//        type: 1,
//        skin: 'layui-layer-lan', //样式类名
//        closeBtn: 1, //显示关闭按钮
//        anim: 2,
//        shadeClose: false, //开启遮罩关闭
//        content: $("#mybrain")
//    });
//}


function mybrain() {
    /*if (linkId > 12) {
       kouchumanyidu();
        return;
    }*/
    if (linkId == 7) return kouchumanyidu();
    if (hasNextLinkId(12)) {
        kouchumanyidu();
        var lid = linkId;
        if (lid > 12) {
            return;
        } else setLinkId(12)
    }
    var TotalResultId = $("#TotalResultId").val();
    var ExamId = $("#ExamId").val();
    var TaskId = $("#TaskId").val();
    var CustomerId = $("#CustomerId").val();
    var LinkId = $("#LinkId").val();
    var Satisfaction = $("#Satisfaction").val();

    window.open("/ServiceRecord/Index?FormType=1&TotalResultId=" + TotalResultId + "&ExamId=" + ExamId + "&TaskId=" + TaskId + "&CustomerId=" + CustomerId + "&LinkId=" + LinkId + "&Satisfaction=" + Satisfaction + "");
    setLinkId(13);
}

//单据
function allowDrop(ev) {
    ev.preventDefault();
}

function dragStart(ev) {
    ev.dataTransfer.setData("TextId", ev.target.id);
    ev.dataTransfer.setData("TextType", $(ev.target).data("type"));
    ev.dataTransfer.setData("TextFormId", $(ev.target).data("value"));
    if ($("#gaizhangDanIfram").length > 0) {
        $("#gaizhangDanIfram").remove();
    }
}

function drop(ev) {
    ev.preventDefault();
    var dataName = ev.dataTransfer.getData("TextType");
    //ev.target.appendChild(document.getElementById(data));
    //$("#drag1").removeClass("xiandan");//移除提交单据样式
    //扩展物品栏拖动到盖章这
    if (dataName ==="wupinIngai"){
        var textId = ev.dataTransfer.getData("TextId");
        if (textId.indexOf("dragIdIndex") >= 0) {
            var d = document.getElementById(textId)
            LookFormInfo(d,0)
        }
    }
    var dropName = $(ev.target).data("type")
    if (dataName == "danju" && dropName == "wupinlan") {
        //单据收取拖拽到物品栏
        var textId = ev.dataTransfer.getData("TextId");
        $(`#${textId}`).hide();
        WupinlanGetDanju();
        setNextLinkPak();
        setLinkId(Object.keys(nextLinkIdObj)[0])
    }
    if (dataName == "dayin" && dropName == "wupinlan") {
        //打印单据收取拖拽到物品栏
        var sName = "printName";
        var lStorage = localStorage.getItem(sName);
        if (lStorage != null && lStorage != undefined && lStorage.length > 0) {

            var forms = lStorage.split(",");


            for (var i = 0; i < forms.length; i++) {
                var value = forms[i].trim();
                if (value.length == 0) continue;
                
                var name = searchFormNameByNo(value);
                var src = getFormImgSrcByFormName(name);
                AddInventoryItem(name, value, src);

            }
        }

        var textId = ev.dataTransfer.getData("TextId");
        $(`#${textId}`).hide();

        localStorage.setItem(sName, "");

    }
    if (/*dataName == "shenfenzheng" &&*/ dropName == "hechashenfenqi") {
        //身份证拖拽到联网核查身份证
        var formId = ev.dataTransfer.getData("TextFormId");
        var formName = searchFormNameByNo(formId);
        if (formId != "120101" && formId != "120102" && formId != "120103" && formId != "120104") {//只核查身份证表单
            return;
        }
        //TanchuHechajieguo(formId, formName);
        var data = getBaseSubmitInfo();
        data["Types"] = "2";
        data["LinkId"] = "91";
        data["FormId"] = formId;
        data["OperationName"] = linkOperDict["91"];
        data["StuOperationalAnswers"] = "已校验";
        lastHechajieguoFormId = formId;
        StudentOperateSubmit(data, TanchuHechajieguo);
    }
    if (dataName == "xianjin" && dropName == "yanchaoji") {
        //现金拖拽到验钞机
        var textId = ev.dataTransfer.getData("TextId");
        $(`#${textId}`).hide();
        openyanchaochuangkou();
    }
    if (dropName == "guihuanlan") {
        var textId = ev.dataTransfer.getData("TextId");
        if (textId.indexOf("dragIdIndex") >= 0) {
            ev.target.appendChild(document.getElementById(textId));
        }
    }
    if (dropName == "wupinlan") {
        var textId = ev.dataTransfer.getData("TextId");
        if (textId.indexOf("dragIdIndex") >= 0) {
            ev.target.appendChild(document.getElementById(textId));
        }
    }

    

}


function WupinlanGetDanju() {

    
    ClearInventory();


    for (var i = 0; i < lastDanjuList8.length; i++) {
        var value = lastDanjuList8[i];
        var name = searchFormNameByNo(value);
        var src = getFormImgSrcByFormName(name);
        AddInventoryItem(name, value, src);
    }
    for (var i = 0; i < lastDanjuList91.length; i++) {
        var value = lastDanjuList91[i];
        var name = searchFormNameByNo(value);
        var src = getFormImgSrcByFormName(name);
        AddInventoryItem(name, value, src);
    }
    for (var i = 0; i < lastDanjuList92.length; i++) {
        var value = lastDanjuList92[i];
        var name = searchFormNameByNo(value);
        var src = getFormImgSrcByFormName(name);
        AddInventoryItem(name, value, src);
    }

    for (var i = 0; i < lastDanjuList93.length; i++) {
        var value = lastDanjuList93[i];
        var name = searchFormNameByNo(value);
        var src = getFormImgSrcByFormName(name);
        AddInventoryItem(name, value, src);
    }

}

function searchFormNameByNo(value) {
    for (var mode in tiandanList) {
        var tempList = tiandanList[mode];
        for (var i = 0; i < tempList.length; i++) {
            var item = tempList[i];
            if (item.value == value) {
                return item.name;
            }
        }
    }
    return "";
}

//type 不传 就是默认的查看，  1：身份证校验查看
function LookFormInfo(obj,x) {

    var name = $(obj).data("name")
    var value = $(obj).data("value")
    var FormType = 3;

    if (value == "140102" || value == "140103" || value == "140106" || value == "140104") {
        FormType = 4;
    }

    if (value == "130101" || value == "130102" || value == "130103" || value == "130104" || value == "130105") {
        FormType = 6;
    }

    if (yinzhangIsOpen) {//签字盖章操作
        if (FormType == 6) {
            FormType = 7;
        } else {
            FormType = 5;
        }

    }

    var url = `/ABZ_Form/Form_${value}?FormType=${FormType}&FormId=${value}&TotalResultId=${$("#TotalResultId").val()}&ExamId=${$("#ExamId").val()}&TaskId=${$("#TaskId").val()}&CustomerId=${$("#CustomerId").val()}&LinkId=${$("#LinkId").val()}`;

    if (yinzhangIsOpen) {//签字盖章操作
        //扩展
        if ($("#gaizhangDanIfram").length > 0) {
            $("#gaizhangDanIfram").attr("src", url);
            $("#gaizhangDan").show();
        } else {
            var h = `<iframe id="gaizhangDanIfram" style="border: none;" src="${url}" width="100%" height="450"></iframe>`
            $("#gaizhangDan").append(h);
        }
    }
    else {//查看表单操作
        $("#chakanbiaodanmingxiTitle").text(name);
        $("#chakanbiaodanmingxiUrl").attr("src", url);
        if (x === 0) {
            return;
        }
        lastFormIndex = layer.open({
            title: false,
            //btn: ['确定'],
            area: ['1300px', '600px'],
            type: 1,
            skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
            closeBtn: false, //显示关闭按钮
            anim: 2,
            shadeClose: false, //开启遮罩关闭
            content: $("#chakanbiaodanmingxi")
        });
    }
    


    

}


var zuotiLayerIndex;
//做表单题目
function DoFormTopic(obj) {

    var name = $(obj).data("name")
    var value = $(obj).data("value")
    var url = `/ABZ_Form/Form_${value}?FormType=1&FormId=${value}&TotalResultId=${$("#TotalResultId").val()}&ExamId=${$("#ExamId").val()}&TaskId=${$("#TaskId").val()}&CustomerId=${$("#CustomerId").val()}&LinkId=${$("#LinkId").val()}&yzBz=true`;
    $("#guiyuantiandanmingxiTitle").text(name);
    $("#guiyuantiandanmingxiUrl").attr("src", url);

    CheckTimeOut();
    
    zuotiLayerIndex = layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1300px', '600px'],
        type: 1,
        skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#guiyuantiandanmingxi")
    });

}



var lastHechajieguoFormId;
//身份证效验结果
function TanchuHechajieguo(result) {
    HuoquHechajieguo();
    var formId = lastHechajieguoFormId;
    var formName = searchFormNameByNo(formId);

    var url = `/ABZ_Form/Form_${formId}?FormType=4&FormId=${formId}&TotalResultId=${$("#TotalResultId").val()}&ExamId=${$("#ExamId").val()}&TaskId=${$("#TaskId").val()}&CustomerId=${$("#CustomerId").val()}&LinkId=${$("#LinkId").val()}`;
    $("#iframeshenfenjiaoyan").attr("src", url);
    CheckTimeOut();
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1300px', '600px'],
        type: 1,
        skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#shenfenzheng")
    });
}

//获取后台设置核查结果，并处理对应按钮
function HuoquHechajieguo() {

    var FormId = lastHechajieguoFormId;
    var TaskId = $("#TaskId").val();
    var CustomerId = $("#CustomerId").val();//客户id
    var data = { "FormId": FormId, "TaskId": TaskId, "CustomerId": CustomerId }//Id: Id,


    $.ajax({
        //几个参数需要注意一下
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "/Base/GetQueryThree",//url
        data: data,
        async: false,
        success: function (result) {

            var hechajieguo = "0";
            if (result != null && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var FormItemStr = result[i]["FormItemStr"];
                    var SingleAnswer = result[i]["SingleAnswer"];

                    if (FormItemStr == "dy10") {//核查结果
                        hechajieguo = SingleAnswer;
                    }
                }
            }


            $("#hechadayinBtn").show();
            $("#hechasongbieBtn").hide();

            //if (hechajieguo == "1") {
            //    $("#hechadayinBtn").show();
            //    $("#hechasongbieBtn").hide();
            //} else {
            //    $("#hechadayinBtn").hide();
            //    $("#hechasongbieBtn").show();
            //}

        },
        error: function (result) {

        }
    });


}



//打印身份证复核结果，并打印机上面显示结果单据样式
function DayinHechajieguo() {
    layer.closeAll();
    var value = lastHechajieguoFormId;
    if (value == "120101") {
        value = "140102";
    } else if (value == "120102") {
        value = "140103";
    } else if (value == "120103") {
        value = "140106";
    } else if (value == "120104") {
        value = "140104";
    }
    var name = searchFormNameByNo(value) + "联网核查结果";
    var src = getFormImgSrcByFormName("客户身份证联网核查结果");
    AddInventoryItem(name, value, src);
    
}

//核查后 身份证出现问题 送别客户
function HechahouSongbieKehu() {
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
        content: $("#shenfenzhengyc")
    });

}

//核查后 身份证出现问题 送别客户 送别按钮
function HechahouSongbieKehuEnd() {
    //执行下一个客户命令
    layer.closeAll();
    jinxingsongbie();
}




var yinzhangIsOpen = false;
//触发印章的时候打开弹窗并打开物品栏
function openyinzhang() {
    
    //if (linkId != 12) {
    //    kouchumanyidu();
    //    return;
    //}
    if (linkId == 7) return kouchumanyidu();
    if (hasNextLinkId(13)) {
        kouchumanyidu();
        var lid = linkId;
        if (lid > 13) {
            return;
        } else setLinkId(13)
    }
    divShow = false;
    $("#wupin_btn").click();//触发物品栏点击事件
    yinzhangIsOpen = true;
    //$("#gaizhangDan").hide();

    selectYinzhang = "";
    localStorage.setItem("selectYinzhang", "");
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1200px', '700px'],
        type: 1,
        skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        offset: '30px',
        shade: 0,
        shadeClose: false, //开启遮罩关闭
        content: $("#yinzhanghe")
    });

}

function closeYinzhang(obj) {
    layerCloseZdy(obj);
    selectYinzhang = "";
    localStorage.setItem("selectYinzhang", "");

    yinzhangIsOpen = false;
}

var selectYinzhang = "";
function clickYinzhang(yinzhang) {
    selectYinzhang = yinzhang;
    localStorage.setItem("selectYinzhang", selectYinzhang);

    $("#gaizhangDanIfram")[0].contentWindow.changgeCursor();
    setLinkId(14);
}





function Fanhuankehu() {
    if (linkId == 7) return kouchumanyidu();
    if (hasNextLinkId(14)) {
        kouchumanyidu();
        var lid = linkId;
        if (lid > 14) {
            return;
        } else setLinkId(14)
    }
    layer.closeAll();
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['700px', '400px'],
        type: 1,
        skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        shade:0,
        content: $("#guihuanlan")
    });

    //个人开卡 物品栏要增加 银行卡
    if (doBusiness.indexOf("个人开卡") >= 0) {
        var value = "120201";
        var name = searchFormNameByNo(value);
        var src = getFormImgSrcByFormName(name);
        AddInventoryItem(name, value, src);

    }

}

function FanhuankehuEnd() {

    var answerList = [];
    $("#guihuan_con").find("div").each(function () {
        if ($(this).data("value") != undefined) {
            answerList.push($(this).data("value"));
        }
    })
    console.log(answerList.join(","));
    var data = getBaseSubmitInfo();
    data["Types"] = "1";
    data["LinkId"] = "14";
    data["OperationName"] = linkOperDict["14"];
    data["StuOperationalAnswers"] = answerList.join(",");


    StudentOperateSubmit(data, FanhuankehuEndBack);
}

function FanhuankehuEndBack(result) {
    if (result == "1" || result == "2") {
        layer.closeAll();
        setLinkId(15);
    } else if (result == "3") {
        jieguoAlert(Fanhuankehu, "操作不正确，请重新选择", "已出错")
    }
}

function Yinxiaozhuanjie() {
   
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

    var productId = Array.from($('input:checkbox[name="chanpinliebiao"]:checked')).map(r => r.value).join(",")//$('input:checkbox[name="chanpinliebiao"]:checked').val();
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
    data["LinkId"] = "15";
    data["OperationName"] = linkOperDict["15"];
    data["StuOperationalAnswers"] = answer;


    StudentOperateSubmit(data, jinxingtuijieBack);
}

function jinxingtuijieBack(result) {
    if (result == "1" || result == "2") {
        layer.closeAll();
    } else if (result == "3") {
        jieguoAlert(Yinxiaozhuanjie, "操作不正确，请重新选择", "已出错")
    }
}


function songbiekehu() {
    if (linkId == 7) return kouchumanyidu();
    if (hasNextLinkId(15)) {
        kouchumanyidu();
        var lid = linkId;
        if (lid > 15) {
            return;
        } else setLinkId(15)
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
        content: $("#songbiekehu")
    });
}

function jinxingsongbie() {

    var data = getBaseSubmitInfo();
    data["Types"] = "1";
    data["LinkId"] = "151";
    data["OperationName"] = linkOperDict["151"];
    data["StuOperationalAnswers"] = "送别完成";


    StudentOperateSubmit(data, jinxingsongbieBack);
}

function jinxingsongbieBack(result) {

    if (result == 1) {
        GuimianToTingtang();
    }
}

function GuimianToTingtang() {
    var data = getBaseSubmitInfo();
    data["LinkId"] = "151";
    $.ajax({
        type: "POST",//方法类型
        dataType: "text",//预期服务器返回的数据类型
        url: "/StuHome/GuimianToTingtang",//url
        data: data,
        success: function (result) {
            if (result == "1") {
                layer.closeAll();//关闭所有弹出框
                playVideo(15, GuimianToTingtangAction);
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

function GuimianToTingtangAction() {
    window.location.href = `/StuHome/StudentHome?TotalResultId=${$("#TotalResultId").val()}&TaskId=${$("#TaskId").val()}`;
}




//选择单据大图弹窗
function danjutupian(obj) {
    var type = $(obj).parent().parent().parent().attr("Id");
    $("#danjutupianType").val(type);
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

    var type = $("#danjutupianType").val();

    var check = false;
    $(`#${type}`).find("input[name=checkForm]").each(function () {
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
    var type = $("#danjutupianType").val();
    $(`#${type}`).find("input[name=checkForm]").each(function () {
        if ($(this).val() == value) {
            $(this).prop("checked", check);
        }
    });
}

function xuanzedandatuZuo() {
    xuanzedandatuByIndex(-1);
}


function xuanzedandatuYou() {
    xuanzedandatuByIndex(1);
}

function xuanzedandatuByIndex(index) {

    var type = $("#danjutupianType").val();
    var formList = $(`#${type}`).find("input[name=checkForm]");

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
