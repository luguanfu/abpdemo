//FormType
//1.
//正常做题，管理端配置了各个字段答案，学生端答案一致则得分（bsi银行原表单，10.柜员填单） //8//厅堂填单台填单学生提交
//2.
//标注对错，管理端配置了各个字段和标注错误，学生端反显配置字段选出错误字段（5.厅堂填单）
//3.
//查看表单，单据与资料收取获得并放置到物品栏（查看身份证不显示核查结果）
//4.
//查看身份证联网核查结果，（校验打印获得）（显示核查结果）
//5.
//签字盖章类，显示配置字段，并且可以签字盖章
//6
//柜员填单操作所得，显示学生操作内容
//7
//签字盖章环节  来源柜员填单操作，显示学生操作内容
//8
//审核查看的数据
//9
//页面上单据的填写  不到后台做持久化

//流程控制js
$(function () {

    InitViewDataAndEvent();

    if ($("#LinkId").val() == "1") {
        $("#CustomerId").val("-1");
    } else if ($("#LinkId").val() == "17") {
        $("#CustomerId").val("-2");
    }

    if (FormType == "1" || FormType == "0") {
        $("#btnsubmit,#fake_btnsubmit").on("click", function () {
            btnSubmit();
        })
    }


})

var FormType;
var verificationSuccessful = 1;
function InitViewDataAndEvent() {
    FormType = $("#FormType").val();
    if (FormType == undefined || FormType == "" || FormType > "9") {//后续增加类型需要修改此处
        FormType = "0";
    }
    InitViewData();//加载数据
    InitViewEvent();//加载事件
    InitGaizhangQianziEvent();

}

function getBaseSubmitInfo() {
    var data = {};
    data.TRId = $("#TRId").val();
    if (data.TRId == undefined) {
        data.TRId = $("#TotalResultId").val();
    }
    data.ExamId = $("#ExamId").val();
    data.TaskId = $("#TaskId").val();
    data.CustomerId = $("#CustomerId").val();
    data.FormId = $("#FormId").val();
    data.LinkId = $("#LinkId").val();
    data.Satisfaction = $("#Satisfaction").val();
    return data;

}


//校验 必填
function checkFormJs() {

    var errormsg = "";
    //校验放大镜是否点击
    var kcs = $(".sousuo");
    for (var i = 0; i < kcs.length; i++) {
        var isclick = $(kcs[i]).attr("vl-exec");
        //判断关联快查的控件是否置灰以及控件类型
        var control = $(kcs[i]).prev();
        if (control.attr("id") == undefined) {
            //没有id说明control是select共生的input，再往上找一级找到select
            control = control.prev();
        }
        if (control.attr("disabled") == "disabled" || control.attr("vl-disabled") == "true") {
            isclick = "true";
        }
        if (isclick == "false") {
            console.log($(kcs[i]).attr('vl-message'));
            var tips = eval($(kcs[i]).attr('vl-message'));
            if (tips != null && tips.length > 0) {
                errormsg += tips[0];
            }
        }
    }
    if (errormsg != "") {
        layer.alert(errormsg);
        return false;
    }


    var result = 0;
    $.ajax({
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "/Base/ISRequired",//url
        data: { "FormId": $("#FormId").val() },
        async: false,
        success: function (data) {

            if (data.length > 0) {
                result = 0;
                for (var i = 0; i < data.length; i++) {
                    //列
                    var FormItemStr = data[i]["ControlName"];
                    if ($("#" + FormItemStr).is("select")) {
                        var slevalue = $("#" + FormItemStr).val();
                        if (slevalue == undefined || slevalue == null || slevalue == "") {
                            result = 1;
                            layer.msg(data[i]["Title"] + '为必选项');
                            break;
                        }
                    }
                    else {
                        //类型
                        var type = $("input[name='" + FormItemStr + "']").attr("type");
                        if (type == undefined) { continue; }
                        if (type == "radio") {
                            //单选框
                            var thisValue = $("input[name='" + FormItemStr + "']:checked").val()
                            if (thisValue == null || thisValue == undefined) {
                                result = 1;
                                layer.msg(data[i]["Title"] + '为必选项');
                                break;
                            }
                        }
                        else if (type == "checkbox") {
                            //复选框
                            var thisValue = "";
                            $("input[name='" + FormItemStr + "']").each(function () {
                                if ($(this)[0].checked) {
                                    thisValue = "1";
                                }
                            })

                            if (thisValue == "") {
                                result = 1;
                                layer.msg(data[i]["Title"] + '为必选项');
                                break;
                            }

                        } else {

                            var thisValue = $("#" + FormItemStr).val().trim()
                            //输入框
                            if (thisValue == "") {
                                result = 1;
                                layer.msg(data[i]["Title"] + '为必填项');
                                break;
                            }
                        }
                    }
                }

            } else {
                result = 0;
            }

        }
    });

    if (result == 0) {
        return true;
    } else {
        return false;
    }
}

function btnSubmit() {
    SubmitForm();
}

function SubmitForm() {
    if (FormType == "1" || FormType == "0") {
        StudentFormSubmit();
    } else if (FormType == "2" || FormType == "8") {
        StudentFormSubmitLink5();
    } else if (FormType == "9") {
        StudentFormSubmitIn9()
    }

}

function StudentFormSubmitIn9() {
    var f = $("#FormId").val()
    var data = $('#form1').serializeArray();
    var filterStr = ['FormType', 'FormId', 'TotalResultId', 'ExamId', 'TaskId', 'CustomerId', 'LinkId', 'Types', 'TRId']
    data = data.filter(({ name, value }) => !filterStr.includes(name))
    /*with (data) {
        delete FormType
        delete FormId
        delete TotalResultId
        delete ExamId
        delete TaskId
        delete CustomerId
        delete LinkId
        delete Types
    }*/
    sessionStorage.setItem(f, JSON.stringify(data));
    var index2 = parent.layer.getFrameIndex(window.name); //获取窗口索引
    parent.layer.close(index2);
    $("#LinkId").val("99")
    StudentFormSubmit()
}

