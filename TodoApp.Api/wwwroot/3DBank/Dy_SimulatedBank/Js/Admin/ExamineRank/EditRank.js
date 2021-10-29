$(function () {


    loadPage();
})

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


//个人考核
function selectAll(selectStatus) {//传入参数（全选框的选中状态）
    //根据name属性获取到单选框的input，使用each方法循环设置所有单选框的选中状态
    if (selectStatus) {
        $("input[name='class']").each(function (i, n) {
            n.checked = true;
        });
    } else {
        $("input[name='class']").each(function (i, n) {
            n.checked = false;
        });
    }
}

//团队考核
function selectAll2(selectStatus) {//传入参数（全选框的选中状态）
    //根据name属性获取到单选框的input，使用each方法循环设置所有单选框的选中状态
    if (selectStatus) {
        $("input[name='class2']").each(function (i, n) {
            n.checked = true;
        });
    } else {
        $("input[name='class2']").each(function (i, n) {
            n.checked = false;
        });
    }
}

//知识考核
function selectAll1(selectStatus) {//传入参数（全选框的选中状态）
    //根据name属性获取到单选框的input，使用each方法循环设置所有单选框的选中状态
    if (selectStatus) {
        $("input[name='class1']").each(function (i, n) {
            n.checked = true;
        });
    } else {
        $("input[name='class1']").each(function (i, n) {
            n.checked = false;
        });
    }
}


//选择范围列表
function loadPage(page) {
    var name = $("#ModeId").val();
    var id = $("#id").val();
    var PageSize = 10;
    $.ajax({
        url: '/Admin/ExamineRank/GetRangData',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "id": id, "page": page, "PageSize": PageSize },
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
                html += '<td><input type="checkbox" class="i-checks" name="iclass" value=' + data[i]["Eid"] + '></td>';
                html += '<td>' + data[i]["PracticeName"] + '</td>';

                html += '<td>' + data[i]["start_time"] + '</td>';
                html += '<td>' + data[i]["end_time"] + '</td>';
                html += '<td>' + data[i]["ExaminationType"] + '</td>';
                //html += '<td>' + data[i]["AbilityandScore"] + '</td>';
                html += '<td>' + data[i]["qualified_p"] + '</td>';
                html += '<td>' + data[i]["pass_rate"] + '</td>';
                html += '<td>' + data[i]["max_src"] + '</td>';
                var str = "'" + data[i]["rank_name"] + "'";
                html += '<td> <a onclick="ExamInfo(' + data[i]["Eid"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>考核信息 </a>';
                var type = 0;
                if (data[i]["ExaminationType"] == "技能考核") {
                    type = 1;
                } else if (data[i]["ExaminationType"] == "知识考核") {
                    type = 2;
                }
                html += '<a onclick="resultsInfo(' + data[i]["Eid"] + ',' + type + ',\'' + data[i]["end_time"] + '\')" class=" btn-primary btn-sm  m-r-sm" > <i class="fa fa-pencil m-r-xxs"></i>查看成绩 </a > ';
                html += '<a onclick="del(' + data[i]["Eid"] + ')" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>移除 </a> </td>';
                html += '</tr>';

            }
            $("#tablelist").html(html);

            bootstrapPaginator("#PaginatorLibrary", tb, loadPage);//分页
            //样式重新加载
            redload();

        }
    });
}
function ExamInfo(eid) {
    var id = $("#id").val();
    window.location.href = "/Admin/ExamineRank/ExamInfo?ModeId=" + id + "&eid=" + eid;
}
function resultsInfo(eid, type, endTimr) {
    var al = new Date(endTimr).getTime();
    var curr_time = new Date();
    var bl = new Date(curr_time).getTime();
    if (bl < al) {
        layer.msg('考试时间还没结束不能查看成绩');
        return;
    }
    var id = $("#id").val();
    window.location.href = "/Admin/ExamineRank/StudentInfo?ModeId=" + id + "&eid=" + eid + "&type=" + type;
}
function AddInfo() {
    $("#P_Name").val("");
    $("#P_Name1").val("");
    $("#P_Name2").val("");
    loadExam1();
    loadExam2();
    loadExam();
    layer.open({
        type: 1,
        title: '添加考核',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['1100px', '500px'], //宽高
        content: $("#Choiceid1")
    });
}


