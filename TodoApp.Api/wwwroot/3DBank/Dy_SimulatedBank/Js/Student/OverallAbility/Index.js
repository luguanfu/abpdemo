
var nameArray1 = new Array();//能力列表
var nameArrayXAxis = new Array();//x
var ScrocArrayXAxis = new Array();//x
var ScrocAbli = new Array();//x
var StudentId = "";

$(function () {

    initViewData();
   

    SelectGetlog();
    SelectScroc();


    $("#print_report").click(function () {

        var sign = layer.load(4, { shade: [0.2, '#393D49'], time: 9000 })
        $.ajax({
            type: "post",
            dataType: "json",
            cache: false,
            url: '/OverallAbility/Export_Word',
            data: {StudentId: StudentId },
            success: function (data) {
                layer.closeAll();
                if (data.indexOf("99") > -1) {
                    layer.msg("打印失败", { icon: 2, time: 1000 });
                    return;
                }
                else {
                    $("#downFile").attr("href", "/ashx/download.ashx?downurl=" + data);
                    $("#tf").click();
                }
            }
        })
    })
    setTimeout("initRadioClick()", 500)
    

    getAllAbilityScore();//能力
    GetExamination();//考试成绩
    GetExamRanking();//班级排名
    GetStudentRating();
    GetStuRankInfo();
    getLog(1);
    getData(1, 1);
    GetAbilityList();

});

//主要是判断页面是教师的还是学生端
function initViewData() {
    StudentId = getQueryString('StudentId');
    if (StudentId == null) {//学生端

    } else {//教师的

        $("#baogaoHref").click();
        $("#nengliHref").hide();
        $("#defenHref").hide();
        $("#ziwopingjiaBtn").hide();

    }


}

function initRadioClick()
{
   
    $("input:radio[name='fenzhi']").on('ifChecked', function (event) {
        if ($("input[name='fenzhi']:checked").val() == 1) {
            getData(1)
        }
        else {
            myChart.clear();
            getData(2);

        }
    })
}

function SelectGetlog() {
    $.getJSON('/OverallAbility/SelectGetlog', {}, function (data) {

        for (var i = 0; i < data.length; i++) {
            nameArray1.push(data[i]["AbilityName"])
            ScrocAbli.push(data[i]["TotalStuScore"])
        }
        myChartN();

    })
}

var allScores;
function SelectScroc() {
    $.getJSON('/OverallAbility/SelectScroc', { 'DateNum': $("#DateNum").val() }, function (data) {
        allScores = data;
        for (var i = 0; i < data.length; i++) {
            ScrocArrayXAxis.push(data[i]["TotalStuScore"])
        }
        //loadEcharts();
        myChartN();
    })
}


   
//实例化时间
var Date1 = new Date();
var dateMax = new Date(Date1.getTime()).toLocaleDateString();
var dateMin = new Date(Date1.getTime() - (24 * 7) * 60 * 60 * 1000).toLocaleDateString()
$("#DateNum").change(function () {
    //遍历时间
    var DateNum = $("#DateNum").val();
    nameArrayXAxis = [];
    dateMax = new Date(Date1.getTime()).toLocaleDateString();
    var days = 0;
    if (DateNum == 1) {
        days = 7;
    }
    else if (DateNum == 2) {
        days = 14;

    }
    else if (DateNum == 3) {
        days = 30;
    }
    else if (DateNum == 4) {
        days = 60;
    }
    else if (DateNum == 5) {
        days = 180;
    }
    dateMin = new Date(Date1.getTime() - (24 * days) * 60 * 60 * 1000).toLocaleDateString();
    if ($("input[name='fenzhi']:checked").val() == 1) {
        SelectScroc();
        getData(1);
    }
    else {
        getData(2);
    }

});

//根据渲染出来的数据，动态设置底部
function gaifoot() {
    //文档body的高度
    var bodyHeight = $(document.body).height()
    //当前窗口可视区域高度
    var winHeight = $(window).height()
    if (bodyHeight > winHeight) {
        $(".footer").removeClass("fid")
    } else {
        $(".footer").addClass("fid")
    }
}
setInterval("gaifoot()", "50");

