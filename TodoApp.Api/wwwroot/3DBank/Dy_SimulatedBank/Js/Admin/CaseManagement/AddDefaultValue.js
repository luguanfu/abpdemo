$(function () {

    $(".foot").next("input").after("<input type='hidden' value='0' id='checkBoxNum'>");
    var isDefault = getQueryString("isDefault");
    if (isDefault == 2) {
        var divs = document.getElementsByTagName('div');
        var inputs = $(document).find("input");

        findSelect1();
        addCheckbox();
        getValues();
        $("#btnsubmit").removeAttr("onclick").click(function () {
            saveMoreDefaultValue();
        });

    }


});



$(document).ready(function () {

    var passwordList = $(document).find("input[type='password']");
    //console.log(passwordList);
    //$(document).find("input[type='password']").each(function () {
    //    //debugger;
    //    $(passwordList).val("");
    //});
    //$("#pwd_jymm").val("");
    //$("#txt_fkzh").val("");
});


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}



var isUpdate = 0;
//加载数据如果有添加数据,附加数据
function getValues() {
    var FormId = $("#FormId").val();
    var TaskId = $("#TaskId").val();
    var CustomerId = getQueryString("CustomerId");
    $.ajax({
        type: "POST",
        dataType: "json",
        async: false,
        url: "/admin/TMDefaultValue/getValues",
        data: { "TaskId": TaskId, "TMNO": FormId, "CustomerId": CustomerId },
        success: function (dt) {
            var defaultValue = "";
            var eleValue = "";
            var eleId = "";
            var indexvalue = "";
            //$065401#sle_czlx#2 - 收入;#sle_bz#CNY - 人民币$065401#money_jyje#123123;#sle_dfgy#315492-周熊界
            if (dt.length > 0) {
                try {
                    defaultValue = dt[0]["DefaultValue"];
                    if (defaultValue != "") {
                        isUpdate = 1;
                        var defaultValueList = (defaultValue ? defaultValue : "").split('$');
                        if (defaultValueList.length > 2) {
                            var num = parseInt($("#checkBoxNum").val());
                            for (var i = 1; i < defaultValueList.length; i++) {
                                num += 1;
                                $("#checkBoxNum").val(num);
                                var values = "数据" + num;
                                var data = (defaultValueList[i] ? defaultValueList[i] : "").split(';');
                                //var data = defaultValueList[i].split(';');
                                for (var j = 0; j < data.length; j++) {
                                    if (j == 0) {
                                        indexvalue = (data[0] ? data[0] : "").split('#');
                                        eleId = indexvalue[1];
                                        eleValue = indexvalue[2];
                                        if (eleId == "") continue;
                                        var eleV = (eleValue ? eleValue : "").split('-')[0];
                                        if (eleId.indexOf('sle_') > -1) {
                                            $("#" + eleId).val(eleValue);
                                            if (eleV == "") {
                                                var selectId = $("#" + eleId);
                                                var selectValue = selectId.find("option").eq(2).val();
                                                var selectText = selectId.find("option").eq(2).text();
                                                $("#" + eleId + " option[value=" + selectValue + "]").attr("selected", "selected");
                                                $("#" + eleId).siblings("input").val(selectText);
                                            } else {
                                                $("#" + eleId + " option[value=" + eleV + "]").attr("selected", "selected");
                                                $("#" + eleId).siblings("input").val(eleValue);
                                            }
                                            $("#" + eleId).parent().next().after("<span style='color:red'>" + values + "</span>");
                                        } else {
                                            $("#" + eleId).val(eleValue);
                                            $("#" + eleId).next().after("<span style='color:red'>" + values + "</span>");
                                        }
                                    }
                                    else if (j == data.length - 1) {

                                        indexvalue = (data[j] ? data[j] : "").split('#');
                                        if (indexvalue.length != 1) {
                                            eleId = indexvalue[1];
                                            eleValue = indexvalue[2];
                                            if (eleId == "") continue;
                                            var eleV = (eleValue ? eleValue : "").split('-')[0];
                                            if (eleId.indexOf('sle_') > -1) {
                                                $("#" + eleId).val(eleValue);
                                                if (eleV == "") {
                                                    var selectId = $("#" + eleId);
                                                    var selectValue = selectId.find("option").eq(2).val();
                                                    var selectText = selectId.find("option").eq(2).text();
                                                    $("#" + eleId + " option[value=" + selectValue + "]").attr("selected", "selected");
                                                    $("#" + eleId).siblings("input").val(selectText);
                                                } else {
                                                    $("#" + eleId + " option[value=" + eleV + "]").attr("selected", "selected");
                                                    $("#" + eleId).siblings("input").val(eleValue);
                                                }
                                                $("#" + eleId).parent().next().attr("checked", true);
                                                $("#" + eleId).next().after("<span style='color:red'>" + values + "</span>");
                                            } else {
                                                $("#" + eleId).val(eleValue);
                                                $("#" + eleId).next().attr("checked", true);
                                                $("#" + eleId).next().after("<span style='color:red'>" + values + "</span>");
                                            }
                                        }

                                    }
                                    else {
                                        indexvalue = (data[j] ? data[j] : "").split('#');
                                        eleId = indexvalue[0];
                                        eleValue = indexvalue[1];
                                        var eleV = (eleValue ? eleValue : "").split('-')[0];
                                        if (eleId.indexOf('sle_') > -1) {
                                            $("#" + eleId).val(eleValue);
                                            if (eleV == "") {
                                                var selectId = $("#" + eleId);
                                                var selectValue = selectId.find("option").eq(2).val();
                                                var selectText = selectId.find("option").eq(2).text();
                                                $("#" + eleId + " option[value=" + selectValue + "]").attr("selected", "selected");
                                                $("#" + eleId).siblings("input").val(selectText);
                                            } else {
                                                $("#" + eleId + " option[value=" + eleV + "]").attr("selected", "selected");
                                                $("#" + eleId).siblings("input").val(eleValue);
                                            }
                                            $("#" + eleId).parent().next().after("<span style='color:red'>" + values + "</span>");
                                        } else {
                                            $("#" + eleId).val(eleValue);
                                            $("#" + eleId).next().after("<span style='color:red'>" + values + "</span>");
                                        }

                                    }
                                }
                            }
                        }
                        else {
                            var num = parseInt($("#checkBoxNum").val());
                            for (var i = 1; i < defaultValueList.length; i++) {
                                num += 1;
                                $("#checkBoxNum").val(num);
                                var values = "数据" + num;
                                var data = defaultValueList[i].split(';');
                                for (var j = 0; j < data.length; j++) {

                                    if (j == 0) {
                                        indexvalue = (data[0] ? data[0] : "").split('#');
                                        eleId = indexvalue[1];
                                        eleValue = indexvalue[2];
                                        var eleV = (eleValue ? eleValue : "").split('-')[0];
                                        if (eleId.indexOf('sle_') > -1) {
                                            $("#" + eleId).val(eleValue);
                                            if (eleV == "") {
                                                var selectId = $("#" + eleId);
                                                var selectValue = selectId.find("option").eq(2).val();
                                                var selectText = selectId.find("option").eq(2).text();
                                                $("#" + eleId + " option[value=" + selectValue + "]").attr("selected", "selected");
                                                $("#" + eleId).siblings("input").val(selectText);
                                            } else {
                                                $("#" + eleId + " option[value=" + eleV + "]").attr("selected", "selected");
                                                $("#" + eleId).siblings("input").val(eleValue);
                                            }
                                            $("#" + eleId).parent().next().after("<span style='color:red'>" + values + "</span>");
                                        } else {
                                            $("#" + eleId).val(eleValue);
                                            $("#" + eleId).next().after("<span style='color:red'>" + values + "</span>");
                                        }
                                    }
                                    else if (j == data.length - 1) {
                                        indexvalue = (data[j] ? data[j] : "").split('#');
                                        eleId = indexvalue[1];
                                        eleValue = indexvalue[2];
                                        var eleV = (eleValue ? eleValue : "").split('-')[0];
                                        if (eleId.indexOf('sle_') > -1) {
                                            $("#" + eleId).val(eleValue);
                                            if (eleV == "") {
                                                var selectId = $("#" + eleId);
                                                var selectValue = selectId.find("option").eq(2).val();
                                                var selectText = selectId.find("option").eq(2).text();
                                                $("#" + eleId + " option[value=" + selectValue + "]").attr("selected", "selected");
                                                $("#" + eleId).siblings("input").val(selectText);
                                            } else {
                                                $("#" + eleId + " option[value=" + eleV + "]").attr("selected", "selected");
                                                $("#" + eleId).siblings("input").val(eleValue);
                                            }
                                            $("#" + eleId).parent().next().attr("checked", true);
                                            $("#" + eleId).parent().next().after("<span style='color:red'>" + values + "</span>");

                                        } else {
                                            $("#" + eleId).val(eleValue);
                                            $("#" + eleId).next().attr("checked", true);
                                            $("#" + eleId).next().after("<span style='color:red'>" + values + "</span>");
                                        }
                                    }
                                    else {
                                        indexvalue = (data[j] ? data[j] : "").split('#');
                                        eleId = indexvalue[0];
                                        eleValue = indexvalue[1];
                                        var eleV = (eleValue ? eleValue : "").split('-')[0];
                                        if (eleId.indexOf('sle_') > -1) {
                                            $("#" + eleId).val(eleValue);
                                            if (eleV == "") {
                                                var selectId = $("#" + eleId);
                                                var selectValue = selectId.find("option").eq(2).val();
                                                var selectText = selectId.find("option").eq(2).text();
                                                $("#" + eleId + " option[value=" + selectValue + "]").attr("selected", "selected");
                                                $("#" + eleId).siblings("input").val(selectText);
                                            }
                                            else {
                                                $("#" + eleId + " option[value=" + eleV + "]").attr("selected", "selected");
                                                $("#" + eleId).siblings("input").val(eleValue);
                                            }

                                            $("#" + eleId).parent().next().after("<span style='color:red'>" + values + "</span>");
                                        } else {
                                            $("#" + eleId).val(eleValue);
                                            $("#" + eleId).next().after("<span style='color:red'>" + values + "</span>");
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch { }

                var tabDefaultValue = dt[0]["TabDefaultValue"].split('$');
                for (var t = 0; t < tabDefaultValue.length - 1; t++) {
                    var ts = tabDefaultValue[t].split('#');
                    if (ts.length == 2) {
                        $("textarea:eq(" + t + ")").val(ts[1]);
                        setTableValue(ts[1]);
                    } else {
                        $("textarea:eq(" + t + ")").val(ts[0]);
                        setTableValue(ts[0]);
                    }
                    
                }
            }
        }
    });
}


//给每个空间后面加checkbox
function addCheckbox() {
    var selectEvent = $(document).find("select");
    var inputs = $(".con-map2").find("input");

    $(inputs).each(function () {
        var type = $(this).attr("type");
        if (type != "checkbox") {
            $(this).removeAttr("disabled");
            var haveValue = $(this).attr("vl-disabled") || $(this).attr("disabled");

            ////判断是否有隐藏属性,有就不加上checkbox
            if (!!haveValue && haveValue) {
                //haveValue.removeAttr("disabled");
                $(this).after("<input  type='checkbox' type='hidden'>");
            }
            else {
                $(this).after("<input type='checkbox'>");
            }
        }
    });
    //$(inputs).after("<input type='checkbox'>");
    $(selectEvent).each(function () {
        $(this).removeAttr("disabled");
        var haveValue = $(this).attr("vl-disabled") || $(this).attr("disabled");
        //if (!!haveValue && haveValue) {
        //    //haveValue.removeAttr("disabled");
        //    $(this).after("<input type='hidden'  type='checkbox'>");
        //}
        //else {
        $(this).parent("div").after("<input type='checkbox'>");
        //}
    });

    selectEvent = $(document).find("select");
    for (var i = 0; i < selectEvent.length; i++) {
        $(selectEvent).next("input").next("input").next("span").remove();
        $(selectEvent).next("input").next("input").remove();
    }
    //根据选择是否选择了checkbox赋值checkBoxNum,用于判断是第几个关键节点
    $("input[type='checkbox']").click(function () {
        var eventId = $(this).attr("eventId");
        if (eventId == undefined || eventId == "" || eventId == "") {
            var checkBoxNum = $("#checkBoxNum").val();
            var isChecked = $(this).prop('checked');
            if (isChecked == true) {
                checkBoxNum = parseInt(checkBoxNum) + 1;
                $("#checkBoxNum").val(checkBoxNum);
            }
            else {
                checkBoxNum = parseInt(checkBoxNum) - 1;
                $("#checkBoxNum").val(checkBoxNum);
            }
        }
    });
    $("input[type=checkbox]").click(function () {
        var eventId = $(this).attr("eventId");
        if (eventId != undefined && eventId.length > 0) {
            if ($(this).is(":checked")) {
                var values = "数据" + $("#checkBoxNum").val();                
                $(this).after("<span style='color:red'>" + values + "</span>");
            }
        }
    });
    $("input").change(function () {
        var checkBoxNum = $("#checkBoxNum").val();
        //var values = "数据" + $("#checkBoxNum").val();
        if (parseInt(checkBoxNum) == 0) {

        }
        else {

            var values = "数据" + $("#checkBoxNum").val();
            var ele_parent = $(this).parent();
            if (ele_parent.attr("class") == "slectstyle") {
                if (!!ele_parent.next("input").next("span")) {
                    ele_parent.next("input").next("span").remove();
                }
                ele_parent.next("input").after("<span style='color:red'>" + values + "</span>");
            } else {

                if (!!$(this).next("input").next("span")) {
                    $(this).next("input").next("span").remove();
                }

                $(this).next("input").after("<span style='color:red'>" + values + "</span>");

            }

        }

    });
    $("select").change(function () {
        var checkBoxNum = $("#checkBoxNum").val();
        if (parseInt(checkBoxNum) == 0) {
        }
        else {
            var values = "数据" + $("#checkBoxNum").val();
            //console.log($(this).parent().next("input").length);
            if (!!$(this).parent().next("input[type='checkbox']").next("span")) {
                $(this).parent().next("input[type='checkbox']").next("span").remove();
            }
            if ($(this).parent().next("input").length == "1") {
                $(this).parent().next("input").after("<span style='color:red'>" + values + "</span>");
            }
            else {
                $(this).next("input").after("<span style='color:red'>" + values + "</span>");
            }

        }

    });

    var inputs2 = $(document).find("select").next("input[type='hidden']");
    $(inputs2).each(function (i) {
        //console.log(i)
        $(this).removeAttr("type");
    });
}







//新增默认数据
function saveMoreDefaultValue() {
    var FormId = $("#FormId").val();
    var isChecked = $("input[type='checkbox']").is(':checked');
    var checkBoxNum = parseInt($("#checkBoxNum").val());
    var TMNo = $("#TMNo").val();
    var TMNo1 = TMNo;
    var values = "";
    var areaValue = "";
    var id = $("#hidtaskid").val();
    TMNo = "$" + FormId + "#";
    var TaskId = $("#TaskId").val();
    for (var i = 1; i <= checkBoxNum; i++) {
        var values0 = "";
        var values1 = "";
        $("span").each(function () {
            if ($(this).html() == "数据" + i) {

                var _cid = $(this).prev().attr("id");
                if (_cid != undefined && _cid.startsWith("check")) {
                    values0 += _cid + "#" + $(this).prev().is(":checked") + ";";
                }
                else {
                    if ($(this).prev().prev().children(":first").is("select")) {
                        var _id = $(this).prev().prev().children(":first").attr("id");


                        if (_id.substring(0, 2) == "mb") {
                            return;
                        }

                    }
                    else {
                        var _id = $(this).prev().prev().attr("id");
                        if (_id.substring(0, 2) == "mb") {
                            return;
                        }
                    }
                    var _this = $(this).prev().prev();
                    var _value = "";
                    if (_this.find("select").is("select")) {
                        var _length = _this.find("select option").length;
                        if (_length > 1) {
                            _value = _this.find("select").find("option:selected").val();
                        } else {
                            _value = _this.find("input").val();
                        }

                    }
                    else if (_this.is("select")) {
                        var _length = _this.find("option").length;
                        if (_length > 1) {
                            _value = _this.find("option[selected='selected']").val();
                        } else {
                            _value = _this.find("input").val();
                        }
                    }
                    else if (_this.is("input")) {
                        _value = _this.val();
                    }

                    if (isUpdate == 0) {
                        if ($(this).prev().is(':checked')) {
                            values1 = "#" + _id + "#" + _value;
                        } else {
                            values0 += _id + "#" + _value + ";";
                        }
                    }
                    else {
                        if ($(this).prev().is(':checked') || $(this).parent().next().is(':checked')) {
                            values1 = "#" + _id + "#" + _value;
                        }
                        else {
                            values0 += _id + "#" + _value + ";";
                        }
                    }
                }
            }

        });
        //alert(values1);
        values += TMNo + values0 + values1;
    }
    $("textarea").each(function () {
        areaValue += $(this).attr("id") + "#" + $(this).val() + "$";
    });
    //console.log("&*&*&*??" + values);
    //return;
    $.ajax({
        type: "POST",
        dataType: "json",
        async: false,
        url: "/admin/TMDefaultValue/AddDefaultValue",
        data: { "TaskId": TaskId, "DefaultValue": values, "TMNO": FormId, "CustomerId": getQueryString("CustomerId"), "AreaValue": areaValue },
        success: function (result) {
            if (result > 0) {
                layer.msg("编辑成功", function () {
                    doSubmit();
                    var index2 = parent.layer.getFrameIndex(window.name); //获取窗口索引
                    parent.layer.close(index2);
                    
                    //window.location.href = '/Admin/taskshow' + "/?id=" + id + "&ComplexPlan_Id=" + ComplexPlan_Id + "&p_page=1";
                });
            } else {
                layer.msg("编辑失败");
            }
        }
    });
}




//找到页面上全部select,不去掉select框后面的input
function findSelect1() {
    var selectEvent = $(document).find("select");
    var passwordList = $(document).find("input[type='password']");

    $(document).find("input[type='password']").each(function () {
        //debugger;
        var id = passwordList.attr("id");
        $(id).val("");
    });


    //for (var i = 0; i < selectEvent.length; i++) {
    //    $(selectEvent).next("input").remove();
    //}
    $(".foot").next("input").remove();
    $('select').prop('selectedIndex', 0);
    $('input').removeAttr("oncopy");
    $('input').removeAttr("onpaste");
    $('input').removeAttr("oncut");
    $('div').removeAttr("style");

    selectEvent = $(document).find("select");
    for (var i = 0; i < selectEvent.length; i++) {
        $(selectEvent).next("input").next("input").next("span").remove();
        $(selectEvent).next("input").next("input").remove();
    }


    $('select').change(function () {
        //console.log($(this));
        //alert("values::" + $(this).find("option:selected").text());
        $(this).next("input").val($(this).find("option:selected").text());

        var checkBoxNum = $("#checkBoxNum").val();
        var values = "数据" + $("#checkBoxNum").val();

    });
}

