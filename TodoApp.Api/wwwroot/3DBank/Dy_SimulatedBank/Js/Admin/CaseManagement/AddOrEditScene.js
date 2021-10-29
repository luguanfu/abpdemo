

$(function () {
    //var taskid = $("#taskid").val();
    //if (taskid != "0") {
    //    getScene(taskid);
    //}

    //富文本编辑
    $('.summernote').summernote({
        lang: 'zh-CN',
        //height: 150,
        maxHeight: 200,
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']]
        ]
    });

    $('.note-editable').blur(function () {
        SetEditTextInfo(this);
    });

    $("#FileName").change(function () {
        ImportOperManual();
    });


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

function getScene() {
    var taskid = $("#taskid").val();
    $.ajax({
        url: '/Admin/CaseManagement/GetTaskSceneById',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "taskid": taskid },
        success: function (data) {
            if (data.length > 0) {
                //StartScene,HallScene,CounterScene,EndScene 
                //var StartScene = data[0]["StartScene"];
                //var HallScene = data[0]["HallScene"];
                //var CounterScene = data[0]["CounterScene"];
                //var EndScene = data[0]["EndScene"];

                var StartScene = 2;
                var HallScene = 2;
                var CounterScene = 2;
                var EndScene =2;

                $("input[name='StartScene'][value='" + StartScene + "']").iCheck('check');
                $("input[name='HallScene'][value='" + HallScene + "']").iCheck('check');
                $("input[name='CounterScene'][value='" + CounterScene + "']").iCheck('check');
                $("input[name='EndScene'][value='" + EndScene + "']").iCheck('check');

                $('#TaskDescribe').code(HTMLDecode(data[0]["TaskDescribe"]));
                $('#TaskImportant').code(HTMLDecode(data[0]["TaskImportant"]));
                $("#OperManualName").html(data[0]["OperManualName"]);

            }

        },
        complete: function () {
            initEvent();
        }
    });

}

function initEvent() {
    $("input:radio").on('ifChecked', function (event) {
        var name = $(this).attr("name");
        var value = $(this).val();

        var data = {};
        var taskid = $("#taskid").val();
        data["taskid"] = taskid;
        data[name] = value;

        $.ajax({
            url: '/Admin/CaseManagement/AddOrEditTaskScene',
            Type: "POST",
            dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function (data) {

            }
        });

    });
}




function SetEditTextInfo(obj) {
    var editObj = $(obj).parent().prev();

    var name = editObj.attr("name");
    var value = HTMLEncode(editObj.code());

    var TaskId = $("#taskid").val();


    $.ajax({
        url: '/Admin/CaseManagement/SetEditTextInfo',
        type: "POST",
        dataType: "json", cache: false,
        //contentType: "application/json; charset=utf-8",
        data: { "TaskId": TaskId, "FieldName": name, "FieldValue": value },
        success: function (data) {
            if (data > 0) {

            }
            else {
                layer.msg('保存失败！', function () { });
            }
        }
    });


}


function ImportOperManual() {

    var docObj = document.getElementById("FileName");

    //上传文件校验只能是excel
    if (docObj.files && docObj.files[0]) {
        var f = docObj.files;
        var exltype = f[0].name;//获取文件名
        var exp = /.pdf$|.PDF$/;
        if (exp.exec(exltype) == null) {
            layer.msg('上传格式错误（仅支持.pdf文件）', { icon: 2 });
            return;
        }
    }
    else {
        layer.msg('请选择上传文件！', function () { });
        return;
    }

    $("#OperManualName").html($("#FileName").val());

    var TaskId = $("#taskid").val();
    var formData = new FormData();
    formData.append("FormFiles", document.getElementById("FileName").files[0]);
    //提交
    $.ajax({
        type: "POST",
        //dataType: "json",
        url: '/Admin/CaseManagement/UploadFile?TaskId=' + TaskId,
        data: formData,
        processData: false,  // 不处理数据
        contentType: false,   // 不设置内容类型
        success: function (data) {
            if (data == "1") {//正常结束
                layer.msg('操作成功', { icon: 1 });
            }
            else {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });

}
