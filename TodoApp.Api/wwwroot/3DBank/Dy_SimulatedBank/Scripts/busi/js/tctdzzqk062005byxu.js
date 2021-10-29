$(document).ready(function () {
	var oToShadow = {"vl-disabled":true,"disabled":"disabled"};
	var oToFocus = {"vl-disabled":false,"disabled":false};
	$("#money_jyje").change(function(){
		$("#txt_jedx")[0].value = convertCurrency(this.value);
		//金额超过十万弹框提示
		if(matchMoney(this) >100000){
			alert("金额超过10万元，您录入的金额为："+this.value+"，请确认。");
		}
	    if (matchMoney(this) < 100000) {
	        $("#txt_jedx").css();
	    }
	    if (matchMoney(this) >= 100000 && matchMoney(this) < 1000000) {
	        $("#txt_jedx").css({"color":"white","background":"blue"});
	    }
	    if (matchMoney(this) >= 1000000 && matchMoney(this) < 5000000) {
	        $("#txt_jedx").css({"color":"white","background":"purple"});
	    }
	    if (matchMoney(this) >= 5000000) {
	        $("#txt_jedx").css({"color":"white","background":"red"});
	    }
	});

	$("#sle_zhlx2").change(function(){
		if(this.value == "6"){
			$("#redio_sfyzk").prop("checked",false);
			$("#redio_sfyw").prop("checked",true);
		}else{
			$("#redio_sfyzk").prop("checked",true);
			$("#redio_sfyw").prop("checked",false);
		}
	})
	//为空
	function toRequ(node){
		return node.attr({"vl-regex":"['require']","vl-message":"['有无卡折不能为空!']","default":""});
	}
	//显示与消失;显示true 消失false
	function showOrDea(node,boolean){
		if(boolean){
			node.attr("style","display:block");
		}else{
			node.attr("style","display:none");
		}
	}
	//获取金额
	function matchMoney(node){
		var cMoney = parseFloat(node.value.replace(/,/ig,''));
		return cMoney;
	}
	// $("#money_dbxe").nextAll("img").click(function(){
	// 	alert(222222222)
	// })
})
function convertCurrency(money){
		console.log("lalalalalaaalallala:"+money);
		var values= "-";
		var is_fushu=false;
		if(money.indexOf(values)>-1)
		{
         is_fushu=true;			
        }
		var money_array=money.split(",");
		money=money_array.join(""); 
		money=Math.abs(money); 
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
		if(money == '') { return ''; }
		
		money = parseFloat(money);
		if(money >= maxNum) {
			//超出最大处理数字
			return '';
		}
		if(money == 0) {
			chineseStr = cnNums[0] + cnIntLast + cnInteger;
			return chineseStr;
		}
		//转换为字符串 
		money = money.toString();
		if(money.indexOf('.') == -1) {
			integerNum = money;
			decimalNum = '';
		} else {
			parts = money.split('.');
			integerNum = parts[0];
			decimalNum = parts[1].substr(0, 4);
		}
		//获取整型部分转换 
		if(parseInt(integerNum,10) > 0) {
			var zeroCount = 0;
			var IntLen = integerNum.length;
			for(var i = 0; i < IntLen; i++) {
				var n = integerNum.substr(i, 1);
				var p = IntLen - i - 1;
				var q = p / 4;
				var m = p % 4;
				if(n == '0') {
					zeroCount++;
					console.log("zeroCountheiheihehieheiheieheiheiheieh:"+zeroCount);
				} else {
					if(zeroCount > 0) {
						chineseStr += cnNums[0];
					}
					//归零
					zeroCount = 0;
					chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
				}
				if(m == 0 && zeroCount < 4) {
					chineseStr += cnIntUnits[q];
				}
			}
			chineseStr += cnIntLast;
		}
		//小数部分
		if(decimalNum != '') {
			var decLen = decimalNum.length;
			for(var i = 0; i < decLen; i++) {
				var n = decimalNum.substr(i, 1);
				if(n != '0') {
					chineseStr += cnNums[Number(n)] + cnDecUnits[i];
				}
			}
		}
		if(chineseStr == '') {
			chineseStr += cnNums[0] + cnIntLast + cnInteger;
		} else if(decimalNum == '') {
			chineseStr += cnInteger;
		}
		
		if(is_fushu){
			chineseStr=chineseStr;
		}
		return chineseStr;
	}
