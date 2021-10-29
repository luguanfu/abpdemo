/***************************************************************
  FileName:学生端 人身险 展业 表单 010201 客户家庭财产信息分析 javascript
  Copyright（c）2018-金融教育在线技术开发部
  Author:李森林
  Create Date:2018-05-9
 ******************************************************************/


$(function () {
    Bindlist();
    bindInfo();
})
//下拉框绑定
function Bindlist() {
    $.ajax({
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "/Sys_FormItemTM/Bind",//url
        data: {},
        async: false,
        success: function (data) {
            var html = '';
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {                  
                    html += '<option value="' + data[i]["ID"] + '">' + data[i]["ModularName"] + '</option>';
                }
                $("#txtModeId").append(html);
            }
        }
    });
}


function redload() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });


    //全选checkbox
    var $checkboxAll = $("i-checks checkbox-all"),
                       $checkbox = $(".new_table text-center").find("[type='Checkbox']").not("[disabled]"),
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
    ///////////////////////////////////////////
    //tr 添加css 鼠标手势样式
    $("#tablelist tr").bind('mouseover', function () {
        $(this).css('cursor', 'pointer');
    });

    //绑定列表 行选中事件
    $("#tablelist tr").click(function () {
        $("#tablelist tr").removeClass('trSelected');//去除所有样式
        $(this).addClass('trSelected');//为当前行添加样式

        $("#tablelist tr").find('input').iCheck('uncheck');//去掉所有复选框选中
        $(this).find('input').iCheck('check');//为当前复选框添加选中

        //右边table列表数据改变
        selectId = $(this).find('input').val();
        bindInfoR();

        rowsall = parseInt($(this).find('td').eq(0).html()) - 1;
        allclassname = $(this).find('td').eq(2).html();
        
        $("#totxtClass_Code").val($(this).find('td').eq(3).html());
        rowsall = rowsall % 10;
    });

    $("#tablelist tr").eq(rowsall).click();

}
var FromID="";
var selectId = 0;
var allpage = 0;
var rowsall = 0;
var allclassname = "";
//左边列表数据加载
function bindInfo(page) {
    var PageSize = 10;
    allpage = page;
   
    $.ajax({
        Type: "post",
        dataType: "json",
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: '/Sys_FormItemTM/GetList',
        data: { "page": page, "PageSize": PageSize, "txtSearch": $("#txtSearch").val(), "ModeId": $("#txtModeId").val() },//新增下拉框搜索
        success: function (tb) {
            var html = "";
            var data = tb.Tb;//转换成table
            if (tb != null && tb.Total != 0) {//数据不为空
                for (var i = 0; i < data.length; i++) {

                    html += '<tr>';

                    //当前页面
                    var idx = 0;
                    if (page != "undefined" && page != null) {
                        idx = page;
                        idx = idx - 1;
                    }

                    html += '<td  width="50">' + ((idx * PageSize) + i + 1) + '</td>';
                    html += '<td  width="80"><input type="checkbox"  disabled="disabled" class="i-checks" name="input[]" value="' + data[i]["TMNO"] + '"></td>';
                    if (data[i]["ParentId"] == "0") {                      
                        html += '<td><b>' + data[i]["TMName"] + '</b></td>';
                    }
                    else {
                        html += '<td>' + data[i]["TMName"] + '</td>';
                    }                 
                    html += '<td>' + data[i]["TMNO"] + '</td>';                  
                    html += '</tr>';
                    selectId += data[i]["TMNO"];
                }
            }
            $("#tablelist").html(html);//数据填充
            //分页控件加载
            bootstrapPaginator("#PaginatorLibrary", tb, bindInfo);//分页
            redload();//加载样式
        }

    })


}


