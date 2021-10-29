$(document).ready(function() {
	var tdNum = $(".num");

	//开户/存款金额处理
	var Azjhm = ["1", "2", "3"];
	$("#money_khckje").bind('input propertychange', function() {
		//开户/存款金额大于五万处理
		if($(this).val() >= 50000) {
			$("#sle_zjlx").attr({ "vl-regex": "['require']", "vl-message": "['证件类型不能为空!']" }).siblings("span").css("display", "inline-block");
			$("#sle_zjlx").change(function() {
				if($.inArray($(this).val(), Azjhm) != -1) {
					$("#txt_zjhm").removeAttr("vl-regex vl-message").attr({ "vl-regex": "['require','maxlength20', 'idcard']", "vl-message": "['证件号码不能为空!','证件号码长度大于最大长度:[20]!','证件号码身份证位数不正确（应为15位或者18位）!']" })
						.siblings("span").css("display", "inline-block");
				} else {
					$("#txt_zjhm").removeAttr("vl-regex vl-message").attr({ "vl-regex": "['require','maxlength20']", "vl-message": "['证件号码不能为空!','证件号码长度大于最大长度:[20]!']" })
						.siblings("span").css("display", "inline-block");
				}
			})

		} else {
			$("#sle_zjlx").change(function() {
				$("#sle_zjlx").removeAttr("vl-regex vl-message").siblings("span").hide();
				if($.inArray($(this).val(), Azjhm) != -1) {
					$("#txt_zjhm").removeAttr("vl-regex vl-message").attr({ "vl-regex": "['maxlength20', 'idcard']", "vl-message": "['证件号码长度大于最大长度:[20]!','证件号码身份证位数不正确（应为15位或者18位）!']" })
						.siblings("span").hide();
				} else {
					$("#txt_zjhm").removeAttr("vl-regex vl-message").attr({ "vl-regex": "['maxlength20']", "vl-message": "['证件号码长度大于最大长度:[20]!']" })
						.siblings("span").hide();
				}
			})

			//			$("#txt_zjhm").removeAttr("vl-regex vl-message").attr({ "vl-regex": "['maxlength20', 'idcard']", "vl-message": "['证件号码长度大于最大长度:[20]!','证件号码身份证位数不正确（应为15位或者18位）!']" })
			//				.siblings("span").hide();
		}
		//开户/存款金额大于五十万处理
		if($(this).val() >= 　500000) {
			$("#sle_zy").attr({ "vl-regex": "['require']", "vl-message": "['摘要不能为空!']" }).siblings("span").css("display", "inline-block");
		} else {
			$("#sle_zy").removeAttr("vl-regex").siblings("span").hide();
		}
	})

	$("#sle_zjlx").off().change(function() {
		$("#sle_zjlx").siblings("span").hide();
	})

	//摘要为手工录入处理
	$("#sle_zy").bind('input propertychange', function() {
		if($(this).val() == 99) {
			$(".bisu").css("display", "inline-block");
		} else {
			$(".bisu").hide();
			$(".no-choose").attr("disabled", "disabled");
		}
	})

	//现转标志为转账时，转出方信息应是可填项
	$("#sle_xzbz").bind("input propertychange", function() {
		if($(this).val() == 2) {
			$(".no-gray").find("input[disabled='disabled']").removeAttr("disabled");
		}
	})

	//现转标志为转账，转存类型的不同选项应对应不同的转存信息（不转存--无信息，）
	$("#sle_zclx").bind("input propertychange", function() {
		
		if($(this).val() == 0) {
			$("#sle_zcqx").siblings("input").val($("#sle_cq").siblings("input").val())
		}
		
		if($(this).val() == 1) {
			$("#sle_zcqx").siblings("input").val($("#sle_cq").siblings("input").val())
		}

		if($("#sle_xzbz").val() == 2) {
			if($(this).val() == 2) {
				$("#txt_lxcrzh").attr("disabled", "disabled");
			} else {
				$("#txt_lxcrzh[disabled='disabled']").removeAttr("disabled");
			}
		}

	})
	
	//提交
	$("#btnsubmit").on("click",function(){
		$("#txt_kzh").val($("#txt_zh").val());
		$("#txt_xh").val($("#sle_xh").val());
	})
	
	
})