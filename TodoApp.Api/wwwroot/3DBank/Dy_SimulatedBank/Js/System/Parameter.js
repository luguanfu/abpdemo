/***************************************************************
  FileName:参数管理   javascript
  Copyright（c）2018-金融教育在线技术开发部
  Author:袁学
  Create Date:2018-5-9
 ******************************************************************/

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
    ///////////////////////////////////////////
    //tr 添加css 鼠标手势样式
    $("#tablelist tr").bind('mouseover', function () {
        $(this).css('cursor', 'pointer');
    });

    //绑定列表 行选中事件
    $("#tablelist tr").click(function () {
        $("#tablelist tr").removeClass('trSelected');//去除所有样式
        $(this).addClass('trSelected');//为当前行添加样式

        $("#tablelist tr").find('input').iCheck('uncheck');//去掉所有复选框选中
        $(this).find('input').iCheck('check');//为当前复选框添加选中

        //右边table列表数据改变
        selectId = $(this).find('input').val();
       
        rightBindInfo();

        rowsall = parseInt($(this).find('td').eq(0).html()) - 1;
        allclassname = $(this).find('td').eq(2).html();
        $("#totxtClass_Code").val($(this).find('td').eq(3).html());
        rowsall = rowsall % 10;
    });

    $("#tablelist tr").eq(rowsall).click();

}



var selectId = 0;
$(function () {
    bindIngfo();

});
var allpage = 0;
var rowsall = 0;
var allclassname = "";
//左边列表数据加载
function bindIngfo(page) {

    var PageSize = 10;
    allpage = page;
    $.ajax({
        Type: "post",
        dataType: "json",
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: '/Sys_Validation/GetList',
        data: { "page": page, "PageSize": PageSize, "DicName": $("#txtSearch").val() },
        success: function (tb) {
            var html = '';
            var data = tb.Tb;//转换table
            if (tb != null && tb.Total != 0) {//table数据不为空
                for (var i = 0; i < data.length; i++) {
                    html += '<tr>';

                    //当前页面
                    var idx = 0;
                    if (page != "undefined" && page != null) {
                        idx = page;
                        idx = idx - 1;
                    }

                    html += '<td  width="50">' + ((idx * PageSize) + i + 1) + '</td>';
                    html += '<td  width="80"><input type="checkbox"  disabled="disabled" class="i-checks" name="input[]" value="' + data[i]["ID"] + '"></td>';
                    html += '<td>' + data[i]["Class_Name"] + '</td>';
                    html += '<td>' + data[i]["Class_Code"] + '</td>';
                    html += '<td><span class="pie">' + (data[i]["Is_System"] == "1" ? "是" : "否") + '</span></td>';

                    html += '</tr>';
                }
            }
            $("#tablelist").html(html);
            //分页控件加载
            bootstrapPaginator("#PaginatorLibrary", tb, bindIngfo);//分页
            //样式重新加载
            redload();
        }
    });
}


//右边列表数据加载
function rightBindInfo(page) {
    var PageSize = 10;
    var Dic_ClassId = selectId;
   
    $.ajax({
        Type: "post",
        dataType: "json",
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: '/Sys_Validation/GetListTo',
        data: { "page": page, "PageSize": PageSize, "Dic_ClassId": Dic_ClassId },
        success: function (tb) {
            var html = '';
            var data = tb.Tb;//转换table
            if (tb != null && tb.Total != 0) {//table数据不为空
                for (var i = 0; i < data.length; i++) {
                    html += '<tr>';

                    //当前页面
                    var idx = 0;
                    if (page != "undefined" && page != null) {
                        idx = page;
                        idx = idx - 1;
                    }
                    html += '<td  width="50"><span class="pie">' + ((idx * PageSize) + i + 1) + '</span></td>';
                    html += '<td  width="80"><input type="checkbox" class="i-checks" name="inputTo[]" value="' + data[i]["ID"] + '"></td>';
                    html += '<td><span class="pie">' + data[i]["Dic_Name"] + '</span></td>';
                    html += '<td><span class="pie">' + data[i]["Dic_Value"] + '</span></td>';
                    html += '</tr>';
                }
            }
            $("#tablelistTo").html(html);
            //分页控件加载
            bootstrapPaginator("#PaginatorLibrary2", tb, rightBindInfo);//分页
            //样式重新加载
            $('.i-checks').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            });


            var $checkboxAllTo = $(".checkbox-allTo"),
                $checkboxTo = $(".new_tableTo").find("[type='checkbox']").not("[disabled]"),
                lengthTo = $checkboxTo.length,
                iTo = 0;
            $checkboxAllTo.on("ifClicked", function (event) {
                if (event.target.checked) {
                    $checkboxTo.iCheck('uncheck');
                    iTo = 0;
                } else {
                    $checkboxTo.iCheck('check');
                    iTo = lengthTo;
                }
            });

        }
    });
}


