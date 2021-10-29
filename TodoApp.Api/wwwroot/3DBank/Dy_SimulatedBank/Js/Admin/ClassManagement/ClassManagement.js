/***************************************************************
       FileName:管理员端 班级管理
       Copyright（c）2018-金融教育在线技术开发部
       Author:邵世铨
       Create Date:2018-02-26
       ******************************************************************/
$(function () {
    GetList();
})
//按回车执行搜索事件
document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) { // enter 键
        GetList();
    }
};
//修改
function Update(id) {
    ////清空新增下拉框
    $("#UpdateSchoolid").val('0');
    $("#UpdateSchoolid_chosen").find('a').find('span').html('请选择学校');
    //异常
    //$("#UpdateSchoolid_chosen").find('div').find('ul').find('li').each(function () {
    //    if (this.html() = '典阅大学2') {
    //        alert(this.html());
    //    }
    //    $(this).removeClass("result-selected");
    //})
    // $("#UpdateSchoolid_chosen").find('div').find('ul').find('li').removeClass("result-selected");   
    $("#UpdateCollegeNameId").val('0');
    $("#UpdateMajorid").val('0');
    $("#UpdateGrade").val('0');
    $("#UpdateClassid").val('');
    ////修改修改下拉框搜索宽度问题
    $("#UpdateSchoolid_chosen").css("width", "200px");


    //数据库调取 班级这一条数据

    $.ajax({
        type: "POST",
        dataType: "json",
        url: '/Admin/ClassManagement/GerClassinfo',
        data: { "C_ID": id },
        async: false,
        success: function (data) {
            if (data.length > 0) {
                var SchoolId = data[0]["SchoolId"];
                var CollegeId = data[0]["CollegeId"];
                var MajorId = data[0]["MajorId"];
                var TeacherId = data[0]["TeacherId"];
                var ClassName = data[0]["ClassName"];

                //赋值  加载学校
                $("#UpdateSchoolid").val(SchoolId);
                $("#UpdateSchoolid_chosen").find('a').find('span').html(data[0]["SchoolName"]);
                ///执行联动 加载学院
                SelecCollege('Update');
                //赋值
                $("#UpdateCollegeNameId").val(CollegeId);
                //加载专业
                GetMajor('Update')
                $("#UpdateMajorid").val(MajorId);
                //加载年级
               
                $("#UpdateGrade").val(TeacherId);
                $("#UpdateClassid").val(ClassName);
            }
        }

    });






    layer.open({
        title: '编辑班级',
        btn: ['确定', '取消'],
        area: ['450px', '450px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Update_Class"),
        yes: function (index, layero) {
            var Schoolid = $("#UpdateSchoolid").val();
            var CollegeNameId = $("#UpdateCollegeNameId").val();
            var Majorid = $("#UpdateMajorid").val();
            var Gradeid = $("#UpdateGrade").val();
            var ClassValue = $("#UpdateClassid").val();

            if (Schoolid == 0 || Schoolid == "") {
                layer.msg("学校不能为空!");
                return false;
            }
            if (CollegeNameId == 0 || CollegeNameId == "") {
                layer.msg("学院不能为空!");
                return false;
            }
            if (Majorid == 0 || Majorid == "") {
                layer.msg("专业不能为空!");
                return false;
            }
            if (Gradeid == 0 || Gradeid == "") {
                layer.msg("教师不能为空!");
                return false;
            }
            if (ClassValue == "") {
                layer.msg("班级名称不能为空!");
                return false;
            }

            $.ajax({
                url: '/Admin/ClassManagement/UpdateSave',
                Type: "Post",
                dataType: "json",
                cache: false,
                contentType: "application/json; charset=utf-8",
                data: { "Schoolid": Schoolid, "CollegeNameId": CollegeNameId, "Majorid": Majorid, "Gradeid": Gradeid, "ClassValue": ClassValue, "Classid": id },
                success: function (json) {
                    if (json == 1) {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });

                        GetList();
                        redload();
                    }
                }

            });
        },
    });


}



//加载下拉搜索时框
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

