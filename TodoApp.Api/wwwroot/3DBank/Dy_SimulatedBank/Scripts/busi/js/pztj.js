$(document).ready(function () {          
	$("#txt_zzhm").blur(function () {
        var num1=$("#txt_qshm").val();
		var num2=$("#txt_zzhm").val();
		 num1=num1.replace(/\b(0+)/gi, "");
		 num2=num2.replace(/\b(0+)/gi, "");
		var setNum =parseInt(num2)-parseInt(num1)+1;
		$("#txt_pzsl").val(setNum);
    });
	$.ajax({
		type: "POST",
             url: "/indexone/GetDepartUser",
             data: {subDeptid: '123'},
             dataType: "json",
             success: function(data){
				 var table = data.r;
				 var people =$("#sle_dfgy");
				 people.empty();
				 people.append("<option selected='selected'  value=0>对方柜员值含义..</option>");
				 for( var i=0;i<table.length;i++)
				 {
					 var item = table[i];
					 // var option=$("<option>").text(row[0].name).value(row[0].AccountNo);
					 // people.append(option);
					 people.append("<option  value=" + item.AccountNo + ">" + item.Name + "</option>");
				 }
			 }
	});
	// $.ajax({
             // type: "POST",
             // url: "/indexone/GetDepartUser",
             // data: {subDeptid: '123'},
             // dataType: "json",
             // success: function(data){
				 // var table = data.r;
				 // var people =$("#sle_dfgy");
				 // people.empty();
				 // people.append("<option selected='selected'  value=0>对方柜员值含义..</option>");
				 // for( var i=0;i<table.length;i++)
				 // {
					 // var item = table[i];
					 // // var option=$("<option>").text(row[0].name).value(row[0].AccountNo);
					 // // people.append(option);
					 // people.append("<option  value=" + item.AccountNo + ">" + item.Name + "</option>");
				 // }
         // });
})
