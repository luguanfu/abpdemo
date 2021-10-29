
$(function () {

    //if (taskid != "0" && customerid != "0") {
    //    getScene(taskid, customerid);
    //}

    //富文本编辑
    $('.summernote').summernote({
        lang: 'zh-CN',
        //height: 150,
        maxHeight: 200,
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']]
        ]
    });

    $('.note-editable').blur(function () {
        SetEditTextInfo(this);
    });

    $("#FileName").change(function () {
        ImportOperManual();
    });

    GetEditTextInfo();

    InitEvent();
    redload();
})

function InitEvent() {
    var taskid = $("#taskid").val();
    var customerid = $("#customerid").val();
    $('#Names_151').on('ifClicked', function (e) {
        var status = e.target.checked;
        status = !status;
        var LinkId = $(this).data("linkid");
        var TaskDetailId = $(this).data("taskdetailid");
        if (TaskDetailId == null) {
            TaskDetailId = "0";
        }
        var Types = 1;
        var OperationName = linkOperDict[LinkId];
        var Answer = status ? "送别完成" : "";
        var data = {};
        data["TaskDetailId"] = TaskDetailId;
        data["TaskId"] = taskid;
        data["Customerid"] = customerid;
        data["LinkId"] = LinkId;
        data["Types"] = Types;
        data["OperationName"] = OperationName;
        data["Answer"] = Answer;

        if (Answer.length == 0) {
            $(this).data("taskdetailid", "0");
        }

        $.ajax({
            url: '/Admin/CaseManagement/AddOrEditTaskDetail',
            Type: "post",
            dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function (data) {

                //if (data > 0) {
                //    layer.msg('保存成功！', function () { });
                //}
                //else {
                //    layer.msg('保存失败！', function () { });
                //}
            }
        });
    });
    $("#Names_15").on("change", function () {
        var LinkId = $(this).data("linkid");
        var TaskDetailId = $(this).data("taskdetailid");
        if (TaskDetailId == null) {
            TaskDetailId = "0";
        }
        var Types = 1;
        var OperationName = linkOperDict[LinkId];
        var Answer = $(this).val();
        var data = {};
        data["TaskDetailId"] = TaskDetailId;
        data["TaskId"] = taskid;
        data["Customerid"] = customerid;
        data["LinkId"] = LinkId;
        data["Types"] = Types;
        data["OperationName"] = OperationName;
        data["Answer"] = Answer;

        if (Answer.length == 0) {
            $(this).data("taskdetailid", "0");
        }

        $.ajax({
            url: '/Admin/CaseManagement/AddOrEditTaskDetail',
            Type: "post",
            dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function (data) {
                //if (data > 0) {
                //    layer.msg('保存成功！', function () { });
                //}
                //else {
                //    layer.msg('保存失败！', function () { });
                //}
            }
        });

    });
}

function redload() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
    //全选checkbox
    var $checkboxAll = $(".checkbox-all"),
        $checkbox = $(".new_table").find("[type='checkbox']").not("[disabled]"),
        length = $checkbox.length,
        i = 0;
    $checkboxAll.on("ifClicked", function (event) {
        if (event.target.checked) {
            $checkbox.iCheck('uncheck');
            i = 0;
        } else {
            $checkbox.iCheck('check');
            i = length;
        }
    });
}



function getScene() {
    var taskid = $("#taskid").val();
    var customerid = $("#customerid").val();
    var sceneid = 3;

    $.ajax({
        url: '/Admin/CaseManagement/GetSceneInfo',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "taskid": taskid, "customerid": customerid, "SceneId": sceneid },
        success: function (data) {
            //var LinkId = $(this).data("linkid");
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                //if (item["Types"] != "1") continue;

                if (item["LinkId"] == 151) {
                    $("#Names_151").data("taskdetailid", item["ID"]);
                    $("#Names_151").iCheck('check');
                }
                if (item["LinkId"] == 15) {
                    $("#Names_15").data("taskdetailid", item["ID"]);
                    $("#Names_15").val(item["Answer"]);

                    $("#Names_15").select2();

                }
                else if (item["LinkId"] == 10) {
                    $("#TaskDetailIdCash").val(item["ID"]);
                    var answer = item["Answer"];
                    var arr = answer.split(",");
                    $("#ShowAmount").val(arr[0]);
                    $("#ActualAmount").val(arr[1]);
                    $("#CashInfoLabel").text(`额定${arr[0]};实际可兑换${arr[1]}`);
                    GetCashDetailInfo(item["ID"]);
                }
            }

        }
    });

}


