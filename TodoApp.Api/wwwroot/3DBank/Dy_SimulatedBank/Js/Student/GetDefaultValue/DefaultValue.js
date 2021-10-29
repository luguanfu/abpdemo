$(function () {
    getDefault();
});


//获取默认值
function getDefault() {
    var TMNO = getQueryString("FormId");
    var TaskId = getQueryString("TaskId");
    $.ajax({
        url: "/GetDefaultValue/GetDefaultValue",
        data: { "TaskId": TaskId, "TMNO": TMNO},
        type: 'POST',
        async: false,
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                $(".bankmap").append('<input type="hidden" id="DefaultValue" name="DefaultValue" value="' + data[0]["DefaultValue"] + '" />');
            }
        }
    });
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

////获取默认值
//function getDefault() {
//    $.ajax({
//        url: "/GetDefaultValue/GetDefaultValue",
//        data: { "TRId": 1 },
//        type: 'POST',
//        async: false,
//        dataType: 'json',
//        success: function (data) {
//            if (data.length > 0) {
//                console.log("&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*");
//                console.log(data[0]["DefaultValue"]);
//                console.log("&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&*");
//                $(".bankmap").append('<input type="hidden" id="DefaultValue" name="DefaultValue" value="' + data[0]["DefaultValue"] + '" />');
//            }
//        }
//    });
//}