//弹出打印页面
var STRnUM = 1;
function printWin(TMNO) {
    var print_list = "相关业务凭证";
    var strY = TMNO;
    if (TMNO === "091105") {
        strY = `${TMNO}&STRnUM=${STRnUM}`
        STRnUM++
    }
    layer.open({
        type: 2, //Page层类型
        skin: 'layui-layer-molv', //样式类名
        area: ['95%', '89%'],
        offset: ['15px', '15px'],
        closeBtn: 1,
        title: false,
        moveOut: true,
        shade: 0.6, //遮罩透明度
        maxmin: false, //允许全屏最小化
        anim: 1, //0-6的动画形式，-1不开启
        //content: 'print?print_list=' + print_list,
        content: "/FormList/print?FormId=" + strY,
        // content: '/User/indexone?formid=010001'+"&tellerId="+tellerId+"&examid="+examid+"&banksiteid="+banksiteid+"&DepartmentId"+DepartmentId+"&planid="+planid
        end: function () {
            var formid = getQueryString("formid");
            var tellerId = getQueryString("tellerId");
            var examid = getQueryString("examid");
            var banksiteid = getQueryString("banksiteid");
            var DepartmentId = getQueryString("DepartmentId");
            var planid = getQueryString("planid");
            //if (formid == "080704") {
            //    //现金轧账提交成功并且打印窗口关闭后触发  
            //    var url = "/FormList/Form_080705?formid=080705&tellerId=" + tellerId + "&examid=" + examid + "&banksiteid=" + banksiteid + "&DepartmentId=" + DepartmentId + "&planid=" + planid;
            //    location.href = url;
            //}
            //if (formid == "080705") {
            //    //凭证轧账提交成功并且打印窗口关闭后触发 
            //    var url = "/FormList/Form_080706?formid=080706&tellerId=" + tellerId + "&examid=" + examid + "&banksiteid=" + banksiteid + "&DepartmentId=" + DepartmentId + "&planid=" + planid;
            //    location.href = url;
            //}
        }
    });
}


function btnReset() {
    FormReset();
}
//第三要重置
function FormReset() {
    if (FormType == "1" || FormType == "9") {
        $('#form1')[0].reset();
    } else if (FormType == "2" || FormType == "8") {
        $("#form1 [type='text'],textarea,select,[type='checkbox']").each(function () {
            $(this).data("needamend", "0");
            $(this).removeClass("danclick");
        });
    }
}


//记录提交次数  用于判断是否出解析按钮
var ErrorTimes = [];



function checkEmpowe() {

    var TMNO = $("#FormId").val();
    $.ajax({
        url: '/FormList/CheckEmpove',
        Type: "post",
        dataType: "json", cache: false,
        data: { "TMNO": TMNO },
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var strCookie = document.cookie;
            var arrCookie = strCookie.split("; ");
            for (var i = 0; i < arrCookie.length; i++) {
                var arr = arrCookie[i].split("=");                
                delCookie(arr[0]);
            }
            if (data > 0) {

                EditEmpower(TMNO);
            }
            else {
                if (review_printarraw.join(",").indexOf(TMNO) > -1) {
                    printWin(TMNO);
                } else {
                    window.parent.postMessage(`closeInChilder`, "*");
                }
            }
            parent.showLeftDiv();
        }
    });
}
var Auth_array = ["091003", "030602"];
//复核
var review_arraw = ["010906", "081004", "081001", "010907", "081005", "010903", "010904", "060201", "062003", "060501", "060703", "062301", "063902"];



//复核业务打开新窗口
function reviewWin(formid) {
    var l_i = layer.alert("此业务需要复核，点击“确定”按钮开始复核操作！", function () {
        layer.close(l_i);
        switch (formid) {
            case "010906":
                sessionStorage.ReviewControls = "money_jyje,txt_jszh,sle_jzzl,txt_jzhm,sle_cq";
                break;
            case "081004":
                var sle_czlx = $("#sle_czlx").val();
                if (sle_czlx == "1") {
                    //冲正
                    sessionStorage.ReviewControls = "sle_czlx,date_jzrq,txt_czzh,txt_czpzhm,money_je,sle_jdbz";
                } else if (sle_czlx == "2") {
                    //补记
                    sessionStorage.ReviewControls = "sle_czlx,date_jzrq,txt_bjzh,txt_bjpzhm,sle_bjpzzl,sle_jdbz";
                } else if (sle_czlx == "3") {
                    //冲正且补记
                    sessionStorage.ReviewControls = "sle_czlx,date_jzrq,txt_czzh,txt_czpzhm,money_je,txt_bjzh,txt_bjpzhm,sle_bjpzzl,sle_czpzzl,sle_jdbz";
                }
                break;
            case "081001":
                sessionStorage.ReviewControls = "txt_ylsh";
                break;
            case "010907":
                sessionStorage.ReviewControls = "txt_dwdqzh,sle_cq,money_jyje,txt_jszh,txt_lxzrzh";
                break;
            case "081005":
                var sle_czlx = $("#sle_czlx").val();
                if (sle_czlx == "1") {
                    //冲正
                    sessionStorage.ReviewControls = "sle_czlx,date_czrq,txt_ylsh,sle_jdbz,txt_czzh,sle_czpzzl,txt_czpzhm,money_je";
                } else if (sle_czlx == "2") {
                    //补记
                    sessionStorage.ReviewControls = "sle_czlx,date_czrq,txt_ylsh,sle_jdbz,txt_bjzh,money_je1,sle_bjpzzl,txt_bjpzhm";
                }
                break;
            case "010903":
                var sle_xzbz = $("#sle_xzbz").val();
                if (sle_xzbz == "1") {
                    //现金  
                    sessionStorage.ReviewControls = "txt_zh,sle_xzbz,txt_pzhm,txt_cprq,money_jyje";
                } else {
                    //转账
                    sessionStorage.ReviewControls = "txt_zh,sle_xzbz,txt_pzhm,txt_cprq,money_jyje,txt_zrzkh";
                }
                break;
            case "010904":
                sessionStorage.ReviewControls = "txt_zh";
                break;
        }
        sessionStorage.PrevYwData = getFormData();
        var url = `/FormList/review/?FormId=` + formid + `&FormType=${getQueryString("FormType")}&TotalResultId=${getQueryString("TotalResultId")}&ExamId=${getQueryString("ExamId")}&TaskId=${getQueryString("TaskId")}&CustomerId=${getQueryString("CustomerId")}&LinkId=${getQueryString("LinkId")}&Satisfaction=${getQueryString("Satisfaction")}`;
        //var url = '/FormList/review/?FormId=' + getQueryString("FormId");
        var height = 600;
        window.open(url, '_blank', 'width=1024,height=' + height + ',top=10px,left=10px,location=no,scrollbars=yes');

    });
}



