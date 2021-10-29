var toplays = null;
ddsmoothmenu.init({
    mainmenuid: "smoothmenu1", //menu DIV id
    orientation: 'h',
    classname: 'ddsmoothmenu',
    contentsource: "markup"
})


function getQueryString(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}
var TaskId = "";
var UserId = "";
var ExamId = "";
var DepartmentId = "";
var planId = "";
var SubBankId = "";
$(function () {
    TaskId = 1;
    UserId = 3;
    ExamId = 1;
    planId = 1;

    //TaskId = getQueryString("TaskId");
    //UserId = getQueryString("TellerId");
    //ExamId = getQueryString("ExamId");
    //planId = getQueryString("planId");
    //$("#TaskId").val(TaskId)
    $("#UserId").val(UserId)
    //$("#ExamId").val(ExamId)
    DepartmentId = $("#DepartmentId").val();
    $("#planId").val(planId)
    SubBankId = $("#SubBankId").val();
    ;
    //var title = $("#title").val();
    var title = decodeURI(getQueryString("title"));
    //append
    $(".tan_map").append("<input type='hidden' id='STitle' name='STitle' value='" + title + "' />");
    //$("#divKeyword").hide();
    if (title != "支付系统") {
        $("#div_left").show();
        $("#div_top").hide();
        $(".tan_right").addClass("tan_right")
        $("#btn").show();
        if (title == "核心系统") {
            $("#divKeyword").show();

        }
        GetList()
    } else {
        $(".tan_right").removeClass("tan_right")
        $("#div_left").hide();
        $("#btn").hide();
        $("#div_top").show();
    }
    //$(".listy").find("a").click(function () {
    //    div_topclikc();
    //})
    $(".guanbi").click(function () {
        $("#Keyword").val("");
        $("#ifrdivData").hide();
        $(this).hide();
        $("#img").show();
        GetList();
    })
    //监听关闭属性
    window.addEventListener('message', function (e) {
        var color = e.data;
        if (color.indexOf("closeInChilder") == 0 && $("#ifrdivData").attr("src").indexOf("050503") < 0) {
            $("#img").show();
            $("#ifrdivData").hide();
        }
    })
})

var serachtimer = null;
function Keyword(obj) {
    //$("#img").show();
    //$("#ifrdivData").hide();
    $(".guanbi").hide();
    $("#ParentId").val("");
    if (!IsNullOrEmpty($(obj).val())) {
        $(".guanbi").show();
        if (serachtimer != null) {
            clearTimeout(serachtimer);
        }
        serachtimer = setTimeout(function () {
            clearInterval(serachtimer)
            GetList();
        }, 500)

    } else {
        $("#Keyword").val("");
    }
}

///二级菜单
function GetList() {
    var Keyword = $("#Keyword").val();
    var sysname = $("#STitle").val();
    var ParentId = $("#ParentId").val();

    if (IsNullOrEmpty(Keyword)) {
        Keyword = "";
    }
    if (IsNullOrEmpty(sysname)) {
        sysname = "";
    }
    if (IsNullOrEmpty(ParentId)) {
        ParentId = "";
    }

    $.ajax({
        ifModified: true,
        cache: true,
        Type: "Post",
        url: '/ashx/search.ashx',
        data: { "sysname": sysname, "ParentId": ParentId, "Keyword": Keyword },
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data == "true") {
                window.location.href = "/Login/Lout?LoutId=1";
                return;
            }
            var html = '';
            tb = data;
            if (!IsNullOrEmpty(Keyword)) {
                var topName = "搜索结果";
                if (tb == null || tb.length == 0) {
                    topName = "暂无结果...";
                }
                html += '<div class="panel panel-default"><div class="panel-heading item-container">';
                html += '<h4 class="panel-title item-name">';
                html += '<a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">' + topName + '</a>';
                html += '</h4></div>';
                if (tb != null && tb.length > 0) {
                    html += '<div id="collapseOne" class="panel-collapse collapse in">';
                    for (var i = 0; i < tb.length; i++) {
                        var FromTMNO = tb[i]["FromTMNO"];
                        var RemarkName = tb[i]["RemarkName"]
                        var TMName = tb[i]["TMName"]
                        TMName = RemarkName != null && RemarkName.length > 0 ? RemarkName : TMName;
                        var TMNO = IsNullOrEmpty(tb[i]["TMNO"]) ? tb[i]["TMNO"] : tb[i]["TMNO"].trim();
                        var ywCode = tb[i]["ywCode"];
                        if (IsNullOrEmpty(ywCode) || ywCode == null) {
                            ywCode = "";
                        } else {
                            ywCode = $.trim(ywCode) + "-";
                        }
                        html += `<div class="panel-body item-container" style="cursor:pointer" onclick="div_topclikc('${TMNO}','${FromTMNO}')">`;
                        html += '<span class="item-name">' + ywCode + TMName + '</span>';
                        html += '</div>';
                    }
                    html += '</div>';
                }
                html += '</div>';
                $("#accordion").html(html);

            } else {
                if (tb != null && tb.length > 0) {
                    for (var i = 0; i < tb.length; i++) {
                        var parentName = tb[i].TMNO;
                        html += '<div class="panel panel-default"><div class="panel-heading item-container" style="cursor:pointer">';
                        html += '<img loading="lazy" src="' + tb[i]["Icon"] + '" width="24" height="24">';
                        html += '<h4 class="panel-title item-name">';
                        html += '<a data-toggle="collapse" data-parent="#accordion" href="#' + parentName + '">' + tb[i].TMName + '</a>';
                        html += '</h4></div>';

                        if (tb[i].Children != null && tb[i].Children.length > 0) {
                            html += '<div id="' + parentName + '" class="panel-collapse collapse">';
                            for (var j = 0; j < tb[i].Children.length; j++) {
                                var ywCode = tb[i].Children[j]["ywCode"];
                                if (IsNullOrEmpty(ywCode) || ywCode == null) {
                                    ywCode = "";
                                } else {
                                    ywCode += "-";
                                }
                                html += `<div class="panel-body item-container" style="cursor:pointer" onclick="div_topclikc('${tb[i].Children[j].TMNO}','${tb[i].Children[j].FromTMNO}')">`;
                                html += '<span class="item-name">' + ywCode + tb[i].Children[j]["RemarkName"] + '</span>';
                                html += '</div>';
                            }
                            html += '</div>';
                        }

                        html += '</div>';
                    }
                }


                $("#accordion").html(html);
            }
        }
    });
}
function showLeftDiv() {
    $("#leftDiv").removeClass("hide");
}

