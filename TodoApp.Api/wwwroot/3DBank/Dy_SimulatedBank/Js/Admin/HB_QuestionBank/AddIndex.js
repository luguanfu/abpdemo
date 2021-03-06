/***************************************************************
  FileName:题库管理编辑 javascript
  Copyright（c）2018-金融教育在线技术开发部
  Author:袁学
  Create Date:2018-7-31
 ******************************************************************/
function bindCollegeList() {
    $.ajax({
        url: '/Admin/HB_QuestionBank/Gettb_HB_QuestionBQ',
        Type: "post",
        dataType: "json",
        data: {},
        success: function (tb) {
            var html = '<option value="0">选择试题标签</option>';
            if (tb != null && tb.length > 0) {
                for (var i = 0; i < tb.length; i++) {
                    html += '<option value="' + tb[i]["ID"] + '">' + tb[i]["QuestonBQName"] + '</option>';
                }
            }
            $("#SelQuestonBQName").html(html);

        }
    });
}


$(document).ready(function () { //通用的复选及单选框样式
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
    bindCollegeList();//试题标签
});

//下拉框控制题型			
var map = {
    "0": "MR", //默认题目
    "1": "DanX", //单选
    "2": "DuoX", //多选
    "3": "PD", //判断题
    "4": "TK", //填空题
    "5": "QT", //简答题
    "6": "QT", //名词解析
    "7": "QT", //案例分析
    "8": "QT", //论述题
};

//试题类型下拉
function TypeSelct(value) {
    $('#Addform')[0].reset();//数据清理
    //勾选样式也去掉
    StyleCss(value);
    $("#Type").val(value);
    var divId = map[value];
    $("#" + divId).show().siblings().hide(); //显示当前所选的slect值，隐藏其他的slect值
}

//单选多选判断勾选和默认 样式控制
function StyleCss(type) {
    if (type == 1) {//单选题
        var spltstr = "A,B,C,D";
        //先移除所有勾选样式
        for (var i = 0; i < spltstr.split(',').length; i++) {
            document.getElementById("danxuan" + spltstr.split(',')[i]).checked = false;
            $("#danxuan" + spltstr.split(',')[i]).parent().removeClass('checked');
        }
        //为A添加样式
        document.getElementById("danxuanA").checked = true;
        $("#danxuanA").parent().addClass('checked');
    }
    if (type == 2) {//多选题
        var spltstr = "A,B,C,D,E";
        //先移除所有勾选样式
        for (var i = 0; i < spltstr.split(',').length; i++) {
            document.getElementById("duoxtcbx" + spltstr.split(',')[i]).checked = false;
            $("#duoxtcbx" + spltstr.split(',')[i]).parent().removeClass('checked');
        }
    }

    if (type == 3) {//判断题
        //默认对 样式添加
        document.getElementById("danxuantiA").checked = true;
        $("#danxuantiA").parent().addClass('checked');

        //错误 勾选样式去掉
        document.getElementById("danxuantiB").checked = false;
        $("#danxuantiB").parent().removeClass('checked');
    }
}


//富文本编辑器API
$(document).ready(function () {

    $('.summernote').summernote({
        lang: 'zh-CN',
        height: 150,
        toolbar: [
             ['style', ['bold', 'italic', 'underline', 'clear']]
        ]
    });

});


