$(function () {
    bindIngfo();
    $("#AddSchool").change(function () {
        CollegeList();
    })
    bindSchoolList();
    $("#School").change(function () {
        bindCollegeList();
    })
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
function bindCollegeList() {
    var S_ID = $("#School").val();
    $.ajax({
        url: '/Admin/MajorOrTeacher/CollegeList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { S_ID: S_ID },
        success: function (tb) {
            var html = '<option value="">请选择学院</option>';
            if (tb != null && tb.length > 0) {
                for (var i = 0; i < tb.length; i++) {
                    html += '<option value="' + tb[i]["C_ID"] + '">' + tb[i]["CollegeName"] + '</option>';
                }
            }
            $("#College").html(html);
           
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
    var College = $("#College").find("option:selected").val();
    var Keyword = $("#Keyword").val();
    var PageSize = 10;
    $.ajax({
        url: '/Admin/MajorOrTeacher/MajorGetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, School: School, College: College, Keyword: Keyword },
        success: function (tb) {

            var data = tb.Tb;//转换table
            var html = '';
            for (var i = 0; i < data.length; i++) {//遍历生成 html

                html += '<tr>';
                html += '<td><input type="checkbox" class="i-checks" name="input[]" value="' + data[i]["M_ID"] + '"></td>';
                html += '</td>';
                html += '<td>' + data[i]["SchoolName"] + '<input  type="hidden" value="' + data[i]["SchoolId"] + '"></td>';
                html += '<td>' + data[i]["CollegeName"] + '<input  type="hidden" value="' + data[i]["CollegeId"] + '"></td>';
                html += '<td>' + data[i]["MajorName"] + '</td>';
                html += '<td>' + data[i]["ClassCou"] + '</td>';
                html += '<td>' + data[i]["StudentCou"] + '</td>';
                html += '<td>';
                html += '<a onclick="Update_school(this);" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑</a>';
                html += '<a onclick="del(' + data[i]["M_ID"] + ')" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a></td>';
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
    $("#Add_Major").find("input").val("");
    $("#Add_Major").find("select").val("");
    CollegeList();
}
function SchoolList(SchoolName, CollegeName) {
    $.ajax({
        url: '/Admin/MajorOrTeacher/SchoolList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: {  },
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
                CollegeList(CollegeName);
            }
        }
    });
}

function CollegeList(CollegeName) {
    var S_ID = $("#AddSchool").val(); 
    $.ajax({
        url: '/Admin/MajorOrTeacher/CollegeList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { S_ID: S_ID},
        success: function (tb) {
            var html = '<option value="">请选择学院</option>';
            if (tb != null && tb.length > 0) {
                for (var i = 0; i < tb.length; i++) {
                    html += '<option value="' + tb[i]["C_ID"] + '">' + tb[i]["CollegeName"] + '</option>';
                }
            }
            $("#AddCollege").html(html);
            if (!IsNullOrEmpty(CollegeName)) {
                $("#AddCollege").val(CollegeName);
            }
        }
    });
}

function Update_school(obj) {
    Restore();
    var tr = $(obj).parent().parent()
    var M_ID = $(tr).find("input[name='input[]']").val();
    var SchoolName = $(tr).find("td").eq(1).find("input").val();
    var CollegeName = $(tr).find("td").eq(2).find("input").val();
    var MajorName = $(tr).find("td").eq(3).html();

    $("#M_ID").val(M_ID);
    $("#AddMajorName").val(MajorName);
    SchoolList(SchoolName, CollegeName);

    Add_Major(1);
}

//新增学校
function Add_Major(t) {
    var telte = "新增专业";
    if (t == 1) {
        telte = "修改专业";
    } else {
        Restore();
        SchoolList();
        //CollegeList();
    }

    layer.open({
        title: telte,
        btn: ['确定', '取消'],
        area: ['450px', '300px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Add_Major"),
        yes: function (index, layero) {
            Add();

        },
    });
}
function Add() {
    var M_ID = $("#M_ID").val();
    var MajorName = $("#AddMajorName").val();
    var School = $("#AddSchool").val();
    var College = $("#AddCollege").val();
    if (IsNullOrEmpty(School)) {
        layer.msg('请选择学校');
        return
    }
    if (IsNullOrEmpty(College)) {
        layer.msg('请选择学院');
        return
    }
    if (IsNullOrEmpty(MajorName)) {
        layer.msg('专业名称不能为空');
        return
    }
    if (MajorName.length > 15) {
        layer.msg('专业名称长度不能超过15个汉字');
        return;
    }
    $.ajax({
        url: '/Admin/MajorOrTeacher/EditMajor',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { M_ID: M_ID, MajorName: MajorName, School: School, College: College },
        success: function (tb) {
            if (tb == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('保存成功', { icon: 1 });
                bindIngfo();
            } else if (tb == "2") {
                layer.msg('专业名称已经存在', { icon: 2 });
                return;
            } else {
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

    layer.confirm('您确认要删除选中的专业吗？', {
        title: '删除专业',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/MajorOrTeacher/DelMajor',
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
    layer.confirm('您确认要删除选中的专业吗？', {
        title: '删除专业',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/MajorOrTeacher/DelMajor',
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

