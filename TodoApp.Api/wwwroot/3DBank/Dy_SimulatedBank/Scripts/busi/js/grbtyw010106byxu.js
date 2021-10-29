$(document).ready(function () {
	var oToShadow = {"vl-disabled":true,"disabled":"disabled"};
	var oToFocus = {"vl-disabled":false,"disabled":false};
	//判断支取金额大于5万时，提示
	$("#money_zqje").on("keyup",function(){
		var money = parseInt(this.value.replace(/,/ig,''));
		if(money >= 50000){
			$("#money_zqje_tips2").attr("style","display:block");
		}else{
			$("#money_zqje_tips2").attr("style","display:none");
		}
	});
	$("#money_zqje").blur(function(){
		$("#money_zqje_tips2").css('display','none')
	})
	//摘要置灰与恢复
	$("#sle_zy").unbind().change(function(){
		if(this.value == "99"){
			$("#txt_zy").attr("vl-disabled",false).removeAttr("disabled");
		}else{
			$("#txt_zy").attr({"vl-disabled":true,"disabled":"disabled"});
		}
	});
	$("#sle_xzbz")[0].addEventListener("change",function(){
		if(this.value == "1"){
			$("#sle_zhlb").attr(oToShadow).next("input").attr(oToShadow);
			$("#sle_ywkz1").attr(oToShadow).next("input").attr(oToShadow);
			$("#txt_zrzkh").attr(oToShadow);
			$("#sle_xh1").attr(oToShadow).next("input").attr(oToShadow);
			$("#txt_zrhm").attr(oToShadow);
			$("#sle_zrjzzl").attr(oToShadow).next("input").attr(oToShadow);
			$("#sle_zy2").attr(oToShadow).next("input").attr(oToShadow);
			$("#sle_zrzjlx").attr(oToShadow).next("input").attr(oToShadow);
			$("#txt_zrjzhm").attr(oToShadow);
			$("#txt_zrzjhm").attr(oToShadow);
		}else if(this.value == "2"){
			isOptional($("#sle_zhlb"));
			isRequire($("#sle_zhlb"),"账户类别");
			$("#sle_ywkz1").attr(oToFocus).next("input").attr(oToFocus);
			isOptional($("#txt_zrzkh"));
			isRequire($("#txt_zrzkh"),"转入账/卡号");
			isOptional($("#sle_xh1"));
			isRequire($("#sle_xh1"),"序号");
			$("#txt_zrhm").attr(oToFocus);
			$("#sle_zrjzzl").attr(oToFocus).next("input").attr(oToFocus);
			$("#sle_zy2").attr(oToFocus).next("input").attr(oToFocus);
			$("#sle_zrzjlx").attr(oToFocus).next("input").attr(oToFocus);
			$("#txt_zrjzhm").attr(oToFocus);
			$("#txt_zrzjhm").attr(oToFocus);
		}
	});
	$("#sle_zhlb").unbind().change(function(){
		if(this.value == "1"){
			//不能为空提示
			$("#sle_ywkz1").attr({"vl-regex":"['require']","vl-message":"['账户类型不能为空!']"});
			//$("#txt_zrzkh").attr({"vl-regex":"['require']","vl-message":"['账户类型不能为空!']"});
			$("#sle_xh1").attr({"vl-regex":"['require']","vl-message":"['账户类型不能为空!']"});
			//不能为空提示
			if($("#txt_zrzkh").val() == ""||$("#txt_zrzkh").val() == null){
				$("#txt_zrzkh_tips2").attr({"style":"display:block"});
				$("#txt_zrzkh_gth").attr({"style":"display:inline"});
			}
			//添加快查
			//addSousuo($("#sle_xh1").next(),"序号");
			//$("#txt_zrhm").after(nSousuo);
			//addSousuo($("#txt_zrhm"),"转入户名");
			//删除一个快查
			$("#txt_zrjzhm").next("img").remove();
			//置灰
			$("#sle_zrjzzl").attr(oToShadow).next("input").attr(oToShadow);
			$("#txt_zrjzhm").attr(oToShadow);
		}else{
			//不能为空提示
			$("#sle_ywkz1").attr({"vl-regex":"","vl-message":""}).next("input").next("span").remove();
			$("#sle_ywkz1_tips").attr("style","display:none");
			//$("#txt_zrzkh").attr({"vl-regex":"['require']","vl-message":"['账户类型不能为空!']"});
			$("#sle_xh1").attr({"vl-regex":"","vl-message":""}).next("input").nextAll("span").remove();
			$("#sle_xh1_tips").attr("style","display:none");
			$("#txt_zrzkh_tips2").attr({"style":"display:none"});
			$("#txt_zrzkh_gth").attr({"style":"display:none"});
			//删除快查
			$("#sle_xh1").nextAll("img").remove();
			$("#txt_zrhm").nextAll("img").remove();
			//增加快查
			//addSousuo($("#txt_zrjzhm"),"转入介质号码");
			//不置灰
			$("#sle_zrjzzl").attr(oToFocus).next("input").attr(oToFocus);
			$("#txt_zrjzhm").attr(oToFocus);
		}
	})
	$("#txt_zrzkh").on("keyup",function(){
		if($("#sle_xh1").val() != ""||$("#sle_xh1").val() != null){
			$("#txt_zrzkh_tips2").attr({"style":"display:none"});
			$("#txt_zrzkh_gth").attr({"style":"display:none"});
		}
	})
    function addSousuo(node, name) {
        var nSousuo = `<img class='sousuo' src='/busi/img/banksousuo.png' vl-exec='false' vl-message='["${name}查询未执行！"]'>`;
        
		if(node.nextAll("img").length<=0){
			node.after(nSousuo);
		}
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
})
