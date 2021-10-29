var linkId = 5;

var doBusiness = "个人转账";

$(function () {

    showjindutiao(linkId, null);

    localStorage.removeItem('danjushenhe'); 

    $(window).focus(function () {
        var danjushenhe = localStorage.getItem('danjushenhe');
        if (danjushenhe == "1") {
            $("#yihecha").text("已核查");
            $("#yihecha").addClass("shtg");
            linkId++;
            showjindutiao(linkId);
        }
    });

    //播放客户走向填单台动画 warning
    playVideo(linkId);

})

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
    $("#businessName").text(doBusiness);
    layer.closeAll();
    layer.open({
        title: '选择填写单据',
        //btn: ['确定'],
        area: ['800px', '650px'],
        type: 1,
        offset: 'b',
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#tiandan")
    });
}

//填单  选取单据递给客户填
function xuanzedanju()
{

    var xuanzedanjus = [];

    $("input[name='checkForm']:checked").each(function () {
        xuanzedanjus.push($(this).val());
    });
    var xuanzedanjuStr = xuanzedanjus.join(',');

    if (xuanzedanjuStr != "6") {
        jieguoAlert(tiandan, "操作不正确，请重新选择", "已出错")
        return;
    }

    layer.closeAll();
    //播放表带递给客户  客户填写完成 并返回动画

    playVideo(501, shenhedanju);
    //shenhedanju();
}

function shenhedanju()
{
    layer.closeAll();
    layer.open({
        title: '选择审核单据',
        //btn: ['确定'],
        area: ['800px', '650px'],
        type: 1,
        offset: 'b',
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#yaoshenhe")
    });

}

//请您填写   不同表单用不同html
function shenhe() {
    var index = layer.open({
        type: 2,
        title: '个人转账',
        skin: 'layui-layer-lan', //样式类名
        shadeClose: true,
        shade: false,
        maxmin: true, //开启最大化最小化按钮
        area: ['1300px', '600px'],
        content: '/ABZ_Form/Form_110206'
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
    $("#doBusinessName").text(doBusiness);
    layer.closeAll();
    layer.open({
        title: '引导客户',
        //btn: ['确定'],
        area: ['700px', '400px'],
        type: 1,
        offset: 'b',
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#tiandanhouyindao")
    });

}

//取号后引导结果
function tiandanhouyindaoEnd() {
    var denghouqu = $("input[name='denghouqu']:checked").val();
    if ('零售等候区' != denghouqu) {
        jieguoAlert(tiandanhouyindao, "操作不正确，请重新选择", "已出错")
    }
    else {
        layer.closeAll();
        linkId++;
        showjindutiao(linkId);
        playVideo(6, null);
    }


}