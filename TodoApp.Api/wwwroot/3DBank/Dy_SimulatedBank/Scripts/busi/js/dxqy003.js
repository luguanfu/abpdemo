$(document).ready(function () {
  $("#txt_sjhm").blur(function () {
    	var phoneNum = $("#txt_sjhm").val();
    	var phoneNum3 =phoneNum.substring(0,3)
		var arr1 = ["134", "135", "136", "137", "138", "139", "147","150","152","157","158","159","182","183","184","187","188"];
		var arr2 = ["130","131","132","155","156","185","186","145"];
		var arr3 = ["133","153","180","181","189"];
                //arr.contains(formid)
    var str_arr_01 = arr1.join(",");
    var str_arr_02 = arr2.join(",");
    var str_arr_03 = arr3.join(",");
		alert(str_arr_01.indexOf(phoneNum3)+str_arr_02.indexOf(phoneNum3)+str_arr_03.indexOf(phoneNum3));
    if (str_arr_01.indexOf(phoneNum3) > -1&&) {
      $("#txt_yys").val("中国移动");
		}
//		if($.inArray(phoneNum3, arr1)!=false && $.inArray(phoneNum3,arr2)==false&&$.inArray(phoneNum3,arr3==false))
//		{
//			$("#txt_yys").val("中国移动");
//		}
//		else if(!$.inArray(phoneNum3, arr1)&&$.inArray(phoneNum3,arr2)&&!$.inArray(phoneNum3,arr3))
//		{
//			$("#txt_yys").val("中国联通");
//		}
//		else if(!$.inArray(phoneNum3, arr1)&&!$.inArray(phoneNum3,arr2)&&$.inArray(phoneNum3,arr3))
//		{
//			$("#txt_yys").val("中国电信");
//		}
//		else
//		{
//			$("#txt_yys").val("其他");
//		}
  });
   $("#txt_sjhm1").blur(function () {
    	var phoneNum = $("#txt_sjhm1").val();
    	var phoneNum3 =phoneNum.substring(0,3)
		var arr1 = [134, 135, 136, 137, 138, 139, 147,150,152,157,158,159,182,183,184,187,188];
		var arr2 = [130,131,132,155,156,185,186,145];
		var arr3 = [133,153,180,181,189];
		if($.inArray(phoneNum3, arr1)&&!$.inArray(phoneNum3,arr2)&&!$.inArray(phoneNum3,arr3))
		{
			$("#txt_yys1").val("中国移动");
		}
		else if(!$.inArray(phoneNum3, arr1)&&$.inArray(phoneNum3,arr2)&&!$.inArray(phoneNum3,arr3))
		{
			$("#txt_yys1").val("中国联通");
		}
		else if(!$.inArray(phoneNum3, arr1)&&!$.inArray(phoneNum3,arr2)&&$.inArray(phoneNum3,arr3))
		{
			$("#txt_yys1").val("中国电信");
		}
		else
		{
			$("#txt_yys1").val("其他");
		}
  });
   $("#txt_sjhm2").blur(function () {
    	var phoneNum = $("#txt_sjhm2").val();
    	var phoneNum3 =phoneNum.substring(0,3)
		var arr1 = [134, 135, 136, 137, 138, 139, 147,150,152,157,158,159,182,183,184,187,188];
		var arr2 = [130,131,132,155,156,185,186,145];
		var arr3 = [133,153,180,181,189];
		if($.inArray(phoneNum3, arr1)&&!$.inArray(phoneNum3,arr2)&&!$.inArray(phoneNum3,arr3))
		{
			$("#txt_yys2").val("中国移动");
		}
		else if(!$.inArray(phoneNum3, arr1)&&$.inArray(phoneNum3,arr2)&&!$.inArray(phoneNum3,arr3))
		{
			$("#txt_yys2").val("中国联通");
		}
		else if(!$.inArray(phoneNum3, arr1)&&!$.inArray(phoneNum3,arr2)&&$.inArray(phoneNum3,arr3))
		{
			$("#txt_yys2").val("中国电信");
		}
		else
		{
			$("#txt_yys2").val("其他");
		}
  });
})