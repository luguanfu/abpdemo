function selectScene(obj) {
    var taskid = $("#taskid").val();
    var addtype = $("#addtype").val();
    var operscene = $(obj).val();

    if (addtype == "1" && $("#taskid").val() == "0") { //新增
        
        layer.msg("请先保存案例基本信息", { icon: 8, time: 800 });
        return;
        
    } else { //修改
        if (operscene == "1" || operscene == "2") {
            location.href = "/Admin/CaseManagement/AddOrEdit?addtype=" + addtype + "&operscene=" + operscene + "&taskid=" + taskid;
        }
        else if (operscene == "3") {
            location.href = "/Admin/Customer/Index?addtype=" + addtype + "&operscene=" + operscene + "&taskid=" + taskid;
        }
        else if (operscene == "4") {
            location.href = "/Admin/AbilityScoreSet/Index?addtype=" + addtype + "&operscene=" + operscene + "&taskid=" + taskid;
        }
        
        
    }

    
}
