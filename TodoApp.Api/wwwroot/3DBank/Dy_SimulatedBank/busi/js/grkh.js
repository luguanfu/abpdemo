$(document).ready(function () {
	$("#money_khje").keyup(function (e) {
		if (e.which == 13) {
			$("#sle_cxmm").siblings("input").focus();
		}
	});

	$("#sle_cxmm").unbind("change").change(function () {
		var value = $("#sle_cxmm").val();
		if(value=='Y')
		{
			$("#pwd_cxmm").removeAttr("disabled");
		}
		else if(value=='N')
		{
			$("#pwd_cxmm").attr("disabled","disabled");
		}
     });
     
     $("#sle_cq").unbind("change").change(function () {
		var value = $("#sle_cq").val();
		if(value=='00')
		{
			$("#sle_zclx").attr("disabled","disabled");
			$("#sle_zclx").attr("vl-disabled","true");
			$("#sle_zclx").next('input').attr("disabled","disabled");
			$("#sle_sfzc").attr("disabled","disabled");
			$("#sle_sfzc").attr("vl-disabled","true");
			$("#sle_sfzc").next('input').attr("disabled","disabled");
			
			
			//vl-disabled="true"alert("11111");
		}
		else 
		{
			
			
			$("#sle_zclx").removeAttr("disabled");
			$("#sle_zclx").removeAttr("vl-disabled");
			$("#sle_zclx").next('input').removeAttr("disabled");
			
			
			$("#sle_sfzc").removeAttr("disabled");
			$("#sle_sfzc").removeAttr("vl-disabled");
			$("#sle_sfzc").next('input').removeAttr("disabled");
		}
     });
})