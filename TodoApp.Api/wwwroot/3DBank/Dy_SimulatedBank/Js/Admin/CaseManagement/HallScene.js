


$(function () {

    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    InitEvent();

    //if (taskid != "0" && customerid != "0") {
    //    getScene(taskid, customerid);
    //}
})



function getScene() {
    var taskid = $("#taskid").val();
    var customerid = $("#customerid").val();
    var sceneid = 2;


    $.ajax({
        url: '/Admin/CaseManagement/GetSceneInfo',
        type: "POST",
        dataType: "json", cache: false,
        //contentType: "application/json; charset=utf-8",
        data: { "TaskId": taskid, "CustomerId": customerid, "SceneId": sceneid },
        success: function (data) {
            if (data.length > 0) {
                $("#Names_3,#Names_4,#Names_6,#Names_16,#Names_161,#Names_20").each(function () {
                    var LinkId = $(this).data("linkid");
                    for (var i = 0; i < data.length; i++) { 
                        var item = data[i];
                        if (item["Types"] != "1") continue;
                        if (item["LinkId"] == LinkId) {
                            if (LinkId == "161") {//checkbox 特殊处理
                                $(this).data("taskdetailid", item["ID"]);
                                $(this).iCheck('check');

                            } else {
                                $(this).data("taskdetailid", item["ID"]);
                                $(this).val(item["Answer"]);
                            }

                            if (LinkId == 16) {
                                $("#Names_16").select2();
                            }
                        }
                    }
                });
                
            }
        }
    });

}

function InitEvent()
{
    var taskid = $("#taskid").val();
    var customerid = $("#customerid").val();
    $('#Names_161').on('ifClicked', function (e) {
        var status = e.target.checked;
        status = !status;
        var LinkId = $(this).data("linkid");
        var TaskDetailId = $(this).data("taskdetailid");
        if (TaskDetailId == null) {
            TaskDetailId = "0";
        }
        var Types = 1;
        var OperationName = linkOperDict[LinkId];
        var Answer = status ?"送别完成":"";
        var data = {};
        data["TaskDetailId"] = TaskDetailId;
        data["TaskId"] = taskid;
        data["Customerid"] = customerid;
        data["LinkId"] = LinkId;
        data["Types"] = Types;
        data["OperationName"] = OperationName;
        data["Answer"] = Answer;

        if (Answer.length == 0) {
            $(this).data("taskdetailid", "0");
        }

        $.ajax({
            url: '/Admin/CaseManagement/AddOrEditTaskDetail',
            Type: "post",
            dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function (data) {
                
                //if (data > 0) {
                //    layer.msg('保存成功！', function () { });
                //}
                //else {
                //    layer.msg('保存失败！', function () { });
                //}
            }
        });
    });
    $("#Names_3,#Names_4,#Names_6,#Names_16,#Names_20").on("change", function () {
        var LinkId = $(this).data("linkid");
        var TaskDetailId = $(this).data("taskdetailid");
        if (TaskDetailId == null) {
            TaskDetailId = "0";
        }
        var Types = 1;
        var OperationName = linkOperDict[LinkId];
        var Answer = $(this).val();
        var data = {};
        data["TaskDetailId"] = TaskDetailId;
        data["TaskId"] = taskid;
        data["Customerid"] = customerid;
        data["LinkId"] = LinkId;
        data["Types"] = Types;
        data["OperationName"] = OperationName;
        data["Answer"] = Answer;

        if (Answer.length == 0) {
            $(this).data("taskdetailid", "0");
        }

        $.ajax({
            url: '/Admin/CaseManagement/AddOrEditTaskDetail',
            Type: "post",
            dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function (data) {
                
                //if (data > 0) {
                //    layer.msg('保存成功！', function () { });
                //}
                //else {
                //    layer.msg('保存失败！', function () { });
                //}
            }
        });

    });


}



//function BtnSubmit() {

//    var taskid = $("#taskid").val();
//    var customerid = $("#customerid").val();

//    var Names_3 = $("#Names_3").val();
//    var Names_4 = $("#Names_4").val();
//    var Names_6 = $("#Names_6").val();
//    var Names_16 = $("#Names_16").val();

//    var data = {};
//    data["TaskId"] = taskid;
//    data["Customerid"] = customerid;
//    data["Names_3"] = Names_3;
//    data["Names_4"] = Names_4;
//    data["Names_6"] = Names_6;
//    data["Names_16"] = Names_16;

//    $.ajax({
//        url: '/Admin/HallScene/SetHallScene',
//        Type: "post",
//        dataType: "json", cache: false,
//        contentType: "application/json; charset=utf-8",
//        data: data,
//        success: function (data) {
//            if (data > 0) {
//                layer.msg('保存成功！', function () { });
//            }
//            else {
//                layer.msg('保存失败！', function () { });
//            }
//        }
//    });

//}