$(function () {

    $("input").each(function () {
        $(this).attr("autocomplete", "off");
    })

})

//关闭弹窗
function layerCloseZdy(obj, num) {
    if (num==1) {
        GetPersonalExercises();//内页关闭 触发外层列表加载事件
    }
    var layerDivId = $(obj).parents("div").last().attr("id");
    layer.close(layerDivId.replace("layui-layer", ""));
}



//和unity交互
function RequestByUnity(name) {
    console.log(name);
    if (name.indexOf("zhuguan") >=0) {
        moshi();
    }
    else if (name.indexOf("gonggaolan") >= 0 ) {
        gonggao();
    }
  

}

var isLoad = false;
function initUnity() {
    if (!isLoad) {
        var unityInstance = UnityLoader.instantiate("unityContainer", "/UnityPublish/Build/webGL6.json", { onProgress: UnityProgress });
        isLoad = true;
    }
}


//新增模式选择
function moshi() {
    // 关闭(模式选择)

    moshiindex = layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1050px', '750px'],
        type: 1,
        skin: 'layer-moshi', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#moshi")
    });
}


function jiaoxue() {
    window.open("/StuHome/StudentHome");
}

//公告栏
function gonggao() {
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1050px', '780px'],
        type: 1,
        skin: 'layer-gonggao', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#gonggao") // 更改成公告url  @伍贤成
    });

    //加载公告列表
    GetGonggaoList();

    //加载右侧代办事项
    $.ajax({
        dataType: "json",
        url: '/index_gonggao/Getdaibanshixiang',
        type: 'POST',
        data: {},
        async: false,
        success: function (data) {
            if (data.length > 0) {
                $("#lx_gr").html(data[0]["lx_gr"]);
                $("#lx_td").html(data[0]["lx_td"]);
                $("#zskh").html(data[0]["zskh"]);
                $("#js_gr").html(data[0]["js_gr"]);
                $("#js_td").html(data[0]["js_td"]);
            }

        }
    });
}

//加载公告列表
function GetGonggaoList(page) {
    var PageSize = 4;
    $.ajax({
        url: '/index_gonggao/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: {
            "page": page, "PageSize": PageSize
        },
        success: function (tb) {
            var html = '';
            var TtoSpace = "";//替换为空格
            var data = tb.Tb;//转换table
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var num = data[i]["num"];

                    if (parseInt(num) == 0) {//未读
                        html += ' <li class="weidu" onclick="gonggao_con(' + data[i]["ID"] + ')">';
                    } else {
                        html += ' <li onclick="gonggao_con(' + data[i]["ID"] + ')">';
                    }
                    html += '<label class="yuandian"></label>';
                    html += ' <div class="left_con_rightmap">';
                    html += '<p class="gg_name">';
                    html += '  <a href="#">' + data[i]["NoticeTitle"] + '</a>';
                    html += '</p>';
                    html += '<div class="gg_time">';

                    //来源
                    if (parseInt(data[i]["Types"]) == 2) {
                        if (data[i]["TeacherName"] == null || data[i]["TeacherName"] == "") {
                            html += ' 来自：<span>教师-' + data[i]["LoginNo"] + '</span>';
                        }
                        else {
                            html += ' 来自：<span>教师-' + data[i]["TeacherName"] + '</span>';
                        }
                    } else {
                        //来源管理
                        html += ' 来自：<span>管理员</span>';
                    }
                    

                    TtoSpace = data[i]["ReleaseTime"].substr(0, 19).replace("T", " ");

                    html += '<span class="gg_time_right">' + TtoSpace+'</span>';
                    html += ' </div>';
                    html += ' <div class="gg_con">';

                    //公告内容
                    var txtNoticeContent = data[i]["NoticeContent"] + "";
                  
                    html += txtNoticeContent;
                    html += '</div>';
                    html += '</div>';
                    html += '</li>';
                }
                $("#gonggaotablelist").html(html);
                bootstrapPaginator("#PaginatorLibraryGongGao", tb, GetGonggaoList);//分页
            } 
        }
    });
}


//公告详情
function gonggao_con(NoticeID) {
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['600px', '450px'],
        type: 1,
        skin: 'layer-gonggao', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shade: 0.8,
        shadeClose: false, //开启遮罩关闭
        content: $("#gonggao_con")
    });

    $.ajax({
        type: "POST",
        dataType: "json",
        async: false,
        url: '/index_gonggao/Addready',
        data: { "NoticeID": NoticeID },
        success: function (data) {
            if (data.length>0) {
                var TtoSpace = data[0]["ReleaseTime"].replace("T", " ");
                $("#NoticeTitle").html(data[0]["NoticeTitle"]);
                $("#NoticeTime").html(TtoSpace);
                $("#NoticeContent").html(data[0]["NoticeContent"]);
                //来源
                if (parseInt(data[0]["Types"]) == 2) {
                    if (data[0]["TeacherName"] == null || data[0]["TeacherName"] == "") {
                        $("#lyname").html('来自：教师-' + data[0]["LoginNo"]);
                    }
                    else {
                        $("#lyname").html('来自：教师-' + data[0]["TeacherName"]);
                    }
                } else {
                    //来源管理
                    $("#lyname").html('来自：管理员');
                }
                
            }
            GetGonggaoList();
        }
    })
}

