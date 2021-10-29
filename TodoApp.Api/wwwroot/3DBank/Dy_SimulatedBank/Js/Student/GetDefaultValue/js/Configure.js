
function OK_btn(FormId) {
    $("#FormId").val(FormId);
    $(".btnnewpeizhi").attr("href", "/hy_index/newindex/?formid=" + FormId);
    $(".btnedpeizhi").attr("href", "/hy_index/newedindex/?template=2&formid=" + FormId);
    $("#d1").hide();
    $("#d2").show();
    $.ajax({
        cache: true,
        type: "POST",
        dataType: "json",
        url: '/Configure/TMName',
        data: { FormId: FormId },
        async: false,
        success: function (tb) {
            $("#TMName").html(tb);
            redload();
            DataBind();
        }
    });
}

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

$("#Query").click(function () {
    DataBind();
});

function DataBind(page) {
    var titleName = $("#titleName").val();
    var PageSize = 10;
    $.ajax({
        cache: true,
        type: "POST",
        dataType: "json",
        url: '/Configure/DataBind',
        data: { FormId: $("#FormId").val(), page: page, PageSize: PageSize, titleName: titleName },
        async: false,
        success: function (tb) {
            var html = ""
            var data = tb.Tb;//转换table
            for (var i = 0; i < data.length; i++) {
                //当前页面
                var idx = 0;
                if (page != "undefined" && page != null) {
                    idx = page;
                    idx = idx - 1;
                }
                var input_value = data[i]["ControlType"];
                if (input_value == "1") { input_value = "文本框"; }
                if (input_value == "2") { input_value = "下拉框"; }
                if (input_value == "3") { input_value = "单选框"; }
                if (input_value == "4") { input_value = "复选框"; }
                if (input_value == "5") { input_value = "隐藏域"; }
                if (input_value == "6") { input_value = "日期框"; }
                if (input_value == "7") { input_value = "密码框"; }
                if (input_value == "8") { input_value = "表格列"; }
                if (input_value == "9") { input_value = "标签"; }
                if (input_value == "10") { input_value = "表格按钮"; }
                if (input_value == "11") { input_value = "自动生成"; }
                var tl = data[i]["Title"]
                if (tl.length >= "15") {
                    tl = tl.substr(0, 14) + ".....";
                }
                html += "  <tr><td width='50'><span>" + ((idx * PageSize) + i + 1) + "</span></td><td width='80'><input type='checkbox' value='" + data[i]["ID"] + "' class='i-checks' name='inputs'></td>";
                html += " <td><span>" + $("#FormId").val() + "</span></td> <td><span>" + data[i]["LineNumber"] + "</span></td> <td><span >" + data[i]["MergeCell"] + "</span></td> <td title='" + data[i]["Title"] + "'>" + tl + "</td> <td>" + input_value + "</td> <td>" + data[i]["ControlName"] + "</td></tr>";
                bootstrapPaginator("#PaginatorLibrary", tb, DataBind);//分页
            }
            $("#table").html(html);
            redload()
        }
    });
}

function DataBindGui(Id) {
    $.ajax({
        cache: true,
        type: "POST",
        dataType: "json",
        url: '/Configure/DataBindGui',
        data: { Id: Id },
        async: false,
        success: function (data) {
            $("#table_Gui").html(data);
            redload();
        }
    });
}

//新增按钮
function addclick() {
    $("#signupForm").show();
    FormRest();
    //$('#signupForm')[0].reset();//清空表单数据
    layer.open({
        type: 1,
        title: "配置",
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //不显示关闭按钮
        //shift: 3,
        area: ['650px', '500px'], //宽高
        shadeClose: false,//开启遮罩关闭
        content: $("#signupForm"),
        end: function () {
            layer.closeAll();//关闭所有弹出层
        }
    });
    $("#newid").val(1);
}

function editclick() {
    var chks = document.getElementsByName('inputs');//name
    var chkstr = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
        }
    }
    if (chkstr == "") {
        layer.msg('请先选中一行！', function () { });
        return false;
    }
    if (chkstr.split(',').length >= 3) {
        layer.msg('只能选中一行！', function () { });
        return false;
    }
    addclick();
    $("#newid").val(2);
    EdtiData(chkstr.replace(",", ""))
}

