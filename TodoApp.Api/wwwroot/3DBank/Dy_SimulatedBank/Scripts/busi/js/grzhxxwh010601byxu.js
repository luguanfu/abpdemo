$(document).ready(function () {
	//事件委托
	$("#money_dbxe").nextAll("img")[0].addEventListener("click",function(){
		if(parseInt($("#money_dbxe")[0].value) == "0"){
			alert("该账户单笔限额为零，不能发生借记业务，请确认！");
		}
	})
	$(document).on("keyup",$("#money_rljxe"),function(){
		//日累计限额小于单笔限额时
		if(matchMoney($("#money_rljxe")[0]) < matchMoney($("#money_dbxe")[0])){
			showOrDea($("#money_rljxe_tips2"),true);
		}else{
			showOrDea($("#money_rljxe_tips2"),false);
		}
	});
	$(document).on("keyup",$("#money_je2"),function(){
		
		if(matchMoney($("#money_je2")[0]) < matchMoney($("#money_je")[0])){
			showOrDea($("#money_je2_tips2"),true);
		}else{
			showOrDea($("#money_je2_tips2"),false);
		}
	});
	// $("#money_je").bind("change",function(){
		
	// 	if(matchMoney($("#money_je2")[0]) < matchMoney($("#money_je")[0])){
	// 		showOrDea($("#money_je2_tips2"),true);
	// 	}else{
	// 		showOrDea($("#money_je2_tips2"),false);
	// 	}
	// });
	//显示与消失;显示true 消失false
	function showOrDea(node,boolean){
		if(boolean){
			node.attr("style","display:block");
		}else{
			node.attr("style","display:none");
		}
	}
	//获取金额
	function matchMoney(node){
		var cMoney = parseInt(node.value.replace(/,/ig,''));
		return cMoney;
	}
	// $("#money_dbxe").nextAll("img").click(function(){
	// 	alert(222222222)
	// })
})
