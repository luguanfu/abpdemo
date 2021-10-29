$(document).ready(function () {
	var cantchange = false;
	document.addEventListener("click",function(){
		if(!!cantchange){
			$("#sle_sfzdxy").nextAll("input").val("N - 否");
			notOptional($("#sle_sfzdxy"));
		}
	},false);
	$("#sle_jbrzjlx").nextAll("img.sousuo")[0].addEventListener("click",function(){
		if($("#sle_jbrzjlx").val() != null){
			$("#sle_sfzdxy").find("option[value=N]").attr("selected","selected");
			$("#sle_sfzdxy").nextAll("input").val("N - 否");
			notOptional($("#sle_sfzdxy"));
			cantchange = true;
		}
	})
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
