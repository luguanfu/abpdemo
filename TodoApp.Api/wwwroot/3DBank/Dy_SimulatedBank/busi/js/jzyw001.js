$(document).ready(function () {
	$('#sle_zjlx2').next('input').click(function(){
		var a = $("#txt_xkh").val();
		$("#txt_xkzkh").val(a);
		
		var b = $("#txt_zhmc").val();
		$("#txt_zhmc2").val(b);
	});
})
