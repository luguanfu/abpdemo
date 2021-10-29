$(function () {

    bindDataMain();

    //Gjbd();
})
function onchangeselect() {
    var Majorid = $("#Majorid option:selected").val();
    var aid = $("#aid").val();
    $.ajax({
        url: '/Admin/Teachinghours/Settimelong',
        Type: "Post",
        dataType: "json",
        async: true,
        contentType: "application/json; charset=utf-8",
        data: { "aid": aid, "type": Majorid },
        success: function (data) {
        }
    });
}

function Reset() {
    layer.confirm('您确定要重置课时安排吗？', {
        title: '恢复默认',
        btn: ['确定', '取消'],
        shadeClose: true, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            //var aid = $("#aid").val();
            var cid = getQueryString("cid");
         
            var chkstr = ""; var cks = "";
            for (var ic = 0; ic < datalenth; ic++) {
                var chks = document.getElementsByName('inputTo[' + ic + ']');//name

                for (var i = 0; i < chks.length; i++) {
                    if (chks[i].checked == true) {
                        var sd = chks[i].value;
                        sd = sd.split(':');
                        chkstr += sd[1] + ",";
                    }
                }
            }
            if (chkstr.length == 0) {
                layer.msg('请选择要编辑章节！', function () { });
                return;
            }

            chkstr = chkstr.substr(0, chkstr.length - 1);

            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/Admin/Teachinghours/ResetSetingForAid',
                data: { "cid": cid, "chkstr": chkstr },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.closeAll();//关闭所有弹出框
                        bindDataMain();
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
function onchanges(values) {
    var aid = $("#aid").val();
    if (values == 0) {
        $("#Majorid").attr("disabled", "disabled");
    } else {
        $("#Majorid").removeAttr("disabled");
    }
    $.ajax({
        url: '/Admin/Teachinghours/SetOpenyuxi',
        Type: "Post",
        dataType: "json",
        async: true,
        contentType: "application/json; charset=utf-8",
        data: { "aid": aid, "type": values },
        success: function (data) {
        }
    });
}
var datalenth = 0;

function bindDataMain() {
    var cid = $("#cid").val();
    var sid = $("#sid").val();
    var aid = $("#aid").val();
    $.ajax({
        url: '/Admin/Teachinghours/GetChapterList',
        Type: "Post",
        dataType: "json",
        async: true,
        contentType: "application/json; charset=utf-8",
        data: { "sid": sid, "cid": cid, "aid": aid },
        success: function (data) {
            var html = "";
            //sum = data.length
            var len = data.length;
            datalenth = len;
            for (var i = 0; i < data.length; i++) {
                var tablename = "tablelist" + i;
                //当前页
                var chk = "inputTo[" + i + "]";
                var ckhs = "'inputTo[" + i + "]'";
                html += ' <table class="table text-center table-bordered ">'
                html += '     <thead>'
                html += '         <tr>'
                html += '             <th class="text-center">'
                html += '                 <input type="Checkbox" onclick="selectAll(this.checked,' + ckhs + ')">'
                html += '         </th>'
                html += '                 <th class="text-left">' + data[i]["ResourcesName"] + '</th>'
                html += '                 <th class="text-center">开课时间</th>'
                html += '   <th class="text-center">操作</th>   </tr>'
                html += ' </thead>'
                html += '         <tbody class="new_table text-center"  id="' + tablename + '">'
                $.ajax({
                    url: '/Admin/Teachinghours/GetSectionList',
                    Type: "Post",
                    dataType: "json",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    data: { "gid": data[i]["ID"], "aid": aid, "cid": getQueryString("cid") },
                    success: function (data) {
                        for (var ic = 0; ic < data.length; ic++) {
                            html += '<tr>';
                            html += '<td  width="80"><input type="checkbox"  name="' + chk + '" value="' + data[ic]["ID"] + ':' + data[ic]["section_id"] + '"></td>';
                            html += '<td  class="text-left"><span class="pie">' + data[ic]["SectionName"] + '</span></td>';
                            html += '<td width="220"><span class="pie">' + (data[ic]["open_time_str"] == null ? "未安排" : new Date(data[ic]["open_time_str"]).Format("yyyy-MM-dd HH:mm")) + '</span></td>';
                            var openstr = "'" + (data[ic]["open_time_str"] == null ? "" : data[ic]["open_time_str"]) + "'";
                            html += '<td width="180"> <a onclick="EditX(' + data[ic]["ID"] + ',' + openstr + ',' + data[ic]["section_id"] + ')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>'
                            html += '</td>'
                            html += '</tr>';
                        }
                    }
                });
                html += '</tbody > '
                html += ' </table>'
            }

            $("#tableList").html(html);

            //样式重新加载
            redload();


        }
    });
    var strrodio = $("#isPreview").val();
    $("input[name='danxuan']").each(function () {
        if ($(this).val() == strrodio) {
            $(this)[0].checked = true;
            return true;
        }
    })
    if (strrodio == 1) {
        $("#Majorid").removeAttr("disabled");
    } else {
        $("#Majorid").attr("disabled", "disabled");
    }
    var str = $("#Preview_time").val();
    $("#Majorid").val(str);
}
function EditX(id, openstr, Sid) {

    $("#start_time").val("");
    if (openstr != "" && openstr != "未安排") {
        $("#start_time").val(new Date(openstr).Format("yyyy-MM-dd HH:mm"));
    }
    $("#sids").val(id);
    $("#Sid").val(Sid);
    layer.open({
        type: 1,
        title: '开课时间',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['500px', '300px'], //宽高
        content: $("#Add_baodan1")
    });
}

function EditList() {
    var chkstr = "";
    var chkstr_Sid = ""
    for (var ic = 0; ic < datalenth; ic++) {
        var chks = document.getElementsByName('inputTo[' + ic + ']');//name

        for (var i = 0; i < chks.length; i++) {
            if (chks[i].checked == true) {
                //chkstr += chks[i].value + ",";
                var sd = chks[i].value;
                sd = sd.split(':');
                chkstr += sd[0] + ",";
                chkstr_Sid += sd[1] + ",";
            }
        }
    }
    if (chkstr.length == 0) {
        layer.msg('请选择要编辑章节！', function () { });
        return;
    }

    chkstr = chkstr.substr(0, chkstr.length - 1);
    chkstr_Sid = chkstr_Sid.substr(0, chkstr_Sid.length - 1);

    $("#start_time").val("");
    $("#sids").val(chkstr);
    $("#Sid").val(chkstr_Sid);
    layer.open({
        type: 1,
        title: '开课时间',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['500px', '300px'], //宽高
        content: $("#Add_baodan1")
    });
}
function Bj() {
    var sids = $("#sids").val();
    var sectionId = $("#Sid").val();
    var open_time = $("#start_time").val();
    $.ajax({
        url: '/Admin/Teachinghours/UpdateOpenTime',
        Type: "Post",
        dataType: "json",
        async: true,
        contentType: "application/json; charset=utf-8",
        data: { "sids": sids, "open_time": open_time, "cid": getQueryString("cid"), "CourseId": getQueryString("sid"), "sectionId": sectionId },
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                bindDataMain();

                layer.msg('操作成功', { icon: 1 });
            } else {
                layer.msg('操作失败', { icon: 2 });
            }
        }
    });


}
function selectAll(selectStatus, chk) {//传入参数（全选框的选中状态）
    //根据name属性获取到单选框的input，使用each方法循环设置所有单选框的选中状态
    if (selectStatus) {
        $("input[name='" + chk + "']").each(function (i, n) {
            n.checked = true;
        });
    } else {
        $("input[name='" + chk + "']").each(function (i, n) {
            n.checked = false;
        });
    }
}

//function Reset() {
//    layer.confirm('您确定要重置课时安排吗？', {
//        title: '删除',
//        btn: ['确定', '取消'],
//        shadeClose: true, //开启遮罩关闭
//        skin: 'layui-layer-lan'
//        //按钮
//    },
//        function () {
//            var cid = getQueryString("cid");//班级id
//            var chkstr = ""; var cks = "";
//            for (var ic = 0; ic < datalenth; ic++) {
//                var chks = document.getElementsByName('inputTo[' + ic + ']');//name

//                for (var i = 0; i < chks.length; i++) {
//                    if (chks[i].checked == true) {
//                        var sd = chks[i].value;
//                        sd = sd.split(':');
//                        chkstr += sd[1] + ",";
//                    }
//                }
//            }
//            if (chkstr.length == 0) {
//                layer.msg('请选择要编辑章节！', function () { });
//                return;
//            }

//            chkstr = chkstr.substr(0, chkstr.length - 1);

//            $.ajax({
//                type: "POST",
//                dataType: "text",
//                url: '/Admin/Teachinghours/ResetSetingForAid',
//                data: { "cid": cid, "chkstr": chkstr },//多个Id
//                success: function (data) {
//                    if (data == "1") {
//                        layer.closeAll();//关闭所有弹出框
//                        bindDataMain();
//                        layer.msg('操作成功', { icon: 1 });

//                    }
//                    if (data == "99") {
//                        layer.msg('操作失败', { icon: 2 });
//                        return;
//                    }

//                }
//            })
//        });
//}
