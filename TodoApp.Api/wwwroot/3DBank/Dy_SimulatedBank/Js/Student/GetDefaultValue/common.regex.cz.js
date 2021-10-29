var yw_data;//当前业务信息对象
var current_taskid;
var checkRegex = null;
$(function () {


    //清空按钮
    $(".ed-clear").click(function () {
        var controls = $(".clear-control");
        for (var i = 0; i < controls.length; i++) {
            var c = $(controls[i]).get(0);
            var tag_name = c.tagName;
            if (tag_name == "INPUT") {
                var type = $(controls[i]).attr("type");

                if (type == "radio" || type == "checkbox") {
                    $(controls[i]).removeAttr("checked");
                } else {
                    $(controls[i]).val("");
                }

            } else if (tag_name == "SELECT") {
                //下拉框选中第一项
                $(controls[i]).find("option").eq(1).prop("selected", true)
                $(controls[i]).next().val($(controls[i]).find("option").eq(1).text());
            }
        }
    });
    //返回按钮
    $(".ed-back").click(function () {
        window.close();
    });
    //查询条件折叠事件
    $(".top-title").click(function () {
        // var is_show = $("#qv").css("display"); 
        // if (is_show == "none") {
        //     $("#qv").show();
        // } else {
        //     $("#qv").hide();
        // }
        var rely = $(this).next();
        var is_show = rely.css("display");
        if (is_show == "none") {
            rely.show();
        } else {
            rely.hide();
        }
    });
    //获取当前业务信息

    var formid = getQueryString("formid");

    //  isCheckVoucherNo(formid,function(cdata){ 
    //     yw_data=cdata[0]; 

    //     var is_review=$("#review").text();
    //     if(is_review=="true"){
    //       return;
    //     }
    //     var fake_btnsubmit_html=""; 

    //     if(formid!="060701"){ 
    //     //生成假提交按钮
    //      if(yw_data.sysname=="核心系统"){   
    //        fake_btnsubmit_html="<button type=\"button\" style=\"margin-right: 0px;\" id=\"fake_btnsubmit\">提交</button>"; 
    //      }else{
    //        fake_btnsubmit_html="<button id=\"fake_btnsubmit\">提交</button>"; 
    //      }  
    //       //隐藏真提交按钮
    //       var btnsubmit=$("#btnsubmit");
    //       btnsubmit.css("display","none");
    //       //将假提交按钮放到页面
    //       btnsubmit.before(fake_btnsubmit_html);
    //     }
    //       $("#fake_btnsubmit").click(function(){ 
    //           //验证任务是否可提交
    //           beforeSubmit(formid, function (taskid) { 
    //               current_taskid = taskid;
    //               sessionStorage.current_taskid = current_taskid;
    //               if(yw_data.sysname=="核心系统"){   
    //                   var auth_ids= yw_data.isLongAuth;  
    //                   review(formid,auth_ids); 
    //               }
    //               else{
    //                   //直接调用 页面定义的函数
    //                   var auth_ids= yw_data.isLongAuth;  
    //                   Submit(formid,auth_ids);
    //               } 
    //           });
    //       });

    //       IESet(yw_data);
    //  });

    //});

    //提交之前的验证
    var beforeSubmit = function (formid, callback) {

        var examid = getQueryString("examid");
        var siteid = getQueryString("banksiteid");
        var userid = getQueryString("tellerId");
        var planid = getQueryString("planid");
        var data = formid + "," + examid + "," + siteid + "," + userid + "," + planid;

        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/indexone/checkTask",
            data: { data: data },
            success: function (row) {
                var msguser = '';
                if (row.data == "ok:0") {
                    layer.alert('任务未开启！');
                } else {
                    var taskid = row.data.replace("ok:", "");
                    var controls = $(".form-item");
                    var errormsg = "";
                    for (var i = 0; i < controls.length; i++) {
                        var result = checkRegex($(controls[i]).get(0));
                        if (!result.isCheck) {
                            errormsg += result.errormsg;
                        }
                    }
                    var kcs = $(".sousuo");
                    for (var i = 0; i < kcs.length; i++) {
                        var isclick = $(kcs[i]).attr("vl-exec");
                        //判断关联快查的控件是否置灰以及控件类型
                        var control = $(kcs[i]).prev();
                        if (control.attr("id") == undefined) {
                            //没有id说明control是select共生的input，再往上找一级找到select
                            control = control.prev();
                        }
                        if (control.attr("disabled") == "disabled" || control.attr("vl-disabled") == "true") {
                            isclick = "true";
                        }
                        if (isclick == "false") {
                            var tips = eval($(kcs[i]).attr('vl-message'));
                            if (tips != null && tips.length > 0) {
                                errormsg += tips[0];
                            }
                        }
                    }
                    if (errormsg != "") {
                        layer.alert(errormsg);
                        return;
                    }
                    callback(taskid);
                }
            }
        });
    }


    //核心系统内部授权
    var innerAuth_array = ["030602", "080707", "080702", "080703", "091003", "091101", "030101"];
    //复核
    var review_arraw = ["010906", "081004", "081001", "010907", "081005", "010903", "010904", "060201", "062003", "060501", "060703", "062301", "063902"];
    //调用复核、远程授权、打印、内部授权等操作
    var review = function (formid, auth_ids) {
        //将远程授权id存入sessionStorage，供后续判断使用 
        sessionStorage.auth_ids = auth_ids;
        var call_sign = ""; // 
        //需要内部授权的页面
        if (innerAuth_array.join(",").indexOf(formid) > -1) {
            checkLongAuthSet(formid, current_taskid, function (is_set) {
                //内部授权成功后需要进行的操作
                if (review_arraw.join(",").indexOf(formid) > -1 && checkPzzl()) {
                    call_sign = "review";
                } else if (auth_ids != "" && auth_ids != null && auth_ids != "null") {
                    if (is_set) {
                        call_sign = "longAuth";
                    } else {
                        sessionStorage.auth_ids = "";
                        if (print_array.join(",").indexOf(formid) > -1) {
                            call_sign = "print";
                        } else {
                            call_sign = "submit";
                        }
                    }
                    //call_sign = "longAuth";
                } else if (print_array.join(",").indexOf(formid) > -1) {
                    call_sign = "print";
                }
                if (formid == "030101") {
                    var ywlx = $("#sle_ywlx").val();
                    if (ywlx == 1) {
                        window.authCloseCall("submit");
                        return;
                    }
                }
                innerAuthWin(call_sign);
            });
        } else if (review_arraw.join(",").indexOf(formid) > -1 && checkPzzl()) {
            //直接打开复核页面
            if (yw_data.sysname == "核心系统") {
                reviewWin();
            } else {
                //mark
                edReview();
            }
        } else if (auth_ids != "" && auth_ids != null && auth_ids != "null") {
            checkLongAuthSet(formid, current_taskid, function (is_set) {
                //直接弹出远程授权
                var is_print = false;
                if (print_array.join(",").indexOf(formid) > -1) {
                    is_print = true;
                }
                if (is_set) {
                    authNewWin(is_print);
                } else {
                    //未配置，不弹出，判断下一步是否需要打印
                    if (is_print) {
                        window.authCloseCall("print");
                    } else {
                        window.authCloseCall("submit");
                    }
                }
            });
        } else if (print_array.join(",").indexOf(formid) > -1) {
            //直接打开打印页面
            window.authCloseCall("print");
        } else {
            //不需要内部授权、复核、远程授权、打印 
            //直接点击提交 
            window.authCloseCall("submit");
        }
    };
    //检测现金支票
    function checkPzzl() {
        var pzzl = $("#sle_pzzl");
        if (pzzl == null || pzzl == undefined) {
            return true;
        }

        var sle_text = $("#sle_pzzl option:checked").text();
        if (sle_text == null || sle_text == undefined) {
            return true;
        } else if (sle_text.indexOf("现金支票") > -1) {
            return false;
        } else {
            return true;
        }

    }
    //内部授权打开新窗口
    function innerAuthWin(call_sign) {
        var formid = getQueryString("formid");
        var url = '/User/auth?formid=' + formid + "&call_sign=" + call_sign;
        var height = 600;
        window.open(url, '_blank', 'width=1024,height=' + height + ',top=10px,left=10px,location=no,scrollbars=yes');
    }

    //二代内部授权打开新窗口
    function edInnerAuthWin(callback) {
        var auth_layer_index = layer.open({
            title: "请进行本地主管授权",
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            area: ['420px', '240px'], //宽高
            content: '<ul class=\"dialog-content\"><li></li><li><label>授权主管号：</label><input type=\"text\" id=\"d_txt_sqzgh\"/></li><li><label>主管密码：</label><input type=\"password\" id=\"d_txt_zgmm\"/></li></ul>',
            btn: ["提交", "关闭"],
            yes: function () {
                var sqzgh = $("#d_txt_sqzgh").val();
                var zgmm = $("#d_txt_zgmm").val();
                if (sqzgh == "143276" && zgmm == "12345654") {
                    //授权成功后的操作
                    callback(auth_layer_index);
                } else {
                    layer.alert("授权主管号或者密码错误！");
                }
            }
        });
    }

    //复核业务打开新窗口
    function reviewWin() {
        var l_i = layer.alert("此业务需要复核，点击“确定”按钮开始复核操作！", function () {
            layer.close(l_i);
            var formid = getQueryString("formid");
            switch (formid) {
                case "010906":
                    sessionStorage.ReviewControls = "money_jyje,txt_jszh,sle_jzzl,txt_jzhm,sle_cq";
                    break;
                case "081004":
                    var sle_czlx = $("#sle_czlx").val();
                    if (sle_czlx == "1") {
                        //冲正
                        sessionStorage.ReviewControls = "sle_czlx,date_jzrq,txt_czzh,txt_czpzhm,money_je,sle_jdbz";
                    } else if (sle_czlx == "2") {
                        //补记
                        sessionStorage.ReviewControls = "sle_czlx,date_jzrq,txt_bjzh,txt_bjpzhm,sle_bjpzzl,sle_jdbz";
                    } else if (sle_czlx == "3") {
                        //冲正且补记
                        sessionStorage.ReviewControls = "sle_czlx,date_jzrq,txt_czzh,txt_czpzhm,money_je,txt_bjzh,txt_bjpzhm,sle_bjpzzl,sle_czpzzl,sle_jdbz";
                    }
                    break;
                case "081001":
                    sessionStorage.ReviewControls = "txt_ylsh";
                    break;
                case "010907":
                    sessionStorage.ReviewControls = "txt_dwdqzh,sle_cq,money_jyje,txt_jszh,txt_lxzrzh";
                    break;
                case "081005":
                    var sle_czlx = $("#sle_czlx").val();
                    if (sle_czlx == "1") {
                        //冲正
                        sessionStorage.ReviewControls = "sle_czlx,date_czrq,txt_ylsh,sle_jdbz,txt_czzh,sle_czpzzl,txt_czpzhm,money_je";
                    } else if (sle_czlx == "2") {
                        //补记
                        sessionStorage.ReviewControls = "sle_czlx,date_czrq,txt_ylsh,sle_jdbz,txt_bjzh,money_je1,sle_bjpzzl,txt_bjpzhm";
                    }
                    break;
                case "010903":
                    var sle_xzbz = $("#sle_xzbz").val();
                    if (sle_xzbz == "1") {
                        //现金  
                        sessionStorage.ReviewControls = "txt_zh,sle_xzbz,txt_pzhm,txt_cprq,money_jyje";
                    } else {
                        //转账
                        sessionStorage.ReviewControls = "txt_zh,sle_xzbz,txt_pzhm,txt_cprq,money_jyje,txt_zrzkh";
                    }
                    break;
                case "010904":
                    sessionStorage.ReviewControls = "txt_zh";
                    break;
            }
            sessionStorage.PrevYwData = getFormData();

            var tellerId = getQueryString("tellerId");
            var examid = getQueryString("examid");
            var banksiteid = getQueryString("banksiteid");
            var DepartmentId = getQueryString("DepartmentId");
            var planid = getQueryString("planid");
            var taskid = $("#taskidCur").text();
            
            var url = '/User/review/?formid=' + formid + '&tellerId=' + tellerId + '&examid=' + examid + '&banksiteid=' + banksiteid + '&DepartmentId=' + DepartmentId + '&planid=' + planid + '&taskid=' + taskid;
            var height = 600;
            window.open(url, '_blank', 'width=1024,height=' + height + ',top=10px,left=10px,location=no,scrollbars=yes');
        });
    }

    var getFormData = function () {
        var data = '';
        $(".form-item").each(function (i, e) { //$(this).attr("checked")
            //取值,复选框
            if ($(e).attr("id").indexOf("check_") > -1) {
                // console.log("7777:" + $(e).attr("id") + ":" + $(e).is(':checked')); //$('#checkbox-id').attr('checked')
                if ($(e).is(':checked')) {
                    data += "&" + ($(e).attr("vtitle") + ":" + $(e).attr("id") + "=1-选中");
                } else {
                    data += "&" + ($(e).attr("vtitle") + ":" + $(e).attr("id") + "=0-未选中");
                }
            } else if ($(e).attr("id").indexOf("redio_") > -1) // 单选框redio
            {
                if ($(e).is(':checked')) {
                    data += "&" + ($(e).attr("vtitle") + ":" + $(e).attr("id") + "=1-选中");
                } else {
                    data += "&" + ($(e).attr("vtitle") + ":" + $(e).attr("id") + "=0-未选中");
                }
            } else if ($(e).attr("id").indexOf("sle_") > -1) // 下拉框
            {
                //console.log("select:" +$(e).val() + ":" + $(e).find("option:selected").text());
                data += "&" + ($(e).attr("vtitle") + ":" + $(e).attr("id") + "=" + $(e).find("option:selected").text());
            } else {
                data += "&" + ($(e).attr("vtitle") + ":" + $(e).attr("id") + "=" + $(e).val());
            }
        });
        if (data.length > 0) { data = data.substring(1); }
        return data;
    }


    //远程授权打开新窗口
    function authNewWin(is_print) {

        var formid = getQueryString("formid");
        var tellerId = getQueryString("tellerId");
        var examid = getQueryString("examid");
        var banksiteid = getQueryString("banksiteid");
        var DepartmentId = getQueryString("DepartmentId");
        var planid = getQueryString("planid");

        var url = '/User/indexone?formid=010001&tellerId=' + tellerId + '&examid=' + examid + '&banksiteid=' + banksiteid + '&DepartmentId=' + DepartmentId + '&planid=' + planid + "&is_print=" + is_print + "&prev_formid=" + formid;

        var height = 600;
        window.open(url, '_blank', 'width=1024,height=' + height + ',top=10px,left=10px,location=no,scrollbars=yes');
    }

    /**
     * 二代系统下一步业务打开新窗口
     * @url,打开的URL
     * @yw,要显示的业务块
     */
    function edNextNewWin(url, yw) {
        var formid = getQueryString("formid");
        var tellerId = getQueryString("tellerId");
        var examid = getQueryString("examid");
        var banksiteid = getQueryString("banksiteid");
        var DepartmentId = getQueryString("DepartmentId");
        var planid = getQueryString("planid");

        var url = url + "formid=" + formid + "&tellerId=" + tellerId + "&examid=" + examid + "&banksiteid=" + banksiteid + "&DepartmentId=" + DepartmentId + "&planid=" + planid + "&yw=" + yw;
        var height = 600;
        //alert(height);
        window.open(url, '_blank', 'width=1024,height=' + height + ',top=100px,left=0px,location=no,scrollbars=yes')
    }

    /**
     * 二代系统跳转复核页面
     */
    function edReview() {
        var url = "/user/review";
        var yw = "2";
        var is_open = true;

        var formid = getQueryString("formid");
        switch (formid) {
            case "060201":
                sessionStorage.ReviewControls = "txt_thyy";
                break;
            case "062003":
                sessionStorage.ReviewControls = "sle_zhlx,txt_zkh,txt_zhmc,txt_khhhh,money_,sle_pjlx,txt_zh,txt_pjhm,date_qfrq,txt_sqbl";
                break;
            case "060501":
                sessionStorage.ReviewControls = "txt_skhhh,money_hkje,txt_hkzhkh,txt_skrzh";
                break;
            case "060703":
                sessionStorage.ReviewControls = "txt_jfzh";
                break;
            case "062301":
                sessionStorage.ReviewControls = "txt_htyy";
                break;
            case "063902":
                sessionStorage.ReviewControls = "txt_sjrzzh,txt_sjrzhm";
                break;
        }
        sessionStorage.PrevYwData = getFormData();

        var tellerId = getQueryString("tellerId");
        var examid = getQueryString("examid");
        var banksiteid = getQueryString("banksiteid");
        var DepartmentId = getQueryString("DepartmentId");
        var planid = getQueryString("planid");
        var taskid = $("#taskidCur").text();
        var url = url + "?formid=" + formid + "&tellerId=" + tellerId + "&examid=" + examid + "&banksiteid=" + banksiteid + "&DepartmentId=" + DepartmentId + "&planid=" + planid + "&sign=hnhdxt&yw=" + yw + '&taskid=' + taskid;;
        if (is_open) {
            var height = 600;
            window.open(url, '_blank', 'width=1024,height=' + height + ',top=100px,left=0px,location=no,scrollbars=yes');
        } else {
            window.location.href = url;
        }
    }

    //组合二代系统上步业务的数据，供下步操作使用
    function lineEdPrevYwData(controls) {
        var yw1_data = "";
        for (var i = 0; i < controls.length; i++) {
            var val;
            var c = $(controls[i]).get(0);
            var tag_name = c.tagName;
            var is_contant = false;
            if (tag_name == "INPUT") {
                var type = $(controls[i]).attr("type");
                if (type == "radio" || type == "checkbox") {
                    //单选框
                    val = $(controls[i]).is(":checked");
                } else {
                    val = $(controls[i]).val();
                }

                is_contant = true;
            } else if (tag_name == "SELECT") {
                val = $(controls[i]).val();
                is_contant = true;
            }
            if (is_contant) {
                yw1_data += "&" + $(controls[i]).attr("id") + "|" + val;
            }
        }
        return yw1_data.substring(1);
    }

    //捕捉页面上的提交成功提示
    var is_show = false;
    //标记业务是否已经提交过，考核打印使用 
    var catchSuccess = function (callback) {
        var layer_is_show = $(".layui-layer-dialog").css("display");
        if (layer_is_show == "block") {
            //获取提示内容
            var content = $(".layui-layer-dialog").find(".layui-layer-content").html();
            if (content.trim() == "提交成功！") {
                is_show = true;
            }
        }
        if (is_show && layer_is_show != "block") {
            //成功捕获
            callback();
            is_show = false;
            //标记业务是否已经提交过，考核打印使用
            var is_submit_html = "<input id=\"is_submit\" type=\"hidden\" value=\"true\"/>";
            $("body").append(is_submit_html);
            //清除计时器
            clearInterval(interval)
            //关闭当前窗口
            //window.close(); 
        }
    }

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }


    //弹出二代打印页面
    function printEdWin() {
        var l_i = layer.open({
            title: "打印",
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            area: ['630px', '430px'], //宽高
            content: '<div class=\"ed-print\"><div class=\"step-1\"><img src=\"/busi/img/danju1.jpg\"/></div><div class=\"step-2\"><img src=\"/busi/img/danju2.jpg\"/></div><a class=\"print-now\" href=\"javascript:void(0);\"></a><a class=\"print-again\" href=\"javascript:void(0);\"></a><a class=\"print-cancle\"  href=\"javascript:void(0);\"></a></div>',
            success: function () {
                $("#txt_dy999").remove();

                $(".print-now").click(function () {
                    $(".ed-print .step-1").hide();
                    $(".ed-print .step-2").show();
                    $(this).hide();
                    $(".print-again").show();
                    $(".print-cancle").show();
                    var print_kh_html = "<input id=\"txt_dy999\" value=\"1-已打印\" vtitle=\"打印项\" type=\"hidden\" class=\"form-item\"/>";
                    $("body").append(print_kh_html);

                    $("#btnsubmit").click();
                });
                $(".print-again").click(function () {
                    $(".ed-print .step-1").show();
                    $(".ed-print .step-2").hide();
                    $(this).hide();
                    $(".print-now").show();
                    $(".print-cancle").hide();
                });
                $(".print-cancle").click(function () {
                    layer.close(l_i);
                });
            }
        });
    }


    //弹出打印页面
    function printWin() {
        var print_list = "相关业务凭证";
        layer.open({
            type: 2, //Page层类型
            skin: 'layui-layer-molv', //样式类名
            area: ['97%', '90%'],
            offset: ['15px', '15px'],
            closeBtn: 1,
            title: false,
            moveOut: true,
            shade: 0.6, //遮罩透明度
            maxmin: false, //允许全屏最小化
            anim: 1, //0-6的动画形式，-1不开启
            content: _ip + 'print?print_list=' + print_list,
            // content: '/User/indexone?formid=010001'+"&tellerId="+tellerId+"&examid="+examid+"&banksiteid="+banksiteid+"&DepartmentId"+DepartmentId+"&planid="+planid
            end: function () {
                var formid = getQueryString("formid");
                var tellerId = getQueryString("tellerId");
                var examid = getQueryString("examid");
                var banksiteid = getQueryString("banksiteid");
                var DepartmentId = getQueryString("DepartmentId");
                var planid = getQueryString("planid");
                if (formid == "080704") {
                    //现金轧账提交成功并且打印窗口关闭后触发  
                    var url = "/FormList/indexone?formid=080705&tellerId=" + tellerId + "&examid=" + examid + "&banksiteid=" + banksiteid + "&DepartmentId=" + DepartmentId + "&planid=" + planid;
                    location.href = url;
                }
                if (formid == "080705") {
                    //凭证轧账提交成功并且打印窗口关闭后触发 
                    var url = "/user/indexone?formid=080706&tellerId=" + tellerId + "&examid=" + examid + "&banksiteid=" + banksiteid + "&DepartmentId=" + DepartmentId + "&planid=" + planid;
                    location.href = url;
                }
            }
        });
    }


    (function ($) {
        //确认框插件
        $.confirm = {
            init: function () {

            }
        };

    })(jQuery);


    //内部授权窗口和远程授权关闭前调用
    window.authCloseCall = function (call_sign) {
        if (call_sign == "print") {

            if (yw_data.sysname == "核心系统") {
                //监控提交成功弹窗      
                $("#btnsubmit").click();
                hxxtjt();
            } else {
                //监控提交成功弹窗 
                var yw = getQueryString("yw");
                if (yw == "" || yw == null || yw == "1") {
                    $("#btnsubmit").click();
                    not_hxxtjt();
                    // printEdWin();
                } else {
                    $("#btnsubmit").click();
                    not_hxxtjt();
                }
            }
        } else if (call_sign == "review") {
            if (yw_data.sysname == "核心系统") {
                reviewWin();
            } else {
                edReview();
            }
        } else if (call_sign == "longAuth") {
            var is_print = false;
            var formid = getQueryString("formid");
            if (print_array.join(",").indexOf(formid) > -1) {
                is_print = true;
            }
            authNewWin(is_print);
        } else {
            //直接提交
            $("#btnsubmit").click();
        }
    }

    //核心系统监控到提交成功提示后开始弹出打印
    var hxxtjt = function () {
        interval = setInterval("hxxt_handel()", 100);
    }

    var hxxt_handel = function () {
        catchSuccess(function () {
            //提交请求
            printWin();
            //$(".foot button").eq(3).click();
        });
    }

    //非核心系统监控到提交按钮之后，调用各页面定义的handel()函数
    var not_hxxtjt = function () {
        interval = setInterval("handel()", 100);
    }

    //需要删除主窗口指定数据行的业务通过子窗口调用
    window.closecall = function (c_id, id) {
        try {
            $(c_id).find("tr[index=" + id + "]").remove();
        } catch (e) {

        }
    }

    //063902和060703私有 给父页面重控号码控件
    window.SetZkhm = function (zkhm) {
        $("#txt_zkhm").val(zkhm);
    }
    //063902私有
    window.CreateCzlx = function (czlx) {
        var element = "<input type=\"hidden\" id=\"txt_czlx_fh\" class=\"form-item\" value=\"解付复核\"/>";
        $("body").append(element);
    }

    //全文验证 从common.regex拷贝来
    checkRegex = function(element) {
        //console.log("44444:" + jsonResult);
        var jsonResult = {
            obj: element,
            index: 0,
            isCheck: true,
            errormsg: ''
        }; //返回的结果


        if ($(element).attr("vl-regex") == "require") {
            $(element).attr("vl-regex", "['require']")
        }
        var regexs = $(element).attr("vl-regex") != undefined ? eval($(element).attr("vl-regex")) : []; //获取正则

        var messages = $(element).attr("vl-message") != undefined ? eval($(element).attr("vl-message")) : []; //获取提示
        if (!regexs) {
            jsonResult.isCheck = false;
            return jsonResult;
        }
        var value = '';
        //console.log('0000:'+$(element).attr("value"));
        // if(typeof($(element).attr("value"))!="undefined")
        //{
        if (element == null) return;
        value = element.value;

        // }

        // if(typeof($(element).attr("tagName"))!="undefined")
        //  {
        if (element.tagName == "SELECT") {
            value = $(element).val(); //null

        }

        //  }
        if (value == undefined) {
            value = '';
        }
        //没有验证必填,如果没有填入值,就不做校验
        if (regexs.indexOf('require') < 0) {
            if ($.trim(value) == '') {
                jsonResult.isCheck = true;
                return jsonResult;
            }
        }

        if (value == '' && $(element).attr("disabled") == 'disabled') {
            jsonResult.isCheck = true;
            return jsonResult;
        }
        if ($(element).attr("disabled") == 'disabled') {
            jsonResult.isCheck = true;
            return jsonResult;
        }

        if ($(element).hasClass("money")) {
            value = value.split(',').join('');
        }
        //添加验证规则的Code
        for (var i = 0; i < regexs.length; i++) {
            if (regexs[i].toLowerCase() === 'require') { //非空
                $(element).siblings(".redtip").remove();
                if (value == '' || value.length == 0) {
                    jsonResult.isCheck = false;
                    if ($(element).siblings(".redtip").length == 0) {
                        if (element.tagName == "SELECT") {
                            if ($(element).parent().find("img").length == 0) {
                                $(element).siblings("input").after("<span class=\"text-red redtip\">!</span>");
                            } else {
                                $(element).parent().find("img").last().after("<span class=\"text-red redtip\">!</span>");
                            }
                        } else {
                            if ($(element).siblings("img").length == 0) {
                                $(element).after("<span class=\"text-red redtip\">!</span>");
                            } else {
                                $(element).siblings("img").last().after("<span class=\"text-red redtip\">!</span>");
                            }
                        }
                    }
                }
            } else if (regexs[i].toLowerCase() === 'email') { //邮箱
                var result = value.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
                if (result == null) {
                    jsonResult.isCheck = false;
                }
            } else if (regexs[i].toLowerCase() === 'phone') { //电话
                var result = value.match(/\d{3}-\d{8}|\d{4}-\d{7}/);
                if (result == null) {
                    jsonResult.isCheck = false;
                }
            } else if (regexs[i].toLowerCase() === 'connect') { //联系方式
                var result = value.match(/^\d{3}-\d{8}|\d{4}-\d{7,8}$/);
                if (result == null) {
                    result = value.match(/^[1][0-9][0-9]{9}$/);
                }
                if (result == null) {
                    jsonResult.isCheck = false;
                }
            } else if (regexs[i].toLowerCase() === 'number') { //纯数字
                var result = value.match(/^[0-9]*$/);
                if (result == null) {
                    jsonResult.isCheck = false;
                }
            } else if (regexs[i].toLowerCase() === 'english') { //纯英文
                var result = value.match(/^[a-zA-Z]*$/);
                if (result == null) {
                    jsonResult.isCheck = false;
                }
            } else if (regexs[i].toLowerCase() === 'chinese') { //纯中文
                var result = value.match(/^[\u4e00-\u9fa5]*$/);
                if (result == null) {
                    jsonResult.isCheck = false;
                }
            } else if (regexs[i].toLowerCase() === 'integer') { //整数
                var result = value.match(/^-?\d+$/);
                if (result == null) {
                    jsonResult.isCheck = false;
                }
            } else if (regexs[i].toLowerCase() === 'hascode') { //至少一个字符
                var result = value.match(/([a-z A-Z ]|[^\u0000-\u00FF])/);
                if (result == null) {
                    jsonResult.isCheck = false;
                }
            } else if (regexs[i].toLowerCase() === 'decimal') { //浮点数
                var result = value.match(/^(-?\d+)(\.\d+)?$/);
                if (result == null) {
                    jsonResult.isCheck = false;
                }
            } else if (regexs[i].toLowerCase() === 'mobile') { //手机号码
                var regu = /^[1][0-9][0-9]{9}$/;
                var re = new RegExp(regu);
                if (!re.test(value)) {
                    jsonResult.isCheck = false;
                }
            } else if (regexs[i].toLowerCase() === 'card') { //账/卡号,允许输入数字和“+”号
                var regu = /^[0-9]([0-9])+$/;
                var re = new RegExp(regu);
                if (!re.test(value)) {
                    jsonResult.isCheck = false;
                }
            } else if (regexs[i].toLowerCase() === 'zipcode') { //邮政编码
                var result = value.match(/[1-9]\d{5}(?!\d)/);
                if (result == null) {
                    jsonResult.isCheck = false;
                }
            } else if (regexs[i].toLowerCase() === 'shuziandmu') { //数字+字母
                var result = value.match(/^[A-Za-z0-9]*$/);
                if (result == null) {
                    jsonResult.isCheck = false;
                }
            } else if (regexs[i].toLowerCase() === 'idcard') { //身份证号码
                //var isIDCard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
                //var isIDCard2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
                var isIDCard1 = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if (!isIDCard1.test(value)) {
                    jsonResult.isCheck = false;
                }
            } else if (regexs[i].toLowerCase() === 'tdate') { //日期格式
                var result = value.match(/^(\d{1,4})(\d{1,2})(\d{1,2})$/);
                if (result == null) {
                    jsonResult.isCheck = false;
                } else {
                    var d = new Date(result[1], result[2] - 1, result[3]);
                    jsonResult.isCheck = (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[2] && d.getDate() == result[3]);
                }
            } else if (regexs[i].toLowerCase().length > 9 && regexs[i].toLowerCase().substring(0, 9) === "maxlength") { //最大长度
                var len = parseInt(regexs[i].toLowerCase().substring(9));
                if (value.length > len) {
                    $(element).val(value.substring(0, len));
                    jsonResult.isCheck = false;
                }
            } else if (regexs[i].toLowerCase().length > 9 && regexs[i].toLowerCase().substring(0, 9) === "minlength") { //最小长度
                var len = parseInt(regexs[i].toLowerCase().substring(9));
                if (value.length < len) {
                    jsonResult.isCheck = false;
                }
            } else if (regexs[i].toLowerCase().length > 8 && regexs[i].toLowerCase().substring(0, 8) === "maxvalue") { //最大值
                var ccode = regexs[i].toLowerCase().substring(8);
                var max = parseFloat(ccode);
                var isdate = false;
                if (isNaN(max)) {
                    isdate = true;
                    max = regexs[i].toLowerCase().substring(8);
                    max = $("#" + max).val();
                    max = max.split(',').join('');
                    if (max == '' || max == undefined) {
                        max = parseInt(0);
                    } else {
                        max = parseFloat(max);
                    }
                }
                if (value > max) {
                    jsonResult.isCheck = false;
                }
                if (isdate && max == 0) {
                    jsonResult.isCheck = true;
                }
            } else if (regexs[i].toLowerCase().length > 8 && regexs[i].toLowerCase().substring(0, 8) === "minvalue") { //最小值
                var ccode = regexs[i].toLowerCase().substring(8);
                var min = parseFloat(ccode);
                var isdate = false;
                if ($.trim(min) == 'undefined' || $("#" + min) == 'undefined' || $.trim(min) == 'NaN') {
                    //console.log("sssss1:" + min);
                    jsonResult.isCheck = true;
                } else {
                    if (isNaN(min)) {
                        isdate = true;
                        min = regexs[i].toLowerCase().substring(8);
                        min = $("#" + min).val();
                        min = min.split(',').join('');
                        if (min == '' || min == undefined) {
                            min = parseInt(0);
                        } else {
                            min = parseFloat(min);
                        }
                    }
                    if (value < min) {
                        jsonResult.isCheck = false;
                    }
                    if (isdate && min == 0) {
                        jsonResult.isCheck = true;
                    }
                }
            } else if (regexs[i].toLowerCase().length > 8 && regexs[i].toLowerCase().substring(0, 8) === "yesequal") { //等于
                var equal = parseFloat(regexs[i].toLowerCase().substring(8));
                if (value != equal) {
                    jsonResult.isCheck = false;
                }
            } else if (regexs[i].toLowerCase().length > 8 && regexs[i].toLowerCase().substring(0, 8) === "notequal") { //不等于
                var notequal = parseFloat(regexs[i].toLowerCase().substring(8));
                if (value == notequal) {
                    jsonResult.isCheck = false;
                }
            } else if (regexs[i].toLowerCase().length > 9 && regexs[i].toLowerCase().substring(0, 12) === "singlelength") { //固定长度
                var len = parseInt(regexs[i].toLowerCase().substring(12));
                if (value.length != len) {
                    jsonResult.isCheck = false;
                }
            } else {
                var result = new RegExp(regexs[i]).test(value); //正则
                if (!result && messages[i]) {
                    jsonResult.isCheck = false;
                }
            }

            if (!jsonResult.isCheck) {
                jsonResult.index = i;
                jsonResult.errormsg = messages[i];
                if (checkArrayObj(jsonResult, bank.errors)) {
                    bank.errors.push(jsonResult);
                }
                return jsonResult;
            }
        }
        return jsonResult;
    }

    function checkArrayObj(obj, arrayObj) {
        for (var i = 0; i < arrayObj.length; i++) {
            if (arrayObj[i].obj == obj.obj) {
                return false;
            }
        }
        return true;
    }

    //*
    // * 这个函数拷贝了三次，虽然我也不想这么做(优化了之后，就只剩这个了)


    function IESet(cdata) {
        var width = window.screen.width;   //获取屏幕宽度
        if (width < 1920) {
            if (isIE()) {
                if (formid != "010001") {
                    $("label").removeAttr("disabled");
                    if (cdata.sysname == "核心系统") {
                        $(".bankmap").css("min-width", "auto");
                        $(".bankmap").css("font-size", "13px");
                        var three_col = "030101,080101,080102,080201,030107";
                        if (three_col.indexOf(formid) > -1) {
                            $(".bankmap").css("width", "900px");
                            $(".foot").css("width", "900px");
                        } else {
                            $("td:even").css("width", "100px");
                            $("td:even label").css("width", "100px")
                            $(".bankmap").css("width", "600px");
                            $(".foot").css("width", "600px");
                            $(".foot span").last().css("margin-right", "10px");
                            var controls = $("input,select");
                            for (var i = 0; i < controls.length; i++) {
                                var width = $(controls[i]).width();
                                if ($(controls[i]).get(0).tagName == "SELECT") {
                                    if (width <= 180) {
                                        $(controls[i]).css("width", "160px");
                                        $(controls[i]).next().css("width", "136px");
                                    } else {
                                        $(controls[i]).css("width", "80%");
                                        $(controls[i]).next().css("width", "70%");
                                    }

                                } else {
                                    var id = $(controls[i]).attr("id");
                                    if (id != undefined && id != "undefined") {
                                        if (width <= 180) {
                                            $(controls[i]).css("width", "150px");
                                        } else {
                                            $(controls[i]).css("width", "80%");
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (cdata.sysname == "二代支付系统") {
                        $(parent.document.getElementById("div_nr")).css("margin-left", "0px");

                        //$(".mbx").css("width", "100%").css("padding", "0px").css("height","40px");
                        //$(".mbx li").css("float", "left").css("padding", "5px"); 

                        $(".bankmap").css("min-width", "auto");
                        $(".bankmap").css("font-size", "13px");
                        $(".bankmap").css("width", "750px");
                        $(".con-map").css("width", "100%");
                        $(".foot").css("width", "750px");
                    }
                    if (cdata.sysname == "二代农信银支付系统") {
                        $(parent.document.getElementById("div_nr")).css("margin-left", "0px");
                        $("td:even").css("width", "80px");
                        $("td:even label").css("width", "80px")
                        $("td:odd").css("width", "250px");

                        $(".bankmap").css("min-width", "auto");
                        $(".bankmap").css("font-size", "13px");
                        $(".bankmap").css("width", "750px");
                        $(".con-map").css("width", "100%");
                        $(".foot").css("width", "750px");
                    }
                    if (cdata.sysname == "行内汇兑系统") {
                        $(".bankmap").css("min-width", "auto");
                        $(".bankmap").css("font-size", "13px");

                        $("td:even").css("width", "80px");
                        $("td:even label").css("width", "80px")
                        $("td:odd").css("width", "250px");

                        $(".bankmap").css("width", "700px");
                        $(".con-map").css("width", "100%");
                        $(".foot").css("width", "700px");
                    }
                    if (cdata.sysname == "网上银行管理系统") {
                        $(".bankmap").css("min-width", "auto");
                        $(".bankmap").css("font-size", "13px");

                        $("td:even").css("width", "100px");
                        $("td:even label").css("width", "100px")
                        $("td:odd").css("width", "100px");
                        $("input").css("width", "150px");

                        $(".bankmap").css("width", "750px");
                        $(".con-map").css("width", "100%");
                        $(".foot").css("width", "750px");


                    }
                    if (cdata.sysname == "财税库银系统") {
                        $(".bankmap").css("min-width", "auto");
                        $(".bankmap").css("font-size", "13px");

                        $("td:even").css("width", "80px");
                        $("td:even label").css("width", "80px")
                        $("td:odd").css("width", "250px");

                        $(".bankmap").css("width", "700px");
                        $(".con-map").css("width", "100%");
                        $(".foot").css("width", "700px");
                    }

                    var width = $("#iframeID").parent().width();
                    $("#iframeID").width(width);
                }
            }
        }
    }
});
function isIE() { //ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}

function parentInLayer() {
    window.parent.postMessage("closeInChilder", "*");
}