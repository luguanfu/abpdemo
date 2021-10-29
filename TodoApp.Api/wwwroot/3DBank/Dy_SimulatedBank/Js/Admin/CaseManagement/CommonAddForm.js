



$(function () {

    getSelectOptions();
    getFormList();
    initAddFormEvent();

})

function getSelectOptions() {

    var selLen = $("select[data-modeid]").length;
    if (selLen == 0) {
        getScene();
    }

    var loadLen = 0;
    $("select[data-modeid]").each(function () {
        var modeid = $(this).data("modeid");
        var selobj = $(this);

        $.ajax({
            url: '/Admin/CaseManagement/GetCommonSelectOptions',
            Type: "post",
            dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            data: { "ModeId": modeid },
            success: function (data) {

                var idTextList = [];


                //var baseString = '<option value="{Value}">{Name}</option>';
                //var html = '';
                for (var i = 0; i < data.length; i++) {
                    var value = data[i]["value"];
                    var name = data[i]["name"];
                    idTextList.push({ id: value, text: name });
                    //html += baseString.format({
                    //    Value: value,
                    //    Name: name
                    //});
                }

                selobj.select2({
                    data: idTextList,
                    placeholder: '请选择',
                    allowClear: false
                })

                //selobj.append(html);

                loadLen++;
                if (loadLen == selLen) {
                    getScene();
                }
            }
        });
    });

}

function getFormList() {

    $("button[data-modeid]").each(function () {

        var selectid = $(this).data("selectid");
        var selobj = $("#" + selectid);
        var modeid = $(this).data("modeid");

        var taskid;
        var customerid;
        var types;

        taskid = $("#taskid").val();
        customerid = $("#customerid").val();
        types = modeid;

        switch (types) {
            case 1://开工
                customerid = -1;
                break;
            case 17://完工
                customerid = -2;
                break;
        }

        $.ajax({
            url: '/Admin/CaseManagement/GetCommonTaskFormRelation',
            Type: "post",
            dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            data: { "TaskId": taskid, CustomerId: customerid, LinkId: modeid },
            success: function (data) {

                for (var i = 0; i < data.length; i++) {
                    var formid = data[i]["TMNO"];
                    var formname = data[i]["TMName"];
                    var taskdetailid = data[i]["TaskDetailId"];

                    var addHtml = getAddFormHtml(formid, formname, types, taskdetailid);
                    selobj.before(addHtml);
                }

            }
        });


    })

}


function initAddFormEvent() {

    $("button[data-modeid]").click(function () {

        var clickBtn = this;
        var modeid = $(this).data("modeid");
        var selectid = $(this).data("selectid");
        var selobj = $("#" + selectid);
        var formid = selobj.val();
        var formname = selobj.find("option:selected").text();
        var alertString = $(this).data("alert");
        if (formid == "0" || formid == "") {
            layer.msg('请选择' + alertString + '！', function () { });
            return;
        }
        var hasForm = 0;
        $(this).prevAll("div").each(function () {
            if ($(this).data("formid") == formid) {

                hasForm = 1;
                return false;
            }
        })
        if (hasForm == 1) {
            layer.msg('已添加了该' + alertString + '！', function () { });
            return;
        }

        var taskid = $("#taskid").val();
        var customerid = $("#customerid").val();
        if (modeid == "1") customerid = -1;
        if (modeid == "17") customerid = -2;
        var data = {};
        data["TaskDetailId"] = "0";
        data["TaskId"] = taskid;
        data["Customerid"] = customerid;
        data["LinkId"] = modeid;
        data["Types"] = "2";
        data["OperationName"] = linkOperDict[modeid];
        data["Answer"] = ",";
        data["FormId"] = formid;




        $.ajax({
            url: '/Admin/CaseManagement/AddOrEditTaskDetail',
            Type: "post",
            dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function (result) {
                if (result == 1) {
                    var addHtml = getAddFormHtml(formid, formname, modeid, 0);
                    selobj.before(addHtml);
                    var formlist = [];
                    $(clickBtn).parent().find("div").each(function () {
                        if ($(this).data("formid") != null) {
                            formlist.push($(this).data("formid"));
                        }
                    })
                    console.log(formlist.join(","));
                    data["Answer"] = formlist.join(",");
                    updateFormListOperate(data);

                } else {
                    layer.msg('添加失败！', function () { });
                }
            }
        });

        return;

        //var addHtml = getAddFormHtml(formid, formname, modeid);
        //selobj.before(addHtml);




    });

}


