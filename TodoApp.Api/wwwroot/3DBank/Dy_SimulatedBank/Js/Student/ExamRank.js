$(function () {
    GetExamInfo();

    $("#btn_search").click(function () {
        GetExamInfo();
    })
})
function GetExamInfo() {
    var rankid = $("#rankid").val();
    var stu = $("#stu").val();
    $.ajax({
        Type: "POST",
        dataType: "json",
        url: "/ExamineRank/GetExamInfo1",
        async: false,
        data: { "rankid": rankid, "stu": stu },
        success: function (data) {
            $("#rank").html(data);
        }
    })
}