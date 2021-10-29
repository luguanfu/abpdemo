$(document).ready(function () {
	$("#txt_zkh").blur(function(){
		var cardNum=$("#txt_zkh").val();
		var first = cardNum.substr(0,1);
		if(first==6){
			$("#money_czye").attr("disabled","disabled");
			$("#money_czye").removeAttr("kuaicha");
			$("#money_czye").next("img").removeAttr("vl-exec");
		}
		else
		{
			$("#money_czye").removeAttr("disabled");
			$("#money_czye").attr("kuaicha","true");
			$("#money_czye").next("img").attr("vl-exec","true");
		}
	});
	
//	$("#money_jyje").blur(function(){
//		var myselect=document.getElementById("sle_xzbz");
//		var index=myselect.selectedIndex;
//	    var v=myselect.options[index].value;
//
//	    var money=$("#money_jyje").val();
//	    if(v=="1"){
//	    	if(money<50000){
//	    		$("#sle_zjlx").removeAttr("vl-regex");
//	    		$("#sle_zy").removeAttr("vl-regex");
//	    	}
//	    	else{
//	    		$("#sle_zjlx").attr("vl-regex","require");
//	    		$("#sle_zy").attr("vl-regex","require");
//	    	}
//	    }
//	    if(v=="2"){
//	    	if(money<200000){
//	    		$("#sle_zjlx").removeAttr("vl-regex");
//	    		$("#sle_zy").removeAttr("vl-regex");
//	    		
//	    		$("#sle_zhlb").removeAttr("vl-regex");
//	    		$("#sle_ywkz").removeAttr("vl-regex");
//	    		$("#txt_zrzkh").removeAttr("vl-regex");
//	    		$("#sle_xh2").removeAttr("vl-regex");
//	    		$("#sle_dzfs").removeAttr("vl-regex");
//				$("#sle_fjlx2").removeAttr("vl-regex");
//				$("#txt_zrhm").removeAttr("vl-regex");
//				$("#sle_zrjzzl").removeAttr("vl-regex");
//				$("#txt_zrjzhm").removeAttr("vl-regex");
//				$("#sle_zrzjlx2").removeAttr("vl-regex");
//				$("#txt_zrzjhm").removeAttr("vl-regex");
//				$("#sle_zy2").removeAttr("vl-regex");
//				$("#txt_kong3").removeAttr("vl-regex");
//	    	}
//	    	else{
//	    		$("#sle_zjlx").attr("vl-regex","require");
//	    		$("#sle_zy").attr("vl-regex","require");
//	    		
//	    		$("#sle_zhlb").attr("vl-regex","require");
//	    		$("#sle_ywkz").attr("vl-regex","require");
//	    		$("#txt_zrzkh").attr("vl-regex","require");
//	    		$("#sle_xh2").attr("vl-regex","require");
//	    		$("#sle_dzfs").attr("vl-regex","require");
//				$("#sle_fjlx2").attr("vl-regex","require");
//				$("#txt_zrhm").attr("vl-regex","require");
//				$("#sle_zrjzzl").attr("vl-regex","require");
//				$("#txt_zrjzhm").attr("vl-regex","require");
//				$("#sle_zrzjlx2").attr("vl-regex","require");
//				$("#txt_zrzjhm").attr("vl-regex","require");
//				$("#sle_zy2").attr("vl-regex","require");
//				$("#txt_kong3").attr("vl-regex","require");
//	    	}
//	    }
//	    $("#money_jyje").css("font-weight","bold");
//	    var specialKey = "#$%\^*\'\"\+";
//	    var realkey = String.fromCharCode(money);
//	    var flg = false;
//	    flg = (specialKey.indexOf(realkey) >= 0);
//	     if (flg) {
//	           alert('请勿输入特殊字符: ' + realkey);
//	       }
//	});
	$("#txt_zjhm").blur(function(){
		var myselect=document.getElementById("sle_zjlx");
		var index=myselect.selectedIndex;
	    var v=myselect.options[index].value;
	    var num=$("#txt_zjhm").val();
	    check(v,num,"证件号码错误！","#txt_zjhm");
	});
	
	$("#txt_dlrzjhm").blur(function(){
		var myselect=document.getElementById("sle_dlrzjlx");
		var index=myselect.selectedIndex;
	    var v=myselect.options[index].value;
	    var num=$("#txt_dlrzjhm").val();
	    check(v,num,"代理人证件号码错误！","#txt_dlrzjhm");
	});
	
	$("#money_czye").blur(function(){
		//$("#money_czye").css("font-weight","bold");
	});
	
//	$("#sle_zjlx").blur(function(){
//		var myselect=document.getElementById("sle_zjlx");
//		var index=myselect.selectedIndex;
//	    var v=myselect.options[index].value;
//		if(v!=""){
//			$("#txt_zjhm").attr("vl-regex","require");
//		}
//	});
//	
	$("#sle_zhlb").blur(function(){
		var myselect=document.getElementById("sle_zhlb");
		var index=myselect.selectedIndex;
	    var v=myselect.options[index].value;
	    if(v==2){
	    	$("#txt_zrzkh").attr("vl-regex","require");
	    	$("#sle_xh2").attr("vl-regex","require");
	    	$("#sle_ywkz").attr("disabled","disabled");
	    	$("#sle_ywkz").next("input").attr("disabled","disabled");
	    	$("#sle_dzfs").attr("disabled","disabled");
	    	$("#sle_fjlx2").attr("disabled","disabled");
	    	$("#txt_zrhm").attr("disabled","disabled");
	    	$("#sle_zrjzzl").attr("disabled","disabled");
	    	$("#txt_zrjzhm").attr("disabled","disabled");
	    	$("#sle_zrzjlx2").attr("disabled","disabled");
	    	$("#txt_zrzjhm").attr("disabled","disabled");
	    	document.getElementById("sle_zy2").options[36].selected = true;
	    	$("#txt_kong3").val("其他");
	    }
	    else if(v==3){
	    	$("#txt_zrzkh").attr("vl-regex","require");
	    	$("#sle_xh2").attr("vl-regex","require");
	    	$("#sle_ywkz").attr("disabled","disabled");
	    	$("#sle_ywkz").next("input").attr("disabled","disabled");
	    	$("#sle_dzfs").attr("disabled","disabled");
	    	$("#sle_fjlx2").attr("disabled","disabled");
	    	$("#txt_zrhm").attr("disabled","disabled");
	    	$("#sle_zrjzzl").attr("disabled","disabled");
	    	$("#txt_zrjzhm").attr("disabled","disabled");
	    	$("#sle_zrzjlx2").attr("disabled","disabled");
	    	$("#txt_zrzjhm").attr("disabled","disabled");
	    	document.getElementById("sle_zy2").options[36].selected = true;
	    	$("#txt_kong3").val("其他");
	    }
	    else if(v==1){
	    	document.getElementById("sle_ywkz").options[1].selected = true;
	    	$("#sle_zrjzzl").attr("disabled","disabled");
	    	$("#txt_zrjzhm").attr("disabled","disabled");
	    	document.getElementById("sle_zy2").options[36].selected = true;
	    	$("#txt_kong3").val("其他");
	    }
	    else{
	    	$("#txt_zrzkh").removeAttr("vl-regex");
	    	$("#sle_xh2").removeAttr("vl-regex");
	    	("#sle_ywkz").removeAttr("disabled");
	    	$("#sle_dzfs").removeAttr("disabled");
	    	$("#txt_zrhm").removeAttr("disabled");
	    	$("#sle_zrjzzl").removeAttr("disabled");
	    	$("#txt_zrjzhm").removeAttr("disabled");
	    	$("#sle_zrzjlx2").removeAttr("disabled");
	    	$("#txt_zrzjhm").removeAttr("disabled");
	    	document.getElementById("sle_zy2").options[0].selected = true;
	    	$("#txt_kong3").val("");
	    }
	});
	
	$("#sle_dlrzjlx").blur(function(){
	    var myselect=document.getElementById("sle_dlrzjlx");
		var index=myselect.selectedIndex;
	    var v=myselect.options[index].value;
	    if(v!=""){
	    	$("#txt_dlrzjhm").removeAttr("vl-disabled");
	    	$("#txt_dlrxm").removeAttr("vl-disabled");
	    	$("#txt_dlrlxfs").removeAttr("vl-disabled");
	    }
	});
	
	function check(selvalue,txtvalue,mes,obj){
		var result;
		if(selvalue==1||selvalue==2){
	    	result=txtvalue.match(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/);
	    }
	    else if(selvalue==3){
	    	result=txtvalue.match(/^[a-zA-Z0-9]{3,21}$/);
	    }
	    else if(selvalue==4||selvalue==6){
	    	result=txtvalue.match(/^[a-zA-Z0-9]{7,21}$/);
	    }
	    else if(selvalue==10||selvalue==11){
	    	result=txtvalue.match(/^[a-zA-Z0-9]{3,21}$/);
	    	if(result==0){
	    		result=txtvalue.match(/^(P\d{7})|(G\d{8})$/);
	    	}
	    }
	    else if(selvalue==13||selvalue==14||selvalue==15||selvalue==16||selvalue==17){
	    	result=txtvalue.match(/^[a-zA-Z0-9]{5,21}$/);
	    }
	    if(result==0){
	    	//alert(mes);
	    	if(obj=="txt_zjhm"){
	    		$("#txt_zjhm").siblings(".txt_zjhm_tips").show();
	    	}
	    	else{
	    		$("#txt_dlrzjhm").siblings(".txt_dlrzjhm_tips").show();
	    	}
	    }
	}
})