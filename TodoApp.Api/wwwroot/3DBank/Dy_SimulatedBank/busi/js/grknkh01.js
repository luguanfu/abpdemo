$(document).ready(function () {	
	$("#money_zye").val("12121212");
	$("#sle_dlrzjlx").removeAttr("vl-regex");
	$("#txt_dlrzjhm").removeAttr("vl-regex");
	$("#txt_dlrxm").removeAttr("vl-regex");
	$("#txt_dlrlxfs").removeAttr("vl-regex");
		
	$("#pwd_zqmm").next("img").removeAttr("vl-exec");
	$("#txt_zczkh").removeAttr("vl-regex");
	$("#txt_zczkh").next("img").removeAttr("vl-exec");
	$(txt_zjhm1).next("img").removeAttr("vl-exec");	
	
	
	//$("#fake_btnsubmit").hide();
	var fake_btnsubmit_html="<button type=\"button\" style=\"margin-right: 0px;\" id=\"fake_btnsubmit1\">提交（F6）</button>"; 
 		var btnsubmit=$("#btnsubmit");
      	btnsubmit.css("display","none");
        //将假提交按钮放到页面
        btnsubmit.before(fake_btnsubmit_html);
        
        $("#fake_btnsubmit1").click(function(){
        	var values11=$("#txt_kh").val();
        	//$("#txt_kh1").val(values11);
        	$("#fake_btnsubmit").click();
        })
    //$("#txt_zhmc").val("危菲舜");
    //$("#txt_pzhm").val("12121241421");
	//$("#txt_jzhm").val("12121212");
	
	
	$('select').find('option').eq(1).attr("selected","selected");
	$('#sle_jzzl1').find('option').eq(5).attr("selected","selected");

	$("#sle_zclx").change(function(){
		if($(this).val() == 1) {
			$("#txt_lxzrzkh").removeAttr("disabled");
			$("#txt_lxzrhm").removeAttr("disabled");
		}else {
			$("#txt_lxzrzkh").attr("disabled","disabled");
			$("#txt_lxzrhm").attr("disabled","disabled");
		}
	})
})