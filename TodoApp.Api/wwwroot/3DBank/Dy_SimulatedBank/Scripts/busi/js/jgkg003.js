$(document).ready(function () {
	var myDate = new Date();
    var year = myDate.getFullYear().toString();
    var month = (myDate.getMonth() + 1).toString();
    if (parseInt(month) < 10) {
        month = "0" + month;
    }
    var day = myDate.getDate();
    if (parseInt(day) < 10) {
        day = "0" + day;
    }
    var dateTimeNow = year + month + day;
    $("#date_jyrq").val(dateTimeNow);
    
    var fid ='080701';
    window.setTimeout(function(){

        var dv = $('#DefaultValue').html();

        var inputList = $('input');

        
        
        // $('#txt_fkrmc').val(nzsj(dv,'060703','txt_fkrmc'));
        
        for(var j=0;j<inputList.length;j++){
            
            if(nzsj(dv,fid,inputList[j].id)){
                
                inputList[j].value = nzsj(dv,fid,inputList[j].id);  
            }           
        }
    
    },1000)
});
	 function nzsj(str,FormId,kjId){
        var sarr = str.split('$');
        
        for(var i=0;i<sarr.length;i++){
            if(sarr[i].indexOf(FormId)!=-1 && sarr[i].indexOf(kjId + '#') !=-1 && kjId != ''){
                
            
                var values = ((sarr[i].split(kjId + '#'))[1].split(';'))[0];

                return values;
            }
        }
        
        
    }