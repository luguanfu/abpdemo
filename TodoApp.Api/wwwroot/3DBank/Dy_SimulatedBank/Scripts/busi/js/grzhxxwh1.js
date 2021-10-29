$(document).ready(function () {
	$("#money_dbxe").blur(function(){
		var dbxe=$("#money_dbxe").val();
		dbxe=dbxe.replace(",","");
		if(dbxe!=""){
			if(dbxe.indexOf(".")!=-1){
				var temp=dbxe.substring(0,dbxe.indexOf("."));
				if(temp.length>13){
					//alert("单笔限额数据整数部分超限[13]!");
					$("#money_dbxe").siblings(".money_dbxe_tips").show(); 
				}
			}
		}
	});
	$("#money_rljxe").blur(function(){
		var rljxe=$("#money_rljxe").val();
		rljxe=rljxe.replace(",","");
		rljxe=rljxe.replace(".","");
		var dbxe=$("#money_dbxe").val();
		dbxe=dbxe.replace(",","");
		dbxe=dbxe.replace(".","");
		if(parseFloat(rljxe)<parseFloat(dbxe)){
			//alert("日累计限额不能小于单笔限额!");
			$("#money_rljxe_tips").html("日累计限额不能小于单笔限额!").show();
		}
	});
	$("#sle_sfwhfgmye").blur(function(){
	    var myselect=document.getElementById("sle_sfwhfgmye");
		var index=myselect.selectedIndex;
	    var v=myselect.options[index].value;
	    document.getElementById("money_je").val("99,999,999,999,999.00");
	    document.getElementById("money_je2").val("99,999,999,999,999.00");
	    document.getElementById("txt_bs").val("9999999999");
	    document.getElementById("txt_bs1").val("9999999999");
	    if(v=='N'){
	    	document.getElementById("sle_jfrxewh").disabled=true;
	    	document.getElementById("money_je").disabled=true;
	    	document.getElementById("sle_jfnxewh").disabled=true;
	    	document.getElementById("money_je2").disabled=true;
	    	document.getElementById("sle_jfrjybs").disabled=true;
	    	document.getElementById("txt_bs").disabled=true;
	    	document.getElementById("sle_jfnjybs").disabled=true;
	    	document.getElementById("txt_bs1").disabled=true;
	    }
	    else{
			document.getElementById("money_je").disabled=false;
			document.getElementById("money_je2").disabled=false;
			document.getElementById("txt_bs").disabled=false;
			document.getElementById("txt_bs1").disabled=false;
	    }
	});
	$("#money_je").blur(function(){
		var je=$("#money_je").val();
		if(je!=""){
			if(je.indexOf(".")!=-1){
				var temp=je.substring(0,je.indexOf("."));
				if(temp.length>14){
					//alert("金额整数部分超限[14]!");
					$("#money_je").siblings(".money_je_tips").show(); 
				}
			}
		}
	});
	$("#money_je2").blur(function(){
		var je=$("#money_je").val();
		je=je.replace(",","");
		je=je.replace(".","");
		var je2=$("#money_je2").val();
		je2=je2.replace(",","");
		je2=je2.replace(".","");
		if(je!=""&&je2!=""){
			if(parseInt(je2)<parseInt(je)){
				//alert("每年借方限额不得小于每日借方限额!");
				$("#money_je2_tips").html("每年借方限额不得小于每日借方限额!").show();
			}
		}
		if(je2!=""){
			if(je2.indexOf(".")!=-1){
				var temp=je2.substring(0,je2.indexOf("."));
				if(temp.length>14){
					//alert("金额整数部分超限[14]!");
					$("#money_je2").siblings(".money_je_tips").show(); 
				}
			}
		}
	});
	$("#sle_sfwhfgmye").blur(function(){
		var myselect=document.getElementById("sle_sfwhfgmye");
		var index=myselect.selectedIndex;
	    var v=myselect.options[index].value;
	    if(v=='Y'){
	    	$("#sle_jfrxewh").attr("vl-default","Y");
	    	$("#sle_jfnxewh").attr("vl-default","Y");
	    	$("#sle_jfrjybs").attr("vl-default","Y");
	    	$("#sle_jfnjybs").attr("vl-default","Y");
	    }
	    else{
	    	$("#sle_jfrxewh").attr("vl-default","N");
	    	$("#sle_jfnxewh").attr("vl-default","N");
	    	$("#sle_jfrjybs").attr("vl-default","N");
	    	$("#sle_jfnjybs").attr("vl-default","N");
	    }
	});
})