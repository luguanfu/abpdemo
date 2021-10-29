$(document).ready(function () {
	$("#sle_cxlx").blur(function(){
		var myselect=document.getElementById("sle_cxlx");
    	var index=myselect.selectedIndex;
    	var v=myselect.options[index].value;
    	if(v=='1'){
    		document.getElementById("sle_khkcxjy").disabled=true;
    	}
	});
	$("#pwd_zqmm").blur(function(){
		var zqmm=$("#pwd_zqmm").val();
		if(zqmm.length<6){
			//alert("支取密码长度：[6]!");
			$("#pwd_zqmm").siblings(".pwd_zqmm_tips").show();
		}
	})
})