var getFormData = function () {
    var data = '';
    $(".form-item").each(function (i, e) { //$(this).attr("checked")
        //取值,复选框
        if ($(e).attr("id").indexOf("check_") > -1) {
            // console.log("7777:" + $(e).attr("id") + ":" + $(e).is(':checked')); //$('#checkbox-id').attr('checked')
            if ($(e).is(':checked')) {
                data += "&" + ($(e).attr("vtitle") + ":" + $(e).attr("id") + "=1-选中");
            } else {
                data += "&" + ($(e).attr("vtitle") + ":" + $(e).attr("id") + "=0-未选中");
            }
        } else if ($(e).attr("id").indexOf("redio_") > -1) // 单选框redio
        {
            if ($(e).is(':checked')) {
                data += "&" + ($(e).attr("vtitle") + ":" + $(e).attr("id") + "=1-选中");
            } else {
                data += "&" + ($(e).attr("vtitle") + ":" + $(e).attr("id") + "=0-未选中");
            }
        } else if ($(e).attr("id").indexOf("sle_") > -1) // 下拉框
        {
            //console.log("select:" +$(e).val() + ":" + $(e).find("option:selected").text());
            data += "&" + ($(e).attr("vtitle") + ":" + $(e).attr("id") + "=" + $(e).find("option:selected").text());
        } else {
            data += "&" + ($(e).attr("vtitle") + ":" + $(e).attr("id") + "=" + $(e).val());
        }
    });
    if (data.length > 0) { data = data.substring(1); }
    return data;
}



//集中授权
function EditEmpower(TMNO) {
    CheckTimeOut();
    layer.closeAll();
    var index = layer.open({
        type: 2,
        //btn: ['确定', '取消'],
        title: false,
        skin: 'layui-layer-lan', //样式类名
        shadeClose: true,
        shade: false,
        maxmin: true, //开启最大化最小化按钮
        area: ['1250px', '600px'],
        content: "/FormList/Form_010001?FormId=" + TMNO,
        success: function (lar, index) {
            sessionStorage.setItem("open_layer", index);
            // var as = layer.close(index);
            //alert(as);
        },
        end: function (index) {

        }

    });



}


//内部授权打开新窗口
function innerAuthWin() {
    var formid = $("#FormId").val();
    var url = '/FormList/auth?FormId=' + formid;
    var height = 600;
    window.open(url, '_blank', 'width=1024,height=' + height + ',top=10px,left=10px,location=no,scrollbars=yes');
}
var checkInFlag = 0;
//学生端表单提交
function StudentFormSubmit() {
    //现做校验
    if (checkFormJs()) {

        var data = $('#form1').serialize();
        var data33 = "";
        var datas = data.split('&');
        for (var c = 0; c < datas.length; c++) {
            if (datas[c].startsWith("sle_")) {
                var sles = datas[c].split('=');
                if (sles[1] != "") {
                    data33 += sles[0] + "=" + $("#" + sles[0] + " option:selected").text() + "&";
                }
            }
            else if (datas[c].indexOf("TRId=") > -1) {
                data33 += "TRId=" + $("#TRId").val() + "&";
            }
            else if (datas[c].indexOf("TaskId=") > -1) {
                if ($("#TaskId", window.parent.parent.document).val() != undefined) {
                    data33 += "TaskId=" + $("#TaskId", window.parent.parent.document).val() + "&";
                } else {
                    if ($("#TaskId", window.parent.parent.parent.document).val() != undefined) {
                        data33 += "TaskId=" + $("#TaskId", window.parent.parent.parent.document).val() + "&";
                    } else {
                        data33 += "TaskId=" + $("#TaskId").val() + "&";
                    }
                }
            }
            else if (datas[c].indexOf("CustomerId=") > -1) {
                data33 += "CustomerId=" + $("#CustomerId").val() + "&";
            }
            else {
                if (c == datas.length - 1) {
                    data33 += datas[c];
                } else {
                    data33 += datas[c] + "&";
                }
            }
        }
        data = data33;

        $('#form1').find("input:disabled").each(function () {
            var id = $(this).attr("id");
            var value = $(this).val();
            if (value.length > 0) {
                if (value.indexOf('-') >= 0) {
                    value = value.split('-')[0];
                }
                value = value.trim();
                data += `&${id}=${value}`;
            }
        });
        //获取对应页面的参数值
        function getQueryStrings(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)
                return unescape(r[2]);
            return null;
        }

        if (getQueryStrings("yzBz") == "true") {
            data = "yzBz=true&" + data
        }
        $.ajax({
            type: "POST",//方法类型
            dataType: "text",//预期服务器返回的数据类型
            url: "/Base/Submission",//url
            data: data,
            async: false,
            success: function (result) {
                if (result == "1") {
                    layer.msg('保存成功', { icon: 1, time: 1000 }, function () {
                        try {
                            if (doSubmit && typeof (doSubmit) == "function") {
                                doSubmit();
                                return;
                            }
                        } catch(ex)
                        {
                            if (afterSubmitList.join(",").indexOf($("#FormId").val()) > -1) {
                                setDefaultValueAfterSubmit($("#FormId").val());
                            }
                            if (review_arraw.join(",").indexOf($("#FormId").val()) > -1 && window.location.href.indexOf("review") < 0) {
                                reviewWin($("#FormId").val());
                            }
                            else if (connectFormArr.join(",").indexOf($("#FormId").val()) > -1) {
                                inConnectForm();
                            }
                            else {
                                if (innerAuth_array.join(",").indexOf($("#FormId").val()) > -1) {
                                    if (checkInFlag == 0) {
                                        checkInFlag = 1;
                                        innerAuthWin();
                                    }
                                }
                                else {
                                    checkEmpowe();
                                }
                            }
                        }
                    });
                }
                else if (result == "0") {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg('保存失败', { icon: 2 });
                }
                else if (result == "99") {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg('当前任务未激活', { icon: 2 });
                }
                else if (result == "97") {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg('当前任务未开启', { icon: 2 });
                }
                else if (result == "88") {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg('考试已提交，无法继续答题！', { icon: 2 });
                }
                else if (result == "77") {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg('考试已结束，无法继续答题', { icon: 2 });
                }
                else if (result == "66") {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg('您没有此环节的操作权限！', { icon: 2 });
                }
                else {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg(result, { icon: 2 });
                }
                window.parent.postMessage(`zuoti:${$("#FormId").val()}`, "*");
            },
            error: function (result) {
                layer.closeAll();//关闭所有弹出框
                layer.msg(result, { icon: 2 });
            }
        });

    }

}

function StudentFormSubmitCallback() {
    window.parent.postMessage(`zuoti:${$("#FormId").val()}`, "*");
}
var afterSubmitList = ["030601", "091004", "030608", "010108", "010302", "010501", "010901", "020502", "030104", "030604", "010101", "010107", "091104"];


