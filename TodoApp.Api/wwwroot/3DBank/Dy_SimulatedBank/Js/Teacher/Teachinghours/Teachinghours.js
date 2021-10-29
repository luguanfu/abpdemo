/***************************************************************
  FileName:教师端  课时安排  javascript
  Copyright（c）2018-金融教育在线技术开发部
  Author:李森林
  Create Date:2018-07-23
 ******************************************************************/

$(function () {

    Select();
    //Gjbd();
})


function Select(page) {

    var CollegeNameId= $("#CollegeNameId").val();
    var Majorid= $("#Majorid").val();
    var ClassNameid= $("#ClassNameid").val();
    var PageSize = 10;

    $.ajax({
        url: '/Admin/Teachinghours/GetList',
        Type: "Post",
        dataType: "json",
        async: true,
        contentType: "application/json; charset=utf-8",
        data: { "Page": page, "PageSize": PageSize, "CollegeNameId": CollegeNameId, "Majorid": Majorid, "ClassNameid": ClassNameid },
        success: function (tb) {
            var html = "";
            var data = tb.Tb;//转换table
            for (var i = 0; i < data.length; i++) {
                html += '<tr>';
                //当前页面
                var idx = 0;
                if (page != "undefined" && page != null) {
                    idx = page;
                    idx = idx - 1;
                }
                html += '<td><input type="checkbox" class="i-checks" name="input[]" value=' + data[i]["C_ID"] + '></td>';
                html += '<td>' + data[i]["ClassName"] + '</td>';
                html += '<td>' + data[i]["CollegeName"] + '</td>';
                html += '<td>' + data[i]["MajorName"] + '</td>';                
                html += '<td>' + data[i]["Pcount"] + '</td>';
                html += '<td>';
                html += '<a href="/Admin/Teachinghours/Detailed?id=' + data[i]["C_ID"] + '" class=" btn-success btn-sm"><i class="fa fa-user m-r-xxs"></i>进入课时安排 </a></td>';
                html += '</tr>';
               
            }
            $("#tablelist").html(html);
            bootstrapPaginator("#PaginatorLibrary", tb, Select);//分页
            //样式重新加载
            redload();
            }    
    });
}


//样式
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

//当选中学院的时候查询专业

function GetMajor(type) {
    var id = "";
    ;
    if (type == "List") {
        id = $("#CollegeNameId option:selected").val();
    }
    //var Schoolid = "";
    //if (type == "List") {
    //    Schoolid = $("#Schoolid").val();
    //    if (Schoolid == 0) {
    //        layer.msg("请选择学校!");
    //        return false
    //    }
    //}
    $.ajax({
        url: '/Admin/Teachinghours/GetMajor',
        Type: "Post",
        dataType: "json",
        async: false,
        data: { "CollegeId": id},
        success: function (json) {
            var data = eval(json);
            var html = "<option value=\"0\">请选择专业</option>";
            for (var i = 0; i < data.length; i++) {
                html += "<option value=" + data[i].M_ID + ">" + data[i].MajorName + "</option>";
            }
            if (type == "List") {
                $("#Majorid").html(html);
            }
        }

    });

}

//学院专业绑定
function Gjbd() {


    $.ajax({
        url: '/Admin/Teachinghours/GetCollege',
        Type: "Post",
        dataType: "json",
        async: false,
        data: null,
        success: function (data) {
          
            var html = "<option value='0'>请选择学校</option>";
            for (var i = 0; i < data.length; i++) {
                html += "<option value=" + data[i]["C_ID"] + ">" + data[i]["CollegeName"] + "</option>";
            }
            $("#CollegeNameId").html(html);
        }

    });


    $.ajax({
        url: '/Admin/Teachinghours/GetMajor',
        Type: "Post",
        dataType: "json",
        async: false,
        data: null,
        success: function (data) {
            
            var html = "<option value='0'>请选择专业</option>";
            for (var i = 0; i < data.length; i++) {
                html += "<option value=" + data[i]["M_ID"] + ">" + data[i]["MajorName"] + "</option>";
            }
            $("#Majorid").html(html);
        }

    });
}

//重置
function Reset() {
    $("#CollegeNameId").val("0");
    $("#Majorid").val("0");
    $("#ClassNameid").val("");
    Select();
}

//统一安排
function Anp() {

    var CollegeNameId = $("#CollegeNameId").val();
    var Majorid = $("#Majorid").val();
    var ClassNameid = $("#ClassNameid").val();

    var strk = document.getElementsByName("input[]");
    var strks = "";
    for (var i = 0; i < strk.length; i++) {
        if(strk[i].checked==true){
            strks += strk[i].value + ",";
        }
    }
   
    if (strk.length == 0 || strk.length > 2) {
        layer.msg('请勾选一条数据');
        return;
    } 

    strks = strks.substr(0, strks.length - 1);

    $.ajax({
        type: "POST",
        dataType: "text",
        url: '/Admin/Teachinghours/Ty',
        data: { "Hid": strks, "CollegeNameId": CollegeNameId, "Majorid": Majorid, "ClassNameid": ClassNameid  },//多个Id
        success: function (data) {
            if (data == "1") {
                               
                layer.msg('操作成功', { icon: 1 });

            }
            if (data == "99") {
                layer.msg('操作失败', { icon: 2 });
                return;
            }

        }
    })
    
}