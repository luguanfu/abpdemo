/***************************************************************
  FileName:校验管理   javascript
  Copyright（c）2017-金融教育在线技术开发部
  Author:袁学
  Create Date:2017-5-9
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
}

$(function () {
    bindIngfo();

});

//搜索
function searchinfo() {
    bindIngfo();
}

//列表数据加载
function bindIngfo(page) {
    var CheckName = $("#CheckName").val();//裁判信息
    var PageSize = 10;

    $.ajax({
        Type: "post",
        dataType: "json",
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: '/Validation/GetList',
        data: { "CheckName": CheckName, "page": page, "PageSize": PageSize },
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
                    html += '<td><span class="pie">' + ((idx * PageSize) + i + 1) + '</span></td>';
                    html += '<td><input type="checkbox" class="i-checks" name="input[]" value="' + data[i]["Id"] + '"></td>';
                    html += '<td><span class="pie">' + data[i]["CheckName"] + '</span></td>';
                    var ValidationRulestxt = data[i]["ValidationRules"] + "";
                    if (ValidationRulestxt.length > 50) {
                        ValidationRulestxt = ValidationRulestxt.substr(0, 50) + '...';
                    }
                    html += '<td><span class="pie">' + ValidationRulestxt + '</span></td>';

                    html += '<td><a href="javascript:void(0);" onclick="Edit(' + data[i]["Id"] + ')" class=" btn-primary btn-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a></td> ';
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


//新增弹框
function AddInfo() {
    FormRest();
    layer.open({
        type: 1,
        title: '新增',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['450px', '240px'], //宽高
        content: $("#Add")
    });

}


//新增保存
function BtnSubim() {

    var txtCheckName = $("#txtCheckName").val();
    var txtValidationRules = $("#txtValidationRules").val();

    if (txtCheckName.length == 0) {
        layer.msg('请输入规则名称！', function () { });
        return;
    }
    if (txtValidationRules.length == 0) {
        layer.msg('请输入js正则表达式！', function () { });
        return;
    }

    //表单提交
    $("#Addform").ajaxSubmit({
        type: "post",
        url: '/Validation/Add',
        data: $("#Addform").serialize(),
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                bindIngfo();
                layer.msg('操作成功', { icon: 1 });
            }
            if (data == "88") {
                layer.msg('规则名称已经存在！', function () { });
                return;
            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}


//新增取消
function FormRest() {
    layer.closeAll();//关闭
    $('#Addform')[0].reset();//清空表单数据
}

var MId = 0;
//编辑
function Edit(Id) {
    EditFormRest();
    layer.open({
        type: 1,
        title: '编辑',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['450px', '240px'], //宽高
        content: $("#Edit")
    });
    GetListById(Id);
    MId = Id;
}

//编辑时信息读取
function GetListById(Id) {
    $.ajax({
        Type: "post",
        dataType: "json",
        url: '/Validation/GetListById?Id=' + Id,
        async: false,
        success: function (data) {
            if (data.length > 0) {

                $("#txtEditCheckName").val(data[0]["CheckName"]);
                $("#txtEditValidationRules").val(data[0]["ValidationRules"]);

            }
        }
    });
}

//编辑 保存
function EditBtnSubim() {
    var txtCheckName = $("#txtEditCheckName").val();
    var txtValidationRules = $("#txtEditValidationRules").val();

    if (txtCheckName.length == 0) {
        layer.msg('请输入规则名称！', function () { });
        return;
    }
    if (txtValidationRules.length == 0) {
        layer.msg('请输入js正则表达式！', function () { });
        return;
    }



    //表单提交
    $("#Editform").ajaxSubmit({
        type: "post",
        url: '/Validation/Edit?Id=' + MId,
        data: $("#Editform").serialize(),
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                bindIngfo();
                layer.msg('操作成功', { icon: 1 });
            }
            if (data == "88") {
                layer.msg('规则名称已经存在！', function () { });
                return;
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


//批量删除
function del_all() {
    var chks = document.getElementsByName('input[]');//name
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
                url: '/Validation/Del',
                data: { "Ids": chkstr },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        bindIngfo();
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
