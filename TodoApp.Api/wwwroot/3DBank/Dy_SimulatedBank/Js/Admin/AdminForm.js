
/***************************************************************
  FileName:管理员端 公共js 提交javascript
  Copyright（c）2018-金融教育在线技术开发部
  Author:袁学
  Create Date:2018-06-21
 ******************************************************************/

$(document).ready(function () {
    var isDefault = getQueryString("isDefault");
    if (isDefault == 1) {
        GetQuery();
    }
    //为input添加特殊方式
    $(document).on("blur", "input", function (e) {
        if (e.target) {
            var ipt = e.target;
            var t = ipt.dataset.type
            var v = ipt.value;
            switch (t) {
                case '日':
                case '月':
                    if (v.length === 1 && v > 0) {
                        ipt.value = '0' + v;
                    }
                    break
            }
        }
    })
})


//重置
function FormReset() {
    $('#form1')[0].reset()

}

//查询
function GetQuery() {
    var FormId = $("#FormId").val();
    var TaskId = $("#TaskId").val();
    var CustomerId = $("#CustomerId").val();//客户id
    var data = { "FormId": FormId, "TaskId": TaskId, "CustomerId": CustomerId }//Id: Id,
    $.ajax({
        //几个参数需要注意一下
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "/Base/GetQueryThree",//url
        data: data,
        async: false,
        success: function (result) {

            if (result != null && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var FormItemStr = result[i]["FormItemStr"];
                    var SingleAnswer = result[i]["SingleAnswer"];
                    var type = $("input[name='" + FormItemStr + "']").attr("type");

                    if (type == "radio") {
                        $("input[name='" + FormItemStr + "']").each(function () {
                            if ($(this).val() == SingleAnswer) {
                                $(this)[0].checked = true;
                                return true;
                            }
                        })
                    }
                    else if (type == "checkbox") {
                        $("input[name='" + FormItemStr + "']").each(function () {
                            if ($(this).val() == SingleAnswer) {
                                $(this)[0].checked = true;
                            }
                        })
                    } else {
                        //$("#" + FormItemStr).val(SingleAnswer)
                        setDefaultValue(FormItemStr, SingleAnswer);
                    }
                }


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
                        if (trim(thisValue) == "") {
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


//提交 
function SubmitForm() {

    //现做校验
    if (checkFormJs()) {
        var data = $('#form1').serialize();
        var datacc = "";
        var datas = data.split('&');
        for (var i = 0; i < datas.length; i++) {
            var items = datas[i].split('=');
            if (items[0].startsWith("sle_")) {
                if (items[1] == "") {
                    datacc += items[0] + "=&";
                } else {
                    datacc += items[0] + "=" + $("#" + items[0] + " option:selected").text() + "&";
                }
            } else {
                datacc += items[0] + "=" + items[1] + "&";
            }
        }
        $.ajax({
            type: "POST",//方法类型
            dataType: "text",//预期服务器返回的数据类型
            url: "/Base/BackstagePreservation",//url
            data: datacc,
            async: false,
            success: function (result) {

                if (result == "1") {
                    layer.closeAll();//关闭所有弹出框

                    layer.msg('保存成功', { icon: 1, time: 1000 }, function () {
                        if (doSubmit && typeof (doSubmit) == "function") {
                            doSubmit();
                            return;
                        }
                    });

                }
                else if (result == "22") {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg('表单未配置', { icon: 2 });
                }
                else
                    if (result == "0") {
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

function setDefaultValue(id, value) {
    var type = document.getElementById(id).tagName;
    console.log(id + "->" + value + "->" + type);
    if (type == "SELECT") {      
        $("#" + id + " option:contains('" + value + "')").attr("selected", true);
    } else{
        $("#" + id).val(value);
    }
}

//获取环节5设定的表单结果
function GetFormSetResult() {

    var FormId = $("#FormId").val();
    var TaskId = $("#TaskId").val();
    var CustomerId = $("#CustomerId").val();//客户id

    if (FormId == "110301") {
        FormId = "110201"
    }
    else if (FormId == "110302") {
        FormId = "110202"
    }
    else if (FormId == "110303") {
        FormId = "110203"
    }
    else if (FormId == "110304") {
        FormId = "110204"
    }
    else if (FormId == "110305") {
        FormId = "110205"
    }
    else if (FormId == "110306") {
        FormId = "110206"
    }
    else if (FormId == "110307") {
        FormId = "110207"
    }
    else if (FormId == "110308") {
        FormId = "110208"
    }
    else if (FormId == "110309") {
        FormId = "110209"
    }
    else if (FormId == "110310") {
        FormId = "110210"
    }
    else if (FormId == "110311") {
        FormId = "110211"
    }
    else if (FormId == "110312") {
        FormId = "110212"
    }
    else {
        return;
    }

    var data = { "FormId": FormId, "TaskId": TaskId, "CustomerId": CustomerId }//Id: Id,
    $.ajax({
        //几个参数需要注意一下
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "/Base/GetQueryThree",//url
        data: data,
        async: false,
        success: function (result) {

            if (result != null && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var FormItemStr = result[i]["FormItemStr"];
                    var SingleAnswer = result[i]["SingleAnswer"];
                    var type = $("input[name='" + FormItemStr + "']").attr("type");

                    if (type == "radio") {
                        $("input[name='" + FormItemStr + "']").each(function () {
                            if ($(this).val() == SingleAnswer) {
                                $(this)[0].checked = true;
                                return true;
                            }
                        })
                    }
                    else if (type == "checkbox") {
                        $("input[name='" + FormItemStr + "']").each(function () {
                            if ($(this).val() == SingleAnswer) {
                                $(this)[0].checked = true;
                            }
                        })
                    } else {
                        //$("#" + FormItemStr).val(SingleAnswer)
                        setDefaultValue(FormItemStr, SingleAnswer);
                    }
                }


            }
        },
        error: function (result) {
            layer.closeAll();//关闭所有弹出框
            layer.msg(result, { icon: 2 });
        }
    });

}




