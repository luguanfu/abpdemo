var autu_layer_index;//授权弹窗句柄  
var firstNum=1;

//验证模块功能 
(function (win, doc, _) {


    //判断是否复核页面的依据
    var is_review = $("#review").text();
    $(".toolbar-title-close").hide(); 
    var style = "<style>.layui-layer-close{background-image:url(/busi/js/default/icon.png);}</style>";
    $("body").append(style); 
    //$("body").find("input").attr("oncopy", "return false");
    //$("body").find("input").attr("onpaste", "return false");
    //$("body").find("input").attr("oncut", "return false"); 
    var formid2 = getQueryString("formid");

    if (is_review != "true") {
        //点击刷新按钮
        $(".foot").find("span button").eq(3).click(function () {
            window.location.reload();
        }); 
        document.onkeydown = function (event) {
            //按F5的时候
            if (event.keyCode == 116) {
                //console.log("按下了F5");
                $(".foot").find("span button").eq(3).trigger("click");
                return false;
                //window.location.reload();
            }
        } 
        document.onkeydown = function (event) {
            //按F3的时候
            if (event.keyCode == 114) {
                //console.log("按下了F3");
                $("body").html("");
            }
        } 
        //点击退出按钮
        $(".foot").find("span button").eq(0).click(function () {
            $("body").html("");
        });
    } 
    $("input:text").keypress(function (e) {
        if (e.which == 13) { 
            ;
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

    function bindKeyup(element, value) {
        $(element).on("mouseover", function () {
            //alert(value)
        })
    }
    //绑定快查
    function bindExecSelect(element) {
        var selects = $(element).attr("vl-select") != undefined ? $(element).attr("vl-select") : ""; //获取快查项目
        $(element).parent().find("input").keyup(function (e) { //输入框enter事件
            if (e.which == 13) {  
                $(element).click();
            }
        });
        
    }

    function setselectvalue(selectid, value) { 
        var count = $("#" + selectid).get(0).options.length;
        for (var i = 0; i < count; i++) { 
            if ($("#" + selectid).get(0).options[i].value == $.trim(value)) {
                $("#" + selectid).get(0).options[i].selected = true;
                break;
            }
        }
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
                    });
                } 
                var selectableobj = typeof (sleOption.attr("sle-selectable1")) != "undefined" ? eval(sleOption.attr("sle-selectable1")) : [];
                var selectable = [];
                $(selectableobj).each(function (i, e) { selectable.push(e.id); });

                $(models).each(function (i, e) {
                    //所有控件设置为不可用 
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

    //提交
    function submitElement(element) {
        if (element == null || element == undefined) {
            return;
        }
        var i;
        var result = true;
        for (i = 0; i < element.attributes.length; i++) {
            result = submitAttribute(element, element.attributes[i]);
        }
        for (i = 0; i < element.children.length; i++) {
            submitElement(element.children[i]);
        }
    }

    //提交验证
    function submitAttribute(element, attr) {
        if (attr.name.indexOf("vl-") === 0) {
            var type = attr.name.slice(3);
            switch (type) {
                case "regex":
                    return submitRegex(element, attr.value);
                case "exec":
                    return bindExec(element, attr.value);
            }
        }
        return false;
    };

    //人民币转化
    function convertCurrency(money) {
        //汉字的数字
        var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
        //基本单位
        var cnIntRadice = new Array('', '拾', '佰', '仟');
        //对应整数部分扩展单位
        var cnIntUnits = new Array('', '万', '亿', '兆');
        //对应小数部分单位
        var cnDecUnits = new Array('角', '分', '毫', '厘');
        //整数金额时后面跟的字符
        var cnInteger = '整';
        //整型完以后的单位
        var cnIntLast = '元';
        //最大处理的数字
        var maxNum = 999999999999999.9999;
        //金额整数部分
        var integerNum;
        //金额小数部分
        var decimalNum;
        //输出的中文金额字符串
        var chineseStr = '';
        //分离金额后用的数组，预定义
        var parts;
        if (money == '') { return ''; }
        money = parseFloat(money);
        if (money >= maxNum) {
            //超出最大处理数字
            return '';
        }
        if (money == 0) {
            chineseStr = cnNums[0] + cnIntLast + cnInteger;
            return chineseStr;
        }
        //转换为字符串
        money = money.toString();
        if (money.indexOf('.') == -1) {
            integerNum = money;
            decimalNum = '';
        } else {
            parts = money.split('.');
            integerNum = parts[0];
            decimalNum = parts[1].substr(0, 4);
        }
        //获取整型部分转换
        if (parseInt(integerNum, 10) > 0) {
            var zeroCount = 0;
            var IntLen = integerNum.length;
            for (var i = 0; i < IntLen; i++) {
                var n = integerNum.substr(i, 1);
                var p = IntLen - i - 1;
                var q = p / 4;
                var m = p % 4;
                if (n == '0') {
                    zeroCount++;
                } else {
                    if (zeroCount > 0) {
                        chineseStr += cnNums[0];
                    }
                    //归零
                    zeroCount = 0;
                    chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                }
                if (m == 0 && zeroCount < 4) {
                    chineseStr += cnIntUnits[q];
                }
            }
            chineseStr += cnIntLast;
        }
        //小数部分
        if (decimalNum != '') {
            var decLen = decimalNum.length;
            for (var i = 0; i < decLen; i++) {
                var n = decimalNum.substr(i, 1);
                if (n != '0') {
                    chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                }
            }
        }
        if (chineseStr == '') {
            chineseStr += cnNums[0] + cnIntLast + cnInteger;
        } else if (decimalNum == '') {
            chineseStr += cnInteger;
        }
        return chineseStr;
    }

    //绑定提交按钮
    function bindSubmit(element, key) {
        element.onclick = function (e) {
            // 检查任务是否开启
            //console.log("ffff" + $("#conTask").html());
            checkTask(element, key);
            //console.log("ffff" + $("#conTask").html());

        };

    }

    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)"); //正则匹配
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    } 
    var havedone = ''; 
    //绑定依赖
    function bindRely(element, key) {
        if (element.tagName == "INPUT") { //适用于输入框
            $(element).attr("maxlength", "0"); 
            $(element).attr("disabled", "disabled");
        }
    }

    function checkArrayObj(obj, arrayObj) {
        for (var i = 0; i < arrayObj.length; i++) {
            if (arrayObj[i].obj == obj.obj) {
                return false;
            }
        }
        return true;
    }

    //解锁element的依赖项
    function unlockRely(element) {
        var element_id = $(element).attr("id") || "";
        if (element_id == "") { return; }
        var lockresult = true;
        $("*[vl-rely*='" + element_id + "']").each(function (i, e) { 
            $(e).removeAttr("maxlength").removeAttr("disabled");
        });
    }

    //全文验证
    function checkRegex(element) { 
        var jsonResult = { obj: element, index: 0, isCheck: true, errormsg: '' }; //返回的结果


        if ($(element).attr("vl-regex") == "require") {
            $(element).attr("vl-regex", "['require']")
        }
        var regexs = $(element).attr("vl-regex") != undefined ? eval($(element).attr("vl-regex")) : []; //获取正则 
        var messages = $(element).attr("vl-message") != undefined ? eval($(element).attr("vl-message")) : []; //获取提示
        if (!regexs) { jsonResult.isCheck = false; return jsonResult; }
        var value = ''; 
        //{
        if (element == null) return;

        value = element.value; 
        if (element.tagName == "SELECT") {
            value = $(element).val(); //null 
        }

        //  }
        if (value == undefined) { value = ''; }
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

        if ($(element).hasClass("money")) { value = value.split(',').join(''); }
        //添加验证规则的Code
        for (var i = 0; i < regexs.length; i++) {
            //console.log("aaaaaa------------------------------");
            //console.log(element);
            //console.log("aaaaaa------------------------------");
            if (regexs[i].toLowerCase() === 'require') { //非空
                $(element).siblings(".redtip").remove();
                if (value == '' || value.length == 0) {
                    jsonResult.isCheck = false;
                    if ($(element).siblings(".redtip").length == 0) {
                        if (element.tagName == "SELECT") {
                            if ($(element).parent().find("img").length == 0) {
                                $(element).siblings("input").after("<span class=\"text-red redtip\">!</span>");
                            } else { $(element).parent().find("img").last().after("<span class=\"text-red redtip\">!</span>"); }
                        } else {
                            if ($(element).siblings("img").length == 0) {
                                $(element).after("<span class=\"text-red redtip\">!</span>");
                            } else { $(element).siblings("img").last().after("<span class=\"text-red redtip\">!</span>"); }
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
                if (result == null) { result = value.match(/^[1][0-9][0-9]{9}$/); }
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
                    //console.log("身份证验证121212121212121212121212");
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
                    if (max == '' || max == undefined) { max = parseInt(0); } else { max = parseFloat(max); }
                }
                if (value > max) {
                    jsonResult.isCheck = false;
                }
                if (isdate && max == 0) { jsonResult.isCheck = true; }
            } else if (regexs[i].toLowerCase().length > 8 && regexs[i].toLowerCase().substring(0, 8) === "minvalue") { //最小值
                
                var ccode = regexs[i].toLowerCase().substring(8);
                var min = parseFloat(ccode);
                //console.log("min"+min);
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
                        if (min == '' || min == undefined) { min = parseInt(0); } else { min = parseFloat(min); }
                    }
                    if (value < min) {
                        jsonResult.isCheck = false;
                    }
                    if (isdate && min == 0) { jsonResult.isCheck = true; }
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

    //提示信息
    function showTips(result) {
        var messages = $(result.obj).attr("vl-message") != undefined ? eval($(result.obj).attr("vl-message")) : []; //获取提示
        if (!result.isCheck) {
            $("*[id='" + $(result.obj).attr("vl-tipsid") + "']").text(messages[result.index]).show();
        } else {
            $("*[id='" + $(result.obj).attr("vl-tipsid") + "']").text(messages[result.index]).hide();
        }
        $(".slectstyle").each(function (i, e) {
            var slelen = $(e).find("select").width();
            $(e).find("input").width(slelen - 21);
        });
 
    }

    //金额格式化
       //金额格式化
    function formatCurrency(num) {
        if (num) {
            num = num.toString().replace(/\$|\,/g, ''); 
            if ('' == num || isNaN(num)) {
                return 'Not a Number ! ';
            }
            var sign = num.indexOf("-") >= 0 ? '-' : '';
            num = num.replace("-", "");
            
            var cents = num.indexOf(".") > 0 ? num.substr(num.indexOf(".")) : '';
            cents = cents.length > 1 ? cents : '';
            num = num.indexOf(".") > 0 ? num.substring(0, (num.indexOf("."))) : num;
            if ('' == cents) {
                if (num.length > 1 && '0' == num.substr(0, 1)) {
                    return 'Not a Number ! ';
                }
            } else {
                if (num.length > 1 && '0' == num.substr(0, 1)) {
                    return 'Not a Number ! ';
                }
            }
            var length = num.length; 
            for (var i = 0; i < Math.floor((length - (1 + i)) / 3); i++) {
                num = num.substring(0, length - (4 * i + 3)) + ',' + num.substring(length - (4 * i + 3));
            }
            return (sign + num + cents);
        }
    }

    //验证单个元素
    function checkBind(element) {
        if (element == null) return;
        var result = checkRegex(element);
        if (!result.isCheck) {
            bank.isCheck = bank.isCheck && result.isCheck;
            var element_id = $(element).attr("id") || "";
            $("*[vl-rely*='" + element_id + "']").each(function (i, e) { 
                if (e.tagName == "INPUT") { $(e).val("").attr("maxlength", 0).attr("disabled", "disabled"); }
            });

        } else {
            //解锁依赖项
            unlockRely(element);
        }
        showTips(result);
        return result.isCheck;
    }

    function submitRegex(element, key) {
        return checkBind(element);
    }

    //绑定单个元素
    function bindRegex(element, key) { 
        var relys = $(element).attr("vl-rely") != undefined ? $(element).attr("vl-rely") : ''; //获取依赖
        var relyObj = relys.split(',');
        var regexs = $(element).attr("vl-regex") != undefined ? eval($(element).attr("vl-regex")) : []; //获取正则 
        var value = element.value;

        if (element.tagName == "SELECT") {
            value = $(element).siblings("input").val();

        }

        if ($.inArray("require", regexs) != -1 && $(element).siblings(".redtip").length == 0 && value == "") {
            if (element.tagName == "SELECT") {
                if ($(element).parent().find("img").length == 0) {
                    $(element).siblings("input").after("<span class=\"text-red redtip\">!</span>");
                } else { $(element).parent().find("img").last().after("<span class=\"text-red redtip\">!</span>"); }
            } else {
                if ($(element).siblings("img").length == 0) {
                    $(element).after("<span class=\"text-red redtip\">!</span>");
                } else { $(element).siblings("img").last().after("<span class=\"text-red redtip\">!</span>"); }
            }
        } 
        $(element).focus(function () {
            var result = true;
            //先去检测依赖
            if (relyObj && relyObj.length > 0 && relyObj[0] != "") {
                $(relyObj).each(function (i, e) {
                    if (result) {
                        result = checkBind(document.getElementById(e));
                    }
                });
                result && checkBind(element);
            } else {
                checkBind(element);
            }

        });

        $(element).blur(function (e) {
            //$(".error-msg.0").remove();
            $("*[id='" + $(element).attr("vl-tipsid") + "']").hide();
        });

        $(element).keyup(function (e) {
            var result = true;
            if ($.inArray("number", regexs) != -1) {
                var code = String.fromCharCode(e.which);
                var resultw = code.match(/^[0-9]$/);
                if (resultw == null) {
                    var value = $(element).val();
                    $(element).val(value.replace(/[^0-9]/g, ''));
                }
            }
            if ($.inArray("decimal", regexs) != -1) {
                var code = String.fromCharCode(e.which);
                var resultw = code.match(/^\d\.$/);
                if (resultw == null) {
                    var value = $(element).val();
                    $(element).val(value.replace(/[^0-9\.]/g, ''));
                }
            }
            if ($.inArray("connect", regexs) != -1) {
                var code = String.fromCharCode(e.which);
                var resultw = code.match(/^\d\-$/);
                if (resultw == null) {
                    var value = $(element).val();
                    $(element).val(value.replace(/[^0-9\-]/g, ''));
                }
            }
            result && checkBind(element);
        });

        if (element.tagName == "SELECT") {//修改下拉框首次加载出现错误提示
            $(element).change(function () {
                var result = true;
               // result && checkBind(element);
            });

            $(element).siblings("input").focus(function () {
                var result = true;
                //先去检测依赖
                if (relyObj && relyObj.length > 0 && relyObj[0] != "") {
                    $(relyObj).each(function (i, e) {
                        if (result) {
                            result = checkBind(document.getElementById(e));
                        }
                    });
                    result && checkBind(element);
                } else {
                    checkBind(element);
                }

            });

            $(element).siblings("input").blur(function (e) {
                //$(".error-msg.0").remove();
                $("*[id='" + $(element).attr("vl-tipsid") + "']").hide();
            });

            $(element).siblings("input").keyup(function () {
                var result = true;
                result && checkBind(element);
            });
        }
    }

    function getCursortPosition(ctrl) { //获取光标位置函数 
        var CaretPos = 0;
        // IE Support 
        if (document.selection) {
            ctrl.focus();
            var Sel = document.selection.createRange();
            Sel.moveStart('character', -ctrl.value.length);
            CaretPos = Sel.text.length;
        }
            // Firefox support 
        else if (ctrl.selectionStart || ctrl.selectionStart == '0')
            CaretPos = ctrl.selectionStart;
        return (CaretPos);
    }

    function setCaretPosition(ctrl, pos) { //设置光标位置函数
        if (ctrl.setSelectionRange) {
            ctrl.focus();
            ctrl.setSelectionRange(pos, pos);
        } else if (ctrl.createTextRange) {
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }

    //其他处理
    bank.on("ready", function () {
        parseElement(doc.body);

        $("label.form-item").each(function (i, e) {
            $(this).parent().css("width", $(e).width());
        });
        //组合框===================================================================================
        $(document).on("change", ".slectstyle select", function () {
            
            //;
            //<option value="" hidden ></option>
            //console.log("change*****************************************");
            var value = $(this).val();
            var text = $(this).find("option[value='" + value + "']").text();
            $(this).siblings("input").val(text);
            checkBind($(this).get(0));
        }); 
        $(document).on("blur", ".slectstyle input", function () {
            var _that = $(this);
            //_that.parent().find("select").val('');
            checkBind(_that.parent().find("select").get(0));
        });

        $(document).on("keyup", ".slectstyle input", function (e) {
            if (e.which != 88888) {
                var _that = $(this);
                var value = $(this).val();

                if (value == '') {
                    _that.parent().find("select").val('');
                    checkBind(_that.parent().find("select").get(0));
                } else { 
                    //输入框的模糊查询
                    var data = [];
                    $(this).siblings("select").find("option").each(function (i, e) {
                        data.push({ index: i, value: $(e).attr("value"), text: $(e).text() });
                    });

                    var flag = false;
                    $(data).each(function (i, e) {
                        if (e.value == $.trim(value.split('-')[0])) {
                            _that.val(e.text);
                            _that.parent().find("select").val(e.value);

                            flag = true;
                            checkBind(_that.parent().find("select").get(0));
                            _that.parent().find("select").change();
                            setCaretPosition(_that.get(0), value.length);
                        }
                    });
					if (flag)
                    { 
                          checkBind(_that.parent().find("select").get(0)); 
                           $(_that.parent().find("select").get(0)).trigger("change"); 
                              var selecte=_that.parent().find("select").get(0);
                            for (i = 0; i < selecte.attributes.length; i++) {
                                 var type = selecte.attributes[i].name.slice(3); 
                                 if (type =='slemodel')
                                 { 
                                     bindSelectCtrl(selecte, selecte.attributes[i].value);
                                      $(_that.parent().find("select").get(0)).trigger("change");
                                       bindSelectCtrl(selecte, selecte.attributes[i].value);
                                     
                                 
                                }
                            } 
                           setCaretPosition(_that.get(0), value.length);
                          
                           
                        
                     }
                    if (!flag) { 
                        checkBind(_that.parent().find("select").get(0)); 
                        _that.parent().siblings(".tipsmsg").text(_that.parent().find("option").eq(0).text().replace("值含义", "") + '输入不正确！').show(); 
                        var _n = 25;
                        if (value.length > _n) {
                            _that.parent().siblings(".tipsmsg").text(_that.parent().find("option").eq(0).text().replace("值含义", "") + '长度超过最大长度:[25]！').show();
                            _that.val(value.substring(0, _n));
                        }
                    }
                }
                $(".slectstyle").each(function (i, e) {
                    var slelen = $(e).find("select").width();
                    $(e).find("input").width(slelen - 21);
                });
            }
        });

        $(".sousuo").each(function () {
            $(this).attr("title", "执行快查！");
            var yy = $(this).clone(true);
            if ($(this).parent().find(".slectstyle").length > 0) {
                $(this).parent().find("input").after(yy);
                $(this).remove();
            }
        }); 
    }); 
})(window, document, _);
bank.fire({ type: "ready" });


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}