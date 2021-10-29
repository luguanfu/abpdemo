
/**************************************************
 * 实训考核 列表第一层
 * 
 * 
 * 
 * *************/
//搜索
var allsearch = 0;

function serchinfo2() {
    if (allsearch == 1) {
        TrainingExamination(null, '1', 1);
    }
    if (allsearch == 2) {
        TrainingExamination(null, '1', 2);
    }
    if (allsearch == 3) {
        GetKnowledgeAssessment();
    }
    if (allsearch == 4) {
        BindRank();
    }
}

//获得（个人练习/团队实训考核）数据列表
function TrainingExamination(page, type, model) {
    $("#SearchName2").show();
    $("#txt_rank").hide();//搜索框显示隐藏
    $("#tuandui").addClass("disBlock");
    $("#zhishi").removeClass("disBlock");
    $("#chakanpaiming").removeClass("disBlock");
    $("#tuanduiStatus").show();
    $("#zhishiStatus").hide();

    if (type != "undefined" && type != undefined) {
        $("#PracticeType").val(type);
    } else {
        type = $("#PracticeType").val();
    }

    if (model != "undefined" && model != undefined) {
        $("#ModelType").val(model);
    } else {
        model = $("#ModelType").val();
    }

    if (model == 1) { //个人比赛
        allsearch = 1;
        $(".tuan_xin2").hide(); //隐藏团队及角色


    } else { //个人练习
        $(".tuan_xin2").hide();//显示团队及角色
        allsearch = 2;

    }

    var TState = $("input[name='grsx']:checked").val();
    var SearchName = $("#SearchName2").val();

    var PageSize = 4;

    $.ajax({
        url: '/PracticeAssessment/GetPersonalExercises',
        Type: "post",
        dataType: "json", cache: false, async: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "SearchName": SearchName, "TState": TState, "PracticeType": type, "Type_All": model },
        success: function (tb) {

            var html = '';
            var data = tb.Tb;//转换table
            $("#personalExamination").html("");

            for (var i = 0; i < data.length; i++) {

                html += '<div class="shuju_line">'//rownum
                html += '<label class="shixun_k3">' + data[i]["rownum"] + '</label>'//
                //(data[i]["PracticeStarTime"] == ("" || null) ? '-' : new Date(data[i]["PracticeStarTime"]).Format("yyyy-MM-dd hh:mm"))
                html += '<label class="shixun_k1">' + data[i]["PracticeName"] + '</label>'
                html += '<label class="shixun_k2">' + data[i]["PracticeStarTime"].replace("T", " ") + '</label>'
                html += '<label class="shixun_k2">' + data[i]["EndTime"].replace("T", " ") + '</label>'
                html += '<label class="shixun_k8">'
                if (data[i]["Tstate"] == "未开始" || data[i]["Tstate"] == null || data[i]["Tstate"] == "") {
                    html += '<img src="../img/public3D/lx_ico_gono.png" />'
                } else if (data[i]["Tstate"] == "进行中") {
                    html += '<img src="../img/public3D/lx_ico_go.png" onclick="AssessmentopenToCaseView(' + data[i]["ID"] + ',' + data[i]["TaskId"] + ',' + data[i]["CustomerId"] + ',' + data[i]["LinkId"] + ',' + data[i]["TotalResultId"] + ',' + data[i]["Satisfaction"] + ',' + data[i]["ExamId"] + ')"/>'
                } else if (data[i]["Tstate"] == "已结束") {
                    html += '<img src="../img/public3D/sxkh_ico_kan.png" onclick="openLock(' + data[i]["TotalResultId"] + ')" />'
                }

                html += '</label>'
                html += '</div>'

            }

            $("#personalExamination").html(html);
            bootstrapPaginator("#personalExaminationPage", tb, TrainingExamination);//分页

            //}
        }
    });

}

//跳转查看成绩  //ID为考试ID
function openLock(ID) {
    //先要跳转内页 然后是多个案例 考试下的案例列表 然后根据 成绩Id+任务Id 跳转
    window.open("/PracticeResult/Index?TotalResultId=" + ID + "&TaskId=1");
    //window.open("/PracticeAssessment/CaseEndView?PracticeType=" + $("#PracticeType").val() + "&Role=" + $("#Role").val() + "&ID=" + ID);

}

//新增练习
function AssessmentopenToCaseView(ID, taskid, CustomerId, LinkId, TotalResultId, Satisfaction, ExamId) {
    var Type_All_n = $("#ModelType").val();
    Type_All_n = Type_All_n == 2 ? 0 : Type_All_n;
    //if ($("#PracticeType").val() == "2") {//团队模式
    window.location.href = "/ServiceRecord/Index?FormType=" + Type_All_n + "&TotalResultId=" + TotalResultId + "&ExamId=" + ExamId + "&LinkId=" + LinkId + "&Satisfaction=" + Satisfaction;
    //} else {
    //    $.ajax({
    //        url: '/FreePractice/Add',
    //        type: 'POST',
    //        data: { "ExamId": ID, "Type_All": $("#ModelType").val() },
    //        async: false,
    //        success: function (data) {
    //            if (parseInt(data) > 0) {
    //                window.open("/StuHome/StudentHome?TotalResultId=" + data + "&TaskId=" + taskid);
    //                //window.open("/PracticeAssessment/CaseView?PracticeType=" + $("#PracticeType").val() + "&Role=" + $("#Role").val() + "&ID=" + ID);
    //            }
    //            else {
    //                if (Type_All_n == 1) {
    //                    layer.msg('考试已提交', { icon: 2 });
    //                } else layer.msg('出错了', { icon: 2 });

    //                return;
    //            }
    //        }
    //    });
    //}
}

