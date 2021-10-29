
$(function () {
    bindIngfo();
    SelecCollege();
});

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
function Select() {
    bindIngfo();
}

var SchoolIdS = 0;
//当选中学院时触发查询学院的事件
function SelecCollege() {
    var type = "type";
    var id = $("#ID").val();
    $.ajax({
        url: '/Admin/AddMembers/GetCollege',
        Type: "Post",
        dataType: "json",
        cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "Schoolid": id },
        success: function (data) {
            if (data > 0) {
                SchoolIdS = data;
                $.ajax({
                    url: '/Admin/ClassManagement/GetCollege',
                    Type: "Post",
                    dataType: "json",
                    cache: false,
                    contentType: "application/json; charset=utf-8",
                    data: { "Schoolid": data },
                    success: function (json) {
                        var data = eval(json);
                        var html = "<option value=\"0\">请选学院</option>";
                        for (var i = 0; i < data.length; i++) {
                            html += "<option value=" + data[i].C_ID + ">" + data[i].CollegeName + "</option>";
                        }


                        $("#CollegeNameId").html(html);

                    }

                });
            }

        }

    });

    if (type == "List") {
        SelectGrade();
    }

}

function tuandui() {
    history.go(-2);
}
function shangyiji() {
    history.go(-1);
}


function GetMajor() {

    var type = "List";
    var id = "";
    if (type == "List") {
        id = $("#CollegeNameId option:selected").val();
    } else if (type == "Add") {
        id = $("#AddCollegeNameId option:selected").val();
    }
    else if (type == "Update") {
        id = $("#UpdateCollegeNameId option:selected").val();
    }
    var Schoolid = SchoolIdS;

    $.ajax({
        url: '/Admin/ClassManagement/GetMajor',
        Type: "Post",
        dataType: "json",
        cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "Majorid": id, "Schoolid": Schoolid },
        success: function (json) {
            var data = eval(json);
            var html = "<option value=\"0\">请选择专业</option>";
            for (var i = 0; i < data.length; i++) {
                html += "<option value=" + data[i].M_ID + ">" + data[i].MajorName + "</option>";
            }
            if (type == "List") {
                $("#Majorid").html(html);
            } else if (type == "Add") {
                $("#AddMajorid").html(html);
            }
            else if (type == "Update") {
                $("#UpdateMajorid").html(html);
            }
        }

    });
    if (type == "List") {
        SelectGrade();
    }
}


function bindIngfo(page) {
    ;
    var ID = $("#ID").val();
    var PageSize = 10;

    $.ajax({
        url: '/Admin/AddMembers/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "CollegeNameId": $("#CollegeNameId").val(), "Majorid": $("#Majorid").val(), "Gradeid": $("#Gradeid").val(), "ClassNameid": $("#ClassNameid").val(), "ID": ID },
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

                //html += '<td>' + ((idx * PageSize) + i + 1) + '</td>';
                if (data[i]["states"] == 0) {
                    html += '<td><input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["UserId"] + '></td>';
                }
                else {
                    html += '<td><input type="checkbox" disabled="disabled" class="i-checks" name="input[]" value=' + data[i]["UserId"] + '></td>';
                }
                html += '<td>' + data[i]["CollegeName"] + '</td>';
                html += '<td>' + data[i]["MajorName"] + '</td>';
                html += '<td>' + data[i]["ClassName"] + '</td>';
                html += '<td>' + data[i]["Name"] + '</td>';
                html += '<td>' + data[i]["StudentNo"] + '</td>';
                if (data[i]["states"] == 0) {
                    html += '<td>' + '未加入' + '</td>';
                    html += '<td><a onclick="del(' + "'" + data[i]["UserId"] + "'" + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>添加 </a></td>';
                }
                else {
                    if (data[i]["states"] == ID) {
                        html += '<td>' + '已加入团队' + '</td>';
                        html += '<td>' + "" + '</td>';
                    }
                    else {
                        html += '<td>' + '已有团队' + '</td>';
                        html += '<td>' + "" + '</td>';
                    }
                }
                html += '</tr>';
            }

            $("#tablelist").html(html);
            bootstrapPaginator("#PaginatorLibrary", tb, bindIngfo);//分页
            //样式重新加载
            redload();

        }
    });
}

//批量添加
function del_all() {

    var chks = document.getElementsByName('input[]');//name
    var chkstr = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            chkstr += chks[i].value + ",";
        }
    }


    if (chkstr.length == 0) {
        layer.alert('请选择要加入的数据！', {
            skin: 'layui-layer-lan'
            , closeBtn: 0
        });
        return;
    }
    //去除逗号
    chkstr = chkstr.substr(0, chkstr.length - 1);

    layer.confirm('您确认要添加选中的学生吗？', {
        title: '加入团队',
        btn: ['确定添加', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
    function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: '/Admin/AddMembers/Add',
            data: { "Ids": chkstr, "ID": $("#ID").val() },//多个Id
            success: function (data) {
                if (data == "1") {
                    layer.closeAll();//关闭所有弹出框
                    layer.msg('操作成功', { icon: 1 });
                    bindIngfo();
                }
                if (data == "99") {
                    layer.msg('操作失败', { icon: 2 });
                    return;
                }

            }
        })
    });
}

//单加入
function del(SID) {
    layer.confirm('您确认要添加选中的学生吗？', {
        title: '加入团队',
        btn: ['确定添加', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
 function () {
     $.ajax({
         type: "POST",
         dataType: "text",
         url: '/Admin/AddMembers/Add',
         data: { "Ids": SID, "ID": $("#ID").val() },//多个Id
         success: function (data) {
             if (data == "1") {
                 layer.closeAll();//关闭所有弹出框
                 layer.msg('操作成功', { icon: 1 });
                 bindIngfo();
             }
             if (data == "99") {
                 layer.msg('操作失败', { icon: 2 });
                 return;
             }

         }
     })
 });
}
