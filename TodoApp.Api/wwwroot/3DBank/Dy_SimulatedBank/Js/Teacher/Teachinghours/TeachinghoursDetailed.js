/***************************************************************
  FileName:教师端  课时安排详情  javascript
  Copyright（c）2018-金融教育在线技术开发部
  Author:伍贤成
  Create Date:2018-07-23
 ******************************************************************/

$(function () {

    Select();

})

var sum = 0;
function Select(page) {

    var PageSize = 10;

    $.ajax({
        url: '/Admin/Teachinghours/GetCurriculumList',
        Type: "Post",
        dataType: "json",
        async: true,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "CurriculumName": $("#CurriculumName").val() },
        success: function (tb) {
            var html = "";
            var data = tb.Tb;//转换table
            for (var i = 0; i < data.length; i++) {
                //当前页
                html += '<tr>';
                //当前页面
                var idx = 0;
                if (page != "undefined" && page != null) {
                    idx = page;
                    idx = idx - 1;
                }
                html += '<td  width="80"><input type="checkbox" class="i-checks" name="inputTo[]" value="' + data[i]["ID"] + '"></td>';
                html += '<td><span class="pie">' + ((idx * PageSize) + i + 1) + '</span></td>';
                html += '<td><span class="pie">' + data[i]["CurriculumName"] + '</span></td>';
                html += '<td><span class="pie">' + data[i]["ChapterCount"] + '</span></td>';
                html += '<td><span class="pie">' + data[i]["SectionCount"] + '</span></td>';
                html += '<td> <a onclick="EditX(' + getQueryString("id") + ',' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑课时 </a>'
                html += '</tr>';
            }
            $("#tablelist").html(html);
            //$("#bdNum").html("添加课时安排");
            bootstrapPaginator("#PaginatorLibrary", tb, Select);//分页
            //样式重新加载
            redload();
        }
    });
}

function EditX(cid, sid) {
    window.location.href = "/Admin/Teachinghours/DetailedInfo?cid=" + cid + "&sid=" + sid;
}

//样式
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

function FormRest() {
    layer.closeAll();//关闭
    $('#Add_baodan')[0].reset();//清空表单数据
}

var Hid = "";

//编辑
function Edit() {

    var strid = document.getElementsByName("inputTo[]");//name
    var strids = "";
    var n = 0;//统计已获得ID数
    for (var i = 0; i < strid.length; i++) {
        if (strid[i].checked == true) {
            strids += strid[i].value + ",";
            n++;
        }
    }

    if (n == 0) {
        layer.msg('请选择要修改的数据！');
        return;
    }
    if (n > 1) {
        layer.msg('只能选择一条数据修改！');
        return;
    }

    strids = strids.substr(0, strids.length - 1);

    $.ajax({
        Type: "post",
        dataType: "json",
        url: "/Admin/Teachinghours/GetDetailedList",
        data: { "Ids": strids, "Type": "2" },
        async: false,
        success: function (data) {
            if (data.length > 0) {

                $("#StudyTime1").val(data[0]["LongLearningTime"]);
                $("#Nr1").val(data[0]["LearningContent"]);
            }
        }
    });

    Hid = strids;
    BjOpen();
}

//添加课时安排
function Add_Ks() {
    TcOpen();
}

//弹窗
function TcOpen() {
    $("#StudyTime").val("");
    $("#Nr").val("");
    layer.open({
        title: '课时安排',
        //btn: ['确定', '取消'],
        area: ['450px', '350px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Add_baodan"),

    });
}

//编辑弹窗
function BjOpen() {

    layer.open({
        title: '课时安排',
        //btn: ['确定', '取消'],
        area: ['450px', '350px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Add_baodan1"),

    });
}

//新增
function Bt() {

    var StudyTime = $("#StudyTime").val();
    var Nr = $("#Nr").val();

    if (StudyTime.length == 0 || StudyTime.length > 10) {
        layer.msg('请输入学习时长且不超过10个字符！', function () { });
        return;
    }
    if (Nr.length == 0 || Nr.length > 100) {
        layer.msg('请输入学习内容且不超过100个字符！', function () { });
        return;
    }

    //表单提交
    $.ajax({
        type: "post",
        url: '/Admin/Teachinghours/EditAdd',
        data: { "StudyTime": StudyTime, "Nr": Nr },
        dataType: "json",
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                Select();
                layer.msg('操作成功', { icon: 1 });
            }

            if (data == "99") {
                layer.msg('操作失败,操作数据未发生改变', { icon: 2 });
                return;
            }
            if (data == "88") {
                layer.msg('操作异常', { icon: 2 });
                return;
            }
        }
    });
}

//编辑
function Bj() {

    var StudyTime = $("#StudyTime1").val();
    var Nr = $("#Nr1").val();

    if (StudyTime.length == 0 || StudyTime.length > 10) {
        layer.msg('请输入学习时长且不超过10个字符！', function () { });
        return;
    }
    if (Nr.length == 0 || Nr.length > 100) {
        layer.msg('请输入学习内容且不超过100个字符！', function () { });
        return;
    }

    //表单提交
    $.ajax({
        type: "post",
        url: '/Admin/Teachinghours/Bj?Id=' + Hid,
        data: { "StudyTime": StudyTime, "Nr": Nr },
        dataType: "json",
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                Select();
                layer.msg('操作成功', { icon: 1 });
            }
            if (data == "99") {
                layer.msg('操作异常', { icon: 2 });
                return;
            }
        }
    });
}

//删除
function Del() {

    var strid = document.getElementsByName("inputTo[]");
    var strids = "";
    for (var i = 0; i < strid.length; i++) {
        if (strid[i].checked == true) {
            strids += strid[i].value + ",";
        }
    }

    if (strids.length == 0) {
        layer.msg('请选择一条数据删除');
        return;
    }

    strids = strids.substr(0, strids.length - 1);

    layer.confirm('您确定要删除吗？', {
        title: '删除',
        btn: ['确定', '取消'],
        shadeClose: true, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/Teachinghours/Del',
                data: { "Ids": strids },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        Select();
                        layer.msg('操作成功', { icon: 1 });

                    }
                    if (data == "99") {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}

// 恢复进入该班级下面的所选课程的开课时间
function Reset() {
    layer.confirm('您确定要重置课时安排吗？', {
        title: '重置安排',
        btn: ['确定', '取消'],
        shadeClose: true, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            var cid = getQueryString("id");
            var strid = document.getElementsByName("inputTo[]");
            var strids = "";
            for (var i = 0; i < strid.length; i++) {
                if (strid[i].checked == true) {
                    strids += strid[i].value + ",";
                }
            }
            if (strids.length == 0) {
                layer.msg('请至少选择一条课程数据');
                return;
            }

            strids = strids.substr(0, strids.length - 1);

            //alert(strids);
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/Teachinghours/ResetSetingForClassid',
                data: { "cid": cid, "strid": strids },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        Select();
                        layer.msg('操作成功', { icon: 1 });

                    }
                    if (data == "99") {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}