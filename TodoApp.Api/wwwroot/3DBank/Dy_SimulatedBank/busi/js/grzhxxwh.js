$(document).ready(function () {
    $("#money_dbxe").blur(function () {
		var money=$("#money_dbxe").val();
		if(money=="0.00"||money=="0"){
			//alert("该账户单笔限额为零,不能发生借记业务,请确认!");
			$("#money_dbxe").html("该账户单笔限额为零,不能发生借记业务,请确认!").show();
		}
		
        // var phoneNum = $("#txt_manager_phone").val();
        // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        // if (!myreg.test(phoneNum)) {
            // alert("please enter right number!");
        // }
    });


	$("#sle_sfwhfgmye").unbind("change").change(function () {
		var sle_sfwhfgmye =$("#sle_sfwhfgmye").val();
		if (sle_sfwhfgmye=="N") {
			$('#money_je').attr("disabled","disabled");
			$('#money_je2').attr("disabled","disabled");
			$('#txt_bs').attr("disabled","disabled");
			$('#txt_bs1').attr("disabled","disabled");
			$("#sle_jfrxewh").empty();
			$("#in_class1").append("<option  value=" + "10" + ">" + "N - 否" + "</option>");
//			$('#sle_jfrxewh').attr("vl-default","N - 否");
	//$("#sle_jfrxewh").val("N");
		}
		else{
			$("#money_je").removeAttr("disabled");
			$("#money_je2").removeAttr("disabled");
			$("#txt_bs").removeAttr("disabled");
			$("#txt_bs1").removeAttr("disabled");
		}
     });


})