//弹出收费 页面
function inConnectForm(TMNO) {
    CheckTimeOut();
    layer.closeAll();

    var url = `/FormList/ToForm?FormId=${TMNO}&FormType=${getQueryString("FormType")}&TotalResultId=${getQueryString("TotalResultId")}&ExamId=${getQueryString("ExamId")}&TaskId=${getQueryString("TaskId")}&CustomerId=${getQueryString("CustomerId")}&LinkId=${getQueryString("LinkId")}&Satisfaction=${getQueryString("Satisfaction")}`;
    var index = layer.open({
        type: 2,
        //btn: ['确定', '取消'],
        title: false,
        skin: 'layui-layer-lan', //样式类名
        shadeClose: true,
        shade: false,
        maxmin: false, //开启最大化最小化按钮
        area: ['80%', '60%'],
        //content: "/FormList/Form_050511?FormId=" + TMNO,
        content: url,
        success: function (lar, index) {
            sessionStorage.setItem("open_layer", index);
            // var as = layer.close(index);
            //alert(as);
        },
        end: function (index) {

        }

    });



}



function setDefaultValueAfterSubmit(formId) {
    var defaultValue = $("#DefaultValue").val();
    ;
    if (defaultValue != null) {

        var defaultValueList = defaultValue.split('$');
        var items = GetELEForFormId(formId);
        for (var i = 1; i < defaultValueList.length; i++) {
            var data = defaultValueList[i].split(';');
            for (var j = 0; j < data.length; j++) {
                if (j == 0) {
                    indexvalue = data[0].split('#');
                    eleId = indexvalue[1] + "99";
                    eleValue = indexvalue[2];
                    eleValue = eleValue ? eleValue : "";
                    var eleV = eleValue.split('-')[0] ? eleValue.split('-')[0] : "0";
                    ;

                    if (eleId.indexOf('sle_') > -1) {
                        $("#" + eleId).val(eleValue);
                        $("#" + eleId + " option[value=" + eleV + "]").attr("selected", "selected");
                        $("#" + eleId).siblings("input").val(eleValue);
                    } else {
                        $("#" + eleId).val(eleValue);
                    }


                }
                else if (j == data.length - 1) {
                    indexvalue = data[j].split('#');
                    if (indexvalue.length != 1) {
                        eleId = indexvalue[1] + "99";
                        eleValue = indexvalue[2];
                        eleValue = eleValue ? eleValue : "";
                        var eleV = eleValue.split('-')[0] ? eleValue.split('-')[0] : "0";

                        if (eleId.indexOf('sle_') > -1) {
                            $("#" + eleId).val(eleValue);
                            $("#" + eleId + " option[value=" + eleV + "]").attr("selected", "selected");
                            $("#" + eleId).siblings("input").val(eleValue);
                            $("#" + eleId).parent().next().attr("checked", true);
                        } else {
                            $("#" + eleId).val(eleValue);
                            $("#" + eleId).next().attr("checked", true);
                        }



                    }
                }
                else {
                    indexvalue = data[j].split('#');
                    eleId = indexvalue[0] + "99";
                    eleValue = indexvalue[1];
                    var eleV = eleValue.split('-')[0] ? eleValue.split('-')[0] : "0";

                    if (eleId.indexOf('sle_') > -1) {
                        $("#" + eleId).val(eleValue);
                        $("#" + eleId + " option[value=" + eleV + "]").attr("selected", "selected");
                        $("#" + eleId).siblings("input").val(eleValue);
                    } else {
                        $("#" + eleId).val(eleValue);
                    }

                }
            }
        }


    }
}



function GetELEForFormId(formId) {
    var items = "";
    if (formId == "010108") {
        items = ["txt_xzkh", "txt_xh2"];

    }
    else if (formId == "010302") {
        items = ["sle_zhzt"];
    }
    else if (formId == "010501") {
        items = ["txt_xkzkh", "txt_zhmc2"];
    }
    else if (formId == "010901") {
        items = ["txt_zh", "txt_xh"];
    }
    else if (formId == "020502") {
        items = ["txt_dqzh", "sle_cq", "txt_dqr2", "money_bjje", "money_nll"];
    }
    else if (formId == "030604") {
        items = ["txt_stop_number", "txt_freeze_number", "txt_stop_date"];
    }
    else if (formId == "010101") {
        items = ["txt_zh1", "txt_xh"];
    }

    else if (formId == "030608") {
        items = ["money_zhye1"];
    }
    else if (formId == "010107") {
        items = ["money_zje", "money_lxje", "money_lxsje"];
    }
    else if (formId == "091004") {
        items = ["txt_zbs", "txt_cgbs"];
    }
    else if (formId == "030601") {
        items = ["txt_freeze_date", "txt_freeze_num"];
    }
    return items;
}
//(010108
//,010302
//,010501
//,010901
//,020502
//,030104
//,030604)





//环节5标注答案 特殊处理
function StudentFormSubmitLink5() {
    var txtid = "";//id字符串
    //遍历查 标注的id 拼接字符串
    $("#form1 [type='text'],textarea,select,[type='checkbox']").each(function () {
        if ($(this).data("needamend") == "1") {
            txtid += $(this).attr("id") + ",";
        }
    });

    if (txtid.length > 0) {
        txtid = txtid.substr(0, txtid.length - 1);
    }

    var data = getBaseSubmitInfo();
    data.Types = "2";
    data.StuOperationalAnswers = txtid;
    data.verificationSuccessful = verificationSuccessful;

    $.ajax({
        type: "POST",//方法类型
        dataType: "text",//预期服务器返回的数据类型
        url: "/Base/Submission",//url
        data: data,
        async: false,
        success: function (result) {

            if (result == "1" || result == "2" || result == "3") {
                layer.msg('保存成功', { icon: 1, time: 1000 }, function () {
                    try {
                        if (doSubmit && typeof (doSubmit) == "function") {
                            doSubmit();
                            return;
                        }
                    } catch (ex) {
                        layer.closeAll();//关闭所有弹出框
                        window.parent.postMessage(`hecha:${$("#FormId").val()}`, "*");
                    }
                });

            }
            else if (result == "0") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('保存失败', { icon: 2 });
            }
            else if (result == "97") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('当前任务未开启', { icon: 2 });
            }
            else if (result == "88") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('考试已提交，无法继续答题！', { icon: 2 });
            }
            else if (result == "77") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('考试已结束，无法继续答题', { icon: 2 });
            }
            else if (result == "66") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('您没有此环节的操作权限！', { icon: 2 });
            }
            else {
                layer.closeAll();//关闭所有弹出框
                layer.msg(result, { icon: 2 });
            }
        },
        error: function (result) {
            layer.closeAll();//关闭所有弹出框
            layer.msg(result, { icon: 2 });
        }
    });

}



