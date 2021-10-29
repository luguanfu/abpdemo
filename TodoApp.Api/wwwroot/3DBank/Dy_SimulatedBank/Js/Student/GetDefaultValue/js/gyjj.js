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
    $("#date_jjrq").val(dateTimeNow);
	
	$.ajax({
             type: "POST",
             url: "/indexone/GetDepartUser",
             data: {subDeptid: '123'},
             dataType: "json",
             success: function(data){
				 var table = data.r;
				 var people =$("#sle_jjgy");
				 people.empty();
				 people.append("<option selected='selected'  value=0>�Է���Աֵ����..</option>");
				 for( var i=0;i<table.length;i++)
				 {
					 var item = table[i];
					 people.append("<option  value=" + item.AccountNo + ">" + item.Name + "</option>");
				 }
         });
})
