/// <reference path="../../Views/ServiceRecord/ScoreDetail.cshtml" />

//选择业务
function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

function Lchoice_class(obj, title, t) {

    $("#img").show();
    $("#ifrdivData").hide();
    $(".check_ico").hide();
    $(obj).find(".check_ico").show();
    $("#ParentId").val("");
    GetList(title, null);

    layer.open({
        title: title,
        //btn: ['确定', '取消'],
        area: ['1080px', '690px'],
        type: 1,
        shade: 0, //可以选择弹窗以外
        offset: ['110px', '280px'],
        skin: 'layui-layer-lan', //样式类名绿色为molv
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        maxmin: false,
        shadeClose: false, //开启遮罩关闭
        moveOut: true,
        content: $("#choice_class"),
        cancel: function () {
            $(obj).find(".check_ico").hide();
            $(".check_ico").hide();
        }
    });
}

var dalayers = null;
var topdalayer = null;
var fucengSpan = "";//视频提示
//选择业务
function choice_class(obj, title, t) {
    var TablesUrl = $("#TablesUrl").val();
    if (type != 1) {
        PracticeTime();
    }

    if (dalayers != obj) {
        if (topdalayer != null) {
            layer.close(topdalayer);
        }
        $(".check_ico").hide();

        $(obj).find(".check_ico").show();


        var width = window.screen.width;   //获取屏幕宽度
        var height = "680px";

        if (width == 1920) {
            height = "680px";
        }
        if (width < 1920) {
            height = "84%";
        }
        var TaskId = $("#TaskId").val()
        var UserId = $("#UserId").val()
        var ExamId = $("#ExamId").val()
        var DepartmentId = $("#DepartmentId").val()
        var planId = $("#planId").val()
        var SubBankId = $("#SubBankId").val()
        var formType = $("#Optype").val();
        var totalResult = $("#totalResult").val();
        var CustomerId = $("#CustomerId").val();
        var LinkId = $("#LinkId").val();
        var Satisfaction = $("#Satisfaction").val();
        var mid = $("#tMono").val();
        dalayers = obj;
        if (TaskId == "" || mid == "" || CustomerId == "" || CustomerId == "0") {
            alert("请开启任务后再进行做题！");
            return;
        }
        var url = '/ServiceRecord/layer?TaskId=' + TaskId + "&ExamId=" + ExamId + "&planId=" + planId + "&title=" + title + "&TellerId=" + UserId + "&FormType=" + formType + "&TotalResultId=" + totalResult + "&CustomerId=" + CustomerId + "&LinkId=" + LinkId + "&Satisfaction=" + Satisfaction + "&mid=" + mid;
        if (title == "网络查控综合平台") {
            url = TablesUrl + "nccp/?formid=030610&tellerId=" + UserId + "&examid=" + ExamId + "&banksiteid=" + SubBankId + "&DepartmentId=" + DepartmentId + "&planid=" + planId;
        }
        topdalayer = top.layer.open({
            type: 2 //此处以iframe举例
            , title: false
            , area: ['100%', '100%']
            , offset: ['0px', '0px']
            , shade: 0
            , moveOut: false
            //, offset: [ //为了演示，随机坐标
            //  Math.random() * ($(window).height() - 300)
            //  , Math.random() * ($(window).width() - 390)
            //]
            , maxmin: false
            , content: url
            //, zIndex: layer.zIndex //重点1
            , success: function (layero) {
                layer.setTop(layero); //重点2
            }, cancel: function () {
                $(obj).find(".check_ico").hide();
                dalayers = null;
                screen_width();
            }
        });
        $(".layui-layer-max").click(function () {
            var layuitype = $(this).attr("data-type");
            if (IsNullOrEmpty(layuitype) || layuitype == "1") {//扩大
                $(this).attr("data-type", "0");
                screen_widths();
            } else {//缩小
                $(this).attr("data-type", "1");
                screen_width();
            }
        })
    }

}

