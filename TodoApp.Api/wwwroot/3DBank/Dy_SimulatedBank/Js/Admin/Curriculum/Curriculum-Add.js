/***************************************************************
         FileName:BSI_保险_课程管理js文件 
         Copyright（c）2018-金融教育在线技术开发部
         Author:邵
         Create Date:2018-5月15号
******************************************************************/
var FileImg = "";
//上传封面弹窗
function item_fengm() {
    layer.open({
        title: '上传课程封面',
        area: ['550px', '450px'],
        //	offset: ['5vmin'],//定义弹窗位置 距离顶部5vmin
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        fixed: false, //不固定
        maxmin: true,
        content: $("#item_fengm")
    });
}
//封面上传插件开始
$(function () {
    var options = {
        thumbBox: '.thumbBox',
        spinner: '.spinner',
        imgSrc: '../img/scfmimg.jpg'
    }
    var cropper = $('.imageBox').cropbox(options);
    $('#upload-file').on('change', function () {
        var reader = new FileReader();
        reader.onload = function (e) {
            options.imgSrc = e.target.result;
            cropper = $('.imageBox').cropbox(options);
        }
        reader.readAsDataURL(this.files[0]);
        //this.files = [];
    })
    $('#btnCrop').on('click', function () {
        var img = cropper.getDataURL();
        FileImg = img;
        if (img != 0) { //判断是否选择图片
            $("#use_img").attr("src", img);
            layer.closeAll();
        } else {
            alert("没有选择图片");
        }
    })
    $('#btnZoomIn').on('click', function () {
        cropper.zoomIn();
    })
    $('#btnZoomOut').on('click', function () {
        cropper.zoomOut();
    })
    $(".select_month").on("click", "span", function () {
        $(".select_month span").removeClass("onlyBlue");
        $(this).addClass("onlyBlue");
        //项目名称
        var TypeCon = $(".onlyBlue").html();
    })
    GetEdit();
});
function GetEdit()
{
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/CurriculumAdd/GetEdit',
        data: { "Type":getQueryString("Type"),"id": getQueryString("id")},
        success: function (data) {
            var json = eval(data);
            var Cover = json[0].Cover;
            FileImg = Cover;
            var CurriculumName = json[0].CurriculumName;
            var Synopsis = json[0].Synopsis;
            $("#use_img").attr("src", Cover);
            $("#txtTitle").val(CurriculumName);
            $("#synopsisid").val(Synopsis);
        }
    });
}
//--------Code------
function btnOk()
{
    var Type=getQueryString("Type");
    //图片
    var img = FileImg;
    if (img == 0) {
        layer.msg("封面不能为空!");
        return;
    }
    //课程名称
    var txtTitle = $("#txtTitle").val();
    if (txtTitle == "" || txtTitle == undefined) {
        layer.msg("请输入课程名称!");
        return;
    }
    if (txtTitle.length > 50) {
        layer.msg("课程名称字数超过最大值!");
        return;
    }
    //简介
    var synopsis = $("#synopsisid").val();
    if (synopsis == "" || synopsis == undefined) {
        layer.msg("请输入课程简介!");
        return;
    }
    if (synopsis.length > 300)
    {
        layer.msg("课程简介字数超过最大值!");
        return;
    }
    if (Type == "Add") {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: '/CurriculumAdd/Add',
            data: { "img": img, "txtTitle": txtTitle, "synopsis": synopsis },
            success: function (data) {
                if (data == -1) {
                    layer.msg('操作失败', { icon: 2 });
                    return;
                }
                else if (data == -2) {
                    layer.msg("已存在同名课程", { icon: 2 });
                }
                else {
                    layer.msg('操作成功', { icon: 1, time: 2000 }, function () {
                        window.location.href = "/Admin/Curriculum/Index";
                    });
                }
            }
        });
    }
    if(Type=="Edit")
    {
        var id = getQueryString("id");
        $.ajax({
            type: "POST",
            dataType: "text",
            url: '/CurriculumAdd/Edit',
            data: { "img": img, "txtTitle": txtTitle, "synopsis": synopsis,"id":id},
            success: function (data) {
                if (data == -1) {
                    layer.msg('操作失败', { icon: 2 });
                    return;
                }
                else if (data == -2) {
                    layer.msg('已存在同名课程', { icon: 2 });
                    return;
                }
                else {
                    layer.msg('操作成功', { icon: 1, time: 2000 }, function () {
                        window.location.href = "/Admin/Curriculum/Index";
                    });
                }
            }
        });
    }
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}