$(function () {
    getEmpowerInfo();
});



//编辑授权
function addMoreDefaultValue() {
    var FormId = $("#FormId").val();
    var TaskId = $("#TaskId").val();
    var values = "";


    $.each($('input:checkbox:checked'), function () {
        values += $(this).attr('id')+","; 
    });

    values = values.substring(0, values.length - 1);
    $.ajax({
        type: "POST",
        dataType: "json",
        async: false,
        url: "/admin/TMDefaultValue/EditEmpower",
        data: { "TaskId": TaskId, "EValue": values, "TMNO": FormId },
        success: function (result) {
            if (result > 0) {
                layer.msg("添加成功", function () {
                    parent.location.reload();
                    //layer.closeAll();//关闭所有弹出框
                    //window.location.href = '/Admin/taskshow' + "/?id=" + id + "&ComplexPlan_Id=" + ComplexPlan_Id + "&p_page=1";
                });
            } else {
                layer.msg("添加失败");
            }
        }
    });

}

function getEmpowerInfo() {
    var FormId = $("#FormId").val();
    $.ajax({
        type: "POST",
        dataType: "json",
        async: false,
        url: "/admin/TMDefaultValue/getEmpowerValuesInfo",
        data: {"TMNO": FormId },
        success: function (result) {
            var empower = result[0]["EValue"];
            if (empower.length > 0) {
                var empowerList = empower.split(',');
                for (var i = 0; i < empowerList.length; i++) {
                    var cbId = empowerList[i];
                    cbId = "#" + cbId;
                    $(cbId).attr("checked", "checked");
                }
            }
        }
    });
}