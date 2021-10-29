$(document).ready(function () {

	$("#txt_xm").nextAll("img")[0].addEventListener("click",function(){
                var val = $("#txt_xm").val();
                if(val==null||val.length<5){
                    return;
                }
		showOrDea($("#usershen"),"position: absolute;right: 7px;top: 30px;width: 150px; display:block",true);
	})
	//显示与消失;显示true 消失false
	function showOrDea(node,mstyle,boolean){
		if(boolean){
			node.attr("style",mstyle);
		}else{
			node.attr("style",mstyle);
		}
	}

})
