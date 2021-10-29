$(document).ready(function(){
	$("#sle_zy").off().change(function() {
		var zhuangtai = $("#sle_zy").val();
		if(zhuangtai==99||zhuangtai==35){
			$("#txt_zy").removeAttr("disabled");
			$("#txt_zy").removeAttr("vl-disabled");
			
		}
		else
		{
			$('#txt_zy').attr("vl-disabled","true");
			$('#txt_zy').attr("disabled","disabled");
		}
	});
})
