/***************************************************************
FileName:管理员端  质询管理  javascript
Copyright（c）2019-金融教育在线技术开发部
Author:伍贤成
Create Date:2019-8-5 10:11:37
******************************************************************/

$(function () {
    myfunction();
    GetQuestionLinkCount();

    var page = getQueryString("page");
    bindIngfo(page);
    GetMotion();
    GetEditMotion();
    $("input[name='addRecording']").change(function () {
        $(this).prev().html($(this).val());
    });

    $("input[name='editRecording']").change(function () {
        $(this).prev().html($(this).val());
    });

    $("input[name='Image1']").change(function () {
        $(this).prev().html($(this).val());
    });

    $("input[name='Image2']").change(function () {
        $(this).prev().html($(this).val());
    });

    $("input[name='Image3']").change(function () {
        $(this).prev().html($(this).val());
    });

    $("input[name='Image4']").change(function () {
        $(this).prev().html($(this).val());
    });
    $("input[name='Image5']").change(function () {
        $(this).prev().html($(this).val());
    });
    $("input[name='Image6']").change(function () {
        $(this).prev().html($(this).val());
    });

    $("#txtEditMotion,#txtMotion").change(function () {
        showGifByMotion();
    })


    var qatype = {
        question: '问',
        answer: '答'
    };
    $('.customer-qa-list').on('input', '.txt-customer-question', function () {
        var _val = $(this).val();
        var mode = $(this).attr('qamode');
        if (_val.indexOf('|') > -1 || _val.indexOf(':') > -1) {
            $(this).val(_val.replace(/[\|:]/g, ''));
        }
        var txt = [].map.call($(this).parents('.customer-qa-list').find(".txt-customer-question").toArray(), el => {
            var val = el.value.replace(/[\|:]/g, '');
            var type = $(el).attr('qatype');
            return val && qatype[type] ? qatype[type] + ':' + val : '';
        }).filter(i => !!i).join('|');
        $(this).parents('.customer-qa-list').find('input.ipt-customer-question').val(txt);
    });
});

//禁用新增按钮
function disbledNewBtn() {
    var selQuestioning = $("#selQuestioning option:selected").val();
    if (selQuestioning == "") {
        $("#newBtn").attr("disabled", true);
    } else {
        $("#newBtn").removeAttr("disabled");
    }
}

//change事件触发
function onChangeQuestioning() {
    //disbledNewBtn();
    bindIngfo();
}

var AllPage = 0;
//列表数据加载
function bindIngfo(page) {
    AllPage = page;
    var PageSize = 10;

    $.ajax({
        url: '/Admin/CustomerConsultation/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: {
            "page": page, "PageSize": PageSize, "Keyword": $("#Keyword").val(), "selQuestioning": $("#selQuestioning option:selected").val(),
            "Id": getQueryString("Id"), "taskId": getQueryString("taskId")
        },
        success: function (tb) {

            var html = '';
            var data = tb.Tb;//转换table

            $("#NumOne").text(data.length);

            if (data.length >= 10) {
                $("#newBtn").attr("disabled", true);
            } else {
                $("#newBtn").removeAttr("disabled");
            }

            for (var i = 0; i < data.length; i++) {
                html += '<tr>';
                //当前页面
                var idx = 0;
                if (page != "undefined" && page != null) {
                    idx = page;
                    idx = idx - 1;
                }

                html += '<td><input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["ID"] + '></td>';
                html += '<td>' + ((idx * PageSize) + i + 1) + '</td>';
                html += '<td>' + (data[i]["CustomerQuestion"] == null ? "" : data[i]["CustomerQuestion"]) + '</td>';
                html += '<td>' + (data[i]["Recording"] == (null || "") ? "未上传" : "已上传") + '</td>';
                html += '<td>' + data[i]["Motion"] + '</td>';
                //html += '<td>' + (data[i]["Answer"] == null ? "" : data[i]["Answer"]) + '</td>';
                //html += '<td>' + "" + '</td>';
                html += '<td><a class=" btn-primary btn-sm  m-r-sm" onclick="Upper_Move(' + data[i]["ID"] + ')">上移</a>';
                html += '<a class=" btn-warning btn-sm m-r-sm" onclick="Lower_Move(' + data[i]["ID"] + ')">下移</a>';
                html += '<a onclick="update(' + data[i]["ID"] + ')" class=" btn-info btn-sm  m-r-sm"><i class="fa fa-gear m-r-xxs"></i>设置质询 </a>';
                html += '<a onclick="Setupanswers(' + data[i]["ID"] + ')" class=" btn-warning btn-sm  m-r-sm"><i class="fa fa-commenting-o m-r-xxs"></i>设置回答 </a>';
                //html += '<a onclick="update(' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-cubes m-r-xxs"></i>设置能力 </a>';
                html += '</td>';
                html += '</tr>';
            }

            $("#tablelist").html(html);

            //bootstrapPaginator("#PaginatorLibrary", tb, bindIngfo);//分页
            //样式重新加载
            redload();

        }
    });
}

