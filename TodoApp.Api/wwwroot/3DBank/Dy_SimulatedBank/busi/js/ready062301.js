$(document).ready(function(){


	window.setTimeout(function(){
		var dv = $('#DefaultValue').html();

		var inputList = $('[data-yw="2"] input');

		// var fid = $('title').html().substring(0,6);
		var fid = $('#divContent title').html().substring(0,6);
		var sleList = $('[data-yw="2"] select');
		
				
		for(var k=0;k<sleList.length;k++){
			if(nzsj(dv,fid,sleList[k].id)){
				
				sleList[k].nextSibling.value =nzsj(dv,fid,sleList[k].id)
			}
		}

		for(var j=0;j<inputList.length;j++){
			
			if(nzsj(dv,'062301',inputList[j].id)){

				inputList[j].value = nzsj(dv,'062301',inputList[j].id);	
			}			
		}
	},1000)
	
	$('#search').click(function(){
		var dv = $('#DefaultValue').html();
		
		// var fid = $('title').html().substring(0,6);

		var td1List = $('[index="1"] td');

		
		if(nzsj(dv,'062301','date_ptjyrq')){
			td1List[1].innerHTML = nzsj(dv,'062301','date_ptjyrq');
		}
		if(nzsj(dv,'062301','txt_ptlsh2')){
			td1List[2].innerHTML = nzsj(dv,'062301','txt_ptlsh2');
		}
		if(nzsj(dv,'062301','txt_fkrzh2')){
			td1List[6].innerHTML = nzsj(dv,'062301','txt_fkrzh2');
		}
		if(nzsj(dv,'062301','txt_fkrmc')){
			td1List[7].innerHTML = nzsj(dv,'062301','txt_fkrmc');
		}
		if(nzsj(dv,'062301','txt_hkje')){
			td1List[8].innerHTML = nzsj(dv,'062301','txt_hkje');
		}
		if(nzsj(dv,'062301','txt_skrzh2')){
			td1List[9].innerHTML = nzsj(dv,'062301','txt_skrzh2');
		}
		if(nzsj(dv,'062301','txt_skrmc')){
			td1List[10].innerHTML = nzsj(dv,'062301','txt_skrmc');
		}
		if(nzsj(dv,'062301','txt_fqhmc')){
			td1List[11].innerHTML = nzsj(dv,'062301','txt_fqhmc');
		}
		
	})

	function nzsj(str,FormId,kjId){
		var sarr = str.split('$');
		
		for(var i=0;i<sarr.length;i++){
			if(sarr[i].indexOf(FormId)!=-1 && sarr[i].indexOf(kjId + '#')!=-1&&kjId != ''){
				
				
				var values = ((sarr[i].split(kjId + '#'))[1].split(';'))[0];

				return values;
			}
		}
		
	}


})