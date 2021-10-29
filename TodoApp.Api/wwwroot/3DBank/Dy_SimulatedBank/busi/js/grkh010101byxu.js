$(document).ready(function () {
	$("#sle_cxmm")[0].addEventListener("change",function(){
		if(this.value == "N"){
			notOptional($("#pwd_cxmm"),$("#sle_sflm"));
		}else if(this.value == "Y"){
			isOptional($("#pwd_cxmm"),$("#sle_sflm"));
		}
	})
	$("#sle_zxbz")[0].addEventListener("change",function(){
		if(this.value == "1-现金"){
			noRequire($("#sle_zhlb"),$("#txt_zczkh"),$("#sle_pzzl"),$("#txt_zjhm2"));
		}
	})
	$("#sle_sfbd")[0].addEventListener("change",function(){
		if(this.value == "Y"){
			notOptional($("#sle_sfbhzh"))
		}else if(this.value == "N"){
			//$("#txt_bdzkh").val("");
			//$("#sle_lhhxyk").children("option")[1].selected = "true";
			isEmpty($("#txt_bdzkh"),$("#txt_bdhm"),$("#txt_bdzhsjh"));
			//alert($("#txt_bdzkh").val())
		}
	})
	
//	$("#sle_cpdm").closest("div").on("change",$("#sle_cpdm"),function(){
//		var zhi =$("#sle_jzzl").val();
//		if($("#sle_cpdm")[0].value == "41011" && zhi == "002"||zhi == "003"||zhi == "004"){
//			isOptional($("#sle_zclx"));
//		}
//		else{
//			notOptional($("#sle_zclx"));
//		}
//	});

$("#sle_cpdm")[0].addEventListener("change",function(){
	var zhi =$("#sle_cpdm").val();
	if(zhi==41011){
		$("#sle_fjlx").removeAttr("vl-default");
		$("#sle_fjlx").removeAttr("vl-regex");
		$("#sle_fjlx").attr("vl-default","");
		$("#sle_fjlx").attr("disabled","disabled");
		$("#sle_fjlx").attr("disabled","disabled");
		$("#sle_fjlx").attr("vl-disabled","true");
		$("#sle_fjlx").next("input").attr("disabled","disabled");
		
		$("#sle_sfbd").attr("disabled","disabled");
		$("#sle_sfbd").attr("vl-disabled","true");
		$("#sle_sfbd").next("input").attr("disabled","disabled");
		$("#sle_zhlx option[value=1]").attr("selected", "selected");
		var values = $("#sle_zhlx").find("option:selected").text();
		$("#sle_zhlx").next("input").val(values);
	}
	else{
		$("#sle_fjlx").removeAttr("disabled","disabled");
		$("#sle_fjlx").removeAttr("vl-disabled","true");
		$("#sle_fjlx").attr("vl-regex","require");
		$("#sle_fjlx").next("input").removeAttr("disabled","disabled");
		$("#sle_sfbd").removeAttr("disabled","disabled");
		$("#sle_sfbd").removeAttr("vl-disabled","true");
		$("#sle_sfbd").next("input").removeAttr("disabled","disabled");
	}
});




	
	
	//清空选中框内容
	function isEmpty(){
		for(var i in arguments){
			arguments[i].val("");
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
