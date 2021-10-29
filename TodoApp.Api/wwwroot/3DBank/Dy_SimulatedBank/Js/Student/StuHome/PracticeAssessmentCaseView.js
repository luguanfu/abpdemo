

/**************************************************
 * 实训考核内页
 * 
 * 
 * 
 * *************/

//初始化
$(function () {
    var type = getQueryString("PracticeType");
    if (type == 1) {
        $("#mapMessage").text("个人实训考核");
        $("#role").hide();
    } else {
        $("#mapMessage").text("团队实训考核");
        $("#role").show();
    }

    //考试倒计时
    var Time = $("#Timeid").val();
    timer(Time);
    GetPersonalExercises();
});


var timeEnd = 1;//全局倒计时是否结束
//倒计时
var intDiff;//倒计时总秒数量
var TimeOut;
//倒计时
function timer(intDiff) {
    TimeOut = window.setInterval(function () {
        var day = 0,
            hour = 0,
            minute = 0,
            second = 0;//时间默认值		
        if (intDiff > 0) {
            day = Math.floor(intDiff / (60 * 60 * 24));
            hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
            minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            if (hour <= 9) hour = '0' + hour;
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;

            $("#daojishi").html(hour + ":" + minute + ":" + second + "");


        } else {
            timeEnd = 0;
            clearInterval(TimeOut);
            AddExamination();
        }
        intDiff--;
    }, 1000);
}

function AddExamination(States) {
    if (timeEnd == 0) {
        Add();

    } else if (States == 1) {
        //一种手动点击提交
        layer.confirm('您的成绩将被记录，是否确认提交试卷？', {
            title: '系统提示',
            btn: ['确定', '取消'],
            shadeClose: true, //开启遮罩关闭
            skin: 'layui-layer-lan'
            //按钮
        }, function () {
            Add();
        });
    }
    else {
        layer.msg('系统发生了一个未知错误，请联系管理员');
    }
}


//搜索
function serchinfo() {
    GetPersonalExercises();
}

//获得（个人练习/团队练习）数据列表
function GetPersonalExercises(page) {

    var PageSize = 10;

    var type = getQueryString("PracticeType");

    $.ajax({
        url: '/PracticeAssessment/CaseList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "PracticeType": type, "ID": getQueryString("ID") },
        success: function (tb) {

            var html = '';
            var data = tb.Tb;//转换table
            html += '<tr>'

            html += '  <th width="330">案例名称</th>'
            if (type == "2") { //如果是团队练习
                html += '  <th width="330">我的角色</th>'
            }
            html += '  <th width="330">案例状态</th>'
            html += '  <th width="330">最近一次保存时间</th>'
            html += ' <th width="800">操作</th>'
            html += '</tr>'
            for (var i = 0; i < data.length; i++) {

                html += '<tr>';
                html += '<td>' + data[i]["TaskName"] + '</td>';

                if (type == 2) { //如果是团队练习

                    if (data[i]["PositionName"] == null || data[i]["PositionName"] == "null") {
                        html += '<td>-</td>';
                    } else {
                        html += '<td>' + data[i]["PositionName"] + '</td>';
                    }
                }

                var Tstate = data[i]["Tstate"] + "";
                var tstatetxt = "未开始";
                if (Tstate == "0") {
                    tstatetxt = "进行中";
                }
                if (Tstate == "1") {
                    tstatetxt = "已完成";
                }


                html += '<td>' + tstatetxt + '</td>';

                html += '<td>' + (data[i]["UpdateTime"] == ("" || null) ? '-' : new Date(data[i]["UpdateTime"]).Format("yyyy-MM-dd HH:mm")) + '</td>';

                if (Tstate == "1") {//已完成
                    html += ' <td><a  class=" btn-primary btn-sm  m-r-sm disabled"><i class="fa fa-pencil m-r-xxs"></i>进入案例</a><td>';
                }
                else {
                    //进行中
                    if (Tstate == "0") {
                        html += '<td><a onclick="GoinAnli(' + data[i]["ID"] + ',' + data[i]["TaskId"] + ',' + data[i]["TRID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>进入案例</a><td>';

                    } else {
                        //未开始的
                        if (type == 1) { //个人比赛
                            html += '<td><a onclick="GoinAnli(' + data[i]["ID"] + ',' + data[i]["TaskId"] + ',' + data[i]["TRID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>进入案例</a><td>';
                        } else {//团队比赛
                            //是否已经分岗位  没分
                            if (data[i]["PositionName"] == null || data[i]["PositionName"] == "null") {

                                if (getQueryString("Role") == "1") {//小组长
                                    html += '<td><a onclick="ShowAllocationOfPosts(' + data[i]["ID"] + ',' + data[i]["TaskId"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>进入案例</a><td>';
                                } else {
                                    html += '<td><a  class=" btn-primary btn-sm  m-r-sm disabled"><i class="fa fa-pencil m-r-xxs"></i>进入案例</a><td>';
                                }
                            } else {
                                //分了岗位
                                html += '<td><a onclick="GoinAnli(' + data[i]["ID"] + ',' + data[i]["TaskId"] + ',' + data[i]["TRID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>进入案例</a><td>';
                            }
                        }

                    }

                }
                html += '</tr>';

                html += '</tr>';
            }

            $("#tablelist").html(html);
            bootstrapPaginator("#PaginatorLibrary", tb, GetPersonalExercises);//分页

        }
    });
}

function GoinAnli(EID, TaskId, TRID) {
    //进入场景
    window.open("/StuHome/StudentHome?TotalResultId=" + TRID + "&TaskId=" + TaskId);

}

//提交
function Add() {

    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/PracticeAssessment/UpdateStatus',
        data: { "ID": getQueryString("ID"), "PracticeType": getQueryString("PracticeType") },
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('提交成功', { icon: 1, time: 800 }, function () {
                    window.close();
                });
                return;
            }
            if (data == "77") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('您已交卷', { icon: 1, time: 800 }, function () {
                    window.close();
                });
                return;
            }
            if (data == "66") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('请先操作岗位分配');
                return;
            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });

}

