var isokDU = true;
function showjindutiao(linkid) {
    $("div[name='jindutiao']").each(function () {
        $(this).removeClass();
        $(this).addClass("ztweizhi");
        var eleVal = $(this).data("jindu");
        var jindutiao = $(this).parent().next();
        jindutiao.removeClass();
        jindutiao.addClass("jd_right");

        if (eleVal < linkid && isokDU) {
            $(this).addClass("zt_lan");
            jindutiao.addClass("jd_ok");
        } else if (eleVal > linkid) {

        }else {
            $(this).addClass("zt_huang");
        }
    });
    updateTaskCount(linkid);
}



function kouchumanyidu() {
    var TRId = $("#TotalResultId").val();
    var ExamId = $("#ExamId").val();
    var TaskId = $("#TaskId").val();
    var CustomerId = $("#CustomerId").val();

    var data = {};
    data.TRId = TRId;
    data.ExamId = ExamId;
    data.TaskId = TaskId;
    data.CustomerId = CustomerId;
    return;
    $.ajax({
        type: "POST",
        url: "/StuHome/DeductSatisfaction",
        data: data,
        dataType: "json",
        success: function (data) {
            if (data >= 0) {
                $("#manyidu").text(data);
            }
            else {
                //layer.msg('请先接待客户', { icon: 2 });
                layer.msg('请选择对应任务', { icon: 2 });
            }
        },
        error: function (error) {
            layer.msg('满意度请求失败', { icon: 2 });
        }
    });



}

function updateTaskCount(linkid) {
    //$("#currTaskCount").text(Number($("#currTaskCount").text())+1);
    var taskCount = 0;
    if (linkid <= 1) {
        taskCount = linkid - 1;
    }
    else if (linkid <= 6) {
        taskCount = linkid - 2;
    }
    else if (linkid <= 15) {
        taskCount = linkid - 7;
        if ((customerInfo.BusinessType && customerInfo.BusinessType.trim() == "对公业务") && linkid > 11) {
            taskCount--;
        }
    }
    else if (linkid <= 16) {
        taskCount = linkid - 15 + 5 -1;
    }
    else if (linkid <= 17) {
        taskCount = linkid - 17;
    }
    else {
        taskCount = 1;
    }
    //$("#currTaskCount").text(taskCount);
}