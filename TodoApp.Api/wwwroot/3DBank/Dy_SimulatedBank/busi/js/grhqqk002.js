$(document).ready(function () {
//	$("#sle_xzbz").blur(function(){
//		var myselect=document.getElementById("sle_xzbz");
//		var index=myselect.selectedIndex;
//	    var v=myselect.options[index].value;
//	    alert("sdasdasda:"+v);
//	    var jyje=$("#money_jyje").val();
//	    //money_jyje
//		jyje=jyje.replace(",","");
//		jyje=jyje.replace(".","");
//	    if(v==2){
//	    	alert("jinlai")
//	    	$("#sle_zhlb").attr("vl-regex","['require']");
//	    	$("#txt_zrzkh").attr("vl-regex","['require']");
//	    	$("#sle_xh2").attr("vl-regex","['require']");
//	    	$("#sle_dzfs").attr("vl-regex","['require']");
//	    	if(parseFloat(jyje)>=200000){
//	    		alert("11111opopopopop");
//	    		$("#sle_zjlx").attr("vl-regex","['require']");
//				$("#sle_zy").attr("vl-regex","['require']");
//				
//				$("#sle_zhlb").attr("vl-regex","['require']");
//				$("#sle_zhlb").removeAttr("disabled");
//				$("#sle_zhlb").removeAttr("vl-disabled");
//				$("#sle_zhlb").next("input").removeAttr("disabled");
//	    	    $("#sle_ywkz").attr("vl-regex","['require']");
//	    		$("#txt_zrzkh").attr("vl-regex","['require']");
//	    		$("#sle_xh2").attr("vl-regex","['require']");
//	    		$("#sle_dzfs").attr("vl-regex","['require']");
//	    		$("#sle_fjlx2").attr("vl-regex","['require']");
//	    		$("#txt_zrhm").attr("vl-regex","['require']");
//	    		$("#sle_zrjzzl").attr("vl-regex","['require']");
//	    		$("#txt_zrjzhm").attr("vl-regex","['require']");
//	    		$("#sle_zrzjlx2").attr("vl-regex","['require']");
//	    		$("#txt_zrzjhm").attr("vl-regex","['require']");
//	    		$("#sle_zy2").attr("vl-regex","['require']");
//	    		$("#txt_kong3").attr("vl-regex","['require']");
//	    	}
//	    	else{
//	    		$("#sle_zjlx").removeAttr("vl-regex");
//				$("#sle_zy").removeAttr("vl-regex");
//	    	}
//	    }
//	    else if(v==1){
//	    	alert("111111111bbbb");
//	    	$("#sle_zhlb").removeAttr("vl-regex");
//	    	$("#sle_ywkz").removeAttr("vl-regex");
//	    	$("#txt_zrzkh").removeAttr("vl-regex");
//	    	$("#sle_xh2").removeAttr("vl-regex");
//	    	$("#sle_dzfs").removeAttr("vl-regex");
//	    	$("#sle_fjlx2").removeAttr("vl-regex");
//	    	
//	    	$("#txt_zrhm").removeAttr("vl-regex");
//	    	$("#sle_zrjzzl").removeAttr("vl-regex");
//	    	$("#txt_zrjzhm").removeAttr("vl-regex");
//	    	$("#sle_zrzjlx2").removeAttr("vl-regex");
//	    	
//	    	$("#txt_zrzjhm").removeAttr("vl-regex");
//	    	$("#sle_zy2").removeAttr("vl-regex");
//	    	$("#txt_kong3").removeAttr("vl-regex");
//	    	
//	    	
//	    	document.getElementById("sle_zhlb").disabled=true;
//	    	document.getElementById("sle_ywkz").disabled=true;
//	    	document.getElementById("txt_zrzkh").disabled=true;
//	    	document.getElementById("sle_xh2").disabled=true;
//	    	document.getElementById("sle_dzfs").disabled=true;
//	    	document.getElementById("sle_fjlx2").disabled=true;
//	    	document.getElementById("txt_zrhm").disabled=true;
//	    	document.getElementById("sle_zrjzzl").disabled=true;
//	    	document.getElementById("txt_zrjzhm").disabled=true;
//	    	document.getElementById("sle_zrzjlx2").disabled=true;
//	    	document.getElementById("txt_zrzjhm").disabled=true;
//	    	document.getElementById("sle_zy2").disabled=true;
//	    	document.getElementById("txt_kong3").disabled=true;
//			$("#sle_zhlb").siblings("input").disabled=true;
//			$("#sle_ywkz").siblings("input").disabled=true;
//			$("#sle_xh2").siblings("input").disabled=true;
//			$("#sle_dzfs").siblings("input").disabled=true;
//			$("#sle_zrjzzl").siblings("input").disabled=true;
//			$("#sle_zrzjlx2").siblings("input").disabled=true;
//
//			if(parseFloat(jyje)>=50000){
//				$("#sle_zjlx").attr("vl-regex","['require']");
//				$("#sle_zy").attr("vl-regex","['require']");
//			}
//			else{
//				$("#sle_zjlx").removeAttr("vl-regex");
//				$("#sle_zy").removeAttr("vl-regex");
//			}
//	    }
//	});
	$("#sle_dlrzjlx").blur(function(){
	    var myselect=document.getElementById("sle_dlrzjlx");
		var index=myselect.selectedIndex;
	    var v=myselect.options[index].value;
		if(v!=""){
			document.getElementById("txt_dlrzjhm").disabled=false;
			document.getElementById("txt_dlrxm").disabled=false;
			document.getElementById("txt_dlrlxfs").disabled=false;
		}
	});
//	$("#sle_zhlb").blur(function(){
	$("#sle_zhlb")[0].addEventListener("change",function(){
		var myselect=document.getElementById("sle_zhlb");
		var index=myselect.selectedIndex;
	    var v=myselect.options[index].value;
	    if(v==2){
	    	$("#txt_zrzkh").attr("vl-regex","['require']");
	    	$("#sle_xh2").attr("vl-regex","['require']");
	    	$("#sle_dzfs").removeAttr("vl-regex");
//	    	document.getElementById("sle_zhlb").disabled=true;
	    	document.getElementById("sle_ywkz").disabled=true;
	    	$("#sle_ywkz").next("input").attr("disabled","disabled");
	    	document.getElementById("sle_fjlx2").disabled=true;
	    	document.getElementById("txt_zrhm").disabled=true;
	    	document.getElementById("sle_zrjzzl").disabled=true;
	    	document.getElementById("txt_zrjzhm").disabled=true;
	    	document.getElementById("sle_zrzjlx2").disabled=true;
	    	document.getElementById("txt_zrzjhm").disabled=true;
	    	document.getElementById("sle_zy2").disabled=true;
	    	document.getElementById("txt_kong3").disabled=true;
	    	document.getElementById("sle_zy2").options[36].selected=true;
	    	$("#txt_kong3").val("其他");
	    }
	    else if(v==3){
	    	$("#txt_zrzkh").attr("vl-regex","['require']");
	    	$("#sle_xh2").attr("vl-regex","['require']");
	    	document.getElementById("sle_dzfs").disabled=true;
	    	//document.getElementById("sle_zhlb").disabled=true;
	    	document.getElementById("sle_ywkz").disabled=true;
	    	$("#sle_ywkz").next("input").attr("disabled","disabled");
	    	document.getElementById("sle_fjlx2").disabled=true;
	    	document.getElementById("txt_zrhm").disabled=true;
	    	document.getElementById("sle_zrjzzl").disabled=true;
	    	document.getElementById("txt_zrjzhm").disabled=true;
	    	document.getElementById("sle_zrzjlx2").disabled=true;
	    	document.getElementById("txt_zrzjhm").disabled=true;
	    	document.getElementById("sle_zy2").disabled=true;
	    	document.getElementById("txt_kong3").disabled=true;
	    	document.getElementById("sle_zy2").options[36].selected=true;
	    	$("#txt_kong3").val("其他");
	    }
	    else if(v==1){
	    	document.getElementById("sle_ywkz").disabled=false;
	    	//document.getElementById("sle_ywkz").options[1].selected=true;
	    	$("#txt_zrzkh").attr("vl-regex","['require']");
	    	$("#sle_xh2").attr("vl-regex","['require']");
	    	document.getElementById("sle_dzfs").options[1].selected=true;
	    	document.getElementById("sle_dzfs").disabled=false;
	    	document.getElementById("txt_zrhm").disabled=false;
	    	document.getElementById("sle_zrzjlx2").disabled=false;
	    	document.getElementById("txt_zrzjhm").disabled=false;
	    }
	});
	$("#txt_zrhm").blur(function(){
		var v=$("#txt_zrhm").val();
		if(isNaN(v)){
			//alert("转入户名不允许全部为数字!");
			$("#txt_zrhm").siblings(".txt_zrhm_tips").show(); 
		}
	});
})