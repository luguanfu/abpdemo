$(document).ready(function () {
	$("#sle_czlx").unbind("change").change(function () {
		var zhuangtai =$("#sle_czlx").val();
		if (zhuangtai==2) {
//			alert("888");
			$('#pwd_ycxmm').removeAttr("vl-disabled");
			$('#pwd_ycxmm').removeAttr("disabled");
			$('#pwd_ycxmm').attr("kuaicha","true");
			$('#pwd_ycxmm').attr("vl-regex","['require', 'minlength6', 'maxlength6', 'number']");
			$("#pwd_ycxmm").next("img").attr("vl-regex","false");
			$('#pwd_ycxmm').attr("vl-message","['原查询密码不能为空！','原查询密码长度为:[6]！','原查询密码长度为:[6]！','']");
			
			//kuaicha="true"
			//vl-regex="['require', 'minlength6', 'maxlength6', 'number']" 
			//vl-exec="false"
			//vl-message="['原查询密码不能为空！','原查询密码长度为:[6]！','原查询密码长度为:[6]！','']"
		}
		else{
//			alert('999');
			$('#pwd_ycxmm').attr("vl-disabled","true");
			$('#pwd_ycxmm').attr("disabled","disabled");
			$('#pwd_ycxmm').removeAttr("kuaicha");
			$('#pwd_ycxmm').removeAttr("vl-regex");
			$('#pwd_ycxmm').removeAttr("vl-message");
			$("#pwd_ycxmm").next("img").removeAttr("vl-regex","false");
		}
     });


})
