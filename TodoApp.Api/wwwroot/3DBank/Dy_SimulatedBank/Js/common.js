
// 手机验证
function phoneCheck(codeStatus,verificationTime){
    $(`#${codeStatus}`).val(6);
    $(`#${verificationTime}`).val(dateFormat("YYYY-mm-ddTHH:MM:SS", new Date()));
}
// 发送验证码
function sendCode(id){
    $(`#${id}`).prop('disabled', false);
}
// 计步器跳转
function toSkip(step){
    $("#step_container").setStep(step);
    $(`.step${step-1}`).hide();
    $(`.step${step}`).show();
}
// 日期时间的格式化
function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}
/**
 * 将给定的金额数值转换为中文繁体的方法,
 *  最大值为'兆'的的数值,不为负数
 * @param money 传入的金额数值
 * @return result 当返回的不是'ERROR'时,
 *  返回的是转换后的金额中文值
 */
var moneyToChinese = function(id){
    $(`#${id}`).css("text-align","right");
    var money = $(`#${id}`).val();
    //判断是否为数字,不是返回'ERROR'
    var pattern = /^\d+(.\d{1,2})?$/;
    //匹配0,小数,负数:/^(0|-?[1-9][0-9]*)(.[0-9]{1,2})?$/
    //匹配100,100的格式:/^(0|((-?[1-9][0-9]{1,2})(,[0-9]{3})*|(0|-?[1-9][0-9]*))(.[0-9]{1,2})?)$/
    if(money == ''){
        return '';
    }
    if(!pattern.test(money)){
        return 'ERROR!';
    }
    money += '';
    var s1 = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');//存储数值部分
    var s2 = new Array('分', '角', '圆', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟', '万', '亿', '兆');//存储单位部分
    //将money字符串转化为分
    var str;//用来存储转化为分的字符串
    var result = '';//用来存储
    var index = money.lastIndexOf(".");
    if(index != -1){
        var temp = money.substring(index + 1);
        var len = temp.length;
        if(len > 2){
            len = 2;
            temp = temp.substring(0, 2);
        }
        for(var i = 0; i < 2 - len; i++){
            temp += '0';
        }
        str = money.substring(0, index) + temp;
    } else {
        str = money + '00';
    }
    /*
    * 将分的每一位数字取出
    * 将其与数值和单位部分进行匹配
    * 组合成转换后的金额
    */
    for (i = 0; i < str.length; i++) {
        var n = str.charAt(str.length - 1 - i);
        if(s2[i]){
            result = s1[n] + "" + s2[i] + result;
        }else{
            result = 'ERROR!';
            break;
        }
    }
    /*
    * 通过正则优化
    */
    //优化有零的
    result = result.replace(/零分/g, "零");
    result = result.replace(/零角/g, "零");
    result = result.replace(/零圆/g, "零");
    result = result.replace(/零拾/g, "零");
    result = result.replace(/零佰/g, "零");
    result = result.replace(/零仟/g, "零");
    result = result.replace(/零万/g, "零");
    result = result.replace(/零亿/g, "零");
    //优化多个相连的零
    result = result.replace(/零零/g, "零");
    //优化以零结尾的
    result = result.replace(/零$/, "");
    //优化整元
    result = result.replace(/圆$/, "圆整");
    result = result.replace(/零圆$/, "零圆整");
    $(`.${id}`).text(result);
};