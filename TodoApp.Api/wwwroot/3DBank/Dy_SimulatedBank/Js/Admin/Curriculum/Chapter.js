/***************************************************************
         FileName:BSI_保险_课程-章-节管理js文件 
         Copyright（c）2018-金融教育在线技术开发部
         Author:邵
         Create Date:2018-5月15号
******************************************************************/
var publicChapterId = 0;
//页面加载完成就执行
$(document).ready(function () {
    GetList();
   
});
//加载章列表
function GetList(page)
{
    //获取课程id
    var Cid = getQueryString("id");
    var PageSize = 10000;
    allpage = page;
    $.ajax({
        Type: "post",
        dataType: "json",
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: '/Chapter/GetList',
        data: { "page": page, "PageSize": PageSize, "Cid": Cid },
        success: function (tb) {
            var html = '';
            var data = tb.Tb;//转换table
            if (tb != null && tb.Total != 0) {//table数据不为空
                for (var i = 0; i < data.length; i++) {
                    html += '<tr id="tr'+data[i]["ID"]+'">';

                    //当前页面
                    var idx = 0;
                    if (page != "undefined" && page != null) {
                        idx = page;
                        idx = idx - 1;
                    }
                    //默认调用第一章的节
                    if (i == 0)
                    {
                        //默认章id
                        var id = data[i]["ID"];
                       
                        publicChapterId = id;
                        //加载节的列表
                        $.ajax({
                            Type: "post",
                            dataType: "json",
                            async: false,//取消异步请求
                            url: '/Chapter/GetSectionList',
                            data: { "publicChapterId": id },
                            success: function (tb) {
                                var html = '';
                                var data = tb;//转换table
                                if (tb != null && tb.Total != 0) {//table数据不为空
                                    for (var i = 0; i < data.length; i++) {
                                        html += '<tr>';
                                        html += '<td>' + data[i]["SectionName"] + '</td>';
                                        html += '<td><a class=" btn-primary btn-sm  m-r-sm" onclick="SectionUpper_Move(' + data[i]["ID"] + ')">上移</a> <a class=" btn-warning btn-sm m-r-sm" onclick="SectionLower_Move(' + data[i]["ID"] + ')">下移</a> <a onclick="EditInfo_Section(' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a> <a onclick="DelSection(' + data[i]["ID"] + ')" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a></td>';
                                        html += '</tr>';
                                    }
                                }
                                $("#tablelistTo").html(html);
                            }
                        });
                    }
                    //章的table
                    html += '<td>' + data[i]["ResourcesName"] + '</td>';
                    html += '<td><a class=" btn-primary btn-sm  m-r-sm" onclick="Upper_Move(' + data[i]["ID"] + ')">上移</a> <a class=" btn-warning btn-sm m-r-sm" onclick=Lower_Move(' + data[i]["ID"] + ')>下移</a> <a onclick="EditInfo(' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a> <a onclick="ChapterShow(' + data[i]["ID"] + ')" class=" btn-success btn-sm m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>章节设置 </a> <a onclick="del(' + data[i]["ID"] + ')" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a></td>';
                    html += '</tr>';
                }
            }
            $("#tablelist").html(html);
            //给章添加选中样式
            $("#tr" + id + "").attr("class", "bg-warning");
            $("#hidChapter").val(id);
            ////分页控件加载
            //bootstrapPaginator("#PaginatorLibrary", tb, bindIngfo);//分页
            ////样式重新加载
            //redload();
        }
    });
}
//上移
function Upper_Move(id) {
    var Curriculumid = getQueryString("id");
    alert("Curriculumid:" + Curriculumid);
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Admin/Chapter/Move',
        data: { "Id": id, "Type": "-1", "Curriculumid": Curriculumid},
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                //layer.msg('操作成功', { icon: 1 });
                GetList();
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
    })
}

