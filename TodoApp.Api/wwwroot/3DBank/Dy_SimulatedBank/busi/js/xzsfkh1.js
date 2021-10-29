$(document).ready(function () {
	$("#sle_khlx").blur(function(){
		var myselect=document.getElementById("sle_khlx");
		var index=myselect.selectedIndex;
		var v=myselect.options[index].value;
		if(v==1){
			document.getElementById("txt_djxh").disabled=true;
			$("#txt_djxh").val(0);
			document.getElementById("sle_sfjd").disabled=true;
			$("#sle_sfjd").attr("vl-default","Y");
		}
		else{
			document.getElementById("txt_djxh").disabled=false;
			$("#txt_djxh").val(0);
			document.getElementById("sle_sfjd").disabled=true;
			$("#sle_sfjd").attr("vl-default","Y");
		}
	})
})