$(document).ready(function () {
	
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
    $("#txt_cprq").val(dateTimeNow);
	
	$("#sle_aazclx").change(function () {
        // alert("444");
		var values=$("#sle_aazclx").val();
		if(values=="0"||values=="2")
		{
			$("#txt_lxzrzh").attr("disabled","disabled");
		}
		else if(values=="1")
		{
			$("#txt_lxzrzh").removeAttr("disabled");
		}
    });
	
})