//iframe框退出zoom
function screen_width() {
    var width = window.screen.width;   //获取屏幕宽度
    if (isIE()) {
        //		if (width <= 1920) {
        //	        document.getElementsByTagName('body')[0].style.zoom = 1;
        //			document.body.style.zoom=1;
        //	    }
        //	    if (width < 1920) {
        //	       document.body.style.zoom=0.85;
        //	    }
    } else {
        if (width <= 1366) {
            document.body.style.zoom = 1;
            $(".servicers").css("zoom", "1");   //在ServiceRecord文件中防止iframe框上移不下来
        }
        else if (width <= 1440) {
            document.body.style.zoom = 1;
            $(".servicers").css("zoom", "1");
        }
        else if (width <= 1660) {
            document.body.style.zoom = 1;
            $(".servicers").css("zoom", "1");
        }
    }
}

function isIE() { //ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return true;
    }
    else if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) {
        return true;
    } else if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i) == "8.") {
        return true;
    } else {
        return false;
    }
}

function screen_widths() {
    document.getElementsByTagName('body')[0].style.zoom = 1;
}


///二级菜单
function GetList(sysname, obj) {
    var NodeUrl = $("#NodeUrl").val();

    var ParentId = $("#ParentId").val();
    if (obj != null && $(obj).attr("data-State") == "1") {
        $("#GetList").find("ul.part_two").each(function () {
            $(this).hide();
            $(obj).parent().find("dd").find("span").html("▼")
        });
        $(obj).show();
        $(obj).parent().find("dd").find("span").html("▲")
        return;
    }
    $.ajax({
        ifModified: ajaxifModified,
        cache: ajaxcache,
        Type: ajaxType,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: '/ServiceRecord/GetList',
        data: { "sysname": sysname, "ParentId": ParentId },
        success: function (tb) {
            var html = '';
            if (obj == null) {
                if (tb != null && tb.length > 0) {
                    html = "";
                    for (var i = 0; i < tb.length; i++) {
                        var TMName = tb[i]["TMName"]
                        var TMNO = tb[i]["TMNO"]
                        html += '<li class="m-b-sm">';
                        html += '<dd class="check_dd" data-TMNO="' + TMNO + '">' + TMName;
                        html += '<span style="float: right;">▼</span>';
                        html += '</dd>';
                        html += '<ul style="display:none;" class="m-l-md part_two" data-State="0" id="TMName_' + TMNO + '">';
                        html += '</ul>';
                        html += '</li>';
                    }
                } else {
                    html = '<li class="m-b-sm">暂无导航...</li>'
                }
                $("#GetList").html(html);
                $(".check_dd").click(function () {
                    $("#GetList").find("ul.part_two").each(function () {
                        $(this).hide();
                        $(this).parent().find("dd").find("span").html("▼")
                    });
                    $(this).parent().find(".part_two").show();
                    $(this).parent().find("dd").find("span").html("▲")

                    $("#ParentId").val($(this).attr("data-TMNO"))

                    GetList(sysname, $(this).parent().find(".part_two"));

                })
            } else {
                if (tb != null && tb.length > 0) {
                    for (var i = 0; i < tb.length; i++) {
                        var TMName = tb[i]["TMName"]
                        var TMNO = tb[i]["TMNO"].trim();
                        html += '<li class="liclicku" data-TMNO="' + TMNO + '">' + TMName + '</li>';
                    }
                } else {
                    html = ''
                }
                $(obj).html(html);
                if (html != "") {

                    $(obj).attr("data-State", "1");
                    $(obj).find(".liclicku").click(function () {

                        $("#GetList").find("dd.check_dd").each(function () {
                            $(this).removeClass("active")
                            $(this).parent().find("li.liclicku").removeClass("active")
                        })
                        var TMNO = $(this).attr("data-TMNO")
                        var TaskId = $("#TaskId").val()
                        //var UserId = $("#UserId").val()
                        var UserId = getQueryString("TellerId");
                        var ExamId = $("#ExamId").val()
                        var DepartmentId = $("#DepartmentId").val()
                        var planId = $("#planId").val()
                        var SubBankId = $("#SubBankId").val()
                        var url = NodeUrl + "User/indexone?formid=" + TMNO + "&tellerId=" + UserId + "&examid=" + ExamId + "&banksiteid=" + SubBankId + "&DepartmentId=" + DepartmentId + "&planid=" + planId;
                        $("#img").hide();
                        $("#ifrdivData").show();
                        $("#ifrdivData").attr("src", url)
                        $(this).show();
                        $(this).parent().parent().find("dd").addClass("active")
                        $(this).addClass("active")
                    })
                }
            }
        }
    });
}

