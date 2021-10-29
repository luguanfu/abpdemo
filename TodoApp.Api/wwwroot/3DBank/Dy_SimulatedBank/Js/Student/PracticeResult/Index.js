function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

var TRId;
var TaskId;
var SceneId;
var resuserid;
$(function () {
    resuserid = getQueryString('UserId');
    TRId = getQueryString('TotalResultId');
    TaskId = getQueryString("TaskId");
    GetTotalScore();
    GetBaseDataDoTaskDetails(); 
    GetAbilityScore();
    getCustomList(() => {
        opurl(2);
    });
    GetAdditionScores();
    GetCaseCapabilityScoreForRole(); 
});


function GetBaseDataDoTaskDetails() {
    $.ajax({
        url: "/PracticeResult/GetTaskDetailsAccuracy",
        data: { "TRId": TRId, "TaskId": TaskId },
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function (data) { 
            new Chart("pie1").ratePie(data["开工管理"]);
            new Chart("pie2").ratePie(data["厅堂服务"]);
            new Chart("pie3").ratePie(data["柜面服务"]);
            new Chart("pie4").ratePie(data["完工管理"]); 

            new Chart("pie5").ratePie(data["大堂经理"]);
            new Chart("pie6").ratePie(data["高柜柜员"]);
            new Chart("pie7").ratePie(data["低柜柜员"]);

            //$("#KGid").text(data["开工管理"] + '%');
            //$("#TTid").text(data["厅堂服务"] + '%');
            //$("#FWid").text(data["柜面服务"] + '%');
            //$("#WGid").text(data["完工管理"] + '%');
        }
    });
}

function CreateWord() {
    $.ajax({
        url: "/PracticeResult/CreateWord",
        data: { "TRId": TRId, "TaskId": TaskId },
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function (data) {

        }
    });
}

