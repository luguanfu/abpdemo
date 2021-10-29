/***************************************************************
  FileName:管理员端  学院管理  javascript
  Copyright（c）2018-金融教育在线技术开发部
  Author:袁学
  Create Date:2018-02-26
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

//列表数据加载 
function bindIngfo(page) {

    var PageSize = 10;

    $.ajax({
        url: '/Admin/CollegeManage/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "txtSchoolId": $("#txtSchoolId").val(), "txtCollegeName": $("#txtCollegeName").val() },
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

                html += '<td><input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["C_ID"] + '></td>';
                html += '<td>' + data[i]["SchoolName"] + '</td>';
                html += '<td>' + data[i]["CollegeName"] + '</td>';
                html += '<td>' + data[i]["zhuanye"] + '</td>';

                html += '<td><a onclick="update(' + data[i]["C_ID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>';
                html += '<a onclick="del(' + data[i]["C_ID"] + ')" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a></td>';
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


//新增学校
function Add() {
    //选择学校初始
    $("#SelSchoolId_chosen").find('a').find('span').html('请选择学校');
    //重新赋值
    $("#SelSchoolId").val('0');
    //表单清空
    $("#Add_form")[0].reset();
    layer.open({
        title: '新增学院',
        btn: ['确定', '取消'],
        area: ['450px', '310px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Add_div"),
        yes: function (index, layero) {
            Insert();

        }
    });
    //插件宽度
    $("#SelSchoolId_chosen").css('width', '100%');
}

//新增学校方法
function Insert() {
    //新增校验
    var SelSchoolId = $("#SelSchoolId").val();
    var txtName = $("#txtName").val();

    if (SelSchoolId == "0") {
        layer.msg('请选择学校');
        return;
    }
    if (trim(txtName) == 0) {
        layer.msg('请输入学院名称');
        return;
    }
    if (!CheckCharacter(txtName, '30')) {
        layer.msg('学院名称长度不能超过15个汉字');
        return;
    }


    //新增OK
    $.ajax({
        url: '/Admin/CollegeManage/Add',
        type: 'POST',
        data: { "SelSchoolId": SelSchoolId, "txtName": txtName },
        async: false,
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                bindIngfo();
            }
            if (data == "77") {
                layer.msg('学院名称已经存在', { icon: 2 });
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

    layer.confirm('您确认要删除选中的学院吗？', {
        title: '删除学校',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
    function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: '/Admin/CollegeManage/Del',
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
function del(CID) {
    layer.confirm('您确认要删除选中的学院吗？', {
        title: '删除学校',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
 function () {
     $.ajax({
         type: "POST",
         dataType: "text",
         url: '/Admin/CollegeManage/Del',
         data: { "Ids": CID },//多个Id
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


//修改
function update(CID) {

    //选择学校初始
    $("#SelEditSchoolId_chosen").find('a').find('span').html('请选择学校');
    //重新赋值
    $("#SelEditSchoolId").val('0');
    //表单清空
    $("#Edit_form")[0].reset();
    //赋值
    $.ajax({
        type: "POST",
        dataType: "json",
        url: '/Admin/CollegeManage/GetListById',
        data: { "C_ID": CID },
        async: false,
        success: function (data) {
            if (data.length > 0) {
                //学校
                $("#SelEditSchoolId").val(data[0]["SchoolId"]);
                //学院
                $("#txtEditName").val(data[0]["CollegeName"]);

                $("#SelEditSchoolId_chosen").find('a').find('span').html(data[0]["SchoolName"]);
                
              
            }

        }
    });

    layer.open({
        title: '编辑学院',
        btn: ['确定', '取消'],
        area: ['450px', '310px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Edit_div"),
        yes: function (index, layero) {
            Edit(CID);
 
        }
    });
    //插件宽度
    $("#SelEditSchoolId_chosen").css('width', '100%');
}

//修改 方法
function Edit(CID) {
    //新增校验
    var SelSchoolId = $("#SelEditSchoolId").val();
    var txtName = $("#txtEditName").val();

    if (SelSchoolId == "0") {
        layer.msg('请选择学校');
        return;
    }
    if (trim(txtName) == 0) {
        layer.msg('请输入学院名称');
        return;
    }
    if (!CheckCharacter(txtName, '30')) {
        layer.msg('学院名称长度不能超过15个汉字');
        return;
    }


    //新增OK
    $.ajax({
        url: '/Admin/CollegeManage/Update',
        type: 'POST',
        data: { "SelSchoolId": SelSchoolId, "txtName": txtName, "CID": CID },
        async: false,
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                bindIngfo();
            }
            if (data == "77") {
                layer.msg('学院名称已经存在', { icon: 2 });
                return;
            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}