//js控制2个切换
function renwu_btn() { //点击任务说明按钮
    $("#qiehuan_con").find("#tishi").hide();
    $("#qiehuan_con").find("#rizhi").hide();
    $("#qiehuan_con").find("#renwu").show();
    $("#tishi_btn").removeClass("active");
    $("#rizhi_btn").removeClass("active");
    $("#renwu_btn").addClass("active");
}

function tishi_btn() { //点击重要提示按钮
    $("#qiehuan_con").find("#tishi").show();
    $("#qiehuan_con").find("#renwu").hide();
    $("#qiehuan_con").find("#rizhi").hide();
    $("#tishi_btn").addClass("active");
    $("#renwu_btn").removeClass("active");
    $("#rizhi_btn").removeClass("active");
}

function rizhi_btn() { //点击操作日志按钮
    $("#qiehuan_con").find("#tishi").hide();
    $("#qiehuan_con").find("#renwu").hide();
    $("#qiehuan_con").find("#rizhi").show();
    $("#tishi_btn").removeClass("active");
    $("#renwu_btn").removeClass("active");
    $("#rizhi_btn").addClass("active");

    //加载日志,有任务开启，加载当前任务的日志；无任务开启，加载第一个任务的日志
    //var taskitems = $("#tableContainer .scrollContent tr");
    //if (taskitems != undefined && taskitems.length > 0) {
    //    var CustomerId = $("#CustomerId").val();
    //    var tr;
    //    if (TaskId != "0") {
    //        tr = $("#tr_" + CustomerId);
    //    } else {
    //        tr = $(taskitems[0]);
    //    }
    //    var obj = tr.find("#ids");
    //    showpage(obj);
    //}

}
var type = 0;
$(function () {
    type = getQueryString("type");
    if (IsNullOrEmpty(type)) {
        type = "0";
    }
    $("#type").val(type);

    bindIngfo()
    //if (type == 1) {
    kaoshimoshijishi();
    //} else {
    //    PracticeTime()
    //}
    var ExamId = getQueryString("examId");
    $("#ExamId").val(ExamId)
    var planId = getQueryString("planId");
    $("#planId").val(planId)

    var TaskId = $("#TaskId").val();
    var UserId = $("#UserId").val()

    document.cookie = "ServiceRecord_" + UserId + "_" + ExamId + "=" + TaskId;
    console.log("cok2:" + "ServiceRecord_" + UserId + "_" + ExamId + "=" + TaskId);
    //console.log("ServiceRecord_UserId1:" + UserId);
    //console.log("ServiceRecord_ExamId1:" + ExamId);
    //console.log("ServiceRecord_Id1:" + TaskId);
    $("#select_Type").change(function () {
        GetCoursewareList(1);
    })
});
var Pid = "";
var Eid = "";
var currentTime = "";
var AddStartDateTime = "";
var startTestTime = "";
var E_StartTime = "";
var E_EndTime = "";
var timeEnd = 1;//全局倒计时是否结束
var Mtime = 1;
var intDiffs = 0;
function kaoshimoshijishi() {
    Pid = getQueryString("Pid");
    Eid = $("#ExamId").val();
    if ($("#Isallow").val() == "1") {
        window.location.href = "/kaoshi/GetScoresIndex?Pid=" + Pid + "&Eid=" + Eid;
        return;
    }
    currentTime = stringToDate($("#CurrentTime").val());//当前时间
    // AddStartDateTime = stringToDate($("#AddStartDateTime").val());//当前进入时间 算开始 开始时间
    //startTestTime = stringToDate($("#TestStartDateTime").val()); //考试结束时间结束时间
    E_StartTime = stringToDate($("#StartTime").val());//有效开始时间
    E_EndTime = stringToDate($("#EndTime").val());//有效结束时间

    $.ajax({
        url: '/ashx/TimeHandler.ashx',

        success: function (data) {

            if (data.length > 16) {
                $("#CurrentTime").val(data);
                currentTime = stringToDate(data);

            }
        }
    });

    //如果没有提交 当前时间大于学生实际剩余做题时间
    if (currentTime > startTestTime) {
        //数据提交 
        //alert(currentTime + "/" + startTestTime);
        //alert("执行了这里");
        //Add(Eid, Pid);//总提交
    }
    //timeExam = setInterval("Time()", 1000);

    Time($("#Time").val());
}

