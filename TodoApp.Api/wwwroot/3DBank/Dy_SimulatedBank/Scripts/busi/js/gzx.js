$(document).ready(function () {
	//余额大于50000时，证件类型和证件号码为必填项
	$("#money_ye").blur(function (){
		var v=$("#money_ye").val();
		if(parseInt(v)>50000){
			var myselect=document.getElementById("sle_zjlx");
			var index=myselect.selectedIndex;
			var zjlxvalue=myselect.options[index].value;
			var zjhmvalue=$("#txt_zjhm").val();
			if(zjlxvalue.length==0||zjhmvalue.length==0){
				//alert("证件类型和证件号码不允许为空！");
				$("#txt_zjhm").attr("vl-regex","require");
				$("#sle_zjlx").attr("vl-regex","require");
			}
		}
	});
})