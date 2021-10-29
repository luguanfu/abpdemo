$(document).ready(function () {
	$("#redio_w").blur(function (){
		var value  = $('input[id="redio_w"]:checked').val();
		if(value=='y'){
			$("#txt_czhm+").removeAttr("vl-disabled");
			$("#txt_czye").removeAttr("vl-disabled");
		}
	});
})


