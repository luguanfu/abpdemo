
$(function () {
    var sceneid = $("#sceneid").val();
    $(`#Scene${sceneid}`).show();
    $("#scenename").text(SceneNameArr[sceneid - 1]);

    GetCapabilityModelList();
    GetList();
});



//复选框
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

var lastpage;
function GetList(page) {
    lastpage = page;

    var sceneid = $("#sceneid").val();
    if (sceneid == "1") {
        GetSceneAbilityScoreList(-1);
        return;
    }
    else if (sceneid == "4") {
        GetSceneAbilityScoreList(-2);
        return;
    }

    $.ajax({
        url: '/Admin/AbilityScoreSet/GetSceneCustomerList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "TaskId": $("#taskid").val(), "SceneId": sceneid, "Page": page },
        success: function (tb) {
            var data = tb.Tb;//转换table
            if (data.length > 0)
            {
                $(`#kehuindex${sceneid}`).text(`客户${tb.PageIndex}`);
                $(`#kehuming${sceneid}`).text(data[0].CustomerName);
                $(`#kehuyewu${sceneid}`).text(data[0].BusinessName);
                GetSceneAbilityScoreList(data[0].CustomerId);
            }

            bootstrapPaginator(`#PaginatorLibrary${$("#sceneid").val()}`, tb, GetList);//分页
            


        }
    });
    


    return;

    
}

var CustomerId = "0";
function GetSceneAbilityScoreList(customerId)
{
    
    $.ajax({
        url: '/Admin/AbilityScoreSet/GetSceneAbilityScoreList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "TaskId": $("#taskid").val(), "SceneId": $("#sceneid").val(), "CustomerId": customerId },
        success: function (data) {
            CustomerId = customerId;
            var html = '';

            var taskDetailList = {};
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (!(item.SubLinkId in taskDetailList)) {
                    taskDetailList[item.SubLinkId] = {};
                }
                if (!(item.OperationName in taskDetailList[item.SubLinkId])) {
                    taskDetailList[item.SubLinkId][item.OperationName] = [];
                }
                taskDetailList[item.SubLinkId][item.OperationName].push(item);


            }
            console.log(taskDetailList);
            var i = 0;
            var j = 0;
            for (var link in taskDetailList) {
                var linkitem = taskDetailList[link];
                j = 0;
                for (var oper in linkitem) {
                    var operitem = linkitem[oper];
                    for (var k in operitem) {
                        var item = operitem[k];

                        var baseString = '';

                        var lie1 = '<td rowspan="{SpanCount}"><input type="checkbox" class="i-checks" name="input[]" value="{SubLinkId}"></td>';
                        var lie2 = '<td rowspan="{SpanCount}">{LinkName}</td>';
                        var lie3 = '<td rowspan="{SpanCount2}" class="{TextColor}">{OperationName}</td>'
                        //text-navy
                        //text-danger
                        var lie4 = '<td>{Answer}</td>'
                        var lie5 = '<td>{AbilityString}</td>'
                        var lie6 = '<td><button data-taskdetailid="{TaskDetailId}" onclick="GoEdit(this)" class="btn btn-success btn-sm  m-r-sm" type="button"><i class="fa fa-pencil m-r-xs"></i><span class="bold">编辑</span></button></td>'

                        var TextColor = "text-navy";
                        

                        var Answer = item.Answer;
                        if (item.Types == "1") {

                        } else if (item.Types == "2") {
                            Answer = item.TMName;
                        } else if (item.Types == "3") {
                            TextColor = "text-danger";
                            if (item.InquiryAnswer == null) {
                                item.InquiryAnswer = "-";
                            }
                            Answer = `${item.CustomerQuestion}:${item.InquiryAnswer}`;
                        }


                        baseString += '<tr>';
                        if (j == 0 && k == 0) {
                            baseString += lie1;
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
                            TextColor: TextColor
                        });


                    }

                    j++;
                }

                i++;
            }

            $(`#tbody${$("#sceneid").val()}`).html(html);

            redload();


        }
    });
}

var CapabilityModelTb;
var CapabilityModelOptions = '';
function GetCapabilityModelList() {

    $.ajax({
        url: '/Admin/AbilityScoreSet/GetCapabilityModelList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { },
        success: function (tb) {
            CapabilityModelTb = tb;
            CapabilityModelOptions = `<option value="">请选择</option>`;
            for (var i = 0; i < CapabilityModelTb.length; i++) {
                var item = CapabilityModelTb[i];
                CapabilityModelOptions += `<option value="${item.AbilityId}">${item.AbilityName}</option>`;
            }
        }
    });
}


