$(document).ready(function () {
	//起始日期和终止日期赋当前日期
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
    $("#txt_qsrq").val(dateTimeNow);
    $("#txt_zzrq").val(dateTimeNow);
})