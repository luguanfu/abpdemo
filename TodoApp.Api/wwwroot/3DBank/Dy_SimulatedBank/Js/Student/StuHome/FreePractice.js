/**************************************************
 * 自由练习 第一层列表
 * 
 * 
 * 
 * *************/

//搜索
function serchinfo() {
    GetPersonalExercises();
}

//获得（个人练习/团队练习）数据列表
function GetPersonalExercises(page, type) {

    if (type != "undefined" && type != undefined) {
        $("#PracticeType").val(type);
    } else {
        type = $("#PracticeType").val();
    }

    var TState = $("input[name='zt']:checked").val();
    var SearchName = $("#SearchName").val();

    var practiceType = $("#PracticeType").val();
    
    if (practiceType == 1) { //个人练习
        $(".tuan_xin").hide(); //隐藏团队及角色
        $("#grlx").show();
        $("#tdlx").hide();
        $("#ziyoulianxi1").show()
        $("#ziyoulianxi2").hide()
    } else if(practiceType == 2) { //团队练习
        $(".tuan_xin").show();//显示团队及角色
        $("#grlx").hide();
        $("#tdlx").show();
        $("#ziyoulianxi1").show()
        $("#ziyoulianxi2").hide()
    }else {
        $(".tuan_xin").hide(); //隐藏团队及角色
        $("#grlx").hide();
        $("#tdlx").hide();
        $("#ziyoulianxi1").hide()
        $("#ziyoulianxi2").show()
        TState = $("input[name='zyms']:checked").val();
    }

    var PageSize = 4;

    $.ajax({
        url: '/FreePractice/GetPersonalExercises',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "SearchName": SearchName, "TState": TState, "PracticeType": type },
        success: function (tb) {

            var html = '';
            var data = tb.Tb;//转换table

            var titleHmtl = "";
            if (type == 1) { //如果是团队练习

                titleHmtl += '<div class="shuju_tit">'
                titleHmtl += ' <label class="alshu_k1">编号</label>'
                titleHmtl += '<label class="alshu_k2">案例名称</label>'
                titleHmtl += '<label class="alshu_k3">状态</label>'
                titleHmtl += '<label class="alshu_k4">最近一次保存时间</label>'
                titleHmtl += '<label class="alshu_k5">综合得分</label>'
                titleHmtl += '<label class="alshu_k6">操作</label>'
                titleHmtl += ' </div>'

                $("#personalTitle").html(titleHmtl);
            } else if (type == 2) {

                titleHmtl += '<div class="shuju_tit">'
                titleHmtl += ' <label class="tdshu_k1">编号</label>'
                titleHmtl += ' <label class="tdshu_k2">案例名称</label>'
                titleHmtl += ' <label class="tdshu_k3">状态</label>'
                titleHmtl += ' <label class="tdshu_k4"> 我的角色</label>'
                titleHmtl += ' <label class="tdshu_k5">最近一次保存时间</label>'
                titleHmtl += ' <label class="tdshu_k6">综合得分</label>'
                titleHmtl += ' <label class="tdshu_k7">操作</label>'
                titleHmtl += ' </div>'

                $("#personalTitle").html(titleHmtl);
            } else {
                titleHmtl += '<div class="shuju_tit">'
                titleHmtl += ' <label class="shixun_k1">考核名称</label>'
                titleHmtl += ' <label class="shixun_k2">开始时间</label>'
                titleHmtl += ' <label class="shixun_k3">练习时长</label>'
                titleHmtl += ' <label class="shixun_k4"> 状态</label>'
                titleHmtl += ' <label class="shixun_k5">总分</label>'
                titleHmtl += ' <label class="shixun_k6">及格线</label>'
                titleHmtl += ' <label class="shixun_k7">我的成绩</label>'
                titleHmtl += ' <label class="shixun_k8">操作</label>'
                titleHmtl += ' </div>'

                $("#personalTitle").html(titleHmtl)
            }
            $("#personal").html("");
            for (var i = 0; i < data.length; i++) {

                //当前页面
                var idx = 0;
                if (page != "undefined" && page != null) {
                    idx = page;
                    idx = idx - 1;
                }
                if (type == 1) { //
                    html += '<div class="shuju_line">'
                    html += ' <label class="alshu_k1">' + ((idx * PageSize) + i + 1) + '</label>'
                    html += '  <label class="alshu_k2">' + data[i]["TaskName"] + '</label>'
                    html += '  <label class="alshu_k3 shuju_lv">' + data[i]["Tstate"] + '</label>'
                    html += '   <label class="alshu_k4">' + (data[i]["UpdateTime"] == ("" || null) ? '-' : new Date(data[i]["UpdateTime"]).Format("yyyy-MM-dd hh:mm")) + '</label>'

                    if (data[i]["Tstate"] == "进行中") {//分数显示
                        html += '   <label class="alshu_k5">--</label>'
                    }
                    else {
                        html += '   <label class="alshu_k5">' + data[i]["Scores"] + '</label>'
                    }
                    html += '   <label class="alshu_k6">'

                    if (data[i]["Tstate"] == "进行中") {//继续操作
                        html += '<a href="#" onclick="openToUrl(' + data[i]["ID"] + ',' + data[i]["TaskId"] + ')"><img src="../img/public3D/lx_ico_go.png" /></a>'
                    } else {
                        //查看
                        html += ' <a href="#"  onclick="openLock_end(' + data[i]["ID"] + ',' + data[i]["TaskId"] + ')"><img src="../img/public3D/lx_ico_look.png"></a>'
                    }
                    html += '   <a href="#"><img src="../img/public3D/lx_ico_shanhui.png" onclick="del(' + data[i]["ID"] + ',' + data[i]["ExamId"] + ')" /></a>'
                    html += '  </label>'
                    html += ' </div>'

                } else if (type == 2) {  //如果是团队练习
                    html += '<div class="shuju_line">'
                    html += ' <label class="tdshu_k1">' + ((idx * PageSize) + i + 1) + '</label>'
                    html += '  <label class="tdshu_k2">' + data[i]["TaskName"] + '</label>'
                    html += '  <label class="tdshu_k3 shuju_lv">' + data[i]["Tstate"] + '</label>'
                    html += '  <label class="tdshu_k4">' + data[i]["PositionName"] + '</label>'
                    html += '  <label class="tdshu_k5">' + (data[i]["UpdateTime"] == ("" || null) ? '-' : new Date(data[i]["UpdateTime"]).Format("yyyy-MM-dd hh:mm")) + '</label>'

                    if (data[i]["Tstate"] == "进行中") {//分数显示
                        html += '   <label class="tdshu_k6">--</label>'
                    }
                    else {
                        html += '   <label class="tdshu_k6">' + data[i]["Scores"] + '</label>'
                    }


                    html += '   <label class="tdshu_k7">'

                    if (data[i]["Tstate"] == "进行中") {//继续操作
                        html += '<a href="#" onclick="openToUrl(' + data[i]["ID"] + ',' + data[i]["TaskId"] + ')"><img src="../img/public3D/lx_ico_go.png" /></a>'
                    } else {
                        html += ' <a href="#"  onclick="openLock_end(' + data[i]["ID"] + ',' + data[i]["TaskId"] + ')"><img src="../img/public3D/lx_ico_look.png"></a>'
                    }
                    //团队模式校验角色
                    if ($("#Role").val() == "1") {//小组长删除权限
                        html += '   <a href="#"><img src="../img/public3D/lx_ico_shanhui.png" onclick="del(' + data[i]["ID"] + ',' + data[i]["ExamId"] + ')" /></a>'
                    }


                    html += '  </label>'
                    html += ' </div>'
                } else {
                    html += '<div class="shuju_line">'
                    html += '<label class="shixun_k1">' + data[i]["E_Name"] + '</label>'
                    html += '<label class="shixun_k2">' + (data[i]["E_StartTime"] == ("" || null) ? '-' : new Date(data[i]["E_StartTime"]).Format("yyyy-MM-dd hh:mm")) + '</label>'
                    html += ' <label class="shixun_k3">' + (data[i]["duration"] == ("" || null) ? '-' : data[i]["duration"]) + '分钟</label>'

                    if (data[i]["statas"] == null || data[i]["statas"] == "") {
                        html += '<label class="shixun_k4 ">' + "未开始" + '</label>'
                    } else {
                        html += '<label class="shixun_k4 ">' + data[i]["statas"] + '</label>'
                    }

                    var ToScore = parseFloat(data[i]["ToScore"]);//总分
                    html += ' <label class="shixun_k5">' + ToScore.toFixed(2) + '</label>'
                    html += ' <label class="shixun_k6">' + (ToScore * 0.6).toFixed(2) + '</label>'


                    if (data[i]["MyScore"] == null || data[i]["MyScore"] == "") {
                        html += ' <label class="shixun_k7">-</label>'
                    } else {
                        /*if (data[i]["statas"] == "进行中" || data[i]["statas"] == "未开始") {
                            html += ' <label class="shixun_k7">-</label>'
                        } else {
                            html += ' <label class="shixun_k7">' + parseFloat(data[i]["MyScore"]).toFixed(2) + '</label>'
                        }*/
                        html += ' <label class="shixun_k7">' + parseFloat(data[i]["MyScore"]).toFixed(2) + '</label>'
                    }

                    html += '<label class="shixun_k8">'

                    if (data[i]["statas"] == "未开始" || data[i]["statas"] == null || data[i]["statas"] == "") {
                        html += '<img src="../img/public3D/lx_ico_gono.png" />'
                    } else if (data[i]["statas"] == "进行中") {
                        html += '<img src="../img/public3D/lx_ico_go.png" onclick="Getinto(' + data[i]["EId"] + ',' + data[i]["E_PId"] + ')" />'
                    } if (data[i]["statas"] == "已结束") {
                        html += '<img src="../img/public3D/sxkh_ico_kan.png" onclick="ShwoResult(' + data[i]["EId"] + ',' + data[i]["E_PId"] + ')"/>'
                    }

                    html += '</label>'
                    html += '</div>'
                }
            }

            $("#personal").html(html);

            bootstrapPaginator("#personalPageList", tb, GetPersonalExercises);//分页

        }
    });
}

