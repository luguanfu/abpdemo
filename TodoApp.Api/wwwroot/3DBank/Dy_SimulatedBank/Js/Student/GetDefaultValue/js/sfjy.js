$(document).ready(function () {
	$("#money_hjsfje").val("0.00");
	$("#sle_xzbz").blur(function(){
		var myselect=document.getElementById("sle_xzbz");
    	var index=myselect.selectedIndex;
    	var v=myselect.options[index].value;
    	if(v==2){
    		document.getElementById("txt_zhmc").disabled=true;
    	}
    	else if(v==1){
    		$("#txt_zhmc").attr("vl-regex","['require']");
    		document.getElementById("txt_zkh").disabled=true;
    		document.getElementById("pwd_zqmm").disabled=true;
    		document.getElementById("sle_zjlx").disabled=true;
    		document.getElementById("txt_zjhm").disabled=true;
    	}
	});
	$("#pwd_zqmm").blur(function(){
		var zqmm=$("#pwd_zqmm").val();
		if(zqmm.length<6){
			//alert("支取密码长度为：[6]!");
			$("#pwd_zqmm").siblings(".pwd_zqmm_tips").show(); 
		}
	});
	$("#sle_sfzl").blur(function(){
		var myselect=document.getElementById("sle_xzbz");
    	var index=myselect.selectedIndex;
    	var v=myselect.options[index].value;
    	if(v==1){
    		$("#txt_sfzy").disabled=true;
    	}
	});
	$("#money_sfcs").blur(function()){
		var sfcs=$("#sfcs").val();
		if(sfcs.indexOf(".")!=-1){
			$("#sfcs").siblings("money_sfcs_tips").show();
		}
	}
})