function EdtiData(Id) {
    $("#Id").val(Id);
    $.ajax({
        cache: true,
        type: "POST",
        dataType: "json",
        url: '/Configure/EdtiData',
        data: { Id: Id },
        async: false,
        success: function (data) {
            if (data.length > 0) {
                $("#Title").val(data[0]["Title"]);
                $("#ControlName").val(data[0]["ControlName"]);
                $("#DefaultValue").val(data[0]["DefaultValue"]);
                $("#ControlType").val(data[0]["ControlType"]);
                $("#Position").val(data[0]["Position"]);
                $("#IfMust").val(data[0]["IfMust"]);
                $("#FieldType").val(data[0]["FieldType"]);
                $("#ControlKey").val(data[0]["ControlKey"]);
                $("#Idx").val(data[0]["Idx"]);
                $("#LineNumber").val(data[0]["LineNumber"]);
                $("#MergeCell").val(data[0]["MergeCell"]);
                $("#FieldLength").val(data[0]["FieldLength"]);
                $("#PromptId").val(data[0]["PromptId"]);
            }
        }
    });
}

function delclick() {
    var chks = document.getElementsByName('inputs');//name
    var chkstr = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
        }
    }
    chkstr += "0";
    layer.confirm("您确定要删除所选的配置数据吗？", {
        title: '删除',
        btn: ['确定', '取消'],
        shadeClose: true, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
     function () {
         $.ajax({
             cache: true,
             type: "POST",
             dataType: "json",
             url: '/Configure/DelData',
             data: { Id: chkstr },
             async: false,
             success: function (data) {
                 if (data > 0) {
                     layer.msg('操作成功！', { icon: 6 });
                     DataBind();
                 } else {
                     layer.msg('操作失败！', { icon: 2 });
                 }
             }
         });
     });
}

function check() {
    var Title = $("#Title").val();
    var ControlName = $("#ControlName").val();
    var ControlType = $("#ControlType").val();
    var ControlKey = $("#ControlKey").val();
    var PromptId = $("#PromptId").val();
    if (Title == "") {
        layer.msg('标题为必填项！', function () { });
        return false;
    }
    if (ControlName == "") {
        layer.msg('控件名称为必填项！', function () { });
        return false;
    }
    if (ControlType == "2") {
        if (ControlKey == "") {
            layer.msg('关联字典项为必填项！', function () { });
            return false;
        }
    }
    if (MergeCell < "6") {
        layer.msg('不能输入大于6的正整数！', function () { });
        return false;
    }
    var Line = 0;
    var name = 0;
    $.ajax({
        cache: true,
        type: "POST",
        url: '/Configure/Configure_check',
        data: { LineNumber: $("#LineNumber").val(), FormId: $("#FormId").val() },
        async: false,
        success: function (data) {
            Line = parseInt(data);
        }
    });

    $.ajax({
        cache: true,
        type: "POST",
        url: '/Configure/Configure_checktwo',
        data: { ControlName: $("#ControlName").val(), FormId: $("#FormId").val(), newid: $("#newid").val(), Id: $("#Id").val(), ControlType: $("#ControlType").val() },
        async: false,
        success: function (data) {
            name = parseInt(data);
        }
    });
    if (Line <= "6") {
        layer.msg('此行中单元格已满,请修改行号！', function () { });
        return false;
    }
    if (name > "0") {
        layer.msg('控件名称不能重复！', function () { });
        return false;
    }

    if ($("#IfMust").val() == "2" && (ControlType == "1" || ControlType == "2" ||
        ControlType == "3" || ControlType == "4" || ControlType == "6")) {//如果是必填 且 是控件类型
        //提示信息Id为必填
        if (PromptId.length==0) {
            layer.msg('必填的控件类型必须填写提示信息Id！', function () { });
            return false;
        }
    }
    return true;
}

