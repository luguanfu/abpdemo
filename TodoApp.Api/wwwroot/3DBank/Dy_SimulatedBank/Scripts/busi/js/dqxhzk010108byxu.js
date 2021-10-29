$(document).ready(function () {
   $("#money_zkje")[0].addEventListener("change",function(){
       var newmoney = matchMoney($("#money_hjje")[0]) - matchMoney($("#money_zkje")[0]);
       if (newmoney = "" || newmoney == null) {
           newmoney = 0.00;
       }
        var zero = 0;
        //比较合计金额和转开金额的大小
        if(newmoney <= 0){
            $("#money_ysje").val(Math.abs(newmoney).toFixed(2)).attr('disabled',false);
            $("#money_yfje").val(zero.toFixed(2)).attr('disabled',true);
        }else{
            $("#money_ysje").val(zero.toFixed(2)).attr('disabled',true);
            $("#money_yfje").val(Math.abs(newmoney).toFixed(2)).attr('disabled',false);
        }
   })
    //获取金额
    function matchMoney(node){
        var cMoney = parseFloat(node.value.replace(/,/ig,''));
        return cMoney;
    }
})
