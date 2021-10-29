$(document).ready(function () {
	$("#sle_cxlx")[0].addEventListener("change",function(){
		if(this.value == "2"){
			notRequire($("#sle_hnkcxjy"));
			isRequire($("#sle_khkcxjy"),"跨行可撤销交易");
			isOptional($("#sle_khkcxjy"));
		}else if(this.value == "1"){
			isRequire($("#sle_hnkcxjy"),"行内可撤销交易");
			notRequire($("#sle_khkcxjy"));
			notOptional($("#sle_khkcxjy"));
		}
	})
		
	//清空选中框内容
	function isEmpty(){
		for(var i in arguments){
			arguments[i].val("");
		}
	}
	//去掉必填属性
	function notRequire(){
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
