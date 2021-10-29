$(document).ready(function () {
	
	$("#sle_zhlx").change(function(){	
		var zhi =$("#sle_zhlx").val();
		if(zhi==1){
			
//			$("#txt_jbrxm").attr("vl-regex","['require']");
//			$("#txt_jbrxm").attr("vl-message","['经办人姓名不允许为空!']");
//			$("#txt_jbrxm").find(".redtip").remove();
//			$("#txt_jbrxm").parent().append("<span class=\"text-red redtip\">!</span>");
			
			
			
			$("#txt_jbrlxfs").attr("vl-regex","['require']");
			$("#txt_jbrlxfs").attr("vl-message","['经办人姓名练习方式不允许为空!']");
			$("#txt_jbrlxfs").find(".redtip").remove();
			$("#txt_jbrlxfs").parent().append("<span class=\"text-red redtip\">!</span>");
			
			
			$("#sle_jbrzjlx").attr("vl-regex","['require']");
			$("#sle_jbrzjlx").attr("vl-message","['证件类型不允许为空!']");
			//<span class="text-red redtip">!</span>
			$("#sle_jbrzjlx").parent().find(".redtip").remove();
			$("#sle_jbrzjlx").parent().append("<span class=\"text-red redtip\">!</span>");
		}
		else{
			$("#sle_jbrzjlx").parent().find(".redtip").remove();
			$("#sle_jbrzjlx").removeAttr("vl-regex");
			$("#sle_jbrzjlx").removeAttr("vl-message");
//			
//			$("#txt_jbrxm").parent().find(".redtip").remove();
//			$("#txt_jbrxm").removeAttr("vl-regex");
//			$("#txt_jbrxm").removeAttr("vl-message");
			
			$("#txt_jbrlxfs").parent().find(".redtip").remove();
			$("#txt_jbrlxfs").removeAttr("vl-regex");
			$("#txt_jbrlxfs").removeAttr("vl-message");
		}
	});
})