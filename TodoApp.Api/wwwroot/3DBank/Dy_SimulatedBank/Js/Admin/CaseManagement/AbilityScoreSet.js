
$(function () {
    GetList();
});


function GetList() {
    

    $.ajax({
        url: '/Admin/AbilityScoreSet/GetAbilityScoreList',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "TaskId": $("#taskid").val()},
        success: function (data) {
            console.log(data);

            var SceneNameArr = ["开工管理", "厅堂服务", "柜面服务", "完工管理"];

            var html = '';

            for (var i = 1; i < 5; i++) {
                var SceneName = SceneNameArr[i-1];
                var AbilityString = "";
                
                for (var j = 0; j < data.length; j++) {
                    var dataitem = data[j];
                    if (dataitem.SceneId == i) {
                        AbilityString = dataitem.AbilityString;
                        break;
                    }
                }

                html += '<tr>';
                html += `<td>${SceneName}</td>`;
                html += `<td>${AbilityString}</td>`;
                html += `<td><a onclick="GoEdit(${i})" class=" btn-primary btn-sm  m-r-sm"><i class="fa fa-pencil m-r-xxs"></i>编辑能力项</a></td>`;
                html += '</tr>';
                

            }

            
            $("#tablelist").html(html);
            
            

        }
    });
}


function GoEdit(sceneid)
{
    var taskid = $("#taskid ").val();
    location.href = `/Admin/AbilityScoreSet/SceneAbility?taskid=${taskid}&sceneid=${sceneid}`;

}