function GoEdit(obj)
{
    var taskdetailid = $(obj).data("taskdetailid");
    $("#TaskDetailId").val(taskdetailid);
    $("#SetAbilityType").val(0);
    OpenSetWindow(0, taskdetailid);
}

function OpenSetWindow(type, taskdetailid) {
    if (type == 0) {
        $("#abilityScoreRows").empty();
        $.ajax({
            url: '/Admin/AbilityScoreSet/GetCapabilityScoreByTaskDetailId',
            Type: "post",
            dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            data: { TaskDetailId: taskdetailid },
            success: function (tb) {
                if (tb.length > 0) {
                    for (var i in tb) {
                        var item = tb[i];
                        addScoreSetRow(item.AbilityId, item.AbilityScores);
                    }
                }
                else {
                    addScoreSetRow();
                }

                layer.open({
                    title: '设置能力',
                    btn: ['确定', '取消'],
                    area: ['450px', '360px'],
                    type: 1,
                    skin: 'layui-layer-lan', //样式类名
                    closeBtn: 1, //显示关闭按钮
                    anim: 2,
                    shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
                    content: $("#SetAbilityScoresDiv"),
                    yes: function (index, layero) {

                        SetCapabilityScoreByTaskDetailId();
                    }
                });


            }
        });
    }
    else if (type == 1 || type == 2 || type == 3) {
        $("#abilityScoreRows").empty();
        addScoreSetRow();
        layer.open({
            title: '设置能力',
            btn: ['确定', '取消'],
            area: ['450px', '360px'],
            type: 1,
            skin: 'layui-layer-lan', //样式类名
            closeBtn: 1, //显示关闭按钮
            anim: 2,
            shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
            content: $("#SetAbilityScoresDiv"),
            yes: function (index, layero) {

                confirmBatchAbilitySet();
            }
        });

    }
}




function addScoreSetRow(aid, ascore) {
    if (aid == null) {
        aid = "";
        ascore = "";
    }

    var baseString = `<div class="col-sm-12"><div class="col-sm-4">
                <div class="form-horizontal  m-t-lg">
                    <select class="form-control input-s-sm inline" name="abilitySelect" value="{AId}">{Options}</select>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="form-horizontal  m-t-lg">
                    <input autocomplete="off" type="number" class="form-control" name="abilityScore" name="" placeholder="请输入分值" value="{AScore}">
                </div>
            </div>
            <div class="col-sm-4">
                <div class="form-horizontal  m-t-lg">
                    <input onclick="addScoreSetRow()" type="button" id="btnZoomIn" class="Btnsty_peyton" value="+">
                    <input onclick="dllScoreSetRow(this)" type="button" id="btnZoomOut" class="Btnsty_peyton" value="-">
                </div>
            </div></div>`;

    var addHtml = baseString.format({
        AId: aid,
        Options: CapabilityModelOptions,
        AScore: ascore
    });

    $("#abilityScoreRows").append(addHtml);
    $("#abilityScoreRows").children("div:last-child").find("select").val(aid);

}

function dllScoreSetRow(obj) {
    $(obj).parent().parent().parent().remove();
    if ($("#abilityScoreRows").children().length == 0) {
        addScoreSetRow();
    }
}

function SetCapabilityScoreByTaskDetailId() {

    var TaskDetailId = $("#TaskDetailId").val();

    var rowIndex = 1;
    var hasError = 0;
    var AbilityScoreData = [];
    $("#abilityScoreRows").find("select[name='abilitySelect']").each(function () {
        var AbilityId = $(this).val();
        if (AbilityId == "") {
            hasError = 1;
            return false;
        }
        var AbilityScore = $(this).parent().parent().next().find("input[name=abilityScore]").val();
        if (!Number.isInteger(Number(AbilityScore)) || Number(AbilityScore)<=0) {
            hasError = 2;
            return false;
        }
        AbilityScoreData.push({ AbilityId: AbilityId, AbilityScore: AbilityScore });
        rowIndex++;
    });

    if (hasError != 0) {
        if (hasError == 1) {
            layer.msg(`第${rowIndex}行能力选项有误！`, { icon: 2 });
        } else {
            layer.msg(`第${rowIndex}行能力分值有误！`, { icon: 2 });
        }
        return;
    }


    $.ajax({
        url: '/Admin/AbilityScoreSet/SetCapabilityScoreByTaskDetailId',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { TaskDetailId: TaskDetailId, AbilityScoreData: JSON.stringify(AbilityScoreData)},
        success: function (data) {

            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                GetList(lastpage);
            }
            else
            {
                layer.msg('操作失败', { icon: 2 });
                return;
            }



        }
    });

}


