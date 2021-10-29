$(document).ready(function () {
    $('#txt_zkh').change(function(){
        var num = $(this).val().substring(0,1);
       
        if(num ==8){
            $('#txt_xkh').attr('disabled',true);
        }else{
             $('#txt_xkh').attr('disabled',false);
        }
    })
});