//新增
function BtnSubim() {

    if (checkFormJs()) {//校验
        //取值
        var QB_Type = parseInt($("#Type").val());//题型
        var QB_Description = $('.summernote').code();//试题描述
        var QB_A = ""; var QB_B = ""; var QB_C = "";
        var QB_D = ""; var QB_E = "";
        var QB_Answer = "";
        var QB_Keyword = "";

        if (QB_Type == 1) {//单选题
            QB_A = $("#danxAtxt").val(); QB_B = $("#danxBtxt").val();
            QB_C = $("#danxCtxt").val(); QB_D = $("#danxDtxt").val();
            QB_Answer = $('input[name="danxuan"]:checked').val();
        }
        if (QB_Type == 2) {//多选题
            QB_A = $("#duoxtcbxAtxt").val(); QB_B = $("#duoxtcbxBtxt").val();
            QB_C = $("#duoxtcbxCtxt").val(); QB_D = $("#duoxtcbxDtxt").val();
            QB_E = $("#duoxtcbxEtxt").val();
            //获取复选框所有选择的值
            var chk_value = [];
            $('input[name="duoxuan"]:checked').each(function () {
                chk_value.push($(this).val());
            });
            QB_Answer = chk_value + "";

        }
        if (QB_Type == 3) {//判断题
            QB_A = '对'; QB_B = '错';
            QB_Answer = $('input[name="panduan"]:checked').val();
        }
        if (QB_Type == 4) {//填空题
            QB_Answer = $("#tiankongtiAnswer").val();//标准答案
        }
        //其它
        if (QB_Type == 5 || QB_Type == 6 || QB_Type == 7 || QB_Type == 8) {
            QB_Answer = $("#QTAnswer").val();//标准答案
            QB_Keyword = $("#QTKeyword").val();//关键字

        }

        //转义
        QB_Description = HTMLEncode(QB_Description);

        var SelQuestonBQName = parseInt($("#SelQuestonBQName").val());//试题标签
        $.ajax({
            type: "POST",
            dataType: "text",
            url: '/Admin/HB_QuestionBank/Add',
            data: {
                "QB_Type": QB_Type, "QB_Description": QB_Description,
                "QB_A": QB_A, "QB_B": QB_B, "QB_C": QB_C, "QB_D": QB_D,
                "QB_E": QB_E, "QB_Answer": QB_Answer, "QB_Keyword": QB_Keyword, "SelQuestonBQName": SelQuestonBQName
            },
            success: function (data) {
                if (data == "1") {
                    //layer.closeAll();//关闭所有弹出框
                    //$('#Addform')[0].reset();//数据清理
                    //$("#Type").val(0);
                    //$('.summernote').code('');
                    //layer.msg('操作成功', { icon: 1 });
                    layer.closeAll();//关闭所有弹出框
                    layer.msg('操作成功', { icon: 1, time: 800 }, function () {
                        window.location.href = '/Admin/HB_QuestionBank/Index';
                    });



                }
                if (data == "88") {
                    layer.msg('对不起，系统已存在相同题目，添加失败！', { icon: 2 });
                    return;
                }
                if (data == "99") {
                    layer.msg('操作失败', { icon: 2 });
                    return;
                }

            }
        })

    }

}

//新增校验
function checkFormJs() {
    var Type = parseInt($("#Type").val());

    //验证选中试题类型
    if (Type == 0) {
        layer.msg('请选择试题类型！', function () { });
        return false;
    }

    //
    var SelQuestonBQName = parseInt($("#SelQuestonBQName").val());
    if (SelQuestonBQName == 0) {
        layer.msg('请选择试题标签！', function () { });
        return false;
    }
    //验证输入了试题描述
    var Description = $('.summernote').code();
    if (checkBlankSpace(Description) == false) {
        layer.msg('请输入试题描述！', function () { });
        return false;
    }

    if (Description.length>2000) {
        layer.msg('试题描述输入过长！', function () { });
        return false;
    }

    //如果是多选题
    if (Type == 2) {
        var duoxuan = document.getElementsByName('duoxuan');
        var dxcount = 0;
        for (var i = 0; i < duoxuan.length; i++) {
            if (duoxuan[i].checked) {
                dxcount++;
            }
        }

        if (dxcount == 0) {
            layer.msg('请勾选选项，进行标准答案设置！！', function () { });
            return false;
        }
    }
    //填空题
    if (Type == 4) {
        var tiankongtiAnswer = $("#tiankongtiAnswer").val();
        tiankongtiAnswer = tiankongtiAnswer.replace(/(^\s*)|(\s*$)/g, "");
        if (tiankongtiAnswer.length == 0) {
            layer.msg('请输入标准答案！', function () { });
            return false;
        }
    }
    //其他
    if (Type == 5 || Type == 6 || Type == 7 || Type == 8) {
        var QTAnswer = $("#QTAnswer").val();
        QTAnswer = QTAnswer.replace(/(^\s*)|(\s*$)/g, "");
        if (QTAnswer.length == 0) {
            layer.msg('请输入标准答案！', function () { });
            return false;
        }

    }

    return true;
}

//富文本编辑器去空格
function checkBlankSpace(str) {

    while (str.lastIndexOf("&nbsp;") >= 0) {
        str = str.replace("&nbsp;", "");
    }

    str = str.replace(/(^\s*)|(\s*$)/g, "");//去掉前后空格

    if (str.length == 0) {
        return false;
    }

    return true;
}