//清空能力分设置
function clearAbilitySet()
{


    var chkstr = getCheckIds();
    if (chkstr.length == 0) {
        layer.alert('请选择要操作的数据！', {
            skin: 'layui-layer-lan'
            , closeBtn: 0
        });
        return;
    }

    

    layer.confirm('您确认要清空选中的数据吗？', {
        title: '清空能力分设置',
        btn: ['确定清空', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        
        function () {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: '/Admin/AbilityScoreSet/ClearAbilitySet',
                data: { "SubLinkIds": chkstr, "CustomerId": CustomerId },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });
                        GetList(lastpage);
                    }
                    else{
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}

//批量能力分设置
function batchAbilitySet() {

    var chkstr = getCheckIds();
    if (chkstr.length == 0) {
        layer.alert('请选择要操作的数据！', {
            skin: 'layui-layer-lan'
            , closeBtn: 0
        });
        return;
    }
    $("#SetAbilityType").val(1);
    OpenSetWindow(1);
}
//批量能力分设置
function batchAbilitySetOperate() {
    $("#SetAbilityType").val(2);
    OpenSetWindow(2);
}
//批量能力分设置
function batchAbilitySetInquiry() {
    $("#SetAbilityType").val(3);
    OpenSetWindow(3);
}

function confirmBatchAbilitySet() {
    var type = $("#SetAbilityType").val();
    if (type == 1) {
        var chkstr = getCheckIds();
        if (chkstr.length == 0) {
            layer.alert('请选择要操作的数据！', {
                skin: 'layui-layer-lan'
                , closeBtn: 0
            });
            return;
        }
        var TaskDetailId = $("#TaskDetailId").val();

        var rowIndex = 1;
        var hasError = 0;
        var AbilityScoreData = [];
        $("#abilityScoreRows").find("select[name='abilitySelect']").each(function () {
            var AbilityId = $(this).val();
            if (AbilityId == "") {
                hasError = 1;
                return false;
            }
            var AbilityScore = $(this).parent().parent().next().find("input[name=abilityScore]").val();
            if (!Number.isInteger(Number(AbilityScore)) || AbilityScore == "0") {
                hasError = 2;
                return false;
            }
            AbilityScoreData.push({ AbilityId: AbilityId, AbilityScore: AbilityScore });
            rowIndex++;
        });

        if (hasError != 0) {
            if (hasError == 1) {
                layer.msg(`第${rowIndex}行能力选项有误！`, { icon: 2 });
            } else {
                layer.msg(`第${rowIndex}行能力分值有误！`, { icon: 2 });
            }
            return;
        }
        $.ajax({
            type: "POST",
            dataType: "json",
            url: '/Admin/AbilityScoreSet/BatchAbilitySet',
            data: { "SubLinkIds": chkstr, "CustomerId": CustomerId, AbilityScoreData: JSON.stringify(AbilityScoreData) },//多个Id
            success: function (data) {
                if (data == "1") {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg('操作成功', { icon: 1 });
                    GetList(lastpage);
                }
                else {
                    layer.msg('操作失败', { icon: 2 });
                    return;
                }

            }
        })
    }
    else {
        var rowIndex = 1;
        var hasError = 0;
        var AbilityScoreData = [];
        $("#abilityScoreRows").find("select[name='abilitySelect']").each(function () {
            var AbilityId = $(this).val();
            if (AbilityId == "") {
                hasError = 1;
                return false;
            }
            var AbilityScore = $(this).parent().parent().next().find("input[name=abilityScore]").val();
            if (!Number.isInteger(Number(AbilityScore)) || AbilityScore == "0") {
                hasError = 2;
                return false;
            }
            AbilityScoreData.push({ AbilityId: AbilityId, AbilityScore: AbilityScore });
            rowIndex++;
        });

        if (hasError != 0) {
            if (hasError == 1) {
                layer.msg(`第${rowIndex}行能力选项有误！`, { icon: 2 });
            } else {
                layer.msg(`第${rowIndex}行能力分值有误！`, { icon: 2 });
            }
            return;
        }
        $.ajax({
            type: "POST",
            dataType: "json",
            url: '/Admin/AbilityScoreSet/BatchAbilitySet',
            data: { "Type": type, "SceneId": $("#sceneid").val(), "CustomerId": CustomerId, AbilityScoreData: JSON.stringify(AbilityScoreData) },//多个Id
            success: function (data) {
                if (data == "1") {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg('操作成功', { icon: 1 });
                    GetList(lastpage);
                }
                else {
                    layer.msg('操作失败', { icon: 2 });
                    return;
                }

            }
        })

    }
}



function getCheckIds() {
    var chks = document.getElementsByName('input[]');//name
    var chkstr = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
        }
    }
  
    //去除逗号
    chkstr = chkstr.substr(0, chkstr.length - 1);
    return chkstr;
}
