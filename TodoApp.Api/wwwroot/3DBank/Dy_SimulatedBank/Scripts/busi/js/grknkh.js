$(document).ready(function (e) {
    var myDate = new Date();
    var year = myDate.getFullYear().toString();
    var month = (myDate.getMonth() + 1).toString();
    if (parseInt(month) < 10) {
        month = "0" + month;
    }
    var day = myDate.getDate();
    if (parseInt(day) < 10) {
        day = "0" + day;
    }
    var dateTimeNow = year + month + day;
    $("#txt_cprq").val(dateTimeNow);

    $("#money_khje").blur(function () {
        var money = $("#money_khje").val();
        if (parseInt(money) < 200000) {
            $("#txt_zjhm1").removeAttr("vl-vl-regex");
            $("#sle_zjlx1").removeAttr("vl-disabled");
        }
    })
});

