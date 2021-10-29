var linkId = 7;

var doBusiness = "个人开卡";

$(function () {
    showjindutiao(linkId);
    //播放客户走进银行 warning
    //playVideo(linkId, null);

})


//接待弹窗
function jiedai() {
    if (linkId != 7) {
        kouchumanyidu();
        return;
    }

    $("#doBusinessText").text(`您好，我想要办理${doBusiness}业务。`);

    layer.closeAll();
    layer.open({
        title: '接待客户',
        //btn: ['确定'],
        area: ['700px', '400px'],
        type: 1,
        offset: 'b',
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#jiedai")
    });
}

//当前接待结束，进行下一个环节
function jiedaiEnd() {
    layer.closeAll();
    linkId++;
    showjindutiao(linkId);
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
        area: ['400px', '270px'],
        type: 1,
        //offset: 'b',
        skin: 'style_jieguo', //样式类名
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
        //return;
    }
    $("#businessName").text(doBusiness);
    layer.closeAll();
    layer.open({
        title: '单据收取',
        //btn: ['确定'],
        area: ['700px', '400px'],
        type: 1,
        offset: 'b',
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#shouqdanju")
    });

}

//物品栏js
var divShow = true;
//点击物品栏
function DoClickWupinLan() {

    //divShow = false;
    var withoutMargin = $("#wupin_con").outerWidth();
    var wpnumber = withoutMargin;

    var thisObj = $("#wupinlan");
    if (divShow) {
        thisObj.each(function () {
            $(this).animate({
                left: "0"
            }, 300);
        });
        divShow = false;
    } else {
        thisObj.each(function () {
            $(this).animate({
                left: wpnumber
            }, 300);
        });
        divShow = true;
    }
}

$(document).ready(function () {

    $(".jd_btn").click(function () {
        $("#jd_con").slideToggle("slow");
        $(this).toggleClass("qie"); return false;
    });
});

//提交收取的单据
function tijiaodanju() {
    var denghouqu = $("input[name='checkForm']:checked").val();

    if ('1' != denghouqu) {
        jieguoAlert(shouqdanju, "操作不正确，请重新选择", "已出错")
    }
    else {
        jiedaiEnd();
        //播放客户去往填单台动画
        //window.location.href = `/HallProcess/FillForm`;
        $("#drag1").css("display", "block");//显示单据
        divShow = false;
        DoClickWupinLan();//触发物品栏点击事件
    }
}


//收取资料
function ziliaoshouqu() {
    if (linkId != 9) {
        kouchumanyidu();
        return;
    }
    $("#zlbusinessName").text(doBusiness);
    layer.closeAll();
    layer.open({
        title: '资料收取与效验',
        //btn: ['确定'],
        area: ['700px', '400px'],
        type: 1,
        offset: 'b',
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#ziliaoshouqu")
    });
}

//提交资料收取
function tijiaoziliaosq() {
    var denghouqu = $("input[name='checkForm1']:checked").val();

    if ('1' != denghouqu) {
        jieguoAlert(ziliaoshouqu, "操作不正确，请重新选择", "已出错")
    }
    else {
        //jiedaiEnd();
        layer.closeAll();
        $("#drag2").css("display", "block");//显示单据
        divShow = false;
        DoClickWupinLan();//触发物品栏点击事件
    }
}

//物品栏资料弹窗
function MissileMaterial() {
    layer.open({
        title: '银行卡',
        //btn: ['确定'],
        area: ['700px', '400px'],
        type: 1,
        offset: 'b',
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#yinhangka")
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
        area: ['400px', '270px'],
        type: 1,
        //offset: 'b',
        skin: 'style_jieguo', //样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#jieguo")
    });

}

//柜员填单弹窗
function guiyuantiandan() {
    if (linkId != 10) {
        kouchumanyidu();
        return;
    }
    $("#gytdbusinessName").text(doBusiness);
    layer.closeAll();
    layer.open({
        title: '选择单据',
        //btn: ['确定'],
        area: ['700px', '400px'],
        type: 1,
        offset: 'b',
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#guiyuantiandan")
    });
}

//柜员填单提交
function guiyuantiandantijiao() {
    //点击后判断单据选择是否正确与单据填写内容是否正确；
    var denghouqu = $("input[name='checkForm2']:checked").val();

    if ('1' != denghouqu) {
        jieguoAlert(guiyuantiandan, "操作不正确，请重新选择", "已出错")
    } else {
        layer.closeAll();
        layer.open({
            title: '请填写正确的单据内容',
            //btn: ['确定'],
            area: ['700px', '400px'],
            type: 1,
            offset: 'b',
            skin: 'layui-layer-lan', //样式类名
            closeBtn: 1, //显示关闭按钮
            anim: 2,
            shadeClose: false, //开启遮罩关闭
            content: $("#guiyuantiandannr")
        });
    }
}

