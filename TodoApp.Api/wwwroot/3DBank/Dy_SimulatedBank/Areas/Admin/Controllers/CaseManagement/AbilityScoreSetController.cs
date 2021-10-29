using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank.Models;
using Dy_SimulatedBank_Bll;
using Dy_SimulatedBank_DBUtility.Sql;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class AbilityScoreSetController : BaseController
    {
        //
        // GET: /Admin/AbilityScoreSet/
        CommonBll commonbll = new CommonBll();

        public ActionResult Index()
        {
            string taskid = string.IsNullOrEmpty(Request["taskid"]) ? "0" : Request["taskid"];
            string addtype = string.IsNullOrEmpty(Request["addtype"]) ? "1" : Request["addtype"];//1新增，2编辑
            string operscene = string.IsNullOrEmpty(Request["operscene"]) ? "1" : Request["operscene"];//1基本信息，2业务场景，3客户列表

            ViewData["taskid"] = taskid;
            ViewData["addtype"] = addtype;
            ViewData["operscene"] = operscene;
            return View();
        }

        public string GetAbilityScoreList()
        {

            var TaskId = Request["TaskId"];
            var sql = $@"select a.SceneId,b.AbilityScores,c.ID as AbilityId,c.AbilityName from 
                          (select ID,SceneId from bsi_TaskDetail where TaskId = {TaskId} and Status=1) a 
                          inner join (select TaskDetailId,AbilityId,AbilityScores from bsi_CaseCapabilityScore) b on b.TaskDetailId = a.ID
                          inner join (select ID,AbilityName from bsi_CapabilityModel) c on b.AbilityId = c.ID";
            var dt = SqlHelper.ExecuteDataTable(sql);

            var query = from t in dt.AsEnumerable()
                        group t by new { t1 = t.Field<int>("SceneId"), t2 = t.Field<string>("AbilityName") } into m
                        select new
                        {
                            SceneId = m.Key.t1,
                            AbilityName = m.Key.t2,
                            Scores = m.Sum(d => d.Field<int>("AbilityScores"))
                        };

            var query2 = from t in query.ToList()
                         group t by new { t1 = t.SceneId } into m
                         select new
                         {
                             SceneId = m.Key.t1,
                             AbilityString = string.Join(";",m.Select(y=>($"{y.AbilityName}:{y.Scores}分")))
                         };

            return JsonConvert.SerializeObject(query2.ToList());
        }


        public ActionResult SceneAbility()
        {
             
            ViewData["taskid"] = Request["taskid"];
            ViewData["sceneid"] = Request["sceneid"];
            return View();
        }

        public string GetSceneAbilityScoreList()
        {
            var TaskId = Request["TaskId"];
            var SceneId = Request["SceneId"];

            var CustomerId = "0";
            if (SceneId == "1" )
            {
                CustomerId = "-1";
            }
            else if (SceneId == "4")
            {
                CustomerId = "-2";
            }

            if (SceneId == "2" || SceneId == "3")
            {
                
                CustomerId = Request["CustomerId"].ToString();
                
            }

            var sql = $@" select a.*,b.AbilityScores,c.ID as AbilityId,c.AbilityName ,d.TMName,e.CustomerQuestion,e.RightKey as InquiryAnswer
                            from 
                          (select * from bsi_TaskDetail where TaskId = {TaskId} and Status = 1 and SceneId = {SceneId} and CustomerId = {CustomerId}) a 
                          left join (select TaskDetailId,AbilityId,AbilityScores from bsi_CaseCapabilityScore) b on b.TaskDetailId = a.ID
                          left join (select ID,AbilityName from bsi_CapabilityModel) c on b.AbilityId = c.ID
                          left join bsi_TM d on a.FormId = d.TMNO
                          left join bsi_TaskCustomerInquiry e on a.InquiryId = e.ID
                          order by a.SublinkId,a.Types,a.LinkId,e.SerialNumber  ";
            var dt = SqlHelper.ExecuteDataTable(sql);

            var query = from t in dt.AsEnumerable()
                        group t by new { t1 = t.Field<int>("ID") } into m
                        select new TaskDetailRowModel()
                        {
                            TaskDetailId = m.Key.t1,
                            AbilityString = string.Join(";", m.Where(y => y.Field<int?>("AbilityScores") != null && y.Field<string>("AbilityName") != null).Select(y => ($"{y.Field<string>("AbilityName")}:{y.Field<int>("AbilityScores")}分"))),
                            SceneId = m.First().Field<int>("SceneId"),
                            SubLinkId = m.First().Field<int>("SubLinkId"),
                            LinkId = m.First().Field<int>("LinkId"),
                            OperationName = m.First().Field<string>("OperationName"),
                            Types = m.First().Field<int>("Types"),
                            Answer = m.First().Field<string>("Answer"),
                            TMName = m.First().Field<string>("TMName"),
                            CustomerQuestion = m.First().Field<string>("CustomerQuestion"),
                            InquiryAnswer = m.First().Field<string>("InquiryAnswer")

                        };

            var tm_Dt = SqlHelper.ExecuteDataTable($"select [TMNO],[TMName] from [bsi_TM]").AsEnumerable();

            var product_Dt = SqlHelper.ExecuteDataTable($"select ID,ProductName,TaskDescribe from bsi_ProductSettings").AsEnumerable();

            var retList = query.ToList();
            for (int i = 0; i < retList.Count; i++)
            {
                var item = retList[i];
                var LinkId = item.LinkId.ToString();
                if (item.Types == 1 && (LinkId == "5" || LinkId == "8" || LinkId == "91" || LinkId == "92" || LinkId == "14"))//这些环节的操作 表单列表存在一条记录里面
                {
                    var answer = item.Answer;
                    var formlist = answer.Split(',');

                    var formNameList = new List<string>();
                    for (int j = 0; j < formlist.Length; j++)
                    {
                        var findTemp = tm_Dt.FirstOrDefault(t => t.Field<string>("TMNO") == formlist[j]);
                        if (findTemp != null) {
                            formNameList.Add(findTemp["TMName"].ToString());
                        }
                    }
                    item.Answer = string.Join(",", formNameList);

                }
                if (LinkId == "15" || LinkId == "16")
                {
                    var answer = item.Answer;
                    var findTemp = product_Dt.FirstOrDefault(t => t.Field<int>("ID").ToString() == answer);
                    if (findTemp != null)
                    {
                        item.Answer = (findTemp["ProductName"].ToString() + "," + findTemp["TaskDescribe"].ToString());
                    }
                }
            }

            return JsonConvert.SerializeObject(retList);






        }


        public string GetSceneCustomerList()
        {

            var TaskId = Request["TaskId"];
            var SceneId = Request["SceneId"];

            string wheres = " ";
            
            wheres = "  and [TaskId]=" + TaskId + "";
           
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 1;
            m.Sort = " CustomerOrder asc"; //排序必须填写
            m.strFld = @" a.ID as CustomerId,a.[CustomerName],b.TypeName,b.BusinessName ";
            m.tab = @"bsi_TaskCustomer a inner join bsi_TaskBusiness b on a.[BusinessId]=b.ID";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));

        }


        public string GetCapabilityModelList()
        {
            var dt = commonbll.GetListDatatable("ID as AbilityId,AbilityName", "bsi_CapabilityModel", " and 1=1 order by SerialNumber");
            return JsonConvert.SerializeObject(dt);
        }


        public string GetCapabilityScoreByTaskDetailId()
        {
            var TaskDetailId = Request["TaskDetailId"];

            var dt = commonbll.GetListDatatable("*", "bsi_CaseCapabilityScore", $" and [TaskDetailId] = {TaskDetailId}");
            return JsonConvert.SerializeObject(dt);
        }


        public struct AbilityIdScoreModel
        {
            public int AbilityId { get; set; }  //属性的名字，必须与json格式字符串中的"key"值一样。
            public int AbilityScore { get; set; }
        }

        public string SetCapabilityScoreByTaskDetailId()
        {
            var TaskDetailId = Request["TaskDetailId"];
            var AbilityScoreData = Request["AbilityScoreData"];

            var AbilityIdScoreList = JsonConvert.DeserializeObject<List<AbilityIdScoreModel>>(AbilityScoreData);

            

            if (AbilityIdScoreList.Count == 0)
            {
                return "-1";
            }

            StringBuilder sb = new StringBuilder();

            sb.Append($"delete from bsi_CaseCapabilityScore where [TaskDetailId] = {TaskDetailId}");

            foreach (var item in AbilityIdScoreList)
            {
                sb.Append($"insert into [bsi_CaseCapabilityScore] values({TaskDetailId},{item.AbilityId},{item.AbilityScore},{UserId},GETDATE())");
            }

            SqlHelper.ExecuteNonQuery(sb.ToString());

            //var dt = commonbll.GetListDatatable("*", "bsi_CaseCapabilityScore", $" and [TaskDetailId] = {TaskDetailId}");
            //return JsonConvert.SerializeObject(dt);
            return "1";
        }

        public string ClearAbilitySet()
        {
            var CustomerId = Request["CustomerId"]; //客户ID
            var SubLinkIds = Request["SubLinkIds"];
            var sql = $"delete [bsi_CaseCapabilityScore] where TaskDetailId in (select ID from bsi_TaskDetail where SubLinkId in (${SubLinkIds}) and CustomerId = {CustomerId})";
            SqlHelper.ExecuteNonQuery(sql);
            return "1";
        }

        public string BatchAbilitySet()
        {
            //ClearAbilitySet();

            var SubLinkIds = Request["SubLinkIds"];
            var AbilityScoreData = Request["AbilityScoreData"];

            var AbilityIdScoreList = JsonConvert.DeserializeObject<List<AbilityIdScoreModel>>(AbilityScoreData);
            if (AbilityIdScoreList.Count == 0)
            {
                return "-1";
            }

            StringBuilder sb = new StringBuilder();

            var CustomerId = Request["CustomerId"]; //客户ID
            var sql = $"delete [bsi_CaseCapabilityScore] where TaskDetailId in (select ID from bsi_TaskDetail where SubLinkId in (${SubLinkIds}) and CustomerId = {CustomerId}) ";
            sb.Append(sql);

            var Type = Request["Type"]; // 1 设置选中， 2设置操作 3 设置质询
            

            if (string.IsNullOrEmpty(Type) || Type == "1")
            {
                sql = $"select ID from bsi_TaskDetail where SubLinkId in (${SubLinkIds}) and CustomerId = {CustomerId}";
                var dt = SqlHelper.ExecuteDataTable(sql);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    var TaskDetailId = dt.Rows[i]["ID"];
                    sb.Append($"delete from bsi_CaseCapabilityScore where [TaskDetailId] = {TaskDetailId}");
                    foreach (var item in AbilityIdScoreList)
                    {
                        sb.Append($"insert into [bsi_CaseCapabilityScore] values({TaskDetailId},{item.AbilityId},{item.AbilityScore},{UserId},GETDATE())");
                    }

                }
            }
            else if (Type == "2" || Type == "3")
            {
                var SceneId = Request["SceneId"]; //大场景id
                
                
                sql = $"select ID from bsi_TaskDetail where SceneId = {SceneId} and Types in( {(Type=="2"?"1,2":"3")} ) and CustomerId = {CustomerId}";
                var dt = SqlHelper.ExecuteDataTable(sql);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    var TaskDetailId = dt.Rows[i]["ID"];
                    sb.Append($"delete from bsi_CaseCapabilityScore where [TaskDetailId] = {TaskDetailId}");
                    foreach (var item in AbilityIdScoreList)
                    {
                        sb.Append($"insert into [bsi_CaseCapabilityScore] values({TaskDetailId},{item.AbilityId},{item.AbilityScore},{UserId},GETDATE())");
                    }

                }
            }
            else {
                return "-1";
            }
            
            SqlHelper.ExecuteNonQuery(sb.ToString());

            return "1";
        }


    }
}
