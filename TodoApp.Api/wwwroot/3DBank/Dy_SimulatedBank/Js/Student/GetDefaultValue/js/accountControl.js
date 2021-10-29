$(document).ready(function(){
	//冻结止付历史查询回车事件
	var bdFrame = "/commontable?fields=ID_number|证件号码,customer_name|客户名称,customer_type|客户类型,customer_account|客户账号,product_code|产品代码,cunqi|存期,is_zhuancun|是否转存,jiezhizhonglei|介质种类,pingzhenghaoma|凭证号码&table=tb_daily_trade_3&date_format=yyyy-MM-dd HH:mm&orderby=id&page=1&is_page=true";
	$("#txt_zkh").keydown(function(e){
		if(e.keyCode == 13) {
			$("iframe").attr("src",bdFrame + "&where=and ID_number={" + $(this).val() + "}").addClass("ac-iframe");
		}
	})
})