$(function () {
    GetList();
})

//加载进行中列表
function GetList() {
    $.ajax({
        url: '/StuRecentlearning/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: {},
        success: function (data) {
            var html = '';
            var TtoSpace = "";//替换为空格
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    html += '<div class="col-sm-3">';
                    html += '<div class="kecheng_map" onclick="Event(' + data[i]["CurriculumID"] + ',' + data[i]["Cstate"] + ')">';
                    html += '<img src="' + data[i]["Cover"] + '" />';
                    html += '<div class="kecheng_text">';
                    html += '<p class="kecheng_name">' + data[i]["CurriculumName"] + '</p>'
                    html += '<p class="zj_text m-t-xs">章名称：' + data[i]["CResourcesName"] + '</p>'
                    html += '<p class="zj_text m-t-xs">节名称：' + data[i]["SectionName"] + '</p>'
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                }
                $("#tablelist").html(html);
                //样式重新加载
                redload();
            } else {
                $("#chart-course").show();
                $("#chart-course").html('<img src="/Img/noshuju.png" style="align-content"/>');
            }
        }
    });
}
//跳转页面
function Event(ID, Cstate) {
    if (Cstate == 0) {
        layer.msg('该课件已下架');
        return;
    } else {
        window.location.href = "/TheoreticalKnowledge/Details?CurriculumID=" + ID;
    }

}