function opurl(sid) {
    SceneId = sid;

    GetSceneScoreList(1);

}
function GetTotalScore() {
    $.ajax({
        url: "/PracticeResult/GetTotalScore",
        data: { "TRId": TRId, "TaskId": TaskId  },
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                $("#Scores").html(data[0]["Scores"]);
                $("#PracticeName").html(data[0]["Name"]);
            }
            else {
                $("#Scores").html(0);
            }
        }
    });
}
//获取明细
function GetSceneScoreList(page) {
    var CustomerId = 0;
    if (CustomList != "") {
        CustomerId = CustomList[page - 1].ID;
    }

    setBootstrapPaginator(page);
    $.ajax({
        url: '/PracticeResult/GetSceneScoreList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "TaskId": TaskId, "SceneId": SceneId, "CustomerId": CustomerId, "UserId": resuserid, "TRId": TRId },
        success: function (data) { 
            var html = '';
            ;
            var taskDetailList = {};
            var zhengquelv = 0;
            var AccountNo = "";
            var SName = "";
            var state = 0;
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (!(item.SubLinkId in taskDetailList)) {
                    taskDetailList[item.SubLinkId] = {};
                }
                if (!(item.OperationName in taskDetailList[item.SubLinkId])) {
                    taskDetailList[item.SubLinkId][item.OperationName] = [];
                }
                taskDetailList[item.SubLinkId][item.OperationName].push(item);
                zhengquelv += item.Scores;

                if (item.SName != null && state == 0) {
                    state = 1;
                    SName = item.SName;
                    AccountNo = item.AccountNo;
                }
               
                
            }
            if (AccountNo == null || AccountNo=="") {
                AccountNo = "暂无";
            }
            if (SName == null || SName=="") {
                SName = "暂无";
            }
            if (SceneId == 1) {
                $("#StuName").text(SName);
                $("#UserName").text(AccountNo);
            }
            else if (SceneId == 2) {
                $("#StuName1").text(SName);
                $("#UserName1").text(AccountNo);
            }
            else if (SceneId == 3) {
                $("#StuName2").text(SName);
                $("#UserName2").text(AccountNo);
            }
            else {
                $("#StuName3").text(SName);
                $("#UserName3").text(AccountNo);
            }
            var totalLen = 1;
            if (data.length > 0) {
                totalLen = data.length;
            }
            zhengquelv = (zhengquelv * 100.0 / totalLen).toFixed(1);
            $("#KGid").text(zhengquelv + '%');
            $("#TTid").text(zhengquelv + '%');
            $("#FWid").text(zhengquelv + '%');
            $("#WGid").text(zhengquelv + '%');

            var i = 0;
            var j = 0;
            var PScores = 0;
            var tdlVlaues = Object.values(taskDetailList);
            var xtemp = tdlVlaues.splice(tdlVlaues.length - 1, 1)
            tdlVlaues.splice(1, 0, xtemp[0])
            for (var link in tdlVlaues) {
                var linkitem = tdlVlaues[link];
                j = 0;
                for (var oper in linkitem) {
                    var operitem = linkitem[oper];
                    for (var k in operitem) {
                        var item = operitem[k];

                        var baseString = '';
                        var IScores = 0;
                        if (item.Scores != "") {
                            IScores = item.Scores;
                        }
                        PScores = PScores + IScores;
                        //var lie1 = '<td rowspan="{SpanCount}"><input type="checkbox" class="i-checks" name="input[]" value="{SubLinkId}"></td>';
                        var lie2 = '<td rowspan="{SpanCount}">{LinkName}</td>';
                        var lie3 = '<td rowspan="{SpanCount2}" class="{TextColor}">{OperationName}</td>';
                        var lie4 = '<td>{Answer}</td>';
                        var lie5 = '<td>{StuOperationalAnswers}</td>'; //
                        var lie6 = '';
                        /* var lie6 = '<td><button class="btn_look" onclick="See(' + item.SubLinkId + ')")>查看解析</button></td>';
                        if (item.Types == "3") {
                            lie6 = '<td><button class="btn_look" onclick="SeeInquiry(' + item.TaskDetailId + ')")>查看解析</button></td>';
                        }*/

                        var TextColor = "text-navy";

                        if (item.Scores == 0) {
                            var lie5 = '<td style="color:red">{StuOperationalAnswers}</td>'; //
                        }



                        var StuOperationalAnswers = item.StuOperationalAnswers;
                        if (item.StuOperationalAnswers == null) {
                            StuOperationalAnswers = "";
                        }
                        else {
                            if (item.LinkId == 133) {
                                var textName = "";
                                var Zhang = ["柜员私章", "银行业务公章", "附件章", "现讫章", "假币章", "货币鉴定专用章", "转讫章", "账户管理专用章"];
                                var StuOperationalAnswersList = item.StuOperationalAnswers.split(',');
                                for (var i = 0; i < StuOperationalAnswersList.length; i++) {
                                    if (StuOperationalAnswersList[i].length > 0) {
                                        textName += Zhang[StuOperationalAnswersList[i] - 1] + ",";
                                    }
                                }
                                StuOperationalAnswers = textName.substr(0, textName.length - 1);
                            }
                        }

                        var Answer = item.Answer;
                        if (item.Types == "1") {
                            if (item.LinkId == 5) {
                                Answer = item.TMName ? item.TMName : Answer;
                                if (StuOperationalAnswers !== null && StuOperationalAnswers !== undefined) {
                                    if (StuOperationalAnswers != "已校验" && StuOperationalAnswers != "未校验") {
                                        if (item.Scores == 0) {
                                            StuOperationalAnswers = "不完全正确";
                                        } else {
                                            StuOperationalAnswers = "完全正确";
                                        }
                                    }

                                }
                            }
                        } else if (item.Types == "2") {
                            ;
                            Answer = item.TMName;
                            if (StuOperationalAnswers !== null && StuOperationalAnswers !== undefined) {
                                if (StuOperationalAnswers != "已校验" && StuOperationalAnswers != "未校验") {
                                    if (item.Scores == 0) {
                                        StuOperationalAnswers = "不完全正确";
                                    } else {
                                        StuOperationalAnswers = "完全正确";
                                    }
                                }

                            }
                        } else if (item.Types == "3") {
                            TextColor = "text_lv";
                            Answer = `${item.CustomerQuestion.split('|').pop().split(':').pop()}:${item.InquiryAnswer}`;
                        }

                        baseString += '<tr>';
                        if (j == 0 && k == 0) {
                            //baseString += lie1;
                            baseString += lie2;
                        }
                        if (k == 0) {
                            baseString += lie3;
                        }
                        baseString += lie4;
                        baseString += lie5;
                        baseString += lie6;
                        baseString += '</tr>';

                        var linkCount = 0;
                        for (var temp1 in linkitem) {
                            linkCount += linkitem[temp1].length;
                        }

                        var LinkName = linkOperDict[item.SubLinkId];
                        if (item.SubLinkId == "5") {
                            LinkName = "填单";
                        }
                        else if (item.SubLinkId == "15") {
                            LinkName = "柜台送别";
                        }
                        else if (item.SubLinkId == "16") {
                            LinkName = "厅堂送别";
                        }


                        html += baseString.format({
                            SpanCount: linkCount,
                            SubLinkId: item.SubLinkId,
                            SpanCount2: operitem.length,
                            LinkName: LinkName,
                            OperationName: item.OperationName,
                            Answer: Answer,
                            AbilityString: item.AbilityString,
                            TaskDetailId: item.TaskDetailId,
                            StuOperationalAnswers: StuOperationalAnswers,
                            TextColor: TextColor
                        });
                    }

                    j++;
                }

                i++;
            }
            if (SceneId == 1) {
                $(`#tbody1`).html(html);
                $("#Scores1").html(PScores);
            }
            else if (SceneId == 2) {
                $(`#tbody2`).html(html);
                $("#Scores2").html(PScores);
            }
            else if (SceneId == 3) {
                $(`#tbody3`).html(html);
                $("#Scores3").html(PScores);
            }
            else if (SceneId == 4) {
                $(`#tbody4`).html(html);
                $("#Scores4").html(PScores);
            }
            redload();
        }
    }); 
}
 

