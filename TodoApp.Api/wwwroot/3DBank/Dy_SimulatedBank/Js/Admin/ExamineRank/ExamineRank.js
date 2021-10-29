$(function () {
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
    var type = $("#typess").val();
    //if (type == 1) {
    //    $("#an").show();

    //}
    //else if (type == 2) {
    //    $("#an").hide();
    //}
    loadPage();
})
function AddRank() {
    $("#Add_form")[0].reset();
    layer.open({
        title: '新增排名',
        btn: ['确定', '取消'],
        area: ['450px', '200px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Add_div"),
        yes: function (index, layero) {//确认按钮事件
            var txtName = $("#RankName").val().trim();
            if (txtName.length == 0) {
                layer.msg('请输入排名名称！');
                return;
            }
            $.ajax({
                url: "/Admin/ExamineRank/AddRank",
                Type: "post",
                dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                data: { "RankName": txtName },
                success: function (da) {
                    if (da == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });

                        bindIngfo();
                    }
                    if (da == "88") {
                        layer.msg('排名名称已经存在', { icon: 2 });
                        return;
                    }
                    if (da == "99") {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }
                }
            });


        }
    });
    //插件宽度
    $("#SelSchoolId_chosen").css('width', '100%');
}
function EditRank(id, name, state) {
    if (state == 1) {
        layer.msg('请关闭激活！');
        return;
    }
    $("#Edit_form")[0].reset();
    $("#EditRankName").val(name);
    layer.open({
        title: '编辑排名',
        btn: ['确定', '取消'],
        area: ['450px', '200px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Edit_div"),
        yes: function (index, layero) {//确认按钮事件
            var txtName = $("#EditRankName").val().trim();
            if (txtName.length == 0) {
                layer.msg('请输入排名名称！');
                return;
            }
            $.ajax({
                url: "/Admin/ExamineRank/UpdateRankName",
                Type: "post",
                dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                data: { "RankName": txtName, "id": id },
                success: function (da) {
                    if (da == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });

                        bindIngfo();
                    }
                    if (da == "88") {
                        layer.msg('排名名称已经存在', { icon: 2 });
                        return;
                    }
                    if (da == "99") {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }
                }
            });


        }
    });
    //插件宽度
    $("#SelSchoolId_chosen").css('width', '100%');
}
function del_all() {
    var chks = document.getElementsByName('iclass');//name
    var chkstr = "";

    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            var lis = chks[i].value.split(':');
            if (lis[1] == 1) {
                layer.msg('请关闭激活！', function () { });
                return;
            }
            chkstr += lis[0] + ",";
        }
    }

    if (chkstr.length == 0) {
        layer.msg('请选择要删除的排名！', function () { });
        return;
    }


    chkstr = chkstr.substr(0, chkstr.length - 1);
    layer.confirm('您确定要删除所选排名吗？', {
        title: '删除',
        btn: ['确定', '取消'],
        shadeClose: true, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    }, function () {
        $.ajax({
            url: '/Admin/ExamineRank/DelRank',
            type: "POST",
            dataType: "text",
            data: { "Ids": chkstr },
            success: function (data) {
                if (data == "1") {

                    loadPage();

                    layer.msg('操作成功', { icon: 1 });

                }
                if (data == "99") {
                    layer.msg('操作失败', { icon: 2 });
                    return;
                }
            }
        });
    });
}
function del(id, state) {
    if (state == 1) {
        layer.msg('请关闭激活！');
        return;
    }
    layer.confirm('您确定要删除所选排名吗？', {
        title: '删除',
        btn: ['确定', '取消'],
        shadeClose: true, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                url: '/Admin/ExamineRank/DelRank',
                Type: "post",
                dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                data: { "ids": id },
                success: function (da) {
                    if (da == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });

                        bindIngfo();
                    }
                   
                    if (da == "99") {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }
                }
            });
        });
}
function bindIngfo() {
    loadPage();
}
function loadPage(page) {
    var name = $("#ExamineName").val().trim();
    var PageSize = 10;
    $.ajax({
        url: '/Admin/ExamineRank/GetRankExamineTable',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "name": name, "page": page, "PageSize": PageSize },
        success: function (tb) {
            var html = '';
            var data = tb.Tb;//转换table
            for (var i = 0; i < data.length; i++) {
                if (UserType != "1") {
                    if (data[i]["IsOneself"] == "0" && data[i]["IsState"] == "未激活") {
                        continue;
                    }
                }
                html += '<tr>';
                //当前页面
                var idx = 0;
                if (page != "undefined" && page != null) {
                    idx = page;
                    idx = idx - 1;
                }
                if (UserType != "1") {
                    if (data[i]["IsOneself"] == "1") {
                        html += '<td><input type="checkbox" class="i-checks" name="iclass" value=' + data[i]["id"] + ':' + data[i]["state"] + '></td>';
                    }
                    else {
                        html += '<td><input type="checkbox" disabled="true" class="i-checks" name="iclass" value=' + data[i]["id"] + ':' + data[i]["state"] + '></td>';
                    }
                }
                else {
                    html += '<td><input type="checkbox" class="i-checks" name="iclass" value=' + data[i]["id"] + ':' + data[i]["state"] + '></td>';
                }
                html += '<td>' + data[i]["rank_name"] + '</td>';
                html += '<td>' + data[i]["IsState"] + '</td>';
                var str = "'" + data[i]["rank_name"] + "'";
                var type = $("#typess").val();
                if (type == 2) {
                    if (data[i]["IsOneself"] == "1") {
                        html += '<td> <a  id="bj" onclick="EditRank(' + data[i]["id"] + ',' + str + ',' + data[i]["state"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>';
                        html += '<a id="tj" onclick="EditRankRange(' + data[i]["id"] + ',' + data[i]["state"] + ')" class=" btn-success btn-sm  m-r-sm" > <i class="fa fa-globe m-r-xxs"></i>统计范围 </a > ';
                        html += '<a onclick="PreviewRank(' + data[i]["id"] + ')" class=" btn-info btn-sm  m-r-sm" > <i class="fa fa-eye m-r-xxs"></i>预览 </a > ';
                        html += '<a  id="sc" onclick="del(' + data[i]["id"] + ',' + data[i]["state"] + ')" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a> </td>';
                    }
                    else {
                        html += '<td> <a  id="bj" style="background: #ddd;" title="非当前登陆账号添加数据" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>';
                        html += '<a id="tj"  style="background: #ddd;" title="非当前登陆账号添加数据" class=" btn-success btn-sm  m-r-sm" > <i class="fa fa-globe m-r-xxs"></i>统计范围 </a > ';
                        html += '<a onclick="PreviewRank(' + data[i]["id"] + ')" class=" btn-info btn-sm  m-r-sm" > <i class="fa fa-eye m-r-xxs"></i>预览 </a > ';
                        html += '<a  id="sc"  style="background: #ddd;" title="非当前登陆账号添加数据" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a> </td>';
                    }
                }
                else {
                    html += '<td> <a  id="bj" onclick="EditRank(' + data[i]["id"] + ',' + str + ',' + data[i]["state"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>';
                    html += '<a id="tj" onclick="EditRankRange(' + data[i]["id"] + ',' + data[i]["state"] + ')" class=" btn-success btn-sm  m-r-sm" > <i class="fa fa-globe m-r-xxs"></i>统计范围 </a > ';
                    html += '<a onclick="PreviewRank(' + data[i]["id"] + ')" class=" btn-info btn-sm  m-r-sm" > <i class="fa fa-eye m-r-xxs"></i>预览 </a > ';
                    html += '<a  id="sc" onclick="del(' + data[i]["id"] + ',' + data[i]["state"] + ')" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a> </td>';

                }
                html += '</tr>';

            }
            $("#tablelist").html(html);

            bootstrapPaginator("#PaginatorLibrary", tb, loadPage);//分页
            //样式重新加载
            redload();

        }
    });
}
function EditRankRange(id, state) {
    if (state == 1) {
        layer.msg('请关闭激活！');
        return;
    }
    window.location.href = "/Admin/ExamineRank/EditRank?id=" + id;
}

function PreviewRank(id) {
    window.location.href = "/Admin/ExamineRank/PreviewRankS?id=" + id;
}

function closeactivate() {
    var chks = document.getElementsByName('iclass');//name
    var chkstr = "";
    var state = 2;
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            var lis = chks[i].value.split(':');
         
            chkstr += lis[0] + ",";
        }
    }

    if (chkstr.length == 0) {
        layer.msg('请选择关闭激活的排名！', function () { });
        return;
    }


    chkstr = chkstr.substr(0, chkstr.length - 1);
    $.ajax({
        url: '/Admin/ExamineRank/UpdateRankState',
        type: "POST",
        dataType: "text",
        data: { "Ids": chkstr, "state": state },
        success: function (data) {
            if (data == "1") {

                loadPage();

                layer.msg('操作成功', { icon: 1 });

            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}
function activate() {
    var chks = document.getElementsByName('iclass');//name
    var chkstr = "";
    var state = 1;
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            var lis = chks[i].value.split(':');

            chkstr += lis[0] + ",";
        }
    }

    if (chkstr.length == 0) {
        layer.msg('请选择激活的排名！', function () { });
        return;
    }


    chkstr = chkstr.substr(0, chkstr.length - 1);
    $.ajax({
        url: '/Admin/ExamineRank/UpdateRankState',
        type: "POST",
        dataType: "text",
        data: { "Ids": chkstr, "state": state },
        success: function (data) {
            if (data == "1") {
                loadPage();
                layer.msg('操作成功', { icon: 1 });
            }
            else if (data == "88") {
                layer.msg('请选择排名范围再进行激活', { icon: 0});
                return;
            }
            else  if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}