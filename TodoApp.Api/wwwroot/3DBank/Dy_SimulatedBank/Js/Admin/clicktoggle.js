/*************
 * 表单 标准 环节伍设置
 * 2019.08.08 程序猿设置
 */
$(function () {
    GetQuery();//反显数据
    //全部设为只读
    $("#form1 [type='text'],textarea,select,[type='checkbox']").each(function () {
        $(this).attr("readonly", "readonly");
    })
   
   
    $("#form1 [type='text'],textarea,select,[type='checkbox']").on("click", function (e) {
        e.preventDefault()
        var id = e.target.dataset.id;
        if (!id) {
            layer.msg("这个空没有设置！");
        } else {
            if ($(this).data("needamend") == "1") {
                $(this).data("needamend", "0");
                $(this).removeClass("danclick");
            } else {
                $(this).data("needamend", "1");
                $(this).addClass("danclick");
            }
            //只有复选框 控制选选
            if ($(this).attr("type") == "checkbox") {
                this.checked = !this.checked;
            }
        }
		
       
      
    })

    //第一要反显
    var FormId = $("#FormId").val();
    var TaskId = $("#TaskId").val();
    var CustomerId = $("#CustomerId").val();//客户id

    $.ajax({
        //几个参数需要注意一下
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: '/Admin/Abz_Form/GetTaskFilInTheBill',
        data: {"FormId": FormId, "TaskId": TaskId, "CustomerId": CustomerId },
        async: false,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                $("#" + data[i]["ControlName"]).data("needamend", "1");
                $("#" + data[i]["ControlName"]).addClass("danclick");
            }
        }
    });
	
})
function updateTagging(id, t) {
    
    $.ajax({
        //几个参数需要注意一下
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: '/Admin/Abz_Form/editKeyAnswer',
        data: { "ID": id, "Tagging": t },
        async: false,
        success: function (data) {
            if (data == "1") {
                if (t == 1) {
                    layer.msg("标注成功")
                } else {
                    layer.msg("取消成功")
                }
            } else {
                layer.msg("标注失败")
            }
        }
    });
}
//第二要保存
function btnSubmit() {
    var txtid = "";//id字符串
    var TarggingId = [];//标注的id
    //遍历查 标注的id 拼接字符串
    $("#form1 [type='text'],textarea,select,[type='checkbox']").each(function () {
        if ($(this).data("needamend") == "1") {
            txtid += $(this).attr("id") + ",";
            TarggingId.push(this.dataset.id);
        }
    });
    //第一要反显
    var FormId = $("#FormId").val();
    var TaskId = $("#TaskId").val();
    var CustomerId = $("#CustomerId").val();//客户id
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Admin/Abz_Form/AddTaskFilInTheBill',
        data: {
            "TaskId": TaskId, "CustomerId": CustomerId, "FormId": FormId, "txtid": txtid, "TarggingId": TarggingId.join(",")
        },
        success: function (data) {
            if (data == "1") {
                layer.msg('操作成功', { icon: 1 }, function () {
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index);
                });

            } else {
                layer.msg('操作失败', { icon: 2 });
                return;

            }
        }
    });
}

//第三要重置
function btnReset() {
    $("#form1 [type='text'],textarea,select,[type='checkbox']").each(function () {
        $(this).data("needamend", "0");
        $(this).removeClass("danclick");
    });
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
                    $("input[name='" + FormItemStr + "']").attr("data-id", result[i]["ID"]);
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
                        $("#" + FormItemStr).val(SingleAnswer)
                        $("#" + FormItemStr).attr("data-id", result[i]["ID"]);
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