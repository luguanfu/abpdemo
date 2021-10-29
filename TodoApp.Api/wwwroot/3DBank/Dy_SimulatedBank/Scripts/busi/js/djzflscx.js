$(document).ready(function(){
    var planid = getQueryString("planid");
    //冻结止付历史查询回车事件
    var bdFrame = encodeURI("/commontable?fields=xuhao|序号,zhanghao|账/卡号,zhmc|账户名称,djzfxh|冻结/止付序号,djzflx|冻结/止付类型,djzfje|冻结/止付金额,jyrq|交易日期,jylx|交易类型,djzfdqr|冻结止付到期日,qljglx|权利机关类型,sqdjzfdw|申请冻结/止付单位,tzsh|通知书号,zxr_1_zjh|执行人一证件号码,zxr_1_xm|执行人一姓名,zxr_2_zjh|执行人二证件号码,zxr_2_xm|执行人二姓名,lsh|流水号,cxbz|撤销标志&table=tb_daily_djzflscx&date_format=yyyy-MM-dd HH:mm&orderby=id&page=1&is_page=true");
	$("#btnsubmit").click(function(){
			
			$("iframe").attr("src",bdFrame + "&where=and plan_id="+planid+" and zhanghao ={" + $('#txt_zkh').val() + "} and djzfxh={" +$('#sle_xh').val()+"}").addClass("ba-iframe");
		
	})
});
 function getQueryString(name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
     var r = window.location.search.substr(1).match(reg);
     if (r != null) return unescape(r[2]);
     return null;
 }
