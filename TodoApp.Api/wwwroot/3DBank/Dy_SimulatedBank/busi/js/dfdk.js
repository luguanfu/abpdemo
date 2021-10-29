$(document).ready(function () {
  var planid=getQueryString("planid");
	$("#btnsubmit").click(function() {
           
                var txt_ylsh=$("#txt_pch").val();
                var pram = "xyh|协议号,dwmc|单位名称,pch|批次号,zkh|账/卡号,zhmc|账户名称,zjlx|证件类型,zjhm|证件号码,jyje|交易金额,yt|用途,jyjg|交易结果,sbxx|失败原因,jyjgou|交易机构,jygy|交易柜员,bz|备注,hcjg|核查结果&table=tb_daily_dfdkmxcx&date_format=yyyy-MM-dd HH:mm&orderby=id&page=1&is_page=true&where=and plan_id=" + planid + " and pch=";
                var src = _ip + encodeURI("commontable?fields=" + pram + "{" + txt_ylsh + "}");
				$("#iframeID").attr("src",src);
             
         });
}) 


function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
