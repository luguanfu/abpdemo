$(document).ready(function () {
	$("#sle_ydjxh").unbind("change").change(function () {
		var zhuangtai =$("#sle_ydjxh").val();
		if (zhuangtai==34||zhuangtai==35) {
			$('#money_djje').attr("vl-disabled","true");
 			$('#money_djje').attr("disabled","disabled");
 			$('#money_djje').removeAttr("vl-regex");
 			$('#money_djje').removeAttr("vl-message");
		}
		else{
			$('#money_djje').removeAttr("vl-disabled");
 			$('#money_djje').removeAttr("disabled");
 			$('#money_djje').attr("vl-regex","['require','maxlength16', 'notequal0', 'decimal']");
 			$('#money_djje').attr("vl-message","['冻结金额不能为空!','冻结金额长度超过最大长度:[16]!','冻结金额应大于0!','冻结金额输入错误!']");
		}
     });


})
