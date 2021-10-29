
var nextAction = null;

var endBgSrc = "";
function playVideo(linkId, action) {

    nextAction = action;

    $("#bj").hide();
    $(".btn_class").hide();
    $("#flash").show();

    var xingxiang = getXingxiangByAppearance();//形象区分
    var guitai = getGuitaiByBusiness();//柜面区分 高柜低柜

    var src = "";
    endBgSrc = "";

    if (linkId == 1) {
        //src = `/flash/${xingxiang}/scene01-3-1.mp4`;
    }
    else if (linkId == 2) {
        src = `/flash/${xingxiang}/scene02-1-1.mp4`;
        endBgSrc = `/flash/${xingxiang}/end02-1-1.jpg`;
    }
    else if (linkId == 4) {
        src = `/flash/${xingxiang}/scene04-3-1.mp4`;
        endBgSrc = `/flash/${xingxiang}/end04-3-1.jpg`;
    }
    else if (linkId == 501) {
        src = `/flash/${xingxiang}/scene05-2-1.mp4`;
        endBgSrc = `/flash/${xingxiang}/end05-2-1.jpg`;
    }
    else if (linkId == 503) {
        src = `/flash/${xingxiang}/scene05-3-1.mp4`;
        endBgSrc = `/flash/${xingxiang}/end05-3-1.jpg`;
    }
    else if (linkId == 6) {
        src = `/flash/${xingxiang}/scene06-3-1.mp4`;
        endBgSrc = `/flash/${xingxiang}/end06-3-1.jpg`;
        if (guitai == 2) {
            src = `/flash/${xingxiang}/scene06-3-2.mp4`;
            endBgSrc = `/flash/${xingxiang}/end06-3-2.jpg`;
        }
    }
    else if (linkId == 7) {
        src = `/flash/${xingxiang}/scene07-1-1.mp4`;
        endBgSrc = `/flash/${xingxiang}/end07-1-1.jpg`;
        if (guitai == 2) {
            src = `/flash/${xingxiang}/scene07-1-2.mp4`;
            endBgSrc = `/flash/${xingxiang}/end07-1-2.jpg`;
        }
    }
    else if (linkId == 8) {
        src = `/flash/${xingxiang}/scene08-2-1.mp4`;
        endBgSrc = `/flash/${xingxiang}/end08-2-1.jpg`;
        if (guitai == 2) {
            src = `/flash/${xingxiang}/scene08-2-2.mp4`;
            endBgSrc = `/flash/${xingxiang}/end08-2-2.jpg`;
        }
    }
    else if (linkId == 15) {
        src = `/flash/${xingxiang}/scene15-3-1.mp4`;
        endBgSrc = `/flash/${xingxiang}/end15-3-1.jpg`;
        if (guitai == 2) {
            src = `/flash/${xingxiang}/scene15-3-2.mp4`;
            endBgSrc = `/flash/${xingxiang}/end15-3-2.jpg`;
        }
    }

    var setdonghua = localStorage.getItem("setdonghua");
    if (setdonghua == 0) {
        src = "";
    }

    if (src == "") {
        showImg();
    } else {
        $("#flash").empty().append('<source src = "/flash/tiandan.mp4" type = "video/mp4">');
        document.getElementById("flash").src = src;
        document.getElementById("flash").pause();
        flashPlay();
    }

    if (endBgSrc != "") {
        $('#bj').attr('src', endBgSrc);
    }

    closeAskIma();
   
}

function flashPlay() {
    document.getElementById("flash").play().then((data) => {
        console.log(data)
    }).catch((data) => {
        $("#flash").click();
        console.log(data)
        setTimeout(flashPlay, 1000);
    });
}

function showImg() {
    
    $("#bj").show();
    $(".btn_class").show();
    $("#flash").hide();

    if (nextAction != null) {
        nextAction();
    }

}



function getXingxiangByAppearance() {
    if (customerInfo == null) return 0;
    var appearance = customerInfo.Appearance;
    if (appearance == "青年男子") {
        return 1;
    }
    if (appearance == "青年女子") {
        return 2;
    }
    if (appearance == "中年男子") {
        return 3;
    }
    if (appearance == "中年女子") {
        return 4;
    }
    if (appearance == "老年男子") {
        return 5;
    }
    if (appearance == "老年女子") {
        return 6;
    }
    if (appearance == "外国男子") {
        return 7;
    }
    if (appearance == "外国女子") {
        return 8;
    }
    return 1;
}

function getGuitaiByBusiness() {
    if (customerInfo == null) return 1;
    var BusinessType = customerInfo.BusinessType;
    if (BusinessType == "零售业务" || customerInfo.BusinessName==="单位活期存款" ) {
        return 1;
    }
    if (BusinessType == "对公业务") {
        return 2;
    }

    return 1;
}

