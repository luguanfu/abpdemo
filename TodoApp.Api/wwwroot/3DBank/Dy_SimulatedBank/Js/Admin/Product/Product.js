/***************************************************************
FileName:管理员端  产品管理  javascript
Copyright（c）2019-金融教育在线技术开发部
Author:伍贤成
Create Date:2019-8-5 10:11:37
******************************************************************/

$(function () {
    var page = getQueryString("page");
    bindIngfo(page);
});

var AllPage = 0;
//列表数据加载
function bindIngfo(page) {
    AllPage = page;
    var PageSize = 10;

    $.ajax({
        url: '/Admin/Product/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "Keyword": $("#Keyword").val() },
        success: function (tb) {

            var html = '';
            var data = tb.Tb;//转换table
            for (var i = 0; i < data.length; i++) {
                html += '<tr>';
                //当前页面
                var idx = 0;
                if (page != "undefined" && page != null) {
                    idx = page;
                    idx = idx - 1;
                }
                var AllType = data[i]["AllType"];


                if ($("#UserId").val() == "1") {//当前账户管理员
                    html += '<td><input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["ID"] + '  ></td>';
                   
                } else {
                   //当前登录是教师
                    if (parseInt(AllType) == 1) {//管理员新增的
                        html += '<td><input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["ID"] + ' disabled ></td>';
                    }
                    else {
                        //自己曾的
                        html += '<td><input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["ID"] + '  ></td>';
                    }
                }
               

                html += '<td>' + data[i]["ProductName"] + '</td>';
               
                if (parseInt(AllType) == 1) {//管理员新增
                    html += '<td>系统产品</td>';
                } else {
                    html += '<td>教师产品</td>';
                }
               
                html += '<td>' + data[i]["TaskDescribe"] + '</td>';

       

                if ($("#UserId").val() == "1") {//当前账户管理员
                    html += '<td><a onclick="update(' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>';
                    html += '<a onclick="del(' + data[i]["ID"] + ')" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a></td>';

                } else {
                    //当前登录是教师
                    if (parseInt(AllType) == 1) {//管理员新增de  不可操作
                        html += '<td><a onclick="update(' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm disabled"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>';
                        html += '<a onclick="del(' + data[i]["ID"] + ')" class=" btn-warning btn-sm disabled"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a></td>';
                    }
                    else {
                        //自己曾的 可操作
                        html += '<td><a onclick="update(' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>';
                        html += '<a onclick="del(' + data[i]["ID"] + ')" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a></td>';
                    }
                }



                html += '</tr>';
            }

            $("#tablelist").html(html);
            bootstrapPaginator("#PaginatorLibrary", tb, bindIngfo);//分页
            //样式重新加载
            redload();

        }
    });
}

//查询
function SearchInfo() {
    bindIngfo();
}

//新增产品
function Add_Product() {

    //表单清空
    $("#Add_Productform")[0].reset();

    layer.open({
        title: '新增产品',
        btn: ['确定', '取消'],
        area: ['450px', '260px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Add_Product"),
        yes: function (index, layero) {
            Add();

        }
    });
}

//新增产品方法
function Add() {
    //新增校验
    var txtAddProductName = $("#txtAddProductName").val();
    var seladdTaskDescribe = $("#seladdTaskDescribe option:selected").val();

    if (trim(txtAddProductName) == 0) {
        layer.msg('请输入产品名称');
        return;
    }
    if (seladdTaskDescribe == "请选择") {
        layer.msg('请选择导流方向');
        return;
    }
    //新增OK
    $.ajax({
        url: '/Admin/Product/Add',
        type: 'POST',
        data: { "txtAddProductName": txtAddProductName, "seladdTaskDescribe": seladdTaskDescribe },
        async: false,
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                bindIngfo();
            }
            if (data == "77") {
                layer.msg('产品名称已经存在', { icon: 2 });
                return;
            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}

//修改
function update(SID) {

    //清空表单
    $("#Edit_productform")[0].reset();

    //赋值
    $.ajax({
        type: "POST",
        dataType: "json",
        url: '/Admin/Product/GetListById',
        data: { "ID": SID },
        async: false,
        success: function (data) {
            if (data.length > 0) {
                //产品
                $("#txtEditProductName").val(data[0]["ProductName"]);
                //导流方向
                $("#selEditTaskDescribe").val(data[0]["TaskDescribe"]);
            }
        }
    });

    layer.open({
        title: '编辑产品',
        btn: ['确定', '取消'],
        area: ['450px', '260px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Edit_Product"),
        yes: function (index, layero) {
            Edit(SID);

        }
    });
}

//修改 方法
function Edit(SID) {
    var txtEditProductName = $("#txtEditProductName").val();
    var selEditTaskDescribe = $("#selEditTaskDescribe option:selected").val();

    if (trim(txtEditProductName) == 0) {
        layer.msg('请输入产品名称');
        return;
    }

    if (selEditTaskDescribe == "请选择") {
        layer.msg('请选择导流方向');
        return;
    }

    $.ajax({
        url: '/Admin/Product/Update',
        type: 'POST',
        data: { "txtAddProductName": txtEditProductName, "seladdTaskDescribe": selEditTaskDescribe, "ID": SID },
        async: false,
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                bindIngfo();
            }
            if (data == "77") {
                layer.msg('产品名称已经存在', { icon: 2 });
                return;
            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}

//批量删除弹窗
function del_all() {

    var chks = document.getElementsByName('input[]');//name
    var chkstr = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
        }
    }


    if (chkstr.length == 0) {
        layer.alert('请选择要删除的数据！', {
            skin: 'layui-layer-lan'
            , closeBtn: 0
        });
        return;
    }
    //去除逗号
    chkstr = chkstr.substr(0, chkstr.length - 1);

    layer.confirm('您确认要删除选中的产品信息吗？', {
        title: '删除产品',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/Product/Del',
                data: { "Ids": chkstr },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll(AllPage);//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });
                        bindIngfo();
                    }
                    if (data == "99") {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}

//单删除
function del(SID) {
    layer.confirm('您确认要删除选中的产品信息吗？', {
        title: '删除产品信息',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/Product/Del',
                data: { "Ids": SID },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });
                        bindIngfo(AllPage);
                    }
                    if (data == "99") {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}