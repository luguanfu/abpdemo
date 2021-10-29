//初始化
$(function () {
    var type = getQueryString("PracticeType");
    if (type == 1) {
        $("#mapMessage").text("个人实训考核");
        $("#role").hide();
    } else {
        $("#mapMessage").text("团队实训考核");
        $("#role").show();
    }
    GetPersonalExercises();
});

function GetPersonalExercises(page) {

    var PageSize = 10;

    var type = getQueryString("PracticeType");

    $.ajax({
        url: '/PracticeAssessment/CaseEndList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "PracticeType": type, "ID": getQueryString("ID") },
        success: function (tb) {

            var html = '';
            var data = tb.Tb;//转换table

            var ZongF = data.length
            if (ZongF > 0 || ZongF != undefined) {

                $("#ZongF").text(ZongF * 100);

                $("#JiG").text((ZongF * 100) * 0.6)
            }
            else {
                $("#ZongF").text(0);

                $("#JiG").text(0)
            }

            html += '<tr>'

            html += '  <th width="330">案例名称</th>'
            if (type == "2") { //如果是团队练习
                html += '  <th width="330">我的角色</th>'
            }
            html += '  <th width="330">最近一次保存时间</th>'
            html += '  <th width="330">最终得分</th>'
            //html += ' <th width="800">操作</th>'
            html += '</tr>'
            for (var i = 0; i < data.length; i++) {

                html += '<tr>';
                html += '<td>' + data[i]["TaskName"] + '</td>';

                if (type == 2) { //如果是团队练习

                    if (data[i]["PositionName"] == null || data[i]["PositionName"] == "null") {
                        html += '<td>-</td>';
                    } else {
                        html += '<td>' + data[i]["PositionName"] + '</td>';
                    }
                }
                html += '<td>' + (data[i]["UpdateTime"] == ("" || null) ? '-' : new Date(data[i]["UpdateTime"]).Format("yyyy-MM-dd HH:mm")) + '</td>';
                var Score = data[i]["Scores"] + "";
              
                if (Score == "null") {
                    html += '<td><span class="pie">---</span></td>';
                } else {
                    html += '<td>' + data[i]["Scores"] + '</td>';
                }
                //html += '<td><a  href="javascript:void(0);"onclick="seturl(' + data[i]["TRID"] + ',' + data[i]["TaskId"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>案例成绩</a></td>';
                html += '</tr>';

                html += '</tr>';
            }

            $("#tablelist").html(html);
            bootstrapPaginator("#PaginatorLibrary", tb, GetPersonalExercises);//分页

        }
    });
}


function seturl(TotalResultId, TaskId, ) {

    window.open('/PracticeResult/Index?TotalResultId=' + TotalResultId + '&TaskId=' + TaskId);
}
