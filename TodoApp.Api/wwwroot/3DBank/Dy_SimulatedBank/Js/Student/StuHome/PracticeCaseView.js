
/**************************************************
 * 自由练习 内页
 * 
 * 
 * 
 * *************/

//搜索
function serchinfoCase() {
    GetCaseViewList(null);
}

//获得（个人练习/团队练习）数据列表
function GetCaseViewList(page) {

    var PageSize = 6;
    var type = $("#PracticeType").val();//个人/团队练习类型
    var role = $("#Role").val();//角色（组员/组长）
  
    $.ajax({
        url: '/FreePractice/CaseList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "SearchName": $("#SearchName1").val(), "PracticeType": type },
        success: function (tb) {

            var html = '';
            var data = tb.Tb;//转换table
            $("#personalCaseList").html("");
          
            for (var i = 0; i < data.length; i++) {

                html += ' <div class="shuju_line">'
                html += '<label class="xzlx_k1">' + data[i]["TaskName"] + '</label>'
                html += ' <label class="xzlx_k2 shuju_lv">' + (data[i]["scores"] == ("" || null) ? '-' : data[i]["scores"]) + '</label>'
                html += '<label class="xzlx_k3">'
        
                if (type == 1) { //个人练习
                    html += ' <a href="#" onclick="AddFreePractice(' + data[i]["ID"] + ',' + data[i]["TaskId"] + ')">开始练习</a>'

                } else {//团队练习
                    if (role == "1") {
                        html += ' <a href="#" onclick="ShowAllocationOfPosts(' + data[i]["ID"] + ',' + data[i]["TaskId"] + ')")">开始练习</a>'
                     } else {
                          html += ' <a href="#" class="disableds">开始练习</a>'
                    }
                }

                html += '</label>'
                html += '</div>'

            }
            
            $("#personalCaseList").html(html);
            bootstrapPaginator("#personalCasePageList", tb, GetCaseViewList);//分页

        }
    });
}

//搜索
function serchinfoCaseView() {
    GetCaseViewList();
}
var gwfpIndex;
//分配岗位弹窗
function ShowAllocationOfPosts(examId, taskId) {
    
    $("#form1")[0].reset();

    GetGroupingMembers();

    $("#examId").val(examId);
    $("#taskId").val(taskId);

    gwfpIndex=layer.open({
        title: false,
        //btn: ['确定', '取消'],
        area: ['600px', '500px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: false,  //显示关闭按钮
        anim: 2,
        shade: 0.8,
        skin: 'layer-gonggao',  //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#ShowContent")
        
    });
}

// 实训考核
$(".ms_sxkh_gb").on("click", function () {
    layer.close(layer.index)
})

//获得下拉分组成员列表
function GetGroupingMembers() {

    $.ajax({
        url: '/FreePractice/GetGroupingMembers',
        type: 'POST',
        async: false,
        success: function (data) {
            $("select[name='studentName']").html("");
            var json = JSON.parse(data);
            var html = "<option value=\"\">请选择</option>";
            for (var i = 0; i < json.length; i++) {
                html += "<option value=\"" + json[i].UserId + "\">" + json[i].Name + "</option>";
            }
            $("select[name='studentName']").append(html);
        }
    });

}

//分配岗位
function AllocationOfPosts() {

    var examId = $("#examId").val();
    var taskId = $("#taskId").val();

    var stu1 = $("#stu1 option:selected").val();
    var stu2 = $("#stu2 option:selected").val();
    var stu3 = $("#stu3 option:selected").val();
    if (stu1 == "" || stu2 == "" || stu3 == "") {
        layer.msg("请选择岗位对应的成员");
        return;
    }

    var str1 = "";
    var str2 = "";
    $("#tablelist2 tbody tr:gt(0)").each(function () {
        var posts = $(this).find("td:eq(0)").text();//从0 开始
        var stuId = $(this).find("td:eq(1)").find("select[name='studentName'] option:selected").val();
        str1 += posts + ",";
        str2 += stuId + ",";
    });
    str1 = str1.substr(0, str1.length - 1);
    str2 = str2.substr(0, str2.length - 1);

    $.ajax({
        url: '/FreePractice/AllocationOfPosts',
        type: 'POST',
        data: { "ExamId": examId, "TasKId": taskId, "StudentId": str2, "PositionName": str1, "Type_All": "2" },
        async: false,
        dataType: "text",
        success: function (data) {
            if (parseInt(data) > 0) {
                layer.close(gwfpIndex);
                window.open("/StuHome/StudentHome?TotalResultId=" + data + "&TaskId=" + taskId);
            }
            else {
                if (data == "-66") {
                    layer.msg('角色分配必须包含小组长', { icon: 2 });
                }
                else {
                    layer.msg('操作失败', { icon: 2 });
                    return;
                }
            }
        }
    });
}

//开始练习记录成绩表
function AddFreePractice(ID, TaskId) {

    $.ajax({
        url: '/FreePractice/Add',
        type: 'POST',
        data: { "ExamId": ID, "Type_All": "2" },
        async: false,
        success: function (data) {
            if (parseInt(data) > 0) {
                //成绩id +任务id
                window.open("/StuHome/StudentHome?TotalResultId=" + data + "&TaskId=" + TaskId);

            }
            else {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}