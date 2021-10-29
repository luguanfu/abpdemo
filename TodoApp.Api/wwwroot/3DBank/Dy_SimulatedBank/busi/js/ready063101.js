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
						
		for(var j=0;j<inputList.length;j++){
			
			if(nzsj(dv,fid,inputList[j].id)){
				
				inputList[j].value = nzsj(dv,fid,inputList[j].id);	
			}			
		}
	
	},1000)
	
	$('#search').click(function(){
		var dv = $('#DefaultValue').html();
		var tdList = $('#aaa [index="1"] td');
		if(nzsj(dv,fid,'date_ptjyrq')){
			tdList[1].innerHTML = nzsj(dv,fid,'date_ptjyrq');
			
		}
		if(nzsj(dv,fid,'txt_ptlsh')){
			tdList[2].innerHTML = nzsj(dv,fid,'txt_ptlsh');
		}
		if(nzsj(dv,fid,'txt_hkrzh')){
			tdList[6].innerHTML = nzsj(dv,fid,'txt_hkrzh');
		}
		if(nzsj(dv,fid,'txt_hkrmc')){
			tdList[7].innerHTML = nzsj(dv,fid,'txt_hkrmc');
		}
		if(nzsj(dv,fid,'txt_hkje')){
			tdList[8].innerHTML = nzsj(dv,fid,'txt_hkje');
		}
		if(nzsj(dv,fid,'txt_skrzh2')){
			tdList[9].innerHTML = nzsj(dv,fid,'txt_skrzh2');
		}
		if(nzsj(dv,fid,'txt_skrmc2')){
			tdList[10].innerHTML = nzsj(dv,fid,'txt_skrmc2');
		}
		if(nzsj(dv,fid,'txt_fqfmc')){
			tdList[11].innerHTML = nzsj(dv,fid,'txt_skrmc2');
		}
		if(nzsj(dv,fid,'txt_jsfmc')){
			tdList[12].innerHTML = nzsj(dv,fid,'txt_skrmc2');
		}

		
		
		// var tdLists = $('#bbb [index="1"] td');

		// tdLists[6].innerHTML = nzsj(dv,fid,'txt_fkrzh2');
		// tdLists[7].innerHTML = nzsj(dv,fid,'txt_fkrmc');
		// tdLists[8].innerHTML = nzsj(dv,fid,'money_hkje');
		
		
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