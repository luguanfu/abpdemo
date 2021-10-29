$(document).ready(function () {
	$("#txt_fdz").blur(function(){
		var fdz=$("#txt_fdz").val();
 		$("#txt_fdz").val(toDecimal2(fdz));
 	});
 	$("#txt_fdhbl").blur(function(){
 	    var fdhbl=$("#txt_fdhbl").val();
 	    $("#txt_fdhbl").val(toDecimal2(fdhbl));
 	});
 	$("#sle_sfdz").blur(function(){
 		var myselect=document.getElementById("sle_sfdz");
		var index=myselect.selectedIndex;
	    var v=myselect.options[index].value;
	    if(v=='Y'){
	    	$("#txt_bdzyy").removeAttr("vl-regex");
	    	$("#sle_dzzq").attr("vl-default","m");
	    }
	    else if(v=='N'){
	    	$("#sle_dzzq").removeAttr("vl-default");
	    	$("#txt_bdzyy").attr("vl-regex","['require']");
	    	document.getElementById("sle_dzqd").disabled=true;
	    }
 	});
 	function toDecimal2(x) { 
 		var f = parseFloat(x); 
 		if (isNaN(f)) { 
 			return false; 
 		} 
 		var f = Math.round(x*100)/100; 
 		var s = f.toString(); 
 		var rs = s.indexOf('.'); 
 		if (rs < 0) { 
			rs = s.length; 
  			s += '.'; 
 		} 
 		while (s.length <= rs + 6) { 
 			s += '0'; 
 		} 
 		return s; 
 	} 
})