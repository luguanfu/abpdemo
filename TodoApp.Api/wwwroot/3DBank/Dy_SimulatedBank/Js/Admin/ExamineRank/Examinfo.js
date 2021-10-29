$(function () {
    bindData();
})
function bindData() {
    var id = $("#ModeId").val();
    var eid = $("#eid").val();
    $.ajax({
        url: '/Admin/ExamineRank/GetRangDataById',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "id": id, "eid": eid },
        success: function (tb) {
            $("#e_name").text(tb[0]["PracticeName"]);
            $("#start_time").text(tb[0]["start_time"]);
            $("#end_time").text(tb[0]["end_time"]);
            //$("#score").text(tb[0]["Score"]);
            //$("#pass_src").text(tb[0]["PassingScore"]);
            var score = toDecimal2(tb[0]["ToScore"]);
            $("#score").text(score);
            $("#pass_src").text(toDecimal2(score*0.6));
            //$("#AbilityandScore").text(tb[0]["AbilityandScore"]);
            $("#pass_p").text(tb[0]["qualified_p"]);
            $("#pass_rate").text(tb[0]["pass_rate"]);
            $("#max_src").text(tb[0]["max_src"]);
        }
    });
}


function toDecimal2(x) {
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    if (s == null || s == "") {
        s = '0.00';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}