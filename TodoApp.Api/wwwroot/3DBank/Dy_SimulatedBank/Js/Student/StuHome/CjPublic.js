var divShow = false;



$(function () {

    LoadKechengButton();

    $("#wupin_btn").click(function () {
        var wpnumber = $("#wupin_con").outerWidth();
        var thisObj = $("#wupinlan");
        if (divShow) {
            thisObj.each(function () {
                $(this).animate({
                    left: "0"
                }, 300);
            });
            divShow = false;
        } else {
            thisObj.each(function () {
                $(this).animate({
                    left: wpnumber
                }, 300);
            });
            divShow = true;
        }
    });

    $(".jd_btn").click(function () {
        $("#jd_con").slideToggle("slow");
        $(this).toggleClass("qie");
        return false;
    });

    //两个个切换、事件委托方法
    $(".shezhi_ul").on('click', 'li', function () {
        $('li').removeClass('szxuan');
        $(this).addClass("szxuan");
        //内容显示隐藏
        $(".sehzhi_tab").removeClass("disBlock")
        $(".sehzhi_tab").eq($(this).index()).addClass("disBlock");
        $(".xt_out_map").show();
        $(".cssz_map").show();
    })

    // 关闭(退出系统)
    $(".tcxt_gb").on("click", function () {
        $(".xt_out_map").hide();
        $('li').removeClass('szxuan');
    })

    // 关闭(参数设置)
    $(".cssz_gb").on("click", function () {
        $(".cssz_map").hide();
        $('li').removeClass('szxuan');
    })




    // 关闭(学习进度)
    $(".ms_xxjd_gb").on("click", function () {
        layer.close(layer.index);
        $('li').removeClass('szxuan');
    })



    //学习进度
    $(".stu_jindu").on('click', 'li', function () {
        $('li').removeClass('renxuan');
        $(this).addClass("renxuan");
        var num = $(this).attr("data_value");
        GetSectionList(num);

    })

    //小节里标题背景颜色切换
    $(".knobble_txt").on("click", "p", function () {
        //所有
        $("p").removeClass("redColor");
        $(this).addClass("redColor");

        //每个小节的切换，互不影响
        // $(this).parent().children("p").removeClass("redColor")
        // $(this).addClass("redColor");
    })

    //小节里内容的展开与收起
    $(".knobble_name").on("click", ".pack_tab", function () {
        if ($(this).hasClass("pack_down")) {
            $(this).removeClass("pack_down").addClass("pack_up").text("展开").parent().siblings(".knobble_txt").removeClass("disBlock");
        } else {
            $(this).removeClass("pack_up").addClass("pack_down").text("收起").parent().siblings(".knobble_txt").addClass("disBlock");
        }
    })


    //4个本地设置 配音 音效 音乐动画
    $("input:checkbox[name='SwitchSet']").each(function () {
        var name = $(this).data("name");
        var setValue = localStorage.getItem(name);
        if (setValue == null) setValue = 1;
        if (setValue == 1) {
            $(this).prop("checked", false);
        } else {
            $(this).prop("checked", true);
        }
    });
    $("input:checkbox[name='SwitchSet']").change(function () {
        var name = $(this).data("name");
        //点击之后如果变成打钩时触发
        if ($(this).prop('checked') == true) {//关闭
            localStorage.setItem(name, 0);
            if (name == "setyinyue") {
                stopSound(1);
            }
        }
        //点击之后变为不是打钩时触发
        else {//开启
            localStorage.setItem(name, 1);
            if (name == "setyinyue") {
                playSound("/Flash/home_bgv.mp3", 1);
            }
        }
    });

})

function changeState() {
    var divs = document.getElementsByTagName('pack_tab');
    //alert(aaa);
    console.log(divs);
    if ($(this).hasClass("pack_down")) {
        $(this).removeClass("pack_down").addClass("pack_up").text("展开").parent().siblings(".knobble_txt").removeClass("disBlock");
    } else {
        $(this).removeClass("pack_up").addClass("pack_down").text("收起").parent().siblings(".knobble_txt").addClass("disBlock");
    }
}