function Time(intDiff) {
    timeExam = window.setInterval(function () {

        var leaveYu = intDiff % 10;
        if (leaveYu == 0) {
            // ----------------异步获取时间-------------------------
            $.ajax({
                url: '/ashx/TimeHandler.ashx',

                success: function (data) {

                    if (data.length > 16) {
                        $("#CurrentTime").val(data);
                        currentTime = stringToDate(data);

                    }
                }
            });
            // ----------------异步获取时间--------------------------
        }

        if (currentTime >= E_StartTime && Mtime == 1) {
            $(".wrapTime").remove();
            this.document.body.scrollTop = 0;
            $("#MinDiv").css('display', 'block');
        }

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

            $("#hoursTime").html(hour)
            $("#minTime").html(minute)
            $("#serseTime").html(second)
            if (intDiff == 1200) {
                layer.msg('本次考试剩余时间为20分钟，请考生把握好做题进度！', { time: 2500 });
            }
        } else {
            var formType = $("#Optype").val();
            clearInterval(timeExam);
            $("#daojishi").html('00:00:00');
            //Add(Eid, Pid, formType);//总提交 
        }
        intDiff--;
    }, 1000);
}


//字符串转时间
function stringToDate(str) {
    var arr = str.split(/\s|-|:/);
    var year = parseInt(arr[0]);
    var month = parseInt(arr[1].charAt(0)) * 10 + parseInt(arr[1].charAt(1));
    var date = parseInt(arr[2].charAt(0)) * 10 + parseInt(arr[2].charAt(1));

    var hour = parseInt(arr[3].charAt(0)) * 10 + parseInt(arr[3].charAt(1));
    var minute = parseInt(arr[4].charAt(0)) * 10 + parseInt(arr[4].charAt(1));
    var second = parseInt(arr[5].charAt(0)) * 10 + parseInt(arr[5].charAt(1));

    return new Date(year, month - 1, date, hour, minute, second);
}

var Istimer = 0;
var intDiff = 1;
function PracticeTime() {
    return;
    var ExamId = $("#ExamId").val()
    var planId = $("#planId").val()
    var data = {
        examId: ExamId,
        TimeSecond: intDiff,
        planId: planId
    };
    $.ajax({
        Type: "post",
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        url: '/ServiceRecord/PracticeTime',
        data: data,
        success: function (tb) {
            intDiff = 1;
            if (tb != null && tb.length > 0) {
                intDiff = parseInt(tb)
            }
            if (Istimer == 0) {
                Istimer = 1;
                timer();
            }

        }
    });
}

