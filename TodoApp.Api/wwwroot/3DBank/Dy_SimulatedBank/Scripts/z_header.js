
//头部切换
$(function () {
    //$(".map_ul").on("click", "li", function () {
    //    $(".map_ul").find("li").removeClass("sole")
    //    $(this).parent().addClass("sole")
    //    if ($(this).children("span").text() === "理财" || $(this).children("span").text() === "团队中心") {
    //        $(".ul_drop_down").removeClass("bgImg")
    //        $(this).addClass("bgImg")
    //    } else {
    //        if (!$(".ul_treasure").hasClass("sole") || !$(".ul_team").hasClass("sole")) {
    //            $(".ul_drop_down").removeClass("bgImg")
    //        }
    //    }
    //})

    // 理财下拉出现
    $(".ul_treasure").on("mouseenter", function () {
        $(".ul_treasure div").stop().slideDown(500)//			
    })
    // 团队中心下拉出现
    $(".ul_team").on("mouseenter", function () {
        $(".ul_team div").stop().slideDown(500)
    })
    // 理财下拉收起
    $(".ul_treasure").on("mouseleave", function () {
        $(".ul_treasure div").stop().slideUp(300)//			
    })
    // 团队中心下拉收起
    $(".ul_team").on("mouseleave", function () {
        $(".ul_team div").stop().slideUp(300)
    })

    // 头像
    $(".map_last").on("mouseenter", function () {
        $(".map_last div").stop().slideDown(500)
    })
    $(".map_last").on("mouseleave", function () {
        $(".map_last div").stop().slideUp(300)
    })
})