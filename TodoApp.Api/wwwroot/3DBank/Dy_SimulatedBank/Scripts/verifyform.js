
$(function () {
    //去除文本框保留上次记录问题
    $("input").each(function () {
        $(this).attr("autocomplete", "off");
    })

})

//禁止 input  textarea 复制粘贴
function ajaxControl() {
    //$("textarea").each(function () {
    //    $(this).attr("onpaste", "return false");
    //})
    //$("input").each(function () {
    //    $(this).attr("onpaste", "return false");
    //})
}
//时间转换去除T
function SpsTringTime(v) {
    if (!IsNullOrEmpty(v)) {
        v = v.replace('T', ' ');
        var vz = v.split(':')
        if (vz.length > 2) {
            return vz[0] + ":" + vz[1] + ":" + vz[2].split('.')[0];
        }
    }
    return "";
}
//非空验证
function RequiredField(str) {
    if (str.trim() == "") {
        return false;
    }
    return true;
}

//获取对应页面的参数值
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
} 
//判断是否为整数
function isInteger(obj) {
    var r = /^\+?[1-9][0-9]*$/;　　//正整数
    return r.test(obj);
}

//字符串转时间
function stringToDate(str) {
    var arr = str.split(/\s|-|:/);
    var year = parseInt(arr[0]);
    var month = parseInt(arr[1].charAt(0)) * 10 + parseInt(arr[1].charAt(1));
    var date = parseInt(arr[2].charAt(0)) * 10 + parseInt(arr[2].charAt(1));

    var hour = parseInt(arr[3].charAt(0)) * 10 + parseInt(arr[3].charAt(1));
    var minute = parseInt(arr[4].charAt(0)) * 10 + parseInt(arr[4].charAt(1));
    var second = parseInt(arr[5].charAt(0)) * 10 + parseInt(arr[5].charAt(1));

    return new Date(year, month - 1, date, hour, minute, second);
}
//判断字符串是否为空
//<param name="str">字符串</param>
function IsNullOrEmpty(str) {
    if (str == null || str == undefined || typeof str == undefined || str == "null" || str == "undefined" || str == "") {
        return true;
    }
    else {
        return false;
    }
}
function IsPhone(str) {
    if (!(/(^1[3|5|8]\d{9}$)|(^0\d{2,3}-?\d{7,8}$)/.test(str))) {
        return true;
    } else {
        return false;
    }
}
//数字判断函数
function isNumber(s) {
    if (!IsNullOrEmpty(s)) {
        var digits = "0123456789";
        var i = 0;
        var sLength = s.length;

        while (i < s.length) {
            var c = s.charAt(i);
            if (digits.indexOf(c) == -1) {
                return "IsMustBeNumber";
            }
            i++;
        }
        return true;
    }
    return false;
}

