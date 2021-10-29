
$(document).ready(function () {
	//$("#txt_pzhm").val("101210101");
	//$("#txt_zhmc").val("危菲舜");
	//$("#txt_jzzl").val("003-定期一本通");
	
	$("#txt_dlrxm").removeAttr("vl-regex");
	$("#txt_dlrzjlx").removeAttr("vl-regex");
	$("#txt_dlrlxfs").removeAttr("vl-regex");
	
	
	//事件委托
	$("#sle_czlx").closest("div").on("click",function(){
		var zhi =$("#sle_czlx").val();
		if(zhi==1)
		{
			$("#pwd_yzqmm").removeAttr("kuaicha");
			$("#pwd_yzqmm").next('img').removeAttr("vl-exec");
		}

	})

})