var customerId = getQueryString("CustomerId")

//GetfucengSpan
function div_topclikc(formid, fromTMNO, obj) {
    if (IsNullOrEmpty(formid)) {
        layer.msg('暂无链接...！', { icon: 2 });
        return;
    }
    var FormType = getQueryString("FormType");
    //校验超时
    $.ajax({
        url: "/ServiceRecord/CheckTimeOut",
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function (data) {
            if (data == "1") {
                window.parent.location.href = '/Login/Lout?LoutId=1';
            }

        }
    });
    //var url = "/FormList/Form_" + formid + "?FormId=" + formid + "";
    var url = `/FormList/ToForm?FromTMNO=${fromTMNO}&FormId=${formid}&FormType=${getQueryString("FormType")}&TotalResultId=${customerId}&ExamId=${getQueryString("ExamId")}&TaskId=${getQueryString("TaskId")}&CustomerId=${customerId}&LinkId=${getQueryString("LinkId")}&Satisfaction=${getQueryString("Satisfaction")}`;
    var url1 = "User/indexone?formid=" + formid + "&tellerId=" + UserId + "&examid=" + ExamId + "&banksiteid=" + SubBankId + "&DepartmentId=" + DepartmentId + "&planid=" + planId;
    $("#leftDiv").addClass("hide");
    $("#ifrdivData").show();
    $("#ifrdivData").attr("src", url);

}
function tijiao() {
    toplay = layer.open({
        type: 1, //Page层类型
        skin: 'layui-layer-lan', //样式类名
        area: ['480px', '260px'],
        offset: ['37%', '37%'],
        title: false,
        shade: 0.6, //遮罩透明度
        zIndex: layer.zIndex,  //重点1
        maxmin: false, //允许全屏最小化
        anim: 1, //0-6的动画形式，-1不开启
        content: $("#zongtijiao"),
        cancel: function () {

        }
    });
}
function qx() {
    if (toplay != null) {
        layer.close(toplay);
    }
}
//开启任务
function OpenTask(obj) {
    customerId = $(obj).attr("eventId");
    Task_obj = obj;
    taskData.showpage(obj);
    $("#divtishi").find("#divtitle").html("您确定要开启当前任务？");
    toplay = layer.open({
        type: 1, //Page层类型
        skin: 'layui-layer-lan', //样式类名
        area: ['480px', '260px'],
        offset: ['37%', '37%'],
        zIndex: layer.zIndex,  //重点1
        title: false,
        shade: 0.6, //遮罩透明度
        maxmin: false, //允许全屏最小化
        anim: 1, //0-6的动画形式，-1不开启
        content: $("#divtishi"),
        cancel: function () {

        }
    });
}
//任务初始化
function RedoTask(obj) {
    Task_obj = obj;
    $("#divtishis").find("#divtitles").html("您确定要重做当前任务？");
    toplay = layer.open({
        type: 1, //Page层类型
        skin: 'layui-layer-lan', //样式类名
        area: ['480px', '260px'],
        offset: ['37%', '37%'],
        title: false,
        shade: 0.6, //遮罩透明度
        zIndex: layer.zIndex,  //重点1
        maxmin: false, //允许全屏最小化
        anim: 1, //0-6的动画形式，-1不开启
        content: $("#divtishis"),
        cancel: function () {

        }
    });

}
function Zqueding() {
    var tr = $(Task_obj).parent().parent();
    var Id = $(tr).attr("data-Id")
    var DepartmentId = $(tr).attr("data-DepartmentId")
    var Teller_No = $(tr).attr("data-Teller_No")
    var planId = $(tr).attr("data-planId")
    var Task_Name = $(tr).attr("data-task_name")
    var UserId = $(tr).attr("data-UserId")
    var ExamId = $(tr).attr("data-ExamId")
    var taskID = $(tr).attr("data-DepartmentId")
    var data = {
        "TaskId": taskID,
        "ExamId": ExamId,
        "DepartmentId": DepartmentId,
        "Teller_No": Teller_No,
        "planId": planId,
        "UserId": UserId,
        "Task_Name": Task_Name,
        "nid": Id
    };
    $.ajax({
        Type: "post",
        dataType: "text",
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: '/ServiceRecord/Redo',
        data: data,
        success: function (tb) {
            if (tb == "1") {
                layer.close(toplay);
                layer.msg('您已重置任务成功！');
                showpage(Task_obj)
            } else {
                layer.close(toplay);
                layer.msg('您重置任务失败！', { icon: 2 });

            }
        }
    });
}
function Kqueding() {
    var tr = $(Task_obj).parent().parent();
    var Id = $(tr).attr("data-Id")
    var taskID = $(tr).attr("data-DepartmentId")
    var Teller_No = $(tr).attr("data-Teller_No")
    var planId = $(tr).attr("data-planId")
    var Task_Name = $(tr).attr("data-Task_Name")
    var UserId = $(tr).attr("data-UserId")
    var ExamId = $(tr).attr("data-examid")
    //var data = {
    //    "TaskId": taskID,
    //    "ExamId": ExamId,
    //    "DepartmentId": DepartmentId,
    //    "Teller_No": Teller_No,
    //    "planId": planId,
    //    "UserId": UserId,
    //    "Task_Name": Task_Name,
    //    "nid": Id
    //};
    $.ajax({
        Type: "post",
        dataType: "text",
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: '/ServiceRecord/Open',
        data: { "ExamId": ExamId, "TaskId": taskID, "mid": Id, "CustomerId": Id },
        success: function (tb) {
            if (tb == "1") {
                //$.cookie("ServiceRecord_Id", Id, { expires: 1 });
                //delCookie("ServiceRecord_" + UserId + "_" + ExamId);
                document.cookie = "ServiceRecord_" + UserId + "_" + ExamId + "=" + Id;
                console.log("cook1" + "ServiceRecord_" + UserId + "_" + ExamId + "=" + Id);
                taskData.window.resetIncon();

                $(Task_obj).parent().parent().addClass("active")
                $(Task_obj).parent().parent().find(".classimg").attr("src", "/img/jiesuo.png")

                $("#lblTaskName").html(Task_Name)
                $("#lblTaskName").attr("data-taskid", taskID)
                $("#tMono").val(Id);
                layer.msg('任务开启成功！', { icon: 1 });
                layer.close(toplay);
            } else {
                layer.msg('任务开启失败！', { icon: 2 });
                layer.close(toplay);

            }
        }
    });
}

