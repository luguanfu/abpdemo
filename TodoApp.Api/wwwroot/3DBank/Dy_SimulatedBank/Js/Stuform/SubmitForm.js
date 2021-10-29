///
/*已弃用*/
///

/***************************************************************
  FileName:学生端 公共js 提交javascript
  Copyright（c）2018-金融教育在线技术开发部
  Author:袁学
  Create Date:2018-05-15
 ******************************************************************/

$(document).ready(function () {
    $.ajaxSetup({ cache: false });
    redload();
    GetQuery();
})


//重置
function FormReset() {
    $('#form1')[0].reset()
    redload();
}

//查询
function GetQuery() {
    $.ajaxSetup({ cache: false });
    var FormId = $("#FormId").val();
    var ExamId = $("#ExamId").val();
    var TasKId = $("#TasKId").val();
    var TRId = $("#TRId").val();
    var data = { FormId: FormId, ExamId: ExamId, TasKId: TasKId, TRId: TRId }//Id: Id,
    $.ajax({
        //几个参数需要注意一下
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "/Base/GetQuery",//url
        data: data,
        async: false,
        cache:false,
        success: function (result) {
            if (result != null && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var FormItemStr = result[i]["FormItemStr"];
                    var StudentAnswer = result[i]["StudentAnswer"];
                    var type = $("input[name='" + FormItemStr + "']").attr("type");
                    //var select = $("select[name='" + FormItemStr + "']");
                    if (type == "radio") {
                        $("input[name='" + FormItemStr + "']").each(function () {
                            if ($(this).val() == StudentAnswer) {
                                $(this)[0].checked = true;
                                return true;
                            }
                        })
                    }
                    else if (type == "checkbox") {
                        $("input[name='" + FormItemStr + "']").each(function () {
                            if ($(this).val() == StudentAnswer) {
                                $(this)[0].checked = true;
                            }
                        })
                    } else {
                        $("#" + FormItemStr).val(StudentAnswer)
                    }
                }
                redload();


            }
        },
        error: function (result) {
            layer.closeAll();//关闭所有弹出框
            layer.msg(result, { icon: 2 });
        }
    });
}

//校验 必填
function checkFormJs() {
    var result = 0;
    $.ajax({
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "/Base/ISRequired",//url
        data: { "FormId": $("#FormId").val() },
        async: false,
        success: function (data) {

            if (data.length > 0) {
                result = 0;
                for (var i = 0; i < data.length; i++) {
                    //列
                    var FormItemStr = data[i]["ControlName"];
                    //类型
                    var type = $("input[name='" + FormItemStr + "']").attr("type");

                    if (type == "radio") {
                        //单选框
                        var thisValue = $("input[name='" + FormItemStr + "']:checked").val()
                        if (thisValue == null || thisValue == undefined) {
                            result = 1;
                            layer.msg(data[i]["Title"] + '为必选项');
                            break;
                        }
                    }
                    else if (type == "checkbox") {
                        //复选框
                        var thisValue = "";
                        $("input[name='" + FormItemStr + "']").each(function () {
                            if ($(this)[0].checked) {
                                thisValue = "1";
                            }
                        })

                        if (thisValue == "") {
                            result = 1;
                            layer.msg(data[i]["Title"] + '为必选项');
                            break;
                        }

                    } else {

                        var thisValue = $("#" + FormItemStr).val();
                        //输入框
                        if (thisValue!=null && thisValue!="undefined" && trim(thisValue) == "") {
                            result = 1;
                            layer.msg(data[i]["Title"] + '为必填项');
                            break;
                        }
                    }
                }

            } else {
                result = 0;
            }

        }
    });

    if (result == 0) {
        return true;
    } else {
        return false;
    }
}


//提交 xType 类型 
function SubmitForm() {
    $.ajaxSetup({ cache: false });
    var ModeId = $("#ModeId").val();
    var FormId = $("#FormId").val();
    var ExamId = $("#ExamId").val();
    var TasKId = $("#TasKId").val();
    var TRId = $("#TRId").val();
    //现做校验
    if (checkFormJs()) {

        $.ajax({
            type: "POST",//方法类型
            dataType: "text",//预期服务器返回的数据类型
            url: "/Base/Submission",//url
            data: $('#form1').serialize(),
            async: true,
            cache:false,
            success: function (result) {
                //个人实训和团队实训
                if (result == "1") {
                    layer.closeAll();//关闭所有弹出框

                    layer.msg('保存成功', { icon: 1, time: 900 }, function () {
                    window.location.reload();
      
                     // window.location.href = '/Bsi_' + xFormId + '?TRId=' + TRId + '&TasKId=' + TasKId + '&ExamId=' + ExamId + '&FormId=' + xFormId + '&ModeId=' + ModeId;
 
                    });

                }
                else if (result == "0") {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg('保存失败', { icon: 2 });
                } else {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg(result, { icon: 2 });
                }
            },
            error: function (result) {
                layer.closeAll();//关闭所有弹出框
                layer.msg(result, { icon: 2 });
            }
        });

    }
}