function getAddFormHtml(formid, formname, types, taskdetailid) {
    //console.log(types);

    var baseString = '';
    types = Number(types);
    switch (types) {
        case 1:
        case 17:
            baseString = '<div class="m-b" data-taskdetailid="{TaskDetailId}" data-formid="{Formid}" data-formname="{Formname}" data-types="{Types}"><label style="width: 200px;">{Formname} </label>\
                    <button type = "button" class="btn  btn-success " onclick="EditForm(this)" >点击编辑业务办理界面</button >\
                    <button type = "button" class="btn  btn-success " onclick="EditDefualtValue(this)" >点击编辑业务内置数据界面</button >\
                    <button type="button" class="btn  btn-danger " onclick="DelForm(this)">删除</button>\
                    <button type="button" class="btn  btn-danger " onclick="DelDefaultvalue(this)">清除内置数据</button>\
                    <br /></div>'
            break;
        case 5:
            baseString = '<div class="m-b" data-taskdetailid="{TaskDetailId}" data-formid="{Formid}" data-formname="{Formname}" data-types="{Types}"><label style="width: 200px;">{Formname} </label>\
                    <button type = "button" class="btn  btn-success " onclick="EditForm(this)" >编辑单据</button >\
                    <button type = "button" class="btn  btn-warning " onclick="SetAnswer(this)" >标注答案</button >\
                    <button type="button" class="btn  btn-danger " onclick="DelForm(this)">删除</button>\
                    <br /></div>'
            break;
        case 8:
            baseString = '<div class="m-b" data-taskdetailid="{TaskDetailId}" data-formid="{Formid}" data-formname="{Formname}" data-types="{Types}"><label style="width: 200px;">{Formname} </label>\
                    <button type = "button" class="btn  btn-success " onclick="EditForm(this)" >编辑单据</button >\
                    <button type="button" class="btn  btn-danger " onclick="DelForm(this)">删除</button>\
                    <br /></div>'
            break;
        case 11:
            baseString = '<div class="m-b" data-taskdetailid="{TaskDetailId}" data-formid="{Formid}" data-formname="{Formname}" data-types="{Types}"><label style="width: 200px;">{Formname} </label>\
                    <button type = "button" class="btn  btn-success " onclick="EditForm(this)" >编辑单据</button >\
                    <button type = "button" class="btn  btn-warning " onclick="SetAnswer(this)" >标注答案</button >\
                    <button type="button" class="btn  btn-danger " onclick="DelForm(this)">删除</button>\
                    <br /></div>'
            break;
        case 12:
            baseString = '<div class="m-b" data-taskdetailid="{TaskDetailId}" data-formid="{Formid}" data-formname="{Formname}" data-types="{Types}"><label style="width: 200px;">{Formname} </label>\
                    <button type = "button" class="btn  btn-success " onclick="EditForm(this)" >点击编辑业务办理界面</button >\
                    <button type = "button" class="btn  btn-success " onclick="EditDefualtValue(this)" >点击编辑业务内置数据界面</button >\
                    <button type="button" class="btn  btn-danger " onclick="DelForm(this)">删除</button>\
                    <button type="button" class="btn  btn-danger " onclick="DelDefaultvalue(this)">清除内置数据</button>\
                 <button type="button" class="btn  btn-danger " onclick="Editscore(this)">设置分数</button>\
                    <br /></div>'
            break;
        case 14:
            baseString = '<div class="m-b" data-taskdetailid="{TaskDetailId}" data-formid="{Formid}" data-formname="{Formname}" data-types="{Types}"><label style="width: 200px;">{Formname} </label>\
                    <button type="button" class="btn  btn-danger " onclick="DelForm(this)">删除</button>\
                    <br /></div>'
            break;
        case 91:
            baseString = '<div class="m-b" data-taskdetailid="{TaskDetailId}" data-formid="{Formid}" data-formname="{Formname}" data-types="{Types}"><label style="width: 200px;">{Formname} </label>\
                    <button type = "button" class="btn  btn-success " onclick="EditForm(this)" >编辑资料（含设置核查结果）</button >\
                    <button type="button" class="btn  btn-danger " onclick="DelForm(this)">删除</button>\
                    <br /></div>'
            break;
        case 92:
            baseString = '<div class="m-b" data-taskdetailid="{TaskDetailId}" data-formid="{Formid}" data-formname="{Formname}" data-types="{Types}"><label style="width: 200px;">{Formname} </label>\
                    <button type = "button" class="btn  btn-success " onclick="EditForm(this)" >编辑资料</button >\
                    <button type="button" class="btn  btn-danger " onclick="DelForm(this)">删除</button>\
                    <br /></div>'
            break;
        case 13:
            baseString = '<div class="m-b" data-taskdetailid="{TaskDetailId}" data-formid="{Formid}" data-formname="{Formname}" data-types="{Types}"><label style="width: 200px;">{Formname} </label>\
                <button type = "button" class="btn  btn-success " onclick="EditForm(this)" >编辑单据内容</button >\
                <button type="button" class="btn  btn-danger " onclick="DelForm(this)">删除</button>\
                <br /></div>'
            break;
        case 133:
            baseString = '<div class="m-b" data-taskdetailid="{TaskDetailId}" data-formid="{Formid}" data-formname="{Formname}" data-types="{Types}"><label style="width: 200px;">{Formname} </label>\
                    <button type = "button" class="btn  btn-success " onclick="EditSeal(this)" >编辑盖章类型</button >\
                    <button type="button" class="btn  btn-danger " onclick="DelForm(this)">删除</button>\
                    <br /></div>'
            break;
        case 134:
            baseString = '<div class="m-b" data-taskdetailid="{TaskDetailId}" data-formid="{Formid}" data-formname="{Formname}" data-types="{Types}"><label style="width: 200px;">{Formname} </label>\
                    <button type="button" class="btn  btn-danger " onclick="DelForm(this)">删除</button>\
                    <br /></div>'
            break;

    }

    return baseString.format({
        Formname: formname,
        Formid: formid,
        Types: types,
        TaskDetailId: taskdetailid
    })
}

