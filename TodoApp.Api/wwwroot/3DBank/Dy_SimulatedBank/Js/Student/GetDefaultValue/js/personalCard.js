$(document).ready(function () {
	$("#txt_jzhm1").next("img").removeAttr("vl-exec");
	$("#pwd_cxmm3").next("img").removeAttr("vl-exec");
	$("#sle_ylxhxyk00").next("img").removeAttr("vl-exec");
	$("#sle_xzbz").unbind("change").change(function(){
		var biazhi =$("#sle_xzbz").val();
		if(biazhi==1)
		{

			$("#txt_zczkh").removeAttr("kuaicha");
			$("#txt_zczkh").next("img").removeAttr("vl-exec");
			
			$("#money_zye").next("img").removeAttr("vl-exec");
			$("#txt_zjhm2").next("img").removeAttr("vl-exec");
			$("#pwd_zqmm1").next("img").removeAttr("vl-exec");
			$("#txt_zcpzhm").next("img").removeAttr("vl-exec");
			
			$("#sle_zhlb").attr("vl-disabled","true");
			$("#sle_zhlb").next("input").attr("vl-disabled","true");
			$("#txt_zczkh").attr("vl-disabled","true");
			$("#money_zye").attr("vl-disabled","true");
			$("#sle_sflm1").attr("vl-disabled","true");
			$("#sle_sflm1").next("input").attr("vl-disabled","true");
			$("#pwd_zqmm1").attr("vl-disabled","true");
			$("#sle_zjlx2").attr("vl-disabled","true");
			$("#sle_zjlx2").next("input").attr("vl-disabled","true");
			$("#txt_zjhm2").attr("vl-disabled","true");
			$("#txt_zcpzhm").attr("vl-disabled","true");
			$("#sle_zcpzzl").attr("vl-disabled","true");
			$("#sle_zcpzzl").next("input").attr("vl-disabled","true");
		}
		else{
			$("#txt_zczkh").attr("kuaicha","true");
			$("#txt_zczkh").next("img").attr("vl-exec","false");
			$("#money_zye").next("img").attr("vl-exec","false");
			$("#txt_zjhm2").next("img").attr("vl-exec","false");
			$("#pwd_zqmm1").next("img").attr("vl-exec","false");
			$("#txt_zcpzhm").next("img").attr("vl-exec","false");
			
			$("#sle_zhlb").removeAttr("vl-disabled");
			$("#sle_zhlb").next("input").removeAttr("vl-disabled");
			$("#txt_zczkh").removeAttr("vl-disabled");
			$("#money_zye").removeAttr("vl-disabled");
			$("#sle_sflm1").removeAttr("vl-disabled");
			$("#sle_sflm1").next("input").removeAttr("vl-disabled");
			$("#pwd_zqmm1").removeAttr("vl-disabled");
			$("#sle_zjlx2").removeAttr("vl-disabled");
			$("#sle_zjlx2").next("input").removeAttr("vl-disabled");
			$("#txt_zjhm2").removeAttr("vl-disabled");
			$("#txt_zcpzhm").removeAttr("vl-disabled");
			$("#sle_zcpzzl").removeAttr("vl-disabled");
			$("#sle_zcpzzl").next("input").removeAttr("vl-disabled");
			
			$("#sle_zhlb").removeAttr("disabled");
			$("#sle_zhlb").next("input").removeAttr("disabled");
			$("#txt_zczkh").removeAttr("disabled");
			$("#money_zye").removeAttr("disabled");
			$("#sle_sflm1").removeAttr("disabled");
			$("#sle_sflm1").next("input").removeAttr("disabledd");
			$("#pwd_zqmm1").removeAttr("disabled");
			$("#sle_zjlx2").removeAttr("disabled");
			$("#sle_zjlx2").next("input").removeAttr("disabled");
			$("#txt_zjhm2").removeAttr("disabled");
			$("#txt_zcpzhm").removeAttr("disabled");
			$("#sle_zcpzzl").removeAttr("disabled");
			$("#sle_zcpzzl").next("input").removeAttr("disabled");
			
		}
	});
})