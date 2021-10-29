var TMNO = "";
$(function () {
    TMNO = getQueryString("FormId");
    var TaskId = getQueryString("TaskId");
    var CustomerId = getQueryString("CustomerId");
    $.ajax({
        url: "/GetDefaultValue/GetDefaultValue",
        data: { "TaskId": TaskId, "TMNO": TMNO, "CustomerId": CustomerId },
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                var defaultValue = data[0]["DefaultValue"];
                var tabDefaultValue = data[0]["TabDefaultValue"];
                if (document.getElementById("DefaultValue")) {
                    //存在
                    var box = document.getElementById("DefaultValue");
                    box.remove();
                    var box2 = document.getElementById("TabDefaultValue");
                    box2.remove();
                    $(".bankmap").append('<input type="hidden" id="DefaultValue" name="DefaultValue" value="' + defaultValue + '" />');
                    $(".bankmap").append('<input type="hidden" id="TabDefaultValue" name="TabDefaultValue" value="' + tabDefaultValue + '" />');

                } else {
                    $(".bankmap").append('<input type="hidden" id="DefaultValue" name="DefaultValue" value="' + defaultValue + '" />');
                    $(".bankmap").append('<input type="hidden" id="TabDefaultValue" name="TabDefaultValue" value="' + tabDefaultValue + '" />');
                }


                var vals = defaultValue.split('$');
                for (var i = 0; i < vals.length; i++) {
                    if (vals[i].length > 0) {
                        var ss = vals[i].split(';');
                        if (ss.length > 0) {
                            var len = ss[ss.length - 1].split('#');
                            if (len.length == 3) {
                                $("#" + len[1]).after("<span style='color:red;position:absolute;right:0px;margin-top:-24px;'>!</span>");
                            }
                            if (len.length == 2) {
                                $("#" + len[0]).after("<span style='color:red;position:absolute;right:0px;margin-top:-24px;'>!</span>");
                            }
                        }
                    }
                }
            }
        }
    });

    $("input").keyup(function (e) {
        if (e.which == 13) {
            selectData($(this));
            try {
                if (initTable && typeof (initTable) == "function") {
                    initTable();
                }
            } catch {
            }
        }
    });
    $("select").change(function (e) {
        selectData($(this));
        try {
            if (initTable && typeof (initTable) == "function") {
                initTable();
            }
        } catch {
        }
    });

    var data = getCookie(TMNO);
    if (data != null) {
        var list = data.split('&');
        for (var i = 0; i < list.length; i++) {
            var items = list[i].split('=');
            if ($("#" + items[0]).attr("type") != "hidden") {
                $("#" + items[0]).val(items[1]);

                if ($("#" + items[0]).attr("type") == "text") {
                    selectData($("#" + items[0]));
                }
            }
        }
        delCookie(TMNO)
    }
    //获取域名，判断内网/外网，关闭复制粘贴
    var domain = document.domain;
    if (domain.indexOf("cayh.occupationedu.com") >= 0) {
        $("input").attr("oncopy", "return false").attr("onpaste", "return false").attr("oncut", "return false").attr("autocomplete", "off")
    }

});

var updateAuths = { "200037": ['sle_transactionCategory'] };

function selectData(e) {
    var id = $(e).attr("id");
    if ($(e).val() != "") {
        var defaultValue = $("#DefaultValue").val();
        if (defaultValue != null && defaultValue.length > 0) {
            var list1 = defaultValue.split('$');
            for (var i = 0; i < list1.length; i++) {
                var list2 = list1[i].split(';');
                var targetControle = list2[list2.length - 1].split('#');
                if (targetControle.length == 3 && targetControle[1] == id) {
                    for (var j = 0; j < list2.length - 1; j++) {
                        var sourceControle = list2[j].split('#');
                        if (sourceControle.length == 3) {
                            $("#" + sourceControle[1]).val(sourceControle[2]);
                            if (updateAuths[TMNO] == undefined || updateAuths[TMNO].indexOf(sourceControle[1]) == -1) {
                                $("#" + sourceControle[1]).attr("readonly", "readonly");
                            }
                        }
                        if (sourceControle.length == 2) {
                            if (sourceControle[0].startsWith("check")) {
                                if (sourceControle[1] == "true") {
                                    $("#" + sourceControle[0]).attr("checked", true).attr("readonly", "readonly");
                                }
                            }
                            else {
                                $("#" + sourceControle[0]).val(sourceControle[1]);
                                if (updateAuths[TMNO] == undefined || updateAuths[TMNO].indexOf(sourceControle[0]) == -1) {
                                    $("#" + sourceControle[0]).attr("readonly", "readonly");
                                } else {
                                    if (sourceControle[0] == "sle_transactionCategory") {
                                        changecashdiv($("#" + sourceControle[0]));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        fanxian()
    }
}

function fanxian() {
    
    var tabDefaultValue = $("#TabDefaultValue").val();
    if (tabDefaultValue != null && tabDefaultValue.length > 0) {
        var tabDefaultValues = tabDefaultValue.split('$');
        for (var t = 0; t < tabDefaultValues.length - 1; t++) {
            var ts = tabDefaultValues[t].split('#');
            if (ts.length == 2) {
                setTableValue(ts[1], ts[0]);
            } else {
                setTableValue(ts[0], '');
            }
        }
    }
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


var formType = getQueryString("FormType");
var totalResultId = getQueryString("TotalResultId");
var examId = getQueryString("ExamId");
var taskId = getQueryString("TaskId");
var CustomerId = getQueryString("CustomerId");
var LinkId = getQueryString("LinkId");
var Satisfaction = getQueryString("Satisfaction");

var formUrl = "/FormList/ToForm?";
function goPage(url, callback) {
    location.href = formUrl + "FormId=" + url + "&FormType=" + formType + "&TotalResultId=" + totalResultId + "&ExamId=" + examId + "&TaskId=" + taskId + "&CustomerId=" + CustomerId + "&LinkId=" + LinkId + "&Satisfaction=" + Satisfaction;
    if (callback) {
        callback();
    }
}
function afterGoPage() {
    var data = $("#form1").serialize();
    var params = decodeURIComponent(data, true); //关键点
    setCookie(getQueryString("FormId"), params);
}
//写cookies
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
//读取cookies
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))
        
        return unescape(arr[2]);
    else
        return null;
}
//删除cookies
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}


function initData(formId) {

    var defaultValue = $("#DefaultValue").val();

    if (defaultValue != null && defaultValue.length > 0) {
        var data = getCookie(formId);
        if (data != null) {
            var list = data.split('&');
            for (var i = 0; i < list.length; i++) {
                var items = list[i].split('=');
                if ($("#" + items[0]).is("select") || $("#" + items[0]).attr("type") == "text") {
                    $("#" + items[0]).val(items[1]);
                    selectData($("#" + items[0]));
                    if (TMNO == "200049") {
                        $("#" + items[0]).attr("readonly", "readonly");
                    }
                }
            }
        }
    } else {
        setTimeout("initData('" + formId + "')", 1000);
    }
}