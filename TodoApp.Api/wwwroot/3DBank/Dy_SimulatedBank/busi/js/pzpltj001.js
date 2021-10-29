
$(document).ready(function () {
	var pram="txt_account_card|账户,PlanId|序号,txt_zhmc|账户名称,txt_numberofdoc|止付序号,money_zfje|止付金额,txt_stop_date|交易日期,txt_szftzsh|交易类型&table=yw_030604&date_format=yyyy-MM-dd%20HH:mm&orderby=id&page=1&is_page=true";
	var src=_ip+"commontable?fields="+pram;
	$("#iframeID").attr("src",src);
})