(function (win, doc, _) { 
    //按ENTER跳到下一个输入框
    $("input:text").keypress(function (e) {

        if (e.which == 13) {
            //;
            var inputs = $("input[type=text]:not(:disabled)");
            var idx = inputs.index(this); // 获取当前焦点输入框所处的位置 
            $(inputs[idx]).siblings("img").trigger("click"); //输入框按enter执行快查事件
            if (idx == inputs.length - 1) { // 判断是否是最后一个输入框
                inputs[idx].focus();
            } else {
                inputs[idx + 1].focus(); // 设置焦点  
                //inputs[idx + 1].select(); // 选中文字  
            }
            return false; // 取消默认的提交行为  
        }
    });

    var moduleMap = {};
    var fileMap = {};
    var readyFunctions = [];
    var noop = function () { };
    var bank = function () { };
    bank.errors = [];
    bank.data = '';
    var addListener = doc.addEventListener || doc.attachEvent;
    var removeListener = doc.removeEventListener || doc.detachEvent;

    var eventName = doc.addEventListener ? "DOMContentLoaded" : "onreadystatechange";

    addListener.call(doc, eventName, function () {
        for (var i = readyFunctions.length - 1; i >= 0; i--) {
            if (readyFunctions[i]) {
                for (var j = 0; j < readyFunctions[i].length; j++) {
                    readyFunctions[i][j]();
                }
            }
        }
    }, false);

    var Events = {
        on: function (eventType, handler) {
            if (!this.eventMap) {
                this.eventMap = {};
            }

            if (!this.eventMap[eventType]) {
                this.eventMap[eventType] = [];
            }
            this.eventMap[eventType].push(handler);
        },

        off: function (eventType, handler) {
            for (var i = 0; i < this.eventMap[eventType].length; i++) {
                if (this.eventMap[eventType][i] === handler) {
                    this.eventMap[eventType].splice(i, 1);
                    break;
                }
            }
        },

        fire: function (event) {
            var eventType = event.type;
            if (this.eventMap && this.eventMap[eventType]) {
                for (var i = 0; i < this.eventMap[eventType].length; i++) {
                    this.eventMap[eventType][i](event);
                }
            }
        }
    };

    _.extend(bank, {
        base: "/",

        define: function (name, dependencies, factory) {
            if (!moduleMap[name]) {
                var module = {
                    name: name,
                    dependencies: dependencies,
                    factory: factory
                };

                moduleMap[name] = module;
            }

            return moduleMap[name];
        },

        use: function (name) {
            var module = moduleMap[name];

            if (!module.entity) {
                var args = [];
                for (var i = 0; i < module.dependencies.length; i++) {
                    if (moduleMap[module.dependencies[i]].entity) {
                        args.push(moduleMap[module.dependencies[i]].entity);
                    } else {
                        args.push(this.use(module.dependencies[i]));
                    }
                }

                module.entity = module.factory.apply(noop, args);
            }

            return module.entity;
        },

        require: function (pathArr, callback) {
            var base = this.base;
            for (var i = 0; i < pathArr.length; i++) {
                loadFile(pathArr[i]);
            }

            function loadFile(file) {
                var head = doc.getElementsByTagName('head')[0];
                var script = doc.createElement('script');
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('src', file + '.js');
                script.onload = script.onreadystatechange = function () {
                    if ((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                        fileMap[file] = true;
                        //head.removeChild(script);
                        checkAllFiles();
                    }
                };
                head.appendChild(script);
            }

            function checkAllFiles() {
                var allLoaded = true;
                for (var i = 0; i < pathArr.length; i++) {
                    if (!fileMap[pathArr[i]]) {
                        allLoaded = false;
                        break;
                    }
                }

                if (allLoaded && callback) {
                    callback();
                }
            }
        },

        ready: function (handler, priority) {
            priority = (priority === null) ? 1 : priority;

            if (!readyFunctions[priority]) {
                readyFunctions[priority] = [];
            }
            readyFunctions[priority].push(handler);
        },

        error: function () {

        },

        log: function (obj) {
            try {
                //console.log(obj);
            } catch (ex) {
                console.log("er:" + ex);
            }
        }
    });
    _.extend(bank, Events);

    win.bank = bank;

    bank.define("_", [], function () {
        return _;
    });

    //Events
    bank.define("Events", [], function () {
        return Events;
    });




    //标签元素遍历标签元素遍历
    function parseElement(element) {
        if (element == null || element == undefined) {
            return;
        }
        var i;
        //遍历元素属性
        for (i = 0; i < element.attributes.length; i++) {
            parseAttribute(element, element.attributes[i]);
        }
        //开始遍历子元素
        for (i = 0; i < element.children.length; i++) {

            parseElement(element.children[i]);

        }
    };

    //属性遍历，根据属性执行绑定
    function parseAttribute(element, attr) {
        if (attr.name.indexOf("vl-") === 0) {
            var type = attr.name.slice(3);
            switch (type) {
                //case "keyup":
                //    bindKeyup(element, attr.value);
                //    break;
                case "slemodel":
                    bindSelectCtrl(element, attr.value);
                    break;
                case "disabled":
                    bindDisabled(element, attr.value);
                    break;
                case "type":
                    bindType(element, attr.value);
                    break;
                case "regex":
                    bindRegex(element, attr.value);
                    break;
                case "submit":
                    bindSubmit(element, attr.value);
                    break;
                case "rely":
                    bindRely(element, attr.value);
                    break;
                case "default":
                    bindDefault(element, attr.value);
                    break;
                case "exec":
                    bindExecSelect(element);
                    break;

            }
        }
    };


  


    //绑定快查
    function bindExecSelect(element) {
        var selects = $(element).attr("vl-select") != undefined ? $(element).attr("vl-select") : ""; //获取快查项目
        $(element).parent().find("input").keyup(function (e) { //输入框enter事件
            if (e.which == 13) {
                $(element).click();
            }
        });
        $(element).on("click", function () { //快查按钮点击事件

            //alert(11178);
            $(this).attr("vl-exec", "true");
            var element_id = $(this).parent().children().first().attr("id");
            if ($.trim($(element).prev().val()).length < 5 && element_id != undefined || !element_id.indexOf("sel_")) {
               
                return;
            }


            //var SelectValue = $(this).siblings("select").find("option:selected").text();

            //alert("111:" + $("#txt_zkh").val()); //1:查询是否有固定的数据源:sql值,拼一下SQL,增查询数据库,2:查询任务内置表,先做这个
            //如果查到,就通过或内置,如果没有查到,就弹出帐号不对的提示框
            var examid = getQueryString("examid");
            var userid = getQueryString("tellerId");
            var formid = getQueryString("formid");
            var taskid = getQueryString("taskid");
            var finData = $("#findData").html();
            var defaultData = $("#DefaultValue").html();
           

            //根据不同的下拉值获取不一样的数据
            var def_temp_str = "";//处理后的字符串
            //alert("def_items:"+defaultData);
            var def_items = defaultData.split('$');

            for (var i = 0; i < def_items.length; i++) {
                if (def_items[i] == "") {
                    //alert("mm1");
                    continue;
                }
                if (def_items[i].indexOf('@') > -1) {
                    var temp_a_array = def_items[i].split('@');
                    var temp_a_match_str = "";//临时保存匹配到的项
                    for (var j = 0; j < temp_a_array.length; j++) {

                        var temp_array = temp_a_array[j].split('#');

                        var sel_id = temp_array[temp_array.length - 2];
                        var sel_text = $("#" + sel_id + " option:checked").text();
                        //alert(sel_text);
                        //var sel_text="1-整存整取3年";
                        if (sel_text != "" && sel_text != null) {
                            sel_text = sel_text.replace(/\s/g, "")
                        }

                        if (sel_text == temp_array[temp_array.length - 1]) {
                            //下拉框选中了默认值中配置的值
                            temp_a_match_str = temp_a_array[j];
                            //切出匹配项的第一个字符
                            var first_char = temp_a_match_str.substring(0, 1);
                            if (first_char == "#") {
                                var yw_number = temp_a_array[0].split("#")[0];

                                temp_a_match_str = yw_number + temp_a_match_str;
                            }
                            def_items[i] = temp_a_match_str;
                        }
                    }
                }

                def_temp_str += '$' + def_items[i];
            }


            defaultData = def_temp_str;
           

            if (!$(element).attr("id") == undefined) {

                if ($.trim($(element).prev().val()) == '') {
                    return;
                }
                if ($.trim($(element).prev().val()).length < 5 && formid != "030608") {
                    return;
                }
            }
            if (selects != '') {

                $(selects.split(',')).each(function (i, e) { //提取快查项目，默认赋值、、以后需要从后台提取数据

                    var index = e.indexOf("|");
                    var value = e.substring(0, index);
                    var disabled = e.substring(index + 1);
                    var telement = document.getElementById(value);
                    //console.log('rrrr:' + telement);
                    //if(typeof($(telement).attr("tagName"))!="undefined")
                    //{
                    if (telement == null) return;
                    //console.log("formid333:" + formid);
                    if (formid == '030606') {
                        $('#sle_zfxh').val($('#sle_zfxh').find("option").eq(1).attr("value"));
                        $('#sle_zfxh').siblings("input").val($('#sle_zfxh').find("option").eq(1).text());
                    } else {
                        if (formid == '010101') {

                            $('#sle_zfxh').val($('#sle_zfxh').find("option").eq(1).attr("value"));
                            $('#sle_zfxh').siblings("input").val($('#sle_zfxh').find("option").eq(1).text());
                        }
                        if (telement.tagName == "SELECT") { //赋值第一个值
                            if ($(telement).val() == null) {
                                $(telement).val($(telement).find("option").eq(1).attr("value"));
                                $(telement).siblings("input").val($(telement).find("option").eq(1).text());

                            }



                        } else {

                            //console.log("111111:" + telement.id);
                            var conid = telement.id;
                            //if (conid.indexOf('zhhm') > -1) {
                            //    telement.value = "测试账号名";
                            //}

                        } //赋值100
                    }
                    // }
                    if (parseInt(disabled) == 1) {
                        $(telement).attr("disabled", "disabled");
                        if (telement.tagName == "SELECT") {
                            $(telement).siblings("input").attr("disabled", "disabled");
                        }
                    }

                    checkBind(telement);
                });
            }
            //console.log("defaultData8888888:" + defaultData);
            //defaultData='$030601#txt_zhmc#童蕾;money_zhye#50000.00;money_kyye#50000.00;sle_cpdm#41011-整存整取;sle_bz#CNY-人民币;txt_djtzsh#李盛爱上了陈圳2;#sle_djfs#2 - 部分冻结$030601#txt_djtzsh#李盛爱上了陈圳2;#txt_account_card#1111';
            //010101:txt_zjhm:520102196912076217;sle_yxqlx:0-无有效期;sle_hcjg:1-真实;sle_bz:CNY-人民币;sle_zhlx:1-个人结算账户;

            //console.log($(".redtip"));
            Array.prototype.forEach.call($(".redtip"), function (item) {
                if ($(item).prevAll("select") != undefined && $(item).prevAll("select") != "undefined") {
                    if ($(item).prevAll("select").val() != "" && $(item).prevAll("select").val() != null && $(item).prevAll("select").val() != "null") {
                        $(item).prevAll("select").removeAttr("vl-regex vl-message").nextAll("span").remove();
                    }
                } else if ($(item).prevAll("input") != undefined && $(item).prevAll("input") != "undefined") {
                    if ($(item).prevAll("input").val() != "" && $(item).prevAll("input").val() != null && $(item).prevAll("input").val() != "null") {
                        $(item).prevAll("input").removeAttr("vl-regex vl-message").nextAll("span").remove();
                    }
                }
            })
            

            if (defaultData != "") {
                //alert("bbb");
                //查询任务内置数据,循环窗口。
                // 030604#sle_number#1-个人银行结算存款;txt_zhmc#危菲舜;sle_currency_kind#CNY-人民币;sle_product_code#11011-个人银行结算存款;%txt_account_card%010102
                //010102#sle_qxlx#1-有有效期;txt_zjdqr#20240215;sle_hcjg#00-公民身份证号码与姓名一致&且存在照片;sle_hsjg#1-真实;sle_bz#CNY-人民币;sle_zqfs#1-密码;sle_cxmm#N-否;sle_sflm#Y-是;sle_tctdbz#1-通存通兑;#txt_zjhm#080101:txt_zjhm
                var dataArray1 = defaultData.substring(1).split('$');

                var havedata = '';
                //alert("cccc:"+dataArray1);
                for (var h = 0; h < dataArray1.length; h++) {

                    if (dataArray1[h].length < 6) continue;
                    if (dataArray1[h].substring(0, 6) == formid) {
                        // 判断是不是当前控件
                        //$(element).prev().attr("id")
                        defaultData = dataArray1[h];
                        var dataarray = dataArray1[h].split(';');
                        //alert("dataarray:"+dataarray);
                        var keydata = dataarray[dataarray.length - 1].split('#')[1];
                        //console.log("yyyy:" +keydata + ":" + $(element).prev().attr("id")+":" + defaultData);
                        //alert("keydata:"+keydata+"   "+"eeee:"+$(element).prev().attr("id"));
                        //alert("aasdadadad:::::"+keydata);

                        if (keydata == $(element).prev().attr("id") || $(element).prev().attr("id") == undefined) {
                            havedata = '1';
                            defaultData = dataArray1[h];
                            break;
                        } else {
                            //alert("dd");
                            defaultData = '';
                        }
                    }
                }

                //console.log('eeee:' + defaultData + "ooooo:" + havedata);
                if (havedata == '') {
                    //alert("bbbcccc");
                    return;
                }
                //alert("defaultData:"+defaultData);
                //console.log('eeee2:' + defaultData);
                defaultData = defaultData.replace("&amp;", ",");
                //console.log('eeee3:' + defaultData);
                var dataArray = defaultData.split(';');
                var formidtmp = dataArray[0].split('#')[0];

                //根据业务数据,进行查询是否存在的.:
                var targeArray = dataArray[dataArray.length - 1].substring(1).replace('*', '#').split('#');

                // 当前控件名:
                var curConName = targeArray[0];
                //console.log("notbb1b11:" + curConName + ":" + $(element).prev().attr("id"));

                if (curConName != $(element).prev().attr("id") && $(element).prev().attr("id") != undefined) {

                    //console.log("notbb1b11:");
                    return;
                }

                var finddataflag = '';

                var targetFormdata = targeArray[1].split(';');
                //console.log("bb1b:" + dataArray[dataArray.length - 1] + ":" + targeArray[1] + ":" + dataArray[dataArray.length - 1]);

                // 如果是要查询已有业务,查询对了,就显示默认值,错了,就提示输入值不存在
                var addcolumn = '';
                //if (formid == '010102') { addcolumn = "txt_khh"; }
                //alert("targetFormdata:"+targetFormdata);
                if (targeArray.length == 3) {
                    //alert("aaa");
                    //其它业务
                    //console.log("bb1b115:");
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: "/indexone/findData",
                        data: { data: targeArray[1] + ";" + targeArray[2] + ";" + $(element).prev().val() + ";" + examid + ";" + userid + ";findtable" + "#" + addcolumn },
                        success: function (row) {
                            //console.log(row)
                            //console.log('add:' + row.data)
                            //var dataArray = row.data.split(';');//1;txt_zkh,520102196912076217;sle_xh,0-无有效期;sle_fjlx,1-真实
                            if (row.data == "wrong11111") {
                                //alert("核心系统提示:["+$(element).prev().val()+"]帐号不存在");
                                //layer.alert("核心系统提示:["+$(element).prev().val()+"]帐号不存在");
                                //console.log('have no data');
                                // return;

                            } else {
                                //console.log('have data');
                                finddataflag = '1';
                                //console.log("findok:" + row.data + ":" + finddataflag);
                                //                              if (formid == '010102') {
                                //                                  $("#txt_khh").val(+row.data);
                                //
                                //                              }
                                //console.log("findok:" + row.data + ":" + finddataflag);

                                //console.log("bbc:" + finddataflag);

                                //console.log("bb1:" + formidtmp + ":" + formid + "::" + finddataflag);
                                // 如果是ID是一样的，
                                if (formidtmp == formid && (curConName == $(element).prev().attr("id") || $(element).prev().attr("id") == undefined)) {

                                    var keyConName = dataArray[0].split('#')[1];
                                    var keyConValue = dataArray[0].split('#')[2];
                                    var curkeyConValue = $("#" + keyConName).val()
                                    //console.log("cc:" + keyConName + ":" + dataArray[0] + ":" + curkeyConValue + ":" + keyConValue);

                                    //if (curkeyConValue==keyConValue)
                                    // {
                                    //console.log("dd:"+curkeyConValue + ":" + keyConValue);
                                    // 取默认值
                                    for (var i = 0; i < dataArray.length; i++) //dataArray.length
                                    {
                                        //console.log("ee:" + dataArray[i]);
                                        if (dataArray[i].length > 3) {
                                            if (dataArray[i].split('#')[0] == '') continue;
                                            //console.log("ff:" + dataArray[i].split('#').length + ":" + dataArray[i].split('#')[0] + ":" + dataArray[i].split('#')[1]);
                                            //$("#"  +dataArray[i].split(':')[0]).val(dataArray[i].split(':')[1])//直接赋值
                                            var selectname = dataArray[i].split('#')[0];
                                            var selectvalue = dataArray[i].split('#')[1].split('-')[0];
                                            var seelecttext = dataArray[i].split('#')[1];

                                            var conid = dataArray[i].split('#')[0];

                                            if (dataArray[i].split('#').length == 3) {
                                                selectname = dataArray[i].split('#')[1];
                                                conid = dataArray[i].split('#')[1];
                                                selectvalue = dataArray[i].split('#')[2].split('-')[0];
                                                seelecttext = dataArray[i].split('#')[2];
                                            }

                                            //console.log("#de0" + selectvalue + ":" + seelecttext + ":" + conid);
                                            //var count=$("#" + selectname).get(0).options.length;
                                            //console.log("count:" + count);
                                            //console.log("value:" + selectvalue + ";" + dataArray[i]);
                                            // 给下拉框赋值

                                            // 如果不是只读的,就不赋值
                                            //if ($("#" + selectname).attr("disabled") =='disabled')
                                            //{
                                            if (conid.indexOf('sle_') > -1) {
                                                $("#" + selectname).val(selectvalue);
                                                $("#" + selectname + " option[value=" + selectvalue + "]").attr("selected", "selected");
                                                $("#" + selectname).siblings("input").val(seelecttext);
                                                setselectvalue(selectname, selectvalue);
                                            } else {
                                                $("#" + selectname).val(seelecttext);

                                            }
                                            //}
                                            checkBind(document.getElementById(selectname));
                                        }
                                    }
                                    //}
                                    // else
                                    //{
                                    // 提示帐号不正确:提示信息,以后要做区分
                                    // alert("核心系统提示:["+curkeyConValue+"]帐号不存在");
                                    //layer.alert("核心系统提示1111:["+curkeyConValue+"]帐号不存在");
                                    //}
                                }

                                //console.log("FindData:" + finData);

                                if (finData != "" && finData.length > 10) // 没有内置数据,读最新的做的业务数据
                                {
                                    // 查询固定表内置数据txt_zjhm,sle_fjlx,txt_zhmc;010104;txt_zkh,sle_xh,sle_fjlx;1;身份证号码不对
                                    // 查询后台数据,如果对就通过,如果不对,就给出错误提示
                                    $.ajax({
                                        type: "POST",
                                        dataType: "json",
                                        url: "/indexone/findData",
                                        data: { data: finData + ";" + examid + ";" + userid },
                                        success: function (row) {
                                            //console.log(row)
                                            //console.log(row.data)
                                            var dataArray = row.data.split(';'); //1;txt_zkh,520102196912076217;sle_xh,0-无有效期;sle_fjlx,1-真实
                                            if (dataArray[0] == "1" || dataArray[0] == "0") {
                                                // 默认值赋值
                                                for (var i = 1; i < dataArray.length; i++) //dataArray.length
                                                {
                                                    //console.log("ee:"+dataArray[i]);
                                                    if (dataArray[i].length > 3) {
                                                        //console.log("ff:" + dataArray[i].split(',')[0] + ":" + dataArray[i].split(',')[1]);
                                                        //$("#"  +dataArray[i].split(':')[0]).val(dataArray[i].split(':')[1])//直接赋值
                                                        var selectname = dataArray[i].split(',')[0];
                                                        var selectvalue = dataArray[i].split(',')[1].split('-')[0];
                                                        //console.log("#find" + selectvalue);
                                                        //var count=$("#" + selectname).get(0).options.length;
                                                        //console.log("count:" + count);
                                                        // 如果有#,取前面的值
                                                        if (selectvalue.indexOf('#') > -1) {
                                                            selectvalue = selectvalue.split('#')[0];
                                                        }
                                                        if ($("#" + selectname).val().length < 8) {
                                                            $("#" + selectname).val(selectvalue);
                                                            $("#" + selectname + " option[value=" + selectvalue + "]").attr("selected", "selected");
                                                            $("#" + selectname).siblings("input").val(dataArray[i].split(',')[1]);
                                                        }
                                                    }
                                                }

                                            } else {
                                                //alert(dataArray[0]);
                                            }

                                        }
                                    })

                                }

                            }

                        }
                    });

                } else {
                    //alert("defaultData111:"+defaultData);
                    //mark1
                    finddataflag = '1';
                    //targeArray =  dataArray[dataArray.length-1].substring(1).replace('*','#').split('#');
                    //console.log('no db:' + targeArray[1] + ":" + targeArray[0] + "：" + dataArray[dataArray.length - 1].substring(1).replace('*', '#'));
                    // 数据
                    if (targeArray[1] != $(element).prev().val() && targeArray[1] != "%") {
                        //alert("核心系统提示:["+ $(element).prev().val()+"]帐号不存在");
                        //layer.alert("核心系统提示:["+ $(element).prev().val()+"]帐号不存在");
                        // return; 
                    }

                    //console.log("bb2:" + formidtmp + ":" + formid + "::" + finddataflag);
                    // 如果是ID是一样的，
                    //if (formidtmp == formid && (curConName == $(element).prev().attr("id") || $(element).prev().attr("id") == undefined)) {
                    //console.log($(element));
                    //console.log("1111111aaaaaaaaaaaaaaa:::"+$(element).siblings().siblings().attr("id"));
                    ////console.log($($(element).parent().find("select")[0]).attr("id"));
                    //alert("formidtmp:" + formidtmp + "--formid:" + formid + "---curConName:" + curConName + "--$(element)" + $(element).siblings().siblings().attr("id"))	;
                    //alert("formidtmp:   " + formidtmp + "     formid:" + formid + "    curConName: " + curConName + "    element:" + $(element).prev().prev().attr("id"));
                    var istxt = "";
                    if (curConName.indexOf("sle_") > -1) {

                        istxt = $(element).prev().prev().attr("id");
                        //alert("下拉框的id是:" + istxt);
                    }
                    else {
                        istxt = $(element).prev().attr("id");
                        //alert("文本框的id是:" + istxt);
                    }
                    if (formidtmp == formid && (curConName == istxt)) {
                        //alert(9999);
                        var keyConName = dataArray[0].split('#')[1];
                        var keyConValue = dataArray[0].split('#')[2];
                        var curkeyConValue = $("#" + keyConName).val()
                        //console.log("cc:" + keyConName + ":" + dataArray[0] + ":" + curkeyConValue + ":" + keyConValue);
                        //if (curkeyConValue==keyConValue)
                        // {
                        //console.log("dd:"+curkeyConValue + ":" + keyConValue);
                        // 取默认值
                        for (var i = 0; i < dataArray.length; i++) //dataArray.length
                        {

                            //console.log("ee:" + dataArray[i]);
                            if (dataArray[i].length > 3) {
                                if (dataArray[i].split('#')[0] == '') continue;
                                //console.log("ff:" + dataArray[i].split('#').length + ":" + dataArray[i].split('#')[0] + ":" + dataArray[i].split('#')[1]);
                                //$("#"  +dataArray[i].split(':')[0]).val(dataArray[i].split(':')[1])//直接赋值
                                var selectname = dataArray[i].split('#')[0];
                                var selectvalue = dataArray[i].split('#')[1].split('-')[0];
                                var seelecttext = dataArray[i].split('#')[1];

                                var conid = dataArray[i].split('#')[0];

                                if (dataArray[i].split('#').length == 3) {
                                    selectname = dataArray[i].split('#')[1];
                                    conid = dataArray[i].split('#')[1];
                                    selectvalue = dataArray[i].split('#')[2].split('-')[0];
                                    seelecttext = dataArray[i].split('#')[2];
                                }

                                //console.log("#de0" + selectvalue + ":" + seelecttext + ":" + conid);
                                //var count=$("#" + selectname).get(0).options.length;
                                //console.log("count:" + count);
                                //console.log("value:" + selectvalue + ";" + dataArray[i]);
                                // 给下拉框赋值

                               
                                if (conid.indexOf('sle_') > -1) {
                                    $("#" + selectname).val(selectvalue);
                                    $("#" + selectname + " option[value=" + selectvalue + "]").attr("selected", "selected");
                                    $("#" + selectname).siblings("input").val(seelecttext);
                                } else {
                                    if ((formid == "010101" && selectname == "txt_zh1")) {
                                        //alert(seelecttext);
                                        $(".zhanghao").val(seelecttext);
                                    }
 
                                    else if ((formid == "030601" && selectname == "money_ye")) {
                                        $(".zhanghao").val(seelecttext);
                                    }
                                    else if ((formid == "030602" && selectname == "money_ye")) {
                                        $(".zhanghao").val(seelecttext);
                                    }
                                    else if ((formid == "030603" && selectname == "money_ye")) {
                                        $(".zhanghao").val(seelecttext);
                                    }
                                    else if ((formid == "030608" && selectname == "money_ye")) {
                                        $(".zhanghao").val(seelecttext);
                                    }
                                    else if ((formid == "030606" && selectname == "money_ye")) {
                                        $(".zhanghao").val(seelecttext);
                                    }
                                    else if ((formid == "030604" && selectname == "money_ye")) {
                                        $(".zhanghao").val(seelecttext);
                                    }
                                    else if ((formid == "020502" && selectname == "txt_dqzh")) {
                                        $(".zhanghao").val(seelecttext);
                                    }
                                    else if ((formid == "060703" && selectname == "txt_lsh2")) {
                                        $(".zhanghao").val(seelecttext);
                                    }
                                    else if ((formid == "010303" && selectname == "txt_xzkh")) {
                                        $(".zhanghao").val(seelecttext);
                                    }
                                    else if ((formid == "010906" && selectname == "txt_dqzh")) {
                                        $(".zhanghao").val(seelecttext);
                                    }
                                    else if ((formid == "010108" && selectname == "txt_xzkh")) {
                                        $(".zhanghao").val(seelecttext);
                                    }
                                    else if ((formid == "010107" && selectname == "money_lxje")) {
                                        $(".zhanghao").val(seelecttext);
                                    }
                                   
                                    else if ((formid == "020501" && selectname == "txt_zh")) {
                                        $(".zhanghao").val(seelecttext);
                                    }
                                    else if ((formid == "010901" && selectname == "txt_zh")) {
                                        $(".zhanghao").val(seelecttext);
                                    }
                                    else if ((formid == "091003" && selectname == "txt_pch")) {
                                        $(".zhanghao").val(seelecttext);
                                    }
                                    else {
                                        $("#" + selectname).val(seelecttext);
                                    }

                                }
                                //}
                            }
                        }
                       
                    }

                    //console.log("FindData:" + finData);

                    if (finData != "" && finData.length > 10) // 没有内置数据,读最新的做的业务数据
                    {
                        //alert(77777);
                        // 查询固定表内置数据txt_zjhm,sle_fjlx,txt_zhmc;010104;txt_zkh,sle_xh,sle_fjlx;1;身份证号码不对
                        // 查询后台数据,如果对就通过,如果不对,就给出错误提示
                        $.ajax({
                            type: "POST",
                            dataType: "json",
                            url: "/indexone/findData",
                            data: { data: finData + ";" + examid + ";" + userid },
                            success: function (row) {
                                //console.log(row)
                                //console.log(row.data)
                                var dataArray = row.data.split(';'); //1;txt_zkh,520102196912076217;sle_xh,0-无有效期;sle_fjlx,1-真实
                                if (dataArray[0] == "1" || dataArray[0] == "0") {
                                    // 默认值赋值
                                    for (var i = 1; i < dataArray.length; i++) //dataArray.length
                                    {
                                        //console.log("ee:"+dataArray[i]);
                                        if (dataArray[i].length > 3) {
                                            //console.log("ff:" + dataArray[i].split(',')[0] + ":" + dataArray[i].split(',')[1]);
                                            //$("#"  +dataArray[i].split(':')[0]).val(dataArray[i].split(':')[1])//直接赋值
                                            var selectname = dataArray[i].split(',')[0];
                                            var selectvalue = dataArray[i].split(',')[1].split('-')[0];
                                            //console.log("#find" + selectvalue);
                                            //var count=$("#" + selectname).get(0).options.length;
                                            //console.log("count:" + count);
                                            // 如果有#,取前面的值
                                            if (selectvalue.indexOf('#') > -1) {
                                                selectvalue = selectvalue.split('#')[0];
                                            }
                                            if ($("#" + selectname).val().length < 8) {
                                                $("#" + selectname).val(selectvalue);
                                                $("#" + selectname + " option[value=" + selectvalue + "]").attr("selected", "selected");
                                                $("#" + selectname).siblings("input").val(dataArray[i].split(',')[1]);
                                            }
                                        }
                                    }

                                } 
                            }
                        })

                    }
                }

            } 
        });
    }




    //绑定特殊控件
    function bindType(element, key) {
        if (key.length > 0) {
            switch (key.toLowerCase()) {
                case "money":
                    var value = $(element).val();
                    value = value == '' ? '0' : value;
                    value = parseFloat(value.split(',').join('')).toFixed(2);
                    $(element).siblings(".moneytips").find("span.num").text(formatCurrency(value));
                    $(element).siblings(".moneytips").find("span.cn").text(convertCurrency(value));
                    $(element).addClass("money");
                    $(element).siblings(".moneytips").addClass("green");
                    var jinejiaoyan = $(element).attr("jinejiaoyan");
                    if (jinejiaoyan != undefined && jinejiaoyan == 'true') {
                        $(element).focus(function () {
                            $(element).siblings(".moneytips").show(); //.css("left", -$(element).width());
                        });
                    }
                    $(element).blur(function () {
                        $(element).siblings(".moneytips").removeClass("green").removeClass("yellow").removeClass("red").removeClass("purple");
                        value = $(element).val();
                        value = value == '' ? '0' : value;
                        value = parseFloat(value.split(',').join('')).toFixed(2);
                        $(element).siblings(".moneytips").hide();
                        $(element).val(formatCurrency(value));
                        if (parseFloat(value) < 100000) {
                            $(element).siblings(".moneytips").addClass("green");
                        }
                        if (parseFloat(value) >= 100000 && parseFloat(value) < 1000000) {
                            $(element).siblings(".moneytips").addClass("yellow");
                        }
                        if (parseFloat(value) >= 1000000 && parseFloat(value) < 10000000) {
                            $(element).siblings(".moneytips").addClass("red");
                        }
                        if (parseFloat(value) >= 10000000) {
                            $(element).siblings(".moneytips").addClass("purple");
                        }
                    });
                    $(element).keyup(function (e) {
                        $(element).siblings(".moneytips").removeClass("green").removeClass("yellow").removeClass("red").removeClass("purple");
                        value = $(element).val();
                        value = value == '' ? '0' : value;
                        value = parseFloat(value.split(',').join('')).toFixed(2);
                        $(element).siblings(".moneytips").find("span.num").text(formatCurrency(value));
                        $(element).siblings(".moneytips").find("span.cn").text(convertCurrency(value));
                        //$(element).val(formatCurrency(value));
                        if (parseFloat(value) < 100000) {
                            $(element).siblings(".moneytips").addClass("green");
                        }
                        if (parseFloat(value) >= 100000 && parseFloat(value) < 1000000) {
                            $(element).siblings(".moneytips").addClass("yellow");
                        }
                        if (parseFloat(value) >= 1000000 && parseFloat(value) < 10000000) {
                            $(element).siblings(".moneytips").addClass("red");
                        }
                        if (parseFloat(value) >= 10000000) {
                            $(element).siblings(".moneytips").addClass("purple");
                        }
                    });
                    break;
                case "password":
                    $(element).focus(function () {
                        var random = "id" + Math.random();
                        var layindex = layer.open({
                            title: '密码输入',
                            content: "<div>你的密码：<input type='password' id='" + random + "1'/></br>确认密码：<input type='password' id='" + random + "2'/></br><p style='color:red;display:none;'>两次输入的密码不一致！</p></div>",
                            scrollbar: false,
                            success: function (layero, index) {
                                $(layero).find("input").eq(0).focus();
                            },
                            yes: function (index, layero) {
                                var pwd1 = $(layero).find("input").eq(0).val();
                                var pwd2 = $(layero).find("input").eq(1).val();
                                if (pwd1 == '' || pwd2 == '') {
                                    $(layero).find("p").eq(0).html("密码不能为空").show();
                                } else if (pwd1 === pwd2) {
                                    element.value = pwd1;
                                    layer.close(layindex);
                                } else {
                                    $(layero).find("p").eq(0).html("两次输入的密码不一致").show();
                                }

                            }
                        });
                    });
                    break;
                case "combox":
                   
                    break;
            }
        }
    }
    //绑定默认值
    function bindDefault(element, key) {

        if (element.tagName == "SELECT") {

            if (key.length > 0) {
                $(element).val(key);
                $(element).siblings("input").val($(element).find("option[value='" + key + "']").text());
            } else {
                //$(element).val("-1");
                $(element).find("option:first").attr("selected", "selected");
            }
        } else if (element.tagName == "INPUT") {
            element.value = key;
        }
        //将默认值与控件绑定
        //$(element).data("pre-default",key);

        //统一删除必填标志！
        if ($(element).val() != '' && $(element).val() != undefined && $(element).val() != null) {
            $(element).parent().find(".redtip").remove();
        }
    }

    //绑定不可用
    function bindDisabled(element, key) {
        if (key.length > 0 && key.toLowerCase() === "true") {
         
            $(element).attr("disabled", "disabled");
            if (element.tagName == "SELECT") {
                $(element).siblings("input").attr("disabled", "disabled");
            }
        }

    }

    //设置属性
    function setAttributes(id, objArray) {

        $(objArray).each(function (i, e) {
            if (id === e.id) {
            
                $(document.getElementById(id)).attr("vl-regex", "['" + e.regex.toString().split(',').join("','") + "']").attr("vl-message", "['" + e.tips.toString().split(',').join("','") + "']").attr("vl-tipsid", e.tipsid).attr("vl-default", e.default).attr("vl-disabled", e.disabled);
            }
        });
    }

    //绑定有规则的下拉框
    function bindSelectCtrl(element, key) {
        if (element.tagName == "SELECT" && key.length > 0) {
            if (is_review == "true") {
                return;
            }
            var models = key.length > 0 && key.split(",");
            $(models).each(function (i, e) {
                try {
                    var isSelect = document.getElementById(e).tagName == "SELECT";
                    //所有控件设置为不可用
                    //$(document.getElementById(e)).attr("disabled", "disabled");
                    if (isSelect) {
                        //    document.getElementById(e).selectedIndex = -1;
                        //    $(document.getElementById(e)).css("background-color", "#e6e6e6");
                        //$(document.getElementById(e)).siblings("input").attr("disabled", "disabled");
                    }
                } catch (exception) { }
            });
            $(element).change(function () {
                $(element).find("option").each(function (i, e) {
                    var zhiyuObj = typeof ($(e).attr("sle-zhiyu")) != "undefined" ? eval($(e).attr("sle-zhiyu")) : [];
                    $(zhiyuObj).each(function (i, e) {
                        $("#" + e.id).find("option").removeClass("hide");
                        $("#" + e.id).val('');
                        $("#" + e.id).siblings("input").val('');
                    });

                    var tabObj = typeof ($(e).attr("sle-tabable")) != "undefined" ? $(e).attr("sle-tabable").split(',') : [];
                    $(tabObj).each(function (i, e) {
                        var ed = e.split('|');
                        var id = ed[0],
                            ishide = ed[1],
                            alldisable = ed[2];
                        $("#" + id).removeClass("disable");
                    });
                });
                var sleIndex = element.selectedIndex;
                var sleOption = $(element).find("option").eq(sleIndex);
                var requiresObj = typeof (sleOption.attr("sle-require")) != "undefined" ? eval(sleOption.attr("sle-require")) : [];
                var zhiyuObj = typeof (sleOption.attr("sle-zhiyu")) != "undefined" ? eval(sleOption.attr("sle-zhiyu")) : [];
                var tabObj = typeof (sleOption.attr("sle-tabable")) != "undefined" ? sleOption.attr("sle-tabable").split(',') : [];
                var requires = [];
                if (requiresObj.length > 0) {
                    $(requiresObj).each(function (i, e) {
                        requires.push(e.id);
                    });
                }
                if (zhiyuObj.length > 0) {
                    $(zhiyuObj).each(function (i, e) {
                        $("#" + e.id).find("option[value!='']").addClass("hide");
                        $(e.zhiyu.split(',')).each(function (ii, ee) {
                            $("#" + e.id).find("option[value='" + ee + "']").removeClass("hide");
                        });
                    });
                }
                if (tabObj.length > 0) {
                    $(tabObj).each(function (i, e) {
                        var ed = e.split('|');
                        var id = ed[0],
                            ishide = ed[1],
                            alldisable = ed[2];
                        if (ishide == 'true') {
                            $("#" + id).addClass("disable");
                        }
                      
                        if (alldisable == 'true') {
                            var index = $(".box .tab ." + id).index();
                            $(".box .content .ct").eq(index).find("input").attr("disabled", "disabled");
                            $(".box .content .ct").eq(index).find("select").attr("disabled", "disabled");
                        } else {
                            var index = $(".box .tab ." + id).index();
                            $(".box .content .ct").eq(index).find("input").removeAttr("disabled");
                            $(".box .content .ct").eq(index).find("select").removeAttr("disabled");
                        }
                        //parseElement(element);
                    });
                }
                
                var selectableobj = typeof (sleOption.attr("sle-selectable1")) != "undefined" ? eval(sleOption.attr("sle-selectable1")) : [];
                var selectable = [];
                $(selectableobj).each(function (i, e) { selectable.push(e.id); });

                $(models).each(function (i, e) {
                    //所有控件设置为不可用
                    //$(document.getElementById(e)).attr("disabled", "disabled");
                    $(document.getElementById(e)).siblings(".redtip").remove();
                    $(document.getElementById(e)).siblings(".tipsmsg").hide();

                    //记录原始规则
                    var $R = $(document.getElementById(e));

                    if ($R.data("vl-regex") == undefined && !$R.hasClass("qt")) {

                        $R.data("vl-regex", $R.attr("vl-regex") == undefined ? "" : $R.attr("vl-regex"));
                        $R.data("vl-message", $R.attr("vl-message") == undefined ? "" : $R.attr("vl-message"));
                        $R.data("vl-default", $R.attr("vl-default") == undefined ? "" : $R.attr("vl-default"));
                        $R.addClass("qt");
                    }
                    $(document.getElementById(e)).removeAttr("vl-regex").removeAttr("vl-message").removeAttr("vl-default");

                    $(document.getElementById(e)).off();

                    if (e.length > 0) {
                        try {
                            var isSle = document.getElementById(e).tagName == "SELECT";
                            if (isSle) {
                                $(document.getElementById(e)).siblings("input").val('');
                                $(document.getElementById(e)).siblings("input").off();
                            }
                        } catch (exception) { }
                     
                        //    //设置为不可用，取消属性，取消事件
                        if ($.inArray(e, requires) == -1 && $.inArray(e, selectable) == -1) {

                            if (requiresObj.length == 0) {

                                if ($R.data("vl-regex") != undefined && $R.data("vl-regex") != '') {
                                    $R.attr("vl-regex", $R.data("vl-regex"));
                                    //console.log("1111c:");
                                    $R.attr("vl-message", $R.data("vl-message"));
                                    $R.attr("vl-default", $R.data("vl-default"));
                                } else {
 
                                }
                            }
                            parseElement(document.getElementById(e));
                            
                        } else {
                            
                            $(document.getElementById(e)).removeAttr("disabled").removeAttr("vl-disabled");
                            if (isSle) {
                                $(document.getElementById(e)).siblings("input").removeAttr("disabled").removeAttr("vl-disabled");
                            }
                            //必填项处理
                            if ($.inArray(e, requires) != -1) {
                                 
                                setAttributes(e, requiresObj);
                                parseElement(document.getElementById(e));
                            }
                            
                        }
                    }
                });
            });
        }
    }

    //绑定执行项
    function bindExec(element, key) {
        var jsonResult = { obj: element, index: 0, isCheck: true, errormsg: '' }; //返回的结果
        var messages = $(element).attr("vl-message") != undefined ? eval($(element).attr("vl-message")) : []; //获取提示
        if (key.toLowerCase() == "false") {
            jsonResult.isCheck = false;
            jsonResult.errormsg = messages[0] || "";
            if (checkArrayObj(jsonResult, bank.errors)) {
                bank.errors.push(jsonResult);
            }
        }
        bank.isCheck = bank.isCheck && jsonResult.isCheck;
        return jsonResult.isCheck;
    }

})(window, document, _);
bank.fire({ type: "ready" });
