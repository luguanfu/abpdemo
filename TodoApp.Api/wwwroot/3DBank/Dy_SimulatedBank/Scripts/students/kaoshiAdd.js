/***************************************************************
  FileName:考试做题 总提交方法 javascript
  Copyright（c）2017-金融教育在线技术开发部
  Author:袁学
  Create Date:2017-7-13
 ******************************************************************/

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function Add(Eid, Pid) {
    //不自动关闭 time:-1  亮度页面不可点击 shade:0.01
    layer.msg('试卷正在提交，请稍等......', {
        icon: 16, shade: 0.1, time: -1
    });
    $.ajax({
        url: "/HB_kaoshi/AddExaminationResult",
        data: { "Eid": Eid, "Pid": Pid },
        type: 'POST',
        dataType: 'json',
        // async: false,
        success: function (d) {
            if (d == "1") {//交卷成功
                layer.closeAll();
                window.location.href = "/HB_kaoshi/GetScoresIndex?Pid=" + Pid + "&Eid=" + Eid;
            }
            if (d == "88") {
                //考试模式下已经提交过 返回到成绩页面
                window.location.href = "/HB_kaoshi/GetScoresIndex?Pid=" + Pid + "&Eid=" + Eid;
                return;
            }
            if (d == "99") {
                layer.alert('交卷失败，请刷新或重新登录再试！', { skin: 'layui-layer-molv' }, function () {
                    layer.closeAll();//关闭所有弹出框
                });
            }
        }
    });
}

function Add(Eid, Pid, tid) {
    //不自动关闭 time:-1  亮度页面不可点击 shade:0.01
    layer.msg('试卷正在提交，请稍等......', {
        icon: 16, shade: 0.1, time: -1
    });
    var Optype = getQueryString("Optype");
    var TaskId = $("#TaskId").val();
    var ExamId = $("#ExamId").val();
    var CustomerId = $("#CustomerId").val();
    var mid = $("#tMono").val();
    $.ajax({
        url: '/ServiceRecord/Submit',
        data: { "CustomerId": CustomerId, "TaskId": TaskId, "ExamId": ExamId, "mid": mid, "AnswerTime": $("#HfAnswerTime").val() },
        type: 'POST',
        dataType: 'text',
        // async: false,
        success: function (d) {
            if (parseInt(d.split('_')[0]) == 1) {
                layer.closeAll();//关闭所有弹出框
                var ahref = "";
                //window.open("/ServiceRecord/ScoreDetail?Diff=" + intDiffs + "&ExamId=" + ExamId + "&TaskID=" + TaskId + "&CustomerId=" + CustomerId);
                ahref = "/PracticeResult/Index?TotalResultId=" + d.split('_')[1] + "&TaskId=1";
                window.location.href = ahref;
            } else {
                layer.msg('考试已提交，无法继续答题！', { icon: 2 });
                layer.closeAll();//关闭所有弹出框
                layer.layer('系统错误');
            }
        }
    });
}