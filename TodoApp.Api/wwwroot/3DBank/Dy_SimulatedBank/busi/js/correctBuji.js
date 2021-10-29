$(document).ready(function() {

	var list = ["#txt_czzh", "#txt_bjzh", "#txt_czpzhm", "#sle_bjpzzl"];
	noSpan(list);

	//必输项去掉
	function noSpan(id) {
		for(var i = 0; i < id.length; i++) {
			$(id[i]).siblings("span").hide();
		}

	}
	
	//特殊冲正验证部分
	//冲正
	var ainput = $(".correct input");
	//补记
	var atinput = $(".afterthought input");
	var alist = [];
	var atlist = [];
	for(var i = 0; i < ainput.length; i++) {
		alist.push($(ainput[i]).attr("vl-regex"));
	}
	
	for(var i = 0; i < atinput.length; i++) {
		atlist.push($(atinput[i]).attr("vl-regex"));
	}
	
	//选择操作类型验证对应数据
	$("#sle_czlx").change(function() {

		if($(this).val() == 1) {
			$(atinput).removeAttr("vl-regex");
			$(".correct").find("span").css("display","inline-block");
			$(".afterthought").find("span").hide();
			for(var j = 0; j < ainput.length; j++) {
				$(ainput[j]).attr("vl-regex",alist[j]);
			}
		}
		if($(this).val() == 2) {
			$(ainput).removeAttr("vl-regex");
			$(".correct").find("span").hide();
			$("#txt_bjpzhm").siblings("span").css("display","inline-block");
			$(".afterthought").find("span").css("display","inline-block");
			for(var j = 0; j < atinput.length; j++) {
				$(atinput[j]).attr("vl-regex",atlist[j])
			}
		}
		if($(this).val() == 3) {
			$(atinput).removeAttr("vl-regex");
			$(ainput).removeAttr("vl-regex");
			$(".correct").find("span").css("display","inline-block");
			$(".afterthought").find("span").css("display","inline-block");
			
			for(var j = 0; j < ainput.length; j++) {
				$(ainput[j]).attr("vl-regex",alist[j])
			}
			
			for(var j = 0; j < atinput.length; j++) {
				$(atinput[j]).attr("vl-regex",atlist[j])
			}
			
			$("#sle_czpzzl").removeAttr("disabled vl-regex").siblings("input").removeAttr("disabled").siblings("span").hide();
			$("#sle_bjpzzl").removeAttr("disabled").siblings("input").removeAttr("disabled").siblings("span").hide();
			$("#txt_bzxx2").removeAttr("disabled");
			$("#txt_bjpzhm").siblings("span").hide();
		}else {
			$("#sle_czpzzl").attr("disabled","disabled").siblings("input").attr("disabled","disabled");
			$("#sle_bjpzzl").attr("disabled","disabled").siblings("input").attr("disabled","disabled");
			$("#txt_bzxx2").attr("disabled","disabled");
		}
	})
})