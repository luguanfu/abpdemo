//富文本编辑器API
$(document).ready(function () {

    $('.summernote').summernote({
        lang: 'zh-CN',
        //height: 150,
        maxHeight: 200,
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']]
        ]
    });

});

$(function () {
    var taskid = $("#taskid").val();

    if (taskid != "0") {
        getInfo(taskid);
    }

    redload();

})


function redload() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
    //全选checkbox
    var $checkboxAll = $(".checkbox-all"),
        $checkbox = $(".new_table").find("[type='checkbox']").not("[disabled]"),
        length = $checkbox.length,
        i = 0;
    $checkboxAll.on("ifClicked", function (event) {
        if (event.target.checked) {
            $checkbox.iCheck('uncheck');
            i = 0;
        } else {
            $checkbox.iCheck('check');
            i = length;
        }
    });
}


function getInfo(taskid) {

    $.ajax({
        url: '/Admin/CaseManagement/GetTaskInfoById',
        Type: "POST",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "taskid": taskid},
        success: function (data) {
            if (data.length > 0) {
                $("#TaskName").val(data[0]["TaskName"]);
                $('#TaskDescribe').code(HTMLDecode(data[0]["TaskDescribe"]));
                $('#TaskImportant').code(HTMLDecode(data[0]["TaskImportant"]));
                $('#TaskExplain').code(HTMLDecode(data[0]["TaskExplain"]));

                $("input[name='IsAccessibility']:radio").each(function () {
                    if ($(this).val() == data[0]["IsAccessibility"]) {
                        $(this).iCheck('check');
                    } else {
                        $(this).iCheck('uncheck');
                    }
                });
            }
        }
    });

}

function BtnSubmit()
{
    
    var taskid = $("#taskid").val();
    var TaskName = $("#TaskName").val();
    if (TaskName.length == 0) {
        layer.msg('请输入案例名称！', function () { });
        return;
    }

    var IsAccessibility = "0";
    $("input[name='IsAccessibility']:radio").each(function () {
        if (true == $(this).is(':checked')) {
            IsAccessibility = $(this).val();
        }
    });
    if (IsAccessibility == "0") {
        layer.msg('请选择能力项开启或关闭！', function () { });
        return;
    }

    var TaskDescribe = HTMLEncode($('#TaskDescribe').code());
    var TaskImportant = HTMLEncode($('#TaskImportant').code());
    var TaskExplain = HTMLEncode($('#TaskExplain').code());

    $.ajax({
        url: '/Admin/CaseManagement/AddOrEditTaskInfo',
        Type: "POST",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "taskid": taskid, "TaskName": TaskName, "IsAccessibility":IsAccessibility, "TaskDescribe": TaskDescribe, "TaskImportant": TaskImportant, "TaskExplain": TaskExplain},
        success: function (data) {
            if (data > 0) {
                layer.msg('保存成功！', function () { });
                if (taskid == 0) {
                    window.location.href = "/Admin/CaseManagement/AddOrEdit?addtype=" + 1 + "&operscene=" + 1 + "&taskid=" + data;
                }
            }
            else if (data == -77) {
                layer.msg('案例名已存在！', function () { });
            }
            else{
                layer.msg('保存失败！', function () { });
            }
        }
    });

}