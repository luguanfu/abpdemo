
$(function(){
	tab_header();
	go_top();
})


//头部切换
function tab_header(){
	$(".wra_tabbar").on("click","li",function(){
		$("li").removeClass("addColor");
		$(this).addClass("addColor");
	})
}


//回到顶部
function go_top(){
	$(document).scroll(function(){
	    if( $(window).scrollTop() > 400){
			$(".icon_top").show(1000);
		}else{
			$(".icon_top").hide(1000);
		}
	});	
	
	$(".icon_top").on("click",function(){
		  $("html,body").animate({scrollTop:0}, 500);
	})
}
go_top();


