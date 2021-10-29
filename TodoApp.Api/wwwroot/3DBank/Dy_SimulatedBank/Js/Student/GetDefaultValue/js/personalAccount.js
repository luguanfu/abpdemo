$(document).ready(function() {
	$("#sle_xzbz")[0].addEventListener("change",function(){
		var state= $("#sle_xzbz").val();
		if(state==1)
		{
			$("#txt_zrzkh").removeAttr("kuaicha");
			$("#txt_zrzkh").removeAttr("vl-regex");
			$("#txt_zrzkh").next("img").removeAttr("vl-exec");
			$("#txt_zrzkh").parent().find(".redtip").remove();
			
			$("#sle_zhlb").removeAttr("vl-regex");
			$("#sle_zhlb").parent().find(".redtip").remove();
			
			
			$("#sle_ywkz2").removeAttr("vl-regex");
			$("#sle_ywkz2").parent().find(".redtip").remove();
			
			$("#sle_xh2").removeAttr("vl-regex");
			$("#sle_xh2").parent().find(".redtip").remove();
			
			
			$("#txt_zrhm").removeAttr("kuaicha");
			$("#txt_zrhm").removeAttr("vl-regex");
			$("#txt_zrhm").next("img").removeAttr("vl-exec");
			$("#txt_zrhm").parent().find(".redtip").remove();
			
			$("#txt_zrzjhm").next("img").removeAttr("vl-exec");
			$("#txt_zrzjhm").removeAttr("kuaicha");
			
//			$("#sle_ywkz2").removeAttr("vl-regex");
//			$("#sle_ywkz2").remove("img");
//			
//			$("#sle_xh2").removeAttr("vl-regex");
//			$("#sle_xh2").remove("img");
//
//			$("#txt_zrzkh").removeAttr("kuaicha");
//			$("#txt_zrzkh").removeAttr("vl-regex");
//			$("#txt_zrzkh").next(".sousou").removeAttr("vl-exec");
//			
//			$("#txt_zrhm").removeAttr("kuaicha");
//			$("#txt_zrhm").next(".sousou").removeAttr("vl-exec");
//			
//			$("#txt_zrzjhm").removeAttr("kuaicha");
//			$("#txt_zrzjhm").next(".sousou").removeAttr("vl-exec");
		}
	});
//	//摘要为手工录入处理
//	$("#sle_zy").bind('input propertychange', function() {
//		if($(this).val() == 99) {
//			$(".bisu").css("display", "inline-block");
//			$(".no-choose").removeAttr("disabled");
//		} else {
//			$(".bisu").hide();
//			$(".no-choose").attr("disabled", "disabled");
//		}
//	})
	
	$("#sle_zy2").bind('input propertychange', function() {
		if($(this).val() == 99) {
			$(".lr-fill").removeAttr("disabled");
		}else {
			$(".lr-fill").attr("disabled","disabled");
		}
	})

	//现转标志切换到转账时，转入账户信息仍为可填项
	$("#sle_xzbz").bind('input propertychange', function() {
		if($(this).val() == 2) {
			$(".pa-fill").find("input").removeAttr("disabled");
		}
	})
	
	//代理人信息
	$("#sle_dlrzjlx").bind('input propertychange', function() {
		$(".agent-fill").find("input").removeAttr("disabled");
	})
	
})