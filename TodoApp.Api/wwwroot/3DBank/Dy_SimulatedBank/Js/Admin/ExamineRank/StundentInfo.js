$(function () {
    loadPage();
})
function loadPage(page) {
    var name = $("#ExamineName").val();
    var id = $("#ModeId").val();
    var eid = $("#eid").val();
    var type = $("#type").val();
    var PageSize = 10;
    $.ajax({
        url: '/Admin/ExamineRank/GetStudent',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "id": id, "eid": eid, "name": name, "page": page, "PageSize": PageSize, "type": type },
        success: function (tb) {
            var html = '';
            var data = tb.Tb;//转换table
            for (var i = 0; i < data.length; i++) {
                html += '<tr>';
                //当前页面
                var idx = 0;
                if (page != "undefined" && page != null) {
                    idx = page;
                    idx = idx - 1;
                }
                //html += '<td>' + data[i]["rownum"] + '</td>';
                html += '<td><span class="pie">' + ((idx * PageSize) + i + 1) + '</span></td>';
                html += '<td>' + data[i]["StudentNo"] + '</td>';

                html += '<td>' + data[i]["Name"] + '</td>';
                html += '<td>' + data[i]["CollegeName"] + '</td>';
                html += '<td>' + data[i]["MajorName"] + '</td>';
                html += '<td>' + data[i]["ClassName"] + '</td>';
                html += '<td>' + data[i]["ER_Score"] + '</td>';
                html += '<td>' + data[i]["start_time"] + '</td>';

                html += '</tr>';

            }

            $("#tablelist").html(html);

            bootstrapPaginator("#PaginatorLibrary", tb, loadPage);//分页

            //样式重新加载
            redload();

        }
    });
}
function exportInfo(page) {
    var name = $("#ExamineName").val();
    var id = $("#ModeId").val();
    var eid = $("#eid").val();
    var type = $("#type").val();
    var PageSize = 10000;
    $.ajax({
        url: '/Admin/ExamineRank/Export',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "id": id, "eid": eid, "name": name, "page": page, "PageSize": PageSize, "type": type },
        success: function (data) {

            $("#downFile").attr("href", "/Ashx/download.ashx?downurl=" + data[0]["filename"]);
            $("#tf").click();
        }
    });
}