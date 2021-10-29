$(document).ready(function(){
	var planid=getQueryString("planid");
	//批次号回车事件
	var bdFrame ="/commontable?fields=zjhm|证件号码,khmc|客户名称,khlx|客户类型,khzh|客户账号,zhfjlx|账户分级类型,cp|产品,cq|存期,sfzc|是否转存,jzzl|介质种类,pzhm|凭证号码,kh|卡号,khje|开户金额,khjg|开户结果,gljg|关联结果,czdyzt|存折打印状态,sbyy|失败原因,dysj|打印时间,dywd|打印网点,dywdmc|打印网点名称,bzcz|补折操作&table&table=tb_daily_plkhmxcx&date_format=yyyy-MM-dd HH:mm&orderby=id&page=1&is_page=true";
	$("#btnsubmit").click(function(){
		 
			$("iframe").attr("src",bdFrame + "&where=and plan_id="+planid+" and pch={" + $("#txt_pch").val() + "}").addClass("ba-iframe");
		
	})
})

 function getQueryString(name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
     var r = window.location.search.substr(1).match(reg);
     if (r != null) return unescape(r[2]);
     return null;
 }
