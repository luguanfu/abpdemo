/***************************************************************
         FileName:BSI_保险_课件管理js文件 
         Copyright（c）2018-金融教育在线技术开发部
         Author:邵，李林燊
         Create Date:2018-5月15号
******************************************************************/

var sort = 1; //能力分值
var Caplength = 0;//
var authTypes = new Array();//新增下拉限制
var Abilitytext = new Array();//不能存在重复能力值

$(function () {
    if ($("#ability1").val() == null || $("#ability1").val() == "") {
        $("#Tj").attr("disabled", true);
        $("#Qc").attr("disabled", true);
    }
    //修改导航栏
    var state = getQueryString('Id')
    BindCapacity();
    if(state!=0)
    {
        $("#Navigationid").html("修改课件");
        GetUpdateChapterState(state);
        GetFileName(state);
        Getability(state)
    }
    if (state == 0)
    {
        $("#Navigationid").html("新增课件");
    }
    $("#ability1").change(function () {
        if ($("#ability1").val() == null || $("#ability1").val() == "") {
            $("#Tj").attr("disabled", true);
            $("#Qc").attr("disabled", true);
        } else {
            $("#Tj").attr("disabled", false);
            $("#Qc").attr("disabled", false);
        }
    });
});
//获取修改时关联的课程-章-节
function GetUpdateChapterState(id)
{
    $.ajax({
        url: '/Admin/Resources_Add/GetUpdateChapterState',
        Type: "post",
        dataType: "text",
        async: true,
        data: { "ResourcesId": id },
        success: function (tb) {
            $("#UpdateChapterStateid").html(tb);
        }
    });
}

function GetFileName(id)
{
    $.ajax({
        url: '/Admin/Resources_Add/GetFileName',
        Type: "post",
        dataType: "text",
        async: true,
        data: { "ResourcesId": id },
        success: function (tb) {
            var v = tb.split(',');
            console.log(v[1]);
            $("#UpName").html(v[0]);
            //课程id
            $("#Curriculumid").val(v[1]);
            //章id
            $("#Chapterid").val(v[2]);
            //节id
            $("#iid").val(v[3]);
        }
    });
}
//保存上传的课件
function Save() {
    if ($("#txtTitle").val().trim() == "") {
        layer.msg('课件名称不能为空', function () { });
        return;
    }
    var state = getQueryString('Id')
    if (state == 0) {
        if ($("#upfile").val() == "") {
            layer.msg('上传文件不能为空', function () { });
            return;
        }
    }
    if ($("#iid").val()==0)
    {
        layer.msg('关联章节课程不能为空', function () { });
        return;
    }

    var A1 = $("#ability1").val();
    var AbilityandScore = "";
    if (A1.length > 0) {
        for (var i = 1; i < sort + 1; i++) {
            if ($("#ability" + i).val() == undefined) {
                continue;
            }
            AbilityandScore += $("#ability" + i).val() + "-" + $("#fraction" + i).val() + ",";
            Abilitytext.push(parseInt($("#ability" + i).val()));
        }
        let s = Abilitytext.join(",") + ",";
        for (let i = 0; i < Abilitytext.length; i++) {
            if (s.replace(Abilitytext[i] + ",", "").indexOf(Abilitytext[i] + ",") > -1) {
                layer.msg('请勿重复选择对应能力！', function () { });
                Abilitytext = [];
                return;
            }
        }
        AbilityandScore = AbilityandScore.substr(0, AbilityandScore.length - 1);
    }

    $('#form-horizontalid').ajaxSubmit({
        
        url: "/Resources_Add/Upload?AbilityandScore=" + AbilityandScore,
        type: "POST",
        dataType: "json",
        data: $('#form-horizontalid').serialize(),
        beforeSend: function (xhr, self) {
            var index = layer.load(0, { shade: false }); //0代表加载的风格，支持0-2
            if ($("#WaitingUp").html() != "") { $("#WaitingUp").html("(正在上传)"); }
            if ($("#WaitingUp_img").html() != "") { $("#WaitingUp_img").html("(正在上传)"); }
        },
        success: function (data) {
            layer.closeAll();
            if (data == "-1") {
                layer.msg('上传文件格式错误', function () { });
                return;
            } if (data > 0) {
                if (data == "888") {
                    layer.msg('PPT文件异常，请检查文件！', { icon: 2 });
                    return;
                }
                if (data == "999") {
                    layer.msg('课件名称已存在', function () { });
                }
                else if (data == "0") {
                    layer.msg('操作失败', { icon: 2 });
                }
                else {
                    layer.msg('操作成功', { icon: 1 });
                    if ($("#WaitingUp").html() != "") { $("#WaitingUp").html("(上传成功)"); }
                    if ($("#WaitingUp_img").html() != "") { $("#WaitingUp_img").html("(上传成功)"); }
                    setTimeout("window.location.href = '/Admin/Resources'", 1500);

                }
                return;
            }
            else {
                layer.msg('操作失败', { icon: 2 });
                return;
              }
        },
        error: function (data) {                     
            layer.closeAll();
            layer.msg('上传文件异常！', { icon: 2 });
        }
    });
}
function btn_Update(Id) {
    if (Id == 1) {
        $("#upfile").click();
        $("#upfile").change(function (e) {
            $("#UpName").html($(this).val().split('\\')[$(this).val().split('\\').length - 1]);
            $("#WaitingUp").html("(等待上传)")
        })
    } else {
        $("#upimg").click();
        $("#upimg").change(function (e) {
            $("#addimg").show();
            $("#UpName_img").html($(this).val().split('\\')[$(this).val().split('\\').length - 1]);
            setImagePreview();
            $("#WaitingUp_img").html("(等待上传)");
        })
    }
}

