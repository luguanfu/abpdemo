$(document).ready(function() {
	
	//转出金额区间设定未做校验
	var minSum,zminSum,maxSum,zmaxSum;
	$("#money_zdzcje").blur(function() {
		minSum = $("#money_zdzcje").val();
		zminSum = parseInt(minSum.replace(/,/g,''));
		sumContrast()
	})

	$("#money_zgzcje").blur(function() {
		maxSum = $("#money_zgzcje").val();
		zmaxSum = parseInt(maxSum.replace(/,/g,''));
		//console.log(minSum,maxSum)
		sumContrast()
	})
	
	function sumContrast() {
		if(zmaxSum < zminSum) {
			$("#money_zgzcje").val(minSum.replace(/\d(?=(?:\d{3})+\b)/g,'$&,'));
		}
	}
	
	//代理人证件类型选中后代理信息为可填
	$("#sle_dlrzjlx").bind("input propertychange",function(){
		
		if($(this).val()) {
			$(".td-display").find("input").removeAttr("disabled");
		}
	})
	 

})