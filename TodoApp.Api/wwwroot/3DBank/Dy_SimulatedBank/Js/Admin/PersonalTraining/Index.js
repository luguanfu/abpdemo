$(function () {
    bindIngfo();
});


// JS 获取URL参数方法
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


//列表数据加载 
function bindIngfo(page) { 
    var PageSize = 10; 
    $.ajax({
        url: '/Admin/PersonalTraining/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "EName": $("#E_Name").val(), "AllType": getQueryString("AllType") },
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
                var state = data[i]["PracticeState"];
                if (state == 1) {
                    state = "激活";
                }
                else {
                    state = "未激活";
                }
                html += '<td><input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["ID"] + '></td>';
                html += '<td>' + data[i]["PracticeName"] + '</td>';
                var PracticeStarTime = data[i]["PracticeStarTime"] + "";
                html += '<td>' + PracticeStarTime.substr(0, 19).replace('T', ' ') + '</td>';
                html += '<td>' + data[i]["PracticeLong"] + '</td>';
                html += '<td>' + (data[i]["Type_All"]=="2"?'练习模式':'考试模式' )+'</td>';
                html += '<td>' + state + '<input type="hidden"  id="IsStateId' + data[i]["ID"] + '" value="' + data[i]["PracticeState"] + '"/></td>';
              
                html += '<td>';
                html += '<a  href="javascript:void(0);"onclick="seturl(' + data[i]["ID"] + ',' + data[i]["PracticeState"] +')" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a>';
                html += '<a style="margin-left: 5px;" href="javascript:void(0);" onclick="del(' + data[i]["ID"] + ')" class=" btn-warning btn-sm"><i class="fa fa-trash-o m-r-xxs"></i>删除 </a></td>';
                html += '</tr>';
            } 
            if (html.length == 0) {
                html += "<tr><td colspan='10' style='height:100px;'>暂无数据！</td></tr>";
            }
            $("#tablelist").html(html);
            bootstrapPaginator("#PaginatorLibrary", tb, bindIngfo);//分页
            //样式重新加载
            redload(); 
        }
    });
}

//编辑跳转
function seturl(ID, PracticeState) {
    if (PracticeState == "1") {//
        layer.msg('请先关闭激活！', function () { });
        return;

    }
    window.location.href = '/Admin/PersonalTraining/Add?PracticeId=' + ID + '&AllType=' + getQueryString("AllType");
    return;
}


//查询
function SearchInfo() {
    bindIngfo();
}

function UpdateState(state) {
    var PracticeState = state;
    var chks = document.getElementsByName('input[]');//name
    var ids = "";
    var ds = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            ids += chks[i].value + ",";
            ds += $(chks[i]).attr("data_enabledstate");
        }
    }

    if (ids.length == 0) {
        layer.alert('请至少选择一条数据！', {
            skin: 'layui-layer-lan'
            , closeBtn: 0
        });
        return;
    }
    //去除逗号
    ids = ids.substr(0, ids.length - 1);
    $.ajax({
        url: '/Admin/PersonalTraining/UpdateState',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "PracticeState": PracticeState,"Ids": ids },
        success: function (tb) {
            if (tb == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('操作成功', { icon: 1 });
                bindIngfo();
            }
            else {
                layer.msg('操作失败！', { icon: 2 });
                return;
            }
          
        }
    });
}

function Delete() {
    var chks = document.getElementsByName('input[]');//name
    var ids = "";
    var ds = "";
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            ids += chks[i].value + ",";
            ds += $(chks[i]).attr("data_enabledstate");
        }
    }

    if (ids.length == 0) {
        layer.alert('请至少选择一条数据！', {
            skin: 'layui-layer-lan'
            , closeBtn: 0
        });
        return;
    }
    //去除逗号
    ids = ids.substr(0, ids.length - 1);
    layer.confirm('您确定要删除所选考核吗？', {
        title: '系统提示',
        btn: ['确定', '取消'],
        shadeClose: true, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
    $.ajax({
        url: '/Admin/PersonalTraining/deletePractice',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "Ids": ids },
        success: function (tb) {
            if (tb == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('删除成功', { icon: 1});

                bindIngfo();
            }
            else {
                layer.msg('删除失败！', { icon: 2 });
                return;
            }
            
        }
       });
    });

}

function del(ID) {
    layer.confirm('您确定要删除所选考核吗？', {
        title: '系统提示',
        btn: ['确定', '取消'],
        shadeClose: true, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
    $.ajax({
        url: '/Admin/PersonalTraining/deletePractice',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "Ids": ID },
        success: function (tb) {
            if (tb == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('删除成功', { icon: 1 });
                bindIngfo();
            }
            else {
                layer.msg('删除失败！', { icon: 2 });
                return;
            }
            
        }
    });
    });
}