function Tqueding() {


    var Optype = getQueryString("Optype");
    var TaskId = $("#TaskId").val();
    var ExamId = $("#ExamId").val();
    var CustomerId = $("#CustomerId").val();
    var mid = $("#tMono").val();
    //不自动关闭 time:-1  亮度页面不可点击 shade:0.01
    layer.msg('正在提交，请稍等', {
        icon: 16, shade: 0.01, time: -1
    });

    $.ajax({
        Type: "post",
        dataType: "text",
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: '/ServiceRecord/Submit',
        data: { "CustomerId": CustomerId, "TaskId": TaskId, "ExamId": ExamId, "mid": mid, "AnswerTime": $("#HfAnswerTime").val() },
        success: function (tb) {
            if (parseInt(tb.split('_')[0]) == 1) {
                layer.closeAll();//关闭所有弹出框
                var ahref = "";
                //window.open("/ServiceRecord/ScoreDetail?Diff=" + intDiffs + "&ExamId=" + ExamId + "&TaskID=" + TaskId + "&CustomerId=" + CustomerId);
                ahref = "/PracticeResult/Index?TotalResultId=" + tb.split('_')[1] + "&TaskId=1";


                //if (Optype == 1) {
                //    ahref = "/ServiceManagement/ComprehensiveBusiness";
                //}
                //if (Optype == 2) {
                //    ahref = "/ServiceManagement/CoreBusiness";
                //}
                //if (Optype == 3) {
                //    ahref = "/ServiceManagement/ExchangeBusiness";
                //}
                //if (Optype == 4) {
                //    ahref = "/ServiceManagement/NongxinyinPaymentBusiness";
                //}
                //if (Optype == 5) {
                //    ahref = "/ServiceManagement/PaymentBusiness";

                //}
                top.window.location.href = ahref;
            } else {
                layer.msg('考试已提交，无法继续答题！', { icon: 2 });
                layer.closeAll();//关闭所有弹出框
                layer.layer('系统错误');
            }

            //history.back(-1);
        }
    });

}