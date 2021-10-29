/***************************************************************
FileName:管理员端  客户管理  javascript
Copyright（c）2019-金融教育在线技术开发部
Author:伍贤成
Create Date:2019-8-5 10:11:37
******************************************************************/

$(function () {
    var page = getQueryString("page");
    bindIngfo(page);

});

var allNumOne = -1;//初始值-1
var AllPage = 0;
//列表数据加载
function bindIngfo(page) {
    AllPage = page;
    var PageSize = 10;

    $.ajax({
        url: '/Admin/Customer/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "Keyword": $("#Keyword").val(), "taskid": getQueryString("taskid") },
        async: false,
        success: function (tb) {

            var html = '';
            var data = tb.Tb;//转换table
          
            if (allNumOne == -1) {
                allNumOne = tb.Total;
                $("#NumOne").text(allNumOne);
            }
            if (tb.Total >= 20) {
                $("#newBtn").attr("disabled", "disabled");
            } else {
                $("#newBtn").removeAttr("disabled", "disabled");
            }
            for (var i = 0; i < data.length; i++) {
                html += '<tr>';
                //当前页面
                var idx = 0;
                if (page != "undefined" && page != null) {
                    idx = page;
                    idx = idx - 1;
                }

                html += '<td><input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["ID"] + '></td>';
                html += '<td><a onclick="update(' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>' + data[i]["CustomerName"] + '</td>';
                //html += '<td>' + (data[i]["CustomerOrder"] == null ? "" : data[i]["CustomerOrder"]) + '</td>';
                html += '<td><a onclick="CustomerSituationSet(' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑</a>' + "" + '</td>';

                if (data[i]["HallScene"] == 1) {
                    html += '<td><a onclick="GotoHallScene(' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑</a>' + "" + '</td>';
                } else if (data[i]["HallScene"] == 2) {
                    html += '<td><a onclick="GotoHallScene(' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm disabled"><i class="fa fa-pencil m-r-xxs"></i>编辑</a>' + "" + '</td>';
                }

                if (data[i]["CounterScene"] == 1) {
                    html += '<td><a onclick="GotoCounterScene(' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑</a>' + "" + '</td>';
                } else if (data[i]["CounterScene"] == 2) {
                    html += '<td><a onclick="GotoCounterScene(' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm disabled"><i class="fa fa-pencil m-r-xxs"></i>编辑</a>' + "" + '</td>';
                }

                html += '<td><a onclick="CustomerConsultationSet(' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>' + "" + '</td>';
                if (data[i]["CustomerOrder"] != null) {
                    html += '<td><a class=" btn-primary btn-sm  m-r-sm" onclick="Upper_Move(' + data[i]["ID"] + ')">上移</a>';
                    html += '<a class=" btn-warning btn-sm" onclick="Lower_Move(' + data[i]["ID"] + ')">下移</a></td>';
                } else {
                    html += '<td>' + "" + '</td>';
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

//新增客户
function Add_Customer() {

    //表单清空
    $("#Add_Customerform")[0].reset();

    layer.open({
        title: '新增客户',
        btn: ['确定', '取消'],
        area: ['450px', '260px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Add_Customer"),
        yes: function (index, layero) {
            Add();

        }
    });
}

//新增客户方法
function Add() {
    //新增校验
    var txtCustomerName = $("#txtAddCustomerName").val();

    if (trim(txtCustomerName) == 0) {
        layer.msg('请输入客户名称');
        return;
    }

    //新增OK
    $.ajax({
        url: '/Admin/Customer/Add',
        type: 'POST',
        data: { "txtCustomerName": txtCustomerName, "taskid": getQueryString("taskid") },
        async: false,
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                allNumOne = -1;
                bindIngfo();
            }
            //if (data == "77") {
            //    layer.msg('客户名称已经存在', { icon: 2 });
            //    return;
            //}
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
    $("#Edit_Customerform")[0].reset();

    //赋值
    $.ajax({
        type: "POST",
        dataType: "json",
        url: '/Admin/Customer/GetListById',
        data: { "ID": SID },
        async: false,
        success: function (data) {
            if (data.length > 0) {
                //客户
                $("#txtEditCustomerName").val(data[0]["CustomerName"]);
                //导流方向
                $("#selEditTaskDescribe").val(data[0]["TaskDescribe"]);
            }
        }
    });

    layer.open({
        title: '编辑客户',
        btn: ['确定', '取消'],
        area: ['450px', '260px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Edit_Customer"),
        yes: function (index, layero) {
            Edit(SID);

        }
    });
}

//修改 方法
function Edit(SID) {
    var txtEditCustomerName = $("#txtEditCustomerName").val();

    if (trim(txtEditCustomerName) == 0) {
        layer.msg('请输入客户名称');
        return;
    }

    $.ajax({
        url: '/Admin/Customer/Update',
        type: 'POST',
        data: { "txtCustomerName": txtEditCustomerName, "ID": SID },
        async: false,
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                bindIngfo();
            }
            //if (data == "77") {
            //    layer.msg('客户名称已经存在', { icon: 2 });
            //    return;
            //}
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

    layer.confirm('您确认要删除选中的客户信息吗？', {
        title: '删除客户',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/Customer/Del',
                data: { "Ids": chkstr },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll(AllPage);//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });
                        allNumOne = -1;
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
    layer.confirm('您确认要删除选中的客户信息吗？', {
        title: '删除客户信息',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/Customer/Del',
                data: { "Ids": SID },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });
                        allNumOne = -1;
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

//客户情况设置
function CustomerSituationSet(id) {
    window.location.href = "/Admin/Customer/SituationSet?Id=" + id + "&taskid=" + getQueryString("taskid");
}

//客户质询设置
function CustomerConsultationSet(id) {
    window.location.href = "/Admin/CustomerConsultation/Index?Id=" + id + "&taskid=" + getQueryString("taskid");
}

//上移
function Upper_Move(id) {
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Admin/Customer/Move?action=Move',
        data: { "Id": id, "Type": "-1", "taskid": getQueryString("taskid") },
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                bindIngfo(AllPage);
            }
            if (data == "-1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('已经是最后一条了', { icon: 1 });
            }
            if (data == "-2") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('已经是第一条了', { icon: 1 });
            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}
//下移
function Lower_Move(id) {
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Admin/Customer/Move?action=Move',
        data: { "Id": id, "Type": "+1", "taskid": getQueryString("taskid") },
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                bindIngfo(AllPage);
            }
            if (data == "-1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('已经是最后一条了', { icon: 1 });
            }
            if (data == "-2") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('已经是第一条了', { icon: 1 });
            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}

function GotoHallScene(customerid) {
    window.location.href = "/Admin/HallScene?customerid=" + customerid;
}

function GotoCounterScene(customerid) {
    window.location.href = "/Admin/CounterScene?customerid=" + customerid;
}

//客户列表
function Next() {
    var type = getQueryString("addtype");
    if (type == "1") { //新增
        if ($("#taskid").val() == "0") {
            layer.msg("请先保存案例基本信息", { icon: 8, time: 800 });
            return;
        }
        else {
            var id = getQueryString("taskid");
            location.href = "/admin/Customer/Index?taskid=" + id;
        }
    } else { //修改
        var id = getQueryString("taskid");
        location.href = "/admin/Customer/Index?taskid=" + id;
    }
}

function selectScene(obj) {
    var taskid = getQueryString("taskid");
    var addtype = getQueryString("addtype");
    var operscene = $(obj).val();
    if (operscene == "4") {
        window.location.href = "/Admin/AbilityScoreSet/Index?addtype=" + addtype + "&operscene=" + operscene + "&taskid=" + taskid;
    } else {
        window.location.href = "/Admin/CaseManagement/AddOrEdit?addtype=" + addtype + "&operscene=" + operscene + "&taskid=" + taskid;
    }
}

