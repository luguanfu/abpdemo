//初始化
$(function () {
    $('.summernote').summernote({
        lang: 'zh-CN',
        //height: 150,
        maxHeight: 200,
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']]
        ]
    });
    GetAppearanceListByType();
    GetMotion();
    GetListById();
    GetMotionGif();
    
    $("input[name='Recording']").change(function () {
        $(this).prev().html($(this).val());
    });

    $("#AppearanceName").val($("#showName").text());
    if ($("#AppearanceName").val() == "" || $("#AppearanceName").val() == null) {
        $("#gifImages").attr('src', '/busi/RoleHead/zhognniannv.jpg');
    }
    else {
        $("#gifImages").attr('src', '/busi/RoleHead/' + RoleHeadDict[$("#AppearanceName").val()]);
    }

    $("#AppearanceName").change(function () {
        $("#CustomerImage").attr('src', '/busi/RoleHead/' + RoleHeadDict[$(this).val()]);
    })
});
function Recording(Obj) {
    $(Obj).prev().html($("#Recording").val());
}

function GetListById() {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: '/Admin/Customer/GetListById',
        data: { "ID": getQueryString("ID") },
        async: false,
        success: function (data) {
            if (data.length > 0) {
                //客户
                $("#showName").text(data[0]["Appearance"]);

                //出场优先级
                //$("#selCustomerOrder").val(data[0]["CustomerOrder"]);

                //办理业务
                if (data[0]["BusinessType"] != "" && data[0]["BusinessType"] != null) {
                    $("#Appearance").val(data[0]["BusinessType"]);
                    GetListByType();
                    $("#BusinessType").val(data[0]["BusinessId"]);
                }
                $("#EitRecording").text(data[0]["Recording"]);
                //客户开场表达
                $("#txtPrologue").val(data[0]["Prologue"]);
                //案例描述
                $('#CaseDescription').code(HTMLDecode(data[0]["CaseDescription"]));
                //表情动作
                if (data[0]["Motion"] != "" && data[0]["Motion"] != null) {

                    $("#MotionName").val(data[0]["Motion"]);
                }
            }
        }
    });
}

//根据业务类型获得业务
function GetListByType() {

    var typeName = $("#Appearance option:selected").val();
    if (typeName != "undefined") {
        //新增OK
        $.ajax({
            url: '/Admin/Customer/GetListByType',
            type: 'POST',
            data: { "TypeName": typeName },
            async: false,
            success: function (data) {
                $("#BusinessType").empty();
                var json = JSON.parse(data);
                var html = " <option value=\"请选择业务\">请选择业务</option>";
                for (var i = 0; i < json.length; i++) {
                    html += "<option value=\"" + json[i].ID + "\">" + json[i].BusinessName + "</option>";
                }
                $("#BusinessType").append(html);
            }
        });
    }
}

//获得客户形象
function GetAppearanceListByType() {
    $.ajax({
        url: '/Admin/Customer/GetAppearanceListByType',
        type: 'POST',
        data: {},
        async: false,
        success: function (data) {
            $("#AppearanceName").html();
            var json = JSON.parse(data);
            var html = "";
            for (var i = 0; i < json.length; i++) {
                html += "<option value=\"" + json[i].AppearanceName + "\">" + json[i].AppearanceName + "</option>";
            }
            $("#AppearanceName").append(html);
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
            $("#MotionName").html("");
            var json = JSON.parse(data);
            var html = "<option value=\"\">请选择</option>";
            for (var i = 0; i < json.length; i++) {
                html += "<option value=\"" + json[i].MotionName + "\">" + json[i].MotionName + "</option>";
            }
            $("#MotionName").append(html);
        }
    });
}

//获得gif动画图片
function GetMotionGif() {
    var AppearanceName = $("#showName").text();
    var MotionName = $("#MotionName option:selected").val();
    $.ajax({
        url: '/Admin/Customer/GetMotionGif',
        type: 'POST',
        data: { "MotionName": MotionName, "AppearanceName": AppearanceName },
        async: false,
        success: function (data) {

            var json = JSON.parse(data);
            if (json.length > 0) {
                var GifUrl = json[0].GifUrl;
                if (GifUrl != null) {
                    $("#gifImages").attr("src", GifUrl);
                }
            }
        }
    });
}

