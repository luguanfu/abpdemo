//质询处理  学生端js


var InquiriesList;
var selInquiriesIndex;

//获取当前环节下的质询
function getInquiriesByLinkId(linkid) {

    //因为质询需要出现在环节结束后 所以要获取前一个环节下的质询 
    linkid = linkid == 2.5 ? 20 : linkid;//- 1
    var CustomerId = $("#CustomerId").val();

    $.ajax({
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "/StuHome/GetInquiriesByLinkId",//url
        data: { CustomerId: CustomerId, LinkId: linkid },
        success: function (data) {
            InquiriesList = data;
            //checkAskImgOnOff();
        },
        error: function (result) {

        }
    });
}

function closeAskIma() {
    $("#askImg").hide();
}

function checkAskImgOnOff() {
    $("#askImg").hide();
    for (var i = 0; i < InquiriesList.length; i++) {
        var item = InquiriesList[i];
        if (item.hasDo == undefined || item.hasDo == 0) {
            $("#askImg").show();
        }
    }
}


var forlist = ["A", "B", "C", "D", "E", "F"];
function askImgClick(str) {
    var inquirie = null;
    str = str.replace(/^问:/, "");
    str = str.replace(/^答:/, "")
    for (var i = 0; i < InquiriesList.length; i++) {
        var item = InquiriesList[i];
        if (item.hasDo == undefined || item.hasDo == 0) {
            inquirie = item;
            selInquiriesIndex = i;
            break;
        } else {
            inquirie = InquiriesList[quiriesIndex]
        }
    }

    if (inquirie == null) {
        layer.msg("找不到未做质询！");
        return;
    }
    if (document.getElementById("audioPlayBg")) {
        document.getElementById("audioPlayBg").pause()
    }
   
    //播放质询声音
    var Recording = inquirie.Recording;
    if (Recording != null && Recording.length > 0) {
        //playSound(Recording, 0);
        $("#audio_zixun_box").show();
        $("#audio_zixun").attr(`src`, Recording);
        document.getElementById("audio_zixun").play().then((data) => {
            if (document.getElementById("audioPlayBg")) {
                document.getElementById("audioPlayBg").pause()
            }
        }).catch((data) => {
            $("#audio_zixun").click();
            setTimeout(function () {
                if (document.getElementById("audioPlayBg")) {
                    document.getElementById("audioPlayBg").pause()
                }
                document.getElementById("audio_zixun").play();
            }, 1000);
        });
    } else {
        $("#audio_zixun_box").hide();
    }

    var Motion = inquirie.Motion;
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

    var xingxiang = getXingxiangByAppearance();//形象区分
    var motionScr = `/Flash/${xingxiang}/zhixun-${MotionStr}.gif`;

    $("#zhixun_motion").attr("src", motionScr);
    if (InquiriesList[quiriesIndex] && InquiriesList[quiriesIndex].QuestionVideo) {
        $("#video_zixun_box").show();
        $("#video_zixun").empty().append(`<source src = "${InquiriesList[quiriesIndex].QuestionVideo}" type = "video/mp4">`);
        document.getElementById("video_zixun").play().then((data) => {
            if (document.getElementById("audioPlayBg")) {
                document.getElementById("audioPlayBg").pause()
            }
        }).catch((data) => {
            $("#video_zixun").click();
            setTimeout(function () {
                if (document.getElementById("audioPlayBg")) {
                    document.getElementById("audioPlayBg").pause()
                }
                document.getElementById("video_zixun").play();
            }, 1000);
        });
    } else {
        $("#video_zixun").empty()
        $("#video_zixun_box").hide();
    }

    if (InquiriesList[quiriesIndex] && InquiriesList[quiriesIndex].QuestionCashAnswer) {
        $("#cashMoeny").show();
        LoadDiscernCashDetailInfo()
    } else {
        $("#cashMoeny").hide();
    }


    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['800px', '750px'],
        type: 1,
        skin: 'layer-shouqian', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shade: 0.8,
        shadeClose: false, //开启遮罩关闭
        content: $("#huidajiezhi"),
        end: function () {
            //一条代表一个问答
            AnswerInquirie()
            if (document.getElementById("audioPlayBg")) {
                document.getElementById("audioPlayBg").play()
            }
            if (document.getElementById("audio_zixun")) {
                document.getElementById("audio_zixun").pause();
            }
            if (document.getElementById("video_zixun")) {
                document.getElementById("video_zixun").pause();

            }
            
        }
    });


    
    $("#InquiryId").val(inquirie.ID);
    $("#CustomerQuestion").text(str);

    for (var i = 0; i < forlist.length; i++) {
        var zmindex = forlist[i];
        $(`#xuan${zmindex}`).prop("checked", false);
        var option = inquirie[`Option${zmindex}`];
        var url = inquirie[`Option${zmindex}_Url`];
        if (option == null || option == "") {
            $(`#zxdiv${zmindex}`).hide();
        }
        else {
            $(`#zxdiv${zmindex}`).show();
            $(`#Option${zmindex}`).text(option);
            $(`#Option${zmindex}_Url`).attr("src",url);
        }

    }



    
}

function nextInquiries() {
    quiriesIndex++;
    if (InquiriesList[quiriesIndex]) {
        var str = InquiriesList[quiriesIndex].CustomerQuestion
        strIndex = 0;
        strArrat = str.split("|");
        lastIndex = strArrat.length;
        if (lastIndex == 1) {
            askImgClick(strArrat[strIndex])
        } else {
            alertS(strArrat[strIndex])
        }
    } else {
        quiriesIndex = 0;
        method(...rests);
    }
}

function AnswerInquirie() {

    var data = getBaseSubmitInfo();
    data["Types"] = "3";
    data["InquiryId"] = $("#InquiryId").val();
    data["LinkId"] = $("#LinkId").val() == 2.5 ? 20:$("#LinkId").val();
    data["OperationName"] = "质询";
    
    var selList = [];
    for (var i = 0; i < forlist.length; i++) {
        var zmindex = forlist[i];
        if ($(`#xuan${zmindex}`).prop("checked")) {
            selList.push(zmindex);
        }
    }


    data["StuOperationalAnswers"] = selList.join(",");
    StudentInquirieSubmit(data, AnswerInquirieBack);
}

function AnswerInquirieBack(result) {
    layer.closeAll();
    if (result == "1" || result == "2") {
        InquiriesList[selInquiriesIndex].hasDo = 1;
        //checkAskImgOnOff();
        nextInquiries()
    } else if (result == "3") {
        jieguoAlert(askImgClick, "操作不正确，请重新选择", "已出错")
    }
}



function GetInquiryAnalysisById(Id) {

    for (var i = 0; i < InquiriesList.length; i++) {
        var item = InquiriesList[i];
        if (item.ID == Id) {
            return item.Analysis;
        }
    }
    return "";

}
var openMoenyHanlderIndex = null;


