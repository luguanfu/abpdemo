
$(document).ready(function () {
	$("#txt_zrhm").removeAttr("vl-disabled");
	$("#txt_zrhm").removeAttr("disabled");
	
	$("#sle_xzbz").unbind("change").change(function(){
		var biazhi =$("#sle_xzbz").val();
		if(biazhi==1)
		{
			$("#txt_zrzkh").next("img").removeAttr("vl-exec");
			$("#txt_zrzkh").next("img").removeAttr("vl-message");
		}
		else{
			$("#txt_zrzkh").next("img").attr("vl-exec","false");
			$("#txt_zrzkh").next("img").attr("vl-message","['转入账/卡号查询未执行！']");
		}
	});
})