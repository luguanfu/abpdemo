$(document).ready(function () {
	 //var defaultData = $("#DefaultValue").html();
 

    //var defaultData = "$010902#txt_khjg#12345645;txt_zhmc#深圳阳光建筑劳务有限公司;money_ye#36855874.65;#txt_zh#368558741244$050510#txt_zhmc#深圳阳光建筑劳务有限公司;#txt_zh#368558344321$050511#txt_sfzh#;money_zfye#35.00;txt_sfzh#35.00;#txt_sfzh#368558741241$091001#txt_zhmc#深圳阳光建筑劳务有限公司;sle_jcdsfkhqy#N-否;sle_sfzdxy#N-否;#txt_dwzh#368558742141$091003#sle_khlx#C-对公账户;txt_pch#plkh201708-15000324;txt_dwmc#深圳阳光建筑劳务有限公司;#txt_xyh#36855874$091004#txt_zbs#6;txt_cgbs#6;#txt_pch#36855874$091005#money_kyye#36855874.65;txt_dwzh#820000000000016532;txt_dwmc#深圳阳光建筑劳务有限公司;#txt_pch#368558744141$091104#sle_clzt#5-处理成功;txt_zts#6;txt_zje#49963.92;txt_cgts#6;txt_cgje#49963.92;txt_sbts#0;txt_sbje#0.00;#txt_pch#368558743414$091012#txt_khcgbs#6;txt_wdczbs#6;txt_bs#6;#txt_pch#368558743414$091010#txt_dwmc#深圳阳光建筑劳务有限公司;txt_pzsl#6;txt_jywd#080102;txt_dyrq#20170105;#txt_gy#368558743414$091105#txt_dwmc#深圳阳光建筑劳务有限公司;txt_jyrq#20170812;sle_pzzl#209-内部凭证;txt_zbs#6;money_zje#49963.92 ;txt_cgbs#6;txt_sbbs#0;money_cgje#49963.92 ;txt_sbje#0;#txt_pch#666666666666666$091008#txt_zhmc#杨正祥;txt_pzhm#0000000010947463;#txt_zkh#820000000000016532$020704#txt_zhmc#杨正祥;#txt_ICKKH#820000000000016532";
    var defaultData = "";
   
	//加个假按钮
	//var fake_btnsubmit_html="<button type=\"button\" style=\"margin-right: 0px;\" id=\"fake_btnsubmit1\">提交<tton>"; 
	//var btnsubmit=$("#btnsubmit");
 // 	btnsubmit.css("display","none");
 //   //将假提交按钮放到页面
 //   btnsubmit.before(fake_btnsubmit_html);
 //   $("#fake_btnsubmit1").click(function () {
 //       defaultData = $("#DefaultValue").text();  
 //       var mpch = h(defaultData); 
 //       $("#txt_pch").val(mpch);

 //       $("#fake_btnsubmit").click();

 //   })
})

function h(defaultData) {
    
    var mm = defaultData.split("$");
    var opch = "";
    var mpch = "";
    //console.log(mm)
    for (var i in mm) {
        if (mm[i].indexOf("091003#") != -1) {
            var nn = mm[i].split(";");
            opch = nn.filter(function (item, index, arr) {
                return arr[index].indexOf("txt_pch") != -1;
            })[0];
        }
    }
    mpch = opch.substring(opch.indexOf("#") + 1); 
    return mpch;
}