function ExitTask() {
    window.close();
}

function SubmitTask() {
    //提交  后续完善

    //
    var TotalResultId = $("#TotalResultId").val();
    var TaskId = $("#TaskId").val();

    $.ajax({
        type: "POST",
        async: false,
        url: "/StuHome/StuSubmitTask",
        data: { "TotalResultId": TotalResultId, "TaskId": TaskId },
        dataType: "json",
        success: function (data) {

            if (data < 0) {
                if (data == -2) {
                    layer.msg('团队模式下只能组长提交', { icon: 2 });
                } else {
                    layer.msg('操作失败', { icon: 2 });
                }
            }
            else
            {
                if (data == 1) //考核
                {
                    window.close();
                }
                else
                {
                    window.location.href = `/PracticeResult/Index?TotalResultId=${TotalResultId}&TaskId=${TaskId}`;
                }
            }

        },
        error: function (error) {

        }
    });
}


//学习进度
function xxjd() {
    layer.open({
        title: false,
        //btn: ['确定'],
        area: ['1000px', '630px'],
        type: 1,
        skin: 'layer-gonggao', //自定义模式选择弹窗样式类名
        closeBtn: false, //显示关闭按钮
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        content: $("#xxjd"),

    });

    $(".stu_jindu").find("li").eq(0).click();
       
}
function GetSectionList(id) {
    //var id = 19;
    $.ajax({
        url: '/TheoreticalKnowledge/GetSectionList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: {"Type": id },
        success: function (tb) {
            var html = '';
            //课程
            var Curriculum = tb.Curriculum;//转换table
            //章
            var Chapter = tb.Chapter;//转换table
            //节
            var Section = tb.Section;//转换table
            //资源
            var Resources = tb.Resources;//转换table
            //课后练习
            var Practice = tb.Practice;
            //实操练习
            var PracticeAssessment = tb.PracticeAssessment;
            if (Curriculum != null && Curriculum.length > 0) {
                $("#Cover").attr("src", Curriculum[0]["Cover"]);
                $("#CurriculumName").html(Curriculum[0]["CurriculumName"]);
                $("#Synopsis").html(Curriculum[0]["Synopsis"]);
                $("#Cover").show();
            }
            if (Chapter != null && Chapter.length > 0) {
                for (var i = 0; i < Chapter.length; i++) {
                    var ID = Chapter[i]["ID"];
                    var ChapterID = Chapter[i]["ID"];
                    var Name = Chapter[i]["Name"];
                    var COUResources = Chapter[i]["COUResources"];
                    var COUResourceRecord = Chapter[i]["COUResourceRecord"];
                    var complete = 0;
                    if (parseFloat(COUResourceRecord) > 0 && parseFloat(COUResources) > 0) {
                        complete = (parseFloat(COUResourceRecord) / parseFloat(COUResources)) * 100;
                    }
                    html += '<div>';
                    html += '<p class="tabbar_name" >';
                    html += '<span>模块' + (1 + i) + '：' + Name + '</span>';
                    html += '<img src="/Img/z_oval.png"/>';
                    html += '<span class="plans">';
                    if (complete.toFixed(2) == 0.00) {
                        html += '已观看<span>0</span>';
                    } else {
                        html += '已观看<span>' + complete.toFixed(2); + '</span>';
                    }
                    html += '%</span></p>';
                    var ss = 0;
                    for (var s = 0; s < Section.length; s++) {
                        if (Section[s]["ChapterID"] == ChapterID) {
                            ID = Section[s]["ID"];
                            var SectionID = Section[s]["ID"];
                            Name = Section[s]["Name"];
                            html += '<div class="tabbar_knobble" >';
                            html += '<p class="knobble_name">';
                            html += '<span class="fl" >第' + (ss + 1) + '节：' + Name + '</span>';

                            //html += '<span class="pack_up  fr pack_tab" onclick="changeState(this)" id="andid' + ID + '" >展开</span>';
                            html += '<span class="pack_up fr pack_tab " id="andid' + ID + '" onclick="tab_up_down(' + ID + ')" >展开</span>';
                            html += '</p>';
                            html += '<div class="knobble_txt " id="div' + ID + '">';
                            var times = 0;
                            var KisHave = false;
                            var SisHave = false;
                            for (var j = 0; j < Resources.length; j++) {
                                if (Resources[j]["SectionID"] == SectionID) {
                                    times += 1;
                                    ID = Resources[j]["ID"];
                                    Name = Resources[j]["Name"];
                                    var Type = Resources[j]["Type"];
                                    var IsRecord = Resources[j]["IsRecord"];
                                    if (times<1) {
                                        html += '<div class="leixing">课件学习</div>';
                                    } 
                                    html += '<p data_typeid=' + id+' onclick="Event(this)" Id="' + ID + '" >';
                                    if (Type == ".MP4" || Type == ".mp4" || Type == ".mP4" || Type == ".Mp4") {
                                        html += '<span class="videoColor" >视频</span>';
                                    } else {
                                        html += '<span class="pptColor" >PPT</span>';
                                    }
                                    html += Name;
                                    if (parseInt(IsRecord) >= 1) {
                                        html += '<span class="study_learn" ><img src="../img/ico_wan.png" /></span>';
                                    } else {
                                        html += '<span class="study_learn" ><img src="../img/ico_weiwan.png" /></span>';
                                    }
                                    html += '</p>';
                                }
                            }
                            
                            for (var j = 0; j < PracticeAssessment.length; j++) {
                                if (PracticeAssessment[j]["SectionId"] == SectionID) {
                                    var IsRecord = PracticeAssessment[j]["IsRecord"];
                                    if (SisHave == false) {
                                        html += '<div class="leixing">案例实操</div>';
                                    }
                                    SisHave = true;
                                    var TaskId = PracticeAssessment[j]["TaskId"];
                                    var Eid = PracticeAssessment[j]["Eid"];
                                    Name = PracticeAssessment[j]["TaskName"]; 
                                    
                                    html += '<p  onclick="OpenPracticeAssessment(' + TaskId + ',' + Eid + ')" Id="' + Eid + '" Name="' + Name + '" >';
                                    html += '<span class="anliColor">案例</span>' + Name + '</a>';
                                    if (parseInt(IsRecord) >= 1) {
                                        html += '<span class="study_learn" ><img src="../img/ico_wan.png" /></span>';
                                    } else {
                                        html += '<span class="study_learn" ><img src="../img/ico_weiwan.png" /></span>';
                                    }
                                    html += '</p>';
                                }
                            }
                            
                            for (var j = 0; j < Practice.length; j++) {
                                var IsRecord = Practice[j]["IsRecord"];
                                if (Practice[j]["SectionId"] == SectionID) {
                                    if (KisHave == false) {
                                        html += '<div class="leixing">课后习题</div>';
                                    }
                                    KisHave = true;
                                    ID = Practice[j]["ForeignkeyId"];
                                    Name = Practice[j]["E_Name"];
                                    var EPId = Practice[j]["E_PId"];

                                    html += '<p  onclick="OpenPractice(this,' + ID + ',' + EPId + ')" Id="' + EPId + '" Name="' + Name + '" >';
                                    html += '<span class="xitiColor">习题</span>' + Name + '</a> ';
                                    if (parseInt(IsRecord) >= 1) {
                                        html += '<span class="study_learn" ><img src="../img/ico_wan.png" /></span>';
                                    } else {
                                        html += '<span class="study_learn" ><img src="../img/ico_weiwan.png" /></span>';
                                    }
                                    html += '</p>';
                                }
                                

                            }
                            html += '</div>';
                            html += '</div > ';
                            ss++;
                        }
                    }
                    html += '</div>';
                }
            }
            $("#tablelist").html(html);
        }
    });
}