//当选中学院时触发查询学院的事件
function SelecCollege(type) {
    var id = "";
    if (type == "List") {
        id = $("#Schoolid").val();
    } else if (type == "Add") {
        id = $("#AddSchoolid").val();
        Grade('Add');

    } else if (type == "Update") {
        id = $("#UpdateSchoolid").val();
        Grade('Update');
    }
    $.ajax({
        url: '/Admin/ClassManagement/GetCollege',
        Type: "post",
        dataType: "json",
        async: false,
        data: { "Schoolid": id },
        success: function (json) {
            var data = eval(json);
            var html = "<option value=\"0\">请选学院</option>";
            for (var i = 0; i < data.length; i++) {
                html += "<option value=" + data[i].C_ID + ">" + data[i].CollegeName + "</option>";
            }


            if (type == "List") {
                $("#CollegeNameId").html(html);

                GetMajor('List');
            } else if (type == "Add") {
                $("#AddCollegeNameId").html(html);
            }
            else if (type == "Update") {

                $("#UpdateCollegeNameId").html(html);
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

    layer.confirm('您确认要删除选中的班级吗？', {
        title: '删除班级',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
    function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: '/Admin/ClassManagement/Delete',
            data: { "Ids": chkstr },//多个Id
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
//单个删除
function Delete(id) {
    layer.confirm('您确认要删除该班级吗？', {
        title: '删除班级',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
   function () {
       $.ajax({
           type: "POST",
           dataType: "text",
           url: '/Admin/ClassManagement/Delete',
           data: { "Ids": id },//单个Id
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

function Select() {
    GetList();
}
//当选中学院的时候查询专业

function GetMajor(type) {
    var id = "";
    if (type == "List") {
        id = $("#CollegeNameId option:selected").val();
    } else if (type == "Add") {
        id = $("#AddCollegeNameId option:selected").val();
    }
    else if (type == "Update") {
        id = $("#UpdateCollegeNameId option:selected").val();
    }
    var Schoolid = "";
    if (type == "List") {
        Schoolid = $("#Schoolid").val();
        if (Schoolid == 0) {
            layer.msg("请选择学校!");
            return false
        }
    } else if (type == "Add") {
        Schoolid = $("#AddSchoolid").val();
        if (Schoolid == 0) {
            layer.msg("请选择学校!");
            return false
        }
    }
    else if (type == "Update") {
        Schoolid = $("#UpdateSchoolid option:selected").val();

        if (Schoolid == 0) {
            layer.msg("请选择学校!");
            return false
        }
    }
    $.ajax({
        url: '/Admin/ClassManagement/GetMajor',
        Type: "Post",
        dataType: "json",
        async: false,
        data: { "Majorid": id, "Schoolid": Schoolid },
        success: function (json) {
            var data = eval(json);
            var html = "<option value=\"0\">请选择专业</option>";
            for (var i = 0; i < data.length; i++) {
                html += "<option value=" + data[i].M_ID + ">" + data[i].MajorName + "</option>";
            }
            if (type == "List") {
                $("#Majorid").html(html);
            } else if (type == "Add") {
                $("#AddMajorid").html(html);
            }
            else if (type == "Update") {
                $("#UpdateMajorid").html(html);
            }
        }

    });

}


//新增加载年级
function Grade(type) {
    var Schoolid = "";
    if (type == "Add") {
        Schoolid = $("#AddSchoolid").val();
        if (Schoolid == 0) {
            layer.msg("请选择学校!");
            return false
        }
    }
    else if (type == "Update") {
        Schoolid = $("#UpdateSchoolid option:selected").val();

        if (Schoolid == 0) {
            layer.msg("请选择学校!");
            return false
        }
    }

    $.ajax({
        url: '/Admin/ClassManagement/GetGrade?SchoolId=' + Schoolid,
        Type: "post",
        dataType: "json",
        async: false,
        success: function (json) {

            var data = eval(json);
            var html = "<option value=\"0\">请选择教师</option>";
            for (var i = 0; i < data.length; i++) {
                html += "<option value=" + data[i].UserId + ">" + data[i].TeacherName + "</option>";
            }
            if (type == "Add") {
                $("#AddGrade").html(html);
            }
            else if (type == "Update") {
                $("#UpdateGrade").html(html);
            }

        }
    });
}



//加载班级列表
function GetList(page) {
    var PageSize = 10;
    var Schoolid = $("#Schoolid option:selected").val();
    var Collegeid = $("#CollegeNameId option:selected").val();
    var Majorid = $("#Majorid option:selected").val();
    //var Gradeid = $("#Gradeid option:selected").val();
    var ClassNameid = $("#ClassNameid").val();
    $.ajax({
        url: '/Admin/ClassManagement/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "Page": page, "PageSize": PageSize, "Schoolid": Schoolid, "Collegeid": Collegeid, "Majorid": Majorid, "Gradeid": "0", "ClassName": ClassNameid },
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
                html += '<td><input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["C_ID"] + '></td>';
                html += '<td>' + data[i]["SchoolName"] + '</td>';
                html += '<td>' + data[i]["CollegeName"] + '</td>';
                html += '<td>' + data[i]["MajorName"] + '</td>';
                html += '<td>' + data[i]["GradeYear"] + '</td>';
                html += '<td>' + data[i]["ClassName"] + '</td>';
                html += '<td>' + data[i]["xuesheng"] + '</td>';
                html += '<td><a onclick="Update(' + data[i]["C_ID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>';
                html += '<a href="/Admin/ClassMember?id=' + data[i]["C_ID"] + '" class=" btn-success btn-sm m-r-sm"><i class="fa fa-user m-r-xxs"></i>学生管理 </a>';
                html += '<a onclick="Delete(' + data[i]["C_ID"] + ')" class=" btn-warning btn-sm "><i class="fa fa-trash m-r-xs"></i>删除 </a></td>';
                html += '</tr>';
            }
            $("#tablelist").html(html);
            bootstrapPaginator("#PaginatorLibrary", tb, GetList);//分页
            //样式重新加载
            redload();
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
//新增班级
function Add_Class() {
    //清空新增下拉框
    $("#AddSchoolid_chosen").find('a').find('span').html('请选择学校');
    $("#AddSchoolid").val('0');
    $("#AddCollegeNameId").val('0');
    $("#AddMajorid").val('0');
    $("#AddGrade").val('0');
    $("#AddClassid").val('');
   

    layer.open({
        title: '新增班级',
        btn: ['确定', '取消'],
        area: ['450px', '450px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Add_Class"),
        yes: function (index, layero) {

            var Schoolid = $("#AddSchoolid option:selected").val();
            if (Schoolid == 0 || Schoolid == "") {
                layer.msg("学校不能为空!");
                return false;
            }
            var Collegeid = $("#AddCollegeNameId option:selected").val();
            if (Collegeid == 0 || Collegeid == "") {
                layer.msg("学院不能为空!");
                return false;
            }
            var Majorid = $("#AddMajorid option:selected").val();
            if (Majorid == 0 || Majorid == "") {
                layer.msg("专业不能为空!");
                return false;
            }
            var Gradeid = $("#AddGrade option:selected").val();
            if (Gradeid == 0 || Gradeid == "") {
                layer.msg("教师不能为空!");
                return false;
            }
            var ClassName = $("#AddClassid").val();
            if (ClassName == "") {
                layer.msg("班级名称不能为空!");
                return false;
            }
            //检查是否存在相同的班级
            //提交数据
            $.ajax({
                url: '/Admin/ClassManagement/AddClass',
                Type: "Post",
                dataType: "json",
                async: false,
                data: { "Schoolid": Schoolid, "Collegeid": Collegeid, "Majorid": Majorid, "TeacherId": Gradeid, "ClassName": ClassName },
                success: function (json) {
                    if (json == 1) {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('新增成功', {
                            icon: 1
                        });
                        GetList();
                    } else
                        if (json == 2) {
                            layer.closeAll();//关闭所有弹出框
                            layer.msg("该学校下已经存在相同班级名称!");
                        }
                }
            });
        },
    });
    //修改新增下拉框搜索宽度问题
    $("#AddSchoolid_chosen").css("width", "200px");
    //清空新增下拉框
    $("#AddSchoolid_chosen").find('a').find('span').html('请选择学校');
    $("#AddCollegeNameId").val('0');
    $("#AddMajorid").val('0');
    $("#AddGrade").val('0');
    $("#AddClassid").val('');
    
}