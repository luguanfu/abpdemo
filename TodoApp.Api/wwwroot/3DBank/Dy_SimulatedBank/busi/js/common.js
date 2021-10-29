$(function () {
    tools.event();
    tbObj.event();
    // $(document).on("click", ".form-save", function() {
    // 	var ctrlid=$("#ctrlID").val();
    // 	var ctrltitle=$("#ctrlTitle").val();
    // 	var typeid=$("#ctrlType").val();
    //     tbObj.add(tools.getCtrl({ctrlid:ctrlid,ctrltitle:ctrltitle,typeid:typeid}));
    // });
});


var tbObj = {
    selects: function () {
        return $(".highlight");
    },
    add: function (html) {
        this.selects().html(html);
        this.selects().removeClass("highlight")
    },
    event: function () {
        $(document).on("click", "#checktable", function () {
            var str = "";
            $(".form-item").each(function (i, e) {
                var pares = {};
                $($(e).data("keypairs").split('&')).each(function (ii, ee) {
                    var single = ee.split('=');
                    pares[single[0]] = single[1];
                });

                str += "|";
                str += pares.Title + ',' + pares.ControlName + ',' + pares.ControlType + ',' + pares.ControlKey
                //_items.push(pares);

            });
            if (str.length > 0) { str = str.substring(1);}
            //alert(str)
            $.ajax({
                cache: true,
                type: "POST",
                url: '/HY_index/CheckTable',
                data: { str: str, formid: $("#FormId").val() },
                success: function (data) {
                    alert("执行成功！")
                }
            });

        });
        $(document).on("click", ".form-item", function () {
            var pares = {};
            var regex = [];
            $($(this).data("keypairs").split('&')).each(function (i, e) {
                var single = e.split('=');
                pares[single[0]] = single[1];
            });
            var _that = $(this);
            $("#cssLength").val(_that.css("width"));

            //规则
            var vlregex = $(this).attr("vl-regex");
            var vlmessage = $(this).attr("vl-message");

            if (vlregex != undefined && vlregex != '') {
                pares.regexs = {
                    codes: eval(vlregex),
                    msgs: eval(vlmessage)
                };
            }

            var vldisabled = $(this).attr("vl-disabled");
            if (vldisabled != undefined && vldisabled == 'true') {
                pares.disabled = true;
            }

            var kuaicha = $(this).attr("kuaicha");
            if (kuaicha != undefined && kuaicha == 'true') {
                pares.kuaicha = true;
                if ($(this).siblings("img").length == 0) {
                    pares.kuaichaitems = $(this).parent().siblings("img").attr("vl-select");
                } else { pares.kuaichaitems = $(this).siblings("img").attr("vl-select"); }

            }

            var jinejiaoyan = $(this).attr("jinejiaoyan");
            if (jinejiaoyan != undefined && jinejiaoyan == 'true') {
                pares.jinejiaoyan = true;
            }

            //依赖
            var relys = $(this).attr("vl-rely");
            if (relys != undefined && relys != '') {
                pares.relys = relys.split(',');
            }
            //console.log(pares)
            tools.init(pares);
            $(this).addClass("on");

            //如果是下拉框
            if ($(this).get(0).tagName == 'SELECT') {
                tools.getselectitems($(this).text(), $(this).attr("sleregs"), $(this).attr("sletabable"), $(this).attr("sleable"), $(this).attr("slezhiyu"));
            }
        });

        $(document).on("click", ".box .tab li", function () {
            var index = $(this).index();
            $(this).parents(".box").find(".one").removeClass("one");
            $(this).addClass("one");
            $(this).parents(".box").find(".ct").hide();
            $(this).parents(".box").find(".ct").eq(index).show();
        });

        $(".form-item,.con-map2 .tab li").each(function (i, e) {
            $(this).attr("title", $(this).attr("id"));
        });

        $(document).on("keyup", "#mapwidth", function () {
            var width = $(this).val();
            $(".bankmap").css("width", parseInt(width).toString() + "px");
            $("#mainLength").val(parseInt(width).toString());
            //$(".bankmap").children().css("width",parseInt(width).toString()+"px");
        });

        $("#mapwidth").val($(".bankmap").width());
    }
}

