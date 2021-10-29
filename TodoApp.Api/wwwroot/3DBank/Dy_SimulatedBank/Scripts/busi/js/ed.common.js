/**
 * 二代系统加载时调用公共函数
 */
var render = function () {
    var yw = getQueryString("yw");
    if (yw == "" || yw == null || yw == "null") {
        yw = 1;
    }
    $(".bankmap").hide();
    $("div[data-yw=" + yw + "]").show();
}



var loadPrevData = function () {
    var yw = getQueryString("yw");
    if (yw != "1" && yw != "" && yw != null && yw != "null") {

        var data = sessionStorage.PrevData; 
        if (data != "" && data != null && data != "null") {
            var array = data.split('&');
            for (var i = 0; i < array.length; i++) {
                var id = array[i].split('|')[0];
                var val = array[i].split('|')[1];
                var control = $("#" + id);
                var tag_name = control.get(0).tagName;
                if (tag_name == "INPUT") {
                    var type=control.attr("type");
                    if(type=="radio"||type=="checkbox"){
                        if(val=="true"){
                            control.attr("checked","checked");
                        }else{
                            control.removeAttr("checked");
                        }
                    }else{
                        control.val(val);
                    }
                   
                }else if(tag_name == "SELECT"){
                    control.val(val);
                }
            }
        }
    }
}

 
//核心系统打印配置
var print_array = ["062804","080201","010501","090201","050503","060302","020704","100101","063902","110101","100102","063101","010105","062005","062004","062003","060201","060501","060703","062001","062002","050511","080204", "080205", "030601", "030604", "010104", "010402", "010906", "030609", "010401", "010101", "010905", "010108", "010109", "010107", "010102", "010910", "030608", "030612", "010902", "030602", "030606", "010110", "010301", "010302", "010303", "010114", "010702", "065501", "080803", "020501", "081201", "081003", "080704", "080705", "080706", "050504", "065401", "080703", "091105", "020502", "091001", "010601", "081001", "010907", "010103", "081005", "081010", "091006", "091008", "091009", "091010", "010901", "010903", "010904", "030603"];
/**
* 验证远程授权配置
* 主要验证业务是否配置关联远程授权业务
*/
function checkLongAuthSet(formid, taskid, callback) { 
    var remarkid = 99;//远程授权业务remarkid，固定为99
    var tm_no = "010001";//远程授权业务ID，固定为010001

    var where = " Task_Id=" + taskid + " and Tm_No='" + tm_no + "' and Remark_Id = " + remarkid + " and Key_Ids like '%" + formid + "%'";
    var page = 1;
    var pagesize = 1;

    $.ajax({
        url: "/taskitem/getList",
        data: { page: page, PageSize: pagesize, strWhere: where },
        type: "post",
        dataType: "json",
        success: function (data) {
            var tb = data.Tb;

            if (tb == null || tb == undefined || tb.length == 0) {
                callback(false);
            } else {
                callback(true);
            }

        }
    }); 
}


function convertCurrency(money) {
    //console.log("lalalalalaaalallala:" + money);
    var values = "-";
    var is_fushu = false;
    if (money.indexOf(values) > -1) {
        is_fushu = true;
    }
    var money_array = money.split(",");
    money = money_array.join("");
    money = Math.abs(money);
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
                console.log("zeroCountheiheihehieheiheieheiheiheieh:" + zeroCount);
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

    if (is_fushu) {
        chineseStr = chineseStr;
    }
    return chineseStr;
}

Date.prototype.Format = function(fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}