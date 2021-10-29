using Dy_SimulatedBank.Models;
using Dy_SimulatedBank_Bll;
using Dy_SimulatedBank_DBUtility.Sql;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Controllers
{
    public class PracticeAssessmentController : BaseController
    {
        CommonBll commonbll = new CommonBll();

        #region 个人/团队考核
        //
        // GET: /FreePractice/

        public ActionResult Index()
        {
           // GetTeamAndRole();
            return View();
        }

        /// <summary>
        /// 获得个人/团队考核列表
        /// </summary>
        /// <returns></returns>
        public string GetPersonalExercises()
        {
            var practiceType = Request["PracticeType"]; //类型（1：个人，2：团队）
            var Type_All = Request["Type_All"]; //竞赛（1：比赛，2：练习）
            if (practiceType == "1")
            {

                Session["Grouping_ID"] = "0";//分组ID
            }
            else
            {
                //团队，模式 存分组id
                Session["Grouping_ID"] = commonbll.GetListSclar("GroupingnameID", "bsi_Groupmanagement a INNER JOIN bsi_Groupingrelation b ON a.G_ID = b.GroupingnameID", "  and [type] = 2 AND StudentID = " + UserId);

            }
            string wheres = "";
            if (Type_All == "1")
            {
                 wheres = " and a.PracticeState=1 AND a.Type_All=1 AND a.PracticeType=" + practiceType + " AND a.ID IN (SELECT DISTINCT PracticeId FROM  bsi_PracticeClass  WHERE ClassId=" + ClassId + ") ";
            }
            else {
                 wheres = " and a.PracticeState=1 AND a.Type_All=2 AND a.PracticeType=" + practiceType + " AND a.ID IN (SELECT DISTINCT PracticeId FROM  bsi_PracticeClass  WHERE ClassId=" + ClassId + ") ";
            }
            

            //查询条件
            if (!string.IsNullOrEmpty(Request["TState"]))
            {
                if (Request["TState"] == "0")//进行中
                {
                    wheres += " and  GETDATE()> a.PracticeStarTime and  GETDATE()<DATEADD(mi, a.PracticeLong, a.PracticeStarTime) ";
                }

                if (Request["TState"] == "1")//已结束
                {
                    wheres += " and GETDATE()> DATEADD(mi, a.PracticeLong, a.PracticeStarTime) ";
                }
                if (Request["TState"] == "2")//未开始
                {
                    wheres += " and a.PracticeStarTime > GETDATE() ";
                   
                }
              
            }

            if (!string.IsNullOrEmpty(Request["SearchName"]))
            {
                wheres += " and a.PracticeName like  '%" + Request["SearchName"] + "%'";
            }

            string wheresyx = " and d.UserId=" + UserId;
            if (practiceType == "2")//团队
            {
                wheresyx = " and d.Grouping_ID=" + Grouping_ID;
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.AddTime desc"; //排序必须填写
            m.strFld = @"a.ID, a.PracticeName,a.PracticeStarTime,a.PracticeLong,a.EndTime as EndTime,
(SELECT top 1  Scores FROM bsi_TotalResult d WHERE ExamId=a.ID " + wheresyx + " AND Type_All=" + Type_All + @")AS Scores,
(CASE
WHEN a.PracticeStarTime > GETDATE() then '未开始'
when GETDATE() > a.EndTime then '已结束'
when isnull((select Tstate from bsi_TotalResult WHERE ExamId = a.ID and UserId = " + UserId + @" AND Type_All = 1),0)=2 then '已考过'
ELSE '进行中' END)
  AS Tstate,
  12 as LinkId,
  (SELECT top 1  id FROM bsi_TotalResult d WHERE ExamId = a.ID and d.UserId = " + UserId + @")AS TotalResultId,
  '100' as Satisfaction,
  a.id AS ExamId";

            m.tab = @"  bsi_PracticeAssessment a  ";

            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }

        /// <summary>
        /// 比赛模式内页
        /// </summary>
        /// <returns></returns>
        public ActionResult CaseView()
        {
            var id = Request["ID"];//考核ID
            string sql = "SELECT * FROM bsi_PracticeAssessment where ID=" + id;
            DataTable dt = commonbll.GetListDatatable(sql);
            if (dt != null && dt.Rows.Count > 0)
            {
                var PracticeStarTime = dt.Rows[0]["PracticeStarTime"];
                var PracticeLong = dt.Rows[0]["PracticeLong"];
   
                ViewData["PracticeName"] = dt.Rows[0]["PracticeName"];//考核名称
                ViewData["PracticeStarTime"] = PracticeStarTime;//考核开始时间
                ViewData["PracticeLong"] = PracticeLong;//考核时长
                 //计算出秒
                //考试结束时间
                //开始时间上加时长  得出结束时间
                DateTime EndTime = Convert.ToDateTime(PracticeStarTime).AddMinutes(Convert.ToInt32(PracticeLong));
                DateTime DqTime = DateTime.Now;

                if (DqTime < EndTime)//在考试中
                {
                    TimeSpan ts = EndTime - DqTime;
                    ViewData["Timemm"] = Convert.ToInt32(ts.TotalSeconds);//秒差
                }
                else
                {
                    ViewData["Timemm"] = -1;
                }
            }


            var practiceType = Request["PracticeType"]; //类型（1：个人，2：团队）
            string wheresyx = " and UserId=" + UserId;
            if (practiceType == "2")//团队
            {
                wheresyx = " and Grouping_ID=" + Grouping_ID;
            }
            //是否交卷
            var count = commonbll.GetRecordCount("bsi_TotalResult", " and Tstate=1 and Type_All=1 " + wheresyx + " and ExamId=" + id);
            ViewData["btnjq"] = count;
            
            GetTeamAndRole();//获得角色

            return View();
        }

        /// <summary>
        /// 该考核下面的案例列表
        /// </summary>
        /// <returns></returns>
        public string CaseList()
        {
            var practiceType = Request["PracticeType"]; //类型（1：个人，2：团队）
            var ID = Request["ID"];//考试id

            string wheres = " and PracticeId=" + ID;

            string wheresyx = " and c.UserId=" + UserId;
            if (practiceType == "2")//团队
            {
                wheresyx = " and c.Grouping_ID=" + Grouping_ID;
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.AddTime desc"; //排序必须填写
            m.strFld = @" b.ID as TaskId,c.ID as TRID,a.PracticeId as ID,TaskName,
  (SELECT top 1 PositionName FROM bsi_TeamPosition where ID=d.File_ID) AS PositionName,
  d.UpdateTime,d.Tstate";
            m.tab = @"bsi_PracticeTasks  a
  INNER JOIN bsi_Task b ON a.TaskId=b.ID
  left JOIN bsi_TotalResult c ON c.ExamId=a.PracticeId  and c.Type_All=1 " + wheresyx + @"
  left JOIN bsi_TotalResultTask d  ON d.TRId=c.ID and  d.TaskId=a.TaskId and d.UserId=" + UserId;
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }



        /// <summary>
        /// 获得团队角色
        /// </summary>
        /// <returns></returns>
        public void GetTeamAndRole()
        {
            string sql = @"SELECT * FROM bsi_Groupmanagement a
  INNER JOIN bsi_Groupingrelation b ON a.G_ID = b.GroupingnameID
  WHERE[type] = 2 AND StudentID = " + UserId;
            DataTable dataTable = commonbll.GetListDatatable(sql);
            if (dataTable != null && dataTable.Rows.Count > 0)
            {
                ViewBag.Groupingname = dataTable.Rows[0]["Groupingname"];//团队名称
              
                ViewBag.Groupingstate = dataTable.Rows[0]["Groupingstate"];//团队角色
                
            }
        }

        /// <summary>
        /// 获得团队分组成员
        /// </summary>
        /// <returns></returns>
        public string GetGroupingMembers()
        {
            string sql2 = @"SELECT * FROM bsi_Groupingrelation r
   INNER JOIN dbo.tb_Student s ON r.StudentID = s.UserId
   WHERE GroupingnameID =  " + Grouping_ID;
            return JsonConvert.SerializeObject(commonbll.GetListDatatable(sql2));
        }

        /// <summary>
        /// 提交并将进行中的修改成完成状态
        /// </summary>
        /// <returns></returns>
        public string UpdateStatus()
        {
           
            var wheres = "";
            var practiceType = Request["PracticeType"]; //类型（1：个人，2：团队）
            if (practiceType == "1")
            {
                wheres = " AND UserId=" + UserId;
            }
            else
            {
                wheres = " AND [Grouping_ID]=" + Grouping_ID;
            }
            var id = Request["ID"];//考试id

            var count = commonbll.GetRecordCount("bsi_TotalResult", " and Tstate=1 and Type_All=1 " + wheres + " and ExamId=" + id);
            if (count>0) {

                //您已交卷
                return "77";
            }

            if (practiceType == "2")//团队模式
            {
                //判断是否有分岗位
                var gwcount = commonbll.GetRecordCount("bsi_TeamPosition", " and ExamId=" + id + " and UserId=" + UserId);
                if (gwcount == 0)
                {
                    return "66";
                }
            }


            var resultcount = commonbll.UpdateInfo("bsi_TotalResult", "Tstate=1", " and Tstate=0 and Type_All=1 " + wheres + " and ExamId=" + id);
            if (resultcount> 0)
            {
              
                //循环所有 案例
                DataTable dt = commonbll.GetListDatatable("a.TaskId", "bsi_PracticeTasks  a INNER JOIN bsi_Task b ON a.TaskId = b.ID", " and PracticeId=" + id);
                //查下出成绩主表ID
                var TRId = commonbll.GetListSclar("ID", "bsi_TotalResult", " and Tstate=1 and Type_All=1 " + wheres + " and ExamId=" + id);
                string sqltxt = "";
                for (var i=0;i<dt.Rows.Count;i++) {
                    var taskId = dt.Rows[i]["TaskId"].ToString();

                    //循环案例
                    if (practiceType == "2")//团队模式
                    {
                        DataTable gwdt = commonbll.GetListDatatable("UserId,ID", "bsi_TeamPosition", " and TasKId="+ taskId + " and ExamId="+id);
                        for (var j=0;j<gwdt.Rows.Count;j++) {
                            var listusid = gwdt.Rows[j]["UserId"];//这个案例这个岗位几个人
                            var fileID= gwdt.Rows[j]["ID"];//岗位ID
                            var count1 = commonbll.GetRecordCount("bsi_TotalResultTask", " and TRId=" + TRId + " and TaskId=" + taskId + " and UserId=" + listusid);
                            if (count1 == 0)
                            {
                                sqltxt += @" insert into bsi_TotalResultTask values('" + TRId + "', '" + taskId + "', 0, 0, '" + listusid + "', '" + listusid + "', getdate(), getdate(),'"+ fileID + "')";
                            }
                        }
                    }
                    else
                    {
                        //个人的
                        //校验是否有做明细题
                        var count1 = commonbll.GetRecordCount("bsi_TotalResultTask", " and TRId=" + TRId + " and TaskId=" + taskId + " and UserId=" + UserId);
                        if (count1 == 0)
                        {
                            sqltxt += @" insert into bsi_TotalResultTask values('" + TRId + "', '" + taskId + "', 0, 0, '" + UserId + "', '" + UserId + "', getdate(), getdate(),-1)";
                        }
                    }
                }
                if (sqltxt.Length>0) {
                    SqlHelper.ExecuteNonQuery(sqltxt);
                }
                //所有任务详情改为已完成
                commonbll.UpdateInfo("bsi_TotalResultTask", "Tstate=1", " and TRId="+ TRId);
                return "1";
            }
            else
            {
                return "99";
            }
        }

        #endregion

        #region 理论知识考核列表
        /// <summary>
        /// 获得知识考核列表
        /// </summary>
        /// <returns></returns>
        public string GetKnowledgeAssessment()
        {
            string wheres = "";

            //查询条件
            if (!string.IsNullOrEmpty(Request["TState"]))
            {
                if (Request["TState"] == "0") //未开始
                {
                    wheres += " and statas='未开始' ";

                }
                else if (Request["TState"] == "1") //进行中
                {
                    wheres += " and statas='进行中' ";
                }
                else if (Request["TState"] == "2") //已结束
                {
                    wheres += " and statas='已结束' ";
                }
            }

            if (!string.IsNullOrEmpty(Request["SearchName"])) //考核名称
            {
                wheres += " and e_Name like  '%" + Request["SearchName"] + "%'";
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " E_AddTime desc "; //排序必须填写
            m.strFld = @"*";

            m.tab = @"( SELECT 
a.EId,a.E_PId,a.E_Name,a.E_StartTime,a.E_EndTime,
(CASE WHEN (a.E_StartTime>GETDATE()) THEN '未开始' 
  WHEN GETDATE()>a.E_EndTime THEN '已结束'
  else '进行中'
  end
) statas,DATEDIFF(MINUTE,e_startTime,E_EndTime) AS duration,(select SUM(EP_Score) from tb_HB_ExaminationPapers where EP_PId=E_PId) as ToScore,
(select ER_Score from  tb_ExaminationResult where ER_EId=EId and ER_PId=E_PId and ER_MId= " + UserId + " and ER_Type=1 and ER_State=0) as MyScore,a.E_AddTime " +
" FROM tb_HB_Examination a WHERE a.E_Type=1 AND a.E_IsState=1 and (a.E_TeamId like '%," + ClassId + ",%') ) tb";

            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }
        #endregion

        public ActionResult CaseEndView()
        {
            var id = Request["ID"];//考核ID
            string sql = "SELECT * FROM bsi_PracticeAssessment where ID=" + id;
            DataTable dt = commonbll.GetListDatatable(sql);
            if (dt != null && dt.Rows.Count > 0)
            {
                var PracticeStarTime = dt.Rows[0]["PracticeStarTime"];
                var PracticeLong = dt.Rows[0]["PracticeLong"];

                ViewData["PracticeName"] = dt.Rows[0]["PracticeName"];//考核名称
                ViewData["PracticeStarTime"] = PracticeStarTime;//考核开始时间
                ViewData["PracticeLong"] = PracticeLong;//考核时长

                var practiceType = Request["PracticeType"]; //类型（1：个人，2：团队）
                string wheresyx = " and UserId=" + UserId;
                if (practiceType == "2")//团队
                {
                    wheresyx = " and Grouping_ID=" + Grouping_ID;
                }
                //查询分数
                DataTable sdt = commonbll.GetListDatatable("Scores", "bsi_TotalResult", " and 1=1 " + wheresyx + " and ExamId=" + id);
                if (sdt.Rows.Count > 0)
                {
                    ViewData["TotalScore"] = sdt.Rows[0]["Scores"];
                }
                else {
                    ViewData["TotalScore"] = "0";
                }
               
                //计算出秒
                //考试结束时间
                //开始时间上加时长  得出结束时间

            }


          

            GetTeamAndRole();//获得角色

            return View();
        }


        public string CaseEndList()
        {
            var practiceType = Request["PracticeType"]; //类型（1：个人，2：团队）
            var ID = Request["ID"];//考试id

            string wheres = " and PracticeId=" + ID;

            string wheresyx = " and c.UserId=" + UserId;
            if (practiceType == "2")//团队
            {
                wheresyx = " and c.Grouping_ID=" + Grouping_ID;
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.AddTime desc"; //排序必须填写
            m.strFld = @" b.ID as TaskId,c.ID as TRID,a.PracticeId as ID,TaskName,(ISNULL((select SUM(Scores) from bsi_TotalResult where TRId = c.ID and TaskId = b.ID),0) as Scores,
  (SELECT top 1 PositionName FROM bsi_TeamPosition where ID=d.File_ID) AS PositionName,
  d.UpdateTime,d.Tstate";
            m.tab = @"bsi_PracticeTasks  a
  INNER JOIN bsi_Task b ON a.TaskId=b.ID
  left JOIN bsi_TotalResult c ON c.ExamId=a.PracticeId  and 1=1 " + wheresyx + @"
  left JOIN bsi_TotalResultTask d  ON d.TRId=c.ID and d.TaskId=a.TaskId and d.UserId=" + UserId;
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }



    }
}
