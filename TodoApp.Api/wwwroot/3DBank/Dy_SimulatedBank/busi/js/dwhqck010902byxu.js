$(document).ready(function () {
	$("#sle_zy")[0].addEventListener("change",function(){
		if(this.value != "99"){
			$("#txt_zy").val("").attr({"vl-disabled":true,"disabled":true});
		}
	})
	$("#money_jyje").change(function(){
		var cMoney = this.value.replace(/,/ig,'');
		var yMoney = $("#money_ye")[0].value.replace(/,/ig,'');
		//alert(parseInt(cMoney)+parseInt(yMoney));
		if(parseInt(cMoney) + parseInt(yMoney) >= 200000){
			layer.alert("交易提醒\n累计存款超过200000，请核对证件！");
			$("#sle_zjlx").attr({"vl-regex":"['require']","vl-message":"['证件类型不能为空！']"});
			showRed($("#sle_zjlx_red"),true);
		}else if(parseInt(cMoney) + parseInt(yMoney) < 200000){
			$("#sle_zjlx").removeAttr("vl-regex").removeAttr("vl-message");
			showRed($("#sle_zjlx_red"),false)
			//$("#sle_zjlx").attr({"vl-regex":"","vl-message":""});
		}
	});
	//显示感叹号
	function showRed(node,boo){
		if(boo&&node.siblings("span").length<=1){
			node.attr("style","display:inline");
		}else if(!boo){
			node.attr("style","display:none");
		}
	}
})