///////////////////////////////////左边列表数据操作////////////////////////////////////

//新增弹框
function AddInfo() {
    FormRest();
    layer.open({
        type: 1,
        title: '新增',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['450px', '260px'], //宽高
        content: $("#Add")
    });

}

//新增取消
function FormRest() {
    layer.closeAll();//关闭
    $('#Addform')[0].reset();//清空表单数据

    $('input[name="rdoIs_System"]').iCheck('uncheck');
    $('#Is_SystemB').iCheck('check');
}

//新增保存
function BtnSubim() {

    var txtClass_Name = $("#txtClass_Name").val();
    var txtClass_Code = $("#txtClass_Code").val();
    var txtIs_System = $('input[name="rdoIs_System"]:checked').val();
    if (txtClass_Name.length == 0) {
        layer.msg('请输入类型名称！', function () { });
        return;
    }
    if (txtClass_Code.length == 0) {
        layer.msg('请输入编码！', function () { });
        return;
    }

    //表单提交
    $("#Addform").ajaxSubmit({
        type: "post",
        url: '/Sys_Validation/Add?txtIs_System=' + txtIs_System,
        data: $("#Addform").serialize(),
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                bindIngfo(allpage);
                layer.msg('操作成功', { icon: 1 });
            }

            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}


var MId = 0;
//编辑
function EditInfo() {
    EditFormRest();
    layer.open({
        type: 1,
        title: '编辑',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['450px', '260px'], //宽高
        content: $("#Edit")
    });

    GetListById(selectId);
    MId = selectId;
}

//编辑时信息读取
function GetListById(Id) {
    $.ajax({
        Type: "post",
        dataType: "json",
        url: '/Sys_Validation/GetListById?Id=' + Id,
        async: false,
        success: function (data) {
            if (data.length > 0) {

                $("#txtEditClass_Name").val(data[0]["Class_Name"]);
                $("#txtEditClass_Code").val(data[0]["Class_Code"]);

                if (data[0]["Is_System"] == "1") {
                    $('#EditIs_SystemA').iCheck('check');
                }
                else {
                    $('#EditIs_SystemB').iCheck('check');
                }

            }
        }
    });
}

//编辑 保存
function EditBtnSubim() {
    var txtClass_Name = $("#txtEditClass_Name").val();
    var txtClass_Code = $("#txtEditClass_Code").val();
    var txtIs_System = $('input[name="rdoEditIs_System"]:checked').val();
    if (txtClass_Name.length == 0) {
        layer.msg('请输入类型名称！', function () { });
        return;
    }
    if (txtClass_Code.length == 0) {
        layer.msg('请输入编码！', function () { });
        return;
    }


    //表单提交
    $("#Editform").ajaxSubmit({
        type: "post",
        url: '/Sys_Validation/Edit?Id=' + MId + '&txtIs_System=' + txtIs_System,
        data: $("#Editform").serialize(),
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                bindIngfo(allpage);
                layer.msg('操作成功', { icon: 1 });
            }

            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}

function EditFormRest() {
    layer.closeAll();//关闭
    $('#Editform')[0].reset();//清空表单数据

}

///////////////////////////左边列表数据从操作结束//////////////////////////////


//新增弹框
function AddInfoTo() {
    FormRestTo();
    layer.open({
        type: 1,
        title: '新增',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['450px', '260px'], //宽高
        content: $("#AddTo")
    });
    $("#toTypeName").html(allclassname);

}
//新增保存
function BtnSubimTo() {

    var txtDic_Name = $("#txtDic_Name").val();
    var txtDic_Value = $("#txtDic_Value").val();
    var Class_Code = $("#totxtClass_Code").val();
    if (txtDic_Name.length == 0) {
        layer.msg('字典名称！', function () { });
        return;
    }
    if (txtDic_Value.length == 0) {
        layer.msg('请输入值！', function () { });
        return;
    }

    //表单提交
    $("#AddformTo").ajaxSubmit({
        type: "post",
        url: '/Sys_Validation/AddTo',
        data: $("#AddformTo").serialize(),
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                rightBindInfo();
                layer.msg('操作成功', { icon: 1 });
            }

            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}

function FormRestTo() {
    layer.closeAll();//关闭
    $('#AddformTo')[0].reset();//清空表单数据

}
//批量删除
function del_all() {
    var chks = document.getElementsByName('inputTo[]');//name
    var chkstr = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
        }
    }

    if (chkstr.length == 0) {
        layer.msg('请选择要删除的数据！', function () { });
        return;
    }

    chkstr = chkstr.substr(0, chkstr.length - 1);

    layer.confirm('您确定要删除吗？', {
        title: '删除',
        btn: ['确定', '取消'],
        shadeClose: true, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Sys_Validation/Del',
                data: { "Ids": chkstr },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        rightBindInfo();
                        layer.msg('操作成功', { icon: 1 });

                    }
                    if (data == "99") {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}


var MIdTo = 0;
//编辑
function EditInfoTo() {


    var chks = document.getElementsByName('inputTo[]');//name
    var chkstr = "";
    var n = 0;
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
            n++;
        }
    }

    if (n == 0) {
        layer.msg('请选择要修改的数据！', function () { });
        return;
    }
    if (n > 1) {
        layer.msg('只能选择一行！', function () { });
        return;
    }
    EditFormRestTo();
    layer.open({
        type: 1,
        title: '编辑',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['450px', '260px'], //宽高
        content: $("#EditTo")
    });
    $("#EdittoTypeName").html(allclassname);

    chkstr = chkstr.substr(0, chkstr.length - 1);

    GetListByIdTo(chkstr);
    MIdTo = chkstr;
}

//编辑时信息读取
function GetListByIdTo(Id) {
    $.ajax({
        Type: "post",
        dataType: "json",
        url: '/Sys_Validation/GetListByIdTo?Id=' + Id,
        async: false,
        success: function (data) {
            if (data.length > 0) {

                $("#EdittxtDic_Name").val(data[0]["Dic_Name"]);
                $("#EdittxtDic_Value").val(data[0]["Dic_Value"]);

            }
        }
    });
}

//编辑 保存
function EditBtnSubimTo() {
    var txtDic_Name = $("#EdittxtDic_Name").val();
    var txtDic_Value = $("#EdittxtDic_Value").val();

    if (txtDic_Name.length == 0) {
        layer.msg('字典名称！', function () { });
        return;
    }
    if (txtDic_Value.length == 0) {
        layer.msg('请输入值！', function () { });
        return;
    }




    //表单提交
    $("#EditformTo").ajaxSubmit({
        type: "post",
        url: '/Sys_Validation/EditTo?Id=' + MIdTo,
        data: $("#EditformTo").serialize(),
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                rightBindInfo();
                layer.msg('操作成功', { icon: 1 });
            }

            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}

function EditFormRestTo() {
    layer.closeAll();//关闭
    $('#EditformTo')[0].reset();//清空表单数据
}