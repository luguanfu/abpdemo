$(document).ready(function () {
	 // $("#sle_bz option[text='CNY - 人民币']").attr("selected", true)

    $("#sle_bz").empty();//首先清空select现在有的内容
    $("#sle_bz").append("<option  selected='selected'  value=0>请选择币种</option>");
    $("#sle_bz").append("<option selected='selected'  value='CNY'>CNY - 人民币</option>");
	 
})