//知识考核
function GetKnowledgeAssessment(page) {
    $("#SearchName2").show();
    $("#txt_rank").hide();//搜索框显示隐藏
    $("#tuandui").removeClass("disBlock");
    $("#zhishi").addClass("disBlock");
    $("#chakanpaiming").removeClass("disBlock");
    $("#tuanduiStatus").hide();
    $("#zhishiStatus").show();
    allsearch = 3;
    var TState = $("input[name='zskh']:checked").val();
    var SearchName = $("#SearchName2").val();

    var PageSize = 4;

    $.ajax({
        url: '/PracticeAssessment/GetKnowledgeAssessment',
        Type: "post",
        dataType: "json", cache: false, async: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "SearchName": SearchName, "TState": TState },
        success: function (tb) {

            var html = '';
            var data = tb.Tb;//转换table

            $("#KnowledgeAssessment").html("");

            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {

                    html += '<div class="shuju_line">'
                    html += '<label class="shixun_k1">' + data[i]["E_Name"] + '</label>'
                    html += '<label class="shixun_k2">' + (data[i]["E_StartTime"] == ("" || null) ? '-' : new Date(data[i]["E_StartTime"]).Format("yyyy-MM-dd hh:mm")) + '</label>'
                    html += ' <label class="shixun_k3">' + (data[i]["duration"] == ("" || null) ? '-' : data[i]["duration"]) + '分钟</label>'

                    if (data[i]["statas"] == null || data[i]["statas"] == "") {
                        html += '<label class="shixun_k4 ">' + "未开始" + '</label>'
                    } else {
                        html += '<label class="shixun_k4 ">' + data[i]["statas"] + '</label>'
                    }

                    var ToScore = parseFloat(data[i]["ToScore"]);//总分
                    html += ' <label class="shixun_k5">' + ToScore.toFixed(2) + '</label>'
                    html += ' <label class="shixun_k6">' + (ToScore * 0.6).toFixed(2) + '</label>'


                    if (data[i]["MyScore"] == null || data[i]["MyScore"] == "") {
                        html += ' <label class="shixun_k7">-</label>'
                    } else {
                        if (data[i]["statas"] == "进行中" || data[i]["statas"] == "未开始") {
                            html += ' <label class="shixun_k7">-</label>'
                        } else {
                            html += ' <label class="shixun_k7">' + parseFloat(data[i]["MyScore"]).toFixed(2) + '</label>'
                        }
                    }

                    html += '<label class="shixun_k8">'

                    if (data[i]["statas"] == "未开始" || data[i]["statas"] == null || data[i]["statas"] == "") {
                        html += '<img src="../img/public3D/lx_ico_gono.png" />'
                    } else if (data[i]["statas"] == "进行中") {
                        html += '<img src="../img/public3D/lx_ico_go.png" onclick="Getinto(' + data[i]["EId"] + ',' + data[i]["E_PId"] + ')" />'
                    } if (data[i]["statas"] == "已结束") {
                        html += '<img src="../img/public3D/sxkh_ico_kan.png" onclick="ShwoResult(' + data[i]["EId"] + ',' + data[i]["E_PId"] + ')"/>'
                    }

                    html += '</label>'
                    html += '</div>'

                }

                $("#KnowledgeAssessment").html(html);

                bootstrapPaginator("#KnowledgeAssessmentPageList", tb, GetPersonalExercises);//分页
            }

        }

    });
}

//未进行比赛 进入 
function Getinto(Eid, Pid) {

    //验证是否存在记载倒计时数据
    //不存在就新增
    $.ajax({
        url: "/HB_Competition/CheckGointo",
        data: { "Eid": Eid, "Pid": Pid, "Type": "1" },
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function (data) {
            if (data == "1") {
                window.open('/HB_kaoshi?Eid=' + Eid + '&Pid=' + Pid + '&ALLType=2');
            }
            if (data == "77") {
                layer.msg('考核时间未到！');
            }
            if (data == "88") {
                layer.msg('您已交卷，请等待考试时间结束！');
            }
            if (data == "99") {
                layer.alert('操作失败，请刷新或重新登录再试！', { skin: 'layui-layer-lan' }, function () {
                    layer.closeAll();//关闭所有弹出框
                });
            }
        }
    });

}

function ShwoResult(Eid, Pid) {

    //判断是否第一次练习
    $.ajax({
        url: "/HB_Competition/SeCount",
        data: { "Eid": Eid },
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function (data) {
            if (data == "1") {
                window.open('/HB_ExamPreview?Eid=' + Eid + '&Pid=' + Pid + '&Type=1&ALLType=2');
            } else {
                layer.msg('无考核数据');
            }
        }
    });

}