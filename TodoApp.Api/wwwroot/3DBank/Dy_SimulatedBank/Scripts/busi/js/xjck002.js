$(document).ready(function(){
	var cos = $('input[name="yw"]');
	
	cos.click(function(){
		if($(this).attr('vtitle') == '无'){
			$('#txt_czhm').attr('disabled','disabled');
			$('#txt_czye').attr('disabled','disabled');
		}else{
			$('#txt_czhm').removeAttr('disabled');
			$('#txt_czye').removeAttr('disabled');
		}
	})
})
