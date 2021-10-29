$(document).ready(function(){
	$('#pwd_zqmm').blur(function(){
		
		var ye = parseInt($('#money_ye').val().replace(',',''));
		if(ye>50000){
			$('#sle_zjlx').attr('vl-regex',"['require']").focus();
		}else{
			$('#sle_zjlx').removeAttr('vl-regex');
		}
	})
})
