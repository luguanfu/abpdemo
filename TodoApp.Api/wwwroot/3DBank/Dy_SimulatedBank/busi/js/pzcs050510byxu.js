$(document).ready(function () {
	var oToShadow = {"vl-disabled":true,"disabled":"disabled"};
	var oToFocus = {"vl-disabled":false,"disabled":false};
	//置灰
	$("#sle_csfs").change(function(){
		if(this.value == "0"){
			$("#txt_pzsl").attr(oToShadow);
		}else{
			$("#txt_pzsl").attr(oToFocus);
		}
	})
})
