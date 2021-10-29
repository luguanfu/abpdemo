$(document).ready(function () {
    $("#txt_zxrelxfs").blur(function () {
        var phoneNum = $("#txt_zxrelxfs").val();
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!myreg.test(phoneNum)) {
           // alert("please enter right number!");
           $("#txt_zxrelxfs").siblings(".txt_zxrelxfs_tips").show(); 
        }
    });
    $("#txt_zxrylxfs").blur(function () {
        var phoneNum = $("#txt_zxrylxfs").val();
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!myreg.test(phoneNum)) {
           // alert("please enter right number!");
           $("#txt_zxrylxfs").siblings(".txt_zxrylxfs_tips").show(); 
        }
    });
    $("#money_djje").blur(function (){
    	var je=$("#money_djje").val();
    	if(je.startWith("-")){
    		//alert("冻结金额不能为负数！");
    		$("#money_djje").siblings(".money_djje_tips").show(); 
    	}
    });
    $("#txt_zxryzjhm").blur(function (){
    	if($("#txt_zxryzjhm").val().length()!=0){
    		//调用数据库验证是否正确
    		var url="";
    		var objxml=new ActiveXObject("Microsoft.XMLHttp") 
    		objxml.open("GET",url,false); 
    		objxml.send(); 
    		retInfo=objxml.responseText; 
    		if (objxml.status=="200"){
    			
    		}
    		else{
    			
    		}
    	}
    });
    $("#txt_zxryzjxm").blur(function (){
    	if($("#txt_zxryzjxm").val().length()!=0){
    		//调用数据库验证是否正确
    		var url="";
    		var objxml=new ActiveXObject("Microsoft.XMLHttp") 
    		objxml.open("GET",url,false); 
    		objxml.send(); 
    		retInfo=objxml.responseText; 
    		if (objxml.status=="200"){
    			
    		}
    		else{
    			
    		}
    	}
    });
    $("#txt_zxrezjhm").blur(function (){
    	if($("#txt_zxrezjhm").val().length()!=0){
    		//调用数据库验证是否正确
    		var url="";
    		var objxml=new ActiveXObject("Microsoft.XMLHttp") 
    		objxml.open("GET",url,false); 
    		objxml.send(); 
    		retInfo=objxml.responseText; 
    		if (objxml.status=="200"){
    			
    		}
    		else{
    			
    		}
    	}
    });
    $("#txt_zxrexm").blur(function (){
    	if($("#txt_zxrexm").val().length()!=0){
    		//调用数据库验证是否正确
    		var url="";
    		var objxml=new ActiveXObject("Microsoft.XMLHttp") 
    		objxml.open("GET",url,false); 
    		objxml.send(); 
    		retInfo=objxml.responseText; 
    		if (objxml.status=="200"){
    			
    		}
    		else{
    			
    		}
    	}
    });
})
  
 