var linkId;


function setLinkId(_linkId) {
    if (_linkId == linkId) {
        return;
    }
    $("#LinkId").val(_linkId);
    linkId = _linkId;
    showjindutiao(linkId);
}

$(function () {
    setLinkId($("#LinkId").val());
    $("#manyidu").html(sessionStorage.getItem("manyidu"));
    if (typeof OpenGuide !== undefined && $("#zhiyincao").css("display") === "none") {
        setTimeout(function () { OpenGuide() }, 300)
    }


    //播放客户走进银行 warning
    //playVideo(1,null);

})