//验证E-MAIL格式函数
function IsEmail(s) {
    if (!IsNullOrEmpty(s)) {
        if (s.length > 100) {
            return "Email1";
        }
        var regu = "^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z]+))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2}|net|NET|com|COM|gov|GOV|mil|MIL|org|ORG|edu|EDU|int|INT)$"
        var re = new RegExp(regu);
        if (s.search(re) != -1) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}

//检查电话号码
function CheckReg(str) {
    if (str != "") {
        var phone = str;
        var p1 = /^\+?(\(\d+\))*(\d*-?\d+)+$/;
        var me = false;
        if (p1.test(phone)) me = true;
        if (!me) {
            str = '';
            return "ValidTelephone";
        }
    }
    return true;
}

//检查手机号码
function CheckMobilePhone(moblie) {
    if (moblie != "") {
        var c = /(^1[3|4|5|7|8][0-9]{9}$)/;
        var me = false;
        if (c.test(moblie)) me = true;
        if (!me) {
            return "ValidMobile";
        }
    }

    return true;
}

//身份证号码验证
//function IsIdCardNo(num) {
//    if (isNaN(num)) {
//        return "IDCard1";
//    }

//    var regIdCard = new RegExp(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/);

//    if (regIdCard.test(idCard)) {
//        if (idCard.length == 18) {
//            var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
//            var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
//            var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
//            for (var i = 0; i < 17; i++) {
//                idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
//            }
//        }
//    }


//    if (!(regIdCard.test(num))) {
//        return "IDCard2";
//    }
//    return true;
//}

function IsIdCardNo(idCard) {
    //15位和18位身份证号码的正则表达式
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

    //如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (regIdCard.test(idCard)) {
        if (idCard.length == 18) {
            var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
            var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
            var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
            for (var i = 0; i < 17; i++) {
                idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
            }

            var idCardMod = idCardWiSum % 11;//计算出校验码所在数组的位置
            var idCardLast = idCard.substring(17);//得到最后一位身份证号码

            //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
            if (idCardMod == 2) {
                if (idCardLast == "X" || idCardLast == "x") {
                    return true;
                } else {
                    return false;
                }
            } else {
                //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                if (idCardLast == idCardY[idCardMod]) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    } else {
        return false;
    }
}

//检查邮政编码
function IsPostCode(postCode) {
    var valid = /^\d{6}$/;
    if (!(valid.test(postCode))) {
        return "ValidPostCode";
    }
    else return true;
}

//验证长度
function ValidLength(s, x, y) {
    if (s.length < x || s.length > y) {
        return "PasswordLength";
    }
    return true;
}
////验证金额 两位小数
function isDigit(s) {
    var patrn = /^(?:\d+|\d+\.\d{0,2})$/;
    if (!patrn.exec(s)) {
        return false
    } else {
        return true
    }
}

////验证金额 四位小数
function isDigit4(s) {
    var patrn = /^(?:\d+|\d+\.\d{0,4})$/;
    if (!patrn.exec(s)) {
        return false
    } else {
        return true
    }
}

////验证负数 四位小数
function isDigit_F_4(s) {
    var patrn = /^[+-]?\d*\.\d{0,4}$/;
    if (!patrn.exec(s)) {
        return false
    } else {
        return true
    }
}

//数字转金额
function changePrice2money(s) {
    if (/[^0-9\.]/.test(s)) return "invalid value";
    s = s.replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    s = s.replace(".", ",");
    var re = /(\d)(\d{3},)/;
    while (re.test(s))
        s = s.replace(re, "$1,$2");
    s = s.replace(/,(\d\d)$/, ".$1");
    return "¥" + s.replace(/^\./, "0.")
}
//function isDigit(obj) 
//{
//    var regu = "^[0-9]+[\.][0-9]{0,3}$";
//var re=new RegRxp(regu);
//if(re.test(obj))
//{
//    return true;
//}
//else{
//    return false;
//}
//}
//验证金额
//function isDigit(obj)
//{

//     obj = /^\d+(?=\.{0,1}\d+$|$)/;

//    //var re = /^\d+(?=\.{0,1}\d+$|$)/ ;



//    ////必须保证第一个为数字而不是.		
//    obj.value = obj.value.replace(/^\./g, "");
//    ////保证只有出现一个.而没有多个.		
//    obj.value = obj.value.replace(/\.{2,}/g, ".");
//    ////保证.只出现一次，而不能出现两次以上		
//    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
//}

//一个正则表达式，只含有汉字、数字、字母、下划线不能以下划线开头和结尾：
var reg = "^(?!_)(?!.*?_$)[a-zA-Z0-9_\一-\龥]+$";

//验证中文,"-","."，数字，空格 组成
function CheckChineseCharTS(str) {
    var c = new RegExp();
    c = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\一-\龥]+$/;
    if (c.test(str) && str != "")
        return true;
    else
        return false;
}
//验证中文,"-","."，数字，空格 组成
function CheckChineseChar(str) {
    var c = new RegExp();
    c = /^(?!_)(?!.*?-$)[\w- .\一-\龥]+$/;
    if (c.test(str) && str != "")
        return true;
    else
        return false;
}

//验证英文,"-"，数字，空格 组成
function CheckEnglishChar(str) {
    var c = new RegExp();
    c = /^(?!_)(?!.*?-$)[\w- ].+$/;
    if (c.test(str) && str != "")
        return true;
    else
        return false;
}

//验英文字母:   
function CheckEngCharacter(str) {
    if (RequiredField(str)) {
        var c = new RegExp();
        c = /^[a-zA-Z]+$/;
        if (c.test(str))
            return true;
        else
            return false;
    }
}

//验证数字范围
function CheckNumRang(str, begin, end) {
    var key = isNumber(str);
    if (key == true) {
        if (str >= begin && str <= end) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return key;
    }
}
//验证时间格式的输入
function CheckTimeFormat(str) {
    if (RequiredField(str)) {
        var c = new RegExp();
        c = /^(([0*\d]|1\d|2[0-3]).[0-5][0-9])?$/;
        if (c.test(str))
            return true;
        else
            return false;
    }
}

//验证时间早晚 开始时间 必须早于结束时间
function CheckTimeIsRight(time1, time2) {
    var str1 = time1.replace(/-/g, "/");
    var str2 = time2.replace(/-/g, "/");

    var hour1 = time1.substring(0, str1.indexOf(":"));
    var hour2 = time2.substring(0, str2.indexOf(":"));

    if (hour1 >= 1 && hour1 <= 24 && hour2 >= 1 && hour2 <= 24) {
        if (hour1 != 24) {
            if (eval(hour1) > eval(hour2)) {
                return "BeginBeforeEnd";
            }
        }
    }
    else {
        return "TimeInputWrong";
    }
    return true;
}
/***********************************************************************
* 判断一个字符串是否为合法的时间格式：HH:MM
*/
function IsTimePart(timeStr) {
    var parts;

    parts = timeStr.split('/');
    if (parts.length > 3 || parts.length < 2) {

        return false;
    }

    for (i = 0; i < parts.length; i++) {
        //如果构成时间的某个部分不是数字，则返回false
        if (isNaN(parts[i])) {
            return false;
        }
    }
    //h = parts[0]; //时
    //m = parts[1]; //分

    //if (h < 0 || h > 23) {
    //    //限制小时的范围
    //    return false;
    //}
    //if (m.length != 2) {
    //    return false;
    //}
    //if (m < 0 || m > 59) {
    //    //限制分钟的范围
    //    return false;
    //}

    return true;
}

function Changedateformat(date) {
    var date = new Date(date);
    date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return date;
}

function checkPrice(text) {
    if (!(/^(?:\d+|\d+\.\d{0,2})$/.test(text))) {
        return false;
    }
    return true;
}

function checkpic(picture) {
    if (picture != null) {
        str = picture;
        strs = str.toLowerCase();
        lens = strs.length;
        extname = strs.substring(lens - 4, lens);
        if (extname != ".jpg" && extname != ".gif") {
            alert("请选择jpg或gif文件!");
            return false;
        }
        if (picture.width > 200 || picture.height > 200) {
            alert("您上传的图片尺寸太大，这样会影响美观！请裁剪后再上传！")
            return false;
        }
    }
    return true;
}

function isQQ(qq) {
    var filter = /^\s*[.0-9]{5,10}\s*$/;
    if (!filter.test(qq)) {
        return false;
    }
    else {
        return true;
    }
}


//字母和数字
function isNumandletter(num) {
    var filter = /^[A-Za-z0-9]+$/;

    if (!filter.test(num)) {
        return false;
    }
    else {
        return true;
    }
}

//字母和数字
function isinterneturl(url) {
    var filter = /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
    if (!filter.test(url)) {
        return false;
    }
    else {
        return true;
    }
}



//只准输入数字
function CheckNumberPress(event) {
    var isIE = false;
    if ((navigator.userAgent.indexOf("MSIE") > 0) && (parseInt(navigator.appVersion) >= 4)) isIE = true;

    if (typeof event == "undefined") {
        event = window.event;
    }

    var keycode;
    if (isIE) {
        keycode = event.keyCode;
    }
    else {
        keycode = event.which;
    }

    if (keycode < 48 || keycode > 57) {

        if (isIE) {
            event.keyCode = 0;
        }
        else {
            event.preventDefault();
        }
        event.returnValue = false;
        return false;
    }
}



//是否为金额
//isPositive : 1 金额必须大于0 , 0 金额可等于0
function isMoney(money, isPositive) {
    var bool = false;
    if (isPositive != "0")
        bool = (!isNaN(money) && parseFloat(money) > 0)
    else
        bool = (!isNaN(money) && parseFloat(money) >= 0)
    if (bool) {
        if (money.toString().split(".").length > 1) {
            if (money.toString().split(".")[1].length > 2)
                return false;
            else
                return true

        } else
            return true;

    } else
        return false;
}



/*************程序猿  2017-04-01 ************/
//htmlb标签 转义
function HTMLEncode(html) {
    var temp = document.createElement("div");
    (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
    var output = temp.innerHTML;
    temp = null;
    return output;
}


//html标签 反转义
function HTMLDecode(text) {
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
}



//去除所有html标签
function delHtmlTag(str) {
    return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
}

//通用 金额验证 用于文本框案件按下去事件参数为Id 
function TYcheckeNum(Id) {
    var dqnum = $("#" + Id).val();
    if (isNaN(dqnum)) {
        $("#" + Id).val('');

    }
    var patrn = /^([1-9]\d{0,9}|0)([.]?|(\.\d{1,2})?)$/;
    if (!patrn.test(dqnum)) {
        $("#" + Id).val('');

    }
}

//通用 天数 整数 用于文本框案件按下去事件参数为Id 
function TYchekceday(Id) {
    var patrn = /^[1-9]*[1-9][0-9]*$/;
    var dqnum = $("#" + Id).val();
    if (!patrn.test(dqnum)) {
        $("#" + Id).val(dqnum.replace(/\D/g, ''));
        return;
    }
}

//字符个数校验 
function strlen(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1 
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++;
        }
        else {
            len += 2;
        }
    }
    return len;
}

