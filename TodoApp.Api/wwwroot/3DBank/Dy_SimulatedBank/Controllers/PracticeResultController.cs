using Dy_SimulatedBank.Models;
using Dy_SimulatedBank_Bll;
using Dy_SimulatedBank_DBUtility.Sql;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.Office.Interop.Word;
using System.Text;
using Aspose.Cells;
using DataTable = System.Data.DataTable;
using Dy_SimulatedBank.App_Start;

namespace Dy_SimulatedBank.Controllers
{

    /// <summary>
    /// ls案例成绩
    /// </summary>
    public class PracticeResultController : BaseController
    {
        CommonBll commonbll = new CommonBll();

        public ActionResult Index()
        {
            var dtPra = commonbll.GetListDatatable("*", "bsi_TotalResult", " and id=" + Request["TotalResultId"]);
            if (dtPra == null || dtPra.Rows.Count == 0 || dtPra.Rows[0]["UserId"].ToString() != base.UserId.ToString())
            {
                return Redirect("/StuHome/Index");
            }
            ViewData["UserName"] = UserNo;
            ViewData["StuName"] = StuName;
            DateTime endTime = DateTime.Parse(dtPra.Rows[0]["UpdateTime"].ToString());
            DateTime addTime = DateTime.Parse(dtPra.Rows[0]["AddTime"].ToString());
            ViewData["AnswerTime"] = answerTime(endTime - addTime);
            //厅堂是否开启
            var HallScene = commonbll.GetListSclar("HallScene", "bsi_Task", " and ID=" + Request["TaskId"]);
            ViewData["HallScene"] = HallScene;
            //柜面是否开启
            var CounterScene = commonbll.GetListSclar("CounterScene", "bsi_Task", " and ID=" + Request["TaskId"]);
            ViewData["CounterScene"] = CounterScene;
            var dt = commonbll.GetListSclar("Type_All", "bsi_PracticeAssessment", " and id=(select ExamId from bsi_TotalResult where id=" + Request["TotalResultId"] + ")");
            ViewData["type"] = dt;
            ViewData["ExamId"] = dtPra.Rows[0]["ExamId"];
            ViewData["trid"] = Request["TotalResultId"];
            return View();
        }
        private string answerTime(TimeSpan ts)
        {

            string result = $"{ts.Seconds.ToString().PadLeft(2, '0')}";
            result = ts.Minutes.ToString().PadLeft(2, '0') + "：" + result;
            result = ts.Hours.ToString().PadLeft(2, '0') + "：" + result;
            return result;
        }

        public ActionResult Jx()
        {
            ViewData["PID"] = Request["practiceID"];
            return View();
        }

        /// <summary>
        /// 获取总分
        /// </summary>
        /// <returns></returns>
        public string GetTotalScore()
        {
            string TRId = Request["TRId"].ToString();
            string TaskId = Request["TaskId"];
            double totalScores = 0;
            string TaskName = "";
            var dtResult = SqlHelper.ExecuteDataTable("select * from bsi_TotalResult where id = " + TRId);
            if (dtResult != null && dtResult.Rows.Count > 0)
            {
                //var AdditionScores = SqlHelper.ExecuteDataTable("select isnull(SUM(AdditionScores),0) as Scores from dbo.bsi_TaskCustomerRecord where TRId=" + TRId + " and TaskId=" + TaskId);
                //var dtTask = SqlHelper.ExecuteDataTable("select * from bsi_Task where id in(select taskid from bsi_PracticeTasks where PracticeId=" + dtResult.Rows[0]["ExamId"] + ")");
                //var TaskNameDt = SqlHelper.ExecuteDataTable("select TaskName from bsi_Task  where Id=" + TaskId);

                var dtExam = SqlHelper.ExecuteSclar("select PracticeName from bsi_PracticeAssessment where id=" + dtResult.Rows[0]["ExamId"]);
                TaskName = dtExam.ToString();
                totalScores = Convert.ToDouble(dtResult.Rows[0]["Scores"]);

            }
            System.Data.DataTable table = new System.Data.DataTable();
            table.Columns.Add("Scores");
            table.Columns.Add("Name");
            table.Rows.Add(totalScores, TaskName);
            //System.Data.DataTable dt = commonbll.GetListDatatable("*", @" bsi_TotalResult a inner join bsi_PracticeAssessment b on a.ExamId=b.ID ", " and a.ID=" + TRId);
            return JsonConvert.SerializeObject(table);
        }


        public string GetSceneScoreList()
        {
            var TaskId = Request["TaskId"];
            var SceneId = Request["SceneId"];
            string TRId = Request["TRId"].ToString();
            //int userid = 0;
            //if (Request["UserId"] != null && Request["UserId"] != "")
            //{
            //    userid = Convert.ToInt32(Request["UserId"]);
            //}
            //else
            //{
            //    userid = UserId;
            //}

            if (string.IsNullOrEmpty(SceneId))
            {
                SceneId = "0";
            }

            var CustomerId = "0";
            if (SceneId == "1")
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
            var retList = DownGetSceneScoreList(TaskId, SceneId, TRId, CustomerId);
            return JsonConvert.SerializeObject(retList);
        }

        /// <summary>
        /// 场景正确率
        /// </summary>
        /// <returns></returns>
        public string GetStartWork()
        {
            var TaskId = Request["TaskId"];
            string TRId = Request["TRId"];
            var dataResult = "";
            int userid = 0;
            if (Request["UserId"] != null && Request["UserId"] != "")
            {
                userid = Convert.ToInt32(Request["UserId"]);
            }
            else
            {
                userid = UserId;
            }
            //1:开工管理;2厅堂服务;3柜面服务;4完工
            for (int i = 1; i < 5; i++)
            {
                string Sql = @"select f.Scores,f.StuOperationalAnswers,a.*,b.AbilityScores,c.ID as AbilityId,c.AbilityName ,d.TMName,e.CustomerQuestion,e.Answer as InquiryAnswer
                            from
                          (select * from bsi_TaskDetail where Status=1 and TaskId = " + TaskId + " and SceneId = " + i + ") a left join(select TaskDetailId, AbilityId, AbilityScores from bsi_CaseCapabilityScore) b on b.TaskDetailId = a.ID ";
                Sql += @"left join(select ID, AbilityName from bsi_CapabilityModel) c on b.AbilityId = c.ID
                          left join bsi_TM d on a.FormId = d.TMNO
left join bsi_TaskCustomerInquiry e on a.InquiryId = e.ID 
left join bsi_TotalResultDetailed f on a.ID =f.TaskDetailId and f.TRTId in(select ID from bsi_TotalResultTask where TRId=" + TRId + ")";
                var Datadt = SqlHelper.ExecuteDataTable(Sql);

                var Dlength = Datadt.Rows.Count;
                int Num = 0;
                for (int j = 0; j < Datadt.Rows.Count; j++)
                {
                    var scores = Datadt.Rows[j]["Scores"].ToString();
                    if (scores == "1")
                    {
                        Num++;
                    }
                }
                int dateS = 0;
                if (Num > 0)
                {
                    dateS = Num * 100 / Dlength;
                }
                dataResult += "result" + i + ":" + dateS + ";";
            }

            return dataResult;

        }




