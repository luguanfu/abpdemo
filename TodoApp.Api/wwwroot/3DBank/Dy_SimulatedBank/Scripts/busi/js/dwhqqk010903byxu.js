$(document).ready(function () {
	$("#sle_xzbz")[0].addEventListener("change",function(){
		if(this.value == "1"){
			noRequire($("#txt_zrzkh"));
			notOptional($("#sle_zhhulb"),$("#sle_ywkaz"),$("#txt_zrzkh"),$("#sle_xh1"));
		}else if(this.value == "2"){
			isRequire($("#txt_zrzkh"));
			isOptional($("#sle_zhhulb"),$("#sle_ywkaz"),$("#txt_zrzkh"),$("#sle_xh1"));
		}
	})
	//去掉必填属性
	function noRequire(){
		for(var i in arguments){
			arguments[i].removeAttr("vl-regex vl-message").nextAll("span").remove();
		}
	}
	//添加必填属性
	function isRequire(){
		for(var i in arguments){
			if(arguments[i].nextAll("span").length < 1){
				if(arguments[i].nextAll("img").length >= 1){
					arguments[i].attr({"vl-regex":"['require']","vl-message":"['证件类型不能为空！']"}).nextAll("img").after("<span class='text-red redtip'>!</span>");
				}else{
					arguments[i].attr({"vl-regex":"['require']","vl-message":"['证件类型不能为空！']"}).after("<span class='text-red redtip'>!</span>");
				}
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
