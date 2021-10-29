

var CashDetailInfo;

var hasJiabi = false;
var hasJiabi_ = false;
var hasCanbi = false;
var hasJiabiArr = [];

//加载钞票明细
function LoadDiscernCashDetailInfo() {
    hasJiabi_ = false;
    hasCanbi = false;
    var CashTaskDetailId = $("#CashTaskDetailId").val();
    if (!CashTaskDetailId) {
        CashTaskDetailId = InquiriesList[quiriesIndex].ID
    }
    $.ajax({
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "/StuHome/GetDiscernCashDetailInfo",//url
        data: { TaskDetailId: CashTaskDetailId  },
        success: function (data) {
            CashDetailInfo = data;

            $("#yisicanbiList").empty();
            $("#yisijiabiList").empty();
            for (var i = 0; i < data.length; i++) {
                var item = data[i];

                var html = `<li data-cashid="${item.ID}">
                                <img class="qian_xiao" src="/img/public3D/sq_img_qian.png" />
                            </li>`

                if (item.Type == "1") {
                    hasCanbi = true;
                    $("#yisicanbiList").append(html);
                }
                else if (item.Type == "2") {
                    hasJiabi_ = true;
                    $("#yisijiabiList").append(html);
                    //是否是假币
                    if (item.CounterfeitType.length > 0) {
                        //hasJiabi = true;
                    }
                }
            }

    
        },
        error: function (result) {

        }
    });
}




var yisijia_index;
//疑似假币
function yisijia() {
    if (!hasJiabi_) return;
    yisijia_index = layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1000px', '650px'],
        type: 1,
        skin: 'layer-yisijia', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        shade: 0.8,
        content: $("#yisijia")
    });
    $("#yisijiabiList").find("li").eq(0).click();
}

// 关闭(疑似假币)
//$(".yisijia_guanbi").on("click", function () {
//    layer.close(yisijia_index)
//})


var selectCashId;
//两个个切换、事件委托方法
$(".qian_ul").on('click', 'li', function () {
    $('li').removeClass('qianxuan');
    $(this).addClass("qianxuan");
    selectCashId = $(this).data("cashid");
    cashClick(selectCashId);
})

// 显示细节按钮
$(".btn_xianxi").on("click", function () {
    $(".btn_xianxi").hide();
    $(".btn_guanxi").show();
    $(".qian_xijie_map").show();
})

$(".btn_guanxi").on("click", function () {
    $(".btn_guanxi").hide();
    $(".btn_xianxi").show();
    $(".qian_xijie_map").hide();
})

//选择做题真假币   两个按钮切换、
//$(".sq_xuan").on('click', 'li', function () {
//    $('li').removeClass('sq_xuan_zhong');
//    $(this).addClass("sq_xuan_zhong");
//})







var yisicsb_index;
//疑似残损币
function yisicsb() {
    if (!hasCanbi) return;
    yisicsb_index = layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1000px', '650px'],
        type: 1,
        skin: 'layer-yisijia', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        shade: 0.8,
        content: $("#yisicsb")
    });
    $("#yisicanbiList").find("li").eq(0).click();
}

// 关闭(残损币)
//$(".yisicsb_guanbi").on("click", function () {
//    layer.close(yisicsb_index)
//})

// 显示标尺按钮
$(".btn_xianbc").on("click", function () {
    $(".btn_xianbc").hide();
    $(".btn_guanbc").show();
    $(".sq_biaochi").show();
})

$(".btn_guanbc").on("click", function () {
    $(".btn_guanbc").hide();
    $(".btn_xianbc").show();
    $(".sq_biaochi").hide();
})


function cashClick(selectCashId) {
    var findCashInfo = null;
    for (var i = 0; i < CashDetailInfo.length; i++) {
        var item = CashDetailInfo[i];
        if (item.ID == selectCashId) {
            findCashInfo = item;
            break;
        }
    }

    if (findCashInfo == null) return;
    if (findCashInfo.Type == "1") {
        var scr = "";
        if (findCashInfo.DamageType == "1") {
            scr = "/img/public3D/sq_img_cs5.png";
        }
        else if (findCashInfo.DamageType == "2") {
            scr = "/img/public3D/sq_img_cs4.png";
        }
        else if (findCashInfo.DamageType == "3") {
            scr = "/img/public3D/sq_img_cs1.png";
        }
        else if (findCashInfo.DamageType == "4") {
            scr = "/img/public3D/sq_img_cs2.png";
        }
        $("#cansunbiDatu").attr("src", scr);

    }
    else if (findCashInfo.Type == "2") {

        var CounterfeitType = findCashInfo.CounterfeitType;
        var arr = CounterfeitType.split(",");

        for (var i = 1; i <= 4; i++) {
            if ($.inArray(i+"", arr) >= 0) {
                $(`#cashXijie${i}`).attr("src",`/img/public3D/sq_xijie_${i}jia.png`)
            } else {
                $(`#cashXijie${i}`).attr("src", `/img/public3D/sq_xijie_${i}zhen.png`)
            }
        }


    }




}
//1真币 2假币 3残损币全额 4半额  5无法兑换
function signCash(type) {
    if (type === 2) {
        hasJiabiArr[selectCashId] = 0
    } else if (type === 1) hasJiabiArr[selectCashId] = 1
    if (type == 1 || type == 2) {
        $("#yisijiabiList").find("li").each(function () {
            if ($(this).data("cashid") == selectCashId) {
                var src = "";
                if (type == 1) {
                    src = "/img/public3D/sq_ico_chao_zhen.png"
                } else if (type == 2) {
                    src = "/img/public3D/sq_ico_chao_jia.png"
                }
                $(this).find("img").eq(0).siblings().remove();
                $(this).append(`<img class="zhenjia_biaoji" src="${src}" />`)
            }
        })
        hasJiabi = hasJiabiArr.includes(0) ? true : false;
    }
    else if (type == 3 || type == 4 || type == 5 || type == 6) {
        $("#yisicanbiList").find("li").each(function () {
            if ($(this).data("cashid") == selectCashId) {
                var src = "";
                if (type == 3) {
                    src = "/img/public3D/sq_ico_chao_qedh.png"
                } else if (type == 4) {
                    src = "/img/public3D/sq_ico_chao_bedh.png"
                } else if (type == 5) {
                    src = "/img/public3D/sq_ico_chao_ledh.png"
                } else if (type == 6) {
                    src = "/img/public3D/sq_ico_chao_ledh.png"
                }
                $(this).find("img").eq(0).siblings().remove();
                $(this).append(`<img class="zhenjia_biaoji" src="${src}" />`)
            }
        })
    }


}