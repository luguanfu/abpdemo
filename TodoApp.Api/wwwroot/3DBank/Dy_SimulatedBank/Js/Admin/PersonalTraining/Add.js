$(document).ready(function () {
    PracticeId = getQueryString("PracticeId");
    AllType = getQueryString("AllType");

    redload();
    BindDll();

    GetListById();
    var config = {
        '.chosen-select': {},
        '.chosen-select-deselect': {
            allow_single_deselect: true
        },
        '.chosen-select-no-single': {
            disable_search_threshold: 10
        },
        '.chosen-select-no-results': {
            no_results_text: 'Oops, nothing found!'
        },
        '.chosen-select-width': {
            width: "95%"
        }
    }
    for (var selector in config) {
        $(selector).chosen(config[selector]);
    }



});

var AllType = "";


function GetListById() {
    $.ajax({
        Type: "post",
        dataType: "json",
        url: '/Admin/PersonalTraining/GetListById?PracticeId=' + PracticeId,
        async: false,
        success: function (data) {
            if (data.length > 0) {


                $("#E_Name").val(data[0]["PracticeName"]);


                var E_TeamId = data[0]["E_TeamId"] + "";
                var addType = data[0]["Type_All"];
                var PracticeLong = data[0]["PracticeLong"];
                var teamarr = E_TeamId.split(',');
                $("#AddTeamId").val(teamarr);
                $("#addType").val(addType);
                var StartTime = data[0]["PracticeStarTime"] + "";
                var EndTime = data[0]["EndTime"] + "";
                $("#StartTime").val(StartTime.replace('T', ' '));
                $("#EndTime").val(EndTime.replace('T', ' '));
                $("#PracticeLong").val(PracticeLong);

            }
        }
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

//新增保存
function AddBtnSubim() {

    var EName = $("#E_Name").val();
    var StartTime = $("#StartTime").val();
    var EndTime = $("#EndTime").val();
    var PracticeLong = $("#PracticeLong").val();
    var AddE_TeamId = $("#AddTeamId").val();
    var addType = $("#addType").val();
    if (EName.length == 0) {
        layer.msg('请填写考核名称！', function () { });
        return false;
    }
    if (EName.length > 20) {
        layer.msg('考核名称长度不能超过20个汉字！', function () { });
        return false;
    }
    if (PracticeLong.length == 0) {
        layer.msg('请设置练习时长！', function () { });
        return false;
    }

    if (AddE_TeamId.length == 0) {
        layer.msg('请选择分配班级！', function () { });
        return false;
    }
    if (addType === "0") {
        layer.msg('请选择竞赛模式！', function () { });
        return false;
    }
    AddE_TeamId = "," + AddE_TeamId + ",";


    if (StartTime.length == 0) {
        layer.msg('请设置考试开始时间！', function () { }); return false;

    }
    if (EndTime.length == 0) {
        layer.msg('请设置考试结束时间！', function () { }); return false;

    }
    var t1 = new Date(StartTime);
    var t2 = new Date(EndTime);
    if (t1 > t2) {
        layer.msg('考试开始时间不能大于结束时间！', function () { });
        return false;
    }

    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Admin/PersonalTraining/AddInfo',
        data: { "EName": EName, "StartTime": StartTime, "EndTime": EndTime, "AddE_TeamId": AddE_TeamId, "AllType": getQueryString("AllType"), "PracticeId": PracticeId, "addType": addType, "PracticeLong": PracticeLong },
        success: function (data) {
            if (parseInt(data) > 0) {
                if (PracticeId == 0) {
                    PracticeId = parseInt(data);//赋值刚才新增的ID
                }


                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1, time: 800 }, function () {
                    window.location.href = "/Admin/PersonalTraining/AddTraining?PracticeId=" + PracticeId + "&AllType=" + AllType;
                    //window.location.href = "/Admin/PersonalTraining/Index?AllType=" + AllType;
                });
            }
            if (data == "-88") {
                layer.msg('考核名称已经存在！', { icon: 2 });
                return;
            }
            if (data == "-99") {
                layer.msg('添加失败', { icon: 2 });
                return;
            }
            if (data == "0") {
                layer.msg('添加失败', { icon: 2 });
                return;
            }

        }
    });

}

////绑定班级下拉框
function BindDll() {
    $.ajax({
        url: '/Admin/HB_Examination/GetListTeam',
        type: 'POST',
        dataType: 'json',
        async: false,
        success: function (data) {
            var html = '<option value="">请选择班级</option>';
            if (data != null) {
                for (var i = 0; i < data.length; i++) {
                    html += '<option value="' + data[i]["C_ID"] + '">' + data[i]["ClassName"] + '</option>';
                }
            }
            $("#AddTeamId").html(html);
        }
    })

}

//返回
function AddFormRest() {
    window.location.href = '/Admin/PersonalTraining/Index?AllType=' + getQueryString("AllType");
}

var PracticeId = 0;
//内容设置
function bet() {
    if (PracticeId == 0) {
        layer.msg('请先保存基本信息', { icon: 2 });
        return;
    }
    window.location.href = "/Admin/PersonalTraining/AddTraining?PracticeId=" + PracticeId + "&AllType=" + getQueryString("AllType");
    return;
}


function DeleteClassInfo() {
    var chks = document.getElementsByName('input[]');//name
    var ids = "";
    var ds = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            ids += chks[i].value + ",";
            ds += $(chks[i]).attr("data_enabledstate");
        }
    }

    if (ids.length == 0) {
        layer.alert('请至少选择一个班级！', {
            skin: 'layui-layer-lan'
            , closeBtn: 0
        });
        return;
    }
    //去除逗号
    ids = ids.substr(0, ids.length - 1);
    $.ajax({
        url: '/Admin/PersonalTraining/DeletePracticeClass',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "Ids": ids },
        success: function (tb) {
            if (tb == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('删除成功', { icon: 1, time: 800 }, function () {
                    TrainingClassList();
                });
            }
            else {
                layer.msg('删除失败！', { icon: 2 });
                return;
            }
            //样式重新加载
            redload();
        }
    });

}