var LongRangeClickobj = null;
function LongRangeClick() {
    //window.parent.JzUser('@(teamModel.TeamName)', '@(tellerModel.Teller_Name)');
    //if (window.parent != null && window.parent.LongRangeClick != null) {
    //    window.parent.LongRangeClick();

    //} else if (window.parent[0] != null && window.parent[0].LongRangeClick != null) {
    //    window.parent[0].LongRangeClick();

    //} else if (window.parent[1] != null && window.parent[1].LongRangeClick != null) {
    //    window.parent[1].LongRangeClick();

    //}
    if (LongRangeClickobj != null) {
        showpage(LongRangeClickobj);
    }

}
function timer() {

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
            $("#hoursTime").html(hour);
            $("#minTime").html(minute);
            $("#serseTime").html(second);

        } else {

            $("#hoursTime").html("00");
            $("#minTime").html("00");
            $("#serseTime").html("00");
            tijiao();
            clearInterval(TimeOut);
            layer.msg('练习完成！', { icon: 1 });

        }
        intDiff++;
        intDiffs = intDiff;
        Second++;
    }, 1000);
}


//列表查询
function bindIngfo() {

    var ExamId = $("#ExamId").val();
    $.ajax({
        ifModified: ajaxifModified,
        cache: ajaxcache,
        Type: ajaxType,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: '/ServiceRecord/ComplexTaskList',
        data: { "ExamId": ExamId },
        success: function (tb) {

            var html = '<tr><td  colspan="4">暂无任务...</td></tr>';
            //var data = tb.Tb;//转换table
            var tnomo = $("#tMono").val();//已开启任务的id
            if (tb != null && tb.length != 0) {//table数据不为空 
                html = '';
                //data = eval('(' + tb + ')');
                data = tb;
                var DepartmentId = $("#DepartmentId").val();
                var Teller_No = $("#Teller_No").val();
                var UserId = $("#UserId").val();
                var planId = $("#planId").val();
                var ExamId = $("#ExamId").val();
                for (var i = 0; i < data.length; i++) {
                    var Task_Name = data[i]["Task_Name"]
                    var Id = data[i]["ID"]
                    var TotalScore = data[i]["TotalScore"]
                    var TM_No = ""; //data[i]["TM_No"]
                    var busiType = "";// data[i]["busiType"]
                    var sysname = "";// data[i]["sysname"]
                    var taskID = data[i]["TaskId"];

                    var Remarks = data[i]["Remarks"]
                    if (IsNullOrEmpty(Remarks)) {
                        Remarks = "";
                    }
                    var Important_Info = data[i]["Important_Info"]
                    if (IsNullOrEmpty(Important_Info)) {
                        Important_Info = "";
                    }
                    if (IsNullOrEmpty(TotalScore)) {
                        TotalScore = "0";
                    }

                    var trs = "";
                    var img = "/img/open.png";
                    if (!IsNullOrEmpty(tnomo) && tnomo == Id) {
                        trs = "active";
                        img = "/img/jiesuo.png";
                        $("#TaskId").val(taskID);
                        $("#rwImg").hide();
                        $("#rwTitle").show();
                    }
                    html += '<tr style="height: 33px;" id="tr_' + Id + '"  class="ss ' + trs + '" data-sysname="' + sysname + '"  data-busiType="' + busiType + '" data-TM_No="' + TM_No + '" data-UserId="' + UserId + '" data-Teller_No="' + Teller_No + '" data-DepartmentId="' + taskID + '" data-Plan_Name="' + Plan_Name + '" data-Id="' + Id + '" data-ExamId="' + ExamId + '" data-planId="' + planId + '" data-TotalScore="' + TotalScore + '" data-Task_Name="' + Task_Name + '">';
                    html += '<td style="width: 45px;" align="center">' + (i + 1) + '</td>';
                    html += '<td align="center">';
                    html += '<a href="javascript:void(0)" onclick="showpage(this)" eventId=' + Id + ' >' + Task_Name + '</a>';
                    html += '<div  style="display:none;" id="Remarks">' + Remarks + '</div>';
                    html += '<div  style="display:none;" id="Important_Info">' + Important_Info + '</div>';
                    html += '</td>';
                    if (Task_Name == "信息公告") {
                        html += '<td style="width: 50px;" align="center"></td>';
                        html += '<td  style="width: 60px;" align="center">';
                        html += '</td>';
                    } else {
                        html += '<td style="width: 50px;" align="center">' + TotalScore + '</td>';
                        html += '<td style="width: 60px;" align="center">';
                        html += '<a onclick="parent.OpenTask(this);" eventId=' + Id + ' style="color: Green;">';
                        html += '<img class="classimg" src="' + img + '" width="16" height="16" title="处理" class="imgb" id="img4615" alt="open">';
                        html += '</a>&nbsp;&nbsp;';
                        html += '<a onclick="parent.RedoTask(this);"  style="color: Gray; text-decoration: none;" style="display:none;">';
                        html += '<img src="/img/pen02.png" width="16" height="16" class="imgb"></a>';
                        html += '</td>';
                    }

                    html += '</tr>';
                }

            }
            $("#tableContainer").find("tbody").html(html);

            var TaskId = $("#TaskId").val();
            if (!IsNullOrEmpty(TaskId)) {
                getTask(TaskId);
            }

        }
    });
}

