$(document).ready(function () {
	$("#txt_zsjgmc").blur(function(){
		var v=$("#txt_zsjgmc").val();
		if(isNaN(v)){
			//alert("征收机关名称不允许全部为数字！");
			$("#txt_zsjgmc").siblings(".txt_zsjgmc_tips").show();
		}
	})
})