$(document).ready(function () {
	$("#money_jyje").blur(function (){
		//$("#money_jyje").css("font-weight","bold");
		var v=$("#money_jyje").val();
		v=v.replace(/,/g,"");
		if(parseFloat(v)>50000){
			
			$("#sle_zjlx").attr("vl-regex","['require']");
			$("#sle_zjlx").attr("vl-message","['证件类型不允许为空!']");
			
			$("#sle_zjlx").attr("vl-default","1");
			$("#sle_zy").attr("vl-regex","['require']");
			$("#sle_zy").attr("vl-message","['摘要不允许为空!']");
			$("#sle_zy").parent().find(".redtip").remove();
			$("#sle_zy").parent().append("<span class=\"text-red redtip\">!</span>");
			
			//<span class="text-red redtip">!</span>
			$("#sle_zjlx").parent().find(".redtip").remove();
			$("#sle_zjlx").parent().append("<span class=\"text-red redtip\">!</span>");
			 
		}
		else{
			$("#sle_zjlx").parent().find(".redtip").remove();
			$("#sle_zjlx").removeAttr("vl-regex");
			$("#sle_zjlx").removeAttr("vl-message");
			$("#sle_zy").removeAttr("vl-regex");
			$("#sle_zy").removeAttr("vl-message");
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
	
	$("#sle_zy").blur(function(){
		var myselect=document.getElementById("sle_zy");
		var index=myselect.selectedIndex;
	    var v=myselect.options[index].value;
	    if(v=='99'){
	    	$("#txt_zyz99").attr("vl-regex","['require']");
	    	$("#txt_zyz99").removeAttr("vl-disabled");
	    	document.getElementById("txt_zyz99").disabled=false;
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
	    	if(obj=="#txt_zjhm"){
	    		$("#txt_zjhm").siblings(".txt_zjhm_tips").show(); 
	    	}
	    	else{
	    		$("#txt_dlrzjhm").siblings(".txt_dlrzjhm_tips").show(); 
	    	}
	    }
	}
})