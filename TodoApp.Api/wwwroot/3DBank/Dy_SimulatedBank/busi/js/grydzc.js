$(document).ready(function () {
	$(document).on("keydown", function (event) {
		var e = event || window.event; 
		if(e.keyCode == 13){
			var v=$("#txt_zkh").val();
			if(v.length!=0){
				$("#sle_xh2").attr("vl-disabled","false");
				 $("#pwd_zqmm").removeAttr("vl-regex");
				 $("#pwd_zqmm").attr("vl-regex","['minlength6', 'maxlength6', 'number','require']");
			}
		}
	});
	//最低转出金额与最高转出金额一致时，增加金额置灰
	$("#money_zgzcje").blur(function (){
		var minv=$("#money_zdzcje").val();
		var maxv=$("#money_zgzcje").val();
		if(parseInt(minv)==parseInt(maxv)){
			$("#money_zjje").attr("vl-disabled","true");
		}
	});
})