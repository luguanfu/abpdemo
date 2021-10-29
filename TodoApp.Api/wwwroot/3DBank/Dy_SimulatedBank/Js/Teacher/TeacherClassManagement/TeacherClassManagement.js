/***************************************************************
       FileName:管理员端 班级管理
       Copyright（c）2018-金融教育在线技术开发部
       Author:邵世铨
       Create Date:2018-03-06
       ******************************************************************/
$(function () {
    GetList();
})


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
    }
    $.ajax({
        url: '/Admin/TeacherClassManagement/GetCollege',
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
            }
        }

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
    }
    var Schoolid = "";
    if (type == "List") {
        Schoolid = $("#Schoolid").val();
        if (Schoolid == 0) {
            layer.msg("请选择学校!");
            return false
        }
    }
    $.ajax({
        url: '/Admin/TeacherClassManagement/GetMajor',
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
    var ClassNameid = $("#ClassNameid").val();
    $.ajax({
        url: '/Admin/TeacherClassManagement/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "Page": page, "PageSize": PageSize, "Schoolid": Schoolid, "Collegeid": Collegeid, "Majorid": Majorid, "ClassName": ClassNameid },
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
                html += '<td>' + data[i]["ClassName"] + '</td>';
                html += '<td>' + data[i]["xuesheng"] + '</td>';
                html += '<td>';
                html += '<a href="/Admin/TeacherClassMember?id=' + data[i]["C_ID"] + '" class=" btn-success btn-sm"><i class="fa fa-user m-r-xxs"></i>学生管理 </a></td>';
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
