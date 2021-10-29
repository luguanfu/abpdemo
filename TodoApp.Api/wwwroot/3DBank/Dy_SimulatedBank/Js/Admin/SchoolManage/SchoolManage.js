/***************************************************************
  FileName:管理员端  学校管理  javascript
  Copyright（c）2018-金融教育在线技术开发部
  Author:袁学
  Create Date:2018-02-10
 ******************************************************************/


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
        url: '/Admin/SchoolManage/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "txtSchoolName": $("#txtSchoolName").val(), "selProvince": $("#selProvince").val(), "selCity": $("#selCity").val() },
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

                html += '<td><input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["S_ID"] + '></td>';
                html += '<td>' + data[i]["SchoolName"] + '</td>';
                html += '<td>' + data[i]["xueyuan"] + '</td>';
                html += '<td>' + data[i]["zhuanye"] + '</td>';
                html += '<td>' + data[i]["banji"] + '</td>';
                html += '<td>' + data[i]["jiaoshi"] + '</td>';
                html += '<td>' + data[i]["xuesheng"] + '</td>';
                html += '<td>' + data[i]["province"] + '-' + data[i]["City"] + '</td>';
                html += '<td>' + data[i]["Extra3"] + '</td>';
                html += '<td><a onclick="update(' + data[i]["S_ID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>';
                html += '<a onclick="del(' + data[i]["S_ID"] + ')" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a></td>';
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
function Add_school() {
    //新增
    setAddProvince();
    //设置背景颜色  
    setBgColor('Add_school');
    //表单清空
    $("#Add_schoolform")[0].reset();
    layer.open({
        title: '新增学校',
        btn: ['确定', '取消'],
        area: ['480px', '310px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Add_school"),
        yes: function (index, layero) {
            Add();
          
        }
    });
}

//新增学校方法
function Add() {
    //新增校验
    var AddschoolName = $("#AddschoolName").val();
    var seladdprovince = $("#seladdprovince").val();
    var seladdCity = $("#seladdCity").val();
    var EndtTime = $("#EndtTime").val();
    if (trim(AddschoolName) == 0) {
        layer.msg('请输入学校名称');
        return;
    }
    if (!CheckCharacter(AddschoolName, '30')) {
        layer.msg('学校名称长度不能超过15个汉字');
        return;
    }
    if (seladdprovince == "选择省份") {
        layer.msg('请选择省份');
        return;
    }
    if (seladdCity == "全部") {
        layer.msg('请选择市县');
        return;
    }
    if (trim(EndtTime) == 0) {
        layer.msg('请选择到期日期');
        return;
    }
    //新增OK
    $.ajax({
        url: '/Admin/SchoolManage/Add',
        type: 'POST',
        data: { "AddschoolName": AddschoolName, "seladdprovince": seladdprovince, "seladdCity": seladdCity, "EndtTime": EndtTime  },
        async: false,
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                bindIngfo();
            }
            if (data == "77") {
                layer.msg('学校名称已经存在', { icon: 2 });
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

    layer.confirm('您确认要删除选中的学校吗？', {
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
            url: '/Admin/SchoolManage/Del',
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
    layer.confirm('您确认要删除选中的学校吗？', {
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
         url: '/Admin/SchoolManage/Del',
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

//修改
function update(SID) {

    //修改
    setEditProvince();
    //设置背景颜色  
    setBgColor('Edit_school');
    //清空表单
    $("#Edit_schoolform")[0].reset();
    //赋值
    $.ajax({
        type: "POST",
        dataType: "json",
        url: '/Admin/SchoolManage/GetListById',
        data: { "S_ID": SID },
        async: false,
        success: function (data) {
            if (data.length > 0) {
                //学校
                $("#EditschoolName").val(data[0]["SchoolName"]);
                //省份
                $("#selEditprovince").val(data[0]["province"]);
                //调用联动 市县
                provinceEditChange();
                //市县
                $("#selEditCity").val(data[0]["City"]);
                $("#EditEndtTime").val(data[0]["Extra3"]);
            }
            
        }
    });
   
    layer.open({
        title: '编辑学校',
        btn: ['确定', '取消'],
        area: ['480px', '310px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Edit_school"),
        yes: function (index, layero) {
            Edit(SID);
           
        }
    });
}

//修改 方法
function Edit(SID) {
    var EditschoolName = $("#EditschoolName").val();
    var selEditprovince = $("#selEditprovince").val();
    var selEditCity = $("#selEditCity").val();
    var EndtTime = $("#EditEndtTime").val();
    if (trim(EditschoolName) == 0) {
        layer.msg('请输入学校名称');
        return;
    }
    if (!CheckCharacter(EditschoolName, '30')) {
        layer.msg('学校名称长度不能超过15个汉字');
        return;
    }
    if (selEditprovince == "选择省份") {
        layer.msg('请选择省份');
        return;
    }
    if (selEditCity == "全部") {
        layer.msg('请选择市县');
        return;
    }
    if (trim(EndtTime) == 0) {
        layer.msg('请选择到期日期');
        return;
    }
    $.ajax({
        url: '/Admin/SchoolManage/Update',
        type: 'POST',
        data: { "EditschoolName": EditschoolName, "selEditprovince": selEditprovince, "selEditCity": selEditCity, "SID": SID, "EndtTime": EndtTime },
        async: false,
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                bindIngfo();
            }
            if (data == "77") {
                layer.msg('学校名称已经存在', { icon: 2 });
                return;
            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}