$(document).ready(function () {
	var myDate = new Date();
    var year = myDate.getFullYear().toString();
    var month = (myDate.getMonth() + 1).toString();
    if (parseInt(month) < 10) {
        month = "0" + month;
    }
    var day = myDate.getDate();
    if (parseInt(day) < 10) {
        day = "0" + day;
    }
    var dateTimeNow = year + month + day;
    $("#date_yjyrq").val(dateTimeNow);
	// $("#txt_ylsh").keydown(function() {
 //             if (event.keyCode == "13") {//keyCode=13是回车键
             	
 //                var txt_ylsh=$("#txt_ylsh").val();
 //                var pram = "lsh|流水号,zh|账号,zhxh|账户序号,hm|户名,bz|币种,jdbz|借贷标志,je|金额,xzbz|现转标志,zy|摘要,khjg|开户机构,pzzl|凭证种类,pzh|凭证号,jyjg|交易机构,gyh|柜员号,zjlx|证件类型,zjhm|证件号码,dsfzh|对手方账号,dsfhm|对手方户名,cxbz|撤销标志&table=tb_daily_rcjycx&orderby=id&page=1&is_page=true&where=and lsh^";
 //                var src = _ip + encodeURI("commontable?fields=" + pram + txt_ylsh);
	// 			$("#iframeID").attr("src",src);
 //             }
 //         });


    var planid = getQueryString("planid");
        //冻结止付历史查询回车事件
        var bdFrame = _ip + encodeURI("commontable?fields=lsh|流水号,zh|账号,zhxh|账户序号,hm|户名,bz|币种,jdbz|借贷标志,je|金额,xzbz|现转标志,zy|摘要,khjg|开户机构,pzzl|凭证种类,pzh|凭证号,jyjg|交易机构,gyh|柜员号,zjlx|证件类型,zjhm|证件号码,dsfzh|对手方账号,dsfhm|对手方户名,cxbz|撤销标志&table=tb_daily_rcjycx&orderby=id&page=1&is_page=true");
        $("#txt_ylsh").keydown(function(e){
            if(e.keyCode == 13) {
                $("#iframeID").attr("src",bdFrame + "&where=and plan_id="+planid+" and lsh ={" + $(this).val() + "}").addClass("ba-iframe");
            }
        })

        function getQueryString(name) {
         var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
         var r = window.location.search.substr(1).match(reg);
         if (r != null) return unescape(r[2]);
         return null;
     }
})