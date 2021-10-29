$(document).ready(function () {
	$("#sle_gsfs").change(function(){
	    var myselect=document.getElementById("sle_gsfs");
		var index=myselect.selectedIndex;
	    var v=myselect.options[index].value;
	    if(v==2){
	    	document.getElementById("sle_gslx").disabled=false;
	    	$("#pwd_zqmm").attr("vl-regex","['require']");
	    	document.getElementById("pwd_zqmm").disabled=true;
	    	$("#pwd_zqmm").removeAttr("vl-disabled");
	    	$("#pwd_zqmm").removeAttr("disabled");
	    }
	    else if(v==1){
	    	document.getElementById("sle_gslx").disabled=true;
	    	$("#pwd_zqmm").removeAttr("vl-disabled");
	    	$("#pwd_zqmm").removeAttr("disabled");
	    }
	    else if(v==4){
	    	document.getElementById("sle_gslx").disabled=false;
	    	$("#pwd_zqmm").attr("vl-disabled","true");
	    	$("#pwd_zqmm").attr("disabled","disabled");
	    	
	    }
	});
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
	    	if(obj=="#txt_zjhm"){
	    		$("#txt_zjhm").siblings(".txt_zjhm_tips").show(); 
	    	}
	    	else{
	    		$("#txt_dlrzjhm").siblings(".txt_dlrzjhm_tips").show(); 
	    	}
	    }
	}
})