//[ShowAmount],[CounterfeitMoney],[DamagedMoney],[ActualAmount],[Names_15]
//function BtnSubmit() {

//    var taskid = $("#taskid").val();
//    var customerid = $("#customerid").val();

//    var Names_15 = $("#Names_15").val();

//    var data = {};
//    data["TaskId"] = taskid;
//    data["Customerid"] = customerid;
//    data["ShowAmount"] = ShowAmount;
//    data["CounterfeitMoney"] = CounterfeitMoney;
//    data["DamagedMoney"] = DamagedMoney;
//    data["ActualAmount"] = ActualAmount;
//    data["Names_15"] = Names_15;


//    $.ajax({
//        url: '/Admin/CounterScene/SetCounterScene',
//        Type: "post",
//        dataType: "json", cache: false,
//        contentType: "application/json; charset=utf-8",
//        data: data,
//        success: function (data) {
//            if (data > 0) {
//                layer.msg('保存成功！', function () { });
//            }
//            else {
//                layer.msg('保存失败！', function () { });
//            }
//        }
//    });

//}


var ShowAmount = '';
//var CounterfeitMoney = '';
//var DamagedMoney ='';
var ActualAmount = '';

//编辑收取现金
function EidtCash() {

    layer.open({
        title: '编辑收取现金',
        btn: ['确定', '取消'],
        area: ['550px', '700px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#EditCash"),
        yes: function (index, layero) {
            ShowAmount = $("#ShowAmount").val();
            //CounterfeitMoney = $("#CounterfeitMoney").val();
            //DamagedMoney = $("#DamagedMoney").val();
            ActualAmount = $("#ActualAmount").val();


            if (ActualAmount < 0) {
                layer.msg('实际可兑付金额不能为负数！', function () { });
                return;
            }

            var taskid = $("#taskid").val();
            var customerid = $("#customerid").val();
            var LinkId = 10;
            var TaskDetailId = $("#TaskDetailIdCash").val();
            if (TaskDetailId == null) {
                TaskDetailId = "0";
            }
            var Types = 1;
            var OperationName = linkOperDict[LinkId];
            var Answer = `${ShowAmount},${ActualAmount}`;
            if (ShowAmount == "0" || ShowAmount == "") {
                Answer = "";
            }
            var data = {};
            data["TaskDetailId"] = TaskDetailId;
            data["TaskId"] = taskid;
            data["Customerid"] = customerid;
            data["LinkId"] = LinkId;
            data["Types"] = Types;
            data["OperationName"] = OperationName;
            data["Answer"] = Answer;


            var cashDetailArr = [];
            $("#DamagedMoneyDiv>div").each(function () {
                var value = $(this).data("value")
                var item = {};
                item["Type"] = "1";
                item["DamageType"] = value;
                item["CounterfeitType"] = "";
                cashDetailArr.push(item);
            });

            $("#CounterfeitDiv>div").each(function () {
                var value = $(this).data("value")
                var item = {};
                item["Type"] = "2";
                item["DamageType"] = "";
                item["CounterfeitType"] = value;
                cashDetailArr.push(item);
            });

            data["CashDetails"] = JSON.stringify(cashDetailArr);


            $.ajax({
                url: '/Admin/CaseManagement/AddOrEditTaskDetail',
                Type: "post",
                dataType: "json", cache: false,
                contentType: "application/json; charset=utf-8",
                data: data,
                success: function (data) {
                    if (data > 0) {
                        $("#CashInfoLabel").text(`额定${ShowAmount};实际可兑换${ActualAmount}`);
                        layer.msg('保存成功！', function () { });
                        layer.close(index);
                    }
                    else {
                        layer.msg('保存失败！', function () { });
                    }
                }
            });




        },
        btn2: function (index, layero) {

            layer.close(index);
        },
        cancel: function (index, layero) {

            //$("input[name='CounterfeitMoney']:radio").each(function () {
            //    if ($(this).val() == CounterfeitMoney) {
            //        $(this).iCheck('check');
            //    } else { 
            //        $(this).iCheck('uncheck');
            //    }
            //});
            //$("input[name='DamagedMoney']:radio").each(function () {
            //    if ($(this).val() == DamagedMoney) {
            //        $(this).iCheck('check');
            //    } else {
            //        $(this).iCheck('uncheck');
            //    }
            //});


        }
    });
}

function Editscore(obj) {
    var taskid = $("#taskid").val();
    var formid = $(obj).parent().data("formid");
    var formname = $(obj).parent().data("formname");
    var types = $(obj).parent().data("types");
    var customerid = $("#customerid").val();
    var data2 = {};
    data2["TaskId"] = taskid;
    data2["Customerid"] = customerid;
    data2["formid"] = formid;
    $.ajax({
        url: '/Admin/CaseManagement/GetTaskScore',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: data2,
        success: function (data1) {
            if (data1 > 0) {
                $("#taskSocre").val(data1);
            } else {
                $("#taskSocre").val("0");
            }
            layer.open({
                title: '设置分数',
                btn: ['确定', '取消'],
                area: ['550px', '700px'],
                type: 1,
                skin: 'layui-layer-lan', //样式类名
                closeBtn: 1, //显示关闭按钮
                anim: 2,
                shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
                content: $("#EditScore"),
                yes: function (index, layero) {
                    score = $("#taskSocre").val();
                    if (score < 0) {
                        layer.msg('实际分数不能为负数！', function () { });
                        return;
                    }

                    var taskid = $("#taskid").val();
                    var customerid = $("#customerid").val();
                    var LinkId = 12;
                    var data = {};
                    data["TaskId"] = taskid;
                    data["Customerid"] = customerid;
                    data["formid"] = formid;
                    data["score"] = score;

                    $.ajax({
                        url: '/Admin/CaseManagement/SetTaskScore',
                        Type: "post",
                        dataType: "json", cache: false,
                        contentType: "application/json; charset=utf-8",
                        data: data,
                        success: function (data) {
                            if (data > 0) {
                                layer.msg('保存成功！', function () { });
                                layer.close(index);
                            }
                            else {
                                layer.msg('保存失败！', function () { });
                            }
                        }
                    });




                },
                btn2: function (index, layero) {

                    layer.close(index);
                },
                cancel: function (index, layero) {

                    //$("input[name='CounterfeitMoney']:radio").each(function () {
                    //    if ($(this).val() == CounterfeitMoney) {
                    //        $(this).iCheck('check');
                    //    } else { 
                    //        $(this).iCheck('uncheck');
                    //    }
                    //});
                    //$("input[name='DamagedMoney']:radio").each(function () {
                    //    if ($(this).val() == DamagedMoney) {
                    //        $(this).iCheck('check');
                    //    } else {
                    //        $(this).iCheck('uncheck');
                    //    }
                    //});


                }
            });
        }
    });
    
}



function CounterfeitChange(obj) {
    if ($(obj).val() == "1") {
        $("#CounterfeitCheckDiv").show();
    } else {
        $("#CounterfeitCheckDiv").hide();
    }
}

function AddDamagedMoney() {

    var count = $("#DamagedMoneyDiv>div").length;
    if (count >= 5) {
        layer.msg('最多只能添加5张残损币！', function () { });
        return;
    }

    var selVal = $("#DamagedMoneySelect").val();
    var selText = $("#DamagedMoneySelect").find("option:selected").text();

    var str = `<div class="col-sm-12" data-value="${selVal}">
            <div class="form-horizontal  m-t-lg">
                <label for="firstname" class="col-sm-4 control-label"></label>
                <div class="col-sm-4">
                    ${selText}
                </div>
                <div class="col-sm-4">
                    <button type="button" class="btn  btn-danger " onclick="DelDamagedMoney(this)">删除</button>
                </div>
            </div>
        </div>`;

    $("#DamagedMoneyDiv").append(str);

    count = $("#DamagedMoneyDiv>div").length;
    $("#DamagedMoneyCount").text(`${count}/5`);
    AutoCalcAmount();
}

function DelDamagedMoney(obj) {
    $(obj).parent().parent().parent().remove();
    AutoCalcAmount();
}

function AddCounterfeit() {
    var count = $("#CounterfeitDiv>div").length;
    var ActualAmount = $("#ActualAmount").val()
    if (count >= 5) {
        layer.msg('最多只能添加5张疑似假币！', function () { });
        return;
    }

    var selVal = $("#CounterfeitSelect").val();

    var dataValue = [];
    var dataText = [];
    var selText = "";
    if (selVal == "1") {

        $("input[name='CounterfeitCheck']").each(function () {

            if ($(this).is(':checked')) {
                dataValue.push($(this).val());
                dataText.push($(this).parent().next("span").text());
            }

        });
        selVal = dataValue.join(",");
        selText = dataText.join(",");
        if (ActualAmount < 0) {
            ;
            layer.msg('添加残损币错误！', function () { });
            return;
        }

        if (selVal.length == 0) {
            layer.msg('请勾选假币内容！', function () { });
            return;
        }

    } else {
        selVal = "";
        selText = "真币";
    }

    var str = `<div class="col-sm-12" data-value="${selVal}">
            <div class="form-horizontal  m-t-lg">
                <label for="firstname" class="col-sm-4 control-label"></label>
                <div class="col-sm-4">
                    ${selText}
                </div>
                <div class="col-sm-4">
                    <button type="button" class="btn  btn-danger " onclick="DelDamagedMoney(this)">删除</button>
                </div>
            </div>
        </div>`;

    $("#CounterfeitDiv").append(str);

    count = $("#CounterfeitDiv>div").length;
    $("#CounterfeitCount").text(`${count}/5`);
    AutoCalcAmount();
}

function DelCounterfeit() {
    $(obj).parent().parent().parent().remove();
    AutoCalcAmount();
}

function AutoCalcAmount() {
    var ShowAmount = $("#ShowAmount").val();


    var ActualAmount = Number(ShowAmount);

    $("#DamagedMoneyDiv>div").each(function () {
        var value = $(this).data("value")
        if (value == "1") {
            ActualAmount -= 0;
        } else if (value == "2") {
            ActualAmount -= 0;
        } else if (value == "3") {
            ActualAmount -= 50;
        } else if (value == "4") {
            ActualAmount -= 100;
        }
    });
    $("#CounterfeitDiv>div").each(function () {
        var value = $(this).data("value")
        if (value == "") {

        } else {
            ActualAmount -= 100;
        }
    });


    $("#ActualAmount").val(ActualAmount);

}

function GetCashDetailInfo(taskDetailId) {
    $.ajax({
        url: '/Admin/CaseManagement/GetCashDetailInfo',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "TaskDetailId": taskDetailId },
        success: function (data) {
            $("#DamagedMoneyDiv").empty();
            $("#CounterfeitDiv").empty();

            if (data.length == 0) return;

            var damageCount = 0;
            var counterfeitCount = 0;

            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var Type = item["Type"];
                var DamageType = item["DamageType"];
                var CounterfeitType = item["CounterfeitType"];

                var text = "";
                if (Type == "1") {
                    if (DamageType == "1") {
                        text = "01.污损币,全额兑换";
                    } else if (DamageType == "2") {
                        text = "02.残损币,全额兑换";
                    } else if (DamageType == "3") {
                        text = "03.残损币,半额兑换";
                    } else if (DamageType == "4") {
                        text = "04.残损币,无法兑换";
                    }

                    var str = `<div class="col-sm-12" data-value="${DamageType}">
                                <div class="form-horizontal  m-t-lg">
                                    <label for="firstname" class="col-sm-4 control-label"></label>
                                    <div class="col-sm-4">
                                        ${text}
                                    </div>
                                    <div class="col-sm-4">
                                        <button type="button" class="btn  btn-danger " onclick="DelDamagedMoney(this)">删除</button>
                                    </div>
                                </div>
                            </div>`;

                    $("#DamagedMoneyDiv").append(str);

                    damageCount++;

                } else if (Type == "2") {

                    if (CounterfeitType == "") {
                        text = "真币";
                    }
                    else {
                        var CounterfeitArr = CounterfeitType.split(",");
                        var CounterfeitTextArr = [];
                        for (var j = 0; j < CounterfeitArr.length; j++) {
                            if (CounterfeitArr[j] == "1") {
                                CounterfeitTextArr.push("固定水印");
                            } else if (CounterfeitArr[j] == "2") {
                                CounterfeitTextArr.push("隐形面额");
                            } else if (CounterfeitArr[j] == "3") {
                                CounterfeitTextArr.push("油墨数字");
                            } else if (CounterfeitArr[j] == "4") {
                                CounterfeitTextArr.push("白水印");
                            }
                        }
                        text = CounterfeitTextArr.join(",");
                    }

                    var str = `<div class="col-sm-12" data-value="${CounterfeitType}">
                                <div class="form-horizontal  m-t-lg">
                                    <label for="firstname" class="col-sm-4 control-label"></label>
                                    <div class="col-sm-4">
                                        ${text}
                                    </div>
                                    <div class="col-sm-4">
                                        <button type="button" class="btn  btn-danger " onclick="DelDamagedMoney(this)">删除</button>
                                    </div>
                                </div>
                            </div>`;

                    $("#CounterfeitDiv").append(str);


                    counterfeitCount++;

                }
            }


            $("#DamagedMoneyCount").text(`${damageCount}/5`);
            $("#CounterfeitCount").text(`${counterfeitCount}/5`);

        }
    });

}