function EditForm(obj) {
    var taskid = $("#taskid").val();
    var formid = $(obj).parent().data("formid");
    var formname = $(obj).parent().data("formname");
    var types = $(obj).parent().data("types");
    var customerid = $("#customerid").val();

    switch (types) {
        case 1://开工
            customerid = -1;
            break;
        case 17://完工
            customerid = -2;
            break;
    }

    CheckTimeOut();
    var index = layer.open({
        type: 2,
        title: formid + "-" + formname,
        skin: 'layui-layer-lan', //样式类名
        shadeClose: true,
        shade: false,
        maxmin: true, //开启最大化最小化按钮
        area: ['1250px', '700px'],
        content: "/Admin/Ads_Form/ToForm?TaskId=" + taskid + "&CustomerId=" + customerid + "&Types=" + types + "&FormId=" + formid + "&isDefault=1",
        cancel: function () {

        }
    });



}


function EditDefualtValue(obj) {
    var taskid = $("#taskid").val();
    var formid = $(obj).parent().data("formid");
    var formname = $(obj).parent().data("formname");
    var types = $(obj).parent().data("types");
    var customerid = $("#customerid").val();

    switch (types) {
        case 1://开工
            customerid = -1;
            break;
        case 17://完工
            customerid = -2;
            break;
    }
    CheckTimeOut();
    var index = layer.open({
        type: 2,
        //btn: ['确定', '取消'],
        title: formid + "-" + formname,
        skin: 'layui-layer-lan', //样式类名
        shadeClose: true,
        shade: false,
        maxmin: true, //开启最大化最小化按钮
        area: ['1250px', '700px'],
        content: "/Admin/Ads_Form/ToForm?TaskId=" + taskid + "&CustomerId=" + customerid + "&Types=" + types + "&FormId=" + formid + "&isDefault=2",
        //yes: function () {
        //    alert("heiheihe");
        //}
        //cancel: function () {

        //}

    });



}


function DelDefaultvalue(obj) {
    var TaskId = $("#taskid").val();
    var formid = $(obj).parent().data("formid");

    $.ajax({
        type: "POST",
        dataType: "json",
        async: false,
        url: "/TMDefaultValue/DelDefaultvalue",
        data: { "TaskId": TaskId, "FormId": formid },
        success: function (result) {
            if (result == 1) {
                layer.msg("清除成功", function () {

                });
            }
            else if (result == 8) {
                layer.msg("未设置默认值");
            }
            else {
                layer.msg("清除失败");
            }
        }
    });

}

function DelForm(obj) {
    var taskid = $("#taskid").val();
    var formid = $(obj).parent().data("formid");
    var formname = $(obj).parent().data("formname");
    var types = $(obj).parent().data("types");
    var customerid = $("#customerid").val();

    switch (types) {
        case 1://开工
            customerid = -1;
            break;
        case 17://完工
            customerid = -2;
            break;
    }

    var data = {};
    data["TaskDetailId"] = $(obj).parent().data("taskdetailid");
    data["TaskId"] = taskid;
    data["CustomerId"] = customerid;
    data["LinkId"] = types;
    data["Types"] = "2";
    data["FormId"] = formid;
    data["OperationName"] = linkOperDict[types];
    data["Answer"] = "";



    $.ajax({
        url: '/Admin/CaseManagement/AddOrEditTaskDetail',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: data,
        success: function (result) {
            if (result == 1) {
                var formlist = [];
                $(obj).parent().parent().find("div").each(function () {
                    if ($(this).data("formid") != null) {
                        formlist.push($(this).data("formid"));
                    }
                })
                $(obj).parent().remove();
                var findindex = $.inArray(formid, formlist);
                if (findindex > -1) {
                    formlist.splice(findindex, 1);
                }

                console.log(formlist.join(","));
                data["Answer"] = formlist.join(",");
                updateFormListOperate(data, 2);
            }
        }
    });




}

