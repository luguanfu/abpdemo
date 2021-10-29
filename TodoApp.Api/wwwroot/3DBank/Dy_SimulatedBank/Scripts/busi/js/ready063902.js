$(document).ready(function(){
	var fid = $('#divContent title').html().substring(0,6);
	$(".cz_czlx").change(function(){
		var dv = $('#DefaultValue').html();

		var inputList = $('[data-yw="2"] input');


		var sleList = $('[data-yw="2"] select');
		
				
		for(var k=0;k<sleList.length;k++){
			if(nzsj(dv,fid,sleList[k].id)){
				
				sleList[k].nextSibling.value =nzsj(dv,fid,sleList[k].id)
			}
		}

		for(var j=0;j<inputList.length;j++){
			
			if(nzsj(dv,'063902',inputList[j].id)){

				inputList[j].value = nzsj(dv,'063902',inputList[j].id);	
			}			
		}
	})
	
	$('#search').click(function(){
		var dv = $('#DefaultValue').html();
		
		// var fid = $('title').html().substring(0,6);

		var td1List = $('[index="2"] td');

		
		if(nzsj(dv,'063902','date_ptjyrq')){
			td1List[1].innerHTML = nzsj(dv,'063902','date_ptjyrq');
		}
		if(nzsj(dv,'063902','txt_ptlsh2')){
			td1List[2].innerHTML = nzsj(dv,'063902','txt_ptlsh2');
		}
		if(nzsj(dv,'063902','txt_fkrzh2')){
			td1List[6].innerHTML = nzsj(dv,'063902','txt_fkrzh2');
		}
		if(nzsj(dv,'063902','txt_fkrmc2')){
			td1List[7].innerHTML = nzsj(dv,'063902','txt_fkrmc2');
		}
		if(nzsj(dv,'063902','txt_hkje')){
			td1List[8].innerHTML = nzsj(dv,'063902','txt_hkje');
		}
		if(nzsj(dv,'063902','txt_skrzh2')){
			td1List[9].innerHTML = nzsj(dv,'063902','txt_skrzh2');
		}
		if(nzsj(dv,'063902','txt_skrmc2')){
			td1List[10].innerHTML = nzsj(dv,'063902','txt_skrmc2');
		}
		if(nzsj(dv,'063902','txt_fqhmc')){
			td1List[11].innerHTML = nzsj(dv,'063902','txt_fqhmc');
		}
		var td2List = $('[index="3"] td');
		if(nzsj(dv,'063902','date_ptjyrq')){
			td2List[1].innerHTML = nzsj(dv,'063902','date_ptjyrq');
		}
		if(nzsj(dv,'063902','txt_ptlsh2')){
			td2List[2].innerHTML = nzsj(dv,'063902','txt_ptlsh2');
		}
		if(nzsj(dv,'063902','txt_fkrzh2')){
			td2List[6].innerHTML = nzsj(dv,'063902','txt_fkrzh2');
		}
		if(nzsj(dv,'063902','txt_fkrmc2')){
			td2List[7].innerHTML = nzsj(dv,'063902','txt_fkrmc2');
		}
		if(nzsj(dv,'063902','txt_hkje')){
			td2List[8].innerHTML = nzsj(dv,'063902','txt_hkje');
		}
		if(nzsj(dv,'063902','txt_skrzh2')){
			td2List[9].innerHTML = nzsj(dv,'063902','txt_skrzh2');
		}
		if(nzsj(dv,'063902','txt_skrmc2')){
			td2List[10].innerHTML = nzsj(dv,'063902','txt_skrmc2');
		}
		if(nzsj(dv,'063902','txt_fqhmc')){
			td2List[11].innerHTML = nzsj(dv,'063902','txt_fqhmc');
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