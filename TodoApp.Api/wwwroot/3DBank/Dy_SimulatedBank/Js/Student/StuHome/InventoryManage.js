

var dragIdIndex = 1;

function ClearInventory() {
    dragIdIndex = 1;
    

    $.ajax({
        type: "POST",
        url: "/StuHome/ClearInventoryItem",
        data: { TRId: $("#TotalResultId").val(), TaskId: $("#TaskId").val(), CustomerId: $("#CustomerId").val() },
        async: false,
        dataType: "json",
        success: function (data) {
            if (data == "-1") {
                //layer.msg("未找到该客户操作记录!");
            }
            if (data == "1") {
                $("#wupin_con").empty();
            }

        },
        error: function (error) {

        }
    });

    //清空后台保存的物品栏
    //ajax

}

function DelInventoryItem(value) {

    $.ajax({
        type: "POST",
        url: "/StuHome/DelInventoryItem",
        async: false,
        data: {
            TRId: $("#TotalResultId").val(), TaskId: $("#TaskId").val(), CustomerId: $("#CustomerId").val(),
            ItemValue: value
        },
        dataType: "json",
        success: function (data) {
            if (data == "-1") {
                layer.msg("未找到该客户操作记录!");
            }
            else if (data == "-2") {
                layer.msg("删除物品出错！");
            }
            else if (data == "1") {
                DelItemView(value);
            }

        },
        error: function (error) {

        }
    });

}

function AddInventoryItem(name, value, src) {

    var hasIn = false;
    //判断是否已经有了该物品
    $("#wupin_con").find("div").each(function () {
        if ($(this).data("value") == value) {
            hasIn = true;
        }
    });
    if (hasIn) {
        return;
    }


    $.ajax({
        type: "POST",
        url: "/StuHome/AddInventoryItem",
        async: false,
        data: {
            TRId: $("#TotalResultId").val(), TaskId: $("#TaskId").val(), CustomerId: $("#CustomerId").val(),
            ItemName: name, ItemValue: value, ItemSrc: src
        },
        dataType: "json",
        success: function (data) {
            if (data == "-1") {
                layer.msg("未找到该客户操作记录!");
            }
            else if (data == "-2") {
                layer.msg("添加物品出错！");
            }
            else if (data == "1") {
                AddItemView(name, value, src);
            }

        },
        error: function (error) {

        }
    });
    
}

function AddItemView(name,value,src) {
    var str = `<div class="wu1" data-name="${name}" data-value="${value}" data-type="wupinIngai" draggable="true" ondragstart="dragStart(event)" onclick="LookFormInfo(this)" id="dragIdIndex${dragIdIndex}">
                                    <p><img src="${src}" draggable="false"  style="width:75px;height:80px"/></p>
                                    <p class="m-t-sm danju_name" draggable="false"><span class="m-l-sm  " >${name}</span></p>
                                </div>`;
    $("#wupin_con").append(str)
    dragIdIndex++;

    //特殊处理  个人同城转账/异地汇款凭证
    if (value == "140110") {
        $("#wupin_con>div").each(function () {
            if ($(this).data("value") == "110306") {
                DelInventoryItem("110306");        
            }
        })
        
    }

}

function DelItemView(value) {
    $("#wupin_con>div").each(function () {
        if ($(this).data("value") == value) {
            $(this).remove();
        }
    })
}

function GetInventoryItem() {

    dragIdIndex = 1;


    $.ajax({
        type: "POST",
        url: "/StuHome/GetInventoryItem",
        data: { TRId: $("#TotalResultId").val(), TaskId: $("#TaskId").val(), CustomerId: $("#CustomerId").val() },
        dataType: "json",
        success: function (data) {
            if (data == "-1") {
                //layer.msg("未找到该客户操作记录!");
            }
            else {
                if (Array.isArray(data)) {
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            var item = data[i];
                            AddItemView(item.ItemName, item.ItemValue, item.ItemSrc)
                        }
                    }
                }
            }

        },
        error: function (error) {

        }
    });


}