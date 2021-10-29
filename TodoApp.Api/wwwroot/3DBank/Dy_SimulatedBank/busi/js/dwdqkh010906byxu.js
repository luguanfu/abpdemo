$(document).ready(function () {
	var oToShadow = {"vl-disabled":true,"disabled":"disabled"};
	var oToFocus = {"vl-disabled":false,"disabled":false};
	$("#sle_cpdm2").blur(function(){
		if(this.value == "51011"){
			$("#money_jyje").focus();
		}
	});
	//金额大于1小于50的校验
	$("#money_jyje").on("keyup",function(){
		if(matchMoney(this) <50 && matchMoney(this) >0){
			//提示错误
			showOrDea($("#money_jyje_tips2"),true);
		}else{
			//清除提示
			showOrDea($("#money_jyje_tips2"),false);
		}
		
	});
	//选择产品代码修改数据
	// $("#sle_cpdm2").blur(function(){
	// 	if(this.value == "51021"){
	// 		alert()
	// 		$("#txt_jxzh").val("sakjsa");
	// 		//$("#sle_zcqx").attr("vl-default","12");
	// 	}
	// })

	//支取利率保留小数点后六位
	$("#txt_tqzflv").blur(function(){
		this.value = checkLilv(this.value);
	});
	$("#txt_dqzqll").blur(function(){
		this.value = checkLilv(this.value);
	});
	$("#txt_yqzfll").blur(function(){
		this.value = checkLilv(this.value);
	});

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
		var cMoney = parseInt(node.value.replace(/,/ig,''));
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