function downLoadExcel() {
    var PracticeName = $("#PracticeName").html();
    $.ajax({
        url: '/PracticeResult/ExportForExcel',
        Type: "post",
        //dataType: "json", cache: false,
        data: { "TaskId": TaskId, "TRId": TRId, "PracticeName": PracticeName},
        success: function (data) {
           
            window.open(data);
        }
    });
    
}  
var lastpage;
function GetList(page) {
    lastpage = page;
    $.ajax({
        url: '/PracticeResult/GetSceneCustomerList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "TaskId": TaskId, "SceneId": SceneId, "Page": page, "UserId": resuserid, "TRId": TRId },
        success: function (tb) {
            var data = tb.Tb;//转换table 
            if (data.length > 0) {
                $(`#kehuindex${SceneId}`).text(`客户${tb.PageIndex}`);
                $(`#kehuming${SceneId}`).text(data[0].CustomerName);
                $(`#kehuyewu${SceneId}`).text(data[0].BusinessName);
                GetSceneScoreList(SceneId, data[0].CustomerId);
            }
            bootstrapPaginator(`#PaginatorLibrary${$("#SceneId").val()}`, tb, GetList);//分页
        }
    });
    return;
}


var CustomList;
function getCustomList(callback) {
    $.ajax({
        url: '/PracticeResult/GetSceneCustomerList',
        Type: "post",
        async: false,
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "TaskId": TaskId, "TRId": TRId, "UserId": resuserid },
        success: function (tb) {
            CustomList = tb;
            if (CustomList.length > 0) {
                setBootstrapPaginator(1);
            }
            typeof callback !== 'function' || callback(tb);
        }
    });

}

