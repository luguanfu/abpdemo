$(document).ready(function () {
	//var dianji=1;
	//$("#txt_sqbl").val(100);
	//document.getElementById("qv1").style.display="none";
	//document.getElementById("dianji_con_1").innerHTML="▶";
	//var dianji_2=1;
	//document.getElementById("qv2").style.display="none";
	//document.getElementById("dianji_con_2").innerHTML="▶";
	//var dianji_3=1;
 //   document.getElementById("qv3").style.display="none";
 //   document.getElementById("dianji_con_3").innerHTML="▶";

	$("#sle_zhlx").blur(function(){
		var myselect=document.getElementById("sle_zhlx");
		var index=myselect.selectedIndex;
	    var v=myselect.options[index].value;
	    if(v==1){
	    	$("#txt_czhm").attr("v-regex","require");
	    	$("#txt_czye").attr("v-regex","require");
	    }
	    else{
	    	$("#txt_czhm").removeAttr("v-regex");
	    	document.getElementById("txt_czhm").disabled=true;
	    	$("#txt_czye").removeAttr("v-regex");
	    	document.getElementById("txt_czye").disabled=true;
	    }
	});
	$("#money_jyje").blur(function(){
		var jyje=$("#money_jyje").val();
	    jyje.replace(",","");
		jyje.replace(".","");
		$("#txt_jedx").val(convertCurrency(jyje));
	});
	$("#txt_sqbl").blur(function(){
		var sxf=$("#money_sxf").val();
		var bl=$("#txt_sqbl").val();
//		alert(parseInt(sxf)*parseFloat(bl)/parseInt(100));
		var zhi = parseInt(sxf)*parseFloat(bl)/parseInt(100);
		if(!isNaN(zhi)){
			$("#money_sjsqsxf").val(parseInt(sxf)*parseFloat(bl)/parseInt(100));
		}
	});
	//$("#span_snzhxx").click(function(){
	//	if(dianji==1){
	//		document.getElementById("qv1").style.display="";
	//		document.getElementById("dianji_con_1").innerHTML="▼";
	//		dianji=2;
	//	}
	//	else{
	//		document.getElementById("qv1").style.display="none";
	//		document.getElementById("dianji_con_1").innerHTML="▶";
	//		dianji=1;
	//	}
	//});
	//$("#span_zhcyr").click(function(){
	//	if(dianji_2==1){
	//		document.getElementById("qv2").style.display="";
	//		document.getElementById("dianji_con_2").innerHTML="▼";
	//		dianji_2=2;
	//	}
	//	else{
	//		document.getElementById("qv2").style.display="none";
	//		document.getElementById("dianji_con_2").innerHTML="▶";
	//		dianji_2=1;
	//	}
	//});
	//$("#span_jbrsfxx").click(function(){
	//	if(dianji_3==1){
	//		document.getElementById("qv3").style.display="";
	//		document.getElementById("dianji_con_3").innerHTML="▼";
	//		dianji_3=2;
	//	}
	//	else{
	//		document.getElementById("qv3").style.display="none";
	//		document.getElementById("dianji_con_3").innerHTML="▶";
	//		dianji_3=1;
	//	}
	//});
	
	function convertCurrency(money) {
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
})