function StudentOperateSubmit(data, action, t) {

    var recordInfo = {};
    recordInfo.Types = data.Types;
    recordInfo.LinkId = data.LinkId;
    recordInfo.InquiryId = 0;
    var findItem = false;
    var i = 0;
    for (; i < ErrorTimes.length; i++) {
        var item = ErrorTimes[i];
        if (item.Types == recordInfo.Types && item.LinkId == recordInfo.LinkId && item.InquiryId == recordInfo.InquiryId) {
            findItem = true;
            ErrorTimes[i].times = ErrorTimes[i].times + 1;

            var tempItem = ErrorTimes.splice(i, 1);
            ErrorTimes.push(tempItem[0]);
            break;
        }
    }
    if (!findItem) {
        recordInfo.times = 1;
        ErrorTimes.push(recordInfo);
    }

    $.ajax({
        type: "POST",//方法类型
        dataType: "text",//预期服务器返回的数据类型
        url: "/Base/Submission",//url
        data: data,
        async: false,
        success: function (result) {


            if (result == "1" || result == "2" || result == "3") {
                if (action != null) {
                    if (typeof t == "function") {
                        action(t, [result]);
                    } else {
                        action(result, t);
                    }

                }
                else {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg('操作成功', { icon: 2 });
                }

            }
            else if (result == "0") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作失败', { icon: 2 });
            }
            else if (result == "98") {//环节倒退扣除满意度
                layer.closeAll();//关闭所有弹出框
                //layer.msg('当前任务未开启', { icon: 2 });
            }
            else if (result == "97") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('当前任务未开启', { icon: 2 });
            }
            else if (result == "88") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('考试已提交，无法继续答题！', { icon: 2 });
            }
            else if (result == "77") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('考试已结束，无法继续答题', { icon: 2 });
            }
            else if (result == "66") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('您没有此环节的操作权限！', { icon: 2 });
            }
            else {
                layer.closeAll();//关闭所有弹出框
                layer.msg(result, { icon: 2 });
            }
        },
        error: function (result) {
            layer.closeAll();//关闭所有弹出框
            layer.msg(result, { icon: 2 });
        }
    });

}

function StudentInquirieSubmit(data, action) {

    var recordInfo = {};
    recordInfo.Types = data.Types;
    recordInfo.LinkId = data.LinkId;
    recordInfo.InquiryId = data.InquiryId;
    var findItem = false;
    var i = 0;
    for (; i < ErrorTimes.length; i++) {
        var item = ErrorTimes[i];
        if (item.Types == recordInfo.Types && item.LinkId == recordInfo.LinkId && item.InquiryId == recordInfo.InquiryId) {
            findItem = true;
            ErrorTimes[i].times = ErrorTimes[i].times + 1;

            var tempItem = ErrorTimes.splice(i, 1);
            ErrorTimes.push(tempItem[0]);
            break;
        }
    }
    if (!findItem) {
        recordInfo.times = 1;
        ErrorTimes.push(recordInfo);
    }

    $.ajax({
        type: "POST",//方法类型
        dataType: "text",//预期服务器返回的数据类型
        url: "/Base/Submission",//url
        data: data,
        async: false,
        success: function (result) {

            if (result == "1" || result == "2" || result == "3") {
                if (action != null) {
                    action(result);
                }
                else {
                    layer.msg('操作成功', { icon: 2 });
                }
            }
            else if (result == "0") {
                layer.msg('操作失败', { icon: 2 });
            }
            else if (result == "98") {//环节倒退扣除满意度
                //layer.msg('当前任务未开启', { icon: 2 });
            }
            else if (result == "97") {
                layer.msg('当前任务未开启', { icon: 2 });
            }
            else if (result == "88") {
                layer.msg('考试已提交，无法继续答题！', { icon: 2 });
            }
            else if (result == "77") {
                layer.msg('考试已结束，无法继续答题', { icon: 2 });
            }
            else if (result == "66") {
                layer.msg('您没有此环节的操作权限！', { icon: 2 });
            }
            else {
                layer.msg(result, { icon: 2 });
            }
        },
        error: function (result) {
            layer.msg(result, { icon: 2 });
        }
    });

}


//查询  返显
function InitViewData() {

    if (FormType == "0" || FormType == "1" || FormType == "9") {
        return;
    }

    if (FormType == "4") {
        $("#lianwanghechajieguo").show();
    }


    var FormId = $("#FormId").val();
    var TaskId = $("#TaskId").val();
    var CustomerId = $("#CustomerId").val();//客户id
    var data = { "FormId": FormId, "TaskId": TaskId, "CustomerId": CustomerId }//Id: Id,
    data.TRId = $("#TRId").val();
    if (data.TRId == undefined) {
        data.TRId = $("#TotalResultId").val();
    }

    var url = "/Base/GetQueryThree";//url
    if (FormType == "6" || FormType == "7") {
        url = "/Base/GetQueryStuOperation";//url
    }



    $.ajax({
        //几个参数需要注意一下
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: url,//url
        data: data,
        async: false,
        success: function (result) {
            //扩展前端填写
            if (FormType === "8") {

                var data = JSON.parse(sessionStorage.getItem(FormId));
                var qtObj = {};
                for (let o of data) {
                    qtObj[o.name] = o.value;
                    var FormItemStr = o.name;
                    var SingleAnswer = o.value;
                    setFormVlaue(FormItemStr, SingleAnswer)
                }
                //先判断是否都填对
                if (result != null && result.length > 0) {
                    for (let r of result) {
                        if (qtObj[r.FormItemStr] !== r.SingleAnswer) {
                            verificationSuccessful = 0;
                            break;
                        }
                    }
                }

            } else {
                if (result != null && result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        var FormItemStr = result[i]["FormItemStr"];
                        var SingleAnswer = result[i]["SingleAnswer"];
                        setFormVlaue(FormItemStr, SingleAnswer)
                    }
                }
            }


        },
        error: function (result) {
            layer.closeAll();//关闭所有弹出框
            layer.msg(result, { icon: 2 });
        }
    });





}

