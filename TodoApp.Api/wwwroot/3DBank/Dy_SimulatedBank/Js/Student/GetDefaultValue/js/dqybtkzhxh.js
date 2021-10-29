$(document).ready(function () {
	$("#txt_zjhm").blur(function(){
		var myselect=document.getElementById("sle_zjlx");
		var index=myselect.selectedIndex;
	    var v=myselect.options[index].value;
	    var num=$("#txt_zjhm").val();
	    check(v,num,"证件号码错误！");
	});
	$("#sle_dlrzjlx").blur(function(){
	    var myselect=document.getElementById("sle_dlrzjlx");
		var index=myselect.selectedIndex;
	    var v=myselect.options[index].value;
	    
	    if(v!=""){
	    	document.getElementById("txt_dlrzjhm").disabled=false;
	    	document.getElementById("txt_dlrxm").disabled=false;
	    	document.getElementById("txt_dlrlxfs").disabled=false;
	    }
	})
	function check(selvalue,txtvalue,mes){
		var result;
		if(selvalue==1||selvalue==2){
	    	result=txtvalue.match(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/);
	    }
	    else if(selvalue==3){
	    	result=txtvalue.match(/^[a-zA-Z0-9]{3,21}$/);
	    }
	    else if(selvalue==4||selvalue==6){
	    	result=txtvalue.match(/^[a-zA-Z0-9]{7,21}$/);
	    }
	    else if(selvalue==10||selvalue==11){
	    	result=txtvalue.match(/^[a-zA-Z0-9]{3,21}$/);
	    	if(result==0){
	    		result=txtvalue.match(/^(P\d{7})|(G\d{8})$/);
	    	}
	    }
	    else if(selvalue==13||selvalue==14||selvalue==15||selvalue==16||selvalue==17){
	    	result=txtvalue.match(/^[a-zA-Z0-9]{5,21}$/);
	    }
	    if(result==0){
	    	//alert(mes);
	    	$("#txt_zjhm").siblings(".txt_zjhm_tips").show();
	    }
	}
})