//下移
function Lower_Move(id) {
    var Curriculumid = getQueryString("id");
    alert("Curriculumid:" + Curriculumid);
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Admin/Chapter/Move',
        data: { "Id": id, "Type": "+1", "Curriculumid": Curriculumid},
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                //layer.msg('操作成功', { icon: 1 });
                GetList();
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
    })
}
//新增弹框
function AddInfo() {
    layer.open({
        type: 1,
        title: '新增',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['450px', '200px'], //宽高
        content: $("#Add")
    });
    $("#txtClass_Name").val("");
}
//新增取消
function FormRest() {
    layer.closeAll();//关闭
    $('#Addform')[0].reset();//清空表单数据

    $('input[name="rdoIs_System"]').iCheck('uncheck');
    $('#Is_SystemB').iCheck('check');
}

//新增保存
function BtnSubim() {

    var txtChapter_Name = $("#txtClass_Name").val();

    if (txtChapter_Name.length == 0) {
        layer.msg('请输章名称！', function () { });
        return;
    }
    if (txtChapter_Name.length >20) {
        layer.msg('标题字符长度不能超过20!', function () { });
        return;
    }
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Chapter/Add',
        data: { "Cid": getQueryString("id"), "txtChapter_Name": txtChapter_Name},
        success: function (data) {
            if (data == -1) {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
            else if (data == -2) {
                layer.msg('该课程下已经存在同名章', { icon: 2 });
                return;
            }
            else {
                layer.closeAll();//关闭所有弹出框
                GetList();
                layer.msg('操作成功', { icon: 1 });
            }
        }
    });
}

var Cid = 0;
//编辑
function EditInfo(id) {
    layer.open({
        type: 1,
        title: '编辑',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['450px', '260px'], //宽高
        content: $("#Edit")
    });
    Cid = id;
    GetListEdit(id)
}
//编辑时信息读取
function GetListEdit(Id) {
    $.ajax({
        Type: "post",
        dataType: "json",
        url: '/Chapter/GetListEdit?Id=' + Id,
        async: false,
        success: function (data) {
            if (data.length > 0) {
                $("#txtEditClass_Name").val(data[0]["ResourcesName"]);
            }
        }
    });
}
var EditSectionid = 0;
//编辑
function EditInfo_Section(id) {
    layer.open({
        type: 1,
        title: '编辑',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['450px', '260px'], //宽高
        content: $("#EditTo")
    });
    EditSectionid = id;
    GetSectionListEdit(id)
}

function GetSectionListEdit(id)
{
    $.ajax({
        Type: "post",
        dataType: "json",
        url: '/Chapter/GetSectionListEdit?Id=' + id,
        async: false,
        success: function (data) {
            if (data.length > 0) {
                $("#EditSection_CurriculumNameid").html(data[0]["ResourcesName"]);
                $("#txtEdit_Section").val(data[0]["SectionName"]);
            }
        }
    });
}

function EditFormRest() {
    layer.closeAll();//关闭
    $('#Editform')[0].reset();//清空表单数据

}
function SectionAddFormRest() {
    layer.closeAll();//关闭
    $('#txtEdit_Section')[0].reset();//清空表单数据
}
function SectionEditFormRest()
{
    layer.closeAll();//关闭
    $('#EditformTo')[0].reset();//清空表单数据
}
//保存修改
function EditBtnSubim() {
    var txtChapter_Name = $("#txtEditClass_Name").val();

    if (txtChapter_Name.length == 0) {
        layer.msg('请输章名称！', function () { });
        return;
    }
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Chapter/EditBtnSubim',
        data: { "Cid": Cid, "txtChapter_Name": txtChapter_Name },
        success: function (data) {
            if (data == -1) {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
            else if (data == -2) {
                layer.msg('该课程下已经存在同名章', { icon: 2 });
                return;
            }
            else {
                layer.closeAll();//关闭所有弹出框
                GetList();
                layer.msg('操作成功', { icon: 1 });
            }
        }
    });
}

function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
}