function setFormVlaue(FormItemStr, SingleAnswer) {
    var type = $("input[name='" + FormItemStr + "']").attr("type");

    if (type == "radio") {
        $("input[name='" + FormItemStr + "']").each(function () {
            if ($(this).val() == SingleAnswer) {
                $(this)[0].checked = true;
                return true;
            }
        })
    }
    else if (type == "checkbox") {
        $("input[name='" + FormItemStr + "']").each(function () {
            if ($(this).val() == SingleAnswer) {
                $(this)[0].checked = true;
            }
        })
    } else {
        $("#" + FormItemStr).val(SingleAnswer)
    }
}

function InitViewEvent() {


    if (FormType == "2" || FormType == "3" || FormType == "4" || FormType == "5" || FormType == "6" || FormType == "7" || FormType == "8") {
        $("#form1 [type='text'],textarea,select,[type='checkbox']").each(function () {
            $(this).attr("readonly", "readonly");
        })

        if (FormType != "2" && FormType != "8") {
            $(".btn_chongzhi,.btn_tijiao").hide();//操作按钮
        }
        else {
            //环节5 标注答案
            $("#form1 [type='text'],textarea,select,[type='checkbox']").on("click", function () {

                if ($(this).data("needamend") == "1") {
                    $(this).data("needamend", "0");
                    $(this).removeClass("danclick");
                } else {
                    $(this).data("needamend", "1");
                    $(this).addClass("danclick");
                }
                //只有复选框 控制选选
                if ($(this).attr("type") == "checkbox") {
                    this.checked = !this.checked;
                }


            })
        }
    }

    if (FormType == "5" || FormType == "7") {//盖章
        changgeCursor();
    }



}


//更改鼠标悬浮样式  签字盖章使用
function changgeCursor() {

    if (FormType != "5" && FormType != "7") {//盖章
        return;
    }

    var selectYinzhang = localStorage.getItem("selectYinzhang");
    if (selectYinzhang == undefined || selectYinzhang == "") {
        return;
    }

    $("#form1").removeClass("gaizhang_cur").removeClass("qianzi_cur");
    if (selectYinzhang == "0") {
        $("#form1").addClass("qianzi_cur");
    } else {
        $("#form1").addClass("gaizhang_cur");
    }

}



function InitGaizhangQianziEvent() {
    if (FormType != "5" && FormType != "7") {//盖章
        return;
    }

    document.getElementById("form1").onmousedown = function (ev) {

        var selectYinzhang = localStorage.getItem("selectYinzhang");
        if (selectYinzhang == undefined || selectYinzhang == "") {
            return;
        }
        var url = "";
        var tpwidth = 0;
        var tpheight = 0;
        if (selectYinzhang == "0") {
            url = "3dqianzi.png";
            tpwidth = 156;
            tpheight = 60;
        }
        else if (selectYinzhang == "1") {
            url = "3dgz_gz1.png";
            tpwidth = 150;
            tpheight = 98;
        }
        else if (selectYinzhang == "2") {
            url = "3dgz_gz2.png";
            tpwidth = 75;
            tpheight = 25;
        }
        else if (selectYinzhang == "3") {
            url = "3dgz_gz3.png";
            tpwidth = 82;
            tpheight = 39;
        }
        else if (selectYinzhang == "4") {
            url = "3dgz_gz4.png";
            tpwidth = 150;
            tpheight = 124;
        }
        else if (selectYinzhang == "5") {
            url = "3dgz_gz5.png";
            tpwidth = 340;
            tpheight = 170;
        }
        else if (selectYinzhang == "6") {
            url = "3dgz_gz6.png";
            tpwidth = 134;
            tpheight = 134;
        }
        else if (selectYinzhang == "7") {
            url = "3dgz_gz7.png";
            tpwidth = 150;
            tpheight = 130;
        }
        else if (selectYinzhang == "8") {
            url = "3dgz_gz8.png";
            tpwidth = 134;
            tpheight = 134;
        }
        else if (selectYinzhang == "9") {
            url = "3dgz_gz9.png";
            tpwidth = 282;
            tpheight = 134;
        }


        var oEvent = ev || event;

        var objId = `yinzhang${selectYinzhang}`;
        if (selectYinzhang == "0") {
            objId = `qianzi${selectYinzhang}`;
        }


        var left = (oEvent.pageX - tpwidth / 2) + 'px';  // 指定创建的DIV在文档中距离左侧的位置
        var top = (oEvent.pageY - tpheight / 2) + 'px';  // 指定创建的DIV在文档中距离顶部的位置
        var backgroundImage = `url('/img/public3D/${url}')`;
        var position = 'absolute'; // 为新创建的DIV指定绝对定位
        var width = tpwidth + 'px'; // 指定宽度
        var height = tpheight + 'px'; // 指定高度
        var html = `<div id="${objId}" style="left: ${left}; top: ${top}; background-image: ${backgroundImage};background-repeat: no-repeat; position: ${position}; width: ${width}; height: ${height};" onclick="removeGaizhangQianzi(this)"></div>`

        if ($(`#${objId}`).length > 0) {
            $(`#${objId}`).remove();
        }

        $("body").append(html);



        SubmitGaizhangQianzi(selectYinzhang);

    }



    var data = getBaseSubmitInfo();

    ;
    for (var i = 0; i < localStorage.length; i++) {
        var recordKey = localStorage.key(i);

        if (recordKey.indexOf("CustomerId") < 0) continue;
        var keyObj = JSON.parse(recordKey);
        if (keyObj.TRId != undefined && keyObj.CustomerId != undefined && keyObj.FormId != undefined) {
            if (keyObj.TRId == data.TRId && keyObj.CustomerId == data.CustomerId && keyObj.FormId == data.FormId) {
                var valueObj = JSON.parse(localStorage.getItem(recordKey));
                for (var j = 0; j < valueObj.length; j++) {
                    var item = valueObj[j];
                    $("body").append(item);

                }
            }


        }

    }



}

//移除签字盖章
function removeGaizhangQianzi(obj) {
    var selectYinzhang = localStorage.getItem("selectYinzhang");
    if (selectYinzhang == undefined || selectYinzhang == "") {
        $(obj).remove();
    }

}



