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
        type: "POST",
        dataType: "json",
        url: "/ExamRanking/GetExamInfo",
        async: false,
        data: { "rankid": rankid, "stu": stu },
        success: function (data) {
            $("#three_map").addClass("display","none");
            $("#rank").html(data);
        }
    })
}