var RoleHeadDict = {
    "老年男子": "laoniannan.jpg",
    "老年女子": "laoniannv.jpg",
    "青年男子": "qingniannan.jpg",
    "青年女子": "qingniannv.jpg",
    "外国男子": "waiguonan.jpg",
    "外国女子": "waiguonv.jpg",
    "中年男子": "zhongninanan.jpg",
    "中年女子": "zhognniannv.jpg"
}




function ShowAppearance() {
    $("#AppearanceName").val($("#showName").text());
    if ($("#AppearanceName").val() == "" || $("#AppearanceName").val() == null) {
        
        $("#CustomerImage").attr('src', '/busi/RoleHead/zhognniannv.jpg');
    }
    else {
        $("#CustomerImage").attr('src', '/busi/RoleHead/' + RoleHeadDict[$("#AppearanceName").val()]);
    }
  
    layer.open({
        title: '请选择客户形象',
        btn: ['确定', '取消'],
        area: ['800px', '800px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Edit_Appearance"),
        yes: function (index, layero) {
            if ($("#AppearanceName option:selected").text() == "请选择") {
                layer.msg('请选择客户形象');
                return;
            }
            else {
                var AppearanceName = $("#AppearanceName option:selected").text();
                $("#showName").text(AppearanceName);

                layer.closeAll(); //疯狂模式，关闭所有层
                //GetMotion();

                $("#AppearanceName").val($("#showName").text());
                if ($("#AppearanceName").val() == "" || $("#AppearanceName").val() == null) {
                    $("#gifImages").attr('src', '/busi/RoleHead/zhognniannv.jpg');
                }
                else {
                    $("#gifImages").attr('src', '/busi/RoleHead/' + RoleHeadDict[$("#AppearanceName").val()]);
                }

            }
        }
    });
}

//修改 方法
function btnOk() {

    var showName = $("#showName").text();
    //var selCustomerOrder = $("#selCustomerOrder option:selected").val();
    var BusinessType = $("#BusinessType option:selected").val();
    var Appearance = $("#Appearance option:selected").val();
    var txtPrologue = $("#txtPrologue").val();
    var MotionName = $("#MotionName option:selected").text();
    var CaseDescription = HTMLEncode($('#CaseDescription').code());
    var taskid = getQueryString("taskid");

    var file = document.getElementById("Recording").files[0];
    if (file == undefined || file == "undefined" || file == "") {

    } else {
        if (file.size > 2097152) {
            layer.msg("录音文件不能超过2M!");
            return;
        }

        var extStart = file.name.lastIndexOf(".");
        var ext = file.name.substring(extStart, file.name.length).toUpperCase();
        if (ext != ".MP3" && ext != ".MP4" && ext != ".M4A") {
            layer.msg("上传文件格式错误!");
            return;
        }
    }
    //获取下拉框中的值
    var Appearance = $("#Appearance").val();
    var BusinessType = $("#BusinessType").val();

    if (showName.length == "" || showName == "请选择") {
        layer.msg('请选择客户形象');
        return;
    }
    if (Appearance == "请选择业务类型" || BusinessType == "请选择业务") {
        layer.msg('请选择业务类型或业务');
        return;
    }
    if (txtPrologue == "") {
        layer.msg('客户开场表达不能为空');
        return;
    }
    if (MotionName == "请选择") {
        //layer.msg('请选择伴随表情与动作');
        //return;
        MotionName = "";
    }

    var formData = new FormData();
    formData.append("showName", showName);
    //formData.append("selCustomerOrder", selCustomerOrder);
    formData.append("Appearance", Appearance);
    formData.append("BusinessType", BusinessType);
    formData.append("txtPrologue", txtPrologue);
    formData.append("MotionName", MotionName);
    formData.append("ID", getQueryString("ID"));
    formData.append("taskid", taskid);
    formData.append("file", file);//CaseDescription
    formData.append("CaseDescription", CaseDescription);

    $.ajax({
        url: '/Admin/Customer/UpdateSituationSet',
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
                //bindIngfo();
                window.location.href = "/Admin/Customer/Index?taskid=" + getQueryString("taskid");
            }
            //if (data == "77") {
            //    layer.msg('出场优先级已经存在,不能有重复', { icon: 2 });
            //    return;
            //}
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}