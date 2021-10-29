$(document).ready(function () {
	$("#sle_xzbz").unbind("change").change(function(){
		var biazhi =$("#sle_xzbz").val();
		if(biazhi==1)
		{
//			$("#sle_zhhulb").removeAttr("vl-regex");
			$("#sle_zhhulb").next("img").removeAttr("vl-exec");
//			$("#txt_zrzkh").next("img").removeAttr("vl-exec");
			//$("#sle_xh1").removeAttr("vl-regex");
			$("#sle_zhhulb").next("input").attr("disabled","disabled");
			$("#sle_ywkaz").next("input").attr("disabled","disabled");
			$("#txt_zrzkh").attr("disabled","disabled");
			$("#sle_xh1").next("input").attr("disabled","disabled");
			$("#sle_dzfs").next("input").attr("disabled","disabled");
			$("#txt_zrzkh").next("img").removeAttr("vl-exec");
			$("#txt_zrzkh").next("img").removeAttr("vl-message");
			//vl-message="['转入账/卡号查询未执行！']"
			//txt_zrzkh
		}
		else{
			
			$("#sle_zhhulb").attr("vl-regex","['require']");
			$("#sle_zhhulb").next("img").attr("vl-regex","false");
			$("#sle_xh1").attr("vl-regex","['require']");
			$("#sle_zhhulb").next("input").removeAttr("disabled");
			$("#sle_ywkaz").next("input").removeAttr("disabled");
			$("#txt_zrzkh").removeAttr("disabled");
			$("#sle_xh1").next("input").removeAttr("disabled");
			$("#sle_dzfs").next("input").removeAttr("disabled");
			$("#txt_zrzkh").next("img").attr("vl-exec","false");
			$("#txt_zrzkh").next("img").attr("vl-message","['转入账/卡号查询未执行！']");
		}
	});
	
	$("#sle_zhhulb")[0].addEventListener("change",function(){
		var zhi=$("#sle_zhhulb").val();
		if(zhi==2){
			$("#sle_ywkaz").attr("vl-disabled","true");
			$("#sle_ywkaz").attr("disabled","disabled");
			$("#sle_ywkaz").next('input').attr("disabled","disabled");
			$("#sle_ywkaz").val("");
			$("#sle_ywkaz").next("input").val("");
		}
		else{
			$("#sle_ywkaz").removeAttr("vl-disabled");
			$("#sle_ywkaz").removeAttr("disabled");
			$("#sle_ywkaz").next('input').removeAttr("disabled");
		}
	});
	
	
})