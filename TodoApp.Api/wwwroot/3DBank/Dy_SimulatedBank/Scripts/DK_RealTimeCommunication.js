$(function () {
    // 声明一个代理引用该集线器,记得$.connection.后面的方法首字母必须要小写,这也是我为什么使用别名的原因
    var chat = $.connection.MsgChat;
  
    //这里是监听消息，当服务端发送消息时可以监听到
    chat.client.BroadMsg = function (Msg) {

        var data = eval('(' + Msg + ')');
       
        //MsgType:消息类型，Attendance：考勤打卡
        if (data[0]["MsgType"] == "Attendance") {
            var params = {};
            params.action = "Attendance";
            params.ClassId = data[0]["ClassId"];

            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/KaoQin/MessagePush.ashx', //提交到一般处理程序请求数据  
                data: params,
                async: false,
                success: function (Data) {
                    if (Data.length > 0) {
                        if (Data == "yes") {
                            //layer.open({
                            //    type: 1,
                            //    closeBtn: 0,//不要关闭按钮
                            //    area: ['600px', '330px'], //宽高
                            //    content: "<div class=\"layui-layer-content\"style=\"height: 260px;\"><div class=\"layui-layer-wrap\"><img style=\"position: fixed; top: -70px; left: 175px;\"src=\"/img/icoimgkaiqi.png\"><div style=\"font-size: 22px; margin-top: 90px; margin-bottom: 50px; text-align: center;\">请点击【签到】完成出勤统计</div><div class=\"text-center\"> <button type=\"button\" onclick=\"PunchTheClock('"+data[0]["ClassId"]+"','"+data[0]["AttendCount"]+"','"+data[0]["AttendID"]+"')\">签到</button></div></div></div>"
                            //});

                            layer.open({
                                type: 1, //Page层类型
                                skin: 'layui-layer-molv', //样式类名
                                area: ['480px', '260px'],
                                offset: ['37%', '37%'],
                                zIndex: layer.zIndex,  //重点1
                                title: false,
                                shade: 0.6, //遮罩透明度
                                maxmin: false, //允许全屏最小化
                                anim: 1, //0-6的动画形式，-1不开启
                                content: "<div id=\"divtishis\" ><img style=\"position: fixed; top: -70px; left: 175px;\" src=\"/img/kaoqin.png\" /><div style=\"font-size: 22px; margin-top: 90px; margin-bottom: 50px; text-align: center;\" id=\"divtitles\">请点击【签到】完成出勤统计</div><div class=\"text-center\"><button class=\"btn btn-danger btn-sm queding\"  type=\"button\" onclick=\"PunchTheClock('" + data[0]["ClassId"] + "','" + data[0]["AttendCount"] + "','" + data[0]["AttendID"] + "')\" style=\"font-size: 18px; padding: 6px 25px;\">签到</button></div></div>",
                            });


                        }
                    }
                }
            });
        }
       
    };
    // 启动连接,这里和1.0也有区别
    $.connection.hub.start().done(function () {

    });
});
//插入考勤记录
function PunchTheClock(ClassId, AttendCount, AttendID) {
    var params = {};
    params.action = "UpdateStare";
    params.Classid = ClassId;
    params.AttendCount = AttendCount;
    params.AttendID = AttendID;
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/KaoQin/MessagePush.ashx', //提交到一般处理程序请求数据  
        data: params,
        success: function (Data) {
            if (Data.length > 0) {
                if (Data != 99) {
                   layer.msg('打卡成功', {
						offset: ['47%', '47%'] 
					});
                    //layer.msg('打卡成功');
                }
            }
        }
    });
    //先关闭考勤窗口
    layer.closeAll();
}

//我知道了
function wzdl() {
    //先关闭考勤窗口
    layer.closeAll();
}
