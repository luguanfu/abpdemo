

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function BindRank(page) {
    allsearch = 4;
    $("#SearchName2").hide();
    $("#txt_rank").show();
    $("#tuandui").removeClass("disBlock"); //个人或团队Div移除样式隐藏显示
    $("#zhishi").removeClass("disBlock");
    $("#chakanpaiming").addClass("disBlock");

    var rank_name = $("#txt_rank").val();
    var PageSize =4;
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/ExamRanking/GetExamRanking",
        async: false,
        data: { "page": page, "PageSize": PageSize, "rank_name": rank_name },
        success: function (tr) {
            var html = '';
            var data = tr.Tb;
            for (var i = 0; i < data.length; i++) {

                html += '<div class="shuju_line">'
                html += '<label class="paim_k1">' + data[i]["rank_name"] + '</label>'
                var date = new Date(data[i]["add_time"]).Format("yyyy-MM-dd");
                html += ' <label class="paim_k2">' + date + '</label>'
                html += ' <label class="paim_k3 shuju_lv">' + data[i]["newrank"] + '</label>'
                html += ' <label class="paim_k4">'
                html += ' <a href="javascript:void(0)"  onclick="pmopen(' + data[i]["id"] +')"><img src="../img/public3D/sxkh_ico_kan.png" /></a>'
                html += ' </label>'
                html += '</div>'

            }
            $("#rankingContent").html(html);
            bootstrapPaginator("#RankPage", tr, BindRank);//分页
        }
    });
}
//详情跳转
function pmopen(id) {
    window.open("/ExamRanking/Index?id="+id)
}
