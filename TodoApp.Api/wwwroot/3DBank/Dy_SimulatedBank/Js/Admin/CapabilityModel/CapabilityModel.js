
/***************************************************************
  FileName:管理员端  能力模型设置  javascript
  Copyright（c）2019-金融教育在线技术开发部
  Author:伍贤成
  Create Date:2019-02-26
 ******************************************************************/


$(function () {
    buttadd();
    bindIngfo();
});

function buttadd() {
    $.ajax({
        url: '/Admin/CapabilityModel/GetNum?RoType=GetNum',
        Type: "post",
        dataType: "text", cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (da) {
            $("#num").html(da);
            if ($("#num").html() == 10) {
                $('#butAdd').attr("disabled", "disabled");
            }
            else {
                $('#butAdd').removeAttr("disabled");
            }
        }
    });
}

//新增学校
function Add() {
    //选择学校初始

    //重新赋值

    //表单清空
    $("#Add_form")[0].reset();
    layer.open({
        title: '新增能力',
        btn: ['确定', '取消'],
        area: ['450px', '400px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Add_div"),
        yes: function (index, layero) {//确认按钮事件

            Insert();

        }
    });
    //插件宽度
    $("#SelSchoolId_chosen").css('width', '100%');
}

function SearchInfo() {
    bindIngfo();
}

//列表数据加载 
function bindIngfo() {

    $.ajax({
        url: '/Admin/CapabilityModel/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "RoType": "getList", "CapabilityName": $("#txtCapabilityName").val() },
        success: function (tb) {

            var html = '';
            // var data = tb.Tb;//转换table

            if (tb.length > 0) {

                for (var i = 0; i < tb.length; i++) {
                    html += '<tr>';
                    //当前页面

                    //html += '<td>' + tb[i]["SerialNumber"] + '</td>';

                    html += '<td><span class="pie">' + (i + 1) + '</span></td>';

                    var t = tb[i]["AbilityInfo"].toString() == "" ? "--" : tb[i]["AbilityInfo"].toString().length > 30 ? tb[i]["AbilityInfo"].toString().substr(0, 30) + "..." : tb[i]["AbilityInfo"].toString();

                    html += '<td>' + tb[i]["AbilityName"] + '</td>';
                    html += "<td title='" + tb[i]["AbilityInfo"] + "'>" + t + '</td>';
                    html += '<td>' + tb[i]["AbilityUpperLimit"] + '</td>';

                    html += '<td><a class="btn-primary btn-sm  m-r-sm" onclick = "UpdateSort_Shang(' + tb[i]["ID"] + ',' + tb[i]["SerialNumber"] + ')">上移</a></td>';

                    html += '<td><a class="btn-warning btn-sm" onclick = "UpdateSort_Xia(' + tb[i]["ID"] + ',' + tb[i]["SerialNumber"] + ')">下移</a></td>';
                    if ($("#uids").val() != 1) {
                        if (tb[i]["AddUserId"] == $("#uids").val()) {
                            html += '<td><a  onclick="update(' + tb[i]["ID"] + ')"  class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xs"></i><span class="bold">编辑</span></button>';
                            html += '<a  onclick="Del(' + tb[i]["ID"] + ',' + tb[i]["SerialNumber"] + ')"  class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-trash m-r-xs"></i><span class="bold">删除</span></button></td>';
                        }
                        else {
                            html += '<td><a onclick="fzj()"  style = "background: #ddd;"    class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xs"></i><span class="bold">编辑</span></button>';
                            html += '<a onclick="fzj()"  style = "background: #ddd;"     class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-trash m-r-xs"></i><span class="bold">删除</span></button></td>';
                        }
                    }
                    else {
                        html += '<td><a  onclick="update(' + tb[i]["ID"] + ')"  class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xs"></i><span class="bold">编辑</span></button>';
                        html += '<a  onclick="Del(' + tb[i]["ID"] + ',' + tb[i]["SerialNumber"] + ')"  class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-trash m-r-xs"></i><span class="bold">删除</span></button></td>';
                    }
                    html += '</tr>';
                }
            }

            $("#tablelist").html(html);
            //bootstrapPaginator("#PaginatorLibrary", tb, bindIngfo);//分页
            //样式重新加载
            redload();

        }
    });
}
function fzj() {
    layer.msg('非当前登陆账号添加数据不可操作', { icon: 0 });
    return;
}

//向上排序
function UpdateSort_Shang(ID, SerialNumber) {
    $.ajax({
        type: "POST",
        dataType: "json",
        async: false,
        url: "/Admin/CapabilityModel/UpandDown",
        data: { "ID": ID, "Type": "-1", "SerialNumber": SerialNumber, "CapabilityName": $("#CapabilityName").val() },
        success: function (data) {

            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                //layer.msg('操作成功', { icon: 1 });
                bindIngfo();
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

//向下排序
function UpdateSort_Xia(ID, SerialNumber) {
    $.ajax({
        type: "POST",
        dataType: "json",
        async: false,
        url: "/Admin/CapabilityModel/UpandDown",
        data: { "ID": ID, "Type": "+1", "SerialNumber": SerialNumber, "CapabilityName": $("#CapabilityName").val() },
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                //layer.msg('操作成功', { icon: 1 });
                bindIngfo();
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


//新增方法
function Insert() {
    //新增校验
    var CapabilityName = $("#CapabilityName").val().trim();
    var AbilityProfile = $("#AbilityProfile").val();
    var CMScore = $("#CMScore").val();

    if (CapabilityName.length == 0) {
        layer.msg('请输入能力名称！');
        return;
    }
    if (!CheckCharacter(CapabilityName, '40')) {
        layer.msg('能力名称长度不能超过20个汉字');
        return;
    }

    if (CMScore.length == 0) {
        layer.msg('请输入分数上限');
        return;
    }
    if (parseInt(CMScore) == 0) {
        layer.msg('分数上限不能为0');
        return;
    }
     if (parseInt(CMScore)>1000) {
        layer.msg('分数上限不能大于1000');
        return;
    }
    //新增OK
    $.ajax({
        url: "/Admin/CapabilityModel/Add?RoType=Add",
        type: "post",
        //dataType: "application/json", cache: false,
        data: { "CapabilityName": CapabilityName, "AbilityProfile": AbilityProfile, "CMScore": CMScore },
        success: function (da) {
            if (da == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                buttadd();
                bindIngfo();
            }
            if (da == "77") {
                layer.msg('能力名称已经存在', { icon: 2 });
                return;
            }
            if (da == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });

}

//编辑按钮
function update(ID) {
    //选择学校初始

    //表单清空
    $("#Edit_form")[0].reset();
    //赋值
    $.ajax({
        url: '/Admin/CapabilityModel/GetListOne?RoType=One',
        type: "get",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "ID": ID },
        success: function (data) {
            if (data.length > 0) {
                //学校
                $("#EditCapabilityName").val(data[0]["AbilityName"]);
                //学院
                $("#EdntAbilityProfile").val(data[0]["AbilityInfo"]);

                $("#EdntCMScore").val(data[0]["AbilityUpperLimit"]);


            }

        }
    });

    layer.open({
        title: '编辑能力',
        btn: ['确定', '取消'],
        area: ['450px', '400px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Edit_div"),
        yes: function (index, layero) {//确认按钮事件
            Edit(ID);
        }
    });
    //插件宽度
    $("#SelSchoolId_chosen").css('width', '100%');
}

//编辑方法
function Edit(ID) {

    //校验
    var CapabilityName = $("#EditCapabilityName").val().trim();
    var AbilityProfile = $("#EdntAbilityProfile").val();
    var CMScore = $("#EdntCMScore").val();

    if (CapabilityName.length == 0) {
        layer.msg('请输入能力名称！');
        return;
    }
    if (!CheckCharacter(CapabilityName, '40')) {
        layer.msg('能力名称长度不能超过20个汉字');
        return;
    }

    //var patrn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;

    //if (patrn.test($("#EditCapabilityName").val())) {
    //    layer.msg('您输入的能力名称中含有非法字符!', { icon: 0 });
    //    return false;
    //}

    //if (patrn.test($("#EdntAbilityProfile").val())) {
    //    layer.msg('您输入的能力简介中含有非法字符!', { icon: 0 });
    //    return false;
    //}

    if (CMScore.length == 0) {
        layer.msg('请输入分数上限');
        return;
    }
    if (parseInt(CMScore) == 0) {
        layer.msg('分数上限不能为0');
        return;
    }
    if (parseInt(CMScore) > 1000) {
        layer.msg('分数上限不能大于1000');
        return;
    }
    $.ajax({
        url: '/Admin/CapabilityModel/Update?RoType=update',
        type: "post",
        //dataType: "text", cache: false,
        //contentType: "application/json; charset=utf-8",
        data: { "ID": ID, "CapabilityName": CapabilityName, "AbilityProfile": AbilityProfile, "CMScore": CMScore },
        success: function (da) {
            if (da == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                bindIngfo();
            }
            if (da == "77") {
                layer.msg('能力名称已经存在', { icon: 2 });
                return;
            }
            if (da == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}


//删除
function Del(ID, SerialNumber) {
    layer.confirm('相关的资源和能力分值设置都会去除该能力的相关设置，确认删除该能力？', {
        title: '删除能力',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                url: '/Admin/CapabilityModel/Del?RoType=Del',
                Type: "post",
                dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                data: { "ID": ID, "SerialNumber": SerialNumber },
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });
                        buttadd();
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
