
$(function () {
    getCookie();
});

//设置cookie
function setCookie() {
    var loginCode = $("#username").val();//获取用户名信息
    var pwd = $("#password").val();//获取登陆密码信息
    var checked = $("[name='remember']:checked");//获取“是否记住密码”复选框
    if (checked && checked.length > 0) {//判断是否选中了“记住密码”复选框
        $.Cookie("username", loginCode); //调用jquery.cookie.js中的方法设置cookie中的用户名
        $.Cookie("password", $.base64.encode(pwd));//调用jquery.cookie.js中的方法设置cookie中的登陆密码，并使用base64（jquery.base64.js）进行加密
    } else {
        $.Cookie("password", null);
    }
}

//获取cookie
function getCookie() {
    var loginCode = $.Cookie("username");//获取cookie中的用户名
    var pwd = $.Cookie("password");//获取cookie中的登陆密码
    if (pwd) {//密码存在的话把“记住用户名和密码”复选框勾选住
        $("[name='remember']").attr("checked", "true");
    }
    if (loginCode) {//用户名存在的话把用户名填充到用户名文本框
        $("#username").val(loginCode);
    }
    if (pwd) {//密码存在的话把密码填充到密码文本框
        $("#password").val($.base64.decode(pwd));
    }
}

function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");

}

Date.prototype.Format = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function Login(type) {

    var LoginName = trim($("#username").val());

    if (LoginName == "") {
        layer.msg("用户名不能为空");
        $("#username").focus();
        return;
    }
    var UserPwd = trim($("#password").val());
    if (UserPwd == "") {
        layer.msg("密码不能为空");
        $("#password").focus();
        return;
    }
    setCookie();
    
    var datenow = new Date().Format("yyyy-MM-dd");
    //提交表单的操作
    $.ajax({
        Type: "post",
        url: '/Login/Logon',
        dataType: "text", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { 'LoginName': encodeURIComponent(LoginName), 'UserPwd': encodeURIComponent(UserPwd),'datenow': datenow},
        success: function (data) {
           
            if (data == 1) {//管理员
                window.location.href = '/Admin/SchoolManage';

            }
            else if (data == 2) {//教师
                window.location.href = "/Admin/TeacherClassManagement";
            }
            else if (data == 3) {//学生
                window.location.href = "/StuHome/Index";
                //window.location.href = "/StuHome/StudentHome";

            } else if (data == 88) {//账号冻结
                layer.msg('账号被禁用！', function () { });

            }
            else if (data == 77) {
                layer.msg('系统已过期，请联系供应商！', function () { });
            }
            else if (data == -1) {
                layer.msg("系统未授权，请联系供应商！", function () { });
            }
            else if (data == -2) {
                layer.msg("授权文件被篡改，请联系供应商！", function () { });
            }
            else if (data == -3) {
                layer.msg("系统已过期，请联系供应商！", function () { });
            }
            else if (data == -4) {
                layer.msg("授权文件不存在，请联系供应商！", function () { });
            }
            else if (data == -5) {
                layer.msg("授权文件有误，请联系供应商！", function () { });
            }
            else if (data == -6) {
                layer.msg("系统日期不正确，请联系供应商！", function () { });
            }
            else if (data == -10) {
                layer.msg("服务器时间不正确，请联系供应商！", function () { });
            }
            else if (data == 9) {
                layer.msg("系统初始化错误，请联系供应商！", function () { });
            }
            else if (data == 999) {
                layer.msg("系统已到期，请联系供应商！", function () { });
            } else {
                layer.msg('用户名或密码填写错误！', function () { });
            }
        }
    });
}

document.onkeydown = function () {
    if (event.keyCode == 13) {
        if ($("#password").val() != "******") {
            $("#password").data("pwd", $("#password").val());
        }
        Login('1');
    }
};

