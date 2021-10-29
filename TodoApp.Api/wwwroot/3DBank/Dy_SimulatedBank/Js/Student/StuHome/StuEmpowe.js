$(function () {
    getEmpoweList();
});

function getEmpoweList() {
    var TMNO = "080710";
    $.ajax({
        url: '/FormList/GetkEmpoveList',
        Type: "post",
        dataType: "json", cache: false,
        data: { "TMNO": TMNO},
        contentType: "application/json; charset=utf-8",
        success: function (tb) {
            console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
            console.log(tb);
            console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");

        }
    });
}
