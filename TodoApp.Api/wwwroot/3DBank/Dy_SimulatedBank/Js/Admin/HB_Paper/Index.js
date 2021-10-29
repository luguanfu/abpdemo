/***************************************************************
  FileName:货币知识试卷管理 javascript
  Copyright（c）2017-金融教育在线技术开发部
  Author:袁学
  Create Date:2017-4-1
 ******************************************************************/
//复选框 全选样式 控制

function redload() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
    //全选checkbox
    var $checkboxAll = $(".checkbox-all"),
                       $checkbox = $(".new_table").find("[type='checkbox']").not("[disabled]"),
                       length = $checkbox.length,
                       i = 0;
    $checkboxAll.on("ifClicked", function (event) {
        if (event.target.checked) {
            $checkbox.iCheck('uncheck');
            i = 0;
        } else {
            $checkbox.iCheck('check');
            i = length;
        }
    });
}

$(function () {
    bindIngfo();
})

//列表数据加载
function bindIngfo(page) {

    var P_Name = $("#P_Name").val();//试卷名称
  
    var PageSize = 10;

    $.ajax({
        url: '/Admin/HB_Paper/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "P_Name": P_Name, "page": page, "PageSize": PageSize },
        success: function (tb) {

            var html = '';
            var data = tb.Tb;//转换table
            for (var i = 0; i < data.length; i++) {
                html += '<tr>';
                //当前页面
                var idx = 0;
                if (page != "undefined" && page != null) {
                    idx = page;
                    idx = idx - 1;
                }
                var Score = parseFloat(data[i]["Score"]).toFixed(2);

                html += '<td><span class="pie">' + ((idx * PageSize) + i + 1) + '</span></td>';

                var AllType = data[i]["P_Kind"];

                if ($("#UserId").val() == "1") {//当前账户管理员
                    html += '<td><input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["PId"] + '  ></td>';

                } else {
                    //当前登录是教师
                    if (parseInt(AllType) == 1) {//管理新增的
                        html += '<td><input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["PId"] + ' disabled ></td>';
                    }
                    else {
                        //自己曾的
                        html += '<td><input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["PId"] + '  ></td>';
                    }
                }

                html += '<td><span class="pie" >' + data[i]["P_Name"] + '</span></td>';
                html += '<td><span class="pie">' + Score + '</span></td>';

                html += '<td>';

                if ($("#UserId").val() == "1") {//当前账户管理员
                    html += '<a href="javascript:void(0);" onclick="Edit(' + data[i]["PId"] + ')" class=" btn-primary btn-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a> ';
                    html += '<a style="margin-left: 5px;" onclick="SetPaperpreview(' + data[i]["PId"] + ',1)" href="javascript:void(0);" class=" btn-info btn-sm"><i class="fa fa-lightbulb-o m-r-xxs"></i>预览及微调 </a>';

                } else {
                    //当前登录是教师
                    if (parseInt(AllType) == 1) {//管理新增的
                        html += '<a href="javascript:void(0);" onclick="Edit(' + data[i]["PId"] + ')"  class=" btn-primary btn-sm disabled"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a> ';
                        html += '<a style="margin-left: 5px;" onclick="SetPaperpreview(' + data[i]["PId"] + ',1)" href="javascript:void(0);" class=" btn-info btn-sm disabled"><i class="fa fa-lightbulb-o m-r-xxs"></i>预览及微调 </a>';
                    }
                    else {
                        //自己曾的
                        html += '<a href="javascript:void(0);" onclick="Edit(' + data[i]["PId"] + ')" class=" btn-primary btn-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a> ';
                        html += '<a style="margin-left: 5px;" onclick="SetPaperpreview(' + data[i]["PId"] + ',1)" href="javascript:void(0);" class=" btn-info btn-sm"><i class="fa fa-lightbulb-o m-r-xxs"></i>预览及微调 </a>';
                    }
                }

                
                html += '</td>';
                html += '</tr>';

            }
            $("#tablelist").html(html);

            bootstrapPaginator("#PaginatorLibrary", tb, bindIngfo);//分页
            //样式重新加载
            redload();

        }
    });
}

//搜索
function searchinfo() {
    //if (UserType != "0") {
        bindIngfo();
   // }
}

var MPId = 0;
//编辑试卷名称
function Edit(PId, P_Kind) {
    EditFormRest();
    layer.open({
        type: 1,
        title: '编辑',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['450px', '280px'], //宽高
        content: $("#Edit")
    });
    MPId = PId;
    GetListById(PId);

}


//预览编辑 PId试卷Id Type1允许微调 2只能预览
function SetPaperpreview(PId, Type) {
    window.location.href = '/Admin/HB_Paperpreview/Index?PId=' + PId + '&Type=' + Type;
}

