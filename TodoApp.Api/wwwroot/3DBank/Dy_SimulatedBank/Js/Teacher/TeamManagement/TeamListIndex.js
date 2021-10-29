/***************************************************************
  FileName:教师端  团队管理  javascript
  Copyright（c）2018-金融教育在线技术开发部
  Author:柯思金
  Create Date:2018-03-6
 ******************************************************************/


$(function () {
    bindIngfo();
    bindIngfoSum();
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
function bindIngfoSum() {
    $.ajax({
        url: '/Admin/TeamManagement/GetStuListSum',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "G_ID": $("#G_ID").val() },
        success: function (data) {
            $("#cysl").html(data);
        }
    });
}
function tuandui() {
    history.go(-1);
}
function shangyiji() {
    history.go(-1);
}
//列表数据加载 已扣款
function bindIngfo(page) {

    var PageSize = 10;

    $.ajax({
        url: '/Admin/TeamManagement/GetStuList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { page: page, PageSize: PageSize, "G_ID": $("#G_ID").val() },
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

                html += '<td><input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["UserId"] + '></td>';
                html += '<td>' + data[i]["CollegeName"] + '</td>';
                html += '<td>' + data[i]["MajorName"] + '</td>';
                html += '<td>' + data[i]["ClassName"] + '</td>';
                html += '<td>' + data[i]["Name"] + '</td>';
                html += '<td>' + data[i]["StudentNo"] + '</td>';
                if (data[i]["Groupingstate"] == 0) {
                    html += '<td><a onclick="update(' + data[i]["UserId"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>设为小队长 </a>';
                }
                else {
                    html += '<td>' + '小队长' + '</td>';
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
        area: ['450px', '260px'],
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

//添加成员页面跳转
function Add(id) {
    window.location.href = "/Admin/AddMembers/Index?ID=" + id;
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
        layer.alert('请选择要踢除的学生！', {
            skin: 'layui-layer-lan'
            , closeBtn: 0
        });
        return;
    }
    //去除逗号
    chkstr = chkstr.substr(0, chkstr.length - 1);

    layer.confirm('您确认要踢除选中的学生吗？', {
        title: '踢除学生',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
    function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: '/Admin/TeamManagement/DelGroup',
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
    layer.confirm('您确认要踢除选中的学生吗？', {
        title: '剔除成员',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
 function () {
     $.ajax({
         type: "POST",
         dataType: "text",
         url: '/Admin/TeamManagement/DelGroup',
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

//修改小队长
function update(SID) {
    $.ajax({
        url: '/Admin/TeamManagement/UpdateGroupOne',
        type: 'POST',
        data: { "G_ID": $("#G_ID").val(), "SID": SID },
        async: false,
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
    });
}