//完成柜员填写单据内容
function CompleteFillIn() {
    //判断单据单据填写内容是否正确
    var denghouqu = $("input[name='checkForm3']:checked").val();

    if ('1' != denghouqu) {
        jieguoAlert(guiyuantiandantijiao, "操作不正确，请重新选择", "已出错")
    } else {
        jiedaiEnd();
    }
}

//收取现金
function CashCollection() {
    /*if (linkId != 11) {
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
    //$("#gytdbusinessName").text(doBusiness);
    layer.closeAll();
    layer.open({
        title: '单据收取',
        //btn: ['确定'],
        area: ['700px', '400px'],
        type: 1,
        offset: 'b',
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
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
function openchuangkou() {
    //layer.closeAll();
    layer.open({
        title: '假币残币处理',
        //btn: ['确定'],
        area: ['700px', '400px'],
        type: 1,
        offset: 'b',
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#openchuangkou")
    });
}

//完成处理
function CompleteProcessing() {
    layer.closeAll();
    if (linkId != 11) {
        kouchumanyidu();
        return;
    }

    var money = $("#txtMoney").val();//获取Money
    if (money == 100) {//正确
        jiedaiEnd();
    } else {

    }
}

////介质我的电脑桌面
//function mybrain() {
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
    var TotalResultId = $("#TotalResultId").val();
    var ExamId = $("#ExamId").val();
    var TaskId = $("#TaskId").val();
    var CustomerId = $("#CustomerId").val();
    var LinkId = $("#LinkId").val();
    var Satisfaction = $("#Satisfaction").val();

    window.open("/ServiceRecord/Index?FormType=1&TotalResultId=" + TotalResultId + "&ExamId=" + ExamId + "&TaskId=" + TaskId + "&CustomerId=" + CustomerId + "&LinkId=" + LinkId + "&Satisfaction=" + Satisfaction + "");
}

//单据
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("Text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("Text");
    ev.target.appendChild(document.getElementById(data));
    $("#drag1").removeClass("xiandan");//移除提交单据样式
}

//资料
function allowDrop2(ev) {
    ev.preventDefault();
}

function drag2(ev) {
    ev.dataTransfer.setData("Text", ev.target.id);
}

function drop2(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("Text");
    ev.target.appendChild(document.getElementById(data));
    $("#drag2").removeClass("ziliao");//移除提交资料样式
}


//现金
function allowDrop3(ev) {
    ev.preventDefault();
}

function drag3(ev) {
    ev.dataTransfer.setData("Text", ev.target.id);
}

function drop3(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("Text");
    ev.target.appendChild(document.getElementById(data));
    $("#drag3").removeClass("xianjin");//移除提交现金样式
}

//现金收取拖动
function allowDrop4(ev) {
    ev.preventDefault();
}

function drag4(ev) {
    ev.dataTransfer.setData("Text", ev.target.id);
}

function drop4(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("Text");
    ev.target.appendChild(document.getElementById(data));
}


//身份证验证
function allowDrop5(ev) {
    ev.preventDefault();
}

function drag5(ev) {
    ev.dataTransfer.setData("Text", ev.target.id);
}

function drop5(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("Text");
    ev.target.appendChild(document.getElementById(data));

    myfunction();
}

//身份证效验结果
function myfunction() {
    layer.open({
        title: '打印核查结果',
        //btn: ['确定'],
        area: ['700px', '400px'],
        type: 1,
        offset: 'b',
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#shenfenzheng")
    });
}

//打印身份证复核结果，并打印机上面显示结果单据样式
function dayinhechajiegou() {
    layer.closeAll();
    if (linkId != 9) {
        kouchumanyidu();
        return;
    }
    jiedaiEnd();
}


//客户送别
function KeHuSongBie() {
    layer.open({
        title: '送别客户',
        //btn: ['确定'],
        area: ['700px', '400px'],
        type: 1,
        offset: 'b',
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#shenfenzhengyc")
    });
}

//客户送别后OK
function haode() {
    layer.closeAll();
    if (linkId != 9) {
        kouchumanyidu();
        return;
    }
    jiedaiEnd();
}

//触发印章的时候打开弹窗并打开物品栏
function openyinzhang() {
    /*if (linkId != 13) {
        kouchumanyidu();
        return;
    }*/
    if (linkId == 7) return kouchumanyidu();
    if (hasNextLinkId(13)) {
        kouchumanyidu();
        var lid = linkId;
        if (lid > 13) {
            return;
        } else setLinkId(13)
    }
    divShow = false;//打开物品栏
}