//radio选中样式
$(document).ready(function () {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

});
function myChartN() {
    var myChart = echarts.init(document.getElementById('chart-course'));
    var seriesList = [];
    var max = Math.max.apply(null, ScrocArrayXAxis)
    for (var i = 0; i < nameArray1.length; i++) {
        var obj = {};
        obj.name = nameArray1[i];
        obj.max = max;
        seriesList.push(obj);
    }

    

    //[{
    //    name: nameArray1[0],
    //    max: 100
    //}],

    // 指定图表的配置项和数据
    option = {
        title: {
            text: ''
        },
        tooltip: {
            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 1);'
        },
        legend: {
            data: ['']
        },
        radar: {
            shape: 'circle',
            formatter: '测试字段',
            name: {

                textStyle: {
                    color: '#3487f5',
                    borderRadius: 3,
                    fontWeight: "bolder",
                    padding: [3, 5]
                }
            },
            indicator: seriesList,
            triggerEvent: true

        },
        series: [{
            name: '个人能力模型',
            type: 'radar',
            // areaStyle: {normal: {}},
            data: [{
                value: ScrocAbli,
                name: '个人能力模型'
            },

            ]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    myChart.on('click', function (params) {
        console.log(params)
        $.getJSON("/OverallAbility/CapabilityModel", {}, function (data) {
            for (var i = 0; i < data.length; i++) {

                if (params.name == data[i]["AbilityName"]) {
                    layer.msg('<h3 class="m-b-sm">' + data[i]["AbilityName"] + '</h3>' + data[i]["AbilityInfo"]+'', {
                        time: 5000
                    });
                }
            }
        })
    })
    $(document).on('click', '.layui-layer-msg', function (e) {
        var index = $(this).attr('times');
        layer.close(index);
    })

}


//折线图

//编辑自我评价
function change_pass() {
    layer.open({
        title: '编辑自我评价',
        btn: ['确定'],
        area: ['600px', '390px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#change_pass")
    });
}

//获取数据
var myChart = echarts.init(document.getElementById('chart-zhexian'));
function getData(type) {
    var DateNum = $("#DateNum").val();
    $.ajax({
        url: "/OverallAbility/getData",
        data: { "WeekID": DateNum, "Type": type },
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                console.log(data);

                var Title = [];
                //折线图
                for (var i = 0; i < data.length; i++) {
                    Title.push(data[i]["AbilityName"]);
                }
                var obj = {};
                var tmp = [];
                for (var i = 0; i < Title.length; i++) {
                    if (!obj[Title[i]]) {
                        obj[Title[i]] = 1;
                        tmp.push(Title[i]);
                    }
                }
                var seriesList = [];
                var length = tmp.length;

                for (var i = 0; i < tmp.length; i++) {
                    var series = {};
                    var abilityName = tmp[i];
                    series.name = abilityName;
                    series.type = 'line';
                    series.data = [];
                    series.label = { show: true };
                    for (var j = 0; j < data.length; j++) {
                        var obj = {};
                        if (tmp[i] == data[j]["AbilityName"]) {
                            obj.value = [data[j]["AddTime"], data[j]["TotalStuScore"]];
                            series.data.push(obj);
                        }
                    }

                    seriesList.push(series);
                }
                
                // 基于准备好的dom，初始化echarts实例
               
                var option = {
                    xAxis: {
                        type: 'time',
                        minInterval: 3600 * 24 * 1000,
                        axisLabel: {
                            formatter: function (value, index) {
                                var date = new Date(value);
                                return date.toLocaleDateString();
                            }
                        },
                        min: dateMin,
                        max: dateMax,
                    },
                    yAxis: {
                        type: 'value',
                    },
                    title: {
                        text: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: tmp,
                    },
                    series: seriesList
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        }
    });
}


function getLog(page) {
    var SelectAbilityId = $("#SelectAbilityId").val();
    var SelectshijId = $("#SelectshijId").val();
    var OperationName = $("#OperationName").val();
    var PageSize = 10;
    $.ajax({
        url: "/OverallAbility/getLog",
        data: { "SelectAbilityId": SelectAbilityId, "OperationName": OperationName, "SelectshijId": SelectshijId, "page": page, "PageSize": PageSize },
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function (data) {
            var html = '';
            //var data = data.Tb;//转换table
            var TbData = data.Tb
            if (TbData.length > 0) {
                for (var i = 0; i < TbData.length; i++) {
                    html += '<tr>';
                    var AddTimes = TbData[i]["Addtime"] + "";
                    html += '<td>' + AddTimes.substr(0, 19).replace('T', ' '); + '</td>';
                    html += '<td title="' + TbData[i]["AbilityString"]+'">' + TbData[i]["AbilityString"] + '</td>';
                    if (TbData[i]["PracticeName"] == null || TbData[i]["PracticeName"] == "null") {
                        html += '<td>--</td>';
                    }
                    else {
                        var Type_All = TbData[i]["Type_All"] + "";//1 比赛 2练习 3教学
                        var PracticeType = TbData[i]["PracticeType"] + "";//1 是个人 2 团队 
                        if (Type_All=="1") {//比赛
                            if (PracticeType=="1") {//个人
                                html += '<td>完成实训考核-个人考核《' + TbData[i]["PracticeName"]+'》</td>';
                            }
                            else {//团队
                                html += '<td>完成实训考核-团队考核《' + TbData[i]["PracticeName"] +'》</td>';
                            }
                        }
                        if (Type_All == "2") {//练习
                            if (PracticeType == "1") {//个人
                                html += '<td>完成自由练习-个人练习《' + TbData[i]["PracticeName"] +'》</td>';
                            }
                            else {//团队
                                html += '<td>完成自由练习-团队练习《' + TbData[i]["PracticeName"] +'》</td>';
                            }
                        }
                        if (Type_All == "3") {//教学
                           
                            html += '<td>完成实务教学-案例实操《' + TbData[i]["PracticeName"] +'》</td>';
                         
                        }
                        
                    }
                    html += '</tr>';
                }

                bootstrapPaginator("#PaginatorLibrary", data, getLog);//分页
                //样式重新加载
                redload();
            }
            else {
                html += '<tr>';
                html += '<td></td>';
                html += '<td>暂无数据</td>';
                html += '</tr>';
            }
            $("#tablelist").html(html);
        }
    });
}

function GetSecondTimeFomate(a) {
    return a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate() + ' ' + a.getHours() + ':' + a.getMinutes() + ':' + a.getSeconds();

}

//获取能力列表
function GetAbilityList() {
    //新增OK
    $.ajax({
        url: '/OverallAbility/GetAbilityList',
        Type: 'POST',
        data: { "TypeName": 1 },
        async: false,
        success: function (data) {
            $("#SelectAbilityId").empty();
            var json = JSON.parse(data);
            var html = " <option value=\"\">所有能力</option>";
            for (var i = 0; i < json.length; i++) {
                html += "<option value=\"" + json[i].ID + "\">" + json[i].AbilityName + "</option>";
            }
            $("#SelectAbilityId").append(html);
        }
    });
}

//获取实训报告能力分值
function getAllAbilityScore() {
    $.ajax({
        url: '/OverallAbility/getAllAbilityScore',
        Type: 'POST',
        data: { "TypeName": 1, StudentId: StudentId },
        async: false,
        dataType: 'json',
        success: function (data) {
            var html = '';
            //data = data.Tb;
            var TotolScore = 0;
            var STotolScore = 0;
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    html += '<tr>';
                    html += '<td>' + data[i]["AbilityName"] + '</td>';
                    html += '<td>' + data[i]["AbilityUpperLimit"] + '</td>';
                    html += '<td>' + data[i]["TotalStuScore"] + '</td>';
                    html += '</tr>';
                    TotolScore += parseInt(data[i]["TotalStuScore"]);
                    STotolScore += parseInt(data[i]["AbilityUpperLimit"]);
                }
                html += "<tr><td class='font-bold'> 总分</td><td>" + STotolScore + "</td><td>" + TotolScore + "</td></tr>";
                $("#trArea").html(html)
            }
        }
    });
}

//获取实训报告考试成绩
function GetExamination() {
    $.ajax({
        url: '/OverallAbility/GetExamination',
        Type: 'POST',
        data: { "TypeName": 1, StudentId: StudentId  },
        async: false,
        dataType: 'json',
        success: function (data) {
            var html = '';
            html += '<tr>'
            html += '<th>考核名称</th>'
            html += ' <th>考核类型</th>'
            html += '  <th>考核开始时间</th>'
            html += '  <th>得分</th>'
            html += '</tr> '
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    html += '<tr>';
                    html += '<td>' + data[i]["PracticeName"] + '</td>';
                    html += '<td>' + data[i]["PracticeType"] + '</td>';
                    html += '<td>' + new Date(data[i]["PracticeStarTime"]).Format("yyyy-MM-dd HH:mm") + '</td>';
                    html += '<td>' + data[i]["Scores"] + '</td>';
                    html += '</tr>';
                }

                $("#ExaminationResults").html(html)
            }
        }
    });
}

