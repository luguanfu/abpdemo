$(function () {
    bindIngfo();
});


var descby = "Scores desc";
var d1by = "Scores desc";
var d2by = "tiTime desc";
//分数排序
function ResultDesc() {
    if (d1by == "Scores desc") {
        d1by = "Scores asc";
    } else {
        d1by = "Scores desc";
    }
    descby = d1by;
    bindIngfo();
}
var allcs = 1;
//时间排序
function TimeDesc() {

    if (d2by == "tiTime desc") {
        d2by = "tiTime asc";
    } else {
        d2by = "tiTime desc";
    }
    descby = d2by;
    bindIngfo();

}

//列表数据加载
function bindIngfo(page) {

    var stuinfo = $("#stuinfo").val();
    var PageSize = 10;
    var PracticeId = getQueryString('PracticeId');
    var AllType = getQueryString('AllType');
    $.ajax({
        url: '/Admin/PersonalTrainingEnd/GetListStudentInfo',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "descby": descby, "stuinfo": stuinfo, "page": page, "PageSize": PageSize, "AllType": AllType, "PracticeId": PracticeId},
        success: function (tb) {

            var html = '';
            var data = tb.Tb;//转换table
            for (var i = 0; i < data.length; i++) {
                html += '<tr>';

                html += '<td><span class="pie">' + data[i]["pm"] + '</span></td>';
                html += '<td><span class="pie">' + data[i]["LoginNo"] + '</span></td>';
                html += '<td><span class="pie">' + data[i]["Name"] + '</span></td>';
                html += '<td><span class="pie">' + data[i]["CollegeName"] + '</span></td>';
                html += '<td><span class="pie">' + data[i]["MajorName"] + '</span></td>';
                html += '<td><span class="pie">' + data[i]["ClassName"] + '</span></td>';


                html += '<td><span class="pie">' + data[i]["Scores"] + '</span></td>';

                var tiTime = data[i]["tiTime"] + "";
                if (tiTime == "null") {
                    html += '<td><span class="pie">---</span></td>';
                } else {
                    html += '<td><span class="pie">' + tiTime.substr(0, 19).replace('T', ' ') + '</span></td>';
                }
                html += '<td><span class="pie">' + setAnswerTime(data[i]["diffTime"]) + '</span></td>';
                html += '<td><a  href="javascript:void(0);"onclick="seturl(' + data[i]["Userid"] + ',' + PracticeId + ',' + AllType+')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>查看成绩 </a></td>'; 
                html += '</tr>';
            }

            $("#tablelist").html(html);

            bootstrapPaginator("#PaginatorLibrary", tb, bindIngfo);//分页
            //样式重新加载
            redload();
        }
    });
}
function setAnswerTime(diffTime) {
    var second = diffTime % 60;
    var mins = parseInt(diffTime / 60);
    var hour = 0;
    if (mins >= 60) {
        hour = parseInt(mins / 60);
        mins = mins % 60;
    }
    var result = "";
    if (hour >= 10) {
        result += hour + "：";
    } else {
        result += "0" + hour + "：";
    }
    if (mins >= 10) {
        result += mins + "：";
    } else {
        result += "0" + mins + "：";
    }
    if (second >= 10) {
        result += second;
    } else {
        result += "0" + second;
    }
    return result;
}

//查看成绩
function seturl(UserID,PracticeId, AllType) {

    window.location.href = '/Admin/PersonalTrainingEnd/ScoreManagement?UserID=' + UserID+'&PracticeId=' + PracticeId + '&AllType=' + getQueryString("AllType");
}

//搜索
function searchinfo() {

    bindIngfo();

}

//成绩导出
function ExportExamResult() {
    var stuinfo = $("#stuinfo").val();
    var PracticeId = getQueryString('PracticeId');
    var AllType = getQueryString('AllType');
    $.ajax({
        Type: "post",
        dataType: "json",
        url: '/Admin/PersonalTrainingEnd/ExportExamResult',
        data: { "descby": descby, "stuinfo": stuinfo, "AllType": AllType, "PracticeId": PracticeId},
        async: false,
        success: function (data) {

            $("#downFile").attr("href", "/Ashx/download.ashx?downurl=" + data[0]["filename"]);
            $("#tf").click();
        }
    });
}