//汉字算2个 数字 其它 算一个 调用如下方法
function CheckCharacter(txt, num) {

    if (txt.length > (parseFloat(num) / parseFloat(2))) {

        return false;
    }
    return true;
}


// 删除左右两端的空格 
function trim(str) { 
    if (str != undefined) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    } 
}

//html 转码 展示在页面上
function HtmlTranscoding(a) {
    a = "" + a;
    return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}

//用UniCode 字符范围判断  因为汉字的编码都大于 255
//验证是否汉字
function CheckChinese(str) {
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
            return false;
        } else {
            return true;
        }
    }
}

///////公共字典下拉框绑定/////////////
////参数1 key,参数2 下拉框id 参数三 请选择xxx
function bindselect_com(key, bindid, content) {
    $.ajax({
        url: '/Base/getselect',
        type: 'POST',
        dataType: 'json',
        data: { "action": key },
        async: false,
        success: function (data) {
            var html = '<option value="">' + content + '</option>';
            if (data != null) {
                for (var i = 0; i < data.length; i++) {
                    html += '<option value="' + data[i]["Dic_Value"] + '">' + data[i]["Dic_Name"] + '</option>';
                }
            }
            $("#" + bindid).html(html);
        }
    })
}

//获取对应页面的参数值
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}


function redload() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
    //全选checkbox
    var $checkboxAll = $(".checkbox-all"),
                       $checkbox = $(".new_table").find("[type='checkbox']").not("[disabled]"),
                       length = $checkbox.length,
                       i = 0;
    $checkboxAll.on("ifClicked", function (event) {
        if (event.target.checked) {
            $checkbox.iCheck('uncheck');
            i = 0;
        } else {
            $checkbox.iCheck('check');
            i = length;
        }
    });
}

