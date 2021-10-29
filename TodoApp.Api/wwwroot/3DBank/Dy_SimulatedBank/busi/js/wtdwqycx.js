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
	$("#date_end").val(dateTimeNow);
	var startdate=$("#date_start").val();
	var enddate=$("#date_end").val();
	$("#date_stop").blur(function (){
		if(startdate.length!=0&&enddate.length!=0){
			if(parseInt(enddate)<parseInt(startdate)){
				//alert("终止日期不能早于起始日期！");
				$("#date_end").val(dateTimeNow);
				$("#date_end").focus();
				$("#date_stop_tips").html("终止日期不能早于起始日期！").show();
			}
		}
	});
	$("#date_start").blur(function (){
		if(startdate.length!=0&&enddate.length!=0){
			if(parseInt(startdate)>parseInt(enddate)){
				//alert("起始日期不能晚于终止日期！");
				$("#date_start").val(dateTimeNow);
				$("#date_start").focus();
				$("#date_start_tips").html("起始日期不能晚于终止日期！").show();
			}
		}
	});
})