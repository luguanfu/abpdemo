$(document).ready(function(){
		var fid = $('#divContent title').html().substring(0,6);
		window.setTimeout(function(){


		var dv = $('#DefaultValue').html();

		var inputList = $('[data-yw="2"] input');
		var sleList = $('[data-yw="2"] select');
		
				
		for(var k=0;k<sleList.length;k++){
			if(nzsj(dv,fid,sleList[k].id)){
				
				sleList[k].nextSibling.value =nzsj(dv,fid,sleList[k].id)
			}
		}
		
		
		// $('#txt_fkrmc').val(nzsj(dv,'060703','txt_fkrmc'));
		
		for(var j=0;j<inputList.length;j++){
			
			if(nzsj(dv,fid,inputList[j].id)){
				
				inputList[j].value = nzsj(dv,fid,inputList[j].id);	
			}			
		}
	
	},1000)
	
	$('#search').click(function(){
		var dv = $('#DefaultValue').html();

		var tdList = $('#aaa [index="1"] td');


		// tdList[2].value = nzsj(dv,fid,'txt_fqhhh');
		// tdList[3].value = nzsj(dv,fid,'txt_jshhh');
		if(nzsj(dv,fid,'date_hrrq')){
			tdList[1].innerHTML = nzsj(dv,fid,'date_hrrq');
		}
		if(nzsj(dv,fid,'txt_bh')){
			tdList[2].innerHTML = nzsj(dv,fid,'txt_bh');
		}
		if(nzsj(dv,fid,'txt_fqhhh')){
			tdList[3].innerHTML = nzsj(dv,fid,'txt_fqhhh');
		}
		if(nzsj(dv,fid,'txt_jshhh')){
			tdList[4].innerHTML = nzsj(dv,fid,'txt_jshhh');
		}
		if(nzsj(dv,fid,'txt_skrzh2')){
			tdList[5].innerHTML = nzsj(dv,fid,'txt_skrzh2');
		}
		if(nzsj(dv,fid,'txt_skrmc')){
			tdList[6].innerHTML = nzsj(dv,fid,'txt_skrmc');
		}
		if(nzsj(dv,fid,'txt_fkrzh2')){
			tdList[7].innerHTML = nzsj(dv,fid,'txt_fkrzh2');
		}
		if(nzsj(dv,fid,'txt_fkrmc')){
			tdList[8].innerHTML = nzsj(dv,fid,'txt_fkrmc');
		}
		if(nzsj(dv,fid,'money_hkje')){
			tdList[9].innerHTML = nzsj(dv,fid,'money_hkje');
		}
						
		
		var tdLists = $('#bbb [index="1"] td');
		if(nzsj(dv,fid,'date_hrrq')){
			tdLists[1].innerHTML = nzsj(dv,fid,'date_hrrq');
		}
		if(nzsj(dv,fid,'txt_bh')){
			tdLists[2].innerHTML = nzsj(dv,fid,'txt_bh');
		}
		if(nzsj(dv,fid,'txt_fqhhh')){
			tdLists[3].innerHTML = nzsj(dv,fid,'txt_fqhhh');
		}
		if(nzsj(dv,fid,'txt_jshhh')){
			tdLists[4].innerHTML = nzsj(dv,fid,'txt_jshhh');
		}

		if(nzsj(dv,fid,'txt_skrzh2')){
			tdLists[5].innerHTML = nzsj(dv,fid,'txt_skrzh2');
		}
		if(nzsj(dv,fid,'txt_skrmc')){
			tdLists[6].innerHTML = nzsj(dv,fid,'txt_skrmc');
		}
		if(nzsj(dv,fid,'txt_fkrzh2')){
			tdLists[7].innerHTML = nzsj(dv,fid,'txt_fkrzh2');
		}
		if(nzsj(dv,fid,'txt_fkrmc')){
			tdLists[8].innerHTML = nzsj(dv,fid,'txt_fkrmc');
		}
		if(nzsj(dv,fid,'money_hkje')){
			tdLists[9].innerHTML = nzsj(dv,fid,'money_hkje');
		}
		
		
	})
	
	function nzsj(str,FormId,kjId){
		var sarr = str.split('$');
		
		for(var i=0;i<sarr.length;i++){
			if(sarr[i].indexOf(FormId)!=-1 && sarr[i].indexOf(kjId + '#') !=-1 && kjId != ''){
				
			
				var	values = ((sarr[i].split(kjId + '#'))[1].split(';'))[0];

				return values;
			}
		}
		
		
	}


})