//编辑时信息读取
function GetListById(PId) {
    $.ajax({
        Type: "post",
        dataType: "json",
        url: '/Admin/HB_Paper/GetListById?PId=' + PId,
        async: false,
        success: function (data) {
            if (data.length > 0) {

                $("#EditP_Name").val(data[0]["P_Name"]);
                var P_IsOrder = data[0]["P_IsOrder"];

                document.getElementById("P_IsOrderA").checked = false;
                $("#P_IsOrderA").parent().removeClass('checked');
                document.getElementById("P_IsOrderB").checked = false;
                $("#P_IsOrderB").parent().removeClass('checked');

                if (P_IsOrder == "1") {
                    document.getElementById("P_IsOrderA").checked = true;
                    $("#P_IsOrderA").parent().addClass('checked');
                }
                if (P_IsOrder == "0") {
                    document.getElementById("P_IsOrderB").checked = true;
                    $("#P_IsOrderB").parent().addClass('checked');
                }
            }
        }
    });
}

//编辑 保存
function EditBtnSubim() {
    var EditP_Name = $("#EditP_Name").val();

    var IsOrder = $('input[name="IsOrder"]:checked').val();


    if (EditP_Name.length == 0) {
        layer.msg('请输入试卷名称！', function () { });
        return;
    }

    //表单提交
    $("#Editform").ajaxSubmit({
        type: "post",
        url: '/Admin/HB_Paper/Edit?PId=' + MPId + "&IsOrder=" + IsOrder,
        data: $("#Editform").serialize(),
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                bindIngfo();
                layer.msg('操作成功', { icon: 1 });
            }
            if (data == "88") {
                layer.msg('试卷名称已经存在！', function () { });
                return;
            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }
        }
    });
}

//编辑取消
function EditFormRest() {
    layer.closeAll();//关闭
    $('#Editform')[0].reset();//清空表单数据
}

//批量删除
function del_all() {
    var chks = document.getElementsByName('input[]');//name
    var chkstr = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
        }
    }

    if (chkstr.length == 0) {
        layer.msg('请选择要删除的数据！', function () { });
        return;
    }

    chkstr = chkstr.substr(0, chkstr.length - 1);

    var titlecont = '您确定要删除所选试卷吗？';
    
    layer.confirm(titlecont, {
        title: '删除',
        btn: ['确定', '取消'],
        shadeClose: true, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/HB_Paper/DelPaper',
                data: { "Ids": chkstr },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        bindIngfo();
                        layer.msg('操作成功', { icon: 1 });

                    }
                    if (data == "99") {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}

//导入
function PaperImport() {
    $("#FileName").val('');
    jQuery('#ImportDIV').modal('show', { backdrop: 'static' });
}

//下载导入模板
function DownloadTemplates() {
    window.open('/Export/理论知识试卷导入模版.xls');
}
//导入excel
function btnImport() {
    var docObj = document.getElementById("FileName");

    //上传文件校验只能是excel
    if (docObj.files && docObj.files[0]) {
        var f = docObj.files;
        var exltype = f[0].name;//获取文件名
        var exp = /.xls$|.xlsx$/;
        if (exp.exec(exltype) == null) {
            layer.msg('上传格式错误（仅支持.xls和.xlsx文件）', { icon: 2 });
            return;
        }
    }
    else {
        layer.msg('请选择上传文件！', function () { });
        return;
    }

    //提交
    $("#Importform").ajaxSubmit({
        type: "post",
        dataType: "json",
        url: '/ashx/hbExport.ashx?action=HBZS_PaperImport',
        data: $("#Importform").serialize(),
        success: function (data) {
            if (data[0]["error"] == "") {//正常结束
                layer.closeAll();//关闭所有弹出框
                bindIngfo();

                $("#FileName").val('');
                jQuery('#ImportDIV').modal('hide');
                var success = data[0]["success"];//成功导入多少道

                layer.msg('试卷导入成功！题库同步更新题目' + success + '道！', { icon: 1 });


            }
            else {
                layer.msg(data[0]["error"], { icon: 2 });
                return;
            }
        }
    });

}

//导出excel
function PaperExport() {

    var chks = document.getElementsByName('input[]');//name

    var chkstr = "";
    var countnum = 0;
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr = chks[i].value;
            countnum++;
        }
    }
    if (countnum == 0) {
        layer.msg('请选择要导出的试卷！', function () { });
        return;
    }
    if (countnum > 1) {
        layer.msg('只能勾选一张试卷！', function () { });
        return;
    }

    $.ajax({
        Type: "post",
        dataType: "json",
        url: '/Admin/HB_Paper/Export',
        data: { "Pid": chkstr },
        async: false,
        success: function (data) {

            $("#downFile").attr("href", "/Ashx/download.ashx?downurl=" + data[0]["filename"]);
            $("#tf").click();
        }
    });

}
