	var oEntry;
	var eEntry;
$(document).ready(function() {

	$("#txt_qshm").blur(function() {
		
		if($(this).val().length >=16) {
			oEntry = $(this).val().slice(10, 20)
			console.log(oEntry)
			
		}else {			
			console.log($(this).val())
			oEntry = $(this).val();
		}
		quantity()
	});

	$("#txt_zzhm").blur(function() {
		if($(this).val().length >= 16) {
			eEntry = $(this).val().slice(10, 20)
			
		}else {
			eEntry = $(this).val();
		}
		quantity()
	})
})


function quantity() {
	var count = 0;
	if($("#txt_zzhm").val() && $("#txt_qshm").val()) {
		count = parseInt(eEntry - oEntry) + 1;
	}

	if(parseInt($("#txt_qshm").val()) > parseInt($("#txt_zzhm").val())) {
		$("#txt_pzsl").val(0);
	} else {
		$("#txt_pzsl").val(count);
	}
}