function Choice()
{
    BindCurriculumList();
    Choice_curriculum();
    layer.open({
        type: 1,
        title: '关联章节课程',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['1100px', '500px'], //宽高
        content: $("#Choiceid")
    });
}

//查找课程
function SearchInfo()
{
    Choice_curriculum();
}
var Choiceid = 0;
//选择课程中的章节
function Curriculum_Choiceid(id) {
    layer.closeAll();//关闭所有弹出框
    $("#Curriculumid").val(id);
    Choiceid = id;
    Choice_Chapter();
    layer.open({
        type: 1,
        title: '关联章节课程',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['1100px', '520px'], //宽高
        content: $("#ChapteridShow")
    });
}
//获取章的内容
function Choice_Chapter(page) {
    var PageSize = 10;
    ;
    $.ajax({
        url: '/Admin/Resources_Add/Choice_Chapter',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "Choiceid": Choiceid },
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
                html += '<td>' + data[i]["ResourcesName"] + '</td>';
                html += '<td>';
                html += '<a onclick="Chapter_Sectionid(' + data[i]["ID"] + ')"class=" btn-primary btn-sm  m-r-sm">选择</a></td>';
                html += '</tr>';
                $("#KCName1").html(data[i]["CurriculumName"]);
                $("#KCName2").html(data[i]["CurriculumName"]);
            }
            $("#Chaptertablelist").html(html);
            bootstrapPaginator("#ChapterPaginatorLibrary", tb, Choice_Chapter);//分页
        }
    });
}
 //章ID
var Chapterid = 0;
function Chapter_Sectionid(id)
{
    $("#Chapterid").val(id);
    layer.closeAll();//关闭所有弹出框
    Chapterid = id;
    Chapter_Section();
    layer.open({
        type: 1,
        title: '关联章节课程',
        skin: 'layui-layer-lan', //样式类名
        anim: 2,
        shadeClose: false, //开启遮罩关闭
        area: ['1100px', '700px'], //宽高
        content: $("#Sectionid")
    });
}

//获取列表
function Chapter_Section(page)
{
    var PageSize = 10;

    $.ajax({
        url: '/Admin/Resources_Add/Chapter_Section',
        Type: "post",
        dataType: "json", cache: false,
        contentType: "application/json; charset=utf-8",
        data: { "page": page, "PageSize": PageSize, "Chapterid": Chapterid },
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
                html += '<td>' + data[i]["SectionName"] + '</td>';
                html += '<td>';
                html += '<a onclick="Determine_Choice(' + data[i]["ID"] + ')"class=" btn-primary btn-sm  m-r-sm">关联该节</a></td>';
                html += '</tr>';
                $("#ZName").html(data[i]["ResourcesName"]);
            }

            $("#Sectiontablelist").html(html);
            bootstrapPaginator("#SectionPaginatorLibrary", tb, Chapter_Section);//分页
        }
    });
}

