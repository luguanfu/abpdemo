var  is_confirm=false;
$(document).ready(function () {
	$("#txt_zzhm").blur(function () {
        var num1=$("#txt_qshm").val();
		var num2=$("#txt_zzhm").val();
		 num1=num1.replace(/\b(0+)/gi, "");
		 num2=num2.replace(/\b(0+)/gi, "");
		 var first = num1.substr(0,12);
		 var second = num2.substr(0,12);
		 if(first!=second&&is_confirm==false){
		 	layer.alert("起始号码或者终止号码格式不符!");
		 	is_confirm=true
		 }
		 else{
			 var num3=num1.substring(12);
			 var num4=num2.substring(12);
			 if(num3<=num4){
			 	var setNum =parseInt(num4)-parseInt(num3)+1;
			 	$("#txt_pzsl").val(setNum);
			 }else{
			 	layer.alert("终止号码必须大于终止号码");
			 	is_confirm=true;
			 }
			 
		}
    });
    
    $("#txt_zzhm").change(function(){
    	is_confirm=false;
    });
    
})
