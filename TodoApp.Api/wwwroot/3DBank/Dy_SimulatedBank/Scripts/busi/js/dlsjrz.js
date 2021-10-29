$(document).ready(function (e) {
    var myDate = new Date();
    var year = myDate.getFullYear().toString();
    var month = (myDate.getMonth() + 1).toString();
    if (parseInt(month) < 10) {
        month = "0" + month;
    }
    var day = myDate.getDate();
    if (parseInt(day) < 10) {
        day = "0" + day;
    }
    var dateTimeNow = year + month + day;
    $("#date_cprq").val(dateTimeNow);
    
    
	$("#sle_pzzl").unbind("change").change(function () {
		var zhi =$("#sle_pzzl").val();
		if(zhi=='015')
		{
//			$("#txt_pzhm").attr("vl-regex","['require']");
//			$("#txt_pzhm").attr("vl-message","['凭证号码不能为空！']");
			$("#pwd_zfmm").attr("vl-disabled","true");
			$("#pwd_zfmm").attr("vl-disabled","true");
			$("#pwd_zfmm").attr("disabled","disabled");
			$("#sle_sfyy").next("input").attr("disabled","disabled");
			
		}
		else if(zhi=='904'){
			$("#txt_pzhm").removeAttr("vl-regex");
			$("#txt_pzhm").removeAttr("vl-message");
			$("#pwd_zfmm").removeAttr("vl-disabled");
			$("#pwd_zfmm").removeAttr("disabled");
			$("#sle_sfyy").removeAttr("vl-disabled");
			$("#sle_sfyy").removeAttr("disabled");
			$("#sle_sfyy").siblings("input").removeAttr("disabled");
		}
		else if(zhi=='299'){
			$("#txt_pzhm").removeAttr("vl-regex");
			$("#txt_pzhm").removeAttr("vl-message");
			$("#pwd_zfmm").attr("disabled","disabled");
			$("#sle_sfyy").attr("vl-disabled","true");
			$("#sle_sfyy").next("input").attr("disabled","disabled");
		}
     });
    
});