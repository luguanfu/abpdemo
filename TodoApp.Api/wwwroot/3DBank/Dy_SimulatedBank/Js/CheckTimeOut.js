

$(function () {
    //开启复制粘贴功能
    //$("input").attr("oncopy", "return true").attr("onpaste", "return true").attr("oncut", "return true").attr("autocomplete", "off")
})

function CheckTimeOut(){

    $.ajax({
        url: '/ServiceRecord/CheckTimeOut',
        type: "POST",
        dataType: "json",
        async: false,
        cache: false,
        success: function (data) {
            if (data == 1) {
                window.location.reload();
            }
        }
    });

}