//查询
function SearchInfo() {
    bindIngfo();
}

//新增
function Add_CustomerConsultation() {

    motionSelId = "txtMotion";
    gifSelId = "gifImages";

    showGifByMotion();

    //表单清空
    $("#Add_CustomerConsultationform")[0].reset();
    $('#txtCustomerQuestion').val('');
    $('#txtQuestionViedo').val('');
    $("#AddRecording").text("");
    $("#CashInfoLabel").text("");
    $("#CashInfoLabel_").text("");
    $("#DamagedMoneyDiv").empty();
    $("#CounterfeitDiv").empty();
    $("#ShowAmount").val("");
    $("#ActualAmount").val("");
    $("#DamagedMoneyCount").text(`0/5`);
    $("#CounterfeitCount").text(`0/5`);
    $("#EditCash .icheckbox_square-green").each(function (r, e) {
        if ($(e).hasClass("checked")) {
            $(e).removeClass("checked")
            $(e).hasClass("hover")
            $(e).find("input")[0].checked = false;
        }
    })
    $('#Add_CustomerConsultation .customer-qa-list .customer-qa-item:not(:eq(0))').remove();
    cashItemObj = {};
    layer.open({
        title: '新增质询',
        btn: ['确定', '取消'],
        area: ['900px', '800px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Add_CustomerConsultation"),
        yes: function (index, layero) {
            Add();
        }
    });
}

//新增质询方法
function Add() {
    var txtCustomerQuestion = $("#txtCustomerQuestion").val();//质询表达
    var txtMotion = $("#txtMotion option:selected").text();//伴随表情与动作
    var txtQuestioning = $("#selQuestioning option:selected").val();//请选择质询环节
    var txtQuestionViedo = $("#txtQuestionViedo").val();
    var textQuestionCashAnswer = cashItemObj.Answer ? cashItemObj.Answer : "";
    var textQuestionCashDetails = cashItemObj.CashDetails ? cashItemObj.CashDetails : "0";
    var $emptyQA = null;
    $('#Add_CustomerConsultation .txt-customer-question').toArray().map(el => {
        if (!$emptyQA && !el.value) {
            $emptyQA = $(el)
        }
    });
    if ($emptyQA) {
        txtCustomerQuestion = '';
        $emptyQA.focus();
    }
    if (txtCustomerQuestion == "" || txtCustomerQuestion == null || txtCustomerQuestion == "undefined") {
        layer.msg("客户表达不能为空!");
        return;
    }
    if (txtCustomerQuestion.length > 200) {
        layer.msg("客户表达不能大于200个字符!");
        return;
    }
    var file = document.getElementById("addRecording").files[0];
    if (file == undefined || file == "undefined" || file == "") {

    } else {
        var extStart = file.name.lastIndexOf(".");
        var ext = file.name.substring(extStart, file.name.length).toUpperCase();
        if (ext != ".MP3" && ext != ".MP4" && ext != ".M4A") {
            layer.msg("上传文件格式错误!");
            return;
        }
        if (file.size > 2097152) {
            layer.msg("录音文件不能超过2M!");
            return;
        }
    }

    var formData = new FormData();
    formData.append("txtTaskId", getQueryString("taskid"));
    formData.append("txtCustomerId", getQueryString("Id"));
    formData.append("txtCustomerQuestion", txtCustomerQuestion);
    formData.append("txtMotion", txtMotion);
    formData.append("file", file);
    formData.append("selQuestioning", txtQuestioning);
    formData.append("txtQuestionViedo", txtQuestionViedo);
    formData.append("textQuestionCashAnswer", textQuestionCashAnswer);
    formData.append("CashDetails", textQuestionCashDetails);

    //新增OK
    $.ajax({
        url: '/Admin/CustomerConsultation/Add',
        type: 'POST',
        async: false,
        dataType: "json",
        cache: false,
        contentType: false,
        processData: false,
        mimeType: "multipart/form-data",
        data: formData,
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                bindIngfo();
                GetQuestionLinkCount();
            }
            if (data == "77") {
                layer.msg('质询名称已经存在', { icon: 2 });
                return;
            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}

//修改
function update(SID) {

    motionSelId = "txtEditMotion";
    gifSelId = "gifImagesEdit";

    //清空表单
    $("#Edit_CustomerConsultationform")[0].reset();
    $('#txtEditCustomerQuestion').val('');
    $('#txtQuestionViedo1').val('');
    $('#Edit_CustomerConsultation .customer-qa-list .customer-qa-item:not(:eq(0))').remove();

    //赋值
    $.ajax({
        type: "POST",
        dataType: "json",
        url: '/Admin/CustomerConsultation/GetListById',
        data: { "ID": SID },
        async: false,
        success: function (data) {
            if (data.length > 0) {
                //质询表达
                $("#txtEditCustomerQuestion").val(data[0]["CustomerQuestion"]);
                $('#txtQuestionViedo1').val(data[0]["QuestionVideo"]);
                if (data[0]["QuestionCashAnswer"]) {
                    var _x = data[0]["QuestionCashAnswer"].split(",")
                    var ShowAmount_ = _x[0]
                    var ActualAmount_ = _x[1]
                    $("#CashInfoLabel_").text(`额定${ShowAmount_};实际可兑换${ActualAmount_}`);
                    $("#ShowAmount").val(ShowAmount_)
                    $("#ActualAmount").val(ActualAmount_)
                    GetCashDetailInfo(data[0]["ID"])
                }
               
                EditQAOperation(data[0]["CustomerQuestion"]);
                $("#Recording").text(data[0]["Recording"]);

                //表情及动作
                $("#txtEditMotion").val(data[0]["Motion"]);

                showGifByMotion();

            }
        }
    });
    layer.open({
        title: '设置质询',
        btn: ['确定', '取消'],
        area: ['900px', '500px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Edit_CustomerConsultation"),
        yes: function (index, layero) {
            Edit(SID);

        }
    });
}

//修改 方法
function Edit(SID) {

    var txtCustomerQuestion = $("#txtEditCustomerQuestion").val();//质询表达
    var txtMotion = $("#txtEditMotion option:selected").text();//伴随表情与动作
    var txtQuestionViedo = $("#txtQuestionViedo1").val();
    var textQuestionCashAnswer = cashItemObj.Answer ? cashItemObj.Answer : "";
    var textQuestionCashDetails = cashItemObj.CashDetails ? cashItemObj.CashDetails : "0";
    var $emptyQA = null;
    $('#Edit_CustomerConsultation .txt-customer-question').toArray().map(el => {
        if (!$emptyQA && !el.value) {
            $emptyQA = $(el)
        }
    });
    if ($emptyQA) {
        txtCustomerQuestion = '';
        $emptyQA.focus();
    }

    if (txtCustomerQuestion == "" || txtCustomerQuestion == null || txtCustomerQuestion == "undefined") {
        layer.msg("客户表达不能为空!");
        return;
    }

    var file = document.getElementById("editRecording").files[0];
    if (file == undefined || file == "undefined" || file == "") {

    } else {
        var extStart = file.name.lastIndexOf(".");
        var ext = file.name.substring(extStart, file.name.length).toUpperCase();
        if (ext != ".MP3" && ext != ".MP4" && ext != ".M4A") {
            layer.msg("上传文件格式错误!");
            return;
        }
        if (file.size > 2097152) {
            layer.msg("录音文件不能超过2M!");
            return;
        }
    }

    var formData = new FormData();
    formData.append("txtCustomerQuestion", txtCustomerQuestion);
    formData.append("txtMotion", txtMotion);
    formData.append("file", file);
    formData.append("ID", SID);
    formData.append("txtQuestionViedo", txtQuestionViedo);
    formData.append("textQuestionCashAnswer", textQuestionCashAnswer);
    formData.append("CashDetails", textQuestionCashDetails);
    $.ajax({
        url: '/Admin/CustomerConsultation/Update',
        type: 'POST',
        async: false,
        dataType: "json",
        cache: false,
        contentType: false,
        processData: false,
        mimeType: "multipart/form-data",
        data: formData,
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                bindIngfo();
            }
            if (data == "77") {
                layer.msg('质询名称已经存在', { icon: 2 });
                return;
            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}

//批量删除弹窗
function del_all() {

    var chks = document.getElementsByName('input[]');//name
    var chkstr = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
        }
    }


    if (chkstr.length == 0) {
        layer.alert('请选择要删除的数据！', {
            skin: 'layui-layer-lan'
            , closeBtn: 0
        });
        return;
    }
    //去除逗号
    chkstr = chkstr.substr(0, chkstr.length - 1);

    layer.confirm('您确认要删除选中的质询信息吗？', {
        title: '删除质询',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/CustomerConsultation/Del',
                data: { "Ids": chkstr },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll(AllPage);//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });
                        bindIngfo();
                    }
                    if (data == "99") {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}

//单删除
function del(SID) {
    layer.confirm('您确认要删除选中的质询信息吗？', {
        title: '删除质询信息',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/CustomerConsultation/Del',
                data: { "Ids": SID },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });
                        bindIngfo(AllPage);
                    }
                    if (data == "99") {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}

//质询情况设置
function CustomerConsultationSituationSet(id) {
    window.location.href = "/Admin/CustomerConsultation/SituationSet?Id=" + id;
}

//上移
function Upper_Move(id) {
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Admin/CustomerConsultation/Move?action=Move',
        data: { "Id": id, "Type": "-1", "CustomerId": getQueryString("Id"), "taskid": getQueryString("taskid"), "selQuestioning": $("#selQuestioning option:selected").val() },
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                bindIngfo(AllPage);
            }
            if (data == "-1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('已经是最后一条了', { icon: 1 });
            }
            if (data == "-2") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('已经是第一条了', { icon: 1 });
            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}
//下移
function Lower_Move(id) {
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Admin/CustomerConsultation/Move?action=Move',
        data: { "Id": id, "Type": "+1", "CustomerId": getQueryString("Id"), "taskid": getQueryString("taskid"), "selQuestioning": $("#selQuestioning option:selected").val() },
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                bindIngfo(AllPage);
            }
            if (data == "-1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('已经是最后一条了', { icon: 1 });
            }
            if (data == "-2") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('已经是第一条了', { icon: 1 });
            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}

//根据形象获得伴随表情与动作
function GetMotion() {
    $.ajax({
        url: '/Admin/Customer/GetMotion',
        type: 'POST',
        async: false,
        success: function (data) {
            $("#txtMotion").html("");
            var json = JSON.parse(data);
            var html = "<option value=\"\">请选择</option>";
            for (var i = 0; i < json.length; i++) {
                html += "<option value=\"" + json[i].MotionName + "\">" + json[i].MotionName + "</option>";
            }
            $("#txtMotion").append(html);
        }
    });
}

//根据形象获得伴随表情与动作
function GetEditMotion() {
    $.ajax({
        url: '/Admin/Customer/GetMotion',
        type: 'POST',
        async: false,
        success: function (data) {
            $("#txtEditMotion").html("");
            var json = JSON.parse(data);
            var html = "<option value=\"\">请选择</option>";
            for (var i = 0; i < json.length; i++) {
                html += "<option value=\"" + json[i].MotionName + "\">" + json[i].MotionName + "</option>";
            }
            $("#txtEditMotion").append(html);
        }
    });
}

//设置回答
function Setupanswers(SID) {
    $("input[name='CheckRight']").parent().removeClass('checked');
    //表单清空
    $("#Edit_Setupanswersform")[0].reset();

    //赋值
    $.ajax({
        type: "POST",
        dataType: "json",
        url: '/Admin/CustomerConsultation/GetListById',
        data: { "ID": SID },
        async: false,
        success: function (data) {
            if (data.length > 0) {
                $("#OptionA").val(data[0]["OptionA"]);
                $("#OptionB").val(data[0]["OptionB"]);
                $("#OptionC").val(data[0]["OptionC"]);
                $("#OptionD").val(data[0]["OptionD"]);
                $("#OptionE").val(data[0]["OptionE"]);
                $("#OptionF").val(data[0]["OptionF"]);

                $("#Pictures_A").html(data[0]["Pictures_A"]);
                $("#Pictures_B").html(data[0]["Pictures_B"]);
                $("#Pictures_C").html(data[0]["Pictures_C"]);
                $("#Pictures_D").html(data[0]["Pictures_D"]);
                $("#Pictures_E").html(data[0]["Pictures_E"]);
                $("#Pictures_F").html(data[0]["Pictures_F"]);


                if (data[0]["Answer"] != null) {
                    $("#txtMethods").val(data[0]["Answer"]);
                }
                $("#txtEditQuestion").code(HTMLDecode(data[0]["Analysis"]));
                var RightKey = data[0]["RightKey"] + "";
                var chks = document.getElementsByName('CheckRight');//name
                for (var i = 0; i < chks.length; i++) {
                    if (RightKey.indexOf(chks[i].value) >= 0) {
                        chks[i].checked = true;
                        $(chks[i]).parent().addClass('checked');
                    }
                }

            }
        }
    });

    layer.open({
        title: '设置回答',
        btn: ['确定', '取消'],
        area: ['1000px', '500px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Setupanswers"),
        yes: function (index, layero) {
            UpdateSetupanswers(SID);
        }
    });
}

function Image1(Obj) {
    $(Obj).prev().html($("#Image1").val());

}
function Image2(Obj) {
    $(Obj).prev().html($("#Image2").val());
}
function Image3(Obj) {
    $(Obj).prev().html($("#Image3").val());
}
function Image4(Obj) {
    $(Obj).prev().html($("#Image4").val());
}
function Image5(Obj) {
    $(Obj).prev().html($("#Image5").val());
}
function Image6(Obj) {
    $(Obj).prev().html($("#Image6").val());
}
function editRecording(Obj) {
    $(Obj).prev().html($("#editRecording").val());
}
function addRecording(Obj) {
    $(Obj).prev().html($("#addRecording").val());
}

//执行修改设置回答
function UpdateSetupanswers(SID) {

    var chks = document.getElementsByName('CheckRight');//name
    var chkstr = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
        }
    }
    //去除逗号
    chkstr = chkstr.substr(0, chkstr.length - 1);

    var OptionA = $("#OptionA").val();
    var OptionB = $("#OptionB").val();
    var OptionC = $("#OptionC").val();
    var OptionD = $("#OptionD").val();
    var OptionE = $("#OptionE").val();
    var OptionF = $("#OptionF").val();
    var txtMethods = $("#txtMethods").val();
    var txtEditQuestion = HTMLEncode($('#txtEditQuestion').code());

    var file1 = document.getElementById("Image1").files[0];
    var file2 = document.getElementById("Image2").files[0];
    var file3 = document.getElementById("Image3").files[0];
    var file4 = document.getElementById("Image4").files[0];
    var file5 = document.getElementById("Image5").files[0];
    var file6 = document.getElementById("Image6").files[0];




    if ((file1 == undefined || file1 == "undefined" || file1 == "")

    ) {

    } else {
        var extStart = file1.name.lastIndexOf(".");
        var ext = file1.name.substring(extStart, file1.name.length).toUpperCase();
        if (ext != ".PNG" && ext != ".JPG" && ext != "GIF") {
            layer.msg("上传文件格式错误!");
            return;
        }
        if (file1.size > 2097152) {
            layer.msg("文件不能大于2M!");
            return;
        }
    }

    if ((file2 == undefined || file2 == "undefined" || file2 == "")

    ) {

    } else {
        var extStart = file2.name.lastIndexOf(".");
        var ext = file2.name.substring(extStart, file2.name.length).toUpperCase();
        if (ext != ".PNG" && ext != ".JPG" && ext != "GIF") {
            layer.msg("上传文件格式错误!");
            return;
        }
        if (file2.size > 2097152) {
            layer.msg("文件不能大于2M!");
            return;
        }
    }

    if ((file3 == undefined || file3 == "undefined" || file3 == "")

    ) {

    } else {
        var extStart = file3.name.lastIndexOf(".");
        var ext = file3.name.substring(extStart, file3.name.length).toUpperCase();
        if (ext != ".PNG" && ext != ".JPG" && ext != "GIF") {
            layer.msg("上传文件格式错误!");
            return;
        }
        if (file3.size > 2097152) {
            layer.msg("文件不能大于2M!");
            return;
        }
    }

    if ((file4 == undefined || file4 == "undefined" || file4 == "")

    ) {

    } else {
        var extStart = file4.name.lastIndexOf(".");
        var ext = file4.name.substring(extStart, file4.name.length).toUpperCase();
        if (ext != ".PNG" && ext != ".JPG" && ext != "GIF") {
            layer.msg("上传文件格式错误!");
            return;
        }
        if (file4.size > 2097152) {
            layer.msg("文件不能大于2M!");
            return;
        }
    }

    if ((file5 == undefined || file5 == "undefined" || file5 == "")

    ) {

    } else {
        var extStart = file5.name.lastIndexOf(".");
        var ext = file5.name.substring(extStart, file5.name.length).toUpperCase();
        if (ext != ".PNG" && ext != ".JPG" && ext != "GIF") {
            layer.msg("上传文件格式错误!");
            return;
        }
        if (file5.size > 2097152) {
            layer.msg("文件不能大于2M!");
            return;
        }
    }

    if ((file6 == undefined || file6 == "undefined" || file6 == "")

    ) {

    } else {
        var extStart = file6.name.lastIndexOf(".");
        var ext = file6.name.substring(extStart, file6.name.length).toUpperCase();
        if (ext != ".PNG" && ext != ".JPG" && ext != "GIF") {
            layer.msg("上传文件格式错误!");
            return;
        }
        if (file6.size > 2097152) {
            layer.msg("文件不能大于2M!");
            return;
        }
    }

    var formData = new FormData();
    formData.append("OptionA", OptionA);
    formData.append("OptionB", OptionB);
    formData.append("OptionC", OptionC);
    formData.append("OptionD", OptionD);
    formData.append("OptionE", OptionE);
    formData.append("OptionF", OptionF);

    formData.append("OptionA_Url", file1);
    formData.append("OptionB_Url", file2);
    formData.append("OptionC_Url", file3);
    formData.append("OptionD_Url", file4);
    formData.append("OptionE_Url", file5);
    formData.append("OptionF_Url", file6);


    formData.append("Answer", txtMethods);
    formData.append("Analysis", txtEditQuestion);
    formData.append("ID", SID);
    formData.append("chkstr", chkstr);

    $.ajax({
        url: '/Admin/CustomerConsultation/UpdateSetupanswers',
        type: 'POST',
        async: false,
        dataType: "json",
        cache: false,
        contentType: false,
        processData: false,
        mimeType: "multipart/form-data",
        data: formData,
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                bindIngfo();
            }
            if (data == "77") {
                layer.msg('质询名称已经存在', { icon: 2 });
                return;
            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}

//富文本编辑器API
$(document).ready(function () {

    $('.summernote').summernote({
        lang: 'zh-CN',
        //height: 150,
        maxHeight: 200,
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']]
        ]
    });

});

//获得统计数量
function GetQuestionLinkCount() {
    $.ajax({
        url: '/Admin/CustomerConsultation/GetQuestionLinkCount',
        data: { "taskid": getQueryString("taskId"), "Id": getQueryString("Id") },
        dataType: "text",
        type: "GET",
        success: function (data) {
            var arr = new Array(); //定义一数组 
            data = data.substr(0, data.length - 1);
            arr = data.split(","); //字符分割 

            $("[name=selCount] option")[0].text = "厅堂服务-接待" + "(" + arr[0] + ")";
            $("[name=selCount] option")[1].text = "厅堂服务-分流" + "(" + arr[18] + ")";
            $("[name=selCount] option")[2].text = "厅堂服务-取号" + "(" + arr[1] + ")";
            $("[name=selCount] option")[3].text = "厅堂服务-取号后引导" + "(" + arr[2] + ")";
            $("[name=selCount] option")[4].text = "厅堂服务-填单" + "(" + arr[3] + ")";
            $("[name=selCount] option")[5].text = "厅堂服务-填单后引导" + "(" + arr[4] + ")";
            //$("[name=selCount] option")[6].text = "柜面服务-接待" + "(" + arr[5] + ")";
            //$("[name=selCount] option")[7].text = "柜面服务-单据收取" + "(" + arr[6] + ")";
            //$("[name=selCount] option")[8].text = "柜面服务-证件收取与效验" + "(" + arr[7] + ")";
            //$("[name=selCount] option")[9].text = "柜面服务-现金处理" + "(" + arr[8] + ")";
            //$("[name=selCount] option")[10].text = "柜面服务-柜员填单" + "(" + arr[9] + ")";
            //$("[name=selCount] option")[11].text = "柜面服务-业务办理" + "(" + arr[10] + ")";
            //$("[name=selCount] option")[12].text = "柜面服务-单据打印和盖章" + "(" + arr[11] + ")";
            //$("[name=selCount] option")[13].text = "柜面服务-返还资料" + "(" + arr[12] + ")";
            //$("[name=selCount] option")[14].text = "柜面服务-送别" + "(" + arr[13] + ")";
            $("[name=selCount] option")[6].text = "厅堂服务-送别" + "(" + arr[14] + ")";
           


        }
    });
}

function myfunction() {
    var html = "";
    html += ' <option value="02">厅堂服务-接待</option>'
    html += '    <option value="20">厅堂服务-分流</option>'
    html += '    <option value="03">厅堂服务-取号</option>'
    html += '  <option value="04">厅堂服务-取号后引导</option>'
    html += '   <option value="05">厅堂服务-填单</option>'
    html += '   <option value="06">厅堂服务-填单后引导</option>'
    //html += '   <option value="07">柜面服务-接待</option>'
    //html += '   <option value="08">柜面服务-单据收取</option>'
    //html += '    <option value="09">柜面服务-证件收取与效验</option>'
    //html += '  <option value="10">柜面服务-现金处理</option>'
    //html += '   <option value="11">柜面服务-柜员填单</option>'
    //html += '    <option value="12">柜面服务-业务办理</option>'
    //html += '   <option value="13">柜面服务-单据打印和盖章</option>'
    //html += '  <option value="14">柜面服务-返还资料</option>'
    //html += '  <option value="15">柜面服务-送别</option>'
    html += '  <option value="16">厅堂服务-送别</option>'
   
    $("#selQuestioning").append(html);
}

//新增和编辑对应的是2套控件
var motionSelId = "";
var gifSelId = "";

function showGifByMotion() {
    var AppearanceName = $("#AppearanceName").val();
    if (AppearanceName == "" || AppearanceName == null) {
        AppearanceName = "青年男子";
    }

    var Motion = $(`#${motionSelId}`).val();
    var MotionStr = "sq";
    if (Motion == "悲伤") {
        MotionStr = "bs";
    } else if (Motion == "高兴") {
        MotionStr = "gx";
    } else if (Motion == "生气") {
        MotionStr = "sq";
    } else if (Motion == "痛苦") {
        MotionStr = "tk";
    } else if (Motion == "微笑") {
        MotionStr = "wx";
    } else if (Motion == "厌恶") {
        MotionStr = "yw";
    } else if (Motion == "疑惑") {
        MotionStr = "yh";
    } else if (Motion == "正常") {
        MotionStr = "zc";
    }

    var xingxiang = getXingxiangByAppearance(AppearanceName);//形象区分
    var motionScr = `/Flash/${xingxiang}/zhixun-${MotionStr}.gif`;

    $(`#${gifSelId}`).attr("src", motionScr);

}

function getXingxiangByAppearance(appearance) {
    if (appearance == "青年男子") {
        return 1;
    }
    if (appearance == "青年女子") {
        return 2;
    }
    if (appearance == "中年男子") {
        return 3;
    }
    if (appearance == "中年女子") {
        return 4;
    }
    if (appearance == "老年男子") {
        return 5;
    }
    if (appearance == "老年女子") {
        return 6;
    }
    if (appearance == "外国男子") {
        return 7;
    }
    if (appearance == "外国女子") {
        return 8;
    }
    return 1;
}

function EditQAOperation(str) {
    if (!str) return;
    var list = str.split('|');
    if (list.length) {
        var hm = list.shift().split(':');
        $('#Edit_CustomerConsultation .txt-customer-question:eq(0)').val(hm[1]);
    }
    if (!list.length) return;
    var tmpl = list.map(i => {
        var hm = i.split(':');
        var obj = {
            title: hm[0],
            value: hm[1],
            type: hm[0] === '问' ? 'question' : 'answer'
        };
        return `<div class="customer-qa-item row" style="margin-bottom: 10px;">
            <div class="col-sm-1"> <span>${obj.title}</span>：</div>
            <div class="col-sm-10"><textarea class="form-control txt-customer-question" qatype="${obj.type}" qamode="edit" name="txt" clos=",5" rows="5" warp="virtual" style="margin: 0px; height: 100px;width:100%; resize:none;" placeholder="最长200个字符。" maxlength="200">${obj.value}</textarea></div>
            <div class="col-sm-1"><i class="fa fa-trash m-r-xs" style="color: #337ab7; cursor: pointer;" onclick="delQAItem(this)"></i></div>
        </div>`;
    });
    $('#Edit_CustomerConsultation .customer-qa-list').append(tmpl.join(''));
    $('#Edit_CustomerConsultation .customer-qa-list .txt-customer-question').trigger('input')
}

function changeQAOperation(val, mode) {
    if (!val) return;
    var obj = {
        question: {
            type: val,
            title: "问"
        },
        answer: {
            type: val,
            title: "答"
        }
    }[val];
    var parentId = mode === 'add' ? 'Add_CustomerConsultation' : 'Edit_CustomerConsultation';
    var tmpl = `<div class="customer-qa-item row" style="margin-bottom: 10px;">
        <div class="col-sm-1"> <span>${obj.title}</span>：</div>
        <div class="col-sm-10"><textarea class="form-control txt-customer-question" qatype="${obj.type}" qamode="${mode}" name="txt" clos=",5" rows="5" warp="virtual" style="margin: 0px; height: 100px;width:100%; resize:none;" placeholder="最长200个字符。" maxlength="200"></textarea></div>
        <div class="col-sm-1"><i class="fa fa-trash m-r-xs" style="color: #337ab7; cursor: pointer;" onclick="delQAItem(this)"></i></div>
    </div>`;
    $(`#${parentId} .customer-qa-list`).append(tmpl);
    $(`#${parentId} .customer-QA-operation`).val('').find('option:eq(0)').prop('selected', true);
}

function delQAItem(el) {
    var $list = $(el).parents('.customer-qa-list');
    $(el).parents('.customer-qa-item').remove();
    $list.find('.txt-customer-question:eq(0)').trigger('input');
}


var ShowAmount = '';
//var CounterfeitMoney = '';
//var DamagedMoney ='';
var ActualAmount = '';
var cashItemObj = {};
//编辑收取现金
function EidtCash() {
    cashItemObj = {};
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
            ActualAmount = $("#ActualAmount").val();


            if (ActualAmount < 0) {
                layer.msg('实际可兑付金额不能为负数！', function () { });
                return;
            }
            var Answer = `${ShowAmount},${ActualAmount}`;
            if (ShowAmount == "0" || ShowAmount == "") {
                Answer = "";
            }
            var data = {};
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
            $("#CashInfoLabel").text(`额定${ShowAmount};实际可兑换${ActualAmount}`);
            $("#CashInfoLabel_").text(`额定${ShowAmount};实际可兑换${ActualAmount}`);
            cashItemObj = data
            layer.close(index);
            //$.ajax({
            //    url: '/Admin/CaseManagement/AddOrEditTaskDetail',
            //    Type: "post",
            //    dataType: "json", cache: false,
            //    contentType: "application/json; charset=utf-8",
            //    data: data,
            //    success: function (data) {
            //        if (data > 0) {
            //            $("#CashInfoLabel").text(`额定${ShowAmount};实际可兑换${ActualAmount}`);
            //            layer.msg('保存成功！', function () { });
            //            layer.close(index);
            //        }
            //        else {
            //            layer.msg('保存失败！', function () { });
            //        }
            //    }
            //});




        },
        btn2: function (index, layero) {

            layer.close(index);
        },
        cancel: function (index, layero) {



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