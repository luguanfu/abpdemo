using Dy_SimulatedBank.App_Start;
using Dy_SimulatedBank.Models;
using Dy_SimulatedBank_Bll;
using Dy_SimulatedBank_DBUtility.Sql;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Controllers
{
    [SystemLoginVerification]
    public class ServiceRecordController : BaseController
    {


        //
        // GET: /ServiceRecord/
        CommonBll commBll = new CommonBll();
        public ActionResult Index(string viewName="")
        {
            //获取node地址
            string node_url = ""; //ConfigurationManager.AppSettings["node_url"].ToString();

            ViewBag.NodeUrl = node_url;
            string tables_url = ""; //ConfigurationManager.AppSettings["tables_url"].ToString();
            ViewBag.Tables_url = tables_url;


            string ExamId = Request["examId"];
            string planId = "";
            //string CustomerId = Request["CustomerId"];
            string totalResult = Request["TotalResultId"];
            string Otype = Request["FormType"];
            string LinkId = Request["LinkId"];
            string Satisfaction = Request["Satisfaction"];
            string type = Request["FormType"] == null ? "0" : Request["FormType"].ToString();

            var m = new ServiceRecordModel();
            var taskId = SqlHelper.ExecuteSclar("Select TaskId From bsi_PracticeTasks where PracticeId=" + ExamId);
            m.TaskId = taskId + "";
            m.Task_Name = SqlHelper.ExecuteSclar("Select TaskName From bsi_Task where Id=" + taskId) + "";

            DataTable Extb = SqlHelper.ExecuteDataTable("select top 1 * from bsi_PracticeAssessment where id=" + ExamId);
            m.CurrentTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");//当前时间
            if (type == "1")//考试模式
            {
                /*-----------考试信息-----------*/

                if (Extb != null && Extb.Rows.Count > 0)
                {
                    m.StartTime = Convert.ToDateTime(Extb.Rows[0]["PracticeStarTime"]).ToString("yyyy-MM-dd HH:mm:01");
                    // m.Whenlong = Extb.Rows[0]["PracticeLong"].ToString();//竞赛时长
                    m.EndTime = DateTime.Parse(Extb.Rows[0]["EndTime"].ToString()).ToString("yyyy-MM-dd HH:mm:ss");
                    TimeSpan timeStart = new TimeSpan(DateTime.Now.Ticks);
                    TimeSpan timeEnd = new TimeSpan(DateTime.Parse(Extb.Rows[0]["EndTime"].ToString()).Ticks);
                    TimeSpan ts = timeEnd.Subtract(timeStart);
                    double totalMinutes = ts.TotalSeconds;
                    m.Whenlong = totalMinutes < 0 ? "0" : totalMinutes.ToString("F0");


                    ViewData["Time"] = m.Whenlong;
                }
            }
            else
            {
                m.StartTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:01");
                m.EndTime = DateTime.Now.AddSeconds(60 * 60 * 2).ToString("yyyy-MM-dd HH:mm:ss");
                ViewData["Time"] = (60 * 60 * 2).ToString();
                if (Extb != null && Extb.Rows.Count > 0)
                {
                    ViewData["Time"] = int.Parse(Extb.Rows[0]["PracticeLong"].ToString()).ToString();
                    m.EndTime = DateTime.Now.AddSeconds(int.Parse(Extb.Rows[0]["PracticeLong"].ToString())).ToString("yyyy-MM-dd HH:mm:ss");
                }
            }

            if (!string.IsNullOrEmpty(ExamId))
            {
                string Plan_Name = null;
                if (type != "1")
                {
                    /*-----------练习信息-----------*/
                    DataTable Plantb = SqlHelper.ExecuteDataTable("select ID,PracticeName,PracticeStarTime,PracticeLong from bsi_PracticeAssessment a WITH(NOLOCK) where a.Id=" + ExamId);

                    string Whenlong = "";
                    if (Plantb != null && Plantb.Rows.Count > 0)
                    {
                        Plan_Name = Plantb.Rows[0]["PracticeName"].ToString();
                        Whenlong = Plantb.Rows[0]["PracticeLong"].ToString();
                    }
                }
                else
                {
                    DataTable Plantb = SqlHelper.ExecuteDataTable("select ID,PracticeName from bsi_PracticeAssessment a WITH(NOLOCK) where a.Id=" + ExamId);

                    string Whenlong = "";
                    if (Plantb != null && Plantb.Rows.Count > 0)
                    {
                        Plan_Name = Plantb.Rows[0]["PracticeName"].ToString();
                    }
                }
                m.Plan_Name = Plan_Name;

                string tmo = "0";
                string Task_Name = null;
                DataTable Tasktb = SqlHelper.ExecuteDataTable("select top 1 a.* from zhyw_ExamCurrentTask a WITH(NOLOCK)  where  a.ExamId=" + ExamId + " and USID=" + UserId);
                if (Tasktb != null && Tasktb.Rows.Count > 0)
                {
                    tmo = Tasktb.Rows[0]["TMNO"].ToString();
                    m.CustomerId = Tasktb.Rows[0]["TellerId"].ToString();
                    //Task_Name = Tasktb.Rows[0]["Task_Name"].ToString();
                }


                m.UserId = UserId.ToString();
                m.DepartmentId = DepartmentId.ToString();
                m.Teller_No = Teller_No.ToString();
                m.SubBankId = SubBankId.ToString();
                m.tMono = tmo;
                m.type = type.ToString();
                m.ExamId = ExamId.ToString();
                m.planId = planId.ToString();
                m.Optype = Otype.ToString();
                m.totalResult = totalResult;
                // m.CustomerId = "0"; //CustomerId;
                m.LinkId = LinkId;
                m.Satisfaction = Satisfaction;

            }
            if(!string.IsNullOrEmpty(viewName))
            {
                return View(viewName, m);
            }
            return View(m);
        }
        public ActionResult layer(string TaskId = "", string ExamId = "", string planId = "", string title = "")
        {
            string node_url = ""; //ConfigurationManager.AppSettings["node_url"].ToString();
            ViewBag.NodeUrl = node_url;
            var m = new ServiceRecordModel();
            string tmo = "0";
            string Task_Name = null;
            DataTable Tasktb = SqlHelper.ExecuteDataTable("select top 1 a.* from zhyw_ExamCurrentTask a WITH(NOLOCK)  where  a.ExamId=" + ExamId + " and USID=" + UserId);
            if (Tasktb != null && Tasktb.Rows.Count > 0)
            {
                tmo = Tasktb.Rows[0]["TMNO"].ToString();
                m.CustomerId = Tasktb.Rows[0]["TellerId"].ToString();
                //Task_Name = Tasktb.Rows[0]["Task_Name"].ToString();
            }
            m.tMono = tmo;
            m.TaskId = TaskId;
            m.ExamId = ExamId;
            m.planId = planId;
            m.UserId = UserId.ToString();
            m.SubBankId = SubBankId.ToString();
            m.DepartmentId = DepartmentId.ToString();
            m.title = title;
            m.CustomerId = Request["CustomerId"];
            return View(m);
        }

        /// <summary>
        /// 获取任务说明,重要提示
        /// </summary>
        /// <returns></returns>
        public string getImportantInfo()
        {
            var TaskId = Request["TaskId"];
            int CustomerId = Convert.ToInt32(Request["CustomerId"]);
            //var dt = commBll.GetListDatatable(" * ", " bsi_TaskCustomer ", " and ID="+ CustomerId);

            //开工完工没有客户
            string tableName = "bsi_Task";
            string where = " and Id=" + TaskId;
            if (CustomerId > 0)
            {
                tableName = "bsi_TaskCustomer";
                where = " and ID=" + CustomerId;
            }
            var dt = commBll.GetListDatatable(" * ", tableName, where);


            string TaskDescribe = ClearHTML(dt.Rows[0]["TaskDescribe"].ToString());

            string TaskImportant = ClearHTML(dt.Rows[0]["TaskImportant"].ToString());


            string OperManualUrl = dt.Rows[0]["OperManualUrl"].ToString();

            System.Data.DataTable table = new System.Data.DataTable();
            table.Columns.Add("TaskDescribe");
            table.Columns.Add("TaskImportant");
            table.Columns.Add("OperManualUrl");
            table.Rows.Add(TaskDescribe, TaskImportant, OperManualUrl);


            return JsonConvert.SerializeObject(table);
        }

        /// <summary>
        /// 计时
        /// </summary>
        /// <param name="examId"></param>
        /// <param name="planId"></param>
        /// <returns></returns>
        public string PracticeTime(int examId, int TimeSecond)
        {
            string where = " and Type=0 and a.examId=" + examId + " and a.UserId=" + UserId;
            var tb = commBll.GetListDatatable(" top 1 a.*", " tb_PracticeTime a", where);
            if (tb != null && tb.Rows.Count > 0)
            {
                int Time = Convert.ToInt32(tb.Rows[0]["TimeSecond"].ToString());
                int second = Time > TimeSecond ? Time : TimeSecond;
                string set = "TimeSecond=@TimeSecond";
                SqlParameter[] pars1 = new SqlParameter[]
                    {
                         new SqlParameter("@TimeSecond",second),
                         new SqlParameter("@Id",tb.Rows[0]["Id"])
                    };
                var resultcounts = commBll.UpdateInfo("tb_PracticeTime", set, " and Id=@Id", pars1);

                return second.ToString();
            }
            else
            {
                string table = "tb_PracticeTime"; //表名
                string list = "examId,Type, UserId,TimeSecond";//列
                string vlaue = "@examId,@Type, @UserId,@TimeSecond";
                SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@examId",examId),
                new SqlParameter("@Type","0"),
                new SqlParameter("@UserId",UserId),
                new SqlParameter("@TimeSecond","1")
            };
                var resultcount = commBll.Add(table, list, vlaue, pars);//操作成功1 失败99

                return TimeSecond.ToString();
            }
        }


        public string ComplexTaskList()
        {
            var ExamId = Request["ExamId"];
            string Columm = @" a.CustomerName as Task_Name,a.ID as ID,(select sum(isnull(Score,0)) from bsi_TaskDetail where TaskId=b.id and CustomerId=a.id) as TotalScore,a.BusinessType as busiType,
b.ID as TaskId,a.TaskDescribe as Remarks,a.TaskImportant as Important_Info";
            string table = @" bsi_TaskCustomer as a with(nolock)
inner join bsi_Task as b  with(nolock) on a.TaskId=b.id
inner join bsi_PracticeTasks as d with(nolock) on d.TaskId=b.id
inner join bsi_PracticeAssessment as e with(nolock) on e.id=d.PracticeId";
            string where = "";
            if (!string.IsNullOrEmpty(ExamId))
            {
                where += " and e.ID=" + ExamId;
            }

            DataTable dt = commBll.GetListDatatable(Columm, table, where + " order by a.CustomerOrder");
            return JsonConvert.SerializeObject(dt);
        }


        public string ExamLoglist()
        {
            var TaskId = Request["TaskId"];
            var ExamId = Request["ExamId"];
            var CustomerId = Request["CustomerId"];

            string Columm = @"LogDate,Remark,(select CustomerName from bsi_TaskCustomer where id=a.TellerId) as CustomerName";
            string table = @" zhyw_ExamLog as a ";
            string where = " and TaskId=" + TaskId + " and ExamId=" + ExamId + " and TellerId=" + CustomerId + " and USID=" + UserId;

            DataTable dt = commBll.GetListDatatable(Columm, table, where + " order by LogDate desc");
            return JsonConvert.SerializeObject(dt);
            //TaskId:4633,ExamId:257,TellerId:1

        }


        public int Open()
        {
            try
            {
                var TaskId = Convert.ToInt32(Request["TaskId"]);
                //var nomoid = Convert.ToInt32(Request["nid"]);
                var ExamId = Request["ExamId"];
                var CustomerId = Request["CustomerId"];
                var mid = Request["mid"];
                //var DepartmentId = Convert.ToInt32(Request["DepartmentId"]);
                //var Teller_No = Request["Teller_No"];
                //var planId = Request["planId"];
                //var UserId = Request["UserId"];
                //var Task_Name = Request["Task_Name"];

                string Table_ExamResultTask = "zhyw_ExamResultTask"; //branchTable.Method_branchTable(Tellerid, "zhyw_ExamResultTask");
                string Table_ExamResult = "zhyw_ExamResult"; //branchTable.Method_branchTable(Tellerid, "zhyw_ExamResult");

                // 查看是否有任务分
                string strgetscore = "select sum([Score]) from bsi_TaskDetail where TaskId=" + TaskId;
                string strobj = SqlHelper.ExecuteSclar(strgetscore).ToString();
                int haveFirstScore = 0;

                if (strobj == string.Empty || int.Parse(strobj.Split('.')[0]) < 1)
                {
                    string strSql = "select Id,GroupId from " + Table_ExamResult + " WITH (NOLOCK) where  ExamId=" + ExamId + " and TellerId=" + UserId;// +" and GroupId=" + model.GroupId + " ";
                    int ExamResultId = 0;
                    object sqlResult;
                    DataTable sqlResultdt = SqlHelper.ExecuteDataTable(strSql);

                    if (sqlResultdt.Rows.Count > 0)
                    {
                        ExamResultId = int.Parse(sqlResultdt.Rows[0]["Id"].ToString());
                        // 如果代表队不一样,则修改为正确的代表队
                        if (sqlResultdt.Rows[0]["GroupId"].ToString().Trim() == "0" || sqlResultdt.Rows[0]["GroupId"].ToString().Trim() != SubBankId.ToString())
                        {
                            if (Convert.ToInt32(SubBankId) > 0)
                            {
                                string gupdatesql = string.Format("update " + Table_ExamResult + " set GroupId={1} where id={0}"
                                    , sqlResultdt.Rows[0]["Id"].ToString(), SubBankId);

                                SqlHelper.ExecuteNonQuery(gupdatesql);
                            }

                        }
                    }
                    else
                    {
                        strSql = "insert into " + Table_ExamResult + "(ExamId,TellerId,PlanId,Result,Remark,GroupId) ";
                        strSql += "output inserted.Id values(" + ExamId + "," + UserId + "," + TaskId + ",0,''," + SubBankId + ")";
                        sqlResult = SqlHelper.ExecuteSclar(strSql);
                        ExamResultId = int.Parse(sqlResult.ToString());
                    }
                    strSql = "select Id,Scores,formList from " + Table_ExamResultTask + " WITH (NOLOCK)   where ExamResultId=" + ExamResultId + " and TaskId=" + TaskId;

                    //旧的分数
                    int ExamResultTaskId = 0;
                    int tastOldScore = 0;

                    //sqlResult = SqlHelper.ExecuteSclar(strSql);
                    DataTable dtResult = SqlHelper.ExecuteDataTable(strSql);
                    if (dtResult.Rows.Count > 0)
                    {
                        ExamResultTaskId = int.Parse(dtResult.Rows[0][0].ToString());
                        var tast = dtResult.Rows[0][1].ToString();
                        if (tast.GetType() == typeof(int))
                        {
                            tastOldScore = Convert.ToInt32(tast);
                        }


                    }
                    else
                    {
                        strSql = "insert into " + Table_ExamResultTask + "(ExamResultId,TaskId,PlanId,DetailsId,Scores) ";
                        strSql += "output inserted.Id values(" + ExamResultId + "," + TaskId + "," + TaskId + "," + "0" + ",0)";
                        sqlResult = SqlHelper.ExecuteSclar(strSql);
                        ExamResultTaskId = int.Parse(sqlResult.ToString());
                    }

                    //if (haveFirstScore > 0)
                    //{

                    //    if (model.OPtype == "2")
                    //    {
                    //        haveFirstScore = 2;
                    //    }

                    //    if (model.OPtype == "1")
                    //    {
                    //        haveFirstScore = 0;
                    //    }
                    //}
                    //else
                    //{
                    //    haveFirstScore = 0;
                    //}


                    int uallscore = haveFirstScore - tastOldScore;
                    strSql = "update " + Table_ExamResultTask + " set Scores=" + haveFirstScore + ",SubmitTime=getdate()" + " where Id=" + ExamResultTaskId;
                    strSql += ";update " + Table_ExamResult + " set Result=isnull(Result,0)+" + uallscore + " where Id=" + ExamResultId;

                    SqlHelper.ExecuteNonQuery(strSql);
                }
                StringBuilder sql = new StringBuilder();
                //sql.Append("SELECT  data=STUFF((SELECT ','+FormId FROM bsi_TaskDetail t ");
                //sql.Append("WHERE TaskId=t1.TaskId FOR XML PATH('')), 1, 1, '')");
                //sql.Append(" FROM bsi_TaskDetail t1 where t1.TaskId=" + TaskId);
                //object obj = SqlHelper.ExecuteSclar(sql.ToString());
                //string tmno = null;

                //if (obj != null)
                //{
                //tmno = obj.ToString();


                sql = new StringBuilder();
                sql.AppendLine("begin tran");
                sql.AppendLine("declare @err_code int;");
                sql.AppendLine("set @err_code=0;");
                sql.AppendLine("delete from zhyw_ExamCurrentTask where USID=" + UserId + " and ExamId=" + ExamId);
                //SqlHelper.ExecuteNonQuery(sql.ToString());
                //sql = new StringBuilder();
                sql.AppendLine("set @err_code=@err_code+@@ERROR;");
                sql.Append(" insert into zhyw_ExamCurrentTask(");
                sql.Append("BRNO,USID,IdPlan,TaskId,TMNO,Status,GroupId,TellerId,ExamId)");
                sql.AppendLine(" values('" + SubBankId + "','" + UserId + "',0," + TaskId + ",'"
                               + mid + "',1," + SubBankId + "," + CustomerId + "," + ExamId + ");");
                sql.AppendLine("set @err_code=@err_code+@@ERROR;");
                sql.AppendLine("if(@err_code!=0)");
                sql.AppendLine("begin");
                sql.AppendLine("  rollback tran");
                sql.AppendLine("end");
                sql.AppendLine("else");
                sql.AppendLine("begin");
                sql.AppendLine("  commit tran ");
                sql.AppendLine("end");
                //IndustrySimulation_DBUtility.Error.ErrorHandler.WriteError(sql.ToString());

                var r = SqlHelper.ExecuteNonQuery(sql.ToString());

                //}
                return 1;
            }
            catch (Exception ex)
            {

                return 0;
            }


        }


        /// <summary>
        /// 任务重做
        /// </summary>
        /// <returns></returns>
        public int Redo()
        {

            var TaskId = Convert.ToInt32(Request["TaskId"]);
            var ExamId = Request["ExamId"];
            var DepartmentId = Request["DepartmentId"];
            var Teller_No = Request["Teller_No"];
            var planId = Request["planId"];
            //var UserId = Request["UserId"];
            var CustomerId = Request["nid"];
            var Task_Name = Request["Task_Name"];
            try
            {
                string sql1 = "select * from bsi_TaskCustomer where id=" + CustomerId;
                var dtc = SqlHelper.ExecuteDataTable(sql1);
                if (dtc != null && dtc.Rows.Count > 0)
                {
                    string sql2 = "select * from bsi_TaskDetail where TaskId=" + dtc.Rows[0]["TaskId"].ToString() + " and CustomerId=" + dtc.Rows[0]["id"].ToString();
                    var dtd = SqlHelper.ExecuteDataTable(sql2);
                    if (dtd != null && dtd.Rows.Count > 0)
                    {
                        foreach (DataRow dr in dtd.Rows)
                        {
                            if (dr["FormId"] != null && dr["FormId"].ToString() != "")
                            {
                                string sql3 = "delete from bsi_" + dr["FormId"].ToString() + " where TasKId=" + TaskId + " and ExamId=" + ExamId + " and CustomerId=" + dtc.Rows[0]["id"].ToString() + " and FormId='" + dr["FormId"].ToString() + "' and UserId=" + UserId;
                                SqlHelper.ExecuteNonQuery(sql3);
                                SqlHelper.ExecuteNonQuery("delete from tb_TaskResultDesc where CustomerId=" + UserId + " and TaskId=" + TaskId + " and FormId='" + dr["FormId"].ToString() + "' and ExamId=" + ExamId);
                            }
                        }
                    }
                }
                SqlHelper.ExecuteNonQuery("delete from zhyw_ExamLog where USID=" + UserId + " and ExamId=" + ExamId + " and TellerId=" + CustomerId + " and TaskId=" + TaskId);

                return 1;
            }
            catch (Exception ex)
            {
                return 0;
            }


        }

        public string Submit()
        {
            var TaskId = Request["TaskId"];
            var ExamId = Request["ExamId"];
            string mid = Request["mid"];
            int answerTime = 0;
            int.TryParse(Request["AnswerTime"], out answerTime);
            int trid = 0;
            StringBuilder txtsql = new StringBuilder();
            var dtss = SqlHelper.ExecuteDataTable("select * from bsi_TotalResult where ExamId=" + ExamId + " and UserId=" + UserId);
            var dto = SqlHelper.ExecuteDataTable("select * from bsi_PracticeAssessment where id=" + ExamId);
            if (dtss != null && dtss.Rows.Count > 0 && dto.Rows[0][Type_All].ToString() == "1" && dtss.Rows[0]["Tstate"].ToString() == "2")
            {
                return "2_88";
            }



            txtsql.Append(" delete from zhyw_ExamCurrentTask where TellerId=" + UserId + " and ExamId=" + ExamId + ";");
            txtsql.Append(" delete from tb_PracticeTime where examId=" + ExamId + " and UserId=" + UserId + " and Type=1;");
            DateTime addTime = DateTime.Now.AddSeconds(-answerTime);
            if (dtss == null || dtss.Rows.Count == 0)
            {                
                var sqlResult = SqlHelper.ExecuteSclar("INSERT INTO [bsi_TotalResult]([ExamId],[Scores],[Tstate],[UserId],[Type_All],[Grouping_ID],[File_ID],[UpdateTime],[AddTime],[AddUserId]) output inserted.Id VALUES(" + ExamId + ",0,2," + UserId + "," + dto.Rows[0]["Type_All"].ToString() + ",0,0,getdate(),'" + addTime + "'," + UserId + ")");
                trid = int.Parse(sqlResult.ToString());
            }

            var dtScore = SqlHelper.ExecuteDataTable("select * from tb_TaskResultDesc where CustomerId=" + UserId + "  and  ExamId=" + ExamId + " order by TaskId");
            List<string> taskList = new List<string>();
            if (dtScore != null && dtScore.Rows.Count > 0)
            {
                string taskid = "";
                decimal score = 0m;
                int index = 0;
                foreach (DataRow dr in dtScore.Rows)
                {
                    if (taskid != dr["TaskId"].ToString())
                    {
                        if (index != 0)
                        {
                            taskList.Add(taskid + "|" + score);
                        }
                        taskid = dr["TaskId"].ToString();
                        score = 0m;
                    }
                    if (taskid == dr["TaskId"].ToString())
                    {
                        score += decimal.Parse(dr["Score"].ToString());
                    }
                    index++;
                    if (index == dtScore.Rows.Count)
                    {
                        taskList.Add(taskid + "|" + score);
                    }
                }
            }

            if (taskList != null && taskList.Count > 0)
            {
                SqlHelper.ExecuteNonQuery("delete from bsi_TotalResult where ExamId=" + ExamId + " and UserId=" + UserId);
                SqlHelper.ExecuteNonQuery("delete from bsi_TotalResultTask where TaskId in (select TaskId from bsi_PracticeTasks where id=" + ExamId + ") and UserId=" + UserId);
                decimal sumScore = taskList.Sum(s => decimal.Parse(s.Split('|')[1]));
                var sqlResult = SqlHelper.ExecuteSclar("INSERT INTO [bsi_TotalResult]([ExamId],[Scores],[Tstate],[UserId],[Type_All],[Grouping_ID],[File_ID],[UpdateTime],[AddTime],[AddUserId]) output inserted.Id VALUES(" + ExamId + "," + sumScore + ",2," + UserId + "," + dto.Rows[0]["Type_All"].ToString() + ",0,0,getdate(),'" + addTime + "'," + UserId + ")");
                trid = int.Parse(sqlResult.ToString());
                foreach (string s in taskList)
                {

                    SqlHelper.ExecuteNonQuery("INSERT INTO [bsi_TotalResultTask]([TRId],[TaskId],[Scores],[Tstate],[UserId],[AddUserId],[AddTime],[UpdateTime],[File_ID])  VALUES(" + trid + "," + (s.Split('|')[0]) + "," + (s.Split('|')[1]) + ",1," + UserId + "," + UserId + ",getdate(),getdate(),0)");
                }
            }
            //重新修正分值？ 程序猿 2020年5月28日11:30:04
            //            DataTable dt = SqlHelper.ExecuteDataTable(@" select b.Id as ExamResultTaskId, c.PlanId,c.ExamId,c.TellerId,
            //sum(a.haveScore) as sumtotole
            // from
            // zhyw_ExamResultTaskDetail a WITH(NOLOCK) 
            //  join zhyw_ExamResultTask b WITH(NOLOCK) on(a.ExamResultTaskId=b.Id)
            //  join zhyw_ExamResult c WITH(NOLOCK) on(b.ExamResultId=c.Id)
            //  where c.PlanId=" + TaskId + " and a.formid is not null and c.TellerId=" + UserId + " and c.ExamId=" + ExamId + " group by  b.Id,c.PlanId,c.ExamId,c.TellerId");
            //            if (dt.Rows.Count > 0)
            //            {


            //                for (var i = 0; i < dt.Rows.Count; i++)
            //                {
            //                    txtsql.Append(" update zhyw_ExamResultTask set [Scores]='" + dt.Rows[i]["sumtotole"] + "'  where Id=" + dt.Rows[i]["ExamResultTaskId"] + ";");

            //                }


            //            }
            txtsql.Append(" update tb_PracticeTime set Type=1 where examId=" + ExamId + " and UserId=" + UserId + " and Type=0");
            SqlHelper.ExecuteNonQuery(txtsql.ToString());

            //获取考试Id
            var ExamResultId = SqlHelper.ExecuteSclar(@"select Id from zhyw_ExamResult  where ExamId=" + ExamId + " and TellerId=" + UserId);

            var ss = SqlHelper.ExecuteDataTable(@"select * from bsi_PracticeAssessment where id=" + ExamId);

            //var r = SqlHelper.ExecuteNonQuery(@"update zhyw_ExamResult set Result=(select sum(Scores)  from zhyw_ExamResultTask  where ExamResultId=" + ExamResultId + "),WhenUsed=" + diff
            //    + " where Id=" + ExamResultId);
            //if (r >= 0)
            //{
            return "1_" + trid;
            //}
            //else
            //{
            //    return "0";
            //}

        }

        public ActionResult ScoreDetail(int CustomerId = 0, int ExamId = 0, int TaskID = 0, int Diff = 0, int type = 0)
        {
            ViewData["ExamId"] = ExamId;
            ViewData["TaskID"] = TaskID;
            //ViewData["CustomerId"] = CustomerId;
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select a.PracticeName as Plan_Name,d.TMName as SubBank_Name,(select Name from tb_Student where UserId = (select top 1 TellerId from zhyw_ExamResult as t1 where t1.PlanId = b.TaskId)) as User_Name,(select SUM(Score) from tb_TaskResultDesc as t2 where t2.TaskId = b.TaskId and t2.CustomerId = " + UserId + " and t2.ExamId = a.id) as Score,(select SUM(Score) from bsi_TaskDetail as t2 where t2.TaskId = b.TaskId) as trueScore,  d.TMNO from bsi_PracticeAssessment as a left join bsi_PracticeTasks as b on a.ID = b.PracticeId inner join bsi_TaskDetail as c on c.TaskId = b.TaskId inner join BSI_Tm as d on d.TMNO = c.FormId where  a.ID = " + ExamId);

            DataTable Tasktb = SqlHelper.ExecuteDataTable(strSql.ToString());
            string Plan_Name = "";
            string SubBank_Name = "";
            string User_Name = "";
            string Score = "0";
            string TotalItems = "0";
            string trueScore = "0";
            if (Tasktb != null && Tasktb.Rows.Count > 0)
            {
                var item = Tasktb.Rows[0];
                Plan_Name = item["Plan_Name"].ToString();
                SubBank_Name = item["SubBank_Name"].ToString();
                User_Name = item["User_Name"].ToString();
                Score = item["Score"].ToString();
                trueScore = item["trueScore"].ToString();
                Score = Score == "" ? "0" : Score;
                trueScore = trueScore == "" ? "0" : trueScore;
                foreach (DataRow dr in Tasktb.Rows)
                {
                    TotalItems += dr["TMNO"].ToString() + ",";
                }
                TotalItems = TotalItems.TrimEnd(',');
                if (decimal.Parse(trueScore) > 0)
                {
                    ViewData["zql"] = (decimal.Parse((decimal.Parse(Score) / decimal.Parse(trueScore)).ToString("F2")) * 100) + "%";
                }
                else
                {
                    ViewData["zql"] = "0%";
                }
            }
            ViewData["Plan_Name"] = Plan_Name;
            ViewData["SubBank_Name"] = SubBank_Name;
            ViewData["TotalItems"] = TotalItems;
            ViewData["User_Name"] = User_Name;
            ViewData["Score"] = Score;
            ViewData["Diff"] = Diff;
            ViewData["trueScore"] = trueScore;
            ViewData["type"] = type;


            return View();
        }


        /// <summary>
        /// 分数明细
        /// </summary>
        /// <param name="ExamId"></param>
        /// <param name="planId"></param>
        /// <returns></returns>
        public string GetExamDetailResult(int TaskID, int ExamId)
        {
            string sql = "select  t3.FormId as FormId,t3.CustomerId as CustomerId from bsi_PracticeAssessment as t1 inner join bsi_PracticeTasks as t2 on t1.id=t2.PracticeId inner join bsi_TaskDetail as t3 on t3.TaskId = t2.TaskId where t1.id = " + ExamId;
            DataTable taskDT = SqlHelper.ExecuteDataTable(sql.ToString());
            string tsql = "select * from tb_TaskResultDesc where ExamId=" + ExamId + " and CustomerId=" + UserId;
            DataTable descDT = SqlHelper.ExecuteDataTable(tsql.ToString());
            if (taskDT != null && taskDT.Rows.Count > 0)
            {
                taskDT.Columns.Add("TaskName");
                taskDT.Columns.Add("SysName");
                taskDT.Columns.Add("SysDesc");
                taskDT.Columns.Add("Score");
                foreach (DataRow dr in taskDT.Rows)
                {
                    foreach (DataRow dr2 in descDT.Rows)
                    {
                        if (dr["FormId"].ToString() == dr2["FormId"].ToString() && dr["CustomerId"].ToString() == dr2["oldCustomerId"].ToString())
                        {
                            dr["TaskName"] = dr2["TaskName"].ToString();
                            dr["SysName"] = "业务办理";// dr2["SysName"].ToString();
                            dr["Score"] = dr2["Score"].ToString();
                            dr["SysDesc"] = dr2["SysDesc"].ToString().Replace("{", "<span style='color: red'>").Replace("}", "</span>").Replace("[", "<span>").Replace("]", "</span>");
                            break;
                        }
                        else
                        {
                            dr["TaskName"] = "";
                            dr["SysName"] = "业务办理";
                            dr["Score"] = "0";
                            dr["SysDesc"] = "";
                        }
                    }
                }
            }




            //StringBuilder strSql = new StringBuilder();//做题记录
            //strSql.Append(" select c.tmname as Task_Name, b.Title as KeyWordName,a.FormId as formNameId,a.SingleAnswer as AnswerRight,b.id as DetailsId from bsi_KeyAnswer as a left join bsi_FormItem as b on a.FormItemId=b.ID inner join bsi_TM as c on a.FormId = c.TMNO  where 1 = 1  and a.TaskId = " + taskID + " and a.CustomerId = " + CustomerId + " and b.FormId in (select FormId from bsi_TaskDetail where TaskId = " + taskID + ") order by  c.tmname");
            //DataTable Tasktb = SqlHelper.ExecuteDataTable(strSql.ToString());

            //if (Tasktb != null && Tasktb.Rows.Count > 0)
            //{
            //    Tasktb.Columns.Add("SysName");
            //    Tasktb.Columns.Add("formName");
            //    Tasktb.Columns.Add("Key_Names");
            //    Tasktb.Columns.Add("QuestionAnswer");
            //    Tasktb.Columns.Add("IfTrue");
            //    Tasktb.Columns.Add("haveScore");

            //    DataTable dt2 = SqlHelper.ExecuteDataTable(" select StuOperationalAnswers,a.Scores,FormId from bsi_TotalResultDetailed as a  inner join bsi_TaskDetail as b on a.TaskDetailId = b.ID where b.TaskId = " + taskID + " and CustomerId = " + CustomerId);
            //    int index = 0;
            //    string name = "";
            //    foreach (DataRow dr in Tasktb.Rows)
            //    {
            //        if (name != dr["Task_Name"].ToString())
            //        {
            //            index = 0;
            //            name = dr["Task_Name"].ToString();
            //        }
            //        foreach (DataRow dr2 in dt2.Rows)
            //        {
            //            if (dr["formNameId"].ToString() == dr2["FormId"].ToString())
            //            {
            //                dr["QuestionAnswer"] = dr2["StuOperationalAnswers"].ToString().Split(',')[index];
            //                if (dr["AnswerRight"].ToString() == dr2["StuOperationalAnswers"].ToString().Split(',')[index])
            //                {
            //                    dr["IfTrue"] = "1";
            //                }
            //                else
            //                {
            //                    dr["IfTrue"] = "0";
            //                }
            //                dr["haveScore"] = dr2["Scores"];
            //            }
            //        }
            //        index++;
            //    }
            //}


            //strSql = new StringBuilder();//所有题目
            //strSql.Append(" select d.Task_Name,p.Idx,r.sysname as SysName,r.busiName as formName,r.MenuId as formNameId,p.Key_Names,p.id from");
            //strSql.Append(" dal_ComplexTask_items p WITH(NOLOCK) ");
            //strSql.Append(" join dal_ComplexTask d WITH(NOLOCK)  on(p.Task_Id=d.Id)");
            //strSql.Append(" join zhyw_Remarks r WITH(NOLOCK)  on(p.Remark_Id=r.RemarkId)");
            //strSql.Append(" join dal_ComplexPlan c WITH(NOLOCK)  on(d.ComplexPlan_Id=c.Id)");
            //strSql.Append(" join dal_ComplexTimer t WITH(NOLOCK) on(c.Id=t.ComplexPlanId)");
            //strSql.Append(" where d.Contest_Id=1 and c.Id=" + taskID + " and t.Id=" + ExamId + " and p.Key_Ids is not null   and r.MenuId is not null   order by d.Idx,d.Task_Name,r.sysname,r.busiName ");
            //DataTable itemtb = SqlHelper.ExecuteDataTable(strSql.ToString());

            var jsons = new[]{
                new {
                     Tasktb=taskDT
                }
            };
            return JsonConvert.SerializeObject(jsons);
        }


        #region 验证超时 
        // 1 超时
        public string CheckTimeOut()
        {
            if (Session["UserId"] == null || Session["UserType"] == null)
            {
                return "1";

            }
            return "0";
        }

        #endregion


        #region  去掉字段里面的html元素
        public static string ClearHTML(string Htmlstring)
        {
            //删除脚本  
            Htmlstring = Regex.Replace(Htmlstring, @"<script[^>]*?>.*?</script>", "", RegexOptions.IgnoreCase);
            //删除HTML  
            Htmlstring = Regex.Replace(Htmlstring, @"<(.[^>]*)>", "", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"([\r\n])[\s]+", "", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"-->", "", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"<!--.*", "", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&(quot|#34);", "\"", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&(amp|#38);", "&", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&(lt|#60);", "<", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&(gt|#62);", ">", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&(nbsp|#160);", "   ", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&(iexcl|#161);", "\xa1", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&(cent|#162);", "\xa2", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&(pound|#163);", "\xa3", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&(copy|#169);", "\xa9", RegexOptions.IgnoreCase);
            Htmlstring = Regex.Replace(Htmlstring, @"&#(\d+);", "", RegexOptions.IgnoreCase);
            Htmlstring.Replace("<", "");
            Htmlstring.Replace(">", "");
            Htmlstring.Replace("\r\n", "");
            Htmlstring = System.Web.HttpUtility.HtmlDecode(Htmlstring).Replace("<br/>", "").Replace("<br>", "").Trim();
            return Htmlstring;
        }

        #endregion
    }

}
