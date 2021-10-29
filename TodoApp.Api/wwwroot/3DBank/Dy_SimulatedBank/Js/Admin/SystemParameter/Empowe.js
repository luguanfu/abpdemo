$(function () {
    getList(1);
});

//加载列表
function getList(page) {
    
    var PageSize = 10;
    var P_Name = $("#P_Name").val();
    $.ajax({
        url: '/Admin/SystemParameter/GetList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "P_Name": P_Name },
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
                var TMNO = "T"+data[i]["TMNO"]
                html += '<td><span class="pie">' + ((idx * PageSize) + i + 1) + '</span></td>';

                html += '<td><input type="checkbox" class="i-checks" name="input[]" value="' + data[i]["TMNO"] + '"></td>';
                html += '<td><span class="pie" >' + data[i]["TMName"] + '</span></td>';
                html += '<td><span class="pie">' + data[i]["TMNO"] + '</span></td>';
                html += '<td><span class="pie">' + data[i]["EName"] + '</span></td>';

                html += '<td>';
                html += '<a href="javascript:void(0);" onclick="EditEmpower(\'' + TMNO+'\')" class=" btn-primary btn-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑 </a> ';
                html += '</td>';
                html += '</tr>';

            }
            $("#tablelist").html(html);

            bootstrapPaginator("#PaginatorLibrary", tb, getList);//分页
            //样式重新加载
            redload();

        }
    });
}


function EditEmpower(TMNO) {
    
    CheckTimeOut();
    var index = layer.open({
        type: 2,
        //btn: ['确定', '取消'],
        title: "设置授权",
        skin: 'layui-layer-lan', //样式类名
        shadeClose: true,
        shade: false,
        maxmin: true, //开启最大化最小化按钮
        area: ['1250px', '700px'],
        content: "/Admin/Ads_Form/Form_010001?FormId=" + TMNO,
        //yes: function () {
        //    alert("heiheihe");
        //}
        //cancel: function () {

        //}

    });
     

}