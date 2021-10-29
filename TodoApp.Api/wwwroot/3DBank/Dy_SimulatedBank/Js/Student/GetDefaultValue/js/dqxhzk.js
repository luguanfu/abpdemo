
$(document).ready(function () {
	$("#txt_zkh").blur(function(){
		var zh=$("#txt_zkh").val();
		$("#txt_xzkh").val(zh);
	});
})