//右边列表数据加载
function bindInfoR(page) {
    var Pagesize = 10;
    
    var TM_NOId = selectId;

    $.ajax({
        Type: "post",
        dataType: "json",
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: '/Sys_FormItemTM/GetListR',
        data: { "page": page, "PageSize": Pagesize, "TM_NOId": TM_NOId, "TName": $("#txtSearchR").val() },
        success: function (tb) {
            
            var html = " ";
            var data = tb.Tb;//转换表格
            if (tb != null && tb.Total != 0) {
                for (var i = 0; i < data.length; i++) {

                    html += '<tr>';

                    //当前页
                    var idx = 0;
                    if (page != "undefined" && page != null) {
                        idx = page;
                        idx = idx - 1;
                    }

                    html += '<td  width="50"><span class="pie">' + ((idx * Pagesize) + i + 1) + '</span></td>';
                    html += '<td  width="80"><input type="checkbox" class="i-checks" name="inputTo[]" value="' + data[i]["ID"] + '"></td>';
                    html += '<td><span class="pie">' + data[i]["Title"] + '</span></td>';
                    html += '<td><span class="pie">' + data[i]["ControlName"] + '</span></td>';
                    if (parseInt(data[i]["ISRequired"]) ==1) {
                        html += '<td><span class="pie">是</span></td>';
                    }
                    else {
                        html += '<td><span class="pie">否</span></td>';
                    }
                    html += '</tr>';
                    
                }
            }
            $("#tablelistTo").html(html);
            //分页控件加载
            bootstrapPaginator("#PaginatorLibrary2", tb, bindInfoR);//分页
            //样式重新加载
            $('.i-checks').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            });


            var $checkboxAllTo = $(".checkbox-allTo"),
                $checkboxTo = $(".new_tableTo").find("[type='checkbox']").not("[disabled]"),
                lengthTo = $checkboxTo.length,
                iTo = 0;
            $checkboxAllTo.on("ifClicked", function (event) {
                if (event.target.checked) {
                    $checkboxTo.iCheck('uncheck');
                    iTo = 0;
                } else {
                    $checkboxTo.iCheck('check');
                    iTo = lengthTo;
                }
            });
        }
    })
}


//新增弹框
function AddInfoTo() {
    FormRestTo();
    layer.open({
        type: 1,
        title: '新增',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['450px', '300px'], //宽高
        content: $("#AddTo")
    });
    $("#toTypeName").html(allclassname);
    
}

function FormRestTo() {
    layer.closeAll();//关闭
    $('#AddformTo')[0].reset();//清空表单数据

}

//新增
function BtnSubimTo() {

    var F_Title = $("#txtDic_Name").val();
    var F_ControlName = $("#txtDic_Value").val();   
    var F_FromID = $("#totxtClass_Code").val();
    var F_ADISRequired = $("#ADISRequired").val();

    if (F_Title.length == 0) {
        layer.msg("请输入中文名称");
        return;
    }
    if (F_ControlName.length == 0) {
        layer.msg("请输入英文名称");
        return;
    }
    var TM_NOId = selectId;
    //表单提交
    $("#AddformTo").ajaxSubmit({
        type: "post",
        url: '/Sys_FormItemTM/AddR?FormId=' + TM_NOId,
        data: $("#AddformTo").serialize(),
        success: function (data) {
            if (data == "1") {
                
                layer.closeAll();//关闭所有弹出框
                bindInfoR();
                layer.msg('操作成功', { icon: 1 });
            }

            if (data == "99") {
                layer.msg('操作失败，插入重复数据或格式错误', { icon: 2 });
                return;
            }
        }
    });
}

//删除
function del_all() {
   
    var chks = document.getElementsByName('inputTo[]');//获得所有按钮的name值
    var chksr = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chksr += chks[i].value + ",";
        }
    }

    if (chksr.length == 0) {
        layer.msg('请选择要删除的数据！');
        return;
    }

    chksr = chksr.substr(0, chksr.length - 1);

    layer.confirm('您确定要删除吗？', {
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
                url: '/Sys_FormItemTM/Del',
                data: { "Ids": chksr },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        bindInfoR();
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

var MIdTo = 0;
//编辑
function EditInfoTo() {

   
    
    var chks = document.getElementsByName('inputTo[]');//name
    var chkstr = "";
    var n = 0;
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
            n++;
        }
    }

    if (n == 0) {
        layer.msg('请选择要修改的数据！', function () { });
        return;
    }
    if (n > 1) {
        layer.msg('只能选择一行！', function () { });
        return;
    }
    EditFormRestTo();
    layer.open({
        type: 1,
        title: '编辑',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['450px', '300px'], //宽高
        content: $("#EditTo")
    });
    $("#EdittoTypeName").html(allclassname);

    chkstr = chkstr.substr(0, chkstr.length - 1);

    GetListByIdTo(chkstr);
    MIdTo = chkstr;
}