//单删除
function del(SID) {
    layer.confirm('您确认要删除选中的章吗？', {
        title: '删除章',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
 function () {
     $.ajax({
         type: "POST",
         dataType: "text",
         url: '/Admin/Chapter/Del',
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

//章节控制
function ChapterShow(id) {
    $("#hidChapter").val(id);
    //移除所有样式
    $("#tablelist tr").removeClass("bg-warning");
    publicChapterId = id;
    GetSectionList();
    //添加选中样式
    $("#tr" + id + "").attr("class", "bg-warning");
}
function GetSectionList()
{
    //加载节的列表
    $.ajax({
        Type: "post",
        dataType: "json",
        async: false,//取消异步请求
        url: '/Chapter/GetSectionList',
        data: { "publicChapterId": publicChapterId },
        success: function (tb) {
            var html = '';
            var data = tb;//转换table
            if (tb != null && tb.Total != 0) {//table数据不为空
                for (var i = 0; i < data.length; i++) {
                    html += '<tr>';
                    html += '<td>' + data[i]["SectionName"] + '</td>';
                    html += '<td><a class=" btn-primary btn-sm  m-r-sm" onclick="SectionUpper_Move(' + data[i]["ID"] + ')">上移</a> <a class=" btn-warning btn-sm m-r-sm" onclick="SectionLower_Move(' + data[i]["ID"] + ')">下移</a> <a onclick="EditInfo_Section(' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a> <a onclick="DelSection(' + data[i]["ID"] + ')" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a></td>';
                    html += '</tr>';
                }
            }
            $("#tablelistTo").html(html);
        }
    });
}
//上移
function SectionUpper_Move(id) {
    var Curriculumid = getQueryString("id");
    var Chapterid = $("#hidChapter").val();
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Admin/Chapter/SectionMove',
        data: { "Id": id, "Type": "-1", "Curriculumid": Curriculumid, "Chapterid": Chapterid},
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                //layer.msg('操作成功', { icon: 1 });
                GetSectionList();
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
    })
}

//下移
function SectionLower_Move(id) {
    var Curriculumid = getQueryString("id");
    var Chapterid = $("#hidChapter").val();
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Admin/Chapter/SectionMove',
        data: { "Id": id, "Type": "+1","Curriculumid": Curriculumid, "Chapterid": Chapterid },
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                //layer.msg('操作成功', { icon: 1 });
                GetSectionList();
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
    })
}
//节的新增弹窗
function AddInfoTo() {
    $("#txt_Section").val("");
    layer.open({
        type: 1,
        title: '新增',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['450px', '260px'], //宽高
        content: $("#AddTo")
    });
 
    //获取章名称
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Admin/Chapter/GetChapterName',
        data: { "ChapterId": publicChapterId },
        success: function (data) {
            $("#CurriculumNameid").html(data);
        }
    })
}

//提交节的新增
function BtnSectionSubimTo()
{
    var txt_Section = $("#txt_Section").val();
    if (txt_Section.length == 0) {
        layer.msg('请输节名称！', function () { });
        return;
    }
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Chapter/AddSection',
        data: { "Cid": getQueryString("id"), "txt_Section": txt_Section, "publicChapterId": publicChapterId },
        success: function (data) {
            if (data == -1) {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
            else if (data == -2) {
                layer.msg('该章下已经存在同名节', { icon: 2 });
                return;
            }
            else {
                layer.closeAll();//关闭所有弹出框
                GetSectionList();
                layer.msg('操作成功', { icon: 1 });
            }
        }
    });
}

//修改节
function EditBtnSectionSubimTo()
{
    var txt_Section = $("#txtEdit_Section").val();

    if (txt_Section.length == 0) {
        layer.msg('请输节名称！', function () { });
        return;
    }
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Chapter/EditSection',
        data: { "Cid": getQueryString("id"), "txt_Section": txt_Section, "Sectionid": EditSectionid },
        success: function (data) {
            if (data == -1) {
                layer.msg('操作失败', { icon: 2 });
                return;
            }

            else {
                layer.closeAll();//关闭所有弹出框
                ChapterShow(publicChapterId);
                layer.msg('操作成功', { icon: 1 });
            }
        }
    });
}

//删除节
function DelSection(id)
{
    layer.confirm('您确认要删除选中的节吗？', {
        title: '删除节',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
function () {
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Admin/Chapter/DelSection',
        data: { "Ids": id },//多个Id
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                ChapterShow(publicChapterId);
            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    })
});
}
