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
            , title: title
            , area: ['100%', '100%']
            , offset: ['0px', '0px']
            , skin: 'layui-layer-lan' //样式类名绿色为molv
            , shade: 0
            , moveOut: false
            //, offset: [ //为了演示，随机坐标
            //  Math.random() * ($(window).height() - 300)
            //  , Math.random() * ($(window).width() - 390)
            //]
            , maxmin: true
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
    //var ExamId = getQueryString("examId");
    //$("#ExamId").val(ExamId)
    //var planId = getQueryString("planId");
    //$("#planId").val(planId)

    //var TaskId = $("#TaskId").val();
    //var UserId = $("#UserId").val()

    //document.cookie = "ServiceRecord_" + UserId + "_" + ExamId + "=" + TaskId;
    //console.log("cok2:" + "ServiceRecord_" + UserId + "_" + ExamId + "=" + TaskId);
    ////console.log("ServiceRecord_UserId1:" + UserId);
    ////console.log("ServiceRecord_ExamId1:" + ExamId);
    ////console.log("ServiceRecord_Id1:" + TaskId);
    //$("#select_Type").change(function () {
    //    GetCoursewareList(1);
    //})
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

var answerTime = 0;
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
            parent.Tqueding();//总提交
        }
        intDiff--;
        answerTime++;
        parent.setAnswerTime(answerTime);
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
                        //$("#TaskId").val(taskID);
                        $("#rwImg").hide();
                        $("#rwTitle").show();
                    }
                    html += '<tr style="height: 33px;" id="tr_' + Id + '"  class="ss ' + trs + '" data-sysname="' + sysname + '"  data-busiType="' + busiType + '" data-TM_No="' + TM_No + '" data-UserId="' + UserId + '" data-Teller_No="' + Teller_No + '" data-DepartmentId="' + taskID + '" data-Plan_Name="" data-Id="' + Id + '" data-ExamId="' + ExamId + '" data-planId="' + planId + '" data-TotalScore="' + TotalScore + '" data-Task_Name="' + Task_Name + '">';
                    html += '<td style="width: 45px;" align="center">' + (i + 1) + '</td>';
                    html += '<td align="center">';
                    html += '<a href="javascript:void(0)" onclick="showpage(this)" eventId=' + Id + '>' + Task_Name + '</a>';
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

var fucengSpanTxt = "";

function getTask(TaskId) {
    $("#tableContainer").find("#tr_" + TaskId).find("td").eq(1).find("a").click();
    var TMNO = $("#tableContainer").find("#tr_" + TaskId).attr("data-TM_No");
    var sysname = $("#tableContainer").find("#tr_" + TaskId).attr("data-sysname");
    var busiType = $("#tableContainer").find("#tr_" + TaskId).attr("data-busiType");
    //该题目属于核心系统业务-个人开户,业务代码010101,请观看该业务视频.
    fucengSpanTxt = "该题目属于" + sysname + "业务-" + busiType + ",业务代码" + TMNO + ",请观看该业务视频.";
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