//获取实训报告班级排名
function GetExamRanking() {
    $.ajax({
        url: '/OverallAbility/GetExamRanking',
        Type: 'POST',
        data: { "TypeName": 1, StudentId: StudentId },
        async: false,
        dataType: 'json',
        success: function (data) {
            var html = '';
            html += '<tr>'
            html += '<th>排名名称</th>'
            html += ' <th>我的排名</th>'
            html += '</tr> '
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    html += '<tr>';
                    html += '<td>' + data[i]["rank_name"] + '</td>';
                    html += '<td>' + data[i]["newrank"] + '</td>';
                    html += '</tr>';
                }

                $("#paiming").html(html)
            }
        }
    });
}


//获得评级下拉框列表
function GetStudentRating() {
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Admin/TeacherClassMember/GetStudentRating',
        data: {},
        success: function (data) {

            data = JSON.parse(data);

            if (data.length > 0) {

                var html = "";
                for (var i = 0; i < data.length; i++) {
                    html += "<option value=" + data[i].ID + ">" + data[i].RankName + "</option>";
                }
                $("#rating").append(html);
            }

            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }

        }
    })
}

//编辑自我评价
function change_pass() {

    GetEvaluateById($("#allUserId").val);

    layer.open({
        title: '编辑自我评价',
        btn: ['确定'],
        area: ['600px', '390px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#change_pass"),
        yes: function (data) {
            var self_rating_id = $("#rating").val();
            var self_rating_txt = $("#TrainingSummary").val();
            if (self_rating_id == 0) {
                layer.msg("评级不能为空", { icon: 2, time: 800 });
                return;
            }
            if (self_rating_txt == "") {
                layer.msg("实训总结不能为空", { icon: 2, time: 800 });
                return;
            }
            var sign = layer.load(4, { shade: [0.2, '#393D49'], time: 9000 })
            $.ajax({
                url: '/OverallAbility/SelfEvaluation',
                Type: "Post",
                dataType: "json",
                data: { "self_rating_id": self_rating_id, "self_rating_txt": self_rating_txt },
                success: function (data) {
                    layer.closeAll();
                    if (data == 1) {
                        layer.msg("评价成功", { icon: 1, time: 800 });
                        setTimeout(function () {
                            GetStuRankInfo();
                        }, 800);
                    }
                    else {
                        layer.msg("评价失败", { icon: 2, time: 800 });
                        return;
                    }
                }
            })
        }
    });
}

//获取单个实体对象
function GetEvaluateById(Id) {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: '/Admin/TeacherClassMember/GetEvaluateById',
        data: { "studentId": Id },
        success: function (data) {
            $("#rating").val(data[0]["StuRankId"]);
            $("#TrainingSummary").val(data[0]["StuComment"]);
        }
    });
}

