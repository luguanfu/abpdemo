
//$(document).ready(function (e) {
//    alert("qixiu1");
//    $(".input").on("click", function () {
//        alert("777");
//        focusNextInput();
//    })
//    alert("88");
//    function focusNextInput(thisInput) {
//        alert("qixiu");
//        var inputs = document.getElementsByTagName("input");
//        for (var i = 0; i < inputs.length; i++) {
//            // ��������һ�����򽹵�ص���һ��   
//            if (i == (inputs.length - 1)) {
//                inputs[0].focus(); break;
//            } else if (thisInput == inputs[i]) {
//                inputs[i + 1].focus(); break;
//            }
//        }
//    }

//});

//$(document).ready(function (e) {
//    alert("qixiu");
//    var inputid = "";
//    var inputArray = $("input[type='text']");
//    for (var i = 0; i < inputArray.length; i++) {
//        alert("11199");
//        if(i==inputArray.length-1)
//        {
//            alert("op:"+inputArray.length)
//            inputArray[0].focus();
//            break;
//        }
//        else if (thisInput == inputArray[i])
//        {
//            alert("oo:" + i);
//            inputArray[i + 1].focus();
//            break;
//        }
//    //}
//    //document.onkeydown = function(e){ 
//    //    var ev = document.all ? window.event : e;
//    //    if(ev.keyCode==13) {
           
//    }
//    //};

//})



$(function () {
    $(" input:text").keypress(function (e) {
        if (e.which == 13) {
            // var inputs =$("input[type='text']");
            //var inputs = $('input').not(':disabled');
            var inputs = $("input[type=text]:not(:disabled)");
            var idx = inputs.index(this); // ��ȡ��ǰ���������������λ��  
            if (idx == inputs.length - 1) {// �ж��Ƿ������һ�������  
                inputs[idx + 1].focus();
            } else {
                inputs[idx + 1].focus(); // ���ý���  
                inputs[idx + 1].select(); // ѡ������  
            }
            return false;// ȡ��Ĭ�ϵ��ύ��Ϊ  
        }
    });
});