$(document).ready(function () {
	$("#sle_czlx").change(function(){
		if(this.value == "1"){
			$("#pwd_yzqmm").nextAll("img").remove();	
		}else{
			addSousuo($("#pwd_yzqmm"),"原支取密码");
		}
	})
	//添加快查
	function addSousuo(node,name){
		var nSousuo = "<img class='sousuo' src='/busi/img/banksousuo.png' vl-exec='false' vl-message='['"+name+"查询未执行！']'>";
		if(node.nextAll("img").length<=0){
			node.after(nSousuo);
		}
	}
})