var gwfpIndex;
//分配岗位弹窗
function ShowAllocationOfPosts(examId, taskId) {

    $("#form1")[0].reset();

    GetGroupingMembers();

    $("#examId").val(examId);
    $("#taskId").val(taskId);

    //$.ajax({
    //    url: '/FreePractice/GetById',
    //    type: 'POST',
    //    dataType: "json",
    //    data: { "ExamId": examId, "TasKId": taskId },
    //    async: false,
    //    success: function (data) {
    //        if (data.length > 0) {
    //            for (var i = 0; i < data.length; i++) {
    //                $("#stu" + (i + 0)).val(data[0]["UserId"]);
    //            }

    //        }
    //    }
    //});

    gwfpIndex=layer.open({
        title: '岗位分配',
        //btn: ['确定', '取消'],
        area: ['600px', '500px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#ShowContent")
       
    });
}
var Groupcount = 0;
//获得下拉分组成员列表
function GetGroupingMembers() {
    $.ajax({
        url: '/FreePractice/GetGroupingMembers',
        type: 'POST',
        async: false,
        success: function (data) {
            $("select[name='studentName']").html("");
            var json = JSON.parse(data);
            var html = "<option value=\"\">请选择</option>";
            Groupcount = json.length;
            for (var i = 0; i < json.length; i++) {
                html += "<option value=\"" + json[i].UserId + "\">" + json[i].Name + "</option>";
            }
            $("select[name='studentName']").append(html);
        }
    });

}

//分配岗位
function AllocationOfPosts() {

    var examId = $("#examId").val();
    var taskId = $("#taskId").val();

    var stu1 = $("#stu1 option:selected").val();
    var stu2 = $("#stu2 option:selected").val();
    var stu3 = $("#stu3 option:selected").val();
    if (stu1 == "" || stu2 == "" || stu3 == "") {
        layer.msg("请选择岗位对应的成员");
        return;
    }
    if (Groupcount<=2) {
        layer.msg("考核模式不能一人担任多角色");
        return;
    }
    if (stu1 == stu2 || stu2 == stu3 || stu1 == stu3) {
        layer.msg("考核模式不能一人担任多角色");
        return;
    }

    var str1 = "";
    var str2 = "";
    $("#tablelist2 tbody tr:gt(0)").each(function () {
        var posts = $(this).find("td:eq(0)").text();//从0 开始
        var stuId = $(this).find("td:eq(1)").find("select[name='studentName'] option:selected").val();
        str1 += posts + ",";
        str2 += stuId + ",";
    });
    str1 = str1.substr(0, str1.length - 1);
    str2 = str2.substr(0, str2.length - 1);

    $.ajax({
        url: '/FreePractice/AllocationOfPosts',
        type: 'POST',
        dataType: "text",
        data: { "ExamId": examId, "TasKId": taskId, "StudentId": str2, "PositionName": str1, "Type_All": "1" },
        success: function (data) {
            if (parseInt(data) > 0) {
                GetPersonalExercises();
                layer.close(gwfpIndex);
                window.open("/StuHome/StudentHome?TotalResultId=" + data + "&TaskId=" + taskId);

            }
            else {
                if (data == "-66") {
                    layer.msg('角色分配必须包含小组长', { icon: 2 });
                }
                else {
                    layer.msg('操作失败', { icon: 2 });
                    return;
                }
            }
        }
    });
}