//修改过----李林燊
//确定关联
function Determine_Choice(id, checkcurriculumid, checkchapterid)
{
    //节id
    $("#iid").val(id);
    $("#Curriculumid").val(checkcurriculumid);
    $("#Chapterid").val(checkchapterid);
    ;
    $.ajax({
        url: '/Admin/Resources_Add/UpdateChapterState',
        Type: "post",
        dataType: "text",
        async:true,
        data: { "iid": id, "Curriculumid": checkcurriculumid, "Chapterid": checkchapterid },
        success: function (data) {
            $("#UpdateChapterStateid").html(data);
            layer.msg('操作成功', { icon: 1, time: 1000 }, function () {
                layer.closeAll();//关闭所有弹出框
            });
        }
    });
}
    //绑定课程下拉框
    function BindCurriculumList() {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: '/Admin/Resources_Add/GetCurriculumList',
            async: false,
            success: function (data) {
                var html = '<option value="">请选择课程</option>';
                if (data != null) {
                    for (var i = 0; i < data.length; i++) {
                        html += '<option value=' + data[i]["ID"] + '>' + data[i]["CurriculumName"] + '</option>';
                    }
                }
                $("#checkcurriculum").html(html);
            }
        })
    }

    //绑定章下拉框
    function BindZhang() {
        var curriculumid = $("#checkcurriculum").val();
        $.ajax({
            url: '/Admin/Resources_Add/Getchapter',
            Type: "post",
            dataType: "json",
            async: false,
            data: { "curriculumid": curriculumid },
            success: function (tb) {
                var html = '<option value="">请选择章</option>';
                if (tb.length > 0) {
                    for (var i = 0; i < tb.length; i++) {
                        html += '<option value="' + tb[i]["ID"] + '">' + tb[i]["ResourcesName"] + '</option>';
                    }
                }
                $("#checkchapter").html(html);
            }
        });
    }

    //绑定节下拉框
    function BindJie() {
        var checkchapter = $("#checkchapter").val();
        $.ajax({
            url: '/Admin/Resources_Add/GetSection',
            Type: "post",
            dataType: "json",
            async: false,
            data: { "checkchapter": checkchapter },
            success: function (tb) {
                var html = '<option value="">请选择节</option>';
                if (tb.length > 0) {
                    for (var i = 0; i < tb.length; i++) {
                        html += '<option value="' + tb[i]["ID"] + '">' + tb[i]["SectionName"] + '</option>';
                    }
                }
                $("#checksection").html(html);
            }
        });
    }
    //获取选择课程表
    function Choice_curriculum(page) {
        var PageSize = 10;
        var checkcurriculum = $("#checkcurriculum").val();
        var checkchapter = $("#checkchapter").val();
        var checksection = $("#checksection").val();
        $.ajax({
            url: '/Admin/Resources_Add/Choice_curriculum',
            Type: "post",
            dataType: "json", cache: false,
            contentType: "application/json; charset=utf-8",
            data: { "page": page, "PageSize": PageSize, "CurriculumName": $("#SelectCurriculumNameid").val(), "checkcurriculum": checkcurriculum, "checkchapter": checkchapter, "checksection": checksection },
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
                   
                    if (idx >= 1) {
                        html += '<td>' + ((i + 1)+(idx*10)) + '</td>';
                    } else
                    {
                        html += '<td>' + (i + 1) + '</td>';
                    }

                    html += '<td>' + data[i]["CurriculumName"] + '</td>';
                    html += '<td>' + data[i]["ResourcesName"] + '</td>';
                    html += '<td>' + data[i]["SectionName"] + '</td>';
                    html += '<td><a onclick="Determine_Choice(' + data[i]["ID"] + "," + data[i]["checkcurriculumid"] + "," + data[i]["checkchapterid"] + ')"class=" btn-primary btn-sm  m-r-sm">选择</a></td>';
                    html += '</tr>';
                }

                $("#Curriculumtablelist").html(html);
                bootstrapPaginator("#CurriculumPaginatorLibrary", tb, Choice_curriculum);//分页
            }
        });
}

//绑定对应能力下拉
function BindCapacity() {
    $.ajax({
        url: '/Admin/Resources_Add/Capacity',
        Type: "post",
        dataType: "json",
        async: false,
        data: {},
        success: function (tb) {
            var html = '<option value="">请选择</option>';
            if (tb.length > 0) {
                for (var i = 0; i < tb.length; i++) {
                    html += '<option value="' + tb[i]["ID"] + '">' + tb[i]["AbilityName"] + '</option>';
                }
            }
            $("#ability" + sort + "").html(html);
            if (sort > 1) {
                for (var val in authTypes) {
                    console.log(val + " selected:" + $('#ability' + sort + ' option:selected').val())
                    $("#ability" + sort).find("option[value='" + authTypes[val] + "']").remove();
                }
            }
            Caplength = tb.length;
        }
    });
}