function SubmitGaizhangQianzi(yinzhang) {

    var isInPos = true;

    var data = getBaseSubmitInfo();
    data.Types = "2";
    data.StuAnswersOtherInfo = "";
    if (yinzhang == "0") {//签字
        data.LinkId = "134";
        data.StuOperationalAnswers = "已签字";
        $("body>div").each(function () {
            if ($(this).attr("id").indexOf("qianzi") >= 0) {
                if (isInPos == true) {
                    isInPos = checkInPosition(this, yinzhang);
                }
            }
        });
        if (!isInPos && false) { //不需要校验了 ——lzy && false
            data.StuAnswersOtherInfo = "签字位置错误";
        }

    } else {//盖章
        data.LinkId = "133";
        var yzList = [];
        $("body>div").each(function () {
            if ($(this).attr("id").indexOf("yinzhang") >= 0) {
                //console.log($(this).attr("id"))
                yzList.push($(this).attr("id").replace("yinzhang", ""));
                if (isInPos == true) {
                    isInPos = checkInPosition(this, yzList[yzList.length - 1]);
                }
            }
        });
        data.StuOperationalAnswers = yzList.join(",");
        if (!isInPos && false) { //不需要校验了 ——lzy && false
            data.StuAnswersOtherInfo = "盖章位置错误";
        }
    }


    RecordGaizhangQianzi();






    $.ajax({
        type: "POST",//方法类型
        dataType: "text",//预期服务器返回的数据类型
        url: "/Base/Submission",//url
        data: data,
        async: false,
        success: function (result) {

        },
        error: function (result) {
            layer.msg(result, { icon: 2 });
        }
    });


}


var QianziGaizhangPosition =
    [
        ["110301", 1, 6, 830, 1300, 150, 150],
        ["110301", 1, 3, 150, 1450, 100, 60],
        ["110301", 2, 0, 290, 1450, 170, 70],

        ["110302", 1, 3, 905, 1267, 100, 60],
        ["110302", 1, 6, 600, 1230, 150, 150],
        ["110302", 2, 0, 220, 1475, 170, 70],


        ["110303", 1, 6, 820, 1300, 150, 150],
        ["110303", 1, 3, 150, 1450, 100, 60],
        ["110303", 2, 0, 285, 1450, 170, 70],

        ["110304", 1, 7, 800, 140, 180, 150],
        ["110304", 1, 3, 920, 440, 100, 60],

        ["110305", 1, 7, 880, 380, 150, 150],
        ["110305", 1, 3, 425, 500, 180, 150],

        ["110306", 1, 7, 95, 510, 180, 150],
        ["110306", 1, 3, 310, 640, 100, 60],
        ["110306", 2, 0, 420, 640, 170, 70],


        ["110308", 1, 6, 890, 1290, 150, 150],
        ["110308", 1, 3, 810, 1240, 100, 60],


        ["110309", 1, 7, 690, 650, 180, 150],
        ["110309", 1, 3, 825, 790, 100, 60],
        ["110309", 2, 0, 450, 580, 170, 70],

        ["110310", 1, 8, 530, 920, 150, 150],
        ["110310", 1, 3, 540, 1050, 100, 60],
        ["110310", 1, 6, 550, 1080, 150, 150],


        ["110311", 1, 7, 110, 310, 180, 150],
        ["110311", 1, 3, 595, 460, 100, 60],

        ["110312", 1, 3, 800, 500, 300, 200],
        ["110312", 1, 4, 50, 400, 950, 80],


        ["120101", 1, 2, 470, 550, 200, 200],
        ["120102", 1, 2, 470, 550, 200, 200],
        ["120103", 1, 2, 470, 550, 200, 200],
        ["120104", 1, 2, 470, 550, 200, 200],

        ["120203", 1, 6, 860, 200, 150, 150],
        ["120203", 1, 3, 550, 480, 200, 100],


        ["120204", 1, 2, 230, 410, 600, 600],
        ["120204", 1, 6, 780, 580, 200, 200],
        ["120204", 2, 0, 310, 600, 170, 70],


        ["120206", 1, 2, 100, 220, 800, 500],
        ["120206", 1, 6, 800, 500, 400, 300],


        ["120207", 1, 2, 210, 300, 800, 500],

        ["120208", 1, 3, 600, 220, 400, 300],
        ["120208", 1, 6, 280, 220, 400, 300],

        ["120209", 1, 6, 580, 630, 500, 500],

        ["120210", 1, 6, 230, 1880, 300, 300],


        ["120211", 1, 2, 180, 450, 700, 400],

        ["120212", 1, 2, 200, 430, 700, 400],

        ["120213", 1, 2, 140, 1210, 500, 400],

        ["120214", 1, 3, 465, 1040, 500, 300],
        ["120214", 1, 6, 385, 920, 300, 200],


        ["120215", 1, 2, 190, 430, 700, 440],

        ["120216", 1, 2, 190, 250, 700, 440],

        ["120217", 1, 2, 140, 150, 700, 440],

        ["120218", 1, 2, 310, 410, 600, 500],

        ["120219", 1, 2, 420, 590, 600, 600],

        ["120220", 1, 2, 505, 480, 500, 500],

        ["120221", 1, 2, 670, 210, 500, 600],

        ["120222", 1, 2, 730, 420, 600, 500],

        ["120223", 1, 2, 400, 230, 500, 300],

        ["120224", 1, 2, 370, 80, 700, 500],


        ["120225", 1, 2, 90, 100, 800, 800],

        ["120226", 1, 2, 420, 570, 600, 600],


        ["130101", 1, 2, 590, 300, 400, 600],
        ["130101", 1, 6, 280, 350, 400, 300],


        ["130102", 1, 3, 600, 220, 400, 300],
        ["130102", 1, 6, 280, 220, 400, 300],


        ["130103", 1, 2, 210, 300, 800, 500],

        ["130104", 1, 3, 600, 220, 400, 300],
        ["130104", 1, 6, 280, 220, 400, 300],


        ["130105", 1, 3, 380, 770, 100, 60],
        ["130105", 1, 1, 300, 620, 800, 300],

        ["140101", 1, 6, 190, 150, 400, 300],
        ["140101", 1, 3, 430, 400, 300, 200],
        ["140101", 2, 0, 620, 400, 300, 200],

        ["140102", 1, 2, 210, 140, 800, 300],

        ["140103", 1, 2, 210, 140, 800, 300],


        ["140104", 1, 2, 210, 140, 800, 300],


        ["140105", 1, 2, 240, 180, 700, 300],
        ["140105", 1, 3, 980, 380, 120, 70],
        ["140105", 2, 0, 740, 440, 170, 200],

        ["140106", 1, 2, 210, 140, 800, 300],

        ["140107", 1, 2, 160, 170, 800, 300],
        ["140107", 1, 3, 340, 450, 170, 60],


        ["140108", 1, 6, 185, 275, 500, 400],
        ["140108", 1, 3, 710, 790, 200, 80],

        ["140109", 1, 6, 850, 200, 300, 300],
        ["140109", 1, 3, 890, 470, 200, 100],
        ["140109", 1, 9, 180, 120, 400, 300],
    ]





