$(document).ready(function () {
	$("#sle_khfs").blur(function (){
		var myselect=document.getElementById("sle_khfs");
		var index=myselect.selectedIndex;
		var v=myselect.options[index].value;
		if(v=='0'){
			alert("活期账户不允许本息扣划！");
		}
	});
	$("#txt_zrzh").blur(function (){
		var zrzhvalue=$("#txt_zrzh").val();
		var khzhvalue=$("#txt_zkh").val();
		if(zrzhvalue.length!=0&&khzhvalue.length!=0){
			if(zrzhvalue==khzhvalue){
				alert("划扣账户不能与转入账户相同！");
			}
		}
	});
})