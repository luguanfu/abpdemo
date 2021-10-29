$(document).ready(function () {
	//法人证件号码检验正确性
	$("#txt_frfzrzjhm").blur(function (){
    	if($("#txt_frfzrzjhm").val().length()!=0){
    		var myselect=document.getElementById("sle_frfzrzjlx");
    		var index=myselect.selectedIndex;
    	    var v=myselect.options[index].value;
    	    var num=$("#txt_frfzrzjhm").val();
    	    check(v,num,"法人/负责人证件号码错误！","#txt_frfzrzjhm");
    	}
    });
	//检查电子邮箱是否正确
	$("#txt_dzyx").blur(function (){
		var v=$("#txt_dzyx").val();
		var r=v.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
		if(r==null){
			//alert("电子邮箱格式错误！");
			$("#txt_dzyx").siblings(".txt_dzyx_tips").show();
		}
	});
	//检查财务移动电话是否正确
	$("#txt_cwyddh").blur(function (){
		var regu = /^[1][0-9][0-9]{9}$/;
		var re = new RegExp(regu);
		var v=$("#txt_cwyddh").val();
		if (!re.test(v)) {
			//alert("财务移动电话错误！");
			$("#txt_cwyddh").siblings(".txt_cwyddh_tips").show();
		}
	});
	//检查证件号码是否正确
	$("#txt_zjhm2").blur(function (){
		var myselect=document.getElementById("sle_cwryzjlx");
		var index=myselect.selectedIndex;
	    var v=myselect.options[index].value;
	    var num=$("#txt_zjhm3").val();
	    check(v,num,"证件号码错误！","#txt_zjhm2");
	});
	function check(selvalue,txtvalue,mes,obj){
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
	    	if(obj=="#txt_frfzrzjhm"){
	    		$("#txt_frfzrzjhm").siblings(".txt_frfzrzjhm_tips").show();
	    	}
	    	else{
	    		$("#txt_zjhm2").siblings(".txt_zjhm2_tips").show();
	    	}
	    }
	}
})