//编辑时信息读取
function GetListByIdTo(Id) {
    $.ajax({
        Type: "post",
        dataType: "json",
        url: '/Sys_FormItemTM/GetListTableID?Id=' + Id,
        async: false,
        success: function (data) {
            if (data.length > 0) {

                $("#EdittxtDic_Name").val(data[0]["Title"]);
                $("#EdittxtDic_Value").val(data[0]["ControlName"]);
                $("#EDISRequired").val(data[0]["ISRequired"])
            }
        }
    });
}

//编辑 保存
function EditBtnSubimTo() {
    var Titel = $("#EdittxtDic_Name").val();
    var CN = $("#EdittxtDic_Value").val();
    var EDISRequired = $("#EDISRequired").val();


    if (txtDic_Name.length == 0) {
        layer.msg('请输入中文名称！', function () { });
        return;
    }
    if (txtDic_Value.length == 0) {
        layer.msg('请输入英文名称！', function () { });
        return;
    }


    var TM_NOId = selectId;

    //表单提交
    $("#EditformTo").ajaxSubmit({
        type: "post",
        url: '/Sys_FormItemTM/Edit?Id=' + MIdTo + '&FormId=' + TM_NOId,
        data: $("#EditformTo").serialize(),
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                bindInfoR();
                layer.msg('操作成功', { icon: 1 });
            }

            if (data == "99") {
                layer.msg('操作失败,操作数据未发生改变', { icon: 2 });
                return;
            }
        }
    });
}

function EditFormRestTo() {
    layer.closeAll();//关闭
    $('#EditformTo')[0].reset();//清空表单数据
}


//导入
//批量新增学生
function AllAdd() {
    //$("#Addform")[0].reset();
    var Classid = $("#Classhiddenid").val();
    layer.open({
        title: '批量新增学生',
        btn: ['确定', '取消'],
        area: ['450px', '230px'],
        type: 1,
        skin: 'layui-layer-lan', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#AllAdd_Student"),
        yes: function (index, layero) {
            var docObj = document.getElementById("file_excel");
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

            $('#form_Execl').ajaxSubmit({
                url: "/Sys_FormItemTM/Upload",
                type: "POST",
                dataType: "json",
                data: $('#form_Execl').serialize(),
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('导入成功', { icon: 1 });                      
                        bindInfoR();
                    }
                    if (data == "99") {
                        layer.closeAll();//关闭所有弹出框
                        layer.msg('导入失败,加入重复数据或格式错误', { icon: 2 });                       
                        bindInfoR();
                    }
                }
            });

        },
        end: function (index, layero) {
            //表单清空
            //$("#Addform")[0].reset();
        }
    });
    $("#AddE_PId_chosen").css("width", "190px");
}


//Execl获取
function but_Execl() {
    $('#file_excel').click();
    $('#file_excel').change(function (e) {
        $("#ExcelName").html($(this).val().split('\\')[$(this).val().split('\\').length - 1]);
    })
}

//导出
function BtnExport() {

    var TM_NOId = selectId;
    
    $.ajax({
        url: '/Sys_FormItemTM/GetExport',
        Type: "post",
        dataType: "Text", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "TName": $("#txtSearchR").val(), "TM_NOId": TM_NOId },
        success: function (downRes) {
            $("#downFile").attr("href", "/Ashx/download.ashx?downurl=" + downRes);
            $("#fp").click();
        }
    });
}

