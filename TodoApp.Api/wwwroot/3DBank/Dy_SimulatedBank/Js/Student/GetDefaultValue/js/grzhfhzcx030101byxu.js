$(document).ready(function () {
	//$("#sle_xh").next("input").after("<img class='sousuo' vl-exec='false' src='http://120.24.172.198:1203/bankingsystem/kaihu/banksousuo.png'> ");
	//var aa = $("#sle_xh").nextAll("img");
	$("#sle_ywlx")[0].addEventListener("change",function(){
		if(this.value == "2"){
			noRequire($("#pwd_zqmm2"));
			notOptional($("#pwd_zqmm"),$("#pwd_zqmm2"));
			$("#pwd_zqmm,#pwd_zqmm2,#txt_zjhm").nextAll("img").remove();
		}else{
			isRequire($("#pwd_zqmm2"));
			isOptional($("#pwd_zqmm"),$("#pwd_zqmm2"));
			addSousuo($("#pwd_zqmm"),"查询密码");
			addSousuo($("#pwd_zqmm2"),"支取密码");
			addSousuo($("#txt_zjhm"),"证件号码");
		}
	})
	$("#btnsubmit").click(function(){
		$("#sle_xh").nextAll("img").click();
	})
	$("#sle_xh").nextAll("img").hide();
	//去掉必填属性
	function noRequire(){
		for(var i in arguments){
			arguments[i].removeAttr("vl-regex vl-message").nextAll("span").remove();
		}
	}
	//添加必填属性
	function isRequire(){
		for(var i in arguments){
			if(!arguments[i].nextAll("span")){
				arguments[i].attr({"vl-regex":"['require']","vl-message":"['证件类型不能为空！']"}).after("<span class='text-red redtip'>!</span>");
			}
		}
	}
	//置灰
	function isOptional(){
		for(var i in arguments){
			arguments[i].attr({"vl-disabled":false,"disabled":false}).nextAll("input").attr({"vl-disabled":false,"disabled":false});
		}
	}
	//不置灰
	function notOptional(){
		for(var i in arguments){
			arguments[i].attr({"vl-disabled":true,"disabled":true}).nextAll("input").attr({"vl-disabled":true,"disabled":true});
		}
	}
	//去掉必填属性
	function noRequire(){
		for(var i in arguments){
			arguments[i].removeAttr("vl-regex vl-message").nextAll("span").remove();
		}
	}
	//添加必填属性
	function isRequire(){
		for(var i in arguments){
			arguments[i].attr({"vl-regex":"['require']","vl-message":"['证件类型不能为空！']"}).after("<span class='text-red redtip'>!</span>");
		}
	}
	//添加快查
	function addSousuo(node,name){
		var nSousuo = "<img class='sousuo' src='http://120.24.172.198:1203/bankingsystem/kaihu/banksousuo.png' vl-exec='false' vl-message='['"+name+"查询未执行！']'>";
		if(node.nextAll("img").length<=0){
			node.after(nSousuo);
		}
	}
})
