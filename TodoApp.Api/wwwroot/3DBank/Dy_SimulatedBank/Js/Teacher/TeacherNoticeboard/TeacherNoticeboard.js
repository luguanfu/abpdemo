/***************************************************************
         FileName:BSI_保险_考试管理-团队实训考核 公告栏 js文件 
         Copyright（c）2018-金融教育在线技术开发部
         Author:李林燊
         Create Date:2018-7月25号
******************************************************************/

$(function() {
    GetNoticeList();
})
//弹框
function Add_case() {
    var html = "<select data-placeholder='请选择班级' id='AddTeamId' class='chosen-select' multiple style='width: 350px;' tabindex='4'><option value=''>请选择班级</option></select>";
    $("#seleid").html(html);
    BindDll();
    cleartxt();
    layer.open({
        title: '新增案例',
        //btn: ['确定', '取消'],
        area: ['540px', '400px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#Add_case"),
    });

  
    var config = {
        '.chosen-select': {},
        '.chosen-select-deselect': {
            allow_single_deselect: true
        },
        '.chosen-select-no-single': {
            disable_search_threshold: 10
        },
        '.chosen-select-no-results': {
            no_results_text: 'Oops, nothing found!'
        },
        '.chosen-select-width': {
            width: "95%"
        }
    }
    for (var selector in config) {
        $(selector).chosen(config[selector]);
    }
}
function cleartxt() {
    $("#Bulletintitle").val('');
    $("#Bulletincontent").val('');
    $("#AddTeamId").val('');
} 

//搜索公告
function Search() {
    GetNoticeList();
}

//绑定班级下拉框
function BindDll() {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: '/Admin/TeacherNoticeboard/GetTeacherList',
        async: false,
        success: function (data) {
            var html = "<option value='0'>请选择班级</option>";
            if (data != null) {
                for (var i = 0; i < data.length; i++) {
                    html += "<option value=" + data[i]["C_ID"] + ">" + data[i]["ClassName"]+ "</option>";
                }
            }
            $("#AddTeamId").html(html);
        }
    })

}

//加载公告栏列表
function GetNoticeList(page) {
    var PageSize = 10;
    $.ajax({
        url: '/Admin/TeacherNoticeboard/GetNoticeList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: {
            "page": page, "PageSize": PageSize, "SelectcheckName": $("#SelectcheckName").val()
        },
        success: function (tb) {
            var html = '';
            var ZT = "";//发布状态
            
            var data = tb.Tb;//转换table
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                   
                    if (data[i]["NoticeState"] == 1) {
                        ZT = "发布";
                    }
                    if (data[i]["NoticeState"] == 0) {
                        ZT = "草稿";
                    }
                    html += '<tr>';
                    html += '<td> <input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["ID"] + '></td>'
                    html += '<td>' + data[i]["NoticeTitle"] + '</td>'

                    //时间
                    var TtoSpace = data[i]["ReleaseTime"] + "";
                    html += '<td>' + TtoSpace.substr(0, 19).replace("T", " ") + '</td>'
                    //公告内容
                    var txtNoticeContent = data[i]["NoticeContent"] + "";
                    if (txtNoticeContent.length > 60) {
                        txtNoticeContent = txtNoticeContent.substr(0, 57) + '...';
                    }
                    html += '<td><span title="' + data[i]["NoticeContent"] + '">' + txtNoticeContent + '</span></td>'
                    html += '<td>' + ZT + '</td>'
                    if (data[i]["NoticeState"] == 1) {
                        html += '<td>--</td>'
                    }
                    if (data[i]["NoticeState"] == 0) {
                        html += '<td> <a onclick="isfb(' + data[i]["ID"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>发布 </td>'
                    }
                   
                    html += '</tr>';
                }
            }
            $("#tablelist").html(html);
            bootstrapPaginator("#PaginatorLibrary", tb, GetNoticeList);//分页
            //样式重新加载
            redload();
        }
    });
}

//添加公告
function AddExamination() {
    var Bulletintitle = $("#Bulletintitle").val();//公告名称
    var Bulletincontent = $("#Bulletincontent").val();//公告内容
    var AddTeamId = $("#AddTeamId").val();//新增班级
    if (trim(Bulletintitle).length == 0) {
        layer.msg('请输入公告标题');
        return;
    }
    if (Bulletintitle.length>30) {
        layer.msg('公告标题限制为30个汉字');
        return;
    }
    if (trim(Bulletincontent).length == 0) {
        layer.msg('请输入公告内容');
        return;
    }
    if (Bulletincontent.length>500) {
        layer.msg('公告内容超出长度限制');
        return;
    }
    if (AddTeamId == "") {
        layer.msg('请选择班级名称');
        return;
    }
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Admin/TeacherNoticeboard/AddBulletincontent',
        data: { "Bulletintitle": Bulletintitle, "Bulletincontent": Bulletincontent, "AddTeamId": AddTeamId + "" },
        success: function (data) {
            if (data == 1) {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                GetNoticeList();
            }
            if (data == 99) {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
            if (data == 88) {
                layer.msg('该考核名称已存在', { icon: 2 });
                return;
            }
        }
    })
}

//发布
function isfb(Noticeid) {
    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Admin/TeacherNoticeboard/UpdateBulletinState',
        data: { "Noticeid": Noticeid },
        success: function (data) {
            if (data == 1) {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                GetNoticeList();
            }
            if (data == 99) {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    })
}

//批量删除弹窗
function del_all() {
    var chks = document.getElementsByName('input[]');//name
    var chkstr = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
        }
    }
    if (chkstr.length == 0) {
        layer.alert('请至少选择一个案例！', {
            skin: 'layui-layer-lan'
            , closeBtn: 0
        });
        return;
    }
    //去除逗号
    chkstr = chkstr.substr(0, chkstr.length - 1);
    layer.confirm('您确认要删除选中的案例吗？', {
        title: '删除案例',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/TeacherNoticeboard/Del',
                data: { "Ids": chkstr },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('操作成功', { icon: 1 });
                        GetNoticeList();
                    } else {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}