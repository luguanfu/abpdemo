//验证模块功能
var _ip="http://192.168.1.6:8104/";
(function(win, doc, _) {
 
$(".toolbar-title-close").hide();

    console.log("嘿嘿嘿嘿");
    //$(".layui-layer-close").css('background-image','url(url(/busi/js/default/icon.png)');

    var style = "<style>.layui-layer-close{background-image:url(/busi/js/default/icon.png);}</style>";
    $("body").append(style);

    //$("body").find("input").attr("oncopy","return false");
    //$("body").find("input").attr("onpaste","return false");
    //$("body").find("input").attr("oncut","return false");

    //var e33 = event || window.event || arguments.callee.caller.arguments[0];
    var formid2 = getQueryString("formid");
    console.log("~!~!!!!!!!!!~!~!~!~!~!~!~!~!~!~!~!~!~!我到这里了")
    console.log("formid2:" + formid2);


    //点击刷新按钮
    $(".foot").find("span button").eq(3).click(function() {
        window.location.reload();
    });

    document.onkeydown = function(event) {
        //按F5的时候
        if (event.keyCode == 116) {
            console.log("按下了F5");
            $(".foot").find("span button").eq(3).trigger("click");
            return false;
            //window.location.reload();
        }
    }


    document.onkeydown = function(event) {
        //按F3的时候
        if (event.keyCode == 114) {
            console.log("按下了F3");
            $("body").html("");
        }
    }

    //点击退出按钮
    $(".foot").find("span button").eq(0).click(function() {
        $("body").html("");
    });
    $(" input:text").keypress(function(e) {

        if (e.which == 13) {
            //debugger;
            var inputs = $("input[type=text]:not(:disabled)");
            var idx = inputs.index(this); // 获取当前焦点输入框所处的位置 
            $(inputs[idx]).siblings("img").trigger("click"); //输入框按enter执行快查事件
            if (idx == inputs.length - 1) { // 判断是否是最后一个输入框
                inputs[idx + 1].focus();
            } else {
                inputs[idx + 1].focus(); // 设置焦点  
                inputs[idx + 1].select(); // 选中文字  
            }
            return false; // 取消默认的提交行为  
        }
    });

    var moduleMap = {};
    var fileMap = {};
    var readyFunctions = [];
    var noop = function() {};
    var bank = function() {};
    bank.errors = [];
    bank.data = '';
    var addListener = doc.addEventListener || doc.attachEvent;
    var removeListener = doc.removeEventListener || doc.detachEvent;

    var eventName = doc.addEventListener ? "DOMContentLoaded" : "onreadystatechange";

    addListener.call(doc, eventName, function() {
        for (var i = readyFunctions.length - 1; i >= 0; i--) {
            if (readyFunctions[i]) {
                for (var j = 0; j < readyFunctions[i].length; j++) {
                    readyFunctions[i][j]();
                }
            }
        }
    }, false);

    var Events = {
        on: function(eventType, handler) {
            if (!this.eventMap) {
                this.eventMap = {};
            }

            if (!this.eventMap[eventType]) {
                this.eventMap[eventType] = [];
            }
            this.eventMap[eventType].push(handler);
        },

        off: function(eventType, handler) {
            for (var i = 0; i < this.eventMap[eventType].length; i++) {
                if (this.eventMap[eventType][i] === handler) {
                    this.eventMap[eventType].splice(i, 1);
                    break;
                }
            }
        },

        fire: function(event) {
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

        define: function(name, dependencies, factory) {
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

        use: function(name) {
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

        require: function(pathArr, callback) {
            var base = this.base;
            for (var i = 0; i < pathArr.length; i++) {
                loadFile(pathArr[i]);
            }

            function loadFile(file) {
                var head = doc.getElementsByTagName('head')[0];
                var script = doc.createElement('script');
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('src', file + '.js');
                script.onload = script.onreadystatechange = function() {
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

        ready: function(handler, priority) {
            priority = (priority === null) ? 1 : priority;

            if (!readyFunctions[priority]) {
                readyFunctions[priority] = [];
            }
            readyFunctions[priority].push(handler);
        },

        error: function() {

        },

        log: function(obj) {
            try {
                console.log(obj);
            } catch (ex) {

            }
        }
    });

    _.extend(bank, Events);

    win.bank = bank;

    bank.define("_", [], function() {
        return _;
    });

    //Events
    bank.define("Events", [], function() {
        return Events;
    });

    //后期需要可以拓展，添加额外模块功能
    // bank.on("ready", function () {
    // bank.require(["binding"], function () {
    // var binding = bank.use("binding");
    // binding.parse();
    // });
    // });

    //标签元素遍历标签元素遍历
    function parseElement(element) {
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
        $(element).on("mouseover", function() {
            alert(value)
        })
    }
    //绑定快查
    function bindExecSelect(element) {
        var selects = $(element).attr("vl-select") != undefined ? $(element).attr("vl-select") : ""; //获取快查项目
        $(element).parent().find("input").keyup(function(e) { //输入框enter事件
            if (e.which == 13) {
                $(element).click();
            }
        });
        $(element).on("click", function() { //快查按钮点击事件

            $(this).attr("vl-exec", "true");
			var SelectValue= $(this).siblings("select").find("option:selected").text();
			console.log("+++++++++++++++++++++++++++++");
			console.log("valuessss"+SelectValue);
			console.log("+++++++++++++++++++++++++++++");
            //alert("111:" + $("#txt_zkh").val()); //1:查询是否有固定的数据源:sql值,拼一下SQL,增查询数据库,2:查询任务内置表,先做这个
            //如果查到,就通过或内置,如果没有查到,就弹出帐号不对的提示框
            var examid = getQueryString("examid");
            var userid = getQueryString("tellerId");
            var formid = getQueryString("formid");
            var taskid = getQueryString("taskid");
            var finData = $("#findData").html();
            
            var defaultData = $("#DefaultValue").html();
            console.log("************************************");
            console.log("defaultData:"+defaultData);
            console.log("************************************");
            var biaozhi="@";
            //var ddddddddd="$030601#sle_djfs#0-只进不出;txt_freeze_num#1;txt_zhmc#齐克;#txt_account_card#6217790001054759813&sle_djfs#1-不进不出;txt_freeze_num#1;txt_zhmc#齐克;#txt_account_card#6217790001054759813$030601#sle_number#1-个人银行结算存款;txt_zhmc#齐克;sle_bz#CNY-人民币;sle_product_code#11011-个人银行结算存款;#txt_account_card#6217790001054759813$030601#sle_number#2-整存整取1年;txt_zhmc#齐克;sle_bz#CNY-人民币;sle_product_code#41011-整存整取;#txt_account_card#6217790001054759813$030601#sle_number#1-个人银行结算存款;txt_zhmc#齐克;sle_bz#CNY-人民币;sle_product_code#11011-个人银行结算存款;#txt_account_card#6217790001054759813$030601#sle_number#2-整存整取1年;txt_zhmc#齐克;sle_bz#CNY-人民币;sle_product_code#41011-整存整取;#txt_account_card#6217790001054759813";
            if(defaultData.indexOf(biaozhi)>-1)
            {
            	var strs= new Array();
            	strs=defaultData.split("@");
            	
            	console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            	console.log("第一条数据:"+strs[0]);
            	console.log("第二条数据:"+strs[1]);
            	var dierxiang =strs[1];
            	console.log("第二条数据的第\项:"+dierxiang);
            	var sData = new Array();
            	sData = dierxiang.split("#");
            	console.log("第二条数据的第一项:"+sData[1]);
            	var das= "#"+sData[1];
            	var needDataforfirst= new Array();
            	var needDataforfirst=strs[0].split(""+das+"");
            	console.log("第二条数据的第er项:"+needDataforfirst[0]);
            	console.log("第三条数据:"+strs[2]);
            	console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
 	         	var number1=strs.length;
 	         	var temp=strs[number1-1].split("$");
				var last = temp[0];//最后一个下拉值
				var needData=strs[number1-1].replace(last,"");
				console.log("77777777");
            	for(var i = 0;i < strs.length; i++) 
            	{
					values1 = SelectValue.replace(/\s/g, "");
					console.log("++++++++++++:"+values1);
					if(strs[i].indexOf(values1)>-1)
					{
						console.log("================================================================");
						if(i!=0)
						{
							console.log("对的,是来了这里")
							defaultData=needDataforfirst[0]+strs[i]+needData;
						}
						else{
							defaultData=strs[i]+needData;
						}
						
						
						console.log("pppppppppppppppp:"+defaultData);
						console.log("================================================================");
					}
				}
				///console.log("111111111111111111111111111111111111111111111111111111111:"+ddddddddd);
            }
                //alert("aaa:"+ defaultData);
            console.log("thisconname:" + $(element).prev().attr("id") + "&" + $(element).prev().val() + ":ddd:" + finData + ":::" + defaultData);
            if ($.trim($(element).prev().val()) == '') {
                return;
            }
            console.log("我在外面了");
            if ($.trim($(element).prev().val()).length < 5 && formid != "030608") {
                console.log("我进来了");
                return;
            }

            if (selects != '') {
                $(selects.split(',')).each(function(i, e) { //提取快查项目，默认赋值、、以后需要从后台提取数据

                    var index = e.indexOf("|");
                    var value = e.substring(0, index);
                    var disabled = e.substring(index + 1);
                    var telement = document.getElementById(value);
                    console.log('rrrr:' + telement);
                    //if(typeof($(telement).attr("tagName"))!="undefined")
                    //{
                    if (telement == null) return;
                    console.log("formid333:" + formid);
                    if (formid == '030606') {
                        $('#sle_zfxh').val($('#sle_zfxh').find("option").eq(1).attr("value"));
                        $('#sle_zfxh').siblings("input").val($('#sle_zfxh').find("option").eq(1).text());
                    } else {
                        if (formid == '010101') {

                            $('#sle_zfxh').val($('#sle_zfxh').find("option").eq(1).attr("value"));
                            $('#sle_zfxh').siblings("input").val($('#sle_zfxh').find("option").eq(1).text());
                        }
                        if (telement.tagName == "SELECT") { //赋值第一个值

                            $(telement).val($(telement).find("option").eq(1).attr("value"));
                            $(telement).siblings("input").val($(telement).find("option").eq(1).text());



                        } else {

                            console.log("111111:" + telement.id);
                            var conid = telement.id;
                            if (conid.indexOf('zhhm') > -1) {
                                telement.value = "测试账号名";
                            }

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
            console.log("defaultData:" + defaultData);

            //010101:txt_zjhm:520102196912076217;sle_yxqlx:0-无有效期;sle_hcjg:1-真实;sle_bz:CNY-人民币;sle_zhlx:1-个人结算账户;
            if (defaultData != "") {

                //查询任务内置数据,循环窗口。
                // 030604#sle_number#1-个人银行结算存款;txt_zhmc#危菲舜;sle_currency_kind#CNY-人民币;sle_product_code#11011-个人银行结算存款;%txt_account_card%010102
                //010102#sle_qxlx#1-有有效期;txt_zjdqr#20240215;sle_hcjg#00-公民身份证号码与姓名一致&且存在照片;sle_hsjg#1-真实;sle_bz#CNY-人民币;sle_zqfs#1-密码;sle_cxmm#N-否;sle_sflm#Y-是;sle_tctdbz#1-通存通兑;#txt_zjhm#080101:txt_zjhm
                var dataArray1 = defaultData.substring(1).split('$');

                var havedata = '';
                for (var h = 0; h < dataArray1.length; h++) {
                    if (dataArray1[h].length < 6) continue;
                    if (dataArray1[h].substring(0, 6) == formid) {
                        // 判断是不是当前控件
                        //$(element).prev().attr("id")
                        defaultData = dataArray1[h];
                        var dataarray = dataArray1[h].split(';');

                        var keydata = dataarray[dataarray.length - 1].split('#')[1];
                        //console.log("yyyy:" +keydata + ":" + $(element).prev().attr("id")+":" + defaultData);
                        if (keydata == $(element).prev().attr("id")) {

                            havedata = '1';
                            defaultData = dataArray1[h];
                            break;
                        } else {
                            defaultData = '';
                        }
                    }
                }

                console.log('eeee:' + defaultData + "ooooo:" + havedata);
                if (havedata == '') {
                    return;
                }

                console.log('eeee2:' + defaultData);
                defaultData = defaultData.replace("&amp;", ",");
                console.log('eeee3:' + defaultData);
                var dataArray = defaultData.split(';');
                var formidtmp = dataArray[0].split('#')[0];
                var formidtmp = dataArray[0].split('#')[0];

                //根据业务数据,进行查询是否存在的.:
                var targeArray = dataArray[dataArray.length - 1].substring(1).replace('*', '#').split('#');

                // 当前控件名:
                var curConName = targeArray[0];
                console.log("notbb1b11:" + curConName + ":" + $(element).prev().attr("id"));
                if (curConName != $(element).prev().attr("id")) {
                    console.log("notbb1b11:");
                    return;
                }

                var finddataflag = '';

                var targetFormdata = targeArray[1].split(';');
                console.log("bb1b:" + dataArray[dataArray.length - 1] + ":" + targeArray[1] + ":" + dataArray[dataArray.length - 1]);

                // 如果是要查询已有业务,查询对了,就显示默认值,错了,就提示输入值不存在
                var addcolumn = '';
                if (formid == '010102') { addcolumn = "txt_khh"; }

                if (targeArray.length == 3) {
                    //其它业务
                    console.log("bb1b115:");
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: "/indexone/findData",
                        data: { data: targeArray[1] + ";" + targeArray[2] + ";" + $(element).prev().val() + ";" + examid + ";" + userid + ";findtable" + "#" + addcolumn },
                        success: function(row) {
                            console.log(row)
                            console.log('add:' + row.data)
                                //var dataArray = row.data.split(';');//1;txt_zkh,520102196912076217;sle_xh,0-无有效期;sle_fjlx,1-真实
                            if (row.data == "wrong11111") {
                                //alert("核心系统提示:["+$(element).prev().val()+"]帐号不存在");
                                //layer.alert("核心系统提示:["+$(element).prev().val()+"]帐号不存在");
                                //console.log('have no data');
                                // return;

                            } else {
                                console.log('have data');
                                finddataflag = '1';
                                //console.log("findok:" + row.data + ":" + finddataflag);
                                if (formid == '010102') {
                                    $("#txt_khh").val(+row.data);

                                }
                                console.log("findok:" + row.data + ":" + finddataflag);

                                console.log("bbc:" + finddataflag);

                                console.log("bb1:" + formidtmp + ":" + formid + "::" + finddataflag);
                                // 如果是ID是一样的，
                                if (formidtmp == formid && curConName == $(element).prev().attr("id")) {

                                    var keyConName = dataArray[0].split('#')[1];
                                    var keyConValue = dataArray[0].split('#')[2];
                                    var curkeyConValue = $("#" + keyConName).val()
                                    console.log("cc:" + keyConName + ":" + dataArray[0] + ":" + curkeyConValue + ":" + keyConValue);

                                    //if (curkeyConValue==keyConValue)
                                    // {
                                    //console.log("dd:"+curkeyConValue + ":" + keyConValue);
                                    // 取默认值
                                    for (var i = 0; i < dataArray.length; i++) //dataArray.length
                                    {
                                        console.log("ee:" + dataArray[i]);
                                        if (dataArray[i].length > 3) {
                                            if (dataArray[i].split('#')[0] == '') continue;
                                            console.log("ff:" + dataArray[i].split('#').length + ":" + dataArray[i].split('#')[0] + ":" + dataArray[i].split('#')[1]);
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

                                            console.log("#de0" + selectvalue + ":" + seelecttext + ":" + conid);
                                            //var count=$("#" + selectname).get(0).options.length;
                                            //console.log("count:" + count);
                                            //console.log("value:" + selectvalue + ";" + dataArray[i]);
                                            // 给下拉框赋值

                                            // 如果不是只读的,就不赋值
                                            //if ($("#" + selectname).attr("disabled") =='disabled')
                                            //{
                                            if (conid.indexOf('sle_') > -1) {
                                                $("#" + selectname).val(selectvalue);
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

                                console.log("FindData:" + finData);

                                if (finData != "" && finData.length > 10) // 没有内置数据,读最新的做的业务数据
                                {
                                    // 查询固定表内置数据txt_zjhm,sle_fjlx,txt_zhmc;010104;txt_zkh,sle_xh,sle_fjlx;1;身份证号码不对
                                    // 查询后台数据,如果对就通过,如果不对,就给出错误提示
                                    $.ajax({
                                        type: "POST",
                                        dataType: "json",
                                        url: "/indexone/findData",
                                        data: { data: finData + ";" + examid + ";" + userid },
                                        success: function(row) {
                                            console.log(row)
                                            console.log(row.data)
                                            var dataArray = row.data.split(';'); //1;txt_zkh,520102196912076217;sle_xh,0-无有效期;sle_fjlx,1-真实
                                            if (dataArray[0] == "1" || dataArray[0] == "0") {
                                                // 默认值赋值
                                                for (var i = 1; i < dataArray.length; i++) //dataArray.length
                                                {
                                                    //console.log("ee:"+dataArray[i]);
                                                    if (dataArray[i].length > 3) {
                                                        console.log("ff:" + dataArray[i].split(',')[0] + ":" + dataArray[i].split(',')[1]);
                                                        //$("#"  +dataArray[i].split(':')[0]).val(dataArray[i].split(':')[1])//直接赋值
                                                        var selectname = dataArray[i].split(',')[0];
                                                        var selectvalue = dataArray[i].split(',')[1].split('-')[0];
                                                        console.log("#find" + selectvalue);
                                                        //var count=$("#" + selectname).get(0).options.length;
                                                        //console.log("count:" + count);
                                                        // 如果有#,取前面的值
                                                        if (selectvalue.indexOf('#') > -1) {
                                                            selectvalue = selectvalue.split('#')[0];
                                                        }
                                                        if ($("#" + selectname).val().length < 15) {
                                                            $("#" + selectname).val(selectvalue);
                                                            $("#" + selectname).siblings("input").val(dataArray[i].split(',')[1]);
                                                        }
                                                    }
                                                }

                                            } else {
                                                alert(dataArray[0]);
                                            }

                                        }
                                    })

                                }

                            }

                        }
                    });

                } else {
                    finddataflag = '1';
                    //targeArray =  dataArray[dataArray.length-1].substring(1).replace('*','#').split('#');
                    console.log('no db:' + targeArray[1] + ":" + targeArray[0] + "：" + dataArray[dataArray.length - 1].substring(1).replace('*', '#'));
                    // 数据
                    if (targeArray[1] != $(element).prev().val() && targeArray[1] != "%") {
                        //alert("核心系统提示:["+ $(element).prev().val()+"]帐号不存在");
                        //layer.alert("核心系统提示:["+ $(element).prev().val()+"]帐号不存在");
                        // return; 
                    }

                    console.log("bb2:" + formidtmp + ":" + formid + "::" + finddataflag);
                    // 如果是ID是一样的，
                    if (formidtmp == formid && curConName == $(element).prev().attr("id")) {

                        var keyConName = dataArray[0].split('#')[1];
                        var keyConValue = dataArray[0].split('#')[2];
                        var curkeyConValue = $("#" + keyConName).val()
                        console.log("cc:" + keyConName + ":" + dataArray[0] + ":" + curkeyConValue + ":" + keyConValue);

                        //if (curkeyConValue==keyConValue)
                        // {
                        //console.log("dd:"+curkeyConValue + ":" + keyConValue);
                        // 取默认值
                        for (var i = 0; i < dataArray.length; i++) //dataArray.length
                        {
                            console.log("ee:" + dataArray[i]);
                            if (dataArray[i].length > 3) {
                                if (dataArray[i].split('#')[0] == '') continue;
                                console.log("ff:" + dataArray[i].split('#').length + ":" + dataArray[i].split('#')[0] + ":" + dataArray[i].split('#')[1]);
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

                                console.log("#de0" + selectvalue + ":" + seelecttext + ":" + conid);
                                //var count=$("#" + selectname).get(0).options.length;
                                //console.log("count:" + count);
                                //console.log("value:" + selectvalue + ";" + dataArray[i]);
                                // 给下拉框赋值

                                // 如果不是只读的,就不赋值
                                //if ($("#" + selectname).attr("disabled") =='disabled')
                                //{
                                if (conid.indexOf('sle_') > -1) {
                                    $("#" + selectname).val(selectvalue);
                                    $("#" + selectname).siblings("input").val(seelecttext);
                                } else {
                                    $("#" + selectname).val(seelecttext);
                                }
                                //}
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

                    console.log("FindData:" + finData);

                    if (finData != "" && finData.length > 10) // 没有内置数据,读最新的做的业务数据
                    {
                        // 查询固定表内置数据txt_zjhm,sle_fjlx,txt_zhmc;010104;txt_zkh,sle_xh,sle_fjlx;1;身份证号码不对
                        // 查询后台数据,如果对就通过,如果不对,就给出错误提示
                        $.ajax({
                            type: "POST",
                            dataType: "json",
                            url: "/indexone/findData",
                            data: { data: finData + ";" + examid + ";" + userid },
                            success: function(row) {
                                console.log(row)
                                console.log(row.data)
                                var dataArray = row.data.split(';'); //1;txt_zkh,520102196912076217;sle_xh,0-无有效期;sle_fjlx,1-真实
                                if (dataArray[0] == "1" || dataArray[0] == "0") {
                                    // 默认值赋值
                                    for (var i = 1; i < dataArray.length; i++) //dataArray.length
                                    {
                                        //console.log("ee:"+dataArray[i]);
                                        if (dataArray[i].length > 3) {
                                            console.log("ff:" + dataArray[i].split(',')[0] + ":" + dataArray[i].split(',')[1]);
                                            //$("#"  +dataArray[i].split(':')[0]).val(dataArray[i].split(':')[1])//直接赋值
                                            var selectname = dataArray[i].split(',')[0];
                                            var selectvalue = dataArray[i].split(',')[1].split('-')[0];
                                            console.log("#find" + selectvalue);
                                            //var count=$("#" + selectname).get(0).options.length;
                                            //console.log("count:" + count);
                                            // 如果有#,取前面的值
                                            if (selectvalue.indexOf('#') > -1) {
                                                selectvalue = selectvalue.split('#')[0];
                                            }
                                            if ($("#" + selectname).val().length < 15) {
                                                $("#" + selectname).val(selectvalue);
                                                $("#" + selectname).siblings("input").val(dataArray[i].split(',')[1]);
                                            }
                                        }
                                    }

                                } else {
                                    alert(dataArray[0]);
                                }

                            }
                        })

                    }
                }

            } else {

            }
            // console.log("FindData1:" + finData);
            //finData= finData.replace(/;/g,'');
            //finData= finData.replace(/0/g,'');

        });
    }



    function setselectvalue(selectid, value) {
        console.log("selectid898989898989898:" + selectid);
        var count = $("#" + selectid).get(0).options.length;
        for (var i = 0; i < count; i++) {
            console.log("selectid:" + selectid + "values:" + $("#" + selectid).get(0).options[i].value + ":" + $.trim(value) + ":");
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
                        $(element).focus(function() {
                            $(element).siblings(".moneytips").show(); //.css("left", -$(element).width());
                        });
                    }
                    $(element).blur(function() {
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
                    $(element).keyup(function(e) {
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
                    $(element).focus(function() {
                        var random = "id" + Math.random();
                        var layindex = layer.open({
                            title: '密码输入',
                            content: "<div>你的密码：<input type='password' id='" + random + "1'/></br>确认密码：<input type='password' id='" + random + "2'/></br><p style='color:red;display:none;'>两次输入的密码不一致！</p></div>",
                            scrollbar: false,
                            success: function(layero, index) {
                                $(layero).find("input").eq(0).focus();
                            },
                            yes: function(index, layero) {
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
                    //var random = "cla" + Math.floor(Math.random() * 100);
                    //$(element).wrap("<div style=\"height: 20px;\">").after("<img class=\"img" + random + "\" src=\"http://120.24.172.198:1203/bankingsystem/kaihu/slectbj.png\" style=\"position: relative; left: 90%; top: -21px;\"/>");
                    //var ulObj = typeof ($(element).attr("vl-ul")) != "undefined" ? eval($(element).attr("vl-ul")) : [];
                    //var htm = "";

                    //for (var i = 0; i < ulObj.length; i++) {
                    //    htm += "<li class=\"" + random + "\" data-value=\"" + ulObj[i].value + "\" style=\"padding: 2px;\">" + ulObj[i].text + "</li>";
                    //}
                    //if (htm != "") {
                    //    $(element).parent().append("<ul style=\"position: relative; background: white; width: 100%; border: 1px solid #ccc; top: -25px; z-index: 100000;display:none;\">" + htm + "</ul>");
                    //}

                    //$(document).on("mouseover", "." + random, function () {
                    //    $(this).css({ "background": "#298ecc", "color": "#FFF" });
                    //});

                    //$(document).on("click", "." + random, function () {
                    //    element.value = $(this).text();
                    //    $(element).parent().find("ul").hide();
                    //});

                    //$(document).on("mouseout", "." + random, function () {
                    //    $(this).css({ "background": "#FFF", "color": "#000" });
                    //});

                    //$(element).keydown(function (event) {
                    //    var e = event || window.event || arguments.callee.caller.arguments[0];
                    //    if (e && e.keyCode == 13) { // enter 键
                    //        var value = element.value;
                    //        $(element).parent().find("li").each(function (i, e) {
                    //            if ($(e).data("value") == value) {
                    //                element.value = $(e).text();
                    //            }
                    //        });
                    //    }
                    //});

                    //$(document).on("click", ".img" + random, function () {
                    //    var value = element.value;
                    //    $(element).parent().find("ul").toggle();
                    //    $(element).parent().find("li").each(function (i, e) {
                    //        if ($(e).text() == value) {
                    //            $(e).css({ "background": "#298ecc", "color": "#FFF" }).addClass("sle");
                    //        }
                    //    });
                    //});
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
                $(element).val("-1");
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

        $(objArray).each(function(i, e) {
            if (id === e.id) {
                console.log("1111a:" + id + ":" + e.id + ":" + e.regex);
                $(document.getElementById(id)).attr("vl-regex", "['" + e.regex.toString().split(',').join("','") + "']").attr("vl-message", "['" + e.tips.toString().split(',').join("','") + "']").attr("vl-tipsid", e.tipsid).attr("vl-default", e.default).attr("vl-disabled", e.disabled);
            }
        });
    }

    //绑定有规则的下拉框
    function bindSelectCtrl(element, key) {
        if (element.tagName == "SELECT" && key.length > 0) {
            var models = key.length > 0 && key.split(",");
            $(models).each(function(i, e) {
                try {
                    var isSelect = document.getElementById(e).tagName == "SELECT";
                    //所有控件设置为不可用
                    //$(document.getElementById(e)).attr("disabled", "disabled");
                    if (isSelect) {
                        //    document.getElementById(e).selectedIndex = -1;
                        //    $(document.getElementById(e)).css("background-color", "#e6e6e6");
                        //$(document.getElementById(e)).siblings("input").attr("disabled", "disabled");
                    }
                } catch (exception) {}
            });
            $(element).change(function() {
                $(element).find("option").each(function(i, e) {
                    var zhiyuObj = typeof($(e).attr("sle-zhiyu")) != "undefined" ? eval($(e).attr("sle-zhiyu")) : [];
                    $(zhiyuObj).each(function(i, e) {
                        $("#" + e.id).find("option").removeClass("hide");
                        $("#" + e.id).val('');
                        $("#" + e.id).siblings("input").val('');
                    });

                    var tabObj = typeof($(e).attr("sle-tabable")) != "undefined" ? $(e).attr("sle-tabable").split(',') : [];
                    $(tabObj).each(function(i, e) {
                        var ed = e.split('|');
                        var id = ed[0],
                            ishide = ed[1],
                            alldisable = ed[2];
                        $("#" + id).removeClass("disable");
                    });
                });
                var sleIndex = element.selectedIndex;
                var sleOption = $(element).find("option").eq(sleIndex);
                var requiresObj = typeof(sleOption.attr("sle-require")) != "undefined" ? eval(sleOption.attr("sle-require")) : [];
                var zhiyuObj = typeof(sleOption.attr("sle-zhiyu")) != "undefined" ? eval(sleOption.attr("sle-zhiyu")) : [];
                var tabObj = typeof(sleOption.attr("sle-tabable")) != "undefined" ? sleOption.attr("sle-tabable").split(',') : [];
                var requires = [];
                if (requiresObj.length > 0) {
                    $(requiresObj).each(function(i, e) {
                        requires.push(e.id);
                    });
                }
                if (zhiyuObj.length > 0) {
                    $(zhiyuObj).each(function(i, e) {
                        $("#" + e.id).find("option[value!='']").addClass("hide");
                        $(e.zhiyu.split(',')).each(function(ii, ee) {
                            $("#" + e.id).find("option[value='" + ee + "']").removeClass("hide");
                        });
                    });
                }
                if (tabObj.length > 0) {
                    $(tabObj).each(function(i, e) {
                        var ed = e.split('|');
                        var id = ed[0],
                            ishide = ed[1],
                            alldisable = ed[2];
                        if (ishide == 'true') {
                            $("#" + id).addClass("disable");
                        }
                        if (alldisable == 'true') {
                            var index = $(".box .tab li." + id).index();
                            $(".box .content .ct").eq(index).find("input").attr("disabled", "disabled");
                            $(".box .content .ct").eq(index).find("select").attr("disabled", "disabled");
                        } else {
                            var index = $(".box .tab li." + id).index();
                            $(".box .content .ct").eq(index).find("input").removeAttr("disabled");
                            $(".box .content .ct").eq(index).find("select").removeAttr("disabled");
                        }
                        //parseElement(element);
                    });
                }
                //} else {
                //    $(".box .content .ct").find("input").removeAttr("disabled");
                //    $(".box .content .ct").find("select").removeAttr("disabled");
                //    parseElement(element);
                //}
                //var selectable = typeof (sleOption.attr("sle-selectable")) != "undefined" ? sleOption.attr("sle-selectable").split(",") : [];
                var selectableobj = typeof(sleOption.attr("sle-selectable1")) != "undefined" ? eval(sleOption.attr("sle-selectable1")) : [];
                var selectable = [];
                $(selectableobj).each(function(i, e) { selectable.push(e.id); });

                $(models).each(function(i, e) {
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
                        } catch (exception) {}
                        //    //$(document.getElementById(e)).removeAttr("disabled").removeAttr("vl-disabled");
                        //    //$(document.getElementById(e)).val('');
                        //    //isSle && $(document.getElementById(e)).css("background-color", "#fff");
                        //    //isSle && (document.getElementById(e).selectedIndex = -1);
                        //    //设置为不可用，取消属性，取消事件
                        if ($.inArray(e, requires) == -1 && $.inArray(e, selectable) == -1) {

                            if (requiresObj.length == 0) {

                                if ($R.data("vl-regex") != undefined && $R.data("vl-regex") != '') {
                                    $R.attr("vl-regex", $R.data("vl-regex"));
                                    console.log("1111c:");
                                    $R.attr("vl-message", $R.data("vl-message"));
                                    $R.attr("vl-default", $R.data("vl-default"));
                                } else {

                                    //$(document.getElementById(e)).removeAttr("vl-regex").removeAttr("vl-message").removeAttr("vl-default");
                                    //$R.attr("vl-regex","");
                                    //$R.attr("vl-message", "");
                                    //$R.attr("vl-default", "");
                                }
                            }
                            parseElement(document.getElementById(e));
                            //还原控件默认值
                            //$(document.getElementById(e)).attr("vl-default", $(document.getElementById(e)).data("pre-default"));
                            //parseElement(document.getElementById(e));
                            //        //$(document.getElementById(e)).attr("disabled", "disabled");
                            //        if (isSle) {
                            //            //document.getElementById(e).selectedIndex = -1;
                            //            //$(document.getElementById(e)).css("background-color", "#e6e6e6");
                            //        }
                            //        //取消事件
                            //        $(document.getElementById(e)).off();
                            //        //取消属性
                            //        $(document.getElementById(e)).removeAttr("vl-regex").removeAttr("vl-message").removeAttr("vl-default");
                        } else {
                            $(document.getElementById(e)).removeAttr("disabled").removeAttr("vl-disabled");
                            if (isSle) {
                                $(document.getElementById(e)).siblings("input").removeAttr("disabled").removeAttr("vl-disabled");
                            }
                            //必填项处理
                            if ($.inArray(e, requires) != -1) {
                                //添加事件，添加属性
                                console.log("0000:" + e + ":" + requires);
                                setAttributes(e, requiresObj);
                                parseElement(document.getElementById(e));
                            }
                            //if (isSle) {
                            //    $(document.getElementById(e)).siblings("input").removeAttr("disabled").removeAttr("vl-disabled");
                            //}
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
        element.onclick = function(e) {
            // 检查任务是否开启
            console.log("ffff" + $("#conTask").html());
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

    function checkTask(element, key) {

        // 如果当前任务为空，或是当前任务和取的COOKIE任务不一样，
        //var curk = getCookie("ServiceRecord_Id");
        var taskid = $("#taskidCur").html();
        console.log("ffffe" + taskid);
        if (taskid == '') {
            layer.alert('任务未开启！');
            return;
        }

        //if (curk !=taskid)//优化考虑，暂时不做。
        //{
        //$("#taskidCur").html(curk);
        //        //getinfo();
        //}

        var formid = getQueryString("formid");
        var taskid = $("#taskidCur").html();
        console.log("11");
        var examid = getQueryString("examid");
        var siteid = getQueryString("banksiteid");
        console.log("111");
        var userid = getQueryString("tellerId");
        console.log("22");
        var planid = getQueryString("planid");
        var data = formid + "," + taskid + "," + examid + "," + siteid + "," + userid + "," + planid;
        console.log(data);

        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/indexone/checkTask",
            data: { data: data },
            success: function(row) {
                console.log(row)
                saveNccpResult(formid);
                var msguser = '';
                if (row.data == "ok:0") {
                    layer.alert('任务未开启！');
                } else {
                    console.log("任务可以提交");

                    //检查凭证号状态时需要用到
                    var some_params = { examid: examid, banksiteid: siteid, userid: userid, planid: planid };

                    var some_params_02 = { examid: examid, banksiteid: siteid, userid: userid, planid: planid, formid: formid, taskid: taskid };
                    //司法扣划业务提交，函数内部做了判断


                    //检查是否需要校验凭证号
                    isCheckVoucherNo(formid, function(cdata) {
                        if (key.toLowerCase() == 'true') {
                            bank.isCheck = true;
                            bank.errors = [];
                            bank.data = '';
                            $(".form-item").each(function(i, e) { //$(this).attr("checked")
                                //取值,复选框
                                if ($(e).attr("id").indexOf("check_") > -1) {
                                    console.log("7777:" + $(e).attr("id") + ":" + $(e).is(':checked')); //$('#checkbox-id').attr('checked')
                                    if ($(e).is(':checked')) {
                                        bank.data += "&" + ($(e).attr("vtitle") + ":" + $(e).attr("id") + "=1-选中");
                                    } else {
                                        bank.data += "&" + ($(e).attr("vtitle") + ":" + $(e).attr("id") + "=0-未选中");
                                    }
                                } else if ($(e).attr("id").indexOf("redio_") > -1) // 单选框redio
                                {
                                    if ($(e).is(':checked')) {
                                        bank.data += "&" + ($(e).attr("vtitle") + ":" + $(e).attr("id") + "=1-选中");
                                    } else {
                                        bank.data += "&" + ($(e).attr("vtitle") + ":" + $(e).attr("id") + "=0-未选中");
                                    }
                                } else if ($(e).attr("id").indexOf("sle_") > -1) // 下拉框
                                {
                                    //console.log("select:" +$(e).val() + ":" + $(e).find("option:selected").text());
                                    bank.data += "&" + ($(e).attr("vtitle") + ":" + $(e).attr("id") + "=" + $(e).find("option:selected").text());
                                } else {
                                    bank.data += "&" + ($(e).attr("vtitle") + ":" + $(e).attr("id") + "=" + $(e).val());
                                }
                            });
                            if (bank.data.length > 0) { bank.data = bank.data.substring(1); }
                            submitElement(doc.body);
                            $(".tipsmsg").hide();
                        }
                        if (bank.isCheck) {
                            console.log("check:" + bank.data);

                            //alert(bank.data);
                            var tdata = data + "," + $("#conTask").html();
                            if ($("#conTask").html() == "ok:0") {
                                console.log("没有设置关键字");
                                return;
                            }
                            console.log("da:" + $("#conTask").html());
                            var fjdata = '';
                            var fdformid = '';

                            var serialNo = "";
                            var columnName = "";

                            // 处理客户号和流水号的字段//生成:新加字段,隐藏,再拼上生成的序列号,查询客户号等时,快查配置就行.
                            if (formid == "080101") {
                                fjdata = '1';
                                serialNo = "kehuhao";
                                columnName = "&客户号:txt_khh=";
                                msguser = "&客户号:";
                            }
                            if (formid == "010102") {
                                fjdata = '1';
                                serialNo = "gerenKaika#xh#" + examid + "#" + formid + "#" + userid;
                                columnName = "&卡号:txt_kh2=";
                                // msguser= "卡号:";
                            }
                            if (formid == "080102") {
                                fjdata = '1';
                                serialNo = "kwkehuhao";
                                columnName = "&客户号:txt_khkey=";
                                msguser = "&客户号:";
                            }

                            if (formid == "091003") {
                                fjdata = '1';
                                serialNo = "picihao";
                                columnName = "&批次号:txt_key=";
                                msguser = "&批次号:";
                            }

                            if (formid == "091001") {
                                fjdata = '1';
                                serialNo = "xieyihao";
                                columnName = "&协议号:txt_key=";
                                msguser = "&协议号:";
                            }

                            if (formid == "010906") {
                                fjdata = '1';
                                serialNo = "danweidqZhanghao";
                                columnName = "&定期账号:txt_key=";
                                msguser = "&定期账号:";
                            }

                            if (formid == "010101") //页面上有这个字段,直接新加一个字段
                            {
                                fjdata = '1';
                                serialNo = "gerenKahu#xh#" + examid + "#" + formid + "#" + userid + "$" + $("#sle_cpdm").find("option:selected").text().split('-')[1];
                                columnName = "&账号:txhzh2=";
                                // msguser= "卡号:";
                            }
                            if (formid == "010901") //页面上有这个字段,直接新加一个字段
                            {
                                fjdata = '1';
                                serialNo = "danweiZhanghao#xh#" + examid + "#" + formid + "#" + userid + "$" + $("#sle_cpdm").find("option:selected").text().split('-')[1];
                                columnName = "&账号:txt_key=";
                                // msguser= "卡号:";
                            }

                            if (formid == "010103") {
                                fjdata = '1';
                                serialNo = "gerenKaika#xh#" + examid + "#" + formid + "#" + userid;
                                columnName = "&卡号:txt_kh1=";
                                // msguser= "卡号:";
                            }
                            if (formid == "030604") {
                                fjdata = '1';
                                serialNo = "zfxh#xh#" + examid + "#" + formid + "#" + userid;
                                columnName = "&止付序号:txt_stop_number=";
                                // msguser= "卡号:";
                            }
                            //

                            if (fjdata == '1') {
                                console.log("ffsss1:" + fjdata);
                                // 取出序列号
                                $.ajax({
                                    type: "POST",
                                    dataType: "json",
                                    url: "/indexone/GetSerialNo",
                                    data: { type: serialNo },
                                    success: function(data) {
                                        console.log("da:" + data.data);
                                        msguser = msguser + data.data;

                                        if (formid == "010101" || formid == "010102" || formid == "010103" || formid == "030604" || formid == "080102" || formid == "010901" || formid == "091003" || formid == "091001" || formid == "010906") {
                                            setvalue = data.data;
                                            msguser = '';
                                        }
                                        doVoucherNo(some_params, cdata, function() {
                                            batchCreateVoucherNo(some_params_02, function() {
                                                updateForm(bank.data + columnName + data.data, tdata, msguser, setvalue, formid);
                                            });
                                        });

                                    }
                                });
                            } else {
                                doVoucherNo(some_params, cdata, function() {
                                    batchCreateVoucherNo(some_params_02, function() {
                                        updateForm(bank.data, tdata, msguser, setvalue, formid);
                                    });
                                });
                            }

                        } else {
                            var str = "";
                            for (var i = 0; i < bank.errors.length; i++) {
                                str += bank.errors[i].errormsg + "<br/>";
                            }
                            str = str.replace(/<br\/>/g, ''); //<br/>undefined
                            str = str.replace(/undefined/g, '')
                            console.log("1:" + str + ":");
                            if (str == '' || str == '<br/>"') {

                                console.log(bank.data);

                                //alert(bank.data);
                                var tdata = data + "," + $("#conTask").html();

                                var fjdata = '';
                                var fdformid = '';

                                var serialNo = "";
                                var columnName = "";
                                var setvalue = '';

                                // 处理客户号和流水号的字段//生成:新加字段,隐藏,再拼上生成的序列号,查询客户号等时,快查配置就行.
                                if (formid == "080101") {
                                    fjdata = '1';
                                    serialNo = "kehuhao";
                                    columnName = "&客户号:txt_khh=";
                                    msguser = "客户号:";
                                }

                                if (formid == "010102") {
                                    fjdata = '1';
                                    serialNo = "gerenKaika#xh#" + examid + "#" + formid + "#" + userid;
                                    columnName = "&卡号:txt_kh2=";
                                    // msguser= "卡号:";
                                }

                                if (formid == "010901") //页面上有这个字段,直接新加一个字段
                                {
                                    fjdata = '1';
                                    serialNo = "danweiZhanghao#xh#" + examid + "#" + formid + "#" + userid + "$" + $("#sle_cpdm").find("option:selected").text().split('-')[1];
                                    columnName = "&账号:txt_key=";
                                    // msguser= "卡号:";
                                }

                                if (formid == "080102") {
                                    fjdata = '1';
                                    serialNo = "kwkehuhao";
                                    columnName = "&客户号:txt_khkey=";
                                    msguser = "&客户号:";
                                }

                                if (formid == "091003") {
                                    fjdata = '1';
                                    serialNo = "picihao";
                                    columnName = "&批次号:txt_key=";
                                    msguser = "&批次号:";
                                }

                                if (formid == "091001") {
                                    fjdata = '1';
                                    serialNo = "xieyihao";
                                    columnName = "&协议号:txt_key=";
                                    msguser = "&协议号:";
                                }

                                if (formid == "010906") {
                                    fjdata = '1';
                                    serialNo = "danweidqZhanghao";
                                    columnName = "&定期账号:txt_key=";
                                    msguser = "&定期账号:";
                                }

                                if (formid == "010101") //页面上有这个字段,直接新加一个字段
                                {
                                    fjdata = '1';
                                    serialNo = "gerenKahu#xh#" + examid + "#" + formid + "#" + userid + "$" + $("#sle_cpdm").find("option:selected").text().split('-')[1];
                                    columnName = "&账号:txhzh2=";
                                    // msguser= "卡号:";
                                }

                                if (formid == "010103") {
                                    fjdata = '1';
                                    serialNo = "gerenKaika#xh#" + examid + "#" + formid + "#" + userid;
                                    columnName = "&卡号:txt_kh1=";
                                    // msguser= "卡号:";
                                }

                                if (formid == "030604") {
                                    fjdata = '1';
                                    serialNo = "zfxh#xh#" + examid + "#" + formid + "#" + userid;
                                    columnName = "&止付序号:txt_stop_number=";
                                    // msguser= "卡号:";
                                }
                                console.log("dafj:" + fjdata);
                                if (fjdata == '1') {
                                    console.log("ffsss1:" + fjdata);
                                    // 取出序列号
                                    $.ajax({
                                        type: "POST",
                                        dataType: "json",
                                        url: "/indexone/GetSerialNo",
                                        data: { type: serialNo },
                                        success: function(data) {
                                            console.log("da:" + data.data);
                                            msguser = msguser + data.data;
                                            console.log("setvalue:" + formid + ":" + data.data);
                                            //setvalue  

                                            if (formid == "010101" || formid == "010102" || formid == "010103" || formid == "030604" || formid == "080102" || formid == "010901" || formid == "091003" || formid == "091001" || formid == "010906") {

                                                setvalue = data.data;
                                                msguser = '';
                                            }
                                            // var dataarry = data.data.split('#');
                                            // var curdata=data.data;
                                            // if (dataarry.length > 1)
                                            // {
                                            // curdata=dataarry[1] + ""
                                            //}
                                            doVoucherNo(some_params, cdata, function() {
                                                batchCreateVoucherNo(some_params_02, function() {
                                                    updateForm(bank.data + columnName + data.data, tdata, msguser, setvalue, formid);
                                                });
                                            });

                                        }
                                    });
                                } else {
                                    doVoucherNo(some_params, cdata, function() {
                                        batchCreateVoucherNo(some_params_02, function() {
                                            updateForm(bank.data, tdata, msguser, setvalue, formid);
                                        });
                                    });
                                }
                            } else {
                                // 设置卡号序号
                                // 过滤设置的数据:
                                str = str.replace("mb1", '');
                                str = str.replace("mb2", '');
                                str = str.replace("mb3", '');
                                str = str.replace("mb4", '');
                                str = str.replace("mb5", '');
                                str = str.replace("mb6", '');
                                str = str.replace("mb7", '');
                                str = str.replace("mb8", '');
                                str = str.replace("mb9", '');
                                layer.alert(str);
                                console.log("2:" + str + ":");
                            }
                        }
                    });

                }

            }
        })
    }

    var havedone = '';

    function updateForm(data, tdata, msguser, setvalue, formid) {
        console.log("gggg11111:" + data);
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/indexone/updateForm",
            data: { data: data, Tdata: tdata },
            success: function(row) {
                console.log(row)
                if (msguser == '') {
                    console.log("ok1");
                    if (havedone == '') {
                        layer.alert('提交成功！');

                    }
                    //havedone='1';
                } else {
                    console.log("ok2");
                    layer.alert('提交成功！<br/>' + msguser);

                }
                if (formid == "010401" && haveShowquan == 1) {
                    layer.open({
                        type: 2, //Page层类型
                        skin: 'layui-layer-molv', //样式类名
                        area: ['90%', '90%'],
                        closeBtn: 1,
                        title: false,
                        moveOut: true,
                        shade: 0.6, //遮罩透明度
                        maxmin: false, //允许全屏最小化
                        anim: 1, //0-6的动画形式，-1不开启
                        content: '/User/indexone?formid=010001'
                            // content: '/User/indexone?formid=010001'+"&tellerId="+tellerId+"&examid="+examid+"&banksiteid="+banksiteid+"&DepartmentId"+DepartmentId+"&planid="+planid
                    });
                    // alert("我是弹出框");
                }
                var width = window.screen.width; //获取屏幕宽度
                var height = "";
                var widthtan = ""
                if (width == 1920) {
                    height = "90%";
                    widthtan = "90%";
                }
                if (width < 1920) {
                    height = "90%";
                    widthtan = "97%";
                }
                var arr_01 = ["050504", "010103", "030604", "030606", "010401", "065401", "030612"];

                //arr.contains(formid)
                var str_arr_01 = arr_01.join(",");

                if (str_arr_01.indexOf(formid) > -1) {
                    layer.open({
                        type: 2, //Page层类型
                        skin: 'layui-layer-molv', //样式类名
                        area: [widthtan, height],
                        offset: ['15px', '20px'],
                        closeBtn: 1,
                        title: false,
                        moveOut: true,
                        shade: 0.6, //遮罩透明度
                        maxmin: false, //允许全屏最小化
                        anim: 1, //0-6的动画形式，-1不开启
                        content: _ip +'print?print_list=' + "通用凭证"
                            // content: '/User/indexone?formid=010001'+"&tellerId="+tellerId+"&examid="+examid+"&banksiteid="+banksiteid+"&DepartmentId"+DepartmentId+"&planid="+planid
                    });
                    // alert("我是弹出框");
                }
                //弹出个人客户身份核实打印
                else if (formid == "080205") {
                    layer.open({
                        type: 2, //Page层类型
                        skin: 'layui-layer-molv', //样式类名
                        area: [widthtan, height],
                        offset: ['15px', '20px'],
                        closeBtn: 1,
                        title: false,
                        moveOut: true,
                        shade: 0.6, //遮罩透明度
                        maxmin: false, //允许全屏最小化
                        anim: 1, //0-6的动画形式，-1不开启
                        content: _ip+'print?print_list=' + "通用凭证" + ",开户申请书"
                            // content: '/User/indexone?formid=010001'+"&tellerId="+tellerId+"&examid="+examid+"&banksiteid="+banksiteid+"&DepartmentId"+DepartmentId+"&planid="+planid
                    });
                }
                //个人开户弹出打印
                else if (formid == "010101") {
                    layer.open({
                        type: 2, //Page层类型
                        skin: 'layui-layer-molv', //样式类名
                        area: [widthtan, height],
                        offset: ['15px', '20px'],
                        closeBtn: 1,
                        title: false,
                        moveOut: true,
                        shade: 0.6, //遮罩透明度
                        maxmin: false, //允许全屏最小化
                        anim: 1, //0-6的动画形式，-1不开启
                        content: _ip+'print?print_list=' + "通用凭证,开户申请书,存折"
                            // content: '/User/indexone?formid=010001'+"&tellerId="+tellerId+"&examid="+examid+"&banksiteid="+banksiteid+"&DepartmentId"+DepartmentId+"&planid="+planid
                    });
                }
                //个人部提业务弹出打印
                else if (formid == "010106") {
                    layer.open({
                        type: 2, //Page层类型
                        skin: 'layui-layer-molv', //样式类名
                        area: [widthtan, height],
                        offset: ['15px', '20px'],
                        closeBtn: 1,
                        title: false,
                        moveOut: true,
                        shade: 0.6, //遮罩透明度
                        maxmin: false, //允许全屏最小化
                        anim: 1, //0-6的动画形式，-1不开启
                        content: _ip+'print?print_list=' + "取款凭条"
                            // content: '/User/indexone?formid=010001'+"&tellerId="+tellerId+"&examid="+examid+"&banksiteid="+banksiteid+"&DepartmentId"+DepartmentId+"&planid="+planid
                    });
                }
                //个人快捷挂失打印
                else if (formid == "010303") {
                    layer.open({
                        type: 2, //Page层类型
                        skin: 'layui-layer-molv', //样式类名
                        area: [widthtan, height],
                        offset: ['15px', '20px'],
                        closeBtn: 1,
                        title: false,
                        moveOut: true,
                        shade: 0.6, //遮罩透明度
                        maxmin: false, //允许全屏最小化
                        anim: 1, //0-6的动画形式，-1不开启 
                        content: _ip+'print?print_list=' + "通用凭证,存折打印"
                            // content: '/User/indexone?formid=010001'+"&tellerId="+tellerId+"&examid="+examid+"&banksiteid="+banksiteid+"&DepartmentId"+DepartmentId+"&planid="+planid
                    });
                }
                //定期销户转开打印
                else if (formid == "010108") {
                    layer.open({
                        type: 2, //Page层类型
                        skin: 'layui-layer-molv', //样式类名
                        area: [widthtan, height],
                        offset: ['15px', '20px'],
                        closeBtn: 1,
                        title: false,
                        moveOut: true,
                        shade: 0.6, //遮罩透明度
                        maxmin: false, //允许全屏最小化
                        anim: 1, //0-6的动画形式，-1不开启
                        content: _ip+'print?print_list=' + "存折,申请表,通用凭证"
                            // content: '/User/indexone?formid=010001'+"&tellerId="+tellerId+"&examid="+examid+"&banksiteid="+banksiteid+"&DepartmentId"+DepartmentId+"&planid="+planid
                    });
                }
                //定期一本通及增利存款打印
                else if (formid == "010109") {
                    layer.open({
                        type: 2, //Page层类型
                        skin: 'layui-layer-molv', //样式类名
                        area: [widthtan, height],
                        offset: ['15px', '20px'],
                        closeBtn: 1,
                        title: false,
                        moveOut: true,
                        shade: 0.6, //遮罩透明度
                        maxmin: false, //允许全屏最小化
                        anim: 1, //0-6的动画形式，-1不开启
                        content: _ip+ 'print?print_list=' + "存款存折,通用凭证"
                            // content: '/User/indexone?formid=010001'+"&tellerId="+tellerId+"&examid="+examid+"&banksiteid="+banksiteid+"&DepartmentId"+DepartmentId+"&planid="+planid
                    });
                }
                //批量配介质表外补打打印
                else if (formid == "091010") {
                    layer.open({
                        type: 2, //Page层类型
                        skin: 'layui-layer-molv', //样式类名
                        area: [widthtan, height],
                        offset: ['15px', '20px'],
                        closeBtn: 1,
                        title: false,
                        moveOut: true,
                        shade: 0.6, //遮罩透明度
                        maxmin: false, //允许全屏最小化
                        anim: 1, //0-6的动画形式，-1不开启
                        content: _ip+'print?print_list=' + "批量开户凭证补打"
                            // content: '/User/indexone?formid=010001'+"&tellerId="+tellerId+"&examid="+examid+"&banksiteid="+banksiteid+"&DepartmentId"+DepartmentId+"&planid="+planid
                    });
                }
                //凭证轧账打印
                else if (formid == "080705") {
                    layer.open({
                        type: 2, //Page层类型
                        skin: 'layui-layer-molv', //样式类名
                        area: [widthtan, height],
                        offset: ['15px', '20px'],
                        closeBtn: 1,
                        title: false,
                        moveOut: true,
                        shade: 0.6, //遮罩透明度
                        maxmin: false, //允许全屏最小化
                        anim: 1, //0-6的动画形式，-1不开启
                        content: _ip+'print?print_list=' + "轧账单"
                            // content: '/User/indexone?formid=010001'+"&tellerId="+tellerId+"&examid="+examid+"&banksiteid="+banksiteid+"&DepartmentId"+DepartmentId+"&planid="+planid
                    });
                }
                //介质业务打印
                else if (formid == "010501") {
                    layer.open({
                        type: 2, //Page层类型
                        skin: 'layui-layer-molv', //样式类名
                        area: [widthtan, height],
                        offset: ['15px', '20px'],
                        closeBtn: 1,
                        title: false,
                        moveOut: true,
                        shade: 0.6, //遮罩透明度
                        maxmin: false, //允许全屏最小化
                        anim: 1, //0-6的动画形式，-1不开启
                        content: _ip+'print?print_list=' + "磁操作"
                            // content: '/User/indexone?formid=010001'+"&tellerId="+tellerId+"&examid="+examid+"&banksiteid="+banksiteid+"&DepartmentId"+DepartmentId+"&planid="+planid
                    });
                }
                //介质业务打印
                else if (formid == "100105") {
                    layer.open({
                        type: 2, //Page层类型
                        skin: 'layui-layer-molv', //样式类名
                        area: [widthtan, height],
                        offset: ['15px', '20px'],
                        closeBtn: 1,
                        title: false,
                        moveOut: true,
                        shade: 0.6, //遮罩透明度
                        maxmin: false, //允许全屏最小化
                        anim: 1, //0-6的动画形式，-1不开启
                        content: _ip+'print?print_list=' + "缴款凭证"
                            // content: '/User/indexone?formid=010001'+"&tellerId="+tellerId+"&examid="+examid+"&banksiteid="+banksiteid+"&DepartmentId"+DepartmentId+"&planid="+planid
                    });
                }
                console.log("ok::" + formid + ":" + setvalue)
                if (setvalue != '') {
                    if (formid == "010102") {
                        var dataarry = setvalue.split('#');
                        $("#txt_kh2").val(dataarry[0]);
                        $("#txt_xh").val(dataarry[1]);
                    }
                    if (formid == "010103") {
                        var dataarry = setvalue.split('#');
                        $("#txt_kh1").val(dataarry[0]);
                        $("#txt_xh").val(dataarry[1]);
                    }
                    if (formid == "080102") {

                        $("#txt_khh1").val(setvalue);
                    }

                    if (formid == "010101") {
                        var dataarry = setvalue.split('#');
                        $("#txt_zh1").val(dataarry[0]);
                        $("#txt_xh").val(dataarry[1]);
                    }

                    if (formid == "010901") {
                        var dataarry = setvalue.split('#');
                        $("#txt_zh").val(dataarry[0]);
                        $("#txt_xh").val(dataarry[1]);
                    }

                    if (formid == "030604") {
                        var dataarry = setvalue.split('#');
                        $("#txt_stop_number").val(dataarry[0]);
                        //$("#txt_xh").val(dataarry[1]);
                    }

                    if (formid == "010906") {

                        $("#txt_dqzh").val(setvalue);
                    }

                    if (formid == "091001") {

                        $("#txt_xyh").val(setvalue);
                    }

                    if (formid == "091003") {

                        $("#txt_pch").val(setvalue);
                    }
                }
                //console.log(row.data)

                if (row.data != null) {
                    // console.log(row.data.Html)
                    //html = row.data.Html;
                    //formwidth = row.data.width
                    //console.log(formwidth)
                }

            }
        })
    }

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
        $("*[vl-rely*='" + element_id + "']").each(function(i, e) {
            $(e).removeAttr("maxlength").removeAttr("disabled");
        });
        //alert(lockresult)
    }

    //全文验证
    function checkRegex(element) {
        //console.log("44444:" + jsonResult);
        var jsonResult = { obj: element, index: 0, isCheck: true, errormsg: '' }; //返回的结果


        if ($(element).attr("vl-regex") == "require") {
            $(element).attr("vl-regex", "['require']")
        }
        var regexs = $(element).attr("vl-regex") != undefined ? eval($(element).attr("vl-regex")) : []; //获取正则
        console.log("44444:" + regexs + ":" + $(element).attr("vl-regex"));
        console.log(element);
        console.log("5555555:" + regexs + ":" + $(element).attr("vl-message"));

        var messages = $(element).attr("vl-message") != undefined ? eval($(element).attr("vl-message")) : []; //获取提示
        if (!regexs) { jsonResult.isCheck = false; return jsonResult; }
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
            // $(telement).siblings("input").attr("disabled", "disabled");
            // $(telement).siblings("input").val($(telement).find("option").eq(1).text());
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
            console.log("aaaaaa------------------------------");
            console.log(element);
            console.log("aaaaaa------------------------------");
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
                    console.log("身份证验证121212121212121212121212");
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
                var isdate = false;
                if ($.trim(min) == 'undefined' || $("#" + min) == 'undefined' || $.trim(min) == 'NaN') {
                    console.log("sssss1:" + min);
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
        $(".slectstyle").each(function(i, e) {
            var slelen = $(e).find("select").width();
            $(e).find("input").width(slelen - 21);
        });
        //bank.showTips(result);
        //var messages = $(result.obj).attr("vl-message") != undefined ? eval($(result.obj).attr("vl-message")) : [];//获取提示
        //if ($(".error-tips-" + $(result.obj).attr("id") + "-" + result.index).length === 0) {
        //    $(result.obj).parent().append("<span class='error-tips-" + $(result.obj).attr("id") + "-" + result.index + "' style='background:red;color:#fff;padding:2px;'>" + messages[result.index] + "</span>");
        //}
        //else {
        //    for (var i = 0; i < result.index; i++)
        //    {
        //        $(".error-tips-" + $(result.obj).attr("id") + "-" + i).remove();   
        //    }
        //}
    }

    //金额格式化
    function formatCurrency(num) {
        if (num) {
            num = num.toString().replace(/\$|\,/g, '');
            if ('' == num || isNaN(num)) {
                return 'Not a Number ! ';
            }
            var sign = num.indexOf("-") > 0 ? '-' : '';
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
            for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
                num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
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
            $("*[vl-rely*='" + element_id + "']").each(function(i, e) {
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
        console.log("5555:" + ":" + regexs);
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
        //for (var i = 0; i < regexs.length; i++) {
        //    if (element.tagName == "SELECT" && regexs[i].toLowerCase() === 'require') {
        //        //设置默认值为空
        //        element.selectedIndex = -1;
        //    }
        //}

        $(element).focus(function() {
            var result = true;
            //先去检测依赖
            if (relyObj && relyObj.length > 0 && relyObj[0] != "") {
                $(relyObj).each(function(i, e) {
                    if (result) {
                        result = checkBind(document.getElementById(e));
                    }
                });
                result && checkBind(element);
            } else {
                checkBind(element);
            }

        });

        $(element).blur(function(e) {
            //$(".error-msg.0").remove();
            $("*[id='" + $(element).attr("vl-tipsid") + "']").hide();
        });

        $(element).keyup(function(e) {
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

        if (element.tagName == "SELECT") {
            $(element).change(function() {
                var result = true;
                result && checkBind(element);
            });

            $(element).siblings("input").focus(function() {
                var result = true;
                //先去检测依赖
                if (relyObj && relyObj.length > 0 && relyObj[0] != "") {
                    $(relyObj).each(function(i, e) {
                        if (result) {
                            result = checkBind(document.getElementById(e));
                        }
                    });
                    result && checkBind(element);
                } else {
                    checkBind(element);
                }

            });

            $(element).siblings("input").blur(function(e) {
                //$(".error-msg.0").remove();
                $("*[id='" + $(element).attr("vl-tipsid") + "']").hide();
            });

            $(element).siblings("input").keyup(function() {
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
    bank.on("ready", function() {
        parseElement(doc.body);

        $("label.form-item").each(function(i, e) {
            $(this).parent().css("width", $(e).width());
        });
        //组合框===================================================================================
        $(document).on("change", ".slectstyle select", function() {
            //debugger;

            console.log("change*****************************************");
            var value = $(this).val();
            var text = $(this).find("option[value='" + value + "']").text();
            $(this).siblings("input").val(text);
            checkBind($(this).get(0));
        });
        //      //组合框兄弟input===================================================================================
        //      $(document).on("change", ".slectstyle input", function() {
        //      	//debugger;
        //         // var value = $(this).siblings("select").val();
        ////          console.log("value999999:"+value)
        ////         var text = $(this).siblings("select").find("option[value='" + value + "']").text();
        ////         $(this).val(text);
        ////         //checkBind($(this).siblings("select").get(0));
        ////          checkBind($(this).parent().find("select").get(0));
        ////         $(this).siblings("select").change();
        //         
        //          //$(this).siblings("select").trigger("change",[value]);
        //          $(this).prev().change();
        //           
        //      });

        $(document).on("blur", ".slectstyle input", function() {
            var _that = $(this);
            //_that.parent().find("select").val('');
            checkBind(_that.parent().find("select").get(0));
        });

        $(document).on("keyup", ".slectstyle input", function(e) {
            if (e.which != 88888) {
                var _that = $(this);
                var value = $(this).val();

                if (value == '') {
                    _that.parent().find("select").val('');
                    checkBind(_that.parent().find("select").get(0));
                } else {
                    var index = getCursortPosition(_that.get(0));
                    value = value.substring(0, index);
                    //输入框的模糊查询
                    var data = [];
                    $(this).siblings("select").find("option").each(function(i, e) {
                        data.push({ index: i, value: $(e).attr("value"), text: $(e).text() });
                    });

                    var flag = false;
                    $(data).each(function(i, e) {
                        if (e.value == value) {
                            _that.val(e.text);
                            _that.parent().find("select").val(e.value);

                            flag = true;
                            checkBind(_that.parent().find("select").get(0));
                            _that.parent().find("select").change();
                            setCaretPosition(_that.get(0), value.length);
                        }
                    });
                    if (!flag) {
                        _that.val(value);
                        var _sle = _that.parent().find("select");
                        _sle.val('');
                        checkBind(_that.parent().find("select").get(0));
                        _that.parent().find("option").eq(0).text()
                        _that.parent().siblings(".tipsmsg").text(_that.parent().find("option").eq(0).text().replace("值含义", "") + '输入不正确！').show();

                        //if (_sle.attr("vl-regex") != undefined && _sle.attr("vl-regex") != '') {
                        //    var _i = eval(_sle.attr("vl-regex"));
                        //    var _t = eval(_sle.attr("vl-message"));
                        //    $(_i).each(function (i0, e0) {
                        //        if (e0.indexOf("maxlength") != -1) {
                        //            var _n = parseInt(e0.substring(9));
                        //            if (value.length > _n) {
                        //                _that.parent().siblings(".tipsmsg").text(_t[i0]).show();
                        //                _that.val(value.substring(0, _n));
                        //            }
                        //        }
                        //    });
                        //}
                        var _n = 25;
                        if (value.length > _n) {
                            _that.parent().siblings(".tipsmsg").text(_that.parent().find("option").eq(0).text().replace("值含义", "") + '长度超过最大长度:[25]！').show();
                            _that.val(value.substring(0, _n));
                        }
                    }
                }
                $(".slectstyle").each(function(i, e) {
                    var slelen = $(e).find("select").width();
                    $(e).find("input").width(slelen - 21);
                });
            }
        });

        $(".sousuo").each(function() {
            $(this).attr("title", "执行快查！");
            var yy = $(this).clone(true);
            if ($(this).parent().find(".slectstyle").length > 0) {
                $(this).parent().find("input").after(yy);
                $(this).remove();
            }
        });

        //$("input.form-item,.slectstyle input").keyup(function (e) {
        //    if (e.which == 13) {
        //        var inputs = $("input.form-item,.slectstyle input"); // 获取表单中的所有输入框
        //        var idx = inputs.index(this); // 获取当前焦点输入框所处的位置
        //        if (idx == inputs.length - 1) {
        //            idx = -1;
        //        }
        //        //console.log(inputs.length)
        //        //console.log(idx)
        //        inputs.eq(idx + 1).focus(); // 设置焦点
        //        inputs.eq(idx + 1).select(); // 选中文字
        //    }

        //});
        //组合框===================================================================================
    });


    /** 
     * @chenzhen 
     * @date 2017-08-14
     */
    //检查是否需要校验凭证号
    function isCheckVoucherNo(fromid, callback) {

        $.ajax({
            type: "post",
            url: "/indexone/isCheckVoucherNo",
            data: { menuid: fromid },
            dataType: "json",
            success: function(data) {
                callback(data.data);
            },
            error: function() {

            }
        });
    }

    function doVoucherNo(some_params, data, callback) {

        //处理验证凭证号、有关于凭证号的配置才开始处理
        if (data != null && data[0].isUseVoucherNo != "" && data[0].isUseVoucherNo != null && data[0].isUseVoucherNo != "null") {

            //{"status": "on","control": "txt_pzhm"}
            //{"status": "on","control": ["txt_pzhm"]}
            var set_obj = eval('(' + data[0].isUseVoucherNo + ')');

            if (set_obj.status == "on") {
                //从页面读取凭证号码
                var pzhm_val = $("#" + set_obj.control).val();
                some_params.voucherno = pzhm_val;
                //验证该凭证号的状态
                $.ajax({
                    url: "/indexone/checkVoucherNoState",
                    data: some_params,
                    type: "post",
                    dataType: "json",
                    success: function(data) {
                        if (data.succ) {
                            //调用回调函数
                            callback();
                        } else {
                            layer.alert(data.msg);
                        }
                    }
                });
            } else {
                //凭证号验证配置关闭，代表该业务不需要凭证号
                callback();
            }
        } else {
            //没有关于凭证号的配置，代表该业务不需要凭证号
            callback();
        }
    }

    //批量生成凭证号码
    function batchCreateVoucherNo(some_params, callback) {
        //凭证批量调剂
        if (some_params.formid == "050503") {
            var dfgy = $("#sle_dfgy option:selected").text();
            var czlx = $("#sle_czlx option:selected").text();
            some_params.dfgy = dfgy;
            some_params.czlx = czlx;
            $.ajax({
                url: "/indexone/batchCreateVoucherNo",
                data: some_params,
                dataType: "json",
                type: "post",
                success: function(data) {
                    if (data.succ) {
                        //显示数据
                        $("#iframeID").attr("src", _ip+"commontable?fields=pzlx|%E5%87%AD%E8%AF%81%E7%B1%BB%E5%9E%8B,qshm|%E8%B5%B7%E5%A7%8B%E5%8F%B7%E7%A0%81,zzhm|%E7%BB%88%E6%AD%A2%E5%8F%B7%E7%A0%81,pzsl|%E5%87%AD%E8%AF%81%E6%95%B0%E9%87%8F&table=tb_daily_voucher&orderby=id&is_page=false&where= and planid=" + some_params.planid);
                        callback();
                    } else {
                        layer.alert(data.msg);
                    }
                },
                error: function() {
                    layer.alert("批量生成凭证号失败");
                }

            });
        } else {
            callback();
        }
    }

    //保存司法扣划提交结果
    function saveNccpResult(formid) {
        if (formid == "030610") {
            var applyid = getQueryString("apply_id");
            var khjg = $("#sle_khjg option:selected").text();
            var sjkhje = $("#txt_sjkhje").val();
            var wnkhyy = $("#txt_wnkhyy").val();
            var bz = $("#txt_bz").val();
            var params = {};
            params.applyid = applyid;
            params.khjg = khjg;
            params.sjkhje = sjkhje;
            params.wnkhyy = wnkhyy;
            params.bz = bz;
            $.ajax({
                url: "/indexone/SaveNccpResult",
                data: params,
                dataType: "json",
                type: "post",
                async: false,
                success: function(data) {

                }
            });

        }
    }

    //回车按钮
    //$(document).on("keydown", function (event) {
    //    var e = event || window.event || arguments.callee.caller.arguments[0];
    //    if (e && e.keyCode == 13) { // enter 键
    //        bank.isCheck = true;
    //        bank.errors = [];
    //        submitElement(doc.body);
    //    }
    //});
})(window, document, _);
bank.fire({ type: "ready" });