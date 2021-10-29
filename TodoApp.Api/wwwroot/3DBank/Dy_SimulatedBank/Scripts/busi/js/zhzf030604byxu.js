$(document).ready(function () {
	$("#sle_business_type").change(function(){
		if(this.value == "1"){
			//this.attr({"vl-message":"hhh"});
			showOrDea($("#sle_business_type_tips2"),true);
		}else{
			showOrDea($("#sle_business_type_tips2"),false);
		}
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