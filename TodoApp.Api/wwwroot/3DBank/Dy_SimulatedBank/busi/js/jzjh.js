$(document).ready(function(){
	$('#sle_sfycxmm').unbind('change').change(function(){
		
		if($('#sle_sfycxmm').val() == 'Y'){
			$('#pwd_cxmm').removeAttr("vl-disabled");
			$('#pwd_cxmm').removeAttr("disabled");
		}else{
			$('#pwd_cxmm').attr("vl-disabled","true");
			$('#pwd_cxmm').attr("disabled","disabled");
		}
	})
})
