var linkId = 2;

var doBusiness = "个人转账";

$(function () {
    showjindutiao(linkId);
    //播放客户走进银行 warning
    playVideo(linkId,null);

})


//接待弹窗
function jiedai() {
    if (linkId != 2) {
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

function jiedaiEnd() {
    layer.closeAll();
    linkId++;
    showjindutiao(linkId);
}


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
    var getNumber = '483652';
    $("#getNumberText").text(`取号牌：${getNumber}`);
    layer.open({
        title: false,
        //btn: ['确定'],
        //area: ['700px', '400px'],
        type: 1,
        //offset: 'b',
        skin: 'style_quhao', //样式类名
        closeBtn: false, //显示关闭按钮
        anim: 5,
        shade: 0,
        shadeClose: true, //开启遮罩关闭
        content: $("#quhao")
    });
}

//递给客户
function geikehu() {
    var getNumber = '483652';
    $("#getNumber2Text").text(`取号牌：${getNumber}`);
    layer.closeAll();
    layer.open({
        title: '取号递号',
        //btn: ['确定'],
        area: ['800px', '400px'],
        type: 1,
        offset: 'b',
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#digei")
    });
}

//根据业务类型获得业务
function GetBusinessByType() {

    var typeName = $("#yewuSel option:selected").val();
    {
        //新增OK
        $.ajax({
            url: '/HallProcess/GetBusinessByType',
            Type: 'POST',
            data: { "TypeName": typeName },
            async: false,
            success: function (data) {
                $("#yewuSubSel").empty();
                var json = JSON.parse(data);
                var html = " <option value=\"请选择业务\">请选择业务</option>";
                for (var i = 0; i < json.length; i++) {
                    html += "<option value=\"" + json[i].ID + "\">" + json[i].BusinessName + "</option>";
                }
                $("#yewuSubSel").append(html);
            }
        });
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

//递给客户  区号操作判断对错
function quhaojieguo() {

    var busName = $("#yewuSubSel option:selected").text().trim();
    if ('个人活期取款' != busName) {
        jieguoAlert(geikehu,"操作不正确，请重新选择","已出错")
    }
    else
    {
        layer.closeAll();
        linkId++;
        showjindutiao(linkId);
    }

    
}

//取号后引导
function quhaohouyindao()
{
    /*if (linkId != 4) {
        kouchumanyidu();
        return;
    }*/
    if (linkId == 2) return kouchumanyidu();
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
        title: '引导客户',
        //btn: ['确定'],
        area: ['700px', '400px'],
        type: 1,
        offset: 'b',
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#quhaohouyindao")
    });

}

//取号后引导结果
function quhaohouyindaoEnd()
{
    var denghouqu = $("input[name='denghouqu']:checked").val();
    if ('填写单据' != denghouqu) {
        jieguoAlert(quhaohouyindao, "操作不正确，请重新选择", "已出错")
    }
    else {
        layer.closeAll();
        linkId++;
        showjindutiao(linkId);
        //播放客户去往填单台动画
        window.location.href = `/HallProcess/FillForm`;
    }

    

}
