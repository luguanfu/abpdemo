$(document).ready(function () {
	$("#money_zdye").val("1000");
	
	$("#txt_dzyx").removeAttr("vl-regex");
	$("#txt_yb").removeAttr("vl-regex");
	$("#txt_lxdz").removeAttr("vl-regex");

	$("#sle_zhlx")[0].addEventListener("change",function(){
		var zhi =$("#sle_zhlx").val();
		if(zhi==1){
			$("#sle_zyzjxz").attr("disabled","disabled");
			$("#sle_zyzjxz").attr("vl-disabled","true");
			$("#sle_zyzjxz").next('input').attr("disabled","disabled");
		}
		else{
			$("#sle_zyzjxz").removeAttr("disabled");
			$("#sle_zyzjxz").removeAttr("vl-disabled");
			$("#sle_zyzjxz").next('input').removeAttr("disabled");
		}
	});
	
	$("#sle_sfdz")[0].addEventListener("change",function(){
		var zhi =$("#sle_sfdz").val();
		
		if(zhi=='Y'){
			$("#txt_bdzyy").attr("disabled","disabled");
			$("#txt_bdzyy").removeAttr("vl-regex");
			$("#sle_dzqd").removeAttr("disabled");
			$("#sle_dzqd").removeAttr("vl-disabled");
			$("#sle_dzqd").next('input').removeAttr("disabled");

			
			$("#sle_dzzq").val("1");
			//$("#sle_dzzq option[value='1']").attr("selected", "selected");
			var values = $("#sle_dzzq").find("option:selected").text();
			$("#sle_dzzq").next("input").val(values);

		}
		else{
			$("#txt_bdzyy").removeAttr("disabled");
			$('#txt_bdzyy').attr('vl-regex',"['require']");
			$("#sle_dzqd").attr("disabled","disabled");
			$("#sle_dzqd").attr("vl-disabled","true");
			$("#sle_dzqd").next('input').attr("disabled","disabled");
			
			$("#sle_dzzq").val("");
			$("#sle_dzzq").next("input").val("");
			$("#sle_dzqd").val("");
			$("#sle_dzqd").next("input").val("");

		}
	});
})
