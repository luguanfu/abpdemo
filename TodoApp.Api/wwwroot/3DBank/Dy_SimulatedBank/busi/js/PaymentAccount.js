$(document).ready(function() {
	var paOption = $("#sle_zfxh");
	
	//内部控制快查
	$(".slectstyle .sousuo").on("click", function() {
		$.ajax({
			type: "GET",
			url: "stopPayment.json",
			success: function(e) {
				if(paOption.val() == "1") {
					$("#txt_jczftzsh").val(e[0].stopBook);
					$("#txt_jczftzdw").val(e[0].stopUnit)
				}
			}
		})
	})

})