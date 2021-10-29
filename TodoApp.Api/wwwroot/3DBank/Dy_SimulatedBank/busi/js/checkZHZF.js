$(document).ready(function () {
    $("#txt_account_card").blur(function () {
    	if($("#txt_account_card").val().length()!=0){
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
    $("#txt_numberofdoc").blur(function (){
    	if($("#txt_numberofdoc").val().length()!=0){
    		var myselect=document.getElementById("sle_typeofdoc");
    		var index=myselect.selectedIndex;
    	    var v=myselect.options[index].value;
    	    var num=$("#txt_numberofdoc").val();
    	    var result;
    	    if(v==1||v==2){
    	    	result=num.match(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/);
    	    }
    	    else if(v==3){
    	    	result=num.match(/^[a-zA-Z0-9]{3,21}$/);
    	    }
    	    else if(v==4||v==6){
    	    	result=num.match(/^[a-zA-Z0-9]{7,21}$/);
    	    }
    	    else if(v==10||v==11){
    	    	result=num.match(/^[a-zA-Z0-9]{3,21}$/);
    	    	if(result==0){
    	    		result=num.match(/^(P\d{7})|(G\d{8})$/);
    	    	}
    	    }
    	    else if(v==13||v==14||v==15||v==16||v==17){
    	    	result=num.match(/^[a-zA-Z0-9]{5,21}$/);
    	    }
    	    if(result==0){
    	    	//alert("经办人证件号码错误！");
    	    	$("#txt_numberofdoc").siblings(".txt_numberofdoc_tips").show();
    	    }
    	}
    });
    
})

$(document).ready(function(){
      $("#txt_account_cart").blue(function(){
         if($("#txt_accunt").val().length()!=0){
            //调用数据库验证是不是正确
            var url=" ";
            var objxml=new ActiveXObject('Microsoft.XMLHttp')
            object.send();
            retInfo=objxml.responseText;
                    
         }
      })
}) 

 $(document).ready(function(){
       $("#txt_stop_number_tips").blue(){
           if($("txt_stop_number_tips").val().length()!=-1){
               
           } 
       }
 })