function del_all() {
    var id = $("#id").val();

    var chks = document.getElementsByName('iclass');//name
    var chkstr = "";

    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {

            chkstr += chks[i].value + ",";
        }
    }

    if (chkstr.length == 0) {
        layer.msg('请选择要删除的考核！', function () { });
        return;
    }
    chkstr = chkstr.substr(0, chkstr.length - 1);

    layer.confirm('您确定要删除所选考核吗？', {
        title: '删除',
        btn: ['确定', '取消'],
        shadeClose: true, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                url: '/Admin/ExamineRank/DelExma',
                Type: "post",
                dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                data: { "eids": chkstr, "id": id },
                success: function (da) {
                    if (da == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });

                        loadPage();
                    }

                    if (da == "99") {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }
                }
            });
        });
}
function del(eid) {
    var id = $("#id").val();
    layer.confirm('您确定要删除所选考核吗？', {
        title: '删除',
        btn: ['确定', '取消'],
        shadeClose: true, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                url: '/Admin/ExamineRank/DelExma',
                Type: "post",
                dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                data: { "eids": eid, "id": id },
                success: function (da) {
                    if (da == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });

                        loadPage();
                    }

                    if (da == "99") {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }
                }
            });
        });
}

//排名与个人考核建立关系表
function updateClass1() {
    var id = $("#id").val();
    var chks = document.getElementsByName('class');//name
    var chkstr = "";

    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {

            chkstr += chks[i].value + ",";
        }
    }

    if (chkstr.length == 0) {
        layer.msg('请选择要添加的考核！', function () { });
        return;
    }
    chkstr = chkstr.substr(0, chkstr.length - 1);
    $.ajax({
        url: '/Admin/ExamineRank/AddExma',
        type: "POST",
        dataType: "text",
        data: { "id": id, "eids": chkstr },
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                loadPage();

                layer.msg('操作成功', { icon: 1 });

            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}

//排名与团队考核建立关系
function updateClass2() {
    var id = $("#id").val();
    var chks = document.getElementsByName('class2');//name
    var chkstr = "";

    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {

            chkstr += chks[i].value + ",";
        }
    }

    if (chkstr.length == 0) {
        layer.msg('请选择要添加的考核！', function () { });
        return;
    }
    chkstr = chkstr.substr(0, chkstr.length - 1);
    $.ajax({
        url: '/Admin/ExamineRank/AddExma',
        type: "POST",
        dataType: "text",
        data: { "id": id, "eids": chkstr },
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                loadPage();

                layer.msg('操作成功', { icon: 1 });

            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}

//技能个人考核列表
function loadExam1(page) {
    var id = $("#id").val();
    var name = $("#P_Name").val().trim();
    var PageSize = 10;
    $.ajax({
        //url: '/Admin/ExamineRank/GetExamData',
        url: '/Admin/ExamineRank/GetTrainingExamination',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "id": id, "type": 1, "SearchName": name, "page": page, "PageSize": PageSize },
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
                html += '<td><input type="checkbox"  name="class" value=' + data[i]["ID"] + '></td>';
                html += '<td>' + data[i]["PracticeName"] + '</td>';

                html += '<td>' + new Date(data[i]["PracticeStarTime"]).Format("yyyy-MM-dd HH:mm:ss") + '</td>';
                html += '<td>' + new Date(data[i]["PracticeEndTime"]).Format("yyyy-MM-dd HH:mm:ss") + '</td>';
                //html += '<td>' + data[i]["AbilityandScore"] + '</td>';
                //html += '<td>' + data[i]["qualified_p"] + '</td>';
                //html += '<td>' + data[i]["pass_rate"] + '</td>';
                //html += '<td>' + data[i]["max_src"] + '</td>';

                html += '</tr>';

            }

            $("#Curriculumtablelist").html(html);

            bootstrapPaginator("#CurriculumPaginatorLibrary", tb, loadExam1);//分页

            //样式重新加载
            redload();

        }
    });
}

