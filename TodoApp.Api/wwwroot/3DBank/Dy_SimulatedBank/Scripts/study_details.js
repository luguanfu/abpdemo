
$(document).ready(function(){
	knobble();				//小节里标题颜色切换
	tab_up_down();			//小节里内容的展开与收起
})
	


//小节里标题背景颜色切换
function knobble(){
	$(".knobble_txt").on("click","p",function(){
		//所有
		$("p").removeClass("redColor");
		$(this).addClass("redColor");
		
		//每个小节的切换，互不影响
		// $(this).parent().children("p").removeClass("redColor")
		// $(this).addClass("redColor");
		
	})
}


//小节里内容的展开与收起
function tab_up_down(id) {
    var iid = "div" + id;
    var andid = "andid" + id;
    var display = $('#' + iid).css('display');
    if (display == 'none') {
        $("#" + iid + "").show();
        $("#" + andid + "").html("收起");
        $("#" + andid + "").removeClass("pack_down").addClass("pack_up");
       
    } else
    {
        $("#" + iid + "").hide();
        $("#" + andid + "").text("展开");
        $("#" + andid + "").removeClass("pack_up").addClass("pack_down");
    }   
}






