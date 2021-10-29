$(document).ready(function () {
	$("#money_jyje").blur(function(){
		//交易金额低于五万，经办人身份信息为非必填
		if(matchMoney(this) < 50000){
			noRequire($("#sle_zjlx"),$("#txt_zjhm"),$("#txt_zjxm"),$("#txt_fzjg"));
		}
		else{
			isRequire($("#sle_zjlx"),$("#txt_zjhm"),$("#txt_zjxm"),$("#txt_fzjg"));
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
			arguments[i].attr({"vl-regex":"['require']","vl-message":"['证件类型不能为空！']"}).after("<span class='text-red redtip'>!</span>");
		}
	}
	//保留小数点后六位,四舍五入
	function checkLilv(str){
		var index = str.indexOf(".");
		if(index > -1){
			return decimal(parseFloat(str),6);
		}else if(index == -1){
			return str+".000000";
		}
		function decimal(num,v){
			var vv = Math.pow(10,v);
			return Math.round(num*vv)/vv;
		}
	}
	//获取金额
	function matchMoney(node){
		var cMoney = parseFloat(node.value.replace(/,/ig,''));
		return cMoney;
	}
	//显示与消失;显示true 消失false
	function showOrDea(node,boolean){
		if(boolean){
			node.attr("style","display:block");
		}else{
			node.attr("style","display:none");
		}
	}
	//添加快查
	function addSousuo(node,name){
		var nSousuo = "<img class='sousuo' src='/busi/img/banksousuo.png' vl-exec='false' vl-message='['"+name+"查询未执行！']'>";
		if(node.nextAll("img").length<=0){
			node.after(nSousuo);
		}
	}
})