//代办事项练习 快速入口
function tiaozhuan(num) {
  
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1050px', '750px'],
        type: 1,
        skin: 'layer-gonggao', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#zylx")
    });
    GetPersonalExercises(null, num);
    //样式归为
    $(".zylx_tab").find("li").each(function () {
        $(this).removeClass('xuanze');
    });
    //默认第一个
    $(".zylx_tab").find("li").eq(num-1).addClass('xuanze');
   
}

//代办事项比赛 和知识考核
function tiaozhuan2(num) {
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1050px', '750px'],
        type: 1,
        skin: 'layer-gonggao', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#sxkh")
    });
    if (num == 3) {
        //知识考核
        GetKnowledgeAssessment();
    } else {
        TrainingExamination(null, num,2);
    }
    
    //样式归为
    $(".sxkh_tab").find("li").each(function () {
        $(this).removeClass('sxxuanze');
    });
    //默认第一个
    $(".sxkh_tab").find("li").eq(num-1).addClass('sxxuanze');
}




//自由练习
function zylx() {
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1050px', '750px'],
        type: 1,
        skin: 'layer-gonggao', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#zylx")
    });
    GetPersonalExercises(null, 1);
    //样式归为
    $(".zylx_tab").find("li").each(function () {
        $(this).removeClass('xuanze');
    });
    //默认第一个
    $(".zylx_tab").find("li").eq(0).addClass('xuanze');

}

//两个个切换、事件委托方法
$(".zylx_tab").on('click', 'li', function () {
    $('li').removeClass('xuanze');
    $(this).addClass("xuanze");
    //内容显示隐藏
    // $(".zylx_tab_con").removeClass("disBlock")
    // $(".zylx_tab_con").eq($(this).index()).addClass("disBlock");
})

// 关闭(自由练习)
$(".ms_zylx_gb").on("click", function () {
    layer.close(layer.index)
})

//跳转至个人练习--》新增练习
function openToCaseView() {

     layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1050px', '750px'],
        type: 1,
        skin: 'layer-gonggao', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#zylxCaseView")
    });
    GetCaseViewList();//加载列表
}

//实训考核
function kaohe() {
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1050px', '750px'],
        type: 1,
        skin: 'layer-gonggao', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#sxkh")
    });
    TrainingExamination(null, '1',2);
    //样式归为
    $(".sxkh_tab").find("li").each(function () {
        $(this).removeClass('sxxuanze');
    });
    //默认第一个
    $(".sxkh_tab").find("li").eq(0).addClass('sxxuanze');
}

//两个个切换、事件委托方法
$(".sxkh_tab").on('click', 'li', function () {
    $('li').removeClass('sxxuanze');
    $(this).addClass("sxxuanze");

})

//两个个切换、事件委托方法
$(".sxkh_tab").on('click', 'li', function () {
    $('li').removeClass('sxxuanze');
    $(this).addClass("sxxuanze");
   
});

function countdown(time, callback) {
    if (!time || (new Date(time) - new Date() <= 0)) return;
    for (var i = 1; i < 10; i++) {
        clearInterval(i);
    }
    cd();
    $('.countdown_mask').addClass('visible');
    var timer = setInterval(function () {
        if (new Date(time) - new Date() <= 0) {
            clearInterval(timer);
            $('.countdown_mask').removeClass('visible');
            cd = null;
            callback && callback();
        } else {
            cd();
        }
    }, 1000);

    // 算时间
    function cd() {
        //相差的毫秒数
        var ms = Date.parse(time) - Date.parse(new Date());
        var minutes = 1000 * 60;
        var hours = minutes * 60;
        var days = hours * 24;
        var years = days * 365;
        //求出天数
        var d = Math.floor(ms / days);
        //求出除开天数，剩余的毫秒数
        ms %= days;
        var h = Math.floor(ms / hours);
        ms %= hours;
        var m = Math.floor(ms / minutes);
        ms %= minutes;
        var s = Math.floor(ms / 1000);
        $('#time1').text(h < 10 ? ('0' + h) : h);
        $('#time2').text(m < 10 ? ('0' + m) : m);
        $('#time3').text(s < 10 ? ('0' + s) : s);
        // return (d+'天'+h+'时'+m+'分'+s+'秒')
    }
}


