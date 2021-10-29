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
    //$("#date_czrq").val(dateTimeNow);
	
	 $("#sle_jdbz").change(function () {
		 var selectedValue =$('#sle_czlx option:selected') .val();
		
		  if(selectedValue=="1")
		  {
			  $("#txt_bjhm").removeAttr("vl-regex");
			  $("#money_bjqje").removeAttr("vl-regex");
			  $("#money_bjhye").removeAttr("vl-regex");
			  $("#money_bjqytlx").removeAttr("vl-regex");
			  $("#money_bjhytlx").removeAttr("vl-regex");
			  $("#money_je1").removeAttr("vl-regex");
			  $("txt_bjpzhm").removeAttr("vl-regex");
			  $("pwd_zfmm").removeAttr("vl-regex");
			  $("#txt_bjzh").next("img").removeAttr("vl-exec");
			  $("#money_je1").next("img").removeAttr("vl-exec");
			  $("#txt_bjpzhm").next("img").removeAttr("vl-exec");
			  $("#txt_bzxx1").next("img").removeAttr("vl-exec");
			  
			  

			  

			  $("#txt_czzhmc").attr("vl-regex","['maxlength40']");
			  $("#txt_czpzhm").attr("vl-regex","['maxlength40']");
			  $("#money_czqye").attr("vl-regex","['maxlength16', 'notequal0']");
			  $("#money_czhye").attr("vl-regex","['maxlength16', 'notequal0']");
			  $("#money_czqytlx").attr("vl-regex","['maxlength16']");
			  $("#money_czhytlx").attr("vl-regex","['maxlength16']");
			  $("#money_je").attr("vl-regex","['decimal']");
			 
		  }
		  else if(selectedValue=="2")
		  {
			  $("#txt_bjhm").attr("vl-regex","['maxlength40']");
			  $("#money_bjqje").attr("vl-regex","['maxlength16', 'notequal0']");
			  $("#money_bjhye").attr("vl-regex","['maxlength16', 'notequal0']");
			  $("#money_bjqytlx").attr("vl-regex","['maxlength16']");
			  $("#money_bjhytlx").attr("vl-regex","['maxlength16']");
			  $("#money_je1").attr("vl-regex","['require', 'maxlength16', 'notequal0', 'number']");	
			  $("txt_bjpzhm").attr("vl-regex","['maxlength16']");
			  $("pwd_zfmm").attr("vl-regex","['minlength6', 'maxvalue6', 'number']");
			  
			  
			  $("#txt_czzhmc").removeAttr("vl-regex");
			  $("#txt_czpzhm").removeAttr("vl-regex");
			  $("#money_czqye").removeAttr("vl-regex");
			  $("#money_czhye").removeAttr("vl-regex");
			  $("#money_czqytlx").removeAttr("vl-regex");
			  $("#money_czhytlx").removeAttr("vl-regex");
			  $("#money_je").next("img").removeAttr("vl-exec");
			  $("#txt_czzh").next("img").removeAttr("vl-exec");
			  $("#txt_czpzhm").next("img").removeAttr("vl-exec");
		  }
     });
	
})
