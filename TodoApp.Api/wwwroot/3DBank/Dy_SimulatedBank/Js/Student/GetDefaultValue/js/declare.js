$(document).ready(function(){
	$(".exit").on("click",function(){
		if(confirm("确认退出本页面")) {
			window.opener = null;
			window.open('', '_self');
			window.close();
		}
	})
})