//跳转实训
function OpenPracticeAssessment(TaskId,ID) {
    
    $.ajax({
        url: '/TheoreticalKnowledge/Add',
        type: 'POST',
        data: { "ExamId": ID, "TaskId": TaskId },
        async: false,
        success: function (data) {
            if (parseInt(data) > 0) {
                //成绩id +任务id
                window.open("/StuHome/StudentHome?TotalResultId=" + data + "&TaskId=" + TaskId);

            }
            else {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}


function OpenPractice(obj, ID, EPId) {
    var name = $(obj).attr("Name");
    window.open("/HB_ExamPreview/ExamPreviewCenter?ID=" + ID + " &EId=" + EPId + " &Name=" + name);
}

function tab_up_down(id) {
    var iid = "div" + id;
    var andid = "andid" + id;
    var display = $('#' + iid).css('display');
    if (display == 'none') {
        $("#" + iid + "").show();
        $("#" + andid + "").html("收起");
        $("#" + andid + "").removeClass("pack_up").addClass("pack_down");
        

    } else {
        $("#" + iid + "").hide();
        $("#" + andid + "").text("展开");
        $("#" + andid + "").removeClass("pack_down").addClass("pack_up");
    }
}


function Event(obj) {
    var ID = $(obj).attr("Id");
    var Type = $(obj).attr("data_typeid");
    $(obj).find(".study_learn").html("开始学习");
    var num = Math.floor(Math.random() * 100000000);//0-100000000
    window.open("/TheoreticalKnowledge/NewKechen?ResourcesID=" + ID + "&num=" + num + "&Type=" + Type);
}



//layer 关闭自身 调用方法 
function layerCloseZdy(obj) {

    var maxLen = 10;
    obj = $(obj).parent();
    while (obj.length > 0 && maxLen>0) {
        var layerDivId = obj.attr("id");
        obj = $(obj).parent();
        maxLen--;
        if (layerDivId == undefined) {
            continue;
        }
        if (layerDivId.indexOf("layui-layer") >= 0) {
            layer.close(layerDivId.replace("layui-layer", ""));
            break;
        }
        
    }

     

    //var layerDivId = $(obj).parents("div").last().attr("id");
    //layer.close(layerDivId.replace("layui-layer", ""));
}


//获取表单图片路劲  传参 表单名
function getFormImgSrcByFormName(formname) {
    var src = "";
    if (formname == "一般业务申请书") {
        src = "menu04";
    }
    else if (formname == "个人开户与银行签约服务申请书") {
        src = "menu05";
    }
    else if (formname == "特定业务申请书") {
        src = "menu08";
    }
    else if (formname == "转账支票") {
        src = "menu02";
    }
    else if (formname == "进账单") {
        src = "menu06";
    }
    else if (formname == "个人转账/汇款凭证") {
        src = "menu01";
    }
    else if (formname == "(打印)个人转账/汇款凭证") {
        src = "menu01";
    }
    else if (formname == "撤销银行结算账户申请书") {
        src = "menu07";
    }
    else if (formname == "结算业务申请书") {
        src = "menu010";
    }
    else if (formname == "开立单位银行结算账户申请书") {
        src = "menu09";
    }
    else if (formname == "空白凭证领用单") {
        src = "menu011";
    }
    else if (formname == "现金交款单") {
        src = "menu03";
    }
    else if (formname == "客户身份证") {
        src = "menu020";
    }
    else if (formname == "代理人身份证") {
        src = "menu020";
    }
    else if (formname == "法人代表身份证") {
        src = "menu020";
    }
    else if (formname == "经办人身份证") {
        src = "menu020";
    }
    else if (formname == "银行卡") {
        src = "menu019"
    }
    else if (formname == "存折") {
        src = "menu039"
    }
    else if (formname == "定期存单") {
        src = "menu012"
    }
    else if (formname == "新的定期存单") {
        src = "menu012"
    }
    else if (formname == "代理人办理相关证明") {
        src = "menu033"
    }
    else if (formname == "一本通") {
        src = "menu038"
    }
    else if (formname == "授权申请书") {
        src = "menu017"
    }
    else if (formname == "授权委托书") {
        src = "menu018"
    }
    else if (formname == "止付通知书") {
        src = "menu040"
    }
    else if (formname == "解除止付通知书") {
        src = "menu026"
    }
    else if (formname == "银行保证金合同") {
        src = "menu027"
    }
    else if (formname == "签约协议") {
        src = "menu036"
    }
    else if (formname == "冻结通知书") {
        src = "menu028"
    }
    else if (formname == "扣划通知书") {
        src = "menu029"
    }
    else if (formname == "委托扣款协议书") {
        src = "menu030"
    }
    else if (formname == "银行端查询缴税凭证") {
        src = "menu015"
    }
    else if (formname == "协助扣划存款通知书") {
        src = "menu029"
    }
    else if (formname == "裁定书") {
        src = "menu031"
    }
    else if (formname == "查询书") {
        src = "menu032"
    }
    else if (formname == "法院人员一工作证") {
        src = "menu022"
    }
    else if (formname == "法院人员二工作证") {
        src = "menu022"
    }
    else if (formname == "法院人员一工作证（复印件）") {
        src = "menu022hui"
    }
    else if (formname == "法院人员二工作证（复印件）") {
        src = "menu022hui"
    }
    else if (formname == "营业执照") {
        src = "menu_yyzz"
    }
    else if (formname == "社保卡") {
        src = "menu021"
    }
    else if (formname == "公安机关人员一证件") {
        src = "menu024"
    }
    else if (formname == "公安机关人员二证件") {
        src = "menu024"
    }
    else if (formname == "公安机关人员一证件（复印件）") {
        src = "menu024hui"
    }
    else if (formname == "公安机关人员二证件（复印件）") {
        src = "menu024hui"
    }
    else if (formname == "代理人护照") {
        src = "menu023"
    }
    else if (formname == "法人银行卡") {
        src = "menu019"
    }
    else if (formname == "剩余转账支票") {
        src = "menu025"
    }
    else if (formname == "印鉴卡（销户）" || formname ==  "印鉴卡（开户）") {
        src = "menu013"
    }
    else if (formname == "单位定期证实书") {
        src = "menu035"
    }
    else if (formname == "营业执照复印件") {
        src = "menu_yyzzhui"
    }
    else if (formname == "假币收缴凭证") {
        src = "menu014"
    }
    else if (formname == "客户身份证联网核查结果") {
        src = "menu016"
    }
    else if (formname == "代理人身份证联网核查结果") {
        src = "menu016"
    }
    else if (formname == "经办人身份证联网核查结果") {
        src = "menu016"
    }
    else if (formname == "法人身份证联网核查结果") {
        src = "menu016"
    }
    else if (formname == "假钞") {
        src = "jiabi"
    }
    else if (formname == "利息清单（耗材）") {
        src = "menu034"
    }
    else if (formname == "通用业务凭证（耗材）") {
        src = "menu037"
    }
    else if (formname == "冻结回执") {
        src = "menu041"
    }
    else if (formname == "扣划回执") {
        src = "menu042"
    }
    else if (formname == "协助查询通知书") {
        src = "menu043"
    }
    else if (formname == "协助查询通知书(回执)") {
        src = "menu044"
    }
    
    


    if (src.length > 0) {
        src = `/CSS/danju/img/danjuimg/${src}.jpg`;
    }

    return src;
}


function LoadKechengButton() {

    $.getJSON("/TheoreticalKnowledge/LogYuangong", {}, function (data) {
        var datas = data.map(r => r.ID)
        $(".stu_jindu").find("li").each(function () {
            var num = parseInt($(this).attr("data_value"));
            var x = 58 + num
            if (datas.includes(x)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        })
    })

}