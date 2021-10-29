$(function () {
    bindIngfo();
    bindSchoolList();
})

function bindSchoolList() {
    $.ajax({
        url: '/Admin/MajorOrTeacher/SchoolList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: {},
        success: function (tb) {
            var html = '<option value="">请选择学校</option>';
            if (tb != null && tb.length > 0) {
                for (var i = 0; i < tb.length; i++) {
                    html += '<option value="' + tb[i]["S_ID"] + '">' + tb[i]["SchoolName"] + '</option>';
                }
            }
            $("#School").html(html);
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
function bindIngfo(page) {
    var School = $("#School").find("option:selected").val();
    var Keyword = $("#TeacherName").val();
    var PageSize = 10;

    $.ajax({
        url: '/Admin/MajorOrTeacher/TeacherGetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, School: School, Keyword: Keyword },
        success: function (tb) {
            var data = tb.Tb;//转换table
            var html = '';
            for (var i = 0; i < data.length; i++) {//遍历生成 html
                html += '<tr>';
                html += '<td><input type="checkbox" class="i-checks" name="input[]" value="' + data[i]["U_ID"] + '"></td>';
                html += '</td>';
                html += '<td>' + data[i]["SchoolName"] + '<input  type="hidden" value="' + data[i]["SchoolId"] + '"></td>';
                html += '<td>' + data[i]["LoginNo"] + '</td>';
                html += '<td>' + data[i]["TeacherName"] + '</td>';
                html += '<td>' + data[i]["Password"] + '</td>';
                html += '<td>' + (!IsNullOrEmpty(data[i]["Contact"]) ? data[i]["Contact"] : "") + '</td>';
                html += '<td>' + (!IsNullOrEmpty(data[i]["Email"]) ? data[i]["Email"] : "") + '</td>';
                html += '<td>' + (data[i]["State"] == "1" ? "启用" : "禁用") + '</td>';
                html += '<td>';
                html += '<a onclick="Update_school(this);" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑</a>';
                html += '<a onclick="ResetTeacher(' + data[i]["U_ID"] + ')" class=" btn-success btn-sm  m-r-sm"><i class="fa fa-refresh m-r-xxs"></i>重置密码</a>';
                html += '<a onclick="del(' + data[i]["U_ID"] + ')" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a>';
                html += '</td>';
                html += '</tr>';
            }
            $("#list").html(html);//填充table
            bootstrapPaginator("#PaginatorLibrary", tb, bindIngfo);//分页
            //样式重新加载
            redload();
        }
    });
}


function Restore() {
    $("#Add_Teacher").find("input").val("");
}

function SchoolList(SchoolName) {
    $.ajax({
        url: '/Admin/MajorOrTeacher/SchoolList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: {},
        success: function (tb) {
            var html = '<option value="">请选择学校</option>';
            if (tb != null && tb.length > 0) {
                for (var i = 0; i < tb.length; i++) {
                    html += '<option value="' + tb[i]["S_ID"] + '">' + tb[i]["SchoolName"] + '</option>';
                }
            }
            $("#AddSchool").html(html);
            if (!IsNullOrEmpty(SchoolName)) {
                $("#AddSchool").val(SchoolName);
            }
        }
    });
}

function Update_school(obj) {
    Restore();
    var tr = $(obj).parent().parent()
    var U_ID = $(tr).find("input[name='input[]']").val();
    var SchoolName = $(tr).find("td").eq(1).find("input").val();
    var LoginNo = $(tr).find("td").eq(2).html();
    var TeacherName = $(tr).find("td").eq(3).html();
    var Contact = $(tr).find("td").eq(5).html();
    var Email = $(tr).find("td").eq(6).html();
    $("#U_ID").val(U_ID);
    $("#AddLoginNo").val(LoginNo);
    $("#AddTeacherName").val(TeacherName);
    $("#Contact").val(Contact);
    $("#Email").val(Email);
    SchoolList(SchoolName);

    Add_Teacher(1);
}

//新增教师
function Add_Teacher(t) {
    var telte = "新增教师";
    if (t == 1) {
        telte = "修改教师";
    } else {
        Restore();
        SchoolList();
    }
    layer.open({
        title: telte,
        btn: ['确定', '取消'],
        area: ['450px', '425px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Add_Teacher"),
        yes: function (index, layero) {
            Add();
        },
    });
}


function Add() {//AddTeacherName
    var U_ID = $("#U_ID").val();
    var LoginNo = $("#AddLoginNo").val();
    var School = $("#AddSchool").val();
    var TeacherName = $("#AddTeacherName").val();
    var Contact = $("#Contact").val();
    var Email = $("#Email").val();
    if (IsNullOrEmpty(School)) {
        layer.msg('请选择学校');
        return
    }
    if (IsNullOrEmpty(TeacherName)) {
        layer.msg('教师名称不能为空');
        return
    }
    if (TeacherName.length > 5) {
        layer.msg('教师名称长度不能超过5个汉字');
        return;
    }
    if (IsNullOrEmpty(LoginNo)) {
        layer.msg('教师登录账号不能为空');
        return
    }
    if (LoginNo.length > 20) {
        layer.msg('教师登录长度不能超过20个汉字');
        return;
    }//MajorName
    if (!CheckChineseCharTS(LoginNo)) {
        layer.msg('教师登录账号不能有特殊字符');
        return
    }
    if (!CheckChinese(LoginNo)) {
        layer.msg('教师登录账号不能有特殊字符');
        return
    }
    $.ajax({
        url: '/Admin/MajorOrTeacher/EditTeacher',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { U_ID: U_ID, TeacherName: TeacherName, School: School, LoginNo: LoginNo, Contact: Contact, Email: Email },
        success: function (tb) {
            if (tb == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('保存成功', { icon: 1 });
                bindIngfo();
            } else if (tb == "2") {
                layer.msg('教师登录账号已经存在', { icon: 2 });
                return;
            } else {
                layer.msg('操作失败', { icon: 2 });
                return;

            }
        }
    });

}
//用UniCode 字符范围判断  因为汉字的编码都大于 255
//验证是否汉字
function CheckChinese(str) {
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
            return false;
        } else {
            return true;
        }
    }
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

    layer.confirm('您确认要删除选中的教师吗？', {
        title: '删除教师',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/MajorOrTeacher/DelTeacher',
                data: { "Ids": chkstr },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });
                        bindIngfo();
                    } else {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}

//单删除
function del(SID) {
    layer.confirm('您确认要删除选中的教师吗？', {
        title: '删除教师',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/MajorOrTeacher/DelTeacher',
                data: { "Ids": SID },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });
                        bindIngfo();
                    } else {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}




//批量 启用、禁用
function EnableTeacher(txt, State) {

    var chks = document.getElementsByName('input[]');//name
    var chkstr = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
        }
    }


    if (chkstr.length == 0) {
        layer.alert('请选择要' + txt + '的数据！', {
            skin: 'layui-layer-lan'
            , closeBtn: 0
        });
        return;
    }
    //去除逗号
    chkstr = chkstr.substr(0, chkstr.length - 1);

    layer.confirm('您确认要' + txt + '选中的教师吗？', {
        title: txt + '教师',
        btn: ['确定' + txt, '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/MajorOrTeacher/EnableTeacher',
                data: { "Ids": chkstr, State: State },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });
                        bindIngfo();
                    } else {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}


//重置密码
function ResetTeacher(SID) {
    layer.confirm('您确认要重置选中的教师密码？', {
        title: '重置教师',
        btn: ['确定重置', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/MajorOrTeacher/ResetTeacher',
                data: { "U_ID": SID },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });
                        bindIngfo();
                    } else {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}