function SetAnswer(obj) {
    var taskid = $("#taskid").val();
    var formid = $(obj).parent().data("formid");
    var formname = $(obj).parent().data("formname");
    var types = $(obj).parent().data("types");
    var customerid = $("#customerid").val();

    CheckTimeOut();

    var index = layer.open({
        type: 2,
        title: formname,
        skin: 'layui-layer-lan', //样式类名
        shadeClose: true,
        shade: false,
        maxmin: true, //开启最大化最小化按钮
        area: ['1250px', '700px'],
        content: "/Admin/ABZ_Form/Form_" + formid + "?TaskId=" + taskid + "&CustomerId=" + customerid + "&Types=" + types + "&FormId=" + formid,
        cancel: function () {

        }
    });
}

function EditSeal(obj) {

    var taskid = $("#taskid").val();
    var formid = $(obj).parent().data("formid");
    var formname = $(obj).parent().data("formname");
    var types = $(obj).parent().data("types");
    var customerid = $("#customerid").val();

    $("input[name='SealCheck']:checkbox").each(function () {
        $(this).iCheck('uncheck');
    });

    var data = {};
    data["TaskId"] = taskid;
    data["CustomerId"] = customerid;
    data["Types"] = types;
    data["FormId"] = formid;
    $.ajax({
        url: '/Admin/CaseManagement/GetTaskFormSeal',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: data,
        success: function (data) {
            if (data.length > 0) {
                $("#TaskDetailIdSeal").val(data[0]["ID"])
                var GaiZhangStr = data[0]["Answer"];
                if (GaiZhangStr != null) {
                    var arr = GaiZhangStr.split(',');
                    for (var i = 0; i < arr.length; i++) {
                        $("input[name='SealCheck']:checkbox").each(function () {
                            if ($(this).val() == arr[i]) {
                                $(this).iCheck('check');
                            }
                        });
                    }
                }
            }
        }
    });



    layer.open({
        title: '编辑盖章类型',
        btn: ['确定', '取消'],
        area: ['550px', '500px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#EditSeal"),
        yes: function (index, layero) {
            var gaizhangStr = '';
            $("input[name='SealCheck']:checkbox").each(function () {
                if (true == $(this).is(':checked')) {
                    gaizhangStr += $(this).val() + ",";
                }
            });
            if (gaizhangStr.substr(gaizhangStr.length - 1) == ',') {
                gaizhangStr = gaizhangStr.substr(0, gaizhangStr.length - 1);
            }
            if (gaizhangStr == "") {
                gaizhangStr = ",";//防止后台删除特殊处理 后台认为答案是空就是删除
            }
            var data = {};


            data["TaskDetailId"] = $("#TaskDetailIdSeal").val();
            data["TaskId"] = taskid;
            data["Customerid"] = customerid;
            data["LinkId"] = types;
            data["Types"] = 2;
            data["OperationName"] = linkOperDict[types];;
            data["Answer"] = gaizhangStr;
            data["FormId"] = formid;

            $.ajax({
                url: '/Admin/CaseManagement/AddOrEditTaskDetail',
                Type: "post",
                dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                data: data,
                success: function (data) {
                    if (data > 0) {
                        layer.msg('保存成功！', function () { });
                    }
                    else {
                        layer.msg('保存失败！', function () { });
                    }
                    layer.close(index);
                }
            });

        },
        btn2: function (index, layero) {
            layer.close(index);
        },
        cancel: function (index, layero) {
        }
    });
}


function updateFormListOperate(data, t) {


    if (!formListOperDict.hasOwnProperty(data["LinkId"])) return;

    data["Types"] = "1";
    if (data["LinkId"] != "5") {
        data["FormId"] = "";
    } else {
        if (t) {
            data["Answer"] = "";
        } else {
            data["Answer"] = ",";
        }

    }
    data["OperationName"] = formListOperDict[data["LinkId"]];
    $.ajax({
        url: '/Admin/CaseManagement/AddOrEditTaskDetail',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: data,
        success: function (data) {
        }
    });

}