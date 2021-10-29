$(document).ready(function () {
	$("#sle_xzbz").unbind("change").change(function () {
		var sle_sfwhfgmye =$("#sle_xzbz").val();
		if (sle_sfwhfgmye==1) {
			$('#txt_zrzkh').removeAttr("kuaicha");
			$('#txt_zrzjhm').removeAttr("kuaicha");
			$('#txt_zrzkh').removeAttr("kuaicha");
			$("#txt_zrzkh").next("img").removeAttr("vl-regex");
			$("#txt_zrzjhm").next("img").removeAttr("vl-regex");
			$("#txt_zrzkh").next("img").removeAttr("vl-regex");
		}
		else{
			$('#txt_zrzkh').attr("kuaicha","true");
			$('#txt_zrzjhm').attr("kuaicha","true");
			$('#txt_zrzkh').attr("kuaicha","true");
			$("#txt_zrzkh").next("img").attr("vl-regex","false");
			$("#txt_zrzjhm").next("img").attr("vl-regex","false");
			$("#txt_zrzkh").next("img").attr("vl-regex","false");
		}
     });


})
