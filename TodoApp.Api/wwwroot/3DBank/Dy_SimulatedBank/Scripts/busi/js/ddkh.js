$(document).ready(function () {
	//51011单位整存整取时，交易金额起存金额不低于10000
	$("#sle_cpdm2").blur(function (){
		var myselect=document.getElementById("sle_cpdm2");
		var index=myselect.selectedIndex;
		var v=myselect.options[index].value;
		if(v=='51011'){
			var jymoney=$("#money_jyje").val();
			if(parseInt(jymoney)<10000){
				document.getElementById("money_jyje").focus();
				//alert("交易金额不可低于产品的起存金额！");
				$("#sle_cpdm2_tips").html("交易金额不可低于产品的起存金额！").show();
			}
		}
	});
	$("#sle_zclx").blur(function (){
		var s=document.getElementById("sle_zclx");
		var sindex=s.selectedIndex;
		var sv=s.options[sindex].value;
		var myselect=document.getElementById("sle_cpdm2");
		var index=myselect.selectedIndex;
		var v=myselect.options[index].value;
		if(v=='51011'&&sv=='1'){
			//51011整存整取，转存类型为本金转存时，利息转入号码为必填，默认读取当前账号
			$("#txt_lxzrzh").val($("#txt_jszh").val());
			$("#txt_lxzrzh").attr("vl-regex","require");
		}
		if(v=='51021'&&sv=='0'){
			//产品代码为单位存本取息时，转存类型不能为本息转存
			//alert("转存类型不允许本息转存！");
			$("#sle_zclx_tips").html("转存类型不允许本息转存！").show();
		}
	});
})