$(document).ready(function() {
	$(".first-submit").on("click",function(){
		$("#frist").hide();
		$("#second").show();	
	})
	
	$(".second-close").on("click",function(){
		$("#second").hide();
		$("#frist").show();		
	})
	
	//业务类型下拉框对应显示
	$("#sle_ywlx").change(function(){
		if($(this).val() == 1) {
			console.log($("#sle_hkzhlx option").show().text());
//			alert($("#sle_hkzhlx option").show().text());
			$("#sle_ywzl option").show();
			$("#sle_ywzl option").not("option[value='1']").hide()
			
				$("#sle_hkzhlx option").show();
				$("#sle_hkzhlx option").eq(3).hide();
		}
		
		if($(this).val() == 2) {
			$("#sle_ywzl option").show();
			$("#sle_ywzl option").eq(1).hide();
			$("#sle_ywzl option").eq(4).hide()
			
			$("#sle_hkzhlx option").show();
			$("#sle_hkzhlx option").eq(3).hide();
//			$("#sle_hkzhlx option").("option[value='3']").hide()
		}
		
		if($(this).val() == 3) {
			$("#sle_ywzl option").show();
			$("#sle_ywzl option").not("option[value='4']").hide()
				
			//当选择现金汇款，只能选择
			$("#sle_hkzhlx option").show();
			$("#sle_hkzhlx option").not("option[value='3']").hide()
			
			
			
		}else {
			$("#sle_hkzhlx").siblings("input").removeAttr("disabled")
			$("#sle_hkzhlx").removeAttr("disabled")
		}
		
	})
	
	//金额转大写
	function smalltoBIG(n) {
		var fraction = ['角', '分'];
		var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
		var unit = [
			['元', '万', '亿'],
			['', '拾', '佰', '仟']
		];
		var head = n < 0 ? '欠' : '';
		n = Math.abs(n);

		var s = '';

		for(var i = 0; i < fraction.length; i++) {
			s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
		}
		s = s || '整';
		n = Math.floor(n);

		for(var i = 0; i < unit[0].length && n > 0; i++) {
			var p = '';
			for(var j = 0; j < unit[1].length && n > 0; j++) {
				p = digit[n % 10] + unit[1][j] + p;
				n = Math.floor(n / 10);
			}
			s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
		}
		return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
	}

	$("#txt_hkje").change(function() {
		var sum = $(this).val();
		$("#txt_dxje").val(smalltoBIG(sum));
		if(sum >= 50000) {
			$("#money-show").show();
		}else {
			$("#money-show").hide();
		}
	})
	
	//$(".this-click").on("click",function(){
	//	$("#sum-show").toggle();
	//})
})