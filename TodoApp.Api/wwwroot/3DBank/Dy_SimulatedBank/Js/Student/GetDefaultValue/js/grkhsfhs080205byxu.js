$(document).ready(function () {

var planid=getQueryString("planid");
	//批次号回车事件
	var bdFrame = "/commontable?fields=pzlx|证件类型,qshm|证件号码,zzhm|有效期类型,pzsl|到期日,id|签发机构&table=tb_daily_voucher&orderby=id&is_page=false&where= and 1!=1&toolbar=true";
	$("#txt_xm").keydown(function(e){
		if(e.keyCode == 13) { 
			$("iframe").attr("src",bdFrame + "&where=and plan_id^"+planid+" and pch^{" + $(this).val() + "}").addClass("ba-iframe");
		}
	})


    $("#txt_zjhm").nextAll("img")[0].addEventListener("click", function () {
        var zjhm = $("#txt_zjhm").val();
        if (zjhm && zjhm.length >= 5) {  
            showOrDea($("#usershen1"), "position: absolute;right: 15px;top: 50px;width: 150px;display:block", true);
            showOrDea($("#usershen2"), "position: absolute;right: 15px;top: 50px;width: 150px;display:block", true);
            showOrDea($("#usershen3"), "position: absolute;right: 70px;top: 45px;height:80px ;display:block", true);
        }
	})
	//显示与消失;显示true 消失false
	function showOrDea(node,mstyle,boolean){
		if(boolean){
			node.attr("style",mstyle);
		}else{
			node.attr("style",mstyle);
		}
	}

})


function getQueryString(name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
     var r = window.location.search.substr(1).match(reg);
     if (r != null) return unescape(r[2]);
     return null;
 }