var tools = {
    regex: [{ key: '非空字段', value: 'require' }, { key: '邮箱格式', value: 'email' }, { key: '联系方式格式', value: 'connect' }, { key: '电话格式', value: 'phone' }, { key: '手机格式', value: 'mobile' },
    { key: '邮编格式', value: 'zipcode' }, { key: '日期格式', value: 'tdate' }, { key: '身份证格式', value: 'idcard' }, { key: '数字加字母格式', value: 'shuziandmu' }, { key: '账/卡号格式', value: 'card' }, { key: '纯数字格式', value: 'number' }, { key: '浮点数', value: 'decimal' }, { key: '整数', value: 'integer' }, { key: '最大值', value: 'maxvalue' }, { key: '最小值', value: 'minvalue' }, { key: '等于', value: 'equal' }, { key: '不等于', value: 'notequal' }, { key: '不能全为数字', value: 'hascode' }, { key: '最小长度', value: 'minlength' }, { key: '最大长度', value: 'maxlength' }],
    event: function () {
        

        $(document).on("change", ".ctrlids", function () {
            $(this).parent().find(".ctrlid").val($(this).val());
        });

        $(document).on("click", ".btnregcopy", function () {
            var $C = $(this).parents(".regsleitem").clone(true);
            $(this).parents(".regsleitem").after($C);
        });

        $(document).on("click", ".btngroup", function () {
            var name = prompt("请输入分组名称", "");
            if (name != "") {
                tbObj.selects().find(".form-item").attr("group-name",name);
            }
        });

        $(document).on("change", ".tipscontent select", function () {
            $(this).parent().find("input").val($(this).val());
        });

        $(document).on("change", "#profile .regex .regitem .RexName", function () {
            var value = $(this).val();
            $(this).siblings(".numreg").addClass("hide");
            if (value == 'maxlength' || value == 'minlength' || value == 'maxvalue' || value == 'minvalue' || value == 'yesequal' || value == 'notequal') { $(this).siblings(".numreg").removeClass("hide"); }
        });

        $(document).on("change", ".guizelist .regsleitem .sleregs", function () {
            var value = $(this).val();
            $(this).siblings(".numreg").addClass("hide");
            if (value == 'maxlength' || value == 'minlength' || value == 'maxvalue' || value == 'minvalue' || value == 'yesequal' || value == 'notequal') { $(this).siblings(".numreg").removeClass("hide"); }
        });

        $(document).on("click", ".selectlist li", function () {
            var id = $(this).data("id");
            var name = $(this).text();
            //$(this).parent().find(".cur").removeClass("cur");
            $(this).toggleClass("cur");
            $(".bitian,.ketian,.tabguize,.zhiyu").text(name);
            $(".guizelist .regsleitem").remove();
            $(".tabitems input,.ketianitems input").removeAttr("checked");
            $(".ketianitems .defaultvalue,.zhiyuitems .selectbox").val('');
            //console.log($(this).data("regs"))
            //初始化
            if ($(this).data("regs") != undefined) {
                var regs = $(this).data("regs");
                
                $(regs).each(function (ii, ee) {
                    var obj = $(".guizelist .main").clone().removeClass("main hide").addClass("regsleitem");
                    $(tools.itemsids()).each(function (i, e) {
                        if (e.indexOf('label_') == -1) {
                            obj.find(".ctrlids").append("<option " + (ee.id == e ? "selected='selected'" : "") + " value=\"" + e + "\">" + tools.getitemsname(e) + "</option>");
                        }
                    });
                    obj.find(".ctrlid").val(ee.id);
                    var code = ee.reg;
                    var num = 0;
                    if (code.indexOf("maxlength") != -1) {
                        num = code.substring(9); code = "maxlength"; obj.find(".numreg").val(num).removeClass("hide");
                    }
                    if (code.indexOf("minlength") != -1) {
                        num = code.substring(9); code = "minlength"; obj.find(".numreg").val(num).removeClass("hide");
                    }
                    if (code.indexOf("maxvalue") != -1) {
                        num = code.substring(8); code = "maxvalue"; obj.find(".numreg").val(num).removeClass("hide");
                    }
                    if (code.indexOf("minvalue") != -1) {
                        num = code.substring(8); code = "minvalue"; obj.find(".numreg").val(num).removeClass("hide");
                    }
                    if (code.indexOf("yesequal") != -1) {
                        num = code.substring(8); code = "yesequal"; obj.find(".numreg").val(num).removeClass("hide");
                    }
                    if (code.indexOf("notequal") != -1) {
                        num = code.substring(8); code = "notequal"; obj.find(".numreg").val(num).removeClass("hide");
                    }
                    $(tools.regex).each(function (i, e) {
                        obj.find(".sleregs").append("<option " + (code == e.value ? "selected='selected'" : "") + " value=\"" + e.value + "\">" + e.key + "</option>");
                    });
                    obj.find(".tips").val(ee.tips);
                    
                    
                    obj.find(".defaults").val(ee.defaults);
                    var tdisableds = ee.disabled;
                    if (tdisableds == 'true') { obj.find(".disableds").prop("checked", true); }
                    $("#addselectreg").parent().find("ul").append(obj);
                });
            }

            if ($(this).data("tabs") != undefined) {
                var tabs = $(this).data("tabs");//{ id: curid, ishide: ishide, alldisable: alldisable }
                console.log(tabs)
                $(tabs).each(function (i, e) {
                    $(".tabitems .tabbox[value='" + e.id + "']").prop("checked", 'true'==e.ishide);
                    $(".tabitems .tabboxdis[value='" + e.id + "']").prop("checked", 'true' == e.alldisable);
                });
                //$(".tabitems .tabbox").each(function (i, e) {
                //    if ($.inArray($(e).val(), tabs) != -1) {
                //        $(e).prop("checked", true);
                //    } else {
                //        $(e).prop("checked", false);
                //    }
                //});
            }

            if ($(this).data("sles") != undefined) {
                var sles = $(this).data("sles");
                var sleids = [];
                $(sles).each(function (i, e) {
                    var index = e.indexOf('|');
                    sleids.push(e.substring(0, index));
                });
                $(".ketianitems .ketianbox").each(function (i, e) {
                    if ($.inArray($(e).val(), sleids) != -1) {
                        $(e).prop("checked", true);
                        var len = $(e).val().length + 1;
                        $(e).parent().siblings(".defaultvalue").val(sles[i].substring(len));
                    } else {
                        $(e).prop("checked", false);
                        $(e).parent().siblings(".defaultvalue").val('');
                    }
                });
            }

            if ($(this).data("slezhiyu") != undefined) {
                var slezhiyu = $(this).data("slezhiyu");
                var slezhiyuids = [];
                $(slezhiyu).each(function (i, e) {
                    var index = e.indexOf('|');
                    slezhiyuids.push(e.substring(0, index));
                });
                $(".zhiyuitems .selectbox").each(function (i, e) {
                    if ($.inArray($(e).data("id"), slezhiyuids) != -1) {
                        $(slezhiyu).each(function (ii, ee) {
                            var index = ee.indexOf('|');
                            if (ee.substring(0, index) == $(e).data("id")) {
                                $(e).val(ee.substring(1 + index).split(' ').join(','));
                            }
                        });

                    }
                });
            }
        });

        $(document).on("click", "#RexAdd", function () {
            var obj = $(".mainline").clone().removeClass("mainline hide").addClass("regitem");
            obj.find(".RexNameTips").addClass("require");
            $(tools.regex).each(function (i, e) {
                obj.find(".RexName").append("<option value=\"" + e.value + "\">" + e.key + "</option>");
            });
            $(this).parent().find("ul").append(obj);
        });

        $(document).on("click", "#kuaichaAdd", function () {
            var obj = $(".kuaichamainline").clone().removeClass("kuaichamainline hide").addClass("ttkuaichaitem");
            $(tools.itemsids()).each(function (i, e) {
                if (e.indexOf('label_') == -1) {
                    obj.find(".slekuaicha").append("<option value=\"" + e + "\">" + e + "</option>");
                }
            });
            $(this).parent().find("ul").append(obj);
        });

        $(document).on("click", "#addselectreg", function () {
            if ($(".selectlist li.cur").length == 0) {
                alert('请选择下拉值！'); return;
            }
            var obj = $(".guizelist .main").clone().removeClass("main hide").addClass("regsleitem");
            $(tools.itemsids()).each(function (i, e) {
                if (e.indexOf('label_') == -1) {
                    obj.find(".ctrlids").append("<option value=\"" + e + "\">" + e + "</option>");
                }
            });
            $(tools.regex).each(function (i, e) {
                obj.find(".sleregs").append("<option value=\"" + e.value + "\">" + e.key + "</option>");
            });
            $(this).parent().find("ul").append(obj);
        });

        $(document).on("click", "#saveselectreg", function () {
            if ($(".selectlist li.cur").length == 0) {
                alert('请选择下拉值！'); return;
            }
            var sleregs = [];
            $(".guizelist .regsleitem").each(function (i, e) {
                if (1 == 1) {//$(e).find(".tips").val() != '
                    var ccode = $(e).find(".sleregs").val();
                    if ($(e).find(".sleregs").val() == "maxlength") {
                        ccode = "maxlength" + $(e).find(".numreg").val();
                    }
                    else if ($(e).find(".sleregs").val() == "minlength") {
                        ccode = "minlength" + $(e).find(".numreg").val();
                    }
                    else if ($(e).find(".sleregs").val() == "maxvalue") {
                        ccode = "maxvalue" + $(e).find(".numreg").val();
                    }
                    else if ($(e).find(".sleregs").val() == "minvalue") {
                        ccode = "minvalue" + $(e).find(".numreg").val();
                    }
                    else if ($(e).find(".sleregs").val() == "yesequal") {
                        ccode = "yesequal" + $(e).find(".numreg").val();
                    }
                    else if ($(e).find(".sleregs").val() == "notequal") {
                        ccode = "notequal" + $(e).find(".numreg").val();
                    }
                    else {
                        ccode = $(e).find(".sleregs").val();
                    }


                    var ischeck = $(e).find(".disableds:checked").length > 0 ? "true" : "false";
                    var _ctrlid = $(e).find(".ctrlid").val();
                    if ($("#" + _ctrlid).length > 0) {
                        sleregs.push({ id: $(e).find(".ctrlid").val(), reg: ccode, tips: $(e).find(".tips").val(), defaults: $(e).find(".defaults").val(), disabled: ischeck });
                    }
                }
            });
            $(".selectlist li.cur").data("regs", sleregs);


            //tab面板
            var tabitems = [];
            $(".tabitems li").each(function (i, e) {
                var curid = $(e).find(".tabbox").val();
                var ishide = $(e).find(".tabbox:checked").length > 0 ? "true" : "false";
                var alldisable = $(e).find(".tabboxdis:checked").length > 0 ? "true" : "false";
                if (ishide == 'true' || alldisable == 'true') {
                    tabitems.push({ id: curid, ishide: ishide, alldisable: alldisable });
                }
            });
            $(".selectlist li.cur").data("tabs", tabitems);

            //选填项目
            var ketianitems = []; ketianids = [];
            $(".ketianitems input:checked").each(function (i, e) {
                var defvalue = $(e).parent().siblings(".defaultvalue").val();
                if (defvalue != undefined) {
                    ketianitems.push($(e).val() + "|" + defvalue);
                    ketianids.push($(e).val());
                }
            });

            //值域控制
            var selectitems = [];
            $(".zhiyuitems input").each(function (i, e) {
                var value = $(e).val();
                if (value != undefined && value != '') {
                    selectitems.push($(e).data("id") + "|" + value.split(',').join(' '));
                }
            });

            $(".selectlist li.cur").data("sles", ketianitems);
            $(".selectlist li.cur").data("sleids", ketianids);
            $(".selectlist li.cur").data("slezhiyu", selectitems);
        });

        $(document).on("click", ".btnregdelete,.btnkuaichadelete", function () {
            $(this).parents(".huise").remove();
        });

        $(document).on("click", ".btnregsledelete", function () {
            $(this).parent().remove();
        });

        //$("#slider-range-max").slider({
        //    range: "max",
        //    min: 1,
        //    max: 500,
        //    value: 140,
        //    slide: function (event, ui) {
        //        $("#cssLength").val(ui.value);
        //        tbObj.selects().find("input").css({ "width": ui.value });
        //    }
        //});

        //控件类型选中事件
        $(document).on("change", "#ControlType", function () {
            //默认的控件前缀
            var ss = ["txt_", "sle_", "redio_", "check_", "hid_", "date_", "pwd_", "money_", "label_", "combox_", "txt_"];

            //下拉框才显示字典字段
            $("#ControlKey").parents(".form-group").addClass("hide");
            if (parseInt($(this).val()) == 2 || parseInt($(this).val()) == 10) {
                $("#ControlKey").parents(".form-group").removeClass("hide");
            }

            //初始化默认的控件名称
            $("#ControlName").val(ss[parseInt($(this).val()) - 1]);
        });

        //给当前面板添加标志
        $(document).on("click", ".bankmap .con-map2,.bankmap .con-map", function () {
            $(".bankmap").find(".selected").removeClass("selected");
            $(this).addClass("selected");
        });

        //添加面板
        $(document).on("click", ".btnaddpane", function () {
            $(".bankmap .foot").before($("<div class=\"con-map2\"><table id=\"qv\" class=\"con-map2-table qv\"><tr><td>A</td><td>B</td><td>C</td><td>D</td></tr></table></div>"));
        });

        //添加面板
        $(document).on("click", ".btnedaddpane", function () {
            $(".bankmap").append($("<div class=\"con-map\"><span class=\"top-title\">基本信息 <span id=\"dianji_con\" style=\"cursor: pointer;\">▼</span></span><table id=\"qv\" class=\"con-map2-table qv\"><tr><td>A</td><td>B</td><td>C</td><td>D</td></tr></table></div>"));
        });

        //添加tab面板
        $(document).on("click", ".btnaddtabpane", function () {
            var tabs = [];
            while (confirm("是否输入Tab页名称？")) {
                var name = prompt("请输入Tab页名称", "");
                if (name != "") {
                    tabs.push(name);
                }
            }
            var html = $("<div class=\"con-map2\"><div class=\"box\"></div></div>");

            if (tabs.length > 0) {
                var tablen = $(".con-map2 .tab").length;
                html.find(".box").append($("<ul class=\"tab\"></ul>"));
                html.find(".box").append("<div class=\"content\"></div>");
                $(tabs).each(function (i, e) {
                    var ran = "tab_" + tablen + "_" + i;
                    html.find(".box .tab").append("<li title='" + ran + "' id='" + ran + "'" + (i > 0 ? "class='one " + ran + "'" : "class='" + ran + "'") + ">" + e + "</li>");
                    html.find(".box .content").append("<div class=\"ct\" " + (i > 0 ? "style='display:none'" : "") + "><table id=\"qv\" class=\"con-map2-table qv\"><tr><td>A</td></tr></table></div>");
                });
            }
            $(".bankmap .foot").before(html);
        });

        //初始化依赖项
        $(tools.itemsids()).each(function (i, e) {
            if (e.indexOf('label_') == -1) {
                $(".relyitems").append("<label><input type=\"checkbox\" class=\"relybox\" value=\"" + e + "\">" + e + "</label>");
            }
        });

        //初始化下拉框控制可选项
        $(tools.itemsids()).each(function (i, e) {
            if (e.indexOf('label_') == -1) {
                $(".ketianitems").append("<li><label class='line'><input type=\"checkbox\" class=\"ketianbox\" value=\"" + e + "\">" + e + "</label><label>默认值</label><input type='text' class='defaultvalue'/></li>");
            }
        });

        //初始化tab面板
        $(".con-map2 .tab li").each(function (i, e) {
            $(".tabitems").append("<li><label class='line'>" + $(e).attr("id") + "</label><input type=\"checkbox\" class=\"tabbox\" value=\"" + $(e).attr("id") + "\"><label class='line'>隐藏</label><input type=\"checkbox\" class=\"tabboxdis\" value=\"" + $(e).attr("id") + "\">内部元素不可用</li>");
        });

        //初始化下拉框值域
        $(tools.getselects()).each(function (i, e) {
            $(".zhiyuitems").append("<li><label class='line'>" + e + "</label><input type=\"text\" class=\"selectbox\" data-id=\"" + e + "\"/></li>");
        });
    },
    getCtrl: function (data) {
        var html = "";
        switch (parseInt(data.ControlType)) {
            case 1:
                html = $("<input type='text' oncopy=\"return false;\"  oncut=\"return false;\"/>");
                break;
            case 2:
                html = $("<select>$1:" + data.ControlKey + ":" + data.ControlName + "$</select>");
                break;
            case 3:
                html = $("<input type='radio'/>");
                break;
            case 4:
                html = $("<input type='checkbox'/>");
                break;
            case 5:
                html = $("<input type='hidden'/>");
                break;
            case 6:
                html = $("<input type='text'/>");
                html.addClass("date");
                break;
            case 7:
                html = $("<input type='password' oncopy=\"return false;\" onpaste=\"return false;\" oncut=\"return false;\"/>");
                break;
            case 8:
                html = $("<input type='text' oncopy=\"return false;\" onpaste=\"return false;\" oncut=\"return false;\"/>");
                html.attr("vl-type", "money");
                break;
            case 9:
                var title_ = data.Title;
                if (title_.indexOf('i') > -1) {
                    title_ = title_.split('i').join('<i></i>');
                }
                if (title_.indexOf('s') > -1) {
                    title_ = title_.split('s').join('<s></s>');
                }
                html = $("<label>" + title_ + "</label>");
                break;
            case 10:
                html = $("<div vl-type='combox'><p><input type=\"text\" oncopy=\"return false;\" onpaste=\"return false;\" oncut=\"return false;\"/></p><ul class='hide'>$2:" + data.ControlKey + ":" + data.ControlName + "$</ul></div>");
                html.addClass("xcombox");
                break;
            case 11:
                html = $("<label></label>");
                break;
        }

        html.removeAttr("vl-disabled").removeAttr("vl-default").removeAttr("vl-rely");

        html.attr("vl-keyup", "wwww");
        html.attr("vl-default", data.DefaultValue);
        html.attr("id", data.ControlName);
        html.attr("data-keypairs", tools.paramtersArray().join('&'));
        html.addClass("form-item " + data.Position);
        if (parseInt(data.ControlType) != 9) {
            html.css({ "width": data.cssLength });
        }

        //设置不可用
        if ($(".bukeyong").is(':checked')) {
            html.attr("vl-disabled", "true");
        }

        if ($(".kuaicha").is(':checked')) {
            html.attr("kuaicha", "true");
        }
        if ($(".jinejiaoyan").is(':checked')) {
            html.attr("jinejiaoyan", "true");
        }
        //提示ID
        html.attr("vl-tipsid", data.PromptId);

        //规则
        html.removeAttr("vl-regex").removeAttr("vl-message");
        var addregex = this.regexs();
        if (addregex.length > 0) {
            var codes = [], msgs = [];
            $(addregex).each(function (i, e) {
                codes.push("&quto;" + e.code + "&quto;");
                msgs.push("&quto;" + e.msg + "&quto;");
            });
            //console.log(codes)
            html.attr("vl-regex", "[" + codes.join(', ') + "]");
            html.attr("vl-message", "[" + msgs.join(',') + "]");
        }

        //依赖项
        var relys = tools.getrelys();
        if (relys.length > 0) {
            html.attr("vl-rely", relys.join(','));
        }
        

        if (parseInt(data.ControlType) == 2) {//下拉框
            var sleregs = [];
            var _reg = ""; var _tab = ""; var _sle = ""; var _slezhiyu = "";
            $("#xiala .selectlist li").each(function (ii, ee) {

                //规则
                var data = $(ee).data("regs");
                if (data != undefined && data.length > 0) {
                    _reg += $(ee).data("id") + ":";
                    var id = [];
                    var rr = [], tt = [], dd = [], yy = [];
                    rr[0] = ''; tt[0] = ''; dd[0] = ''; yy[0] = '';
                    $(data).each(function (i, e) {

                        var _n = -1;
                        for (var j = 0; j < id.length; j++) {
                            if (id[j] == e.id) {
                                _n = j;
                            }
                        }
                        if (_n > -1) { rr[j] += '*' + e.reg; tt[j] += '*' + e.tips; dd[j] += '*' + e.defaults; yy[j] += '*' + e.disabled; }
                        else {
                            id.push(e.id);
                            rr.push(e.reg);
                            tt.push(e.tips);
                            dd.push(e.defaults);
                            yy.push(e.disabled);
                        }
                    });

                    _reg += id.join(',') + "|";
                    _reg += rr.join(",") + "|";
                    _reg += tt.join(",") + "|";
                    _reg += dd.join(",") + "|";
                    _reg += yy.join(",") + "|";
                    _reg += "#";
                }

                //tab面板
                var tabs = $(ee).data("tabs");
                if (tabs != undefined && tabs.length > 0) {
                    _tab += $(ee).data("id") + ":";
                    $(tabs).each(function (i, e) {
                        _tab +=e.id+"|"+e.ishide+"|"+e.alldisable+",";
                        
                    });
                    _tab += "#";
                }
                //console.log(_tab)

                //下拉框值域控制
                var slezhiyu = $(ee).data("slezhiyu");
                if (slezhiyu != undefined && slezhiyu.length > 0) {
                    _slezhiyu += $(ee).data("id") + ":" + slezhiyu.join(',');
                    _slezhiyu += "#";
                }

                //选填项目
                var sles = $(ee).data("sles");
                if (sles != undefined && sles.length > 0) {
                    _sle += $(ee).data("id") + ":" + sles.join(',');
                    _sle += "#";
                }

            });
            html.attr("sleregs", _reg);
            html.attr("sletabable", _tab);
            html.attr("sleable", _sle);
            html.attr("slezhiyu", _slezhiyu);
            //console.log(_reg)

        }

        var temp = html.get(0).outerHTML;
        if (parseInt(data.ControlType) == 2) {
            temp = "<div class='slectstyle'>" + temp + "</div>";
        }
        if (parseInt(data.ControlType) ==3) {
            temp =temp + data.Title;
        }
        if (parseInt(data.ControlType) == 6) {//日期
            temp = temp + "<img onclick=\"WdatePicker({el:'" + data.ControlName + "',dateFmt:'yyyyMMdd'})\" src=\"/javascripts/My97DatePicker/skin/datePicker.gif\" align=\"absmiddle\" style=\"width:16px;height:22px;margin-left:6px;\">";
        }

        //设置快查按钮
        if ($(".kuaicha").is(':checked')) {
            var tttemp = "";
            $(".ttkuaichaitem").each(function (i, e) {
                tttemp += "," + ($(e).find("select").val() + "|" + ($(e).find(".ckkuaicha").is(':checked') ? "1" : "0") + "|" + ($(e).find(".ckexists").is(':checked') ? "1" : "0")) + "";
            });
            if (tttemp.indexOf(",") != -1) { tttemp = tttemp.substring(1); }
            if (tttemp.length > 0) { tttemp = "vl-select='" + tttemp + "'"; }
            temp = temp + "<img class=\"sousuo\" src=\"/busi/img/banksousuo.png\" " + tttemp + " vl-exec=\"false\" vl-message=\"['" + data.Title + "查询未执行！']\">";
        }
        if (parseInt(data.ControlType) == 8) {
            temp = "<div class='moneystyle'>" + temp + "<label class='moneytips hide'>人民币CNY¥<span class='num'>0</span><span class='cn'></span></label>" + "</div>";
        }

        

        html = temp + $("<div id='" + data.PromptId + "'></div>").addClass("tipsmsg").get(0).outerHTML;//.css("width", data.cssLength + "px")
        //html.attr();
        return html;
    },
    regexs: function () {
        var items = [];
        $(".regex .regitem").each(function () {
            if (1 == 1) {//$(this).find(".RexNameTips").val() != ''
                if ($(this).find(".RexName").val() == "maxlength") {
                    items.push({ code: "maxlength" + $(this).find(".numreg").val(), msg: $(this).find(".RexNameTips").val() });
                }
                else if ($(this).find(".RexName").val() == "minlength") {
                    items.push({ code: "minlength" + $(this).find(".numreg").val(), msg: $(this).find(".RexNameTips").val() });
                }
                else if ($(this).find(".RexName").val() == "maxvalue") {
                    items.push({ code: "maxvalue" + $(this).find(".numreg").val(), msg: $(this).find(".RexNameTips").val() });
                }
                else if ($(this).find(".RexName").val() == "minvalue") {
                    items.push({ code: "minvalue" + $(this).find(".numreg").val(), msg: $(this).find(".RexNameTips").val() });
                }
                else if ($(this).find(".RexName").val() == "yesequal") {
                    items.push({ code: "yesequal" + $(this).find(".numreg").val(), msg: $(this).find(".RexNameTips").val() });
                }
                else if ($(this).find(".RexName").val() == "notequal") {
                    items.push({ code: "notequal" + $(this).find(".numreg").val(), msg: $(this).find(".RexNameTips").val() });
                }
                else {
                    items.push({ code: $(this).find(".RexName").val(), msg: $(this).find(".RexNameTips").val() });
                }
            }
        });
        return items;
    },
    save: function () {
        //console.log($.inArray(tools.paramters().ControlName, tools.itemsids()))
        var edit = false;
        if (!tools.check()) {
            if (!confirm("已有名称一样的控件，确定覆盖吗？")) {
                return;
            } else {
                edit = true;
            }
        }
        if (tbObj.selects().length != 1) {
            alert('请正确选择右侧的表格元素！');
            return;
        }
        $("#PromptId").val($("#ControlName").val() + "_tips");
        tbObj.add(tools.getCtrl(tools.paramters()));
        $(".hidmainwidth").remove();
        $("#Html").val($(".bankmap").html() + "<input type='hidden' class='hidmainwidth' value=" + $("#mainLength").val() + "/>");//

        var data_ = $('#signupForm').serialize();
        if (edit) { data_ += "&newid=22"; }
        //console.log(data_)
        $.ajax({
            cache: true,
            type: "POST",
            url: '/Configure/Configure_Save',
            data: data_,
            async: false,
            success: function (data) {
                if (data > 0) {
                    console.log($('#signupForm').serialize().split('&'))
                    tools.reset();
                    location.href = location.href;
                }
            }
        });
    },
    reset: function () {
        $('#signupForm')[0].reset()
    },
    paramters: function () {
        var pares = {};
        $(decodeURIComponent($('#signupForm').serialize(), true).split('&')).each(function (i, e) {
            var single = e.split('=');
            pares[single[0]] = single[1];
        });
        //console.log(pares.Html)
        //console.log(decodeURIComponent(pares.Html, true))
        //$(".con-map2.t2").html(decodeURIComponent($('#signupForm').serialize(), true));
        return pares;
    },
    paramtersArray: function () {
        var pares = [];
        pares.push("Title=" + $("#Title").val());
        pares.push("ControlName=" + $("#ControlName").val());
        pares.push("DefaultValue=" + $("#DefaultValue").val());
        pares.push("ControlType=" + $("#ControlType").val());
        pares.push("Position=" + $("#Position").val());
        pares.push("IfMust=" + $("#IfMust").val());
        pares.push("FieldType=" + $("#FieldType").val());
        pares.push("ControlKey=" + $("#ControlKey").val());
        pares.push("PromptId=" + $("#PromptId").val());
        return pares;
    },
    init: function (data) {
        $("#ControlKey").parents(".form-group").addClass("hide");
        $("#Title").val(data.Title);
        $("#ControlName").val(data.ControlName);
        $("#DefaultValue").val(data.DefaultValue);
        $("#ControlType").val(data.ControlType);
        $("#Position").val(data.Position);
        $("#IfMust").val(data.IfMust);
        $("#FieldType").val(data.FieldType);
        $("#ControlKey").val(data.ControlKey);
        if (parseInt(data.ControlType) == 2) {
            $("#ControlKey").parents(".form-group").removeClass("hide");
        }
        $("#PromptId").val(data.PromptId);

        //初始化规则
        $("#profile .regitem").remove();
        if (data.regexs != undefined) {
            $(data.regexs.codes).each(function (i, e) {
                var rr = "";
                if (e.indexOf("minvalue") != -1) {
                    rr = e.substring(8);
                    e = 'minvalue';
                }
                if (e.indexOf("maxvalue") != -1) {
                    rr = e.substring(8);
                    e = 'maxvalue';
                }
                if (e.indexOf("minlength") != -1) {
                    rr = e.substring(9);
                    e = 'minlength';
                }
                if (e.indexOf("maxlength") != -1) {
                    rr = e.substring(9);
                    e = 'maxlength';
                }
                if (e.indexOf("notequal") != -1) {
                    rr = e.substring(8);
                    e = 'notequal';
                }
                if (e.indexOf("yesequal") != -1) {
                    rr = e.substring(8);
                    e = 'yesequal';
                }
                var obj = $(".mainline").clone().removeClass("mainline hide").addClass("regitem");
                obj.find(".RexNameTips").addClass("require").val(data.regexs.msgs[i]);
                if (rr != '') { obj.find(".numreg").val(rr).removeClass("hide"); }
                $(tools.regex).each(function (ii, ee) {
                    obj.find(".RexName").append("<option " + (ee.value == e ? "selected='selected'" : "") + " value=\"" + ee.value + "\">" + ee.key + "</option>");
                });
                $("#RexAdd").parent().find("ul").append(obj);
            });
        }

        if (data.disabled != undefined && data.disabled == true) {
            $(".bukeyong").attr("checked", "checked");
        }

        if (data.kuaicha != undefined && data.kuaicha == true) {
            $(".kuaicha").attr("checked", "checked");
            console.log(data.kuaichaitems)
            if (data.kuaichaitems != undefined && data.kuaichaitems.length > 0) {
                var items = data.kuaichaitems.split(',');
                $(items).each(function (ii, ee) {
                    var index = ee.indexOf("|");
                    var value = ee.substring(0, index);
                    var disabled = ee.substring(index + 1);
                    //index = disabled.indexOf("|");
                    //disabled = disabled.substring(0, index);
                    var exists = disabled.substring(1 + disabled.indexOf("|"));

                    var obj = $(".kuaichamainline").clone().removeClass("kuaichamainline hide").addClass("ttkuaichaitem");
                    parseInt(disabled) == 1 && obj.find(".ckkuaicha").attr("checked", "checked");
                    parseInt(exists) == 1 && obj.find(".ckexists").attr("checked", "checked");
                    $(tools.itemsids()).each(function (i, e) {
                        if (e.indexOf('label_') == -1) {
                            obj.find(".slekuaicha").append("<option " + (e == value ? "selected='selected'" : "") + " value=\"" + e + "\">" + e + "</option>");
                        }
                    });
                    $("#kuaichaAdd").parent().find("ul").append(obj);
                });
            }
        }

        if (data.jinejiaoyan != undefined && data.jinejiaoyan == true) {
            $(".jinejiaoyan").attr("checked", "checked");
        }

        //初始化依赖项
        if (data.relys != undefined) {
            $(tools.itemsids()).each(function (i, e) {
                if ($.inArray(e, data.relys) != -1) {
                    $(".relyitems .relybox[value='" + e + "']").attr("checked", "checked");
                } else {
                    $(".relyitems .relybox[value='" + e + "']").removeAttr("checked");
                }
            });
        }

        //初始化下拉框值域

    },
    items: function () {
        var _items = [];
        $(".form-item").each(function (i, e) {
            var pares = {};
            $($(e).data("keypairs").split('&')).each(function (ii, ee) {
                var single = ee.split('=');
                pares[single[0]] = single[1];
            });
            _items.push(pares);
        });
        return _items;
    },
    getitemsname: function (id) {
        var name = id;
        $(this.items).each(function (i, e) {
            if (e.id == id) { name = e.ControlName; }
        });
        return name;
    },
    itemsids: function () {
        var ids = [];
        $(this.items()).each(function (i, e) {
            ids.push(e.ControlName);
        });
        return ids.sort();
    },
    check: function () {
        var _check = true;

        //控件名称必须唯一
        if ($.inArray(tools.paramters().ControlName, tools.itemsids()) != -1) {
            _check = false;
        }
        return _check;
    },
    getrelys: function () {
        var items = [];
        $(".relyitems input:checked").each(function (i, e) {
            items.push($(e).val());
        });
        return items.sort();
    },
    getselects: function () {
        var _sles = [];
        $("select.form-item").each(function (i, e) {
            _sles.push($(e).attr("id"));
        });
        return _sles;
    },
    getselectitems: function (name, sleregs, tabable, sleable, slezhiyu) {
        $.ajax({
            url: '/hy_index/getselect',
            data: 'name=' + name,
            dataType: 'json',
            success: function (d) {
                $("#xiala .selectlist ul li").remove();
                $(eval(d)).each(function (i, e) {
                    var $R = $("<li data-id='" + e.Dic_Value + "'>" + e.Dic_Name + "</li>");
                    var obj = [];
                    //1:txt_1,txt_2|,require*email,require|,111*222,1111|#
                    //sleregs.push({ id: $(e).find(".ctrlids").val(), reg: $(e).find(".sleregs").val(), tips: $(e).find(".tips").val() });
                    if (sleregs != undefined && sleregs != '') {
                        var litems = sleregs.split('#');//['1:txt_1,txt_2|,require*email,require|,111*222,1111|']
                        $(litems).each(function (ii, ee) {
                            if (ee != '') {
                                ee = ee.replace("|#", "");
                                var index = ee.indexOf(':');
                                //console.log(ee)
                                var item_value = ee.substring(0, index);
                                ee = ee.substring(index + 1);
                                //console.log("item_value"); console.log(item_value)
                                //console.log("e.Dic_Value"); console.log(e.Dic_Value)

                                if (e.Dic_Value == item_value) {
                                    var subitem = ee.split('|');//['txt_1,txt_2','require*email,require','111*222,1111']
                                    var _ids = [], _regs = [], _tips = [], _defaults = [], _disableds = [];
                                    $(subitem).each(function (iii, eee) {
                                        if (eee != '') {
                                            if (iii == 0) {
                                                _ids = eee.split(',');//['txt_1','txt_2']
                                            }
                                            if (iii == 1) {
                                                _regs = eee.split(',');//['require*email','require']
                                            }
                                            if (iii == 2) {
                                                _tips = eee.split(',');//['111*222','1111']
                                            }
                                            if (iii == 3) {
                                                _defaults = eee.split(',');//['111*222','1111']
                                            }
                                            if (iii == 4) {
                                                _disableds = eee.split(',');//['111*222','1111']
                                            }
                                            //console.log(_ids)
                                        }
                                    });

                                    $(_regs).each(function (iiiii, eeeee) {
                                        if (eeeee != '') {
                                            var _subregs = eeeee.split('*');//['require','email']
                                            var _subtips = _tips[iiiii].split('*');//['111','222']
                                            var _subdefaults = _defaults[iiiii].split('*');//['111','222']
                                            var _subdisableds = _disableds[iiiii].split('*');//['111','222']
                                            $(_subregs).each(function (o, j) {
                                                var _ojid = 0; var _ojreg = j; var _ojtip = _subtips[o]; var _ojdefault = _subdefaults[o]; var _ojdisabled = _subdisableds[o];
                                                //console.log(iiiii)
                                                //console.log(_ids)
                                                _ojid = _ids[iiiii - 1];
                                                //console.log(_ojid)
                                                obj.push({ id: _ojid, reg: _ojreg, tips: _ojtip, defaults: _ojdefault, disabled: _ojdisabled });
                                            });
                                        }
                                    });

                                    $R.data("regs", obj);
                                }
                            }
                        });
                    }
                    if (sleable != undefined && sleable.length > 0) {
                        var litems = sleable.split('#');//1:id1|def1,id2|def3   #2:id1|def1,id2|def3#
                        var _sleids = [];
                        $(litems).each(function (ii, ee) {
                            if (ee != '') {
                                var index = ee.indexOf(':');
                                //console.log(ee)
                                var item_value = ee.substring(0, index);
                                ee = ee.substring(index + 1);
                                if (e.Dic_Value == item_value) {
                                    $R.data("sles", ee.split(','));
                                    //console.log(ee.split(','))
                                }
                            }
                        });
                    }
                    if (tabable != undefined && tabable.length > 0) {
                        var litems = tabable.split('#');
                        $(litems).each(function (ii, ee) {
                            if (ee != '') {
                                var index = ee.indexOf(':');
                                //console.log(ee)
                                var item_value = ee.substring(0, index);
                                ee = ee.substring(index + 1);
                                if (e.Dic_Value == item_value) {
                                    var temptabs = ee.split(',');
                                    var _temptabs = [];
                                    $(temptabs).each(function (i, e) {
                                        if (e.split('|')[0] != undefined && e.split('|')[0] != '') {
                                            _temptabs.push({ id: e.split('|')[0], ishide: e.split('|')[1], alldisable: e.split('|')[2] });
                                        }
                                    });
                                    $R.data("tabs", _temptabs);
                                    //console.log(ee.split(','))
                                }
                            }
                        });
                    }
                    if (slezhiyu != undefined && slezhiyu.length > 0) {
                        var litems = slezhiyu.split('#');//1:sle_Sign|3333wwwwwwww,444444#
                        $(litems).each(function (ii, ee) {
                            if (ee != '') {
                                var index = ee.indexOf(':');
                                //console.log(ee)
                                var item_value = ee.substring(0, index);
                                ee = ee.substring(index + 1);
                                if (e.Dic_Value == item_value) {
                                    //console.log(ee)
                                    $R.data("slezhiyu", ee.split(','));
                                    //console.log(ee.split(','))
                                }
                            }
                        });
                    }
                    $("#xiala .selectlist ul").append($R);
                });
            }
        });
    }
}
