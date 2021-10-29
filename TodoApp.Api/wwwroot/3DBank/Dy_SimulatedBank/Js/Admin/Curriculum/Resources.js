/***************************************************************
         FileName:BSI_保险_课程-章-节管理js文件 
         Copyright（c）2018-金融教育在线技术开发部
         Author:邵
         Create Date:2018-5月15号
******************************************************************/
//页面加载完成就执行
$(document).ready(function () {
    GetList();
    var a = "p2";

});
//加载章列表
function GetList(page) {
    var PageSize = 10;
    $.ajax({
        url: '/Admin/Resources/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "SelectName": $("#SelectNameid").val() },
        success: function (tb) {

            var html = '';
            var data = tb.Tb;//转换table
            for (var i = 0; i < data.length; i++) {
                var Type = data[i]["Type"] + "";
                Type = Type.substr(1, Type.length);
                if (Type.indexOf("mp") != -1) {
                    Type = "视频";
                }
                html += '<tr>';
                //当前页面
                var idx = 0;
                if (page != "undefined" && page != null) {
                    idx = page;
                    idx = idx - 1;
                }
                var AllType = data[i]["CurrType"];
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
                html += '<td>' + data[i]["ResourcesName"] + '</td>';

                html += '<td>' + Type.toUpperCase() + '</td>';
                if (data[i]["CurriculumName"] == null) {
                    html += '<td><span>—</span></td>';
                } else {
                    html += '<td><span>' + data[i]["CurriculumName"] + '</span></td>';
                }
                if (data[i]["abilityString"] == null) {
                    html += '<td><span>——</span></td>';
                } else {
                    html += '<td><span>' + data[i]["abilityString"] + '</span></td>';
                }

                if ($("#UserId").val() == "1") {//当前账户管理员
                    html += '<td><a onclick="update(' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>';
                    html += '<a onclick="del(' + data[i]["ID"] + ')" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a></td>';

                } else {
                    //当前登录是教师
                    if (parseInt(AllType) == 1) {//管理员新增的
                        html += '<td><a onclick="update(' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm disabled"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>';
                        html += '<a onclick="del(' + data[i]["ID"] + ')" class=" btn-warning btn-sm disabled"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a></td>';
                    }
                    else {
                        //自己曾的
                        html += '<td><a onclick="update(' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>';
                        html += '<a onclick="del(' + data[i]["ID"] + ')" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a></td>';
                    }
                }
                html += '</tr>';
            }

            $("#tablelist").html(html);
            bootstrapPaginator("#PaginatorLibrary", tb, GetList);//分页
            //样式重新加载
            redload();

        }
    });
}

//编辑
function update(id) {
    window.location.href = "/Admin/Resources_Add?Id=" + id + "";
}

//复选框
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

function AddJump() {
    window.location.href = "/Admin/Resources_Add?Id=0";
}

//单删除
function del(SID) {
    layer.confirm('您确认要删除选中的课程吗？', {
        title: '删除课程',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/Resources/Del',
                data: { "Ids": SID },//多个Id
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

    layer.confirm('您确认要删除选中的数据吗？', {
        title: '删除课件',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/Resources/Del',
                data: { "Ids": chkstr },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });
                        GetList();
                    } else {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}

//一键转换图片
function Transformation() {
    var chks = document.getElementsByName('input[]');//name
    var chkstr = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
        }
    }


    if (chkstr.length == 0) {
        layer.alert('请选择要转换图片的数据！', {
            skin: 'layui-layer-lan'
            , closeBtn: 0
        });
        return;
    }
    //去除逗号
    chkstr = chkstr.substr(0, chkstr.length - 1);

    layer.confirm('您确认要转换选中的数据吗？', {
        title: '转换课件',
        btn: ['确定转换', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            var index = layer.load(1, {
                shade: [0.1, '#fff'] //0.1透明度的白色背景
            });
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/Resources_Add/Transformation',
                data: { "Ids": chkstr },//多个Id
                success: function (data) {

                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });
                        GetList();
                    } else {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}