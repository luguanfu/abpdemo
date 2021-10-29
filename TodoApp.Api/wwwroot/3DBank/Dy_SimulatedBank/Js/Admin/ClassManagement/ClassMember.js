/***************************************************************
       FileName:管理员端 班级管理-班级成员管理
       Copyright（c）2018-金融教育在线技术开发部
       Author:邵世铨
       Create Date:2018-02-28
       ******************************************************************/

$(document).ready(function () {
    GetList();
});
function Select() {
    GetList();
}

//获取班级下的学生
function GetList(page) {
    var id = $("#Classhiddenid").val();
    var PageSize = 10;
    var ClassNameid = $("#ClassNameid").val();
    $.ajax({
        url: '/Admin/ClassMember/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "Page": page, "PageSize": PageSize, "Classid": id, "ClassNameid": ClassNameid },
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
                html += '<td><input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["U_ID"] + '></td>';
                html += '<td>' + data[i]["StudentNo"] + '</td>';
                html += '<td>' + data[i]["Name"] + '</td>';
                html += '<td>' + data[i]["LoginNo"] + '</td>';
                if (data[i]["Sex"] == 0) {
                    html += '<td>男</td>';
                } else if (data[i]["Sex"] == 1) {
                    html += '<td>女</td>';
                }
                else if (data[i]["Sex"] == null) {
                    html += '<td></td>';
                } else if (data[i]["Sex"] == 3) {
                    html += '<td></td>';
                }

                html += '<td>' + data[i]["Password"] + '<a onclick="UpdatePassword(' + data[i]["U_ID"] + ')" class=" btn-warning btn-sm "><i class="fa fa-pencil m-r-xxs"></i>重置</a></td>';
                html += '<td>' + (data[i]["Phone"] == null ? "" : data[i]["Phone"]) + '</td>';
                html += '<td>' + (data[i]["Email"] == null ? "" : data[i]["Email"]) + '</td>';
                if (data[i]["State"] == 1) {
                    html += '<td>启用  <button onclick="Personal_Delete(' + data[i]["U_ID"] + ')" class="btn btn-warning btn-sm " type="button"><i class="fa fa-trash m-r-xs"></i><span class="bold">删除</span></button></td>';
                } else if (data[i]["State"] == 0) {
                    html += '<td>禁用  <button onclick="Personal_Delete(' + data[i]["U_ID"] + ')" class="btn btn-warning btn-sm " type="button"><i class="fa fa-trash m-r-xs"></i><span class="bold">删除</span></button></td>';
                }

                html += '</tr>';
            }
            $("#tablelist").html(html);
            bootstrapPaginator("#PaginatorLibrary", tb, GetList);//分页
            //样式重新加载
            redload();
        }
    });
    redload();
}
//个人删除
function Personal_Delete(id)
{
    layer.confirm('您确认要删除选中的学生吗？', {
        title: '删除学生',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
       function () {
           $.ajax({
               type: "POST",
               dataType: "text",
               url: '/Admin/ClassMember/Delete',
               data: { "Ids": id },//多个Id
               success: function (data) {
                   if (data == "1") {
                       layer.closeAll();//关闭所有弹出框
                       layer.msg('操作成功', { icon: 1 });
                       GetList();
                   }
                   if (data == "99") {
                       layer.msg('操作失败', { icon: 2 });
                       return;
                   }

               }
           })
       });
}
//重新加载样式
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

//新增学生
function Add_Student() {
    ;
    layer.open({
        title: '新增学生',
        btn: ['确定', '取消'],
        area: ['450px', '250px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Add_Student"),
        yes: function (index, layero) {
            var StudentName = $("#AddStudentNameid").val();
            if (StudentName == "" || StudentName == undefined) {
                layer.msg("请补全输入信息!");
                return false;
            }
            if (!CheckCharacter(StudentName, '10')) {
                layer.msg('姓名长度不能超过5个汉字');
                return;
            }
            var AddLoginNo = $("#AddLoginNoid").val();
            var regEn = /[`~!@#$%^&*()+<>?:"{},.\/;'[\]]/im,
   regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

            if (regEn.test($("#AddLoginNoid").val()) || regCn.test(AddLoginNo)) {
                layer.msg("学生账号不能包含特殊字符!");
                return false;
            }
            if (AddLoginNo == "" || AddLoginNo == undefined) {
                layer.msg("请补全输入信息!");
                return false;
            }
            var id = $("#Classhiddenid").val();
            //提交数据
            $.ajax({
                url: '/Admin/ClassMember/AddStudent',
                Type: "Post",
                dataType: "json",
                cache: false,
                contentType: "application/json; charset=utf-8",
                data: { "StudentName": StudentName, "AddLoginNo": AddLoginNo, "Classid": id },
                success: function (json) {
                    if (json == 1) {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('新增成功', {
                            icon: 1
                        });
                        GetList();
                    } else
                        if (json == 2) {
                            layer.msg("账号已经存在!");
                            return false;
                        }

                }
            });
        },
    });
    $("#AddStudentNameid").val("");
    $("#AddLoginNoid").val("");
}

//启用学生
function Enable() {
    var chks = document.getElementsByName('input[]');//name
    var chkstr = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
        }
    }
    if (chkstr.length == 0) {
        layer.alert('请选择要启用的学生！', {
            skin: 'layui-layer-lan'
            , closeBtn: 0
        });
        return;
    }
    //去除逗号
    chkstr = chkstr.substr(0, chkstr.length - 1);

    layer.confirm('您确认要启用选中的学生吗？', {
        title: '启用学生',
        btn: ['确定启用', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
    function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: '/Admin/ClassMember/Enable',
            data: { "Ids": chkstr },//多个Id
            success: function (data) {
                if (data == "1") {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg('操作成功', { icon: 1 });
                    GetList();
                }
                if (data == "99") {
                    layer.msg('操作失败', { icon: 2 });
                    return;
                }

            }
        })
    });
}

//禁用学生
function Disable() {
    var chks = document.getElementsByName('input[]');//name
    var chkstr = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
        }
    }
    if (chkstr.length == 0) {
        layer.alert('请选择要禁用的学生！', {
            skin: 'layui-layer-lan'
            , closeBtn: 0
        });
        return;
    }
    //去除逗号
    chkstr = chkstr.substr(0, chkstr.length - 1);

    layer.confirm('您确认要禁用选中的学生吗？', {
        title: '禁用学生',
        btn: ['确定禁用', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
    function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: '/Admin/ClassMember/Disable',
            data: { "Ids": chkstr },//多个Id
            success: function (data) {
                if (data == "1") {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg('操作成功', { icon: 1 });
                    GetList();
                }
                if (data == "99") {
                    layer.msg('操作失败', { icon: 2 });
                    return;
                }

            }
        })
    });
}

//删除学生
function Delete() {
    var chks = document.getElementsByName('input[]');//name
    var chkstr = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
        }
    }
    if (chkstr.length == 0) {
        layer.alert('请选择要删除的学生！', {
            skin: 'layui-layer-lan'
            , closeBtn: 0
        });
        return;
    }
    //去除逗号
    chkstr = chkstr.substr(0, chkstr.length - 1);

    layer.confirm('您确认要删除选中的学生吗？', {
        title: '删除学生',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
    function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: '/Admin/ClassMember/Delete',
            data: { "Ids": chkstr },//多个Id
            success: function (data) {
                if (data == "1") {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg('操作成功', { icon: 1 });
                    GetList();
                }
                if (data == "99") {
                    layer.msg('操作失败', { icon: 2 });
                    return;
                }

            }
        })
    });
}

//批量新增学生
function AllAdd() {
    //$("#Addform")[0].reset();
    var Classid=$("#Classhiddenid").val();
    layer.open({
        title: '批量新增学生',
        btn: ['确定', '取消'],
        area: ['450px', '230px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#AllAdd_Student"),
        yes: function (index, layero) {
            var docObj = document.getElementById("file_excel");
            //上传文件校验只能是excel
            if (docObj.files && docObj.files[0]) {
                var f = docObj.files;
                var exltype = f[0].name;//获取文件名
                var exp = /.xls$|.xlsx$/;
                if (exp.exec(exltype) == null) {
                    layer.msg('上传格式错误（仅支持.xls和.xlsx文件）', { icon: 2 });
                    return;
                }
            }
            else {
                layer.msg('请选择上传文件！', function () { });
                return;
            }

            $('#form_Execl').ajaxSubmit({
                url: "/Admin/ClassMember/Upload?Classid=" + Classid + "",
                type: "POST",
                dataType: "json",
                data: $('#form_Execl').serialize(),
                success: function (data) {
                    if (data[0]["Success"] > 0) {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('导入成功', { icon: 1 });
                        layer.msg("导入成功" + data[0]["Success"] + "个，失败" + data[0]["Error"] + "个");
                        $("#ExcelName").html("");
                        GetList();
                    } else if (data[0]["Success"] <= 0) {
                        layer.msg('导入失败', { icon: 1 });
                        layer.msg("导入成功" + data[0]["Success"] + "个，失败" + data[0]["Error"] + "个");
                        GetList();
                    }

                }
            });

        },
        end: function (index, layero) {
            //表单清空
            //$("#Addform")[0].reset();
        }
    });
    $("#AddE_PId_chosen").css("width", "190px");
}

//Execl获取
function but_Execl() {
    $('#file_excel').click();
    $('#file_excel').change(function (e) {
        $("#ExcelName").html($(this).val().split('\\')[$(this).val().split('\\').length - 1]);
    })
}
//检查输入框是否有特殊字符
function Testing() {
    var regEn = /[`~!@#$%^&*()+<>?:"{},.\/;'[\]]/im,
    regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

    if (regEn.test($("#AddLoginNoid").val()) || regCn.test(newName)) {
        layer.msg("学生账号不能包含特殊字符!");
        return false;
    }
}

//重置密码
function UpdatePassword(id)
{
   

    layer.confirm('您确认要重置密码吗？', {
        title: '重置密码',
        btn: ['确定重置', '取消操作'],
        shadeClose:false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
    function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: '/Admin/ClassMember/UpdatePassword',
            data: { "UpdatePasswordid": id },//多个Id
            success: function (data) {
                if (data == "1") {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg('重置成功', { icon: 1 });
                    GetList();
                }
                if (data == "99") {
                    layer.msg('重置失败', { icon: 2 });
                    return;
                }

            }
        })
    });
    GetList();
}


