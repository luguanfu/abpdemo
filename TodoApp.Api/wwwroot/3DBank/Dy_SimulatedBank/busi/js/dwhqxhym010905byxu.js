$(document).ready(function () {
	var oHtml = $("#sle_pzzl")[0].innerHTML;
	var oToShadow = {"vl-disabled":true,"disabled":"disabled"};
	var oToFocus = {"vl-disabled":false,"disabled":false};
	//摘要值置灰的恢复
	$("#sle_zhaiy1").change(function(){
		if(this.value != "99"){
			$("#txt_zy1").attr({"vl-disabled":true,"disabled":"disabled"});
		}
	});
	//页面属性设置
	$("#sle_xzbz").unbind().change(function () {
		if(this.value == "1"){
			$("#sle_zhhulb").attr(oToShadow).next("input").attr("disabled",true);
			$("#sle_ywkaz").attr(oToShadow).next("input").attr("disabled",true);
			$("#txt_zrzkh").attr(oToShadow);
			$("#sle_xh1").attr(oToShadow).next("input").attr("disabled",true);
			//$("#sle_pzzl")[0].innerHTML = "";
			$("#sle_pzzl").children("option:gt(0):lt(38)").hide();
			$("#sle_pzzl").children("option:eq(14)").show();
			$("#sle_pzzl").value("");//切换现转标志的时候清空凭证种类的值
		}else if(this.value == "2"){
			$("#sle_zhhulb").attr(oToFocus).next("input").attr("disabled",false);
			$("#sle_ywkaz").attr(oToFocus).next("input").attr("disabled",false);
			$("#txt_zrzkh").attr(oToFocus);
			$("#sle_xh1").attr(oToFocus).next("input").attr("disabled",false);
			$("#sle_pzzl")[0].innerHTML
			$("#sle_pzzl").children("option:gt(0):lt(38)").hide();
			$("#sle_pzzl").children("option:eq(15)").show();
		}else{
			$("#sle_pzzl")[0].innerHTML = oHtml;
		}
	});
})