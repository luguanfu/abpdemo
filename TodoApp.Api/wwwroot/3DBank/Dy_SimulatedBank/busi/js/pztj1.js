$(document).ready(function () {
	$("#sle_dfgy").siblings("input").focus(function (){
		var _that = $(this);
        var value = $(this).val();
        if (value != '') {
        	_that.parent().siblings(".tipsmsg").text('对方柜员不能为空！').hide();
        }
	});
	$("#txt_pzsl").blur(function(){
		var v=$("#txt_pzsl").val();
		if(v==NaN){
			$("#txt_pzsl").val(0);
		}
	});
})