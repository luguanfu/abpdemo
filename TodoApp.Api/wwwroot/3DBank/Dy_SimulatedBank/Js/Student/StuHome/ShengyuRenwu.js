$(function () {

    $.ajax({
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "/StuHome/GetShengyuRenwuInfo",//url
        data: { TaskId: $("#TaskId").val(), CustomerId: $("#CustomerId").val()},
        success: function (data) {

            var LinkId = $("#LinkId").val();
            var TotalCustomer = data.TotalCustomer;
            var LeftCustomer = data.LeftCustomer;
            var StartScene = data.StartScene;
            var EndScene = data.EndScene;

            var syrw_kaigong = "";
            var syrw_daichulikehu = "";
            var syrw_wangong = "";

            if (LinkId <= 1) {
                syrw_kaigong = "0/1";
                syrw_wangong = "0/1";
                syrw_daichulikehu = `0/${TotalCustomer}`;

            } else if (LinkId >= 17) {
                syrw_kaigong = "1/1";
                syrw_wangong = "0/1";
                syrw_daichulikehu = `${TotalCustomer}/${TotalCustomer}`;
            } else {
                syrw_kaigong = "1/1";
                syrw_wangong = "0/1";
                syrw_daichulikehu = `${LeftCustomer}/${TotalCustomer}`;
            }

            if (StartScene == "0") {
                syrw_kaigong = "未开启";
            }
            if (EndScene == "0") {
                syrw_wangong = "未开启";
            }



            $("#syrw_kaigong").text(syrw_kaigong);
            $("#syrw_daichulikehu").text(syrw_daichulikehu);
            $("#syrw_wangong").text(syrw_wangong);


            
        },
        error: function (result) {
          
        }
    });

    // 关闭(任务数量)
    $(".rwsl_gb").on("click", function () {
        $(".rwsl_map").hide();
    })

});

//任务数量弹窗控制
function rwslmap(t) {
    //$(".rwsl_map").show();
    //var open = t.dataset.open
    //if (open == "on") {
    //    $("#renwuminxiang").show();
    //    t.dataset.open = "off"
    //} else {
    //    $("#renwuminxiang").hide();
    //    t.dataset.open = "on"
    //}
    window.open(`/StuHome/CaseDescription?CustomerId=${$("#CustomerId").val()}`, '_blank', 'width=500,height=400');
}

