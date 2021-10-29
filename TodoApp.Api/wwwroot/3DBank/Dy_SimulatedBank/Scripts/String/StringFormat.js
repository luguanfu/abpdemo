//add by yk   字符串Format方法
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

//日期时间格式化
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "H+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


function chunk(array, size) {
    //获取数组的长度，如果你传入的不是数组，那么获取到的就是undefined
    const length = array.length
    //判断不是数组，或者size没有设置，size小于1，就返回空数组
    if (!length || !size || size < 1) {
        return []
    }
    //核心部分
    let index = 0 //用来表示切割元素的范围start
    let resIndex = 0 //用来递增表示输出数组的下标

    //根据length和size算出输出数组的长度，并且创建它。
    let result = new Array(Math.ceil(length / size))
    //进行循环
    while (index < length) {
        //循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
        result[resIndex++] = array.slice(index, (index += size))
    }
    //输出新数组
    return result
}