function setBootstrapPaginator(page) {
    var tb = {};
    tb.Total = CustomList.length;

    tb.PageIndex = Number(page);
    tb.PageTotal = CustomList.length;
    tb.PageSize = 1;
    if (CustomList != "") {
        var item = CustomList[page - 1];
        $(`#kehuindex${2}`).text(`客户${page}`);
        $(`#kehuming${2}`).text(item.CustomerName);
        $(`#kehuyewu${2}`).text(item.BusinessName);
        $(`#kehumanyi${2}`).text("满意度:" + item.Satisfaction);
        bootstrapPaginator(`#PaginatorLibrary2`, tb, GetSceneScoreList);//分页
        $(`#kehuindex${3}`).text(`客户${page}`);
        $(`#kehuming${3}`).text(item.CustomerName);
        $(`#kehuyewu${3}`).text(item.BusinessName);
        $(`#kehumanyi${3}`).text("满意度:" + item.Satisfaction);
        bootstrapPaginator(`#PaginatorLibrary3`, tb, GetSceneScoreList);//分页
    }

}


//查看 只有pdf格式 浏览器直接打开
function See(num) {
    $.ajax({
        url: "/PracticeResult/getPDFUrl",
        data: { "Num": num },
        type: 'POST',
        async: false,
        success: function (data) {
            if (data.length > 0) {
                window.open(data);
            }
            else {
                layer.msg("暂无解析");
            }
        }
    });
}

//查看质询解析
function SeeInquiry(TaskDetailId) {

    $.ajax({
        url: "/PracticeResult/SeeInquiry",
        data: { "TaskDetailId": TaskDetailId },
        type: 'POST',
        async: false,
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {

                var Analysis = data[0].Analysis;
                if (Analysis == null || Analysis.length == 0) {
                    layer.msg("暂无解析");
                    return;
                }
                $("#zhixunjiexiDiv").html(HTMLDecode(Analysis));
                layer.open({
                    title: false,
                    //btn: ['确定'],
                    area: ['800px', '750px'],
                    type: 1,
                    skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
                    closeBtn: false, //显示关闭按钮
                    anim: 2,
                    shade: 0.8,
                    shadeClose: false, //开启遮罩关闭
                    content: $("#zhixunjiexi")
                });
            }
            else {
                layer.msg("暂无解析");
            }
        }
    }); 
}

function GetAdditionScores() {
    $.ajax({
        url: "/PracticeResult/GetAdditionScores",
        data: { "TaskId": TaskId, "UserId": resuserid, "TRId": TRId },
        type: 'POST',
        async: false,
        success: function (data) {
            $("#AdditionScores").html(data);
        }
    });
}

var SceneNameArr = ["开工管理", "厅堂服务", "柜面服务", "完工管理"];
var linkOperDict = {
    "1": "开工",
    "2": "厅堂接待",
    "3": "取号",
    "4": "取号后引导",
    "5": "厅堂填单",
    "6": "填单后引导",
    "7": "柜面接待",
    "8": "单据收取",
    "9": "资料收取与校验",
    "91": "资料收取与校验-身份证",
    "92": "资料收取与校验-非身份证",
    "10": "现金处理",
    "11": "柜员填单",
    "12": "业务办理",
    "13": "单据盖章与签字",
    "133": "单据盖章",
    "134": "单据签字",
    "14": "返还资料",
    "15": "柜台营销转介",
    "151": "柜台送别",
    "16": "厅堂营销转介",
    "161": "厅堂送别",
    "17": "完工",
    "20": "厅堂服务-分流",
    "2.5": "厅堂服务-分流"
};

