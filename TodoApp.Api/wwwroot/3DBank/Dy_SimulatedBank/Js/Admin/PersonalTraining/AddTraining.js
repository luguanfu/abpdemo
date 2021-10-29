$(function () {
    TrainingTaskList();
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
function redload1() {
    $('.i-checks1').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
    //全选checkbox
    var $checkboxAll = $(".checkbox-all1"),
        $checkbox = $(".new_table1").find("[type='checkbox']").not("[disabled]"),
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




function AlterArea() {
  
    layer.open({
        title: '请选择考核任务',
        area: ['850px', '460px'],
        type: 1,
        skin: 'layui-layer-blue', //样式类名
        closeBtn: 1, //显示关闭按钮
        anim: 2,
        shadeClose: false, //关闭点击遮罩关闭，true为打开遮罩关闭
        content: $("#khxm"),
        success: function (layero, index) {
            GetTaskList();
        },

    });
}
// JS 获取URL参数方法
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//勾选案例新增
function AddPracticeTasks() {

    var chks = document.getElementsByName('input[]');//name
    var ids = "";

    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            ids += chks[i].value + ",";
         
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
        type: "POST",
        dataType: "text",
        url: '/Admin/PersonalTraining/AddPracticeTasks',
        data: { "ids": ids, "PracticeId": getQueryString("PracticeId") },
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('添加成功', { icon: 1 });
                TrainingTaskList();
            }
           
            if (data == "99") {
                layer.msg('添加失败', { icon: 2 });
                return;
            }
            if (data == "0") {
                layer.msg('添加失败', { icon: 2 });
                return;
            }

        }
    });

}


function TrainingTaskList(page) {
 
    var PageSize = 10;
    $.ajax({
        url: '/Admin/PersonalTraining/GetPracticeTasksList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "PracticeId": getQueryString("PracticeId") },
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
                var SState = "";
                var StartScene = data[i]["StartScene"];
                if (StartScene == 1) {
                    SState = "开启";
                }
                else {
                    SState = "未开启";
                }
                var HScene = "";
                var HallScene = data[i]["HallScene"];
                if (HallScene == 1) {
                    HScene = "开启";
                }
                else {
                    HScene = "未开启";
                }
                var CScene = "";
                var CounterScene = data[i]["CounterScene"];
                if (CounterScene == 1) {
                    CScene = "开启";
                }
                else {
                    CScene = "未开启";
                }
                var EScene = "";
                var EndScene = data[i]["EndScene"];
                if (EndScene == 1) {
                    EScene = "开启";
                }
                else {
                    EScene = "未开启";
                }
               
                var PState = "";
                var PublicState = data[i]["PublicState"];
                if (PublicState == 1) {
                    PState = "公开案例";
                }
                else {
                    PState = "隐藏案例";
                }

                html += '<td><input type="checkbox" class="i-checks" name="inputs[]" value=' + data[i]["ID"] + '></td>';
                html += '<td>' + data[i]["TaskName"] + '</td>';
                html += '<td>' + data[i]["LoginNo"] + '</td>';
                html += '<td>' + SState + '</td>';
                html += '<td>' + HScene + '</td>'; 
                html += '<td>' + CScene + '</td>';
                html += '<td>' + EScene + '</td>'; 
                html += '<td>' + data[i]["KeHuNum"] + '</td>';
                html += '<td>' + PState + '</td>'; 
                html += '</tr>';
            }
            if (html.length == 0) {
                html += "<tr><td colspan='10' style='height:100px;'>暂无数据！</td></tr>";
            }
            $("#tablelist").html(html);
            bootstrapPaginator("#PaginatorLibrary", tb, TrainingTaskList);//分页
            //样式重新加载
            redload();
        }
    });
}

//弹出窗口列表查询
function SearchInfo() {
    GetTaskList()
}

//获取任务列表
function GetTaskList(page) {
    var PageSize = 5;

    $.ajax({
        url: '/Admin/PersonalTraining/GetTaskList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "Task_Name": $("#Task_Name").val(), "PracticeId": getQueryString("PracticeId")  },
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
                var SState = "";
                var StartScene = data[i]["StartScene"];
                if (StartScene == 1) {
                    SState = "开启";
                }
                else {
                    SState = "未开启";
                }
                var HScene = "";
                var HallScene = data[i]["HallScene"];
                if (HallScene == 1) {
                    HScene = "开启";
                }
                else {
                    HScene = "未开启";
                }
                var CScene = "";
                var CounterScene = data[i]["CounterScene"];
                if (CounterScene == 1) {
                    CScene = "开启";
                }
                else {
                    CScene = "未开启";
                }
                var EScene = "";
                var EndScene = data[i]["EndScene"];
                if (EndScene == 1) {
                    EScene = "开启";
                }
                else {
                    EScene = "未开启";
                }

                var PState = "";
                var PublicState = data[i]["PublicState"];
                if (PublicState == 1) {
                    PState = "公开案例";
                }
                else {
                    PState = "隐藏案例";
                }

                if (parseInt(data[i]["isto"]) > 0) {
                    html += '<td><input type="checkbox" class="i-checks1" disabled="disabled"  name="input[]" value=' + data[i]["ID"] + '></td>';
                }
                else {
                    html += '<td><input type="checkbox" class="i-checks1"  name="input[]" value=' + data[i]["ID"] + '></td>';
                }
                html += '<td>' + data[i]["TaskName"] + '</td>';
                html += '<td>' + data[i]["LoginNo"] + '</td>';
                html += '<td>' + SState + '</td>';
                html += '<td>' + HScene + '</td>';
                html += '<td>' + CScene + '</td>';
                html += '<td>' + EScene + '</td>';
                html += '<td>' + data[i]["KeHuNum"] + '</td>';
                html += '<td>' + PState + '</td>';
                html += '</tr>';
            }
            if (html.length == 0) {
                html += "<tr><td colspan='10' style='height:100px;'>暂无数据！</td></tr>";
            }
            $("#tablelist1").html(html);
            bootstrapPaginator("#PaginatorLibrary1", tb, GetTaskList);//分页
            //样式重新加载
            redload1();
        }
    });
}


//移除案例
function DeleteTraining() {
    var chks = document.getElementsByName('inputs[]');//name
    var ids = "";
 
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked == true) {
            ids += chks[i].value + ",";
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
        type: "POST",
        dataType: "text",
        url: '/Admin/PersonalTraining/DeleteTraining',
        data: { "ids": ids },
        success: function (data) {
            if (data == "1") {
                layer.closeAll();//关闭所有弹出框
                layer.msg('移除成功', { icon: 1 });
                TrainingTaskList();
            }
            else {
                layer.msg('操作失败！', { icon: 2 });
                return;
            }
          
        }
    });
} 


//返回
function bet() {
    window.location.href = '/Admin/PersonalTraining/Add?PracticeId=' + getQueryString("PracticeId") + "&AllType=" + getQueryString("AllType");
}