//获得学生评级信息
function GetStuRankInfo() {
    $.ajax({
        url: '/OverallAbility/GetTeacherEvaluationInformation',
        Type: "Post",
        dataType: "json",
        data: { StudentId: StudentId },
        success: function (data) {
            if (data.length > 0) {
                //$("#rating_name").html(data[0]["rating_name"] != null && data[0]["rating_name"] != "" ? data[0]["rating_name"] : "无");
                //$("#rating_txt").html(data[0]["rating_txt"] != "" && data[0]["rating_txt"] != null ? data[0]["rating_txt"] : "无");
                $("#self_rating_name").html(data[0]["stuRankName"] != null && data[0]["stuRankName"] != "" ? data[0]["stuRankName"] : "无");
                $("#self_rating_txt").html(data[0]["StuComment"] != null && data[0]["StuComment"] != "" ? data[0]["StuComment"] : "无");
            }
        }
    })
}

//导出
function ExportExamResult() {
    var OperationName = $("#OperationName").val();
    var SelectAbilityId = $("#SelectAbilityId").val();
    var SelectshijId = $("#SelectshijId").val();
    $.ajax({
        Type: "post",
        dataType: "json",
        url: '/OverallAbility/ExportExamResult',
        data: { "OperationName": OperationName, "SelectAbilityId": SelectAbilityId, "SelectshijId": SelectshijId },
        async: false,
        success: function (data) {
            $("#downFile").attr("href", "/Ashx/download.ashx?downurl=" + data[0]["filename"]);
            $("#tf").click();
        }
    });
}




