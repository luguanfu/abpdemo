$(document).ready(function(){
	
	$('#money_sfcs')[0].onchange=function(){

		var sfcs = $(this).val().split('.');

		if(parseInt(sfcs[1])>0){
			$(this).attr('vl-regex',"['integer', 'maxlength16']");
		}else{
			$(this).removeAttr('vl-regex');
		}
        var je = parseInt($('#money_sfcs').val().replace(',', ''));
        $('#money_hjsfje').val(je * 10 + '.00');
		/*if($('#sle_sfzl').val()== 'CARD0002'){
			var je = parseInt($('#money_sfcs').val().replace(',',''));
			$('#money_hjsfje').val(je * 10 + '.00');
		}else{
			$('#money_sfcs').val('0.00');
			$('#money_hjsfje').val('0.00');
		}*/
	}
})