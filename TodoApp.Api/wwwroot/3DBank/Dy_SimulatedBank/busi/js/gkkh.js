$(document).ready(function () {
	$("#txt_zjhm").blur(function(){
		var myselect=document.getElementById("sle_zjlx");
		var index=myselect.selectedIndex;
	    var v=myselect.options[index].value;
	    var num=$("#txt_zjhm").val();
	    check(v,num,"证件号码错误！","");
	});
	$("#txt_zjhm1").blur(function(){
		var myselect=document.getElementById("sle_zjlx1");
		var index=myselect.selectedIndex;
	    var v=myselect.options[index].value;
	    var num=$("#txt_zjhm1").val();
	    check(v,num,"证件号码错误！");
	});
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
	$("#pwd_dlmm").blur(function(){
		var qkmm=$("#pwd_qkmm").val();
		var dlmm=$("#pwd_dlmm").val();
		var jymm=$("#pwd_jymm").val();
		if(qkmm.length!=0&&dlmm.length!=0){
			if(qkmm==dlmm){
				//alert("登录密码不允许和取款密码一致！");
				$("#pwd_dlmm_tips").html("登录密码不允许和取款密码一致！").show();
			}
		}
		if(dlmm.length!=0&&jymm.length!=0){
			if(dlmm==jymm){
				//alert("登录密码不允许和交易密码一致！")
				$("#pwd_dlmm_tips").html("登录密码不允许和交易密码一致！").show();
			}
		}
	});
	$("#pwd_qkmm").blur(function(){
		var qkmm=$("#pwd_qkmm").val();
		var dlmm=$("#pwd_dlmm").val();
		var jymm=$("#pwd_jymm").val();
		if(qkmm.length!=0&&dlmm.length!=0){
			if(qkmm==dlmm){
				//alert("登录密码不允许和取款密码一致！");
				$("#pwd_qkmm_tips").html("登录密码不允许和取款密码一致！").show();
			}
		}
		if(qkmm.length!=0&&jymm.length!=0){
			if(qkmm==jymm){
				//alert("取款密码不允许和交易密码一致！");
				$("#pwd_qkmm_tips").html("取款密码不允许和交易密码一致！").show();
			}
		}
	});
	$("#pwd_jymm").blur(function(){
		var qkmm=$("#pwd_qkmm").val();
		var dlmm=$("#pwd_dlmm").val();
		var jymm=$("#pwd_jymm").val();
		if(dlmm.length!=0&&jymm.length!=0){
			if(dlmm==jymm){
				//alert("登录密码不允许和交易密码一致！");
				$("#pwd_jymm_tips").html("登录密码不允许和交易密码一致！").show();
			}
		}
		if(qkmm.length!=0&&jymm.length!=0){
			if(qkmm==jymm){
				//alert("取款密码不允许和交易密码一致！");
				$("#pwd_jymm_tips").html("取款密码不允许和交易密码一致！").show();
			}
		}
	});
	$("#pwd_qrdlmm").blur(function(){
		var dlmm=$("#pwd_dlmm").val();
		var qrdlmm=$("#pwd_qrdlmm").val();
		if(dlmm.length!=0&&qrdlmm.length!=0){
			if(qrdlmm!=dlmm){
				//alert("确认登录密码要和登录密码一致！");
				$("#pwd_qrdlmm_tips").html("确认登录密码要和登录密码一致！").show();
			}
		}
	});
})