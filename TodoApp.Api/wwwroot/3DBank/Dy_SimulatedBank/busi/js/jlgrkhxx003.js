$(document).ready(function () {
//	$("#sle_zjlx").unbind("change").change(function () {
//		var values =$("#sle_zjlx").val();
//		if (values=='22') {
//			$("#txt_qtzj").removeAttr("disabled");
//			$("#txt_qtzj").removeAttr("vl-disabled");
//			$("#txt_qtzj").removeAttr("vl-regex");
//			$("#txt_qtzj").removeAttr("vl-message");
//		}
//		else
//		{
//			$("#txt_qtzj").attr("disabled","disabled");
//			$("#txt_qtzj").attr("vl-disabled","true");
//		}
//		
//   });
	$("#sle_yxqlx").unbind("change").change(function () {
		var zhuangtai =$("#sle_yxqlx").val();
		if(zhuangtai==1)
		{
			$('#date_zjdqr').removeAttr("vl-disabled");
			$('#date_zjdqr').removeAttr("disabled");
			//date_zjdqr
		}
		else
		{
			$('#date_zjdqr').attr("vl-disabled","true");
			$('#date_zjdqr').attr("disabled","disabled");
		}
     });
})