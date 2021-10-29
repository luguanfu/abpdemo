$(document).ready(function () {
	$("#pwd_zqmm").next("img").click(function(){
		var pwd=$("#pwd_zqmm").val();
		// alert("pwd:"+pwd);
		$("#pwd_zqmm2").val(pwd);
		// alert("被点击了!");
	})
})
