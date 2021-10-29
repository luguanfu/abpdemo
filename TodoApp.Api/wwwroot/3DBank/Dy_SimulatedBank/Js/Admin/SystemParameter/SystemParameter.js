
function searchinfo() {
    var findStr = $("#C_Name").val().trim();
    $("#tablelist>tr").find("td:first").each(function () {
        if ($(this).text().indexOf(findStr) > -1) {
            $(this).parent().show()
        } else {
            $(this).parent().hide()
        }
    })
}