function Save() {
    if (check()) {
        $.ajax({
            cache: true,
            type: "POST",
            url: '/Configure/Configure_Save',
            data: $('#signupForm').serialize(), newid: newid,
            async: false,
            success: function (data) {
                if (data > 0) {
                    FormRest();

                    if ($("#newid").val() == "2") {
                        //修改
                        layer.msg('操作成功！', { icon: 6, time: 500 }, function () {
                            layer.closeAll();//关闭所有弹出框
                        });


                    } else {
                        layer.msg('操作成功！', { icon: 6 });//新增
                    }
                    DataBind();
                } else {
                    layer.msg('操作失败！', { icon: 2 });
                }
            }
        });
    }
}

function GeneratingTable() {
    $.ajax({
        cache: true,
        type: "POST",
        url: '/Configure/GeneratingTable',
        data: { FormId: $("#FormId").val() },
        async: false,
        success: function (data) {
            if (data == "999") {
                layer.msg('操作失败，已生成表！', { icon: 2 });
            } else {
                layer.msg('操作成功！', { icon: 6 });
            }
        }
    });
}

function DelTable() {
    $.ajax({
        cache: true,
        type: "POST",
        url: '/Configure/DelTable',
        data: { FormId: $("#FormId").val() },
        async: false,
        success: function (data) {
            if (data == "999") {
                layer.msg('操作失败，尚未生成表！', { icon: 2 });
            } else {
                layer.msg('操作成功！', { icon: 6 });
            }
        }
    });
}

function FormRest() {
    $("#Title").val("");
    $("#ControlName").val("");
    $("#DefaultValue").val("");
    $("#ControlKey").val("");
    $("#Idx").val("1");
    $("#LineNumber").val("1");
    $("#MergeCell").val("1");
    $("#FieldLength").val("100");
    $("#PromptId").val("");
}

function InspectionRule() {
    var chkstr_gui = "";
    var chks = document.getElementsByName('inputs');//name
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr_gui += chks[i].value + ",";
        }
    }
    if (chkstr_gui == "") {
        layer.msg('请先选中一行！', function () { });
        return false;
    }
    if (chkstr_gui.split(',').length >= 3) {
        layer.msg('只能选中一行！', function () { });
        chkstr_gui = "";
        return false;
    }
    chkstr_gui += "0";
    $("#Guize").show();
    layer.open({
        type: 1,
        title: "添加规则",
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //不显示关闭按钮
        //shift: 3,
        area: ['500px', '500px'], //宽高
        shadeClose: false,//开启遮罩关闭
        content: $("#Guize"),
        end: function () {
            layer.closeAll();//关闭所有弹出层
        }
    });
    DataBindGui(chkstr_gui);
}

function Save_Gui() {
    var chkstr_guitwo = "";
    var chks = document.getElementsByName('inputs');//name
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr_guitwo += chks[i].value + ",";
        }
    }
    chkstr_guitwo += "0";
    var chks = document.getElementsByName('gui[]');//name
    var guize = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            guize += chks[i].value + ",";
        }
    }
    guize += "0";
    $.ajax({
        cache: true,
        type: "POST",
        url: '/Configure/Save_Gui',
        data: { Id: chkstr_guitwo, AssociationRules: guize },
        async: false,
        success: function (data) {
            if (data > 0) {
                layer.msg('操作成功！', { icon: 6 });
            } else {
                layer.msg('操作失败！', { icon: 2 });
            }
        }
    });
}

function GeneratedFile() {
    $.ajax({
        cache: true,
        type: "POST",
        url: '/Configure/GeneratedFile',
        data: { FormId: $("#FormId").val() },
        async: false,
        success: function (data) {
            if (data == "99") {
                layer.msg('读取文件错误！', { icon: 2 });
            } else if (data == "88") {
                layer.msg('无法将文件写入！', { icon: 2 });
            } else {
                layer.msg('静态页面生成成功！位置存放：！/FromHtml', { icon: 6 });
                window.open('/FromHtml/Form_' + $("#FormId").val() + '.html');
            }
        }
    });
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}