function Tianjia() {
    var Op = $('#ability' + sort + ' option:selected').val();
    var Fz = $('#fraction' + sort).val();

    authTypes = [];
    for (var i = 1; i < sort; i++) {
        authTypes.push(parseInt($("#ability" + i).val()));
    }

    if (Op == "") {
        layer.msg('请选择对应能力！', function () { });
        return;
    }
    if (Fz == "") {
        layer.msg('请填写分值！', function () { });
        return;
    }

    var indextext = parseInt($('#ability' + sort + ' option:selected').val());
    var auth = authTypes.indexOf(indextext);
    //if (auth == "-1") {
    //    authTypes.push(indextext);
    //} 
    authTypes.push(indextext);
    if (sort > Caplength - 1) {
        layer.msg('对应能力及分数添加达到上限！', { icon: 1 });
    } else {
        sort++;
        var htmladd = '';
        var ZhenZ = "";
        htmladd += '<div class="form-group" id="NLDiv' + sort + '">';
        htmladd += '<label for="inputEmail3" class="col-sm-2 control-label"></label>';
        htmladd += ' <div class="col-sm-2"><select class="form-control inline" style="width:100%;" id="ability' + sort + '" name="ability" ></select></div>';
        htmladd += " <div class=\"col-sm-2\"><input type=\"text\" placeholder=\"请输入分值\" id=\"fraction" + sort + "\" class=\"form-control\" name=\"fraction" + sort + "\" onkeyup=\"value=value.replace(/^(0+)|[^\\d]+/g,'')\"  maxlength=\"3\"></div>";
        htmladd += '<button class="btn btn-success btn-sm m-r-sm" type="button" id="Qc" onclick="RemovingElements(this)"><i class="fa fa-minus"></i></button>';
        htmladd += ' </div>';
        $("#NLDiv").append(htmladd);
        BindCapacity();
    }
}

function Quchu() {
    var Op = $('#ability' + sort + ' option:selected').val();
    var Fz = $('#fraction' + sort).val();
    if (sort > 1) {
        console.log(authTypes);
        var NLDiv = document.getElementById("NLDiv" + sort);
        if (Op != "") {
            authTypes.splice(sort, $('#ability' + sort + ' option:selected').val());
        }
        NLDiv.parentNode.removeChild(NLDiv);
        BindCapacity();
        sort--;
    }

    console.log(authTypes);
}

//减除功能(减除当前元素的上级元素）
function RemovingElements(obj) {
    $(obj).parent().remove();
    //sort--;
}


function Getability(id) {
    $.ajax({
        url: "/Admin/Resources_Add/getCapacity",
        type: "post",
        dataType: "json",
        async: false,
        data: { "ResourcesId": id },
        success: function (tb) {
            if (tb.length > 0) {
                var htmladd = '';
                for (var i = 0; i < tb.length - 1; i++) {
                    sort++;
                    htmladd += '<div class="form-group" id="NLDiv' + sort + '">';
                    htmladd += '<label for="inputEmail3" class="col-sm-2 control-label"></label>';
                    htmladd += ' <div class="col-sm-2"><select class="form-control inline" style="width:100%;" id="ability' + sort + '" name="ability"></select></div>';
                    htmladd += " <div class=\"col-sm-2\"><input type=\"text\" placeholder=\"请输入分值\" id=\"fraction" + sort + "\" class=\"form-control\" name=\"fraction" + sort + "\" onkeyup=\"value=value.replace(/^(0+)|[^\\d]+/g,'')\"  maxlength=\"3\"></div>";
                    htmladd += '<button class="btn btn-success btn-sm m-r-sm" type="button" id="Qc" onclick="RemovingElements(this)"><i class="fa fa-minus"></i></button>';
                    htmladd += ' </div>';
                }

                $("#NLDiv").append(htmladd);
                sort = 0;
                for (var i = 0; i < tb.length; i++) {
                    sort++;
                    authTypes = [];
                    for (var t = 1; t < sort; t++) {
                        authTypes.push(parseInt($("#ability" + t).val()));
                    }
                    BindCapacity();
                    $("#ability" + (i + 1)).val(tb[i]["AbilityId"]);
                    $("#fraction" + (i + 1)).val(tb[i]["CAScore"]);

                }
                if ($("#ability1").val() != "" || $("#ability1").val() != null) {
                    $("#Tj").attr("disabled", false);
                    $("#Qc").attr("disabled", false);
                }
            }
        }
    })
}