function GetCaseCapabilityScoreForRole() {
    $.ajax({
        url: "/PracticeResult/GetCaseCapabilityScoreForRole",
        data: { "TRId": TRId, "TaskId": TaskId },
        type: 'POST',
        async: false,
        success: function (data) {
            if (data.length > 2) {
                var Scores = data.split(',');
                var GInfo = Scores[1];    //高柜
                var DInfo = Scores[2];  //低柜
                var JInfo = Scores[0];  //大堂经理
                var UserInfo = "";
                var roleAbility = "";
                var temp = "";
                ;
                var html = "<table class='table_public'><thead><tr><th>成员</th><th>角色</th><th>角色能力获取</th></tr></thead>";
                if (JInfo != "") {
                    if (JInfo.indexOf(";") != -1) {
                        temp = JInfo.split(';');
                        UserInfo = JInfo.split("|")[0];
                        for (var i = 0; i < temp.length; i++) {
                            roleAbility += temp[i].split("|")[1] + ";";
                        }
                        roleAbility = roleAbility.substring(0, roleAbility.length - 1);
                        html += "<tr><td> " + UserInfo + "</td><td>大堂经理</td><td>" + roleAbility + "；</td></tr>";
                    }
                    else {
                        UserInfo = JInfo.split("|")[0];
                        roleAbility = JInfo.split("|")[1];
                        html += "<tr><td> " + UserInfo + "</td><td>大堂经理</td><td>" + roleAbility + "；</td></tr>";
                    }

                }
                if (GInfo != "") {
                    roleAbility = "";
                    if (GInfo.indexOf(";") != -1) {
                        temp = GInfo.split(';');
                        UserInfo = GInfo.split("|")[0];
                        for (var i = 0; i < temp.length; i++) {
                            roleAbility += temp[i].split("|")[1]+";";
                        }
                        roleAbility = roleAbility.substring(0, roleAbility.length - 1);
                        html += "<tr><td> " + UserInfo + "</td><td>高柜柜员</td><td>" + roleAbility + "；</td></tr>";
                    }
                    else {
                        UserInfo = GInfo.split("|")[0];
                        roleAbility = GInfo.split("|")[1];
                        html += "<tr><td> " + UserInfo + "</td><td>高柜柜员</td><td>" + roleAbility + "；</td></tr>";
                    }

                }
                if (DInfo != "") {
                    roleAbility = "";
                    if (DInfo.indexOf(";") != -1) {
                        temp = DInfo.split(';');
                        UserInfo = DInfo.split("|")[0];
                        for (var i = 0; i < temp.length; i++) { 
                            roleAbility += temp[i].split("|")[1] + ";";
                        }
                        roleAbility = roleAbility.substring(0, roleAbility.length - 1);
                        html += "<tr><td> " + UserInfo + "</td><td>低柜柜员</td><td>" + roleAbility + "；</td></tr>";
                    }
                    else {
                        UserInfo = DInfo.split("|")[0];
                        roleAbility = DInfo.split("|")[1];
                        html += "<tr><td> " + UserInfo + "</td><td>低柜柜员</td><td>" + roleAbility + "；</td></tr>";
                    }

                }
                html += "</table>";
                $("#RoleAbility").html(html);
            }
            else {
                $("#RoleAbility").hide();
            }

        }
    });
}

function GetAbilityScore() {
    $.ajax({
        url: "/PracticeResult/GetAbilityDetailsAccuracy",
        data: { "TaskId": TaskId, "UserId": resuserid, "TRId": TRId },
        type: 'POST',
        async: false,
        dataType:"json",
        success: function (data) {
            var num = 7;
            for (var i in data) {
                num++;
                var id = "pie" + num;
                var showNameId = "showName" + num;
                var html = "";
                html += '<div class="col-sm-3">';
                html += '<canvas id="' + id + '" width="100px" height="100px"></canvas>';
                html += '<p class="m-t-sm" id="' + showNameId + '"></p>';
                html += '</div>';
                console.dir(i);//输出姓名
                console.dir(data[i]);//输出分数
                $("#grArea").append(html);
                $("#" + showNameId + "").html(i);
                new Chart(id).ratePie(data[i]);
            }

           
            //else {
            //    var html1 = "";
            //    html1 += '<p class="m-t-sm">未获取到能力项</p>';
            //    $("#grArea").html(html1);
            //} 
        }
    });
}