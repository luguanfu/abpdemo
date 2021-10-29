/***************************************************************
  FileName:教师端端  团队管理  javascript
  Copyright（c）2018-金融教育在线技术开发部
  Author:柯思金
  Create Date:2018-03-06
 ******************************************************************/
$(document).ready(function () {

    var config = {
        '.chosen-select': {},
        '.chosen-select-deselect': {
            allow_single_deselect: true
        },
        '.chosen-select-no-single': {
            disable_search_threshold: 10
        },
        '.chosen-select-no-results': {
            no_results_text: 'Oops, nothing found!'
        },
        '.chosen-select-width': {
            width: "95%"
        }
    }
    for (var selector in config) {
        $(selector).chosen(config[selector]);
    }
});



$(function () {
    bindIngfo();
});

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
//查询
function SearchInfo() {
    bindIngfo();
}

//列表数据加载 已扣款
function bindIngfo(page) {

    var PageSize = 10;

    $.ajax({
        url: '/Admin/TeamManagement/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "txtSchoolName": $("#StudentInfo").val() },
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

                //html += '<td>' + ((idx * PageSize) + i + 1) + '</td>';
                var sum = 0;
                html += '<td><input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["G_ID"] + '></td>';
                html += '<td>' + data[i]["SchoolName"] + '</td>';
                html += '<td>' + data[i]["Groupingname"] + '</td>';
                if (data[i]["Studentinfo"] == null || data[i]["Studentinfo"] == undefined) {
                    data[i]["Studentinfo"] = "无";
                }
                else
                {
                    
                    ;
                    sum = (data[i]["Studentinfo"] + "").split(',').length;
                }
                html += '<td>' + data[i]["Studentinfo"] + '</td>';
                html += '<td>' + sum + '</td>';
               
                html += '<td><a onclick="UpdateInfo(' + data[i]["G_ID"] + ",'" + data[i]["SchoolName"] + "','" + data[i]["Groupingname"] + "'" + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>';
                html += '<a href="/Admin/TeamManagement/TeamListIndex?name=' + data[i]["Groupingname"] + '&ID=' + data[i]["G_ID"] + '" class=" btn-success btn-sm"><i class="fa fa-user m-r-xxs"></i>成员管理 </a>&nbsp&nbsp';
                html += '<a onclick="del(' + data[i]["G_ID"] + ')" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i> 删除 </a></td>';
                html += '</tr>';
            }

            $("#tablelist").html(html);
            bootstrapPaginator("#PaginatorLibrary", tb, bindIngfo);//分页
            //样式重新加载
            redload();

        }
    });
}


//新增学校
function AddInfo() {
    //选择学校初始
    $("#AddE_PId_chosen").find('a').find('span').html('请选择学校');
    //重新赋值
    $("#AddStudentName").val('');
    //$("#Addform")[0].reset();
    layer.open({
        title: '新增团队',
        btn: ['确定', '取消'],
        area: ['450px', '190px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Add"),
        yes: function (index, layero) {
            Add();

        },
        end: function (index, layero) {
            //表单清空
            //$("#Addform")[0].reset();
        }
    });
    $("#AddE_PId_chosen").css("width", "190px");
}

//Execl获取
function  but_Execl() {
    $('#file_excel').click();
    $('#file_excel').change(function (e) {
        $("#ExcelName").html($(this).val().split('\\')[$(this).val().split('\\').length - 1]);
    })
}
//导入团队
function BatchAddInfo() {
    //$("#Addform")[0].reset();
    layer.open({
        title: '导入团队',
        btn: ['确定', '取消'],
        area: ['450px', '210px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#BatchAdd"),
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
                url: "/Admin/TeamManagement/Upload",
                type: "POST",
                dataType: "json",
                data: $('#form_Execl').serialize(),
                success: function (data) {
                    if (data[0]["Success"] > 0) {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('导入成功', { icon: 1 });
                        layer.msg("导入成功" + data[0]["Success"] + "个，失败" + data[0]["Error"] + "个");
                        $("#ExcelName").html("");
                        bindIngfo();
                    }
                    else {
                        layer.closeAll();//关闭所有弹出框                       
                        layer.msg("导入失败，有重复数据或格式错误" + data[0]["Success"] + "个，失败" + data[0]["Error"] + "个");
                        $("#ExcelName").html("");
                        bindIngfo();
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
//新增学校方法
function Add() {
    //新增校验
    var AddGroupName = $("#AddStudentName").val();


    if (!CheckCharacter(AddGroupName, '20')) {
        layer.msg('团队名称长度不能超过10个汉字');
        return;
    }

    if (AddGroupName.length == 0) {
        layer.msg('请输入团队名称');
        return;
    }
    //新增OK
    $.ajax({
        url: '/Admin/TeamManagement/AddGroup',
        type: 'POST',
        data: {"AddGroupName": AddGroupName },
        async: false,
        success: function (data) {
            if (data == "1") {
                ;
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                bindIngfo();
                //window.location.href = "/Admin/TeamManagement/TeamListIndex?name='" + AddGroupName + "'";
            }
            if (data == "77") {
                layer.msg('团队名称已经存在', { icon: 2 });
                return;
            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    })
}
//修改
function UpdateInfo(GID, SchoolName, GroupName) {

    //选择学校初始
    $("#Edit_PId_chosen").find('a').find('span').html(SchoolName);
    //重新赋值
    //$("#Edit_PId").val('');
    //表单清空
    //$("#Edit_form")[0].reset();
    //赋值
    $("#EditStudentName").val(GroupName);
    layer.open({
        title: '编辑团队',
        btn: ['确定', '取消'],
        area: ['450px', '190px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Edit_div"),
        yes: function (index, layero) {
            Edit(GID);

        }
    });
    //插件宽度
    $("#Edit_PId_chosen").css('width', '220px');
}

//修改 方法
function Edit(GID) {
    //新增校验
    var txtName = $("#EditStudentName").val();


    if (trim(txtName) == 0) {
        layer.msg('请输入团队名称');
        return;
    }
    if (!CheckCharacter(txtName, '30')) {
        layer.msg('团队名称长度不能超过15个汉字');
        return;
    }


    $.ajax({
        type: "POST",
        dataType: "json",
        url: '/Admin/TeamManagement/Edit',
        data: { "GID": GID, "AddGroupName": $("#EditStudentName").val() },
        async: false,
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                bindIngfo();
                //window.location.href = "/Admin/TeamManagement/TeamListIndex?name='" + $("#EditStudentName").val() + "'";
            }
            if (data == "77") {
                layer.msg('团队名称已经存在', { icon: 2 });
                return;
            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}
function update(name) {
    window.location.href = "/Admin/TeamManagement/TeamListIndex?name='" + name + "'";
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

    layer.confirm('您确认要删除选中的团队吗？', {
        title: '删除团队',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
    function () {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: '/Admin/TeamManagement/Del',
            data: { "Ids": chkstr },//多个Id
            success: function (data) {
                if (data == "1") {
                    layer.closeAll();//关闭所有弹出框
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
    layer.confirm('您确认要删除选中的团队吗？', {
        title: '删除团队',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
 function () {
     $.ajax({
         type: "POST",
         dataType: "text",
         url: '/Admin/TeamManagement/Del',
         data: { "Ids": SID },//多个Id
         success: function (data) {
             if (data == "1") {
                 layer.closeAll();//关闭所有弹出框
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
