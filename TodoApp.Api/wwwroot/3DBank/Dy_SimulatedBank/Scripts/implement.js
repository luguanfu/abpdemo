function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

$(document).ready(function () {
    $(document).on("change", ".slectstyle select", function () {
        var value = $(this).val();

        var text = $(this).find("option[value='" + value + "']").text();

        $(this).siblings("input").val(text);
    });



    $("#SaveKeyWord").click(function () {
        ;
        var v = getQueryString('formid');
        var Data = {};
        Data.formid = v;
        var objData;
        $.ajax({
            type: "POST",
            async: false,
            url: "/KeyWord/SelectName",
            data: Data,
            success: function (result) {
                var obj = eval(result);
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].ControlType == 1) {
                        var v = obj[i].ControlName;
                        var vobj = $("#" + v).val();

                        if (vobj != "" || vobj != null || vobj != undefined) {
                            objData += v + "=" + vobj + "&";
                        }
                    }
                    else if (obj[i].ControlType == 2) {
                        var v = obj[i].ControlName;
                        var vobj = $("#" + v).find("option:selected").text();
                        if (vobj != "" || vobj != null || vobj != undefined) {
                            objData += v + "=" + vobj + "&";
                        }
                    }
                    else if (obj[i].ControlType == 3) {
                        var v = obj[i].ControlName;
                        var vobj = $("input[type='radio']:checked").val();
                        if (vobj != "" || vobj != null || vobj != undefined) {
                            objData += v + "=" + vobj + "&";
                        }
                    }
                }
                objData += "&formid=" + getQueryString('formid');
                objData += "&Taskid=" + getQueryString('Taskid');
                objData += "&Score=" + $("#Score").val();

                SaveKeyWord(objData);
            }

        });
    });
});

function SaveKeyWord(Data) {
    $.ajax({
        type: "POST",
        url: "/KeyWord/insert",
        data: Data,
        success: function (result) {
            if (result > -1) {
                alert("提交成功");
            }
            else
            {
                alert("提交失败");
            }
        }
    });

}