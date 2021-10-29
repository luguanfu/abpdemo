
$(function () {
    //加载背景音乐
    playSound("/Flash/home_bgv.mp3", 1);

})



//loop 是否循环 1 背景音乐  0 单词声音
function playSound(url,loop) {

    var audioId = getAudioId(loop);

    var loopStr = "";
    if (loop == 1) {
        loopStr = 'loop="loop"';
    }


    //setpeiyin   角色配音
    //setyinxiao  操作音效
    //setyinyue   背景音乐
    //setdonghua   过场动画

    var setyinyue = localStorage.getItem("setyinyue"); 
    var setpeiyin = localStorage.getItem("setpeiyin"); 

    if (loop == 1) {
        if (setyinyue == 0) {
            return;
        }
    } else {
        if (setpeiyin == 0) {
            return;
        }
    }



    //非IE内核浏览器
    var strAudio = `<audio id='${audioId}' src='${url}' hidden='true' ${loopStr}>`;
    if ($("body").find("#" + audioId).length <= 0)
        $("body").append(strAudio);
    var audio = document.getElementById(audioId);

    //浏览器支持 audion
    audioPlay(audio);
    //audio.play();
    
}


function audioPlay(audio) {
    audio.play().then((data) => {
        console.log(data)
    }).catch((data) => {
        console.log(data)
        setTimeout(audioPlay, 1000, audio);
    });
}


function getAudioId(loop) {
    var audioId = "audioPlay";
    if (loop == 1) {
        audioId = "audioPlayBg";
    }
    return audioId;
}


function stopSound(loop) {
    var audioId = getAudioId(loop);
    $(`#${audioId}`).remove();
}

