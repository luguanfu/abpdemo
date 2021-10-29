/***************************************************************
         FileName:BSI_保险_课程管理js文件 
         Copyright（c）2018-金融教育在线技术开发部
         Author:邵
         Create Date:2018-5月15号
******************************************************************/
$(function () {
    GetList();
});
//新增跳转
function AddJump() {
    window.location.href = "/Admin/CurriculumAdd/Index?Type=Add";
}

//加载课程列表
function GetList(page) {
    var PageSize = 10;

    $.ajax({
        url: '/Admin/Curriculum/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "CurriculumName": $("#SelectTeacherNameid").val()},
        success: function (tb) {
            var html = '';
            var data = tb.Tb;//转换table
            var num = 0;
            for (var i = 0; i < data.length; i++) {
                num++;
                html += '<tr>';
                //当前页面
                var idx = 1;
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
                html += '<td>' + num + '</td>';
                html += '<td>' + data[i]["CurriculumName"] + '</td>';
                if (data[i]["State"]==0)
                {
                    html += '<td>禁用</td>';
                }
                else if (data[i]["State"] == 1)
                {
                     html += '<td>启用</td>';
                }
                html += '<td><a class=" btn-primary btn-sm  m-r-sm" onclick="Upper_Move(' + data[i]["ID"] + ')">上移</a></td>';
                html += '<td><a class=" btn-warning btn-sm" onclick="Lower_Move(' + data[i]["ID"] + ')">下移</a></td>';
                html += '<td><a onclick="update(' + data[i]["ID"] + ',' + data[i]["State"] + ',' + data[i]["AddUserId"] + ',' + data[i]["UserId"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>';
                html += '<a onclick="ChapterShow(' + data[i]["ID"] + ',' + data[i]["State"] + ',' + data[i]["AddUserId"] + ',' + data[i]["UserId"] + ')" class="btn btn-success btn-sm m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>章节设置 </a>';
                html += '<a onclick="xxjd(' + data[i]["ID"] + ')" class="btn btn-success btn-sm m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>课程预览 </a>';
                html += '<a onclick="del(' + data[i]["ID"] + ',' + data[i]["Sort"] + ',' + data[i]["AddUserId"] + ',' + data[i]["UserId"] + ')" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a></td>';
                html += '</tr>';
            }

            $("#tablelist").html(html);
            bootstrapPaginator("#PaginatorLibrary", tb, GetList);//分页
            //样式重新加载
            redload();

        }
    });
}

//学习进度
function xxjd(id) {
    layer.open({
        title: false,
        btn: ['关闭'],
        area: ['1000px', '630px'],
        type: 1,
        skin: 'layer-gonggao', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#xxjd"),

    });

    GetSectionList(id);
}



function GetSectionList(id) {
    $.ajax({
        url: '/Curriculum/GetSectionList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "CurriculumID": id },
        success: function (tb) {
            var html = '';
            //课程
            var Curriculum = tb.Curriculum;//转换table
            //章
            var Chapter = tb.Chapter;//转换table
            //节
            var Section = tb.Section;//转换table
            ////资源
            //var Resources = tb.Resources;//转换table
            ////课后练习
            //var Practice = tb.Practice;
            ////实操练习
            //var PracticeAssessment = tb.PracticeAssessment;
            if (Curriculum != null && Curriculum.length > 0) {
                $("#Cover").attr("src", Curriculum[0]["Cover"]);
                $("#CurriculumName").html(Curriculum[0]["CurriculumName"]);
                $("#Synopsis").html(Curriculum[0]["Synopsis"]);
                $("#Cover").show();
            }
            if (Chapter != null && Chapter.length > 0) {
                for (var i = 0; i < Chapter.length; i++) {
                    var ID = Chapter[i]["ID"];
                    var ChapterID = Chapter[i]["ID"];
                    var Name = Chapter[i]["Name"];
                    var COUResources = Chapter[i]["COUResources"];
                    var COUResourceRecord = Chapter[i]["COUResourceRecord"];
                    var complete = 0;
                    if (parseFloat(COUResourceRecord) > 0 && parseFloat(COUResources) > 0) {
                        complete = (parseFloat(COUResourceRecord) / parseFloat(COUResources)) * 100;
                    }
                    html += '<div>';
                    html += '<p class="tabbar_name" >';
                    html += '<span>模块' + (1 + i) + '：' + Name + '</span>';
                    html += '<img src="../Img/z_oval.png"/>';
                    html += '</p>'; 
                    var ss = 0;
                    for (var s = 0; s < Section.length; s++) {
                        if (Section[s]["ChapterID"] == ChapterID) {
                            ID = Section[s]["ID"];
                            var SectionID = Section[s]["ID"];
                            Name = Section[s]["Name"];
                            html += '<div class="tabbar_knobble" >';
                            html += '<p class="knobble_name">';
                            html += '<span class="fl" >第' + (ss + 1) + '节：' + Name + '</span>';

                            //html += '<span class="pack_up  fr pack_tab" onclick="changeState(this)" id="andid' + ID + '" >展开</span>';
                            //html += '<span class="pack_up fr pack_tab " id="andid' + ID + '" onclick="tab_up_down(' + ID + ')" >展开</span>';
                            html += '</p>';
                            html += '<div class="knobble_txt " id="div' + ID + '">';
                            html += '</div>';
                            html += '</div > ';
                            ss++;
                        }
                    }
                    html += '</div>';
                }
            }
            $("#tablelist1").html(html);
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

//修改
function update(id, State, AddUserId, UserId)
{
    if (State == "1") {

        layer.msg('启用状态的课程不允许直接进行编辑和章节设置操作', function () {
            return;
        });
    }
    else if (AddUserId != UserId && UserId!="1") {
        layer.msg('不允许直接对管理员新增的课程进行编辑和章节设置操作', function () {
            return;
        });
    }
    else {
        window.location.href = "/Admin/CurriculumAdd/Index?Type=Edit&id=" + id + "";
    }
}
function ChapterShow(id, State, AddUserId, UserId)
{
    if (State == "1") {
        layer.msg('启用状态的课程不允许直接进行编辑和章节设置操作', function () {
            return;
        });
    }
    else if (AddUserId != UserId && UserId != "1") {
        layer.msg('不允许直接对管理员新增的课程进行编辑和章节设置操作', function () {
            return;
        });
    }
    else {
        window.location.href = "/Admin/Chapter/Index?id=" + id + "";
    }
}
//单删除
function del(SID, Sort, AddUserId, UserId) {
    if (AddUserId != UserId && UserId != "1") {
        layer.msg('不允许直接对管理员新增的课程进行编辑和章节设置操作', function () {
            return;
        });
    }
    else {
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
                    url: '/Admin/Curriculum/Del',
                    data: { "Ids": SID, "Sort": Sort },//多个Id
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
}
//禁用，启用
function Enable(Type,State)
{
    var Txt = "";
    if(Type=="禁用")
    {
        Txt = "禁用";
    }
    if(Type=="启用")
    {
        Txt = "启用";
    }
    var chks = document.getElementsByName('input[]');//name
    var chkstr = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
        }
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
        title: '' + Txt + '课程',
        btn: ['' + Txt + '确定', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
    function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: '/Admin/Curriculum/Enable',
            data: { "Ids": chkstr, "State": State },
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
//上移
function Upper_Move(id)
{
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Admin/Curriculum/Move',
        data: { "Id":id, "Type": "-1" },
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
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Admin/Curriculum/Move',
        data: { "Id": id, "Type":"+1" },
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