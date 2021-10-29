///
/*已弃用*/
///

/*************
 * 表单 标准 环节伍设置
 * 2019.08.08 程序猿设置
 */

$(function () {

    

    

    
	
})





//第三要重置
function btnReset() {
    $("#form1 [type='text'],textarea,select,[type='checkbox']").each(function () {
        $(this).data("needamend", "0");
        $(this).removeClass("danclick");
    });
}





//function SetControlValue(id,value)
//{
    
//    var element = $(`#${id}`);
//    var type = element.attr("type");


//    if (type == "radio") {
//        if (value == "1") {
//            element.attr('checked', 'true');
//        }
//    }
//    else if (type == "checkbox") {
//        if (value == "1") {
//            element.attr('checked', 'true');
//        }
//    } else {
//        element.val(value)
//    }

//}
//<button type="button" value="1" onclick="clickYinzhang(this)">货币鉴定专用章</button>
//    <button type="button" value="2" onclick="clickYinzhang(this)">附件章</button>
//    <button type="button" value="3" onclick="clickYinzhang(this)">柜员私章</button>
//    <button type="button" value="4" onclick="clickYinzhang(this)">现金收讫章</button>
//    <button type="button" value="5" onclick="clickYinzhang(this)">假币章</button>
//    <button type="button" value="6" onclick="clickYinzhang(this)">银行业务公章</button>
//    <button type="button" value="7" onclick="clickYinzhang(this)">转讫章</button>
//    <button type="button" value="8" onclick="clickYinzhang(this)">庄户管理专用章</button>

var SealValueTextDict = {
    "1": "货币鉴定专用章",
    "2": "附件章",
    "3": "柜员私章",
    "4": "现金收讫章",
    "5": "假币章",
    "6": "银行业务公章",
    "7": "转讫章",
    "8": "庄户管理专用章",
}

function initSealEvent() {
    $(".gaizhang").on("click", function () {

        var selectYinzhang = localStorage.getItem("selectYinzhang");
        if (selectYinzhang == "") return;
        var selectYinzhangText = SealValueTextDict[selectYinzhang];

        var value = $(this).data("value");
        var text = $(this).text();
        if (value != null && value.length > 0) {
            value += ",";
            text += ",";
        }
        value += selectYinzhang;
        text += selectYinzhangText;

        $(this).data("value", value);
        $(this).text(text);

        $(".btn_tijiao").show().removeAttr("onclick");
        $(".btn_tijiao").attr("onclick", "StudentSealSubmit(133);");


    })

    $(".qianzi").on("click", function () {

        var selectYinzhang = localStorage.getItem("selectYinzhang");
        if (selectYinzhang != "11") return;
        
        StudentSealSubmit(134)

    })
    
}

function StudentSealSubmit(linkId) {

    var txtid = "";//id字符串

    if (linkId == "133") {
        txtid = $(".gaizhang").data("value");
    } else if (linkId == "134") {
        txtid = "已签字";
    }

    var data = getBaseSubmitInfo();
    data.LinkId = linkId;
    data.Types = "2";
    data.StuOperationalAnswers = txtid;



    $.ajax({
        type: "POST",//方法类型
        dataType: "text",//预期服务器返回的数据类型
        url: "/Base/Submission",//url
        data: data,
        async: false,
        success: function (result) {

            if (result == "1" || result == "2" || result == "3") {

                layer.msg('操作成功', { icon: 1, time: 1000 }, function () {
                    
                });

            }
            else if (result == "0") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('保存失败', { icon: 2 });
            }
            else if (result == "97") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('当前任务未开启', { icon: 2 });
            }
            else if (result == "88") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('考试已提交，无法继续答题！', { icon: 2 });
            }
            else if (result == "77") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('考试已结束，无法继续答题', { icon: 2 });
            }
            else if (result == "66") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('您没有此环节的操作权限！', { icon: 2 });
            }
            else {
                layer.closeAll();//关闭所有弹出框
                layer.msg(result, { icon: 2 });
            }
        },
        error: function (result) {
            layer.closeAll();//关闭所有弹出框
            layer.msg(result, { icon: 2 });
        }
    });

   
}