        /// <summary>
        /// 获取角色正确率
        /// </summary>
        /// <returns></returns>
        public string GetRoleRate()
        {
            string TRId = Request["TRId"];
            var TaskId = Request["TaskId"];
            int userid = 0;
            if (Request["UserId"] != null && Request["UserId"] != "")
            {
                userid = Convert.ToInt32(Request["UserId"]);
            }
            else
            {
                userid = UserId;
            }
            var dataResult = "";
            //1高柜柜员的开工完工正确率;2大堂经理正确率;3低柜柜员;4高柜柜员
            for (int i = 1; i < 5; i++)
            {
                var CustomerIdList = SqlHelper.ExecuteDataTable("select ID,TaskId,BusinessType from bsi_TaskCustomer where TaskId=" + TaskId);
                //低柜
                var CustomerGId = "";
                //高柜
                var CustomerSId = "";
                try
                {
                    var Gid = CustomerIdList.Select("BusinessType='对公业务'");
                    if (Gid.Length > 0)
                    {
                        for (int j = 0; j < Gid.Length; j++)
                        {
                            CustomerGId += Gid[j]["ID"] + ",";
                        }
                        CustomerGId = CustomerGId.Substring(0, CustomerGId.Length - 1);
                    }
                    else
                    {
                        CustomerGId = "0";
                    }

                }
                catch (Exception)
                {
                    CustomerGId = "0";
                }
                try
                {

                    var Sid = CustomerIdList.Select("BusinessType='零售业务'");
                    if (Sid.Length > 0)
                    {
                        for (int j = 0; j < Sid.Length; j++)
                        {
                            CustomerSId += Sid[j]["ID"] + ",";
                        }
                        CustomerSId = CustomerSId.Substring(0, CustomerSId.Length - 1);
                    }
                    else
                    {
                        CustomerSId = "0";
                    }
                }
                catch (Exception)
                {
                    CustomerSId = "0";
                }

                string sql = "";
                sql += @"select f.Scores,f.StuOperationalAnswers,a.*,b.AbilityScores,c.ID as AbilityId,c.AbilityName ,d.TMName,e.CustomerQuestion,e.Answer as InquiryAnswer from";
                if (i == 1)
                {
                    sql += @"(select * from bsi_TaskDetail where Status=1 and TaskId = " + TaskId + " and SceneId in(1,4)) a left join(select TaskDetailId, AbilityId, AbilityScores from bsi_CaseCapabilityScore) b on b.TaskDetailId = a.ID";
                }
                else if (i == 2)
                {
                    sql += @"(select * from bsi_TaskDetail where Status=1 and  TaskId = " + TaskId + " and SceneId in(2)) a left join(select TaskDetailId, AbilityId, AbilityScores from bsi_CaseCapabilityScore) b on b.TaskDetailId = a.ID";
                }
                else if (i == 3)
                {
                    sql += @"(select * from bsi_TaskDetail where Status=1 and  TaskId = " + TaskId + " and SceneId in (3) and CustomerId in (" + CustomerSId + ")) a left join(select TaskDetailId, AbilityId, AbilityScores from bsi_CaseCapabilityScore) b on b.TaskDetailId = a.ID ";
                }
                else if (i == 4)
                {
                    sql += @"(select * from bsi_TaskDetail where Status=1 and  TaskId = " + TaskId + " and SceneId in (3) and CustomerId in (" + CustomerGId + ")) a left join(select TaskDetailId, AbilityId, AbilityScores from bsi_CaseCapabilityScore) b on b.TaskDetailId = a.ID ";

                }

                sql += @" left join(select ID, AbilityName from bsi_CapabilityModel) c on b.AbilityId = c.ID
                          left join bsi_TM d on a.FormId = d.TMNO
                          left join bsi_TaskCustomerInquiry e on a.InquiryId = e.ID
                          left join bsi_TotalResultDetailed f on a.ID = f.TaskDetailId and f.TRTId in(select ID from bsi_TotalResultTask where TRId=" + TRId + ")  order by a.SublinkId,a.Types";



                var Datadt = SqlHelper.ExecuteDataTable(sql);

                var Dlength = Datadt.Rows.Count;
                int Num = 0;
                for (int j = 0; j < Datadt.Rows.Count; j++)
                {
                    var scores = Datadt.Rows[j]["Scores"].ToString();
                    if (scores == "1")
                    {
                        Num++;
                    }
                }
                int dateS = 0;
                if (Num > 0)
                {
                    dateS = Num * 100 / Dlength;
                }
                if (i == 1)
                {
                    if (Dlength == 0)
                    {
                        dateS = 100;
                    }
                }
                dataResult += "result" + i + ":" + dateS + ";";

            }

            return dataResult;

        }


        /// <summary>
        /// 能力得分率 
        /// </summary>
        /// <returns></returns>
        public string GetAbilityScore()
        {
            string TRId = Request["TRId"];
            int userid = 0;
            if (Request["UserId"] != null && Request["UserId"] != "")
            {
                userid = Convert.ToInt32(Request["UserId"]);
            }
            else
            {
                userid = UserId;
            }
            string TaskId = Request["TaskId"].ToString();
            //所有题目添加能力值
            string allSQLScore = " select sum(AbilityScores) as Score,AbilityId ,AbilityName from bsi_CaseCapabilityScore a inner join bsi_CapabilityModel b on a.AbilityId=b.ID where TaskDetailId in (SELECT ID FROM bsi_TaskDetail WHERE  Status=1 and  TaskId=" + TaskId + ")  group by a.AbilityId,b.AbilityName ";
            var allScoreDt = SqlHelper.ExecuteDataTable(allSQLScore);
            //学生得到的能力值
            string stuSQLScore = " SELECT sum(StuScore) as Score ,AbilityId ,AbilityName FROM bsi_StuAbilityScore a inner join bsi_CapabilityModel b on a.AbilityId=b.ID where a.TRId=" + TRId + " and a.AddUserId=" + userid + " and TaskDetailId in(SELECT ID FROM bsi_TaskDetail WHERE  Status=1 and TaskId=" + TaskId + ") group by  AbilityId,AbilityName ";
            var stuScoreDt = SqlHelper.ExecuteDataTable(stuSQLScore);
            string strScore = "";

            if (stuScoreDt.Rows.Count > 0)
            {
                for (int i = 0; i < stuScoreDt.Rows.Count; i++)
                {
                    var stuAbilityId = stuScoreDt.Rows[i]["AbilityId"];
                    for (int j = 0; j < allScoreDt.Rows.Count; j++)
                    {
                        var allAbilityId = allScoreDt.Rows[j]["AbilityId"];
                        if (Convert.ToInt32(stuAbilityId) == Convert.ToInt32(allAbilityId))
                        {
                            try
                            {
                                Double stuS = Convert.ToDouble(stuScoreDt.Rows[i]["Score"]);
                                Double allS = Convert.ToDouble(allScoreDt.Rows[j]["Score"]);
                                int TotalScore = Convert.ToInt32(((stuS / allS) * 100));
                                if (TotalScore > 100)
                                {
                                    TotalScore = 100;
                                }
                                strScore += stuScoreDt.Rows[i]["AbilityName"] + "|" + TotalScore + ",";
                                //strScore += allScoreDt.Rows[i]["AbilityName"] + "|" + (Convert.ToInt32(stuScoreDt.Rows[i]["Score"]) / Convert.ToInt32(allScoreDt.Rows[j]["Score"])) * 100 + ",";
                            }
                            catch (Exception)
                            {
                                //strScore += allScoreDt.Rows[i]["AbilityName"] + "|0" + ",";
                            }

                        }
                    }
                }
                if (strScore != "")
                {
                    strScore = strScore.Substring(0, strScore.Length - 1);
                }
            }

            return strScore;
        }


