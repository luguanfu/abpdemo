$(document).ready(function () {
	$("#money_jyje").blur(function(){
		var sfcs=$("#money_jyje").val();
		//var tenW = parseInt($("#money_jyje").val().replace(/,/g, ''));

        var daxie = convertCurrency(sfcs); 
        $("#txt_jedx").val(daxie);
	});
})
//
function fnWordFigure(str) {
		str = str + '';
		var len = str.length - 1;
		var idxs = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿'];
		var num = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
		return str.replace(/([1-9]|0+)/g, function($, $1, idx, full) {
			var pos = 0;
			if($1[0] != '0') {
				pos = len - idx;
				if(idx == 0 && $1[0] == 1 && idxs[len - idx] == '十') {
					return idxs[len - idx];
				}
				return num[$1[0]] + idxs[len - idx];
			} else {
				var left = len - idx;
				var right = len - idx + $1.length;
				if(Math.floor(right / 4) - Math.floor(left / 4) > 0) {
					pos = left - left % 4;
				}
				if(pos) {
					return idxs[pos];
				} else if(idx + $1.length >= len) {
					return '';
				} else {
					return num[$1[0]]
				}
			}
		});
}


function convertCurrency(number) {
    var money = number + "";
 
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
                //console.log("zeroCountheiheihehieheiheieheiheiheieh:" + zeroCount);
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