function checkInPosition(obj, yinzhang) {

    var formid = $("#FormId").val();

    var formPos = [];
    for (var i = 0; i < QianziGaizhangPosition.length; i++) {
        if (QianziGaizhangPosition[i][0] == formid) {
            formPos.push(QianziGaizhangPosition[i]);
        }
    }
    if (formPos.length == 0) return true;

    var top = $(obj).offset().top + $(obj).height() / 2;
    var left = $(obj).offset().left + $(obj).width() / 2;

    if (yinzhang == "0") //签字
    {
        var Qianzi = null;
        for (var i = 0; i < formPos.length; i++) {
            if (formPos[i][1] == 2) {
                Qianzi = formPos[i];
            }
        }
        if (Qianzi == null || Qianzi == undefined) return true;
        var item = Qianzi;
        return checkItemPosition(top, left, item);
        //for (var i = 0; i < Qianzi.length; i++) {

        //}

    } else {//盖章
        var Gaizhang = null;
        for (var i = 0; i < formPos.length; i++) {
            if (formPos[i][2] == yinzhang) {
                Gaizhang = formPos[i];
            }
        }
        if (Gaizhang == null || Gaizhang == undefined) return true;
        var item = Gaizhang;
        return checkItemPosition(top, left, item);
    }

    return false;
}

function checkItemPosition(top, left, item) {
    if (item == null || item == undefined) return true;
    console.log(` left:${left}  top :${top}`);
    console.log(item);
    var itemtop = item[4];
    var itemleft = item[3];
    var itemheight = item[6];
    var itemwidth = item[5];
    if ((top >= itemtop && top <= itemtop + itemheight) &&
        (left >= itemleft && left <= itemleft + itemwidth)) {
        console.log("pos in");
        return true;
    } else {
        console.log("pos out");
        return false;
    }

}


//查看 只有pdf格式 浏览器直接打开
function ErrorLookAnalysis() {

    var item = ErrorTimes[ErrorTimes.length - 1];

    if (item.Types == "3") { //质询解析

        var InquiryId = item.InquiryId;
        var Analysis = GetInquiryAnalysisById(InquiryId);
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
    else {//环节解析
        var LinkId = item.LinkId;
        if (LinkId == "91" || LinkId == "92") {
            LinkId = "9";
        }
        else if (LinkId == "133" || LinkId == "134") {
            LinkId = "13";
        }
        else if (LinkId == "151") {
            LinkId = "15";
        }
        else if (LinkId == "161") {
            LinkId = "16";
        }

        $.ajax({
            url: "/PracticeResult/getPDFUrl",
            data: { "Num": LinkId },
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



}
//核心系统内部授权
var innerAuth_array = ["030602", "080707", "080702", "080703", "091003", "091101", "030101"];
//打印业务列表
var review_printarraw = ["080201", "050511", "090201", "010101", "010102", "010103", "010104", "010105", "010106", "010107", "010108", "010114", "010301", "010302", "010303", "010401", "010402", "010501", "010601", "010702", "010901", "010902", "010903", "010904", "010905", "010906", "010910", "020501", "020502", "020704", "030601", "030602", "030603", "030604", "030606", "030608", "030612", "050504", "060302", "065401", "065501", "080704", "080705", "080706", "080803", "081003", "081005", "091001", "091008", "091010", "091105", "091009", "050503", "010907", "090203", "081004"];

//业务联动
var connectFormArr = ["050510"];

function RecordGaizhangQianzi() {

    //记录盖章 签字数据  下次打开页面 要显示
    var qianzigaizhangRecords = [];
    $("body>div").each(function () {
        if ($(this).attr("id").indexOf("yinzhang") >= 0 || $(this).attr("id").indexOf("qianzi") >= 0) {
            var eleObj = $(this).prop("outerHTML");
            qianzigaizhangRecords.push(eleObj);
        }
    });



    var data = {};
    data.TRId = $("#TRId").val();
    if (data.TRId == undefined) {
        data.TRId = $("#TotalResultId").val();
    }
    data.ExamId = $("#ExamId").val();
    data.TaskId = $("#TaskId").val();
    data.CustomerId = $("#CustomerId").val();
    data.FormId = $("#FormId").val();

    var recordsKey = JSON.stringify(data);
    var recordsValue = JSON.stringify(qianzigaizhangRecords);

    console.log("签字盖章记录");
    console.log("recordsKey" + recordsKey);
    console.log("recordsValue" + recordsValue);

    localStorage.setItem(recordsKey, recordsValue);

}
var nextLinkIdObj = {};
/*var SubLinkIdObjs = {
    "2": "厅堂接待",
    "3": "取号",
    "4": "取号后引导",
    "5": "单据填单,单据审核",
    "6": "填单后引导",
    "7": "柜面接待",
    "8": "单据收取",
    "9": "非身份证收取,证件校验,身份证收取",
    "10": "现金处理",
    "11": "柜员填单",
    "12": "业务办理",
    "13": "单据盖章,单据签字,单据盖章与签字",
    "14": "返还资料",
    "15": "柜台送别",
    "16": "厅堂送别",
    "17":"完工业务"
}*/
var taskInfoInTypesIndex = 0;
function setNextLinkId() {
    var lid = $("#LinkId").val();
    var isLd = true;
    taskInfoInTypes.forEach(r => {
        if (r.SubLinkId == lid) {
            var oarr = r.OperationName.split(";")
            var s = nextLinkIdObj[lid]
            if (s === undefined || oarr.includes(s)) {
                var len = oarr.indexOf(s)
                nextLinkIdObj = { [lid]: oarr[len + 1] ? oarr[len + 1] : oarr[len] }
            } else {
                nextLinkIdObj = { [lid]: oarr[0] }
            }
            isLd = false;
        }
    })
    if (isLd && taskInfoInTypesIndex < taskInfoInTypes.length) {
        taskInfoInTypesIndex++
        setLinkId(Number(lid) + 1)
    }
}
function setNextLinkPak() {
    var lid = $("#LinkId").val();
    taskInfoInTypes.forEach((r, index, arr) => {
        if (r.SubLinkId == lid) {
            r = arr[index + 1]
            var lid2 = r.SubLinkId
            var oarr = r.OperationName.split(";")
            nextLinkIdObj = { [lid2]: oarr[0] }
        }
    })
}
function hasNextLinkId(lid) {
    return nextLinkIdObj[lid] ? false : true;
}