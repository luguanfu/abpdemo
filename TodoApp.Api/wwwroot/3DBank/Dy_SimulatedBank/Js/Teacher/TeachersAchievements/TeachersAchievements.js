/***************************************************************
       FileName:教师端 成绩管理
       Copyright（c）2018-金融教育在线技术开发部
       Author:wxc
       Create Date:2019年7月3日12:08:08
       ******************************************************************/

$(function () {
    Getmodule();//模块下拉框初始化
    SelectSchool();
    GetList();

})

//按回车执行搜索事件
document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) { // enter 键
        GetList();
    }
};

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

//学校下拉框列表
function SelectSchool() {
    var id = "";
    id = $("#Schoolid").val();

    $.ajax({
        url: '/Admin/TeachersAchievements/GetSchool',
        Type: "post",
        dataType: "json",
       // async: false,
        data: { "Schoolid": id },
        success: function (json) {
            var data = eval(json);
            var html = "<option value=\"0\">请选学校</option>";
            for (var i = 0; i < data.length; i++) {
                html += "<option value=" + data[i].S_ID + ">" + data[i].SchoolName + "</option>";
            }

            $("#Schoolid").html(html);

        }

    });

}

//当选中学院时触发查询学院的事件
function SelecCollege() {
    var id = "";
    id = $("#Schoolid").val();

    $.ajax({
        url: '/Admin/TeachersAchievements/GetCollege',
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

            $("#CollegeNameId").html(html);

            GetMajor(); //绑定专业

        }

    });

}

//当选中学院的时候查询专业
function GetMajor() {
    var id = "";
    id = $("#CollegeNameId option:selected").val();
    var Schoolid = "";
    Schoolid = $("#Schoolid option:selected").val();

    $.ajax({
        url: '/Admin/TeachersAchievements/GetMajor',
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

            $("#Majorid").html(html);

            GetClass();//绑定班级

        }

    });

}

//获得班级信息
function GetClass() {
    var id = "";
    id = $("#CollegeNameId option:selected").val();//学院id
    var Schoolid = "";
    Schoolid = $("#Schoolid option:selected").val(); //学校id
    var Majorid = $("#Majorid option:selected").val();//专业id

    $.ajax({
        url: '/Admin/TeachersAchievements/GetClass',
        Type: "Post",
        dataType: "json",
        async: false,
        data: { "Collegeid": id, "Schoolid": Schoolid, "Majorid": Majorid },
        success: function (json) {
            var data = eval(json);
            var html = "<option value=\"0\">请选择班级</option>";
            for (var i = 0; i < data.length; i++) {
                html += "<option value=" + data[i].C_ID + ">" + data[i].ClassName + "</option>";
            }

            $("#ClassId").html(html);

        }

    });

}

//获得模块信息
function Getmodule() {
    $.ajax({
        url: '/Admin/TeachersAchievements/Getmodule',
        Type: "Post",
        dataType: "json",
        //async: false,
        data: {},
        success: function (json) {
            var data = eval(json);
            var html = "<option value=\"0\">请选择模块</option>";
            for (var i = 0; i < data.length; i++) {
                html += "<option value=" + data[i].ID + ">" + data[i].ModularName + "</option>";
            }

            $("#moduleId").html(html);

        }

    });
}


function Select() {
    GetList();
}

//加载班级列表
function GetList(page) {
    var PageSize = 10;
    var Schoolid = $("#Schoolid option:selected").val();
    var Collegeid = $("#CollegeNameId option:selected").val();
    var Majorid = $("#Majorid option:selected").val();
    var ClassId = $("#ClassId option:selected").val();
    var moduleId = $("#moduleId option:selected").val();
    var LoginNoName = $("#LoginNoName").val();
    var taskName = $("#taskName").val();

    $.ajax({
        url: '/Admin/TeachersAchievements/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "Page": page, "PageSize": PageSize, "Schoolid": Schoolid, "Collegeid": Collegeid, "Majorid": Majorid, "ModuleId": moduleId, "ClassId": ClassId, "LoginNoName": LoginNoName, "TaskName": taskName },
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
                //html += '<td><input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["C_ID"] + '></td>';
                if (data[i]["SchoolName"] == null) {
                    data[i]["SchoolName"] = "--";
                }
                html += '<td>' + data[i]["SchoolName"] + '</td>';
                html += '<td>' + data[i]["CollegeName"] + '</td>';
                html += '<td>' + data[i]["MajorName"] + '</td>';
                html += '<td>' + data[i]["ClassName"] + '</td>';
                html += '<td>' + data[i]["LoginNo"] + '</td>';
                html += '<td>' + data[i]["Name"] + '</td>';
                html += '<td>' + data[i]["TaskName"] + '</td>';
                html += '<td>' + data[i]["ModularName"] + '</td>';
                html += '<td>' + new Date(data[i]["UpdateTime"]).Format("yyyy-MM-dd hh:mm:ss")+ '</td>';
                html += '<td>' + data[i]["Scores"] + '</td>';
                html += '</tr>';
            }
            $("#tablelist").html(html);
            bootstrapPaginator("#PaginatorLibrary", tb, GetList);//分页
        }
    });
}

//导出excel
function exportExcel() {
    var Schoolid = $("#Schoolid option:selected").val();
    var Collegeid = $("#CollegeNameId option:selected").val();
    var Majorid = $("#Majorid option:selected").val();
    var ClassId = $("#ClassId option:selected").val();
    var moduleId = $("#moduleId option:selected").val();
    var LoginNoName = $("#LoginNoName").val();
    var taskName = $("#taskName").val();

    $.ajax({
        Type: "post",
        dataType: "json",
        url: '/Admin/TeachersAchievements/ExportExcelData',
        data: { "Schoolid": Schoolid, "Collegeid": Collegeid, "Majorid": Majorid, "ModuleId": moduleId, "ClassId": ClassId, "LoginNoName": LoginNoName, "TaskName": taskName },
        async: false,
        success: function (data) {
            $("#downFile").attr("href", "/Admin/TeachersAchievements/ProcessRequest?downurl=" + data[0]["filename"]);
            $("#tf").click();
        }
    });

}

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}