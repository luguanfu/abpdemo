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
                window.location.href = "/PracticeAssessment/CaseEndView?PracticeType=1&Role=&ID=" + Eid
                //"/kaoshi/GetScoresIndex?Pid=" + Pid + "&Eid=" + Eid;
            }
            if (d == "88") {
                //考试模式下已经提交过 返回到成绩页面
                window.location.href = "/PracticeAssessment/CaseEndView?PracticeType=1&Role=&ID=" + Eid
                    //"/kaoshi/GetScoresIndex?Pid=" + Pid + "&Eid=" + Eid;
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

function Add(Eid, Pid,tid) {
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
                window.location.href = "/PracticeAssessment/CaseEndView?PracticeType=" + tid+"&Role=&ID=" + Eid
                //"/kaoshi/GetScoresIndex?Pid=" + Pid + "&Eid=" + Eid;
            }
            if (d == "88") {
                //考试模式下已经提交过 返回到成绩页面
                window.location.href = "/PracticeAssessment/CaseEndView?PracticeType=" + tid+"&Role=&ID=" + Eid
                //"/kaoshi/GetScoresIndex?Pid=" + Pid + "&Eid=" + Eid;
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