        /// <summary>
        /// 获取解析
        /// </summary>
        /// <returns></returns>
        public string getPDFUrl()
        {
            string num = Request["Num"].ToString();
            //string Ssql = "";
            if (num.Length < 2)
            {
                num = "0" + num;
            }

            string url = SqlHelper.ExecuteSclar("SELECT wjurl  FROM bsi_ProcessAnalysis where huanjiename like'" + num + "%'").ToString();
            return url;
        }

        /// <summary>
        /// 获取客户列表
        /// </summary>
        /// <returns></returns>
        public string GetSceneCustomerList()
        {

            var TaskId = Request["TaskId"];
            var TRId = Request["TRId"];

            string sql = $@"select a.ID,CustomerName,BusinessName,ISNULL(Satisfaction,100) as Satisfaction
from
bsi_TaskCustomer a inner
join bsi_TaskBusiness b on a.[BusinessId] = b.ID
LEFT JOIN bsi_TaskCustomerRecord C ON  A.ID = C.CustomerId AND TRId = {TRId}
where a.TaskId = {TaskId} order by a.CustomerOrder asc ";

            var dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);

        }
        /// <summary>
        /// 获取附加分
        /// </summary>
        /// <returns></returns>
        public string GetAdditionScores()
        {
            var TRId = Request["TRId"];
            int userid = 0;
            if (Request["UserId"] != null && Request["UserId"] != "")
            {
                userid = Convert.ToInt32(Request["UserId"]);
            }
            else
            {
                userid = UserId;
            }
            var TaskId = Request["TaskId"];
            string additionScores = SqlHelper.ExecuteSclar("select SUM(AdditionScores) as AdditionScores from bsi_TaskCustomerRecord  where TaskId= " + TaskId + " and TRId=" + TRId).ToString();
            additionScores = "0";
            ViewData["AdditionScores"] = additionScores;
            if (additionScores == "")
            {
                additionScores = "0";
            }
            return additionScores;
        }

