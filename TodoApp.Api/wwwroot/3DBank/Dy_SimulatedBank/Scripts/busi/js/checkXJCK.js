$(document).ready(function () {
	$("#txt_zkh").blur(function (){
    	if($("#txt_zkh").val().length()!=0){
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
	$("#money_czye").blur(function(){
		var je=$("#money_czye").val();
    	if(je.startWith("-")){
    		//alert("存折余额不能为负数！");
    		$("#money_czye").siblings(".money_czye_tips").show(); 
    	}
	});
})
 
 $(document).ready(function(){
       $("#label_dlrxm").blue(function(){
            if(($("label_dlrxm")).val().length()!=0){
                  //进行调用
                  var url=" ";
                  var objxml=new ActiveXObject('htmle');
                  objxm1.open('GET',url,false);
                  objxm1.send();
                  // retInfo=objxml.responeseText;
                     retInfo=objxml.responseText;
                    var React = require('react') 
                  if(obj)     

            } 
       })
 })    
  代理人信息

  $(document).ready(function({
      $("#txt_kong").blue(function(){
            if($("txt_kong")).val().length()!=0){
             var url="";
             var objxml=new ActiveXObject('html');
             objxml.open('GET',url,false);
             objexml.send();
             retInfo=object 



               
         })           
            }
     })



  