function initPage(ExamId,TaskId,CustomerId) {
    $.ajax({
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: '/ServiceRecord/ExamLoglist',
        data: { "ExamId": ExamId, "TaskId": TaskId, "CustomerId": CustomerId },
        success: function (tb) {
            var html = "";
            if (tb != null && tb.length > 0) {
                for (var i = 0; i < tb.length; i++) {
                    var LogDate = tb[i]["LogDate"];
                    var End = new Date(LogDate);
                    var EndStr = dateFormat("YYYY-mm-dd HH:MM", End);
                    html += '<tr>';
                    html += '<td>' + EndStr + '</td>';
                    html += '<td>' + tb[i]["CustomerName"] + '</td>';
                    if (!IsNullOrEmpty(tb[i]["Remark"])) {
                        var titlesp = tb[i]["Remark"].split('|');
                        html += '<td><strong>' + titlesp[0] + '|</strong>';
                        if (titlesp.length > 0) {
                            html += titlesp[1] + '</td>';
                        }
                    } else {
                        html += '<td>' + tb[i]["Remark"] + '</td>';
                    }
                    html += '</tr>';
                }

            }
            $("#qiehuan_con").find("#rizhi").find("#rizhilist").html(html);
        }
    });
}

var fucengSpanTxt = "";

function getTask(TaskId) {
    $("#tableContainer").find("#tr_" + TaskId).find("td").eq(1).find("a").click();
    var TMNO = $("#tableContainer").find("#tr_" + TaskId).attr("data-TM_No");
    var sysname = $("#tableContainer").find("#tr_" + TaskId).attr("data-sysname");
    var busiType = $("#tableContainer").find("#tr_" + TaskId).attr("data-busiType");
    //该题目属于核心系统业务-个人开户,业务代码010101,请观看该业务视频.
    fucengSpanTxt = "该题目属于" + sysname + "业务-" + busiType + ",业务代码" + TMNO + ",请观看该业务视频.";
}
//查看 说明、重要提示、日志
function showpage(obj) {
    var Id = $("#TaskId").val();
    var Task_Name = $(obj).parent().parent().attr("data-Task_Name");
    if ($(obj).parent().parent().attr("id") != undefined) {
        var cuid = $(obj).parent().parent().attr("id").replace("tr_", "");
        if (cuid != undefined) {
            $("#CustomerId").val(cuid);
        }
    }
    var ExamId = $("#ExamId").val();

    var Remarks = $(obj).parent().parent().find("#Remarks").text();//说明
    var Important_Info = $(obj).parent().parent().find("#Important_Info").text();//重要提示
    $("#rwImg").hide();
    $("#rwTitle").show();
    $("#qiehuan_con").show();

    LongRangeClickobj = obj;

    $("#qiehuan_con").find("#renwu").html(Remarks)
    $("#qiehuan_con").find("#tishi").html(Important_Info);


    $("#tableContainer").find(".scrollContent").find(".active").removeClass("active");
    $(obj).parent().parent().addClass("active")
    $.ajax({
        ifModified: ajaxifModifieds,
        cache: ajaxcaches,
        Type: ajaxTypes,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: '/ServiceRecord/ExamLoglist',
        data: { "ExamId": ExamId, "TaskId": Id, "CustomerId": $("#CustomerId").val() },
        success: function (tb) {
            var html = "";
            if (tb != null && tb.length > 0) {
                for (var i = 0; i < tb.length; i++) {
                    var LogDate = tb[i]["LogDate"];
                    var End = new Date(LogDate);
                    var EndStr = dateFormat("YYYY-mm-dd HH:MM", End);
                    html += '<tr>';
                    html += '<td>' + EndStr + '</td>';
                    html += '<td>' + tb[i]["CustomerName"] + '</td>';
                    if (!IsNullOrEmpty(tb[i]["Remark"])) {
                        var titlesp = tb[i]["Remark"].split('|');
                        html += '<td><strong>' + titlesp[0] + '|</strong>';
                        if (titlesp.length > 0) {
                            html += titlesp[1] + '</td>';
                        }
                    } else {
                        html += '<td>' + tb[i]["Remark"] + '</td>';
                    }
                    html += '</tr>';
                }

            }
            $("#qiehuan_con").find("#rizhi").find("#rizhilist").html(html);
        }
    });

}


