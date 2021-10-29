$(function () {
    //全部设为只读
    $("input").each(function () {
        $(this).attr("disabled", "disabled");
    })
    $("select").each(function () {
        $(this).attr("disabled", "disabled");
    })
    $("textarea").each(function () {
        $(this).attr("disabled", "disabled");
    })
})