//金额大写转换
function Arabia_to_Chinese(Num, NID) {//Num 取值，NID 控件ID
    if (Num == "" || Num == null) {
        return;
    }

    for (i = Num.length - 1; i >= 0; i--) {
        Num = Num.replace(",", "")//替换tomoney()中的“,”
        Num = Num.replace(" ", "")//替换tomoney()中的空格
    }
    Num = Num.replace("￥", "")//替换掉可能出现的￥字符
    if (isNaN(Num)) { //验证输入的字符是否为数字
        alert("请检查小写金额是否正确");
        return;
    }
    //---字符处理完毕，开始转换，转换采用前后两部分分别转换---//
    part = String(Num).split(".");
    newchar = "";
    //小数点前进行转化
    for (i = part[0].length - 1; i >= 0; i--) {
        if (part[0].length > 10) { alert("位数过大，无法计算"); return ""; } //若数量超过拾亿单位，提示
        tmpnewchar = ""
        perchar = part[0].charAt(i);
        switch (perchar) {
            case "0": tmpnewchar = "零" + tmpnewchar; break;
            case "1": tmpnewchar = "壹" + tmpnewchar; break;
            case "2": tmpnewchar = "贰" + tmpnewchar; break;
            case "3": tmpnewchar = "叁" + tmpnewchar; break;
            case "4": tmpnewchar = "肆" + tmpnewchar; break;
            case "5": tmpnewchar = "伍" + tmpnewchar; break;
            case "6": tmpnewchar = "陆" + tmpnewchar; break;
            case "7": tmpnewchar = "柒" + tmpnewchar; break;
            case "8": tmpnewchar = "捌" + tmpnewchar; break;
            case "9": tmpnewchar = "玖" + tmpnewchar; break;
        }
        switch (part[0].length - i - 1) {
            case 0: tmpnewchar = tmpnewchar + "元"; break;
            case 1: if (perchar != 0) tmpnewchar = tmpnewchar + "拾"; break;
            case 2: if (perchar != 0) tmpnewchar = tmpnewchar + "佰"; break;
            case 3: if (perchar != 0) tmpnewchar = tmpnewchar + "仟"; break;
            case 4: tmpnewchar = tmpnewchar + "万"; break;
            case 5: if (perchar != 0) tmpnewchar = tmpnewchar + "拾"; break;
            case 6: if (perchar != 0) tmpnewchar = tmpnewchar + "佰"; break;
            case 7: if (perchar != 0) tmpnewchar = tmpnewchar + "仟"; break;
            case 8: tmpnewchar = tmpnewchar + "亿"; break;
            case 9: tmpnewchar = tmpnewchar + "拾"; break;
        }
        newchar = tmpnewchar + newchar;
    }
    //小数点之后进行转化
    if (Num.indexOf(".") != -1) {
        if (part[1].length > 2) {
            alert("小数点之后只能保留两位,系统将自动截段");
            part[1] = part[1].substr(0, 2)
        }
        for (i = 0; i < part[1].length; i++) {
            tmpnewchar = ""
            perchar = part[1].charAt(i)
            switch (perchar) {
                case "0": tmpnewchar = "零" + tmpnewchar; break;
                case "1": tmpnewchar = "壹" + tmpnewchar; break;
                case "2": tmpnewchar = "贰" + tmpnewchar; break;
                case "3": tmpnewchar = "叁" + tmpnewchar; break;
                case "4": tmpnewchar = "肆" + tmpnewchar; break;
                case "5": tmpnewchar = "伍" + tmpnewchar; break;
                case "6": tmpnewchar = "陆" + tmpnewchar; break;
                case "7": tmpnewchar = "柒" + tmpnewchar; break;
                case "8": tmpnewchar = "捌" + tmpnewchar; break;
                case "9": tmpnewchar = "玖" + tmpnewchar; break;
            }
            if (i == 0) tmpnewchar = tmpnewchar + "角";
            if (i == 1) tmpnewchar = tmpnewchar + "分";
            newchar = newchar + tmpnewchar;
        }
    }
    //替换所有无用汉字
    while (newchar.search("零零") != -1)
        newchar = newchar.replace("零零", "零");
    newchar = newchar.replace("零亿", "亿");
    newchar = newchar.replace("亿万", "亿");
    newchar = newchar.replace("零万", "万");
    newchar = newchar.replace("零元", "元");
    newchar = newchar.replace("零角", "");
    newchar = newchar.replace("零分", "");

    if (newchar.charAt(newchar.length - 1) == "元" || newchar.charAt(newchar.length - 1) == "角")
        newchar = newchar + "整"
    //  document.write(newchar);
    // return newchar;
    $("#" + NID).html(newchar);
}