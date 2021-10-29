$(document).ready(function(){
	//100102页面
	$(".o-send").on("click",function(){
		$("#bank-o").hide();
		$("#bank-t").show();
	})
	
	$(".t-back").on("click",function(){
		$("#bank-o").show();
		$("#bank-t").hide();
	})
	
	//100103页面
	$(".t-send").on("click",function(){
		$("#bank-t").hide();
		$("#back-s").show();
		$('#txt_cxxhs').val($('#txt_cxxh').val());
		$('#txt_nsrbms').val($('#txt_zsjgdm').val());
		$('#txt_wbsbdzxhs').val($('#txt_wbsbdzxh').val());
		$('#txt_fkzhs').val($('#txt_fkzh').val());
		$('#txt_qshhh').val($('#txt_qshzhhh').val());
		$('#txt_khhhh').val($('#txt_fkkhhhh').val());
		$('#txt_nsrmc3').val($('#txt_nsrmc2').val());
		$('#txt_fkzhslx').val($('#sle_fkzhlx').val());
		$('#txt_jyje').val($('#money_jkje').val());
		
	})
	
	$(".s-back").on(("click"),function(){
		$("#bank-t").show();
		$("#back-s").hide();
	})
	
	//100105页面
	$(".s-send").on("click",function(){
		$("#back-f").show();
		$("#back-s").hide();
	})
	
	//100104页面
	$(".f-back").on("click",function(){
		$("#back-f").hide();
		$("#back-s").show();
	})
})