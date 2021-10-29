$(document).ready(function () {
	//终止日期不能小于起始日期
	$("#date_end").blur(function(){
		if(parseInt(this.value)-parseInt($("#date_start")[0].value) < 0){
			showOrDea($("#date_zzrq_tips2"),true)
		}else{
			showOrDea($("#date_zzrq_tips2"),false)
		}
	})
	$("#date_end").focus(function(){
		showOrDea($("#date_zzrq_tips2"),false)
	})
	//显示与消失;显示true 消失false
	function showOrDea(node,boolean){
		if(boolean){
			node.attr("style","display:block");
		}else{
			node.attr("style","display:none");
		}
	}
})
