
var SceneId = 1;

$(function () {

    var isGuide = false;

    var LinkId = $("#LinkId").val();

    if (LinkId == "1" || LinkId == "17") {
        SceneId = 1;
    }
    else if (LinkId == "2" || LinkId == "3" || LinkId == "4" || LinkId == "5" || LinkId == "6" || LinkId == "16") {
        SceneId = 2;
    }
    else if (LinkId == "7" || LinkId == "8" || LinkId == "9" || LinkId == "10" || LinkId == "11" || LinkId == "12" || LinkId == "13" || LinkId == "14" || LinkId == "15") {
        SceneId = 3;
    }

    var Type_All = $("#Type_All").val();
    if (Type_All == "3") {
        var TaskId = $("#TaskId").val();
        var guideKey = `Guide${TaskId}_${SceneId}`;
        var guideValue = localStorage.getItem(guideKey);
        if (guideValue == undefined) {
            isGuide = true;
            localStorage.setItem(guideKey,1);
        }
    }

    if (isGuide && false) {
        OpenGuide();
    }


})

var GuideIndex = 0;
function OpenGuide() {
    GuideIndex = 0;
    ShowGuideImg();
    console.count()
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['100%', '100%'],
        offset: '0px',
        type: 1,
        skin: 'layer-yisijia', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        shade: 0.4,
        content: $("#zhiyincao")
    });

}

function GuidePrev() {
    GuideIndex--;
    if (GuideIndex == 3) {
        if (SceneId == 2) {
            GuideIndex--;
            GuideIndex--;
        }
    }
    ShowGuideImg();
}

function GuideNext() {
    GuideIndex++;
    if (GuideIndex == 2) {
        if (SceneId == 2) {
            GuideIndex++;
            GuideIndex++;
        }
    }
    ShowGuideImg();
}

function ShowGuideImg() {
    var ix = 8;
    if ($(".shezhi_ul li").length == 3) {
        ix = 9
    }
    if (GuideIndex < 1) {
        GuideIndex = 1;
    } else if (GuideIndex > ix) {
        GuideIndex = ix;
    }

    $("#BtnGuidePrev").show();
    $("#BtnGuideNext").show();

    if (GuideIndex == 1) {
        $("#BtnGuidePrev").hide();
    } else if (GuideIndex == ix) {
        $("#BtnGuideNext").hide();
    }
    var GuideIndexTemp = 0;
    if (GuideIndex === 3 && customerInfo.BusinessType === "对公业务") {
        //GuideIndex = `3_1`
        GuideIndexTemp = `3_1`;
    }
    $("#buzhoutu").attr("src", `/Img/caozuozhiyin/caozuoyin${GuideIndexTemp ?GuideIndexTemp:GuideIndex}.png`);
}