//单删除
function del(EID, ExamId) {
    layer.confirm('您确认要删除选中的信息吗？', {
        title: '删除信息',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/FreePractice/Del',
                data: { "Ids": EID, "ExamId": ExamId,"PracticeType": $("#PracticeType").val() },//多个Id
                success: function (data) {
                    if (data == "1") {
                        layer.msg('操作成功', { icon: 1 });
                        GetPersonalExercises(null, $("#PracticeType").val());
                    }
                    if (data == "99") {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}

//清所有的自由练习考核成绩
function DelAll() {

    layer.confirm('您确认要清空吗？', {
        title: '删除信息',
        btn: ['确定删除', '取消操作'],
        shadeClose: false, //开启遮罩关闭
        skin: 'layui-layer-lan'
        //按钮
    },
        function () {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: '/FreePractice/DelAll',
                data: { "PracticeType": $("#PracticeType").val() },//多个Id
                success: function (data) {
                    if (data == "1") {
                       
                        layer.msg('操作成功', { icon: 1 });
                        GetPersonalExercises(null, $("#PracticeType").val());
                    }
                    if (data == "99") {
                        layer.msg('操作失败', { icon: 2 });
                        return;
                    }

                }
            })
        });
}


//跳转至个人练习--》新增练习
function openToUrl(TRId, TaskId) {
    //成绩id +任务id 跳转实操
    window.open("/StuHome/StudentHome?TotalResultId=" + TRId + "&TaskId=" + TaskId);     
}

//跳转查看成绩
function openLock_end(TRId, TaskId) {
    window.open("/PracticeResult/Index?TotalResultId=" + TRId + "&TaskId=" + TaskId);     
}

//快速开始
function GoQuickExercise(type) {
    var TaskId = 0;
    var EId = 0;
    //得到可选案例
    $.ajax({
        type: "POST",
        dataType: "json",
        url: '/FreePractice/GetListByTaskId',
        data: { "PracticeType": type },
        async: false,
        success: function (data) {
            if (data.length > 0) {
                //取出随机的
                
                EId = data[0]["EId"];
                TaskId = data[0]["TaskId"];
            } else {
                layer.msg('不可操作，无案例可选');
                return;
            }

        }
    });

    if (type == 1) {
        //个人  随机选
        AddFreePractice(EId, TaskId);
        GetPersonalExercises(null,1);

    } else {
        //团队
        ShowAllocationOfPosts(EId, TaskId);
        GetPersonalExercises(null,2);
    }
}

