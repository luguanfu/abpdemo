$(document).ready(function () {
    $("#txt_zjhm").blur(function () {
		$("#date_zjdqr").val("20240215");
		$("#date_sr").val("19830701");
		$("#txt_fzjg").val("遵义市公安局");
		$("#txt_zjdz").val("贵州省遵义市上海路108号");
		$("#txt_xm").val("危菲舜");
		
		
		// $("#sle_qxlx").val(1);
		// $("#sle_mz").val(0);
		// $("#sle_xb").val(2);
		$("#sle_qxlx option[text='1 - 有有效期']").attr("selected", "selected"); 
		$("#sle_mz option[text='0 - 汉族']").attr("selected", "selected"); 
		$("#sle_xb option[text='2 - 女']").attr("selected", "selected"); 
    });
})
