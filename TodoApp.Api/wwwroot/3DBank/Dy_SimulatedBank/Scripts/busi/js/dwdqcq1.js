$(document).ready(function () {
	$("#money_jyje").blur(function(){
		var jyje=$("#money_jyje").val();
		if(jyje!=""){
			if(parseInt(jyje)<5000){
				//alert("交易金额不得低于该产品的起存金额!");
			}
		}
	});
	$("#sle_zy").blur(function(){
		var s=document.getElementById("sle_zy");
		var sindex=s.selectedIndex;
		var sv=s.options[sindex].value;
		if(sv=='99'){
			document.getElementById("txt_zy").disabled=true;
		}
	});
	$("#sle_aazclx").blur(function(){
	    var s=document.getElementById("sle_aazclx");
		var sindex=s.selectedIndex;
		var sv=s.options[sindex].value;
		if(sv=='0'){
			document.getElementById("sle_zcqx").disabled=true;
			document.getElementById("txt_lxzrzh").disabled=true;
			document.getElementById("txt_lxzrhm").disabled=true;
			document.getElementById("sle_lxzrbz").disabled=true;
			document.getElementById("sle_lxzrcpdm").disabled=true;
		}
		else if(sv=='1'){
			document.getElementById("sle_zcqx").disabled=true;
			document.getElementById("txt_lxzrzh").disabled=false;
			document.getElementById("txt_lxzrhm").disabled=true;
			document.getElementById("sle_lxzrbz").disabled=true;
			document.getElementById("sle_lxzrcpdm").disabled=true;
			$("#txt_lxzrzh").attr("vl-regex","require");
		}
	});
})