$(function() {
	//$("#txt_account_card")[0].addEventListener("change",function(){
	//	//如果是银行卡 6228480402564890018
	//	if(luhmCheck($("#txt_account_card").val())){
	//		addSousuo($("#sle_number"),"序号");
	//		isOptional($("#sle_number"));
	//	}else{
	//		notOptional($("#sle_number"));
	//		$("#sle_number").nextAll("img").remove();
	//	}
	//})
	$("#sle_djfs")[0].addEventListener("change",function(){
		if(this.value == "0" || this.value == "1"){
			notOptional($("#money_djje"));
			notRequire($("#money_djje"));
		}else{
			isOptional($("#money_djje"));
			isRequire($("#money_djje"),"冻结金额");
		}
	});
	$("#money_djje")[0].addEventListener("click",function(){
		//如果存在为空的样式
		if($(this).attr("vl-regex").indexOf("require") != -1){
			$("#money_djje_tips").attr("style","display:block");
			isRequire($(this),"冻结金额");
		}
	})
	
function addSousuo(node,name){
	var nSousuo = "<img class='sousuo' src='http://120.24.172.198:1203/bankingsystem/kaihu/banksousuo.png' vl-exec='false' vl-message='['"+name+"查询未执行！']'>";
	if(node.nextAll("img").length<=0){
		node.after(nSousuo);
	}
}

function notRequire(){
	for(var i in arguments){
		arguments[i].removeAttr("vl-regex vl-message").nextAll("span").remove();
	}
}

function isRequire(node,name){
	if(node.nextAll("span").length < 1){
		if(node.nextAll("img").length >= 1){
			node.attr({"vl-regex":"['require']","vl-message":"['"+name+"不能为空！']"}).nextAll("img").after("<span class='text-red redtip'>!</span>");
		}else{
			node.attr({"vl-regex":"['require']","vl-message":"['"+name+"不能为空！']"}).after("<span class='text-red redtip'>!</span>");
		}
	}
}

function isOptional(){
	for(var i in arguments){
		arguments[i].attr({"vl-disabled":false,"disabled":false}).nextAll("input").attr({"vl-disabled":false,"disabled":false});
	}
}

function notOptional(){
	for(var i in arguments){
		arguments[i].attr({"vl-disabled":true,"disabled":true}).nextAll("input").attr({"vl-disabled":true,"disabled":true});
	}
}
/**
 *判断是否为正确的银行卡号，正确返回true，否则返回false
 *Luhm校验规则：16位银行卡号（19位通用）:
 *1.将未带校验位的 15（或18）位卡号从右依次编号 1 到 15（18），位于奇数位号上的数字乘以 2。
 *2.将奇位乘积的个十位全部相加，再加上所有偶数位上的数字。
 *3.将加法和加上校验位能被 10 整除。
 */
function luhmCheck(bankno){
if (bankno.length < 16 || bankno.length > 19) {
//$("#banknoInfo").html("银行卡号长度必须在16到19之间");
return false;
}
var num = /^\d*$/;  //全数字
if (!num.exec(bankno)) {
//$("#banknoInfo").html("银行卡号必须全为数字");
return false;
}
//开头6位
var strBin="10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";    
if (strBin.indexOf(bankno.substring(0, 2))== -1) {
//$("#banknoInfo").html("银行卡号开头6位不符合规范");
return false;
}
    var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhm进行比较）


    var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
    var newArr=new Array();
    for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i,1));
    }
    var arrJiShu=new Array();  //奇数位*2的积 <9
    var arrJiShu2=new Array(); //奇数位*2的积 >9
    
    var arrOuShu=new Array();  //偶数位数组
    for(var j=0;j<newArr.length;j++){
        if((j+1)%2==1){//奇数位
            if(parseInt(newArr[j])*2<9)
            arrJiShu.push(parseInt(newArr[j])*2);
            else
            arrJiShu2.push(parseInt(newArr[j])*2);
        }
        else //偶数位
        arrOuShu.push(newArr[j]);
    }
    
    var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
    for(var h=0;h<arrJiShu2.length;h++){
        jishu_child1.push(parseInt(arrJiShu2[h])%10);
        jishu_child2.push(parseInt(arrJiShu2[h])/10);
    }        
    
    var sumJiShu=0; //奇数位*2 < 9 的数组之和
    var sumOuShu=0; //偶数位数组之和
    var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal=0;
    for(var m=0;m<arrJiShu.length;m++){
        sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
    }
    
    for(var n=0;n<arrOuShu.length;n++){
        sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
    }
    
    for(var p=0;p<jishu_child1.length;p++){
        sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
        sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
    }      
    //计算总和
    sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);
    
    //计算Luhm值
    var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;        
    var luhm= 10-k;
    
    if(lastNum==luhm){
    
    return true;
    }
    else{
   
    return false;
    }        
}
})