        /// <summary>
        /// 获取角色能力值
        /// </summary>
        /// <returns></returns>
        public string GetCaseCapabilityScoreForRole()
        {
            var TRId = Request["TRId"];
            var TaskId = Request["TaskId"];

            //1高柜柜员的开工完工;2大堂经理;3高柜柜员;4低柜柜员
            //当类型为3的时候根据类型区分 零售高柜,对公低柜
            string sql = "select SUM(a.StuScore)  as TotalScore, f.AbilityName,a.AbilityId,b.SceneId,c.BusinessType,e.Name,e.StudentNo from bsi_StuAbilityScore a inner join bsi_TaskDetail b on a.TaskDetailId = b.ID and b.Status=1  left join bsi_TaskCustomer c on b.CustomerId = c.ID inner join dbo.tb_Student e on a.AddUserId = e.UserId inner join bsi_CapabilityModel f on a.AbilityId=f.ID  WHERE b.TaskId = " + TaskId + " and a.TRId = " + TRId + "group by f.AbilityName,a.AbilityId,a.StuScore,b.SceneId,c.BusinessType,e.Name,e.StudentNo";
            //string sql = "select SUM(a.StuScore)  as TotalScore, f.AbilityName,a.AbilityId,b.SceneId,e.Name,e.StudentNo from bsi_StuAbilityScore a inner join bsi_TaskDetail b on a.TaskDetailId = b.ID  inner join dbo.tb_Student e on a.AddUserId = e.UserId inner join bsi_CapabilityModel f on a.AbilityId=f.ID  WHERE b.TaskId = " + TaskId + " and a.TRId = " + TRId + "group by f.AbilityName,a.AbilityId,a.StuScore,b.SceneId,e.Name,e.StudentNo";
            var dt = SqlHelper.ExecuteDataTable(sql);

            string GInfo = "";    //高柜
            string DInfo = "";  //低柜
            string JInfo = "";  //大堂经理
            string allInfo = "";
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if (dt.Rows[i]["SceneId"].ToString() == "1")
                    {
                        if (GInfo.IndexOf(dt.Rows[i]["AbilityName"].ToString()) == -1)
                        {
                            GInfo += dt.Rows[i]["Name"].ToString() + "(" + dt.Rows[i]["StudentNo"].ToString() + ")" + "|" + dt.Rows[i]["AbilityName"].ToString() + ":" + dt.Rows[i]["TotalScore"].ToString() + ";";
                        }

                    }
                    else if (dt.Rows[i]["SceneId"].ToString() == "2")
                    {
                        if (JInfo.IndexOf(dt.Rows[i]["AbilityName"].ToString()) == -1)
                        {
                            JInfo += dt.Rows[i]["Name"].ToString() + "(" + dt.Rows[i]["StudentNo"].ToString() + ")" + "|" + dt.Rows[i]["AbilityName"].ToString() + ":" + dt.Rows[i]["TotalScore"].ToString() + ";";
                        }
                    }
                    else if (dt.Rows[i]["SceneId"].ToString() == "3")
                    {
                        if (dt.Rows[i]["BusinessType"].ToString() == "零售业务")
                        {
                            if (GInfo.IndexOf(dt.Rows[i]["AbilityName"].ToString()) == -1)
                            {
                                GInfo += dt.Rows[i]["Name"].ToString() + "(" + dt.Rows[i]["StudentNo"].ToString() + ")" + "|" + dt.Rows[i]["AbilityName"].ToString() + ":" + dt.Rows[i]["TotalScore"].ToString() + ";";
                            }
                        }
                        else if (dt.Rows[i]["BusinessType"].ToString() == "对公业务")
                        {
                            if (GInfo.IndexOf(dt.Rows[i]["AbilityName"].ToString()) == -1)
                            {
                                DInfo += dt.Rows[i]["Name"].ToString() + "(" + dt.Rows[i]["StudentNo"].ToString() + ")" + "|" + dt.Rows[i]["AbilityName"].ToString() + ":" + dt.Rows[i]["TotalScore"].ToString() + ";";
                            }
                        }
                    }
                    else if (dt.Rows[i]["SceneId"].ToString() == "4")
                    {
                        if (GInfo.IndexOf(dt.Rows[i]["AbilityName"].ToString()) == -1)
                        {
                            GInfo += dt.Rows[i]["Name"].ToString() + "(" + dt.Rows[i]["StudentNo"].ToString() + ")" + "|" + dt.Rows[i]["AbilityName"].ToString() + ":" + dt.Rows[i]["TotalScore"].ToString() + ";";
                        }
                    }
                    else
                    {
                        if (GInfo.IndexOf(dt.Rows[i]["AbilityName"].ToString()) == -1)
                        {
                            DInfo += dt.Rows[i]["Name"].ToString() + "(" + dt.Rows[i]["StudentNo"].ToString() + ")" + "|" + dt.Rows[i]["AbilityName"].ToString() + ":" + dt.Rows[i]["TotalScore"].ToString() + ";";
                        }
                    }
                }
            }
            if (JInfo != "")
            {
                JInfo = JInfo.Substring(0, JInfo.Length - 1);
            }
            if (GInfo != "")
            {
                GInfo = GInfo.Substring(0, GInfo.Length - 1);
            }
            if (DInfo != "")
            {
                DInfo = DInfo.Substring(0, DInfo.Length - 1);
            }
            allInfo = JInfo + "," + GInfo + "," + DInfo;
            return allInfo;
        }


        //查看质询解析
        public string SeeInquiry()
        {
            var TaskDetailId = Request["TaskDetailId"];
            var sql = $@"select b.Analysis
from 
(select * from bsi_TaskDetail where  Status=1 and  ID = {TaskDetailId}) a  
join bsi_TaskCustomerInquiry b on a.InquiryId = b.ID";

            var dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);
        }

        public DataSet ds = null;
        public string CreateWord()
        {
            string message = "";
            try
            {
                //场景正确率
                string sceneCorrectness = GetStartWork();
                var Scores = sceneCorrectness.Split(';');
                var num1 = Scores[0].Split(':')[1];
                var num2 = Scores[1].Split(':')[1];
                var num3 = Scores[2].Split(':')[1];
                var num4 = Scores[3].Split(':')[1];
                //角色正确率
                string roleCorrectness = GetRoleRate();
                var Scores1 = roleCorrectness.Split(';');
                var num5 = Scores1[1].Split(':')[1];
                var num6 = Scores1[2].Split(':')[1];
                var num7 = Scores1[3].Split(':')[1] + Convert.ToInt32(Scores1[0].Split(':')[1]) / 2;


                //角色能力值
                string CaseCapability = GetCaseCapabilityScoreForRole();
                //附加分值
                string AdditionScores = GetAdditionScores();


                int i = 1;
                Object Nothing = System.Reflection.Missing.Value;
                Directory.CreateDirectory("F:/DL");  //创建文件所在目录

                string name = "成绩报告_" + DateTime.Now.ToString("yyyyMMddhhmmssfff") + ".doc";//文件名
                object filename = "F://DL//" + name;  //文件保存路径
                //创建Word文档
                Microsoft.Office.Interop.Word.Application WordApp = new Microsoft.Office.Interop.Word.Application();
                Microsoft.Office.Interop.Word.Document WordDoc = WordApp.Documents.Add(ref Nothing, ref Nothing, ref Nothing, ref Nothing);
                WordApp.Selection.PageSetup.LeftMargin = 85f;
                WordApp.Selection.PageSetup.RightMargin = 85f;
                WordApp.Selection.PageSetup.PageWidth = 650f;  //页面宽度
                //添加页眉
                WordApp.ActiveWindow.View.Type = WdViewType.wdOutlineView;
                WordApp.ActiveWindow.View.SeekView = WdSeekView.wdSeekPrimaryHeader;
                WordApp.ActiveWindow.ActivePane.Selection.InsertAfter("成绩报告");
                WordApp.Selection.ParagraphFormat.Alignment = Microsoft.Office.Interop.Word.WdParagraphAlignment.wdAlignParagraphRight;//设置右对齐
                WordApp.ActiveWindow.View.SeekView = WdSeekView.wdSeekMainDocument;//跳出页眉设置
                WordApp.Selection.ParagraphFormat.LineSpacing = 15f;//设置文档的行间距     
                //移动焦点并换行
                object count = 14;
                object WdLine = Microsoft.Office.Interop.Word.WdUnits.wdLine;//换一行;
                WordApp.Selection.Text = "成绩报告";
                WordApp.Selection.ParagraphFormat.LineSpacing = 30f;
                WordApp.Selection.Range.Bold = 2;
                WordApp.Selection.ParagraphFormat.Alignment = Microsoft.Office.Interop.Word.WdParagraphAlignment.wdAlignParagraphCenter;
                WordApp.Selection.MoveDown(ref WdLine, ref count, ref Nothing);//移动焦点
                WordApp.Selection.ParagraphFormat.Alignment = Microsoft.Office.Interop.Word.WdParagraphAlignment.wdAlignParagraphCenter;
                WordApp.Selection.TypeParagraph();//插入段落
                WordApp.Selection.ParagraphFormat.Alignment = Microsoft.Office.Interop.Word.WdParagraphAlignment.wdAlignParagraphLeft;
                WordApp.Selection.ParagraphFormat.LineSpacing = 16;
                WordApp.Selection.Font.Size = 10f;
                WordApp.Selection.Font.Color = Microsoft.Office.Interop.Word.WdColor.wdColorGray40;







                //文档中创建表格
                Microsoft.Office.Interop.Word.Table newTable = WordDoc.Tables.Add(WordApp.Selection.Range, 8, 3, ref Nothing, ref Nothing);
                //设置表格样式
                newTable.Borders.OutsideLineStyle = Microsoft.Office.Interop.Word.WdLineStyle.wdLineStyleNone;
                newTable.Columns[1].Width = 175f;
                newTable.Columns[2].Width = 170f;
                newTable.Columns[3].Width = 135f;


                //填充表格内容
                newTable.Cell(1, 1).Range.Text = "场景正确率";
                newTable.Cell(1, 1).Range.Bold = 2;//设置单元格中字体为粗体
                newTable.Cell(1, 1).Range.Font.Color = Microsoft.Office.Interop.Word.WdColor.wdColorBlack;
                //合并单元格
                newTable.Cell(1, 1).Merge(newTable.Cell(1, 3));
                WordApp.Selection.Cells.VerticalAlignment = Microsoft.Office.Interop.Word.WdCellVerticalAlignment.wdCellAlignVerticalBottom;//垂直居下
                WordApp.Selection.ParagraphFormat.Alignment = Microsoft.Office.Interop.Word.WdParagraphAlignment.wdAlignParagraphLeft;//水平居左
                WordApp.Selection.Shading.BackgroundPatternColorIndex = Microsoft.Office.Interop.Word.WdColorIndex.wdGray25;
                newTable.Rows[1].Range.ParagraphFormat.LineSpacing = 20f;
                //填充表格内容
                newTable.Cell(2, 1).Range.Text = "开工管理：" + num1;
                //纵向合并单元格
                newTable.Cell(2, 3).Select();//选中一行
                object moveUnit = Microsoft.Office.Interop.Word.WdUnits.wdLine;
                object moveCount = 5;
                object moveExtend = Microsoft.Office.Interop.Word.WdMovementType.wdExtend;
                WordApp.Selection.MoveDown(ref moveUnit, ref moveCount, ref moveExtend);
                WordApp.Selection.Cells.Merge();
                ////插入图片
                //string FileName = Server.MapPath(ds.Tables[0].Rows[0]["Photo"] != null && ds.Tables[0].Rows[0]["Photo"].ToString().Length > 0 ? ds.Tables[0].Rows[0]["Photo"].ToString() : "/sys_admin/images/noImg.jpg");//图片所在路径
                //object LinkToFile = false;
                //object SaveWithDocument = true;
                //object Anchor = WordDoc.Application.Selection.Range;
                //WordDoc.Application.ActiveDocument.InlineShapes.AddPicture(FileName, ref LinkToFile, ref SaveWithDocument, ref Anchor);
                //WordDoc.Application.ActiveDocument.InlineShapes[1].Width = 80f;//图片宽度
                //WordDoc.Application.ActiveDocument.InlineShapes[1].Height = 100f;//图片高
                //WordApp.Selection.ParagraphFormat.Alignment = Microsoft.Office.Interop.Word.WdParagraphAlignment.wdAlignParagraphCenter;
                ////将图片设置为四周环绕型
                //Microsoft.Office.Interop.Word.Shape s = WordDoc.Application.ActiveDocument.InlineShapes[1].ConvertToShape();
                //s.WrapFormat.Type = Microsoft.Office.Interop.Word.WdWrapType.wdWrapSquare;

                newTable.Cell(3, 1).Range.Text = "厅堂服务: " + num2;
                newTable.Cell(4, 1).Range.Text = "柜面服务： " + num3;
                newTable.Cell(5, 1).Range.Text = "完工管理 ：" + num4;





                //newTable.Cell(5, 1).Range.Text = ds.Tables[0].Rows[0]["MobileNumber"] == null ? "手机号码: " + ds.Tables[0].Rows[0]["MobileNumber"] : "联系电话: " + ds.Tables[0].Rows[0]["PhoneNumber"];



                //角色正确率          
                object missing = System.Reflection.Missing.Value;
                object count2 = 2;
                object WdLine2 = Microsoft.Office.Interop.Word.WdUnits.wdLine;//换一行;  
                WordApp.Selection.MoveDown(ref WdLine2, ref count2, ref missing);//光标向下移1行  
                WordApp.Selection.TypeParagraph();//在表格外回车 

                //if (ds.Tables[1].Rows.Count > 0)
                //{

                //文档中创建表格
                Microsoft.Office.Interop.Word.Table QzyxTable = WordDoc.Tables.Add(WordApp.Selection.Range, 6, 1, ref Nothing, ref Nothing);
                //设置表格样式
                QzyxTable.Borders.OutsideLineStyle = Microsoft.Office.Interop.Word.WdLineStyle.wdLineStyleNone;
                QzyxTable.Columns[1].Width = 480f;
                //填充表格内容
                QzyxTable.Cell(1, 1).Range.Text = "角色正确率";
                QzyxTable.Cell(1, 1).Range.Bold = 2;//设置单元格中字体为粗体
                QzyxTable.Cell(1, 1).Range.Font.Color = Microsoft.Office.Interop.Word.WdColor.wdColorBlack;
                //合并单元格
                WordApp.Selection.Cells.VerticalAlignment = Microsoft.Office.Interop.Word.WdCellVerticalAlignment.wdCellAlignVerticalBottom;//垂直居下
                WordApp.Selection.ParagraphFormat.Alignment = Microsoft.Office.Interop.Word.WdParagraphAlignment.wdAlignParagraphLeft;//水平居左
                WordApp.Selection.Shading.BackgroundPatternColorIndex = Microsoft.Office.Interop.Word.WdColorIndex.wdGray25;
                QzyxTable.Rows[1].Range.ParagraphFormat.LineSpacing = 20f;
                QzyxTable.Cell(2, 1).Range.Text = "大堂经理: " + num5;
                QzyxTable.Cell(3, 1).Range.Text = "高柜柜员: " + num6;
                QzyxTable.Cell(4, 1).Range.Text = "低柜柜员: " + num7;
                //}


                //能力得分率
                object count3 = 6;
                WordApp.Selection.MoveDown(ref WdLine2, ref count3, ref missing);//光标向下移1行  
                WordApp.Selection.TypeParagraph();//在表格外回车 
                int j = 2;
                //if (ds.Tables[3].Rows.Count > 0)
                //{
                //工作经验个数
                //int i = ds.Tables[3].Rows.Count;
                //文档中创建表格
                Microsoft.Office.Interop.Word.Table GzjyTable = WordDoc.Tables.Add(WordApp.Selection.Range, 10, 1, ref Nothing, ref Nothing);
                //设置表格样式
                GzjyTable.Borders.OutsideLineStyle = Microsoft.Office.Interop.Word.WdLineStyle.wdLineStyleNone;
                GzjyTable.Columns[1].Width = 480f;
                //填充表格内容
                GzjyTable.Cell(1, 1).Range.Text = "能力得分率";
                GzjyTable.Cell(1, 1).Range.Bold = 2;//设置单元格中字体为粗体
                GzjyTable.Cell(1, 1).Range.Font.Color = Microsoft.Office.Interop.Word.WdColor.wdColorBlack;
                //合并单元格
                WordApp.Selection.Cells.VerticalAlignment = Microsoft.Office.Interop.Word.WdCellVerticalAlignment.wdCellAlignVerticalBottom;//垂直居下
                WordApp.Selection.ParagraphFormat.Alignment = Microsoft.Office.Interop.Word.WdParagraphAlignment.wdAlignParagraphLeft;//水平居左
                WordApp.Selection.Shading.BackgroundPatternColorIndex = Microsoft.Office.Interop.Word.WdColorIndex.wdGray25;
                GzjyTable.Rows[1].Range.ParagraphFormat.LineSpacing = 20f;

                //能力得分率
                string AbilityCorrectness = GetAbilityScore();
                var AbilityScores = AbilityCorrectness.Split(',');
                for (var k = 0; k < AbilityScores.Length; k++)
                {
                    var PScore = AbilityScores[k];
                    var ReallyScore = PScore.Split('|');
                    var ShowScore = "";
                    var ShowName = "";
                    int CellNum = 1;
                    for (var y = 0; y < ReallyScore.Length; y++)
                    {
                        CellNum++;
                        ShowScore = ReallyScore[1];
                        ShowName = ReallyScore[0];

                    }
                    GzjyTable.Cell(CellNum, 1).Range.Text = ShowName + ": " + ShowScore;
                }


                //GzjyTable.Cell(2, 1).Range.Text = "大堂经理: " + " 10% ";
                //GzjyTable.Cell(3, 1).Range.Text = "高柜柜员: " + " 20% ";
                //GzjyTable.Cell(4, 1).Range.Text = "低柜柜员: " + " 30% ";

                //}

                //附加分值
                object count4 = j;
                WordApp.Selection.MoveDown(ref WdLine2, ref count4, ref missing);//光标向下移1行  
                WordApp.Selection.TypeParagraph();//在表格外回车 
                                                  //if (ds.Tables[2].Rows.Count > 0)
                                                  //{
                                                  //教育经历个数
                                                  //int i = ds.Tables[2].Rows.Count;

                //文档中创建表格
                Microsoft.Office.Interop.Word.Table jyjlTable = WordDoc.Tables.Add(WordApp.Selection.Range, 8, 1, ref Nothing, ref Nothing);
                //设置表格样式
                jyjlTable.Borders.OutsideLineStyle = Microsoft.Office.Interop.Word.WdLineStyle.wdLineStyleNone;
                jyjlTable.Columns[1].Width = 480f;
                //填充表格内容
                jyjlTable.Cell(1, 1).Range.Text = "附加分值";
                jyjlTable.Cell(1, 1).Range.Bold = 2;//设置单元格中字体为粗体
                jyjlTable.Cell(1, 1).Range.Font.Color = Microsoft.Office.Interop.Word.WdColor.wdColorBlack;
                //合并单元格
                WordApp.Selection.Cells.VerticalAlignment = Microsoft.Office.Interop.Word.WdCellVerticalAlignment.wdCellAlignVerticalBottom;//垂直居下
                WordApp.Selection.ParagraphFormat.Alignment = Microsoft.Office.Interop.Word.WdParagraphAlignment.wdAlignParagraphLeft;//水平居左
                WordApp.Selection.Shading.BackgroundPatternColorIndex = Microsoft.Office.Interop.Word.WdColorIndex.wdGray25;
                jyjlTable.Rows[1].Range.ParagraphFormat.LineSpacing = 20f;
                jyjlTable.Cell(2, 1).Range.Text = "大堂经理: " + " 10% ";
                jyjlTable.Cell(3, 1).Range.Text = "高柜柜员: " + " 20% ";
                jyjlTable.Cell(4, 1).Range.Text = "低柜柜员: " + " 30% ";

                //}


                //文件保存
                WordDoc.SaveAs(ref filename, ref Nothing, ref Nothing, ref Nothing, ref Nothing, ref Nothing, ref Nothing, ref Nothing, ref Nothing, ref Nothing, ref Nothing, ref Nothing, ref Nothing, ref Nothing, ref Nothing, ref Nothing);
                WordDoc.Close(ref Nothing, ref Nothing, ref Nothing);
                WordApp.Quit(ref Nothing, ref Nothing, ref Nothing);
                message = name + "文档生成成功，以保存到 F:\\DL 下";
            }
            catch
            {
                message = "文件导出异常！";
            }
            return message;
        }

        /// <summary>
        /// 导出excel
        /// </summary>
        /// <returns></returns>
        public string ExportForExcel()
        {

            Workbook book = new Workbook(); //创建工作簿 

            var TaskId = Request["TaskId"];
            var SceneId = Request["SceneId"];
            string TRId = Request["TRId"].ToString();
            string PracticeName = Request["PracticeName"];
            List<TaskDetailRowCModel> data;
            for (int i = 1; i <= 4; i++)
            {

                data = DownGetSceneScoreList(TaskId, i.ToString(), TRId, "0");

                foreach (var item in data)
                {
                    var StuOperationalAnswers = item.StuOperationalAnswers;
                    if (item.StuOperationalAnswers == null)
                    {
                        StuOperationalAnswers = "";
                    }

                    if (item.LinkId == 133)
                    {
                        var textName = "";
                        var Zhang = new string[] { "柜员私章", "银行业务公章", "附件章", "现讫章", "假币章", "货币鉴定专用章", "转讫章", "账户管理专用章" };
                        var StuOperationalAnswersList = item.StuOperationalAnswers.Split(',');
                        for (var j = 0; j < StuOperationalAnswersList.Length; j++)
                        {
                            if (StuOperationalAnswersList[j].Length > 0)
                            {
                                textName += Zhang[int.Parse(StuOperationalAnswersList[j]) - 1] + ",";
                            }
                        }
                        if (textName.Length > 0)
                        {
                            StuOperationalAnswers = textName.Substring(0, textName.Length - 1);
                        }
                    }

                    var Answer = item.Answer;
                    if (item.Types == 1)
                    {

                    }
                    else if (item.Types == 2)
                    {
                        Answer = item.TMName;
                        if (StuOperationalAnswers.Length > 0)
                        {
                            if (StuOperationalAnswers != "已校验" && StuOperationalAnswers != "未校验")
                            {
                                if (item.Scores == 0)
                                {
                                    StuOperationalAnswers = "不完全正确";
                                }
                                else
                                {
                                    StuOperationalAnswers = "完全正确";
                                }
                            }

                        }
                    }
                    else if (item.Types == 3)
                    {
                        Answer = $"{item.CustomerQuestion}:{item.InquiryAnswer}";
                    }


                    item.StuOperationalAnswers = StuOperationalAnswers;
                    item.Answer = Answer;


                }


                book.Worksheets.Add();
                Worksheet sheet = book.Worksheets[i - 1]; //创建工作表
                if (i == 1)
                {
                    sheet.Name = "开工明细";
                }
                else if (i == 2)
                {
                    sheet.Name = "厅堂服务明细";
                }
                else if (i == 3)
                {
                    sheet.Name = "柜面服务明细";
                }
                else if (i == 4)
                {
                    sheet.Name = "完工明细";
                }

                DataTableExport(data, book, sheet);

            }
            TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);

            string time = ts.TotalSeconds.ToString();

            string saveName = System.AppDomain.CurrentDomain.SetupInformation.ApplicationBase + "/Export/" + PracticeName + time + ".xlsx";
            string returnFile = "/Export/" + PracticeName + time + ".xlsx";
            //string saveName = "F:\\DL\\"+ PracticeName + time + ".xlsx";
            book.Save(saveName); //保存
            GC.Collect();
            return returnFile;
        }



        /// <summary>
        /// 获取操作业务列表
        /// </summary>
        /// <param name="TaskId"></param>
        /// <param name="SceneId"></param>
        /// <param name="TRId"></param>
        /// <param name="CustomerId"></param>
        /// <returns></returns>
        public List<TaskDetailRowCModel> DownGetSceneScoreList(string TaskId, string SceneId, string TRId, string CustomerId)
        {
            string sql = @"select ISNULL(f.Scores,0) as Scores,ISNULL(f.StuOperationalAnswers,'') as StuOperationalAnswers,a.*,b.AbilityScores,h.CustomerName,c.ID as AbilityId,c.AbilityName ,d.TMName,e.CustomerQuestion,e.RightKey as InquiryAnswer,g.StudentNo as AccountNo,g.Name as SName
                            from 
                          (select * from bsi_TaskDetail where Status=1 and TaskId = " + TaskId + " and SceneId =" + SceneId;

            if (CustomerId != "0")
            {
                sql += "and CustomerId = " + CustomerId;
            }

            sql += @"  ) a  left join (select TaskDetailId,AbilityId,AbilityScores from bsi_CaseCapabilityScore) b on b.TaskDetailId = a.ID
left join (select ID,AbilityName from bsi_CapabilityModel) c on b.AbilityId = c.ID
left join bsi_TM d on a.FormId = d.TMNO
left join bsi_TaskCustomerInquiry e on a.InquiryId = e.ID  
left join bsi_TaskCustomer h on a.CustomerId=h.ID
left join bsi_TotalResultDetailed f on a.ID =f.TaskDetailId and f.TRTId in(select ID from bsi_TotalResultTask where TRId=" + TRId + ")  left join tb_Student g on f.AddUserId=g.UserId order by a.CustomerId, a.SublinkId,a.Types,a.LinkId,e.SerialNumber";

            var dt = SqlHelper.ExecuteDataTable(sql);

            var query = from t in dt.AsEnumerable()
                        group t by new { t1 = t.Field<int>("ID") } into m
                        select new TaskDetailRowCModel()
                        {
                            TaskDetailId = m.Key.t1,
                            AbilityString = string.Join(";", m.Where(y => y.Field<int?>("AbilityScores") != null).Select(y => ($"{y.Field<string>("AbilityName")}:{y.Field<int>("AbilityScores")}分"))),
                            SceneId = m.First().Field<int>("SceneId"),
                            SubLinkId = m.First().Field<int>("SubLinkId"),
                            LinkId = m.First().Field<int>("LinkId"),
                            OperationName = m.First().Field<string>("OperationName"),
                            Types = m.First().Field<int>("Types"),
                            Answer = m.First().Field<string>("Answer"),
                            TMName = m.First().Field<string>("TMName"),
                            CustomerQuestion = m.First().Field<string>("CustomerQuestion"),
                            InquiryAnswer = m.First().Field<string>("InquiryAnswer"),
                            StuOperationalAnswers = m.First().Field<string>("StuOperationalAnswers"),
                            Scores = m.First().Field<double>("Scores"),
                            CustomerName = m.First().Field<string>("CustomerName"),
                            AccountNo = m.First().Field<string>("AccountNo"),
                            SName = m.First().Field<string>("SName")

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
                        if (findTemp != null)
                        {
                            formNameList.Add(findTemp["TMName"].ToString());
                        }
                    }
                    item.Answer = string.Join(",", formNameList);


                    var StuOperationalAnswers = item.StuOperationalAnswers;
                    formlist = StuOperationalAnswers.Split(',');

                    formNameList = new List<string>();
                    for (int j = 0; j < formlist.Length; j++)
                    {
                        var findTemp = tm_Dt.FirstOrDefault(t => t.Field<string>("TMNO") == formlist[j]);
                        if (findTemp != null)
                        {
                            formNameList.Add(findTemp["TMName"].ToString());
                        }
                    }
                    item.StuOperationalAnswers = string.Join(",", formNameList);

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
                else if (LinkId == "10")//现金答案做特殊显示
                {
                    var answer = item.Answer;
                    var cashlist = answer.Split(',');
                    if (cashlist.Length == 2)
                    {
                        item.Answer = "实际可兑付" + cashlist[1];
                    }
                    else
                    {
                        item.Answer = "";
                    }
                    var StuOperationalAnswers = item.StuOperationalAnswers;
                    cashlist = StuOperationalAnswers.Split(',');
                    if (cashlist.Length == 2)
                    {
                        item.StuOperationalAnswers = "实际可兑付" + cashlist[1];
                    }
                    else
                    {
                        item.StuOperationalAnswers = "";
                    }
                }
            }

            return retList;
        }
        /// <summary>
        /// DataTable数据导出Excel导出成绩以及详情
        /// </summary>
        /// <param name="data"></param>
        /// <param name="filepath"></param>
        public static void DataTableExport(List<TaskDetailRowCModel> data, Workbook book, Worksheet sheet)
        {
            try
            {
                Dictionary<string, string> dict = new Dictionary<string, string>() {
                    { "1", "开工" },
                    { "2", "厅堂接待" },
                    { "3", "取号" },
                    { "4" , "取号后引导" },
                    { "5", "厅堂填单" },
                    { "6", "填单后引导" },
                    { "7", "柜面接待" },
                    { "8" ,"单据收取"},
                    { "9","资料收取与校验"},
                    { "91","资料收取与校验-身份证"},
                    { "92","资料收取与校验-非身份证"},
                    { "10","现金处理"},
                    { "11","柜员填单"},
                    { "12","业务办理"},
                    { "13","单据盖章与签字"},
                    { "133","单据签字"},
                    { "134","单据签字"},
                    { "14","返还资料"},
                    { "15","柜台送别"},
                    { "151","柜台送别"},
                    { "16","厅堂送别"},
                    { "161","厅堂送别"},
                    { "17","完工"}
                };

                Aspose.Cells.Cells cells = sheet.Cells; //单元格
                                                        //创建样式
                Aspose.Cells.Style style = book.Styles[book.Styles.Add()];
                style.Borders[Aspose.Cells.BorderType.LeftBorder].LineStyle = Aspose.Cells.CellBorderType.Thin; //应用边界线 左边界线  
                style.Borders[Aspose.Cells.BorderType.RightBorder].LineStyle = Aspose.Cells.CellBorderType.Thin; //应用边界线 右边界线  
                style.Borders[Aspose.Cells.BorderType.TopBorder].LineStyle = Aspose.Cells.CellBorderType.Thin; //应用边界线 上边界线  
                style.Borders[Aspose.Cells.BorderType.BottomBorder].LineStyle = Aspose.Cells.CellBorderType.Thin; //应用边界线 下边界线   
                style.HorizontalAlignment = TextAlignmentType.Center; //单元格内容的水平对齐方式文字居中
                style.Font.Name = "宋体"; //字体
                style.Font.IsBold = true; //设置粗体
                style.Font.Size = 11; //设置字体大小

                //表格填充数据
                int Colnum = 4;//表格列数 
                int Rownum = data.Count;//表格行数 
                var TitleAr = new string[] { "厅堂服务场景", "对应操作", "正确答案或选项", "我的答案或选项", "客户名" };
                for (int i = 0; i < TitleAr.Length; i++)
                {
                    cells[0, i].PutValue(TitleAr[i]); //添加表头
                    cells[0, i].SetStyle(style); //添加样式

                }
                string SubLinkName = "";
                for (int i = 0; i < data.Count; i++)
                {
                    foreach (var item in dict)
                    {
                        if (item.Key == data[i].SubLinkId.ToString())
                        {
                            SubLinkName = item.Value;
                        }
                    }
                    cells[i + 1, 0].PutValue(SubLinkName);
                    cells[i + 1, 1].PutValue(data[i].OperationName);
                    cells[i + 1, 2].PutValue(data[i].Answer);
                    cells[i + 1, 3].PutValue(data[i].StuOperationalAnswers);
                    cells[i + 1, 4].PutValue(data[i].CustomerName);
                }

            }
            catch (Exception e)
            {

            }
        }


        /// <summary>
        /// by yk
        /// 获取做题明细的正确率
        /// { "开工管理", "厅堂服务", "柜面服务", "完工管理", "大堂经理", "高柜柜员", "低柜柜员" };
        /// </summary>
        /// <returns></returns>
        public string GetTaskDetailsAccuracy(string TRId, string TaskId)
        {

            var sqlTaskDetail = $@"select a.*, ISNULL(b.Scores,0) as Scores,c.BusinessType
from 
(select * from bsi_TaskDetail where TaskId = {TaskId} and Status = 1) a 
left join bsi_TaskCustomer c on a.CustomerId = c.ID
left join(select * from bsi_TotalResultDetailed where TRTId in (select ID from bsi_TotalResultTask where TRId = {TRId})) b on a.ID = b.TaskDetailId
order by a.CustomerId,a.SublinkId,a.Types,a.LinkId";
            var dtTaskDetail = SqlHelper.ExecuteDataTable(sqlTaskDetail);

            var TaskDetailList = dtTaskDetail.AsEnumerable();

            var nameList = new string[] { "开工管理", "厅堂服务", "柜面服务", "完工管理", "大堂经理", "高柜柜员", "低柜柜员" };

            var accuracyDic = new Dictionary<string, int>();

            for (int i = 0; i < nameList.Length; i++)
            {
                var name = nameList[i];
                var whereList = TaskDetailList.Where(a => 1 == 1);

                switch (i)
                {
                    case 0:
                        whereList = TaskDetailList.Where(a => a.Field<int>("SceneId") == 1);
                        break;
                    case 1:
                        whereList = TaskDetailList.Where(a => a.Field<int>("SceneId") == 2);
                        break;
                    case 2:
                        whereList = TaskDetailList.Where(a => a.Field<int>("SceneId") == 3);
                        break;
                    case 3:
                        whereList = TaskDetailList.Where(a => a.Field<int>("SceneId") == 4);
                        break;
                    case 4:
                        whereList = TaskDetailList.Where(a => a.Field<int>("SceneId") == 2);
                        break;
                    case 5:
                        whereList = TaskDetailList.Where(a => a.Field<int>("SceneId") == 1 || a.Field<int>("SceneId") == 4
                                                         || (a.Field<int>("SceneId") == 3 && a.Field<string>("BusinessType") == "零售业务"));
                        break;
                    case 6:
                        whereList = TaskDetailList.Where(a => a.Field<int>("SceneId") == 3 && a.Field<string>("BusinessType") == "对公业务");
                        break;
                }

                var totalCount = Math.Max(whereList.Count(), 1);
                var getScore = whereList.Sum(a => a.Field<double>("Scores"));
                int accuracy = Convert.ToInt32(getScore * 100 / totalCount);
                accuracyDic.Add(name, accuracy);

            }

            return JsonConvert.SerializeObject(accuracyDic);



        }


        /// <summary>
        /// by yk
        /// 获取能力得分率
        /// 各个能力模型的得分率
        /// </summary>
        /// <returns></returns>
        public string GetAbilityDetailsAccuracy(string TRId, string TaskId)
        {

            var sqlTotalAbility = $@"select b.AbilityId,b.AbilityScores,c.AbilityName
from 
bsi_CaseCapabilityScore b 
inner join  bsi_CapabilityModel c on b.AbilityId = c.ID
where b.TaskDetailId in (select e.ID from bsi_TaskDetail e inner join bsi_Task f on e.TaskId=f.ID where e.TaskId = {TaskId} and e.[Status] = 1 and f.IsAccessibility=1)";
            var dtTotalAbility = SqlHelper.ExecuteDataTable(sqlTotalAbility);
            var query = from t in dtTotalAbility.AsEnumerable()
                        group t by new { t1 = t.Field<int>("AbilityId"), t2 = t.Field<string>("AbilityName") } into m
                        select new
                        {
                            AbilityId = m.Key.t1,
                            AbilityName = m.Key.t2,
                            Scores = m.Sum(d => d.Field<int>("AbilityScores"))
                        };
            var TotalAbilityList = query.ToList();


            var sqlGetAbility = $@"select a.AbilityId,a.StuScore,c.AbilityName
from
(select * from bsi_StuAbilityScore where TRId={TRId} and TaskId = {TaskId}) a
inner join  bsi_CapabilityModel c on a.AbilityId = c.ID";
            var dtGetAbility = SqlHelper.ExecuteDataTable(sqlGetAbility);
            var query2 = from t in dtGetAbility.AsEnumerable()
                         group t by new { t1 = t.Field<int>("AbilityId"), t2 = t.Field<string>("AbilityName") } into m
                         select new
                         {
                             AbilityId = m.Key.t1,
                             AbilityName = m.Key.t2,
                             GetScores = m.Sum(d => d.Field<int>("StuScore"))
                         };
            var GetAbilityList = query2.ToList();



            var accuracyDic = new Dictionary<string, int>();

            foreach (var item in TotalAbilityList)
            {
                var AbilityName = item.AbilityName;
                int accuracy = 0;

                foreach (var getitem in GetAbilityList)
                {
                    if (item.AbilityId == getitem.AbilityId)
                    {
                        accuracy = Convert.ToInt32(getitem.GetScores * 100.0f / item.Scores);
                        break;
                    }
                }
                accuracyDic.Add(AbilityName, accuracy);
            }


            return JsonConvert.SerializeObject(accuracyDic);



        }

        public string GetListByStu()
        {
            string wheres = " ";
            //查询条件

            wheres += "  t0.Score>0 and t5.UserId =" + base.UserId;
            if (Request["practiceID"].ToString() != "-1")
            {
                wheres += " and t5.ExamId=" + Request["practiceID"];
            }
            var page = Request["page"] ?? "1";

            var dt = commonbll.GetListDatatable("select t3.TaskName, t1.CustomerName, t2.TMName, '' as RightKey,isnull((select SysDesc from tb_TaskResultDesc where ExamId = t5.ExamId and CustomerId = t5.UserId and TaskId = t3.ID and oldCustomerId = t1.ID and FormId = t2.TMNO), '') as StuOperationalAnswers,(case  when isnull((select SysDesc from tb_TaskResultDesc where ExamId = t5.ExamId and CustomerId = t5.UserId and TaskId = t3.ID and oldCustomerId = t1.ID and FormId = t2.TMNO), '')= '' then '此环节未做' else '答案错误' end) as IsTrue,t1.CustomerOrder,t2.TMNO,t0.TaskId,t0.CustomerId from bsi_TaskCustomer as t1 inner join bsi_TaskDetail as t0 on t0.TaskId = t1.TaskId and t0.CustomerId = t1.ID inner join bsi_TM as t2 on t2.TMNO = t0.FormId inner join bsi_Task as t3 on t3.ID = t0.TaskId inner join bsi_PracticeTasks t4 on t4.TaskId = t0.TaskId inner join bsi_TotalResult as t5 on t5.ExamId = t4.PracticeId where " + wheres + " order by CustomerOrder");
            DataTable showDT = new DataTable();
            showDT.Columns.Add("TaskName");
            showDT.Columns.Add("CustomerName");
            showDT.Columns.Add("TMName");
            showDT.Columns.Add("RightKey");
            showDT.Columns.Add("StuOperationalAnswers");
            showDT.Columns.Add("IsTrue");
            showDT.Columns.Add("PageCount");
            int index = 0;
            string custName = "";
            List<string> rightList = new List<string>();
            if (dt != null && dt.Rows.Count > 0)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    if (custName != dr["CustomerName"].ToString())
                    {
                        custName = dr["CustomerName"].ToString();
                        index++;
                    }
                    if (index == int.Parse(page))
                    {
                        DataRow drr = showDT.NewRow();
                        drr["TaskName"] = dr["TaskName"].ToString();
                        drr["CustomerName"] = dr["CustomerName"].ToString();
                        drr["TMName"] = dr["TMName"].ToString();
                        drr["RightKey"] = dr["RightKey"].ToString();
                        drr["StuOperationalAnswers"] = dr["StuOperationalAnswers"].ToString();
                        drr["IsTrue"] = dr["IsTrue"].ToString();
                        if (drr["IsTrue"].ToString() == "此环节未做")
                        {
                            rightList = new List<string>();
                            var dtAnswer = commonbll.GetListDatatable("select *,(select title from bsi_FormItem where id=FormItemId) as title from bsi_KeyAnswer where FormId='" + dr["TMNO"] + "' and CustomerId=" + dr["CustomerId"] + " and TaskId=" + dr["TaskId"]);
                            drr["RightKey"] = "";
                            if (dtAnswer != null && dtAnswer.Rows.Count > 0)
                            {
                                foreach (DataRow dr5 in dtAnswer.Rows)
                                {
                                    rightList.Add(dr5["title"].ToString() + ":" + dr5["SingleAnswer"].ToString());
                                }

                            }
                            drr["RightKey"] = string.Join(",", rightList);
                        }
                        //证件类型:[c - 营业执此环节未做照],证件号码:[93320223589780301B],产品代码:[20071 - 单位保证金活期存款],浮动值:[1.000000],浮动后比率:{1.000000}(学生答案：),是否计息:[Y - 是],产品:{7 - 担保}(学生答案：9 - 代理合作业务),摘要:[深圳桑达电子设备有限公司缴纳保证金],是否对账:[Y - 是],对账渠道:[CETS - 柜面]
                        List<string> stuList = new List<string>();
                        if (drr["StuOperationalAnswers"].ToString() != "")
                        {
                            rightList = new List<string>();
                            int errorIndex = 0;
                            foreach (string s in dr["StuOperationalAnswers"].ToString().Split(','))
                            {
                                if (s.IndexOf("[") > -1)
                                {
                                    rightList.Add(s.Replace("[", "").Replace("]", ""));
                                    stuList.Add(s.Replace("[", "").Replace("]", ""));
                                }
                                else if (s.IndexOf("{") > -1)
                                {
                                    rightList.Add(s.Split('(')[0].Replace("{", "").Replace("}", ""));
                                    try
                                    {
                                        stuList.Add(s.Split(':')[0] + ":" + s.Split('(')[1].Replace("(", "").Replace(")", "").Replace("学生答案：", ""));
                                    }
                                    catch
                                    {
                                        stuList.Add(s.Split(':')[0] + ":");
                                    }
                                    errorIndex++;
                                }
                            }
                            drr["RightKey"] = string.Join(",", rightList);
                            drr["StuOperationalAnswers"] = string.Join(",", stuList);
                            if (errorIndex == 0)
                            {
                                drr["IsTrue"] = "答案正确";
                            }
                        }
                        drr["PageCount"] = "0";
                        showDT.Rows.Add(drr);
                    }
                }
            }
            showDT.Rows[0]["PageCount"] = index;

            return JsonConvert.SerializeObject(showDT);
        }
        public string quickZP(object url)
        {
            string imgUrl = WebSiteThumbnail.PDUploadImage(Request["img"], base.UserNo);
            if (!string.IsNullOrEmpty(imgUrl))
            {
                commonbll.ExecuteNonQuery("update bsi_TotalResult set showPic='" + imgUrl.Replace(System.AppDomain.CurrentDomain.BaseDirectory, "") + "' where id=" + Request["trid"]);
            }
            return "1";
        }
    }

}
