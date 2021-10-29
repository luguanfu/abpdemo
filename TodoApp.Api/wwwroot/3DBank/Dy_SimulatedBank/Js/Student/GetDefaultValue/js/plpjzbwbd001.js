$(document).ready(function (e) {
    var fid = '091010';
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