
$(function () {
    GetList();
});


function GetList(page) {
    var PageSize = 10;

    $.ajax({
        url: '/Admin/CaseManagement/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "SearchName": $("#SearchName").val(), "EnabledState": $("#EnabledState").val(), "PublicState": $("#PublicState").val()},
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

                var HasAuth = data[i]["HasAuth"];

                html += `<td><input type="checkbox" class="i-checks" name="input[]" value=${data[i]["ID"]} data-hasauth="${HasAuth}"></td>`;
                html += '<td>' + data[i]["TaskName"] + '</td>';
                html += '<td>' + (data[i]["StartScene"] == "1" ? '开启' : '-') + '</td>';
                html += '<td>' + (data[i]["HallScene"] == "1" ? '开启' : '-') + '</td>';
                html += '<td>' + (data[i]["CounterScene"] == "1" ? '开启' : '-') + '</td>';
                html += '<td>' + (data[i]["EndScene"] == "1" ? '开启' : '-') + '</td>';

                html += '<td>' + data[i]["CustomNum"] + '</td>';

                html += '<td>' + (data[i]["PublicState"] == "1" ? '公开案例' : '隐藏案例') + '</td>';
                html += '<td>' + (data[i]["EnabledState"] == "1" ? '已激活' : '未激活') + '</td>';
                html += '<td>' + (data[i]["IsAccessibility"] == "1" ? '开启' : '关闭') + '</td>';
                var sectionName = '';
                if (data[i]["SectionName"] != null) {
                    sectionName += data[i]["CourseName"] + '-';
                    sectionName += data[i]["ChapterName"] + '-';
                    sectionName += data[i]["SectionName"];
                } else {
                    sectionName = '-';
                }
                html += '<td>' + sectionName + '</td>';
                
                
                if (HasAuth == "1") {
                    html += '<td><a onclick="update(' + data[i]["ID"] + ',' + data[i]["EnabledState"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>';
                    html += '<a onclick="PreviewTask(' + data[i]["ID"] + ')" class="btn btn-success btn-sm m-r-sm"><i class="fa fa-eye m-r-xxs"></i>案例预览 </a>';
                    //html += '<a onclick="ChapterShow(' + data[i]["ID"] + ')" class="btn btn-info btn-sm m-r-sm"><i class="fa fa-tags m-r-xxs"></i>复制案例 </a>';
                    html += '<a onclick="ChapterLink(' + data[i]["ID"] + ',' + data[i]["CourseId"] + ',' + data[i]["ChapterId"] + ',' + data[i]["SectionId"] + ')" class="btn btn-success btn-sm m-r-sm"><i class="fa fa-share-alt m-r-xxs"></i>关联课程章节 </a>';
                    html += '<a onclick="del(' + data[i]["ID"] + ')" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a></td>';
                }
                else {
                    html += '<td><a disabled="disabled"  class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>';
                    html += '<a onclick="PreviewTask(' + data[i]["ID"] + ')" class="btn btn-success btn-sm m-r-sm"><i class="fa fa-eye m-r-xxs"></i>案例预览 </a>';
                    //html += '<a onclick="ChapterShow(' + data[i]["ID"] + ')" class="btn btn-info btn-sm m-r-sm"><i class="fa fa-tags m-r-xxs"></i>复制案例 </a>';
                    html += '<a disabled="disabled"  class="btn btn-success btn-sm m-r-sm"><i class="fa fa-share-alt m-r-xxs"></i>关联课程章节 </a>';
                    html += '<a disabled="disabled"  class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a></td>';
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

//新增跳转
function AddCase() {
    window.location.href = "/Admin/CaseManagement/AddOrEdit?addtype=1&operscene=1";
}

//修改
function update(id, EnabledState)
{
    if (EnabledState == 2) {
        window.location.href = "/Admin/CaseManagement/AddOrEdit?addtype=2&operscene=1&taskid=" + id;
    }
    else {
        layer.msg('已激活的案例应不允许编辑！', function () {
            return;
        });
    }
}

//单删除
function del(SID) {
    layer.confirm('您确认要删除选中的案例吗？', {
        title: '删除案例',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
 function () {
     $.ajax({
         type: "POST",
         dataType: "text",
         url: '/Admin/CaseManagement/DelCase',
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

function del_all() {

    var chks = document.getElementsByName('input[]');//name
    var chkstr = "";

    var hasAuth = 1;

    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
            if ($(chks[i]).data("hasauth") != "1") {
                hasAuth = 0;
                break;
            }
        }
    }

    if (hasAuth == 0) {
        layer.msg('您没有权限操作所选数据', { icon: 2 });
        return;
    }

    if (chkstr.length == 0) {
        layer.alert('请选择要删除的案例！', {
            skin: 'layui-layer-lan'
            , closeBtn: 0
        });
        return;
    }
    //去除逗号
    chkstr = chkstr.substr(0, chkstr.length - 1);

    layer.confirm('您确认要删除选中的案例吗？', {
        title: '删除案例',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/CaseManagement/DelCase',
                data: { "Ids": chkstr },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });
                        GetList();
                    }
                    if (data == "77") {
                        layer.msg('请先删除标签下的试题', { icon: 2 });
                        return;
                    }
                    if (data == "99") {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}
//禁用，启用
function SetStatus(fieldName,status)
{
    var Txt = "";
    if (fieldName == "PublicState") {
        if (status == "1") {
            Txt = "公开";
        }
        else if (status == "2") {
            Txt = "隐藏";
        }
    } else if (fieldName == "EnabledState") {
        if (status == "1") {
            Txt = "激活";
        }
        else if (status == "2") {
            Txt = "关闭激活";
        }
    }

    var hasAuth = 1;
    
    var chks = document.getElementsByName('input[]');//name
    var chkstr = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";

            if ($(chks[i]).data("hasauth") != "1") {
                hasAuth = 0;
                break;
            }
        }
        
    }
    if (hasAuth == 0) {
        layer.msg('您没有权限操作所选数据', { icon: 2 });
        return;
    }
    if (chkstr.length == 0) {
        layer.alert('请先选择要' + Txt + '数据！', {
            skin: 'layui-layer-lan'
            , closeBtn: 0
        });
        return;
    }
    //去除逗号
    chkstr = chkstr.substr(0, chkstr.length - 1);

    layer.confirm('您确认要'+Txt+'选中的数据吗？', {
        title: '' + Txt + '案例',
        btn: ['确定', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
    function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: '/Admin/CaseManagement/UpdateCase',
            data: { "Ids": chkstr, "FieldName": fieldName, "Status": status },
            success: function (data) {
                if (data == 1) {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg('操作成功', { icon: 1 });
                    GetList();
                }
                if (data ==-1) {
                    layer.msg('操作失败', { icon: 2 });
                    return;
                }
            }
        })
    });
}


function ChapterLink(TaskId, CourseId, ChapterId, SectionId)
{
    $("#LinkTaskId").val(TaskId);

    $("#LinkCourseId").val("0");
    $("#LinkChapterId").val("0");
    $("#LinkSectionId").val("0");

    if (SectionId != null) {
        $("#LinkCourseId").val(CourseId);
        $("#LinkChapterId").val(ChapterId);
        $("#LinkSectionId").val(SectionId);
    }

    layer.open({
        title: "关联课程章节",
        //btn: ['确定', '取消'],
        area: ['950px', '720px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#LinkSection"),

    });

    GetCourseList();

}

function GetCourseList()
{
    $.ajax({
        url: '/Admin/CaseManagement/GetCourseList',
        Type: "post",
        dataType: "json",
        async: false,
        data: {},
        success: function (json) {
            var data = eval(json);
            var html = "<option value=\"0\">请选择课程</option>";
            for (var i = 0; i < data.length; i++) {
                html += "<option value=" + data[i].ID + ">" + data[i].CourseName + "</option>";
            }
            $("#Course").html(html);

            if ($("#LinkCourseId").val() != "0") {
                $("#Course").val($("#LinkCourseId").val());
                SelCourse(1);
            }
            else {
                GetSectionList(1);
            }
        }
    });
}

function SelCourse(isFit)
{
    var CourseId = $("#Course").val();
    $.ajax({
        url: '/Admin/CaseManagement/GetChapterList',
        Type: "post",
        dataType: "json",
        async: false,
        data: { CourseId: CourseId},
        success: function (json) {
            var data = eval(json);
            var html = "<option value=\"0\">请选择章</option>";
            for (var i = 0; i < data.length; i++) {
                html += "<option value=" + data[i].ID + ">" + data[i].ChapterName + "</option>";
            }
            $("#Chapter").html(html);

            if (isFit == 1) {
                if ($("#LinkChapterId").val() != "0") {
                    $("#Chapter").val($("#LinkChapterId").val());
                    GetSectionList(1);
                }
                else {
                    GetSectionList(1);
                }
            }
        }
    });
}

function GetSectionList(page)
{
    var CourseId = $("#Course").val();
    var ChapterId = $("#Chapter").val();
    var SectionName = $("#search").val();

    var PageSize = 10;
    $.ajax({
        url: '/Admin/CaseManagement/GetSectionList',
        Type: "post",
        dataType: "json",
        async: false,
        data: {"page": page, "PageSize": PageSize, "CourseId": CourseId, "ChapterId": ChapterId, "SectionName": SectionName},
        success: function (tb) {

            var html = '';
            var data = tb.Tb;//转换table
            for (var i = 0; i < data.length; i++) {
                html += '<tr>';
                //当前页面
                
                html += '<td>' + data[i]["CourseName"] + '</td>';
                html += '<td>' + data[i]["ChapterName"] + '</td>';
                html += '<td>' + data[i]["SectionName"] + '</td>';

                var isSectionLinked = false;
                if ($("#LinkSectionId").val() != "0") {
                    if (data[i]["SectionId"] == $("#LinkSectionId").val()) {
                        isSectionLinked = true;
                    }
                }
                if (!isSectionLinked) {
                    html += '<td><a onclick="LinkTaskWithSectionId(' + data[i]["CourseId"] + ',' + data[i]["ChapterId"] + ',' + data[i]["SectionId"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-share-alt m-r-xxs"></i>关联此节</a>';
                } else {
                    html += '<td><a onclick="cancelWithSectionInId(' + data[i]["CourseId"] + ',' + data[i]["ChapterId"] + ',' + data[i]["SectionId"] + ')" class=" btn-danger btn-sm  m-r-sm"><i class="fa fa-share-alt m-r-xxs"></i>取消关联</a>';
                }
                html += '</td>';
                html += '</tr>';
            }

            $("#tablelist1").html(html);
            bootstrapPaginator("#PaginatorLibrary1", tb, GetSectionList);//分页

        }
    });

}

function LinkTaskWithSectionId(CourseId,ChapterId,SectionId)
{

    var TaskId = $("#LinkTaskId").val();

    $.ajax({
        url: '/Admin/CaseManagement/LinkTaskAndSection',
        Type: "post",
        dataType: "json",
        async: false,
        data: { TaskId: TaskId, CourseId: CourseId, ChapterId: ChapterId, SectionId: SectionId },
        success: function (data) {
            if (data == 1) {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                GetList();
            }
            else {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });

    


}

function cancelWithSectionInId(CourseId, ChapterId, SectionId) {

    var TaskId = $("#LinkTaskId").val();

    $.ajax({
        url: '/Admin/CaseManagement/LinkTaskAndSection',
        Type: "post",
        dataType: "json",
        async: false,
        data: { TaskId: TaskId, CourseId: CourseId, ChapterId: ChapterId, SectionId: SectionId, isDelete:"111" },
        success: function (data) {
            if (data == 1) {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                GetList();
            }
            else {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });




}

function PreviewTask(TaskId) {

    $.ajax({
        url: '/CaseManagement/AddPreviewTask',
        type: 'POST',
        data: { "TaskId": TaskId },
        async: false,
        success: function (data) {
            if (parseInt(data) > 0) {
                //成绩id +任务id
                window.open("/StuHome/StudentHome?TotalResultId=" + data + "&TaskId=" + TaskId);

            }
            else {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });

}