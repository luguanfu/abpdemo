$(document).ready(function () {
	$("#txt_kh").blur(function(){
		var pwd=$("#txt_kh").val();
		$("#txt_kh2").val(pwd);
	});
})