var toplays = null;
var Task_obj = null;
function qx() {
    if (toplay != null) {
        layer.close(toplay);
    }
}
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
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
    var CustomerId = $("#CustomerId").val();
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
        data: { "ExamId": ExamId, "TaskId": taskID, "mid": Id, "CustomerId": CustomerId },
        success: function (tb) {
            if (tb == "1") {
                //$.cookie("ServiceRecord_Id", Id, { expires: 1 });
                //delCookie("ServiceRecord_" + UserId + "_" + ExamId);
                document.cookie = "ServiceRecord_" + UserId + "_" + ExamId + "=" + Id;
                console.log("cook1" + "ServiceRecord_" + UserId + "_" + ExamId + "=" + Id);
                $("#TaskId").val(taskID);
                //console.log("ServiceRecord_UserId2:" + UserId);
                //console.log("ServiceRecord_ExamId2:" + ExamId);
                //console.log("ServiceRecord_Id2:" + Id);
                //console.log(document.cookie); 
                //document.cookie = "ServiceRecord_Id=" + Id;

                $("#tableContainer").find(".scrollContent").find("tr.ss").each(function () {
                    $(this).find(".classimg").attr("src", "/img/open.png");
                })

                $("#tableContainer").find(".scrollContent").find(".active").removeClass("active");

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
//开启任务
function OpenTask(obj) {


    var TMNO = $(obj).parent().parent().attr("data-TM_No");
    var sysname = $(obj).parent().parent().attr("data-sysname");
    var busiType = $(obj).parent().parent().attr("data-busiType");
    //该题目属于核心系统业务-个人开户,业务代码010101,请观看该业务视频.
    fucengSpanTxt = "该题目属于" + sysname + "业务-" + busiType + ",业务代码" + TMNO + ",请观看该业务视频.";
    if (type != 1) {
        PracticeTime();
    }
    Task_obj = obj;
    showpage(obj);

    $("#divtishi").find("#divtitle").html("您确定要开启当前任务？");
    toplay = top.layer.open({
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

function Zqueding() {
    var tr = $(Task_obj).parent().parent();
    var Id = $(tr).attr("data-Id")
    var DepartmentId = $(tr).attr("data-DepartmentId")
    var Teller_No = $(tr).attr("data-Teller_No")
    var planId = $(tr).attr("data-planId")
    var Task_Name = $(tr).attr("data-task_name")
    var UserId = $(tr).attr("data-UserId")
    var ExamId = $(tr).attr("data-ExamId")
    var taskID = $("#TaskId").val()
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
//任务初始化
function RedoTask(obj) {
    if (type != 1) {
        PracticeTime();
    }
    Task_obj = obj;
    $("#divtishis").find("#divtitles").html("您确定要重做当前任务？");
    toplay = top.layer.open({
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


function tijiao() {
    toplay = parent.layer.open({
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

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
function Tqueding() {

    layer.close(toplay);
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
        data: { "CustomerId": CustomerId, "TaskId": TaskId, "ExamId": ExamId, "Diff": intDiffs, "mid": mid },
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
                window.location.href = ahref;
            } else {
                layer.msg('考试已提交，无法继续答题！', { icon: 2 });
                layer.closeAll();//关闭所有弹出框
                layer.layer('系统错误');
            }

            //history.back(-1);
        }
    });

}



//视频帮助
function choice_shipin() {
    $("#Keyword").val("")
    GetCoursewareList(1);
    $("#fuceng").hide();
    //if (fucengSpanTxt != "") { 
    //    $("#fuceng").find("span").html(fucengSpanTxt);
    //    $("#fuceng").show();
    //}
    top.layer.open({
        title: '视频帮助',
        area: ['920px', '590px'],
        type: 1,
        shade: 0, //可以选择弹窗以外
        skin: 'layui-layer-lan', //样式类名绿色为molv
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        maxmin: true,
        shadeClose: false, //开启遮罩关闭
        content: $("#choice_shipin"),
        success: function (layero) {

            layer.setTop(layero); //重点2
        }
    });
    $(".layui-layer-max").click(function () {
        var layuitype = $(this).attr("data-type");
        if (IsNullOrEmpty(layuitype) || layuitype == "1") {//扩大
            $(this).attr("data-type", "0");
            screen_widths();
        } else {//缩小
            $(this).attr("data-type", "1");
            screen_width();
        }
    })
}
function close_tishi() { //视频弹窗浮层控制
    $("#fuceng").hide();
}
//列表数据加载
function GetCoursewareList(page) {

    var PageSize = 5;
    var State = $("#select_Type").find("option:selected").val();
    var Keyword = $("#Keyword").val();
    $.ajax({
        ifModified: ajaxifModifieds,
        cache: ajaxcaches,
        Type: ajaxTypes,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: '/ServiceRecord/GetCoursewareList',
        data: { "page": page, "PageSize": PageSize, "State": State, "Keyword": Keyword },
        success: function (tb) {
            var html = '';
            var data = tb.Tb;//转换table
            if (tb != null && tb.Total != 0) {//table数据不为空
                for (var i = 0; i < data.length; i++) {

                    html += '<tr data-Id="' + data[i]["Id"] + '"  data-Url="' + data[i]["Url"] + '" >';
                    var idx = 0;

                    if (page != "undefined" && page != null) {
                        idx = page;
                        idx = idx - 1;
                    }
                    html += '<td>' + ((idx * PageSize) + i + 1) + '</td>';
                    html += '<td>' + data[i]["BelongSystem"] + '</td>';
                    html += '<td>' + data[i]["BusinessCode"] + '</td>';
                    html += '<td>' + data[i]["BusinessName"] + '</td>';
                    html += '<td>';
                    html += '<button class="lookflash" onclick="lookflash(this)" ></button>';
                    html += '</td>';
                    html += '</tr>';
                }
            } else {
                html = '<td colspan="5">暂无帮助视频...</td> ';
            }
            $("#tablelist").html(html);
            //分页控件加载
            bootstrapPaginator("#PaginatorLibrarys", tb, GetCoursewareList);//分页

        }
    });
}

function lookflash(obj) {
    var tr = $(obj).parent().parent();
    var Id = $(tr).attr("data-Id");
    var Url = $(tr).attr("data-Url");
    window.open("/DigitalBooks/play?videourl=" + encodeURIComponent(Url));
}



