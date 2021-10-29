$(function () {
    GetExamDetailResult();
    var intDiff = $("#Diff").val();
    var day = Math.floor(intDiff / (60 * 60 * 24));
    var hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
    var minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
    $("#minute").html("考试用时：" + minute + "min");
})


function itemtblist(tb) {
    var itemlist = [];
    debugger;
    if (tb != null && tb.length > 0) {
        console.log(tb);
        var LTask_Name = "";//对比任务
        var NO = 0//编号
        var showHtml = ""; //html标签
        var TotalLhaveScores = 0;//总分数
        for (i = 0; i < tb.length; i++) {
            if (tb[i]["TaskName"] != null && tb[i]["TaskName"] != undefined && tb[i]["TaskName"]!="") {
                NO++;
                showHtml += '<tr class="trs" id="tr_' + NO + '" data-Task_Name="' + tb[i]["TaskName"] + '">';
                showHtml += '<td>' + NO + '</td>';
                showHtml += '<td>' + tb[i]["TaskName"] + '</td>';
                showHtml += '<td class="text-left" data=Task_Name="' + tb[i]["TaskName"] + '">';

                var LSysNames = "";//替换业务
                var LfomNames = "";//替换页面 
                var htmls = "";
                var LDetailsId = "";
                var LhaveScores = 0;//分数
                htmls += '<p class="yewu_title">' + tb[i]["SysName"] + '</p>';
                if (tb[i]["SysDesc"] == "") {
                    htmls += '<p><strong>暂无做题记录</strong></p >';
                } else {
                    htmls += '<p><strong>' + tb[i]["SysDesc"] + '</strong></p >';
                }
                showHtml += htmls;
                showHtml += '</td>';
                showHtml += '<td><span class="text_green">' + tb[i]["Score"] + '</span></td>';
                showHtml += '</tr>';
            }
        }
        $("#tableContainer").html(showHtml);
        //var TotalItems = parseInt($("#TotalItems").val());
        //var Score = parseInt($("#Score").val());
        //$("#zzfs").html(TotalLhaveScores + "分");
        //var bfb = 0;
        //if (parseFloat(TotalLhaveScores) > 0 && parseFloat(Score) > 0) {
        //    var z = TotalLhaveScores / Score;
        //    bfb = z * 100;
    }
    //$("#zql").html(parseFloat(bfb).toFixed(2) + "%");
    else {
        $("#tableContainer").html('<tr><td colspan="5">您没有做题记录</td></tr>');
    }
}
function GetExamDetailResult() {
    var ExamId = $("#ExamId").val();
    var planId = $("#planId").val();
    var CustomerId = $("#CustomerId").val();
    var TaskID = $("#TaskID").val();
    //console.log(ExamId);
    $.ajax({
        Type: "post",
        dataType: "json",
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: '/ServiceRecord/GetExamDetailResult',
        data: { "TaskID": TaskID, "ExamId": ExamId },
        success: function (data) {
            var tb = data[0].Tasktb
            itemtblist(tb);
            return;
        }
    });
}