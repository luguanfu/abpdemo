$(document).ready(function () {
	var oToShadow = {"vl-disabled":true,"disabled":"disabled"};
	var oToFocus = {"vl-disabled":false,"disabled":false};

	//$("#txt_kh").nextAll("img.sousuo")[0].addEventListener("click",function(){
		//$("#txt_kh2").val($("#txt_kh2").value);
	//});
	//$("#btnsubmit")[0].addEventListener("click",function(){
		//$("#txt_kh2").val($("#txt_kh").val());
	//});
	


	//$("#fake_btnsubmit").hide();
	var fake_btnsubmit_html="<button type=\"button\" style=\"margin-right: 0px;\" id=\"fake_btnsubmit1\">提交（F6）</button>"; 
 		var btnsubmit=$("#btnsubmit");
      	btnsubmit.css("display","none");
        //将假提交按钮放到页面
        btnsubmit.before(fake_btnsubmit_html);
        
        $("#fake_btnsubmit1").click(function(){
        	var values11=$("#txt_kh").val();
//      	$("#txt_kh2").val(values11);
        	$("#fake_btnsubmit").click();
        })
	
	$("#sle_qxlx")[0].addEventListener("change",function(){
		if(this.value == "0"){
			notOptional($("#txt_zjdqr"));
		}else if(this.value == "1"){
			isOptional($("#txt_zjdqr"));
		}
	})
	$("#sle_fjlx11")[0].addEventListener("change",function(){
		if(this.value == "1"){
			notOptional($("#sle_sfbd"))
		}else if(this.value == "2"){
			isOptional($("#sle_sfbd"));
		}
	})
	//现转标志选择“转账”
	$("#sle_xzbz")[0].addEventListener("change",function(){
		if(this.value == "2"){
			isOptional($("#sle_zhlb"),$("#txt_zczkh"),$("#sle_zcpzzl"),$("#sle_sflm1"));
			isRequire($("#sle_zhlb"),"账户类别");
			isRequire($("#txt_zczkh"),"转出账/卡号");
			isRequire($("#sle_zcpzzl"),"转出凭证种类");
		}else if(this.value == "1"){
			noRequire($("#sle_zhlb"),$("#txt_zczkh"),$("#sle_zcpzzl"),$("#pwd_zqmm1"));
		}
	});
	//不置灰
	function isOptional(){
		for(var i in arguments){
			arguments[i].attr({"vl-disabled":false,"disabled":false}).nextAll("input").attr({"vl-disabled":false,"disabled":false});
		}
	}
	//置灰
	function notOptional(){
		for(var i in arguments){
			arguments[i].attr({"vl-disabled":true,"disabled":true}).nextAll("input").attr({"vl-disabled":true,"disabled":true});
		}
	}
	//获取金额
	function matchMoney(node){
		var cMoney = parseInt(node.value.replace(/,/ig,''));
		return cMoney;
	}
	//去掉必填属性
	function noRequire(){
		for(var i in arguments){
			arguments[i].removeAttr("vl-regex vl-message").nextAll("span").remove();
		}
	}
	//添加必填属性
	function isRequire(node,name){
		if(node.nextAll("span").length < 1){
			if(node.nextAll("img").length >= 1){
				node.attr({"vl-regex":"['require']","vl-message":"['"+name+"不能为空！']"}).nextAll("img").after("<span class='text-red redtip'>!</span>");
			}else{
				node.attr({"vl-regex":"['require']","vl-message":"['"+name+"不能为空！']"}).after("<span class='text-red redtip'>!</span>");
			}
		}
	}
})