//团队考核列表
function loadExam2(page) {
    var id = $("#id").val();
    var name = $("#P_Name1").val().trim();

    var PageSize = 10;
    $.ajax({
        //url: '/Admin/ExamineRank/GetExamData',
        url: '/Admin/ExamineRank/GetTrainingExamination',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "id": id, "type": 2, "SearchName": name, "page": page, "PageSize": PageSize },
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
                html += '<td><input type="checkbox"  name="class2" value=' + data[i]["ID"] + '></td>';
                html += '<td>' + data[i]["PracticeName"] + '</td>';

                html += '<td>' + new Date(data[i]["PracticeStarTime"]).Format("yyyy-MM-dd HH:mm:ss") + '</td>';
                html += '<td>' + new Date(data[i]["PracticeEndTime"]).Format("yyyy-MM-dd HH:mm:ss") + '</td>';
                //html += '<td>' + data[i]["AbilityandScore"] + '</td>';
                //html += '<td>' + data[i]["qualified_p"] + '</td>';
                //html += '<td>' + data[i]["pass_rate"] + '</td>';
                //html += '<td>' + data[i]["max_src"] + '</td>';

                html += '</tr>';

            }

            $("#Curriculumtablelist1").html(html);

            bootstrapPaginator("#CurriculumPaginatorLibrary1", tb, loadExam2);//分页

            //样式重新加载
            redload();

        }
    });
}

function updateClass() {
    var id = $("#id").val();

    var chks = document.getElementsByName('class1');//name
    var chkstr = "";

    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {

            chkstr += chks[i].value + ",";
        }
    }

    if (chkstr.length == 0) {
        layer.msg('请选择要添加的考核！', function () { });
        return;
    }
    chkstr = chkstr.substr(0, chkstr.length - 1);
    $.ajax({
        url: '/Admin/ExamineRank/AddExma',
        type: "POST",
        dataType: "text",
        data: { "id": id, "eids": chkstr },
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                loadPage();

                layer.msg('操作成功', { icon: 1 });

            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}
//知识考核列表
function loadExam(page) {
    var id = $("#id").val();
    var name = $("#P_Name2").val().trim();
    var type = "4";
    var PageSize = 10;
    $.ajax({
        url: '/Admin/ExamineRank/GetKnowledgeAssessment',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "id": id, "type": type, "SearchName": name, "page": page, "PageSize": PageSize },
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
                html += '<td><input type="checkbox"  name="class1" value=' + data[i]["EId"] + '></td>';
                html += '<td>' + data[i]["E_Name"] + '</td>';

                html += '<td>' + new Date(data[i]["E_StartTime"]).Format("yyyy-MM-dd HH:mm:ss") + '</td>';
                html += '<td>' + new Date(data[i]["E_EndTime"]).Format("yyyy-MM-dd HH:mm:ss") + '</td>';
                //html += '<td>' + data[i]["AbilityandScore"] + '</td>';
                //html += '<td>' + data[i]["qualified_p"] + '</td>';
                //html += '<td>' + data[i]["pass_rate"] + '</td>';
                //html += '<td>' + data[i]["max_src"] + '</td>';

                html += '</tr>';

            }

            $("#Curriculumtablelist3").html(html);

            bootstrapPaginator("#CurriculumPaginatorLibrary3", tb, loadExam);//分页

            //样式重新加载
            redload();

        }
    });

}