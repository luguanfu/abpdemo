$(function () {
    $(document).on("click", ".box .tab li:not(.disable)", function () {
        var index = $(this).index();
        $(this).parents(".box").find(".one").removeClass("one");
        $(this).addClass("one");
        $(this).parents(".box").find(".ct").hide();
        $(this).parents(".box").find(".ct").eq(index).show();
        $(".slectstyle").each(function (i, e) {
            var slelen = $(e).find("select").width();
            $(e).find("input").width(slelen - 21);
        });
    });

    $(".slectstyle").each(function (i, e) {
        var slelen = $(e).find("select").width();
        $(e).find("input").width(slelen - 21);
    });
    $(".box .tab li").eq(0).click();

    select();

})


function select() {
    $("select").prepend('<option selected value="" hidden ></option>');
}