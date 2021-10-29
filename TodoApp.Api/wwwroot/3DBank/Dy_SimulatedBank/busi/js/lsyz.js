$(document).ready(function () {
	$("#date_zzrq").blur(function(){
		var zzrq=$("date_zzrq").val();
		var jyrq=new Date().toLocaleDateString();
		if(zzrq>jyrq){
			alert("轧账日期不能大于交易日期！");
		}
	})
})