function GetEditTextInfo() {

    var customerid = $("#customerid").val();
    $.ajax({
        url: '/Admin/CounterScene/GetEditTextInfo',
        Type: "POST",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "customerid": customerid },
        success: function (data) {
            if (data.length > 0) {
                $('#TaskDescribe').code(HTMLDecode(data[0]["TaskDescribe"]));
                $('#TaskImportant').code(HTMLDecode(data[0]["TaskImportant"]));
                $("#OperManualName").html(data[0]["OperManualName"]);
            }

        }
    });

}


function SetEditTextInfo(obj) {
    var editObj = $(obj).parent().prev();

    var name = editObj.attr("name");
    var value = HTMLEncode(editObj.code());

    var customerid = $("#customerid").val();


    $.ajax({
        url: '/Admin/CounterScene/SetEditTextInfo',
        type: "POST",
        dataType: "json", cache: false,
        //contentType: "application/json; charset=utf-8",
        data: { "customerid": customerid, "FieldName": name, "FieldValue": value },
        success: function (data) {
            if (data > 0) {

            }
            else {
                layer.msg('保存失败！', function () { });
            }
        }
    });


}

function ImportOperManual() {

    var docObj = document.getElementById("FileName");

    //上传文件校验只能是excel
    if (docObj.files && docObj.files[0]) {
        var f = docObj.files;
        var exltype = f[0].name;//获取文件名
        var exp = /.pdf$|.PDF$/;
        if (exp.exec(exltype) == null) {
            layer.msg('上传格式错误（仅支持.pdf文件）', { icon: 2 });
            return;
        }
    }
    else {
        layer.msg('请选择上传文件！', function () { });
        return;
    }

    $("#OperManualName").html($("#FileName").val());

    var customerid = $("#customerid").val();
    var formData = new FormData();
    formData.append("FormFiles", document.getElementById("FileName").files[0]);
    //提交
    $.ajax({
        type: "POST",
        //dataType: "json",
        url: '/Admin/CounterScene/UploadFile?customerid=' + customerid,
        data: formData,
        processData: false,  // 不处理数据
        contentType: false,   // 不设置内容类型
        success: function (data) {
            if (data == "1") {//正常结束
                layer.msg('操作成功', { icon: 1 });
            }
            else {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });

}