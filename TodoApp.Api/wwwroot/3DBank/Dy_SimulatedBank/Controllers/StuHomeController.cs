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
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Controllers
{
    public class StuHomeController : BaseController
    {
        //
        // GET: /StuHome/

        CommonBll commBll = new CommonBll();

        public ActionResult Index()
        {
            Random re = new Random(DateTime.Now.Millisecond);
            int type = re.Next(1, 4);
            //验证权key
            //string str_re = RegisterPro.keycon.CheckKey(type.ToString(), ConfigurationManager.AppSettings["keypath"].ToString());
            //return View("Logon");
            //if (false && str_re != "1")
            //{
            //    Response.Redirect("/Login");
            //}

            //Session.Abandon();
            //Session.Clear();

            GetTeamAndRole();
            ViewBag.Title = ConfigurationManager.AppSettings["title"].ToString();
            return View();
        }

        public ActionResult CaseDescription()
        {
            return View();
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
            DataTable dataTable = commBll.GetListDatatable(sql);
            if (dataTable != null && dataTable.Rows.Count > 0)
            {
                ViewBag.Groupingname = dataTable.Rows[0]["Groupingname"];//团队名称

                if (Convert.ToInt32(dataTable.Rows[0]["Groupingstate"]) == 1)
                {
                    ViewBag.Groupingstate = dataTable.Rows[0]["Groupingstate"];//团队角色
                }
                else
                {
                    ViewBag.Groupingstate = dataTable.Rows[0]["Groupingstate"];//团队角色
                }
            }
        }

        public ActionResult StudentHome()
        {
            //TotalResultId,TaskId 考核和练习必传  教学会选取上次进入的 或者第一次取关联课程的第一个
            var TotalResultId = Request["TotalResultId"];
            var TaskId = Request["TaskId"];
            if (TotalResultId == null)
            {
                var guanliankechengTaskDt = SqlHelper.ExecuteDataTable($@"select 
                                                a.ID as TaskId,b.ForeignkeyId 
                                                from 
                                                bsi_Task a
                                                inner join bsi_ExercisePracticeChapters b on b.Types=2 and ForeignkeyId = a.ID
                                                inner join (select * from bsi_Curriculum where State = 1 and (AddUserId = 1 or AddUserId = {TeacherId})) c on c.ID = b.CourseId
                                                inner join bsi_Chapter d on d.ID = b.ChapterId
                                                right join bsi_Section e on e.ID = b.SectionId
                                                where a.EnabledState = 1 and a.PublicState = 1 and (a.AddUserId = 1 or a.AddUserId = {TeacherId})
                                                order by c.Sort,d.Sort,e.Sort");

                var dtTotalResultIds = SqlHelper.ExecuteDataTable($@"select a.ID,a.ExamId,b.TaskId from 
                                                                    bsi_TotalResult a
                                                                    left join bsi_PracticeTasks b on a.ExamId = b.PracticeId
                                                                    where UserId = {UserId} and Type_All = 3 and Tstate = 0");

                var tempTotalResultId = "";
                var tempTaskId = "";
                if (dtTotalResultIds.Rows.Count > 0)//有做题记录
                {
                    var lsTotalResultId = dtTotalResultIds.Rows[dtTotalResultIds.Rows.Count - 1]["ID"].ToString();
                    var lstempTaskId = dtTotalResultIds.Rows[dtTotalResultIds.Rows.Count - 1]["TaskId"].ToString();

                    var needFindNextTask = false;
                    for (int i = 0; i < guanliankechengTaskDt.Rows.Count; i++)
                    {
                        DataRow item = guanliankechengTaskDt.Rows[i];
                        if (needFindNextTask)
                        {
                            if (item["ForeignkeyId"] != null)
                            {
                                tempTaskId = item["ForeignkeyId"].ToString();
                                break;
                            }
                            continue;
                        }

                        if (item["TaskId"].ToString() == lstempTaskId)
                        {
                            if (item["ForeignkeyId"] != null)
                            {//课程还在关联中
                                tempTotalResultId = lsTotalResultId;
                                tempTaskId = lstempTaskId;
                                break;
                            }
                            else //取消关联
                            {
                                needFindNextTask = true;
                            }
                            //TaskId = tempTaskId;
                        }

                    }


                }
                if (tempTotalResultId == "")
                {//需要插入首次案例成绩记录

                    var dtPracticeIds = SqlHelper.ExecuteDataTable($@"select a.ID as PracticeId, c.ID as TaskId
                                                                        from
                                                                        (select * from  bsi_PracticeAssessment where Type_All = 3) a 
                                                                        inner join bsi_PracticeTasks b on a.ID = b.PracticeId
                                                                        inner join bsi_Task c on b.TaskId = c.ID 
                                                                        inner join bsi_ExercisePracticeChapters d on  d.Types = 2 and ForeignkeyId= c.ID
                                                                        inner join (select * from bsi_Curriculum where State = 1 and (AddUserId = 1 or AddUserId = {TeacherId})) e on e.ID = d.CourseId
                                                                        inner join bsi_Chapter f on f.ID = d.ChapterId
                                                                        inner join bsi_Section g on g.ID = d.SectionId
                                                                        where c.EnabledState = 1 and c.PublicState = 1 and  (c.AddUserId = 1 or c.AddUserId = {TeacherId})
                                                                        order by e.Sort,f.Sort,g.Sort");
                    var practiceId = "";
                    for (int i = 0; i < dtPracticeIds.Rows.Count; i++)
                    {
                        DataRow item = dtPracticeIds.Rows[i];
                        if (item["TaskId"].ToString() == tempTaskId)
                        {
                            practiceId = item["PracticeId"].ToString();
                        }
                    }
                    if (practiceId == "")
                    {
                        if (dtPracticeIds.Rows.Count == 0) return Content("后台未设置关联案例！");
                        practiceId = dtPracticeIds.Rows[0]["PracticeId"].ToString();
                    }


                    TotalResultId = commBll.AddIdentity("bsi_TotalResult", "ExamId,Scores,Tstate,UserId,Type_All,Grouping_ID,File_ID,UpdateTime,AddTime,AddUserId",
                        $"{practiceId},'0',0,{UserId},3,0,0,GETDATE(),GETDATE(),{UserId}", null).ToString();

                }
                else
                {
                    TotalResultId = tempTotalResultId;
                }


            }

            var dt_TR = commBll.GetListDatatable("*", "bsi_TotalResult", $" and ID={TotalResultId}");
            var ExamId = dt_TR.Rows[0]["ExamId"].ToString();
            var Type_All = dt_TR.Rows[0]["Type_All"].ToString();

            if (TaskId == null)
            {
                var dt_PT = commBll.GetListDatatable("TaskId,PracticeId", "bsi_PracticeTasks", $" and PracticeId={ExamId}");
                //只有教学会出现为空  直接取考核下的唯一一个案例
                TaskId = dt_PT.Rows[0]["TaskId"].ToString();
            }
            var countPer = commBll.GetRecordCount($"bsi_TaskCustomer a LEFT JOIN bsi_Task b ON a.TaskId = b.ID", $"and TaskId={TaskId}");
            //var dt_TR = commBll.GetListDatatable("ExamId,Tstate", "bsi_TotalResult", $" and ID={TotalResultId}");
            //var Tstate = dt_TR.Rows[0]["Tstate"].ToString();
            //if (Tstate == "1") {
            //    //跳转到成绩界面
            //    return Redirect("User/result");
            //}
            //var ExamId = dt_TR.Rows[0]["ExamId"].ToString();


            var dt_TCR = commBll.GetListDatatable("*", "bsi_TaskCustomerRecord", $" and TRId={TotalResultId} and TaskId={TaskId}");

            ExerRecordModel erModel = new ExerRecordModel();
            erModel.CountNum = countPer;
            erModel.UserType = UserType.ToString();
            erModel.Type_All = Type_All;
            erModel.Type_AllString = "教学模式";
            if (Type_All == "1")
            {
                erModel.Type_AllString = "考核模式";
            }
            else if (Type_All == "2")
            {
                erModel.Type_AllString = "练习模式";
            }


            if (dt_TCR.Rows.Count == 0)//未找到记录  从这个案例第一步开始
            {
                erModel.TotalResultId = TotalResultId;
                erModel.TaskId = TaskId;
                erModel.ExamId = ExamId;
                erModel.CustomerId = "-1";
                erModel.LinkId = "1";
                erModel.Satisfaction = "100";
            }
            else
            {
                var recordFind = dt_TCR.Rows[dt_TCR.Rows.Count - 1];
                erModel.TotalResultId = recordFind["TRId"].ToString();
                erModel.TaskId = recordFind["TaskId"].ToString();
                erModel.ExamId = recordFind["ExamId"].ToString();
                erModel.CustomerId = recordFind["CustomerId"].ToString();
                erModel.LinkId = recordFind["LinkId"].ToString();
                erModel.Satisfaction = recordFind["Satisfaction"].ToString();
            }
            var openTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            int indexx = commBll.GetRecordCount("tb_CountDown", $" and CD_MId={UserId} and CD_EId={ExamId}");
            string list = "CD_EId,CD_PId,CD_MId,CD_Time";//列
            string value = "@CD_EId,@CD_PId, @CD_MId, @CD_Time";
            if (indexx == 0)
            {
                SqlParameter[] pars = new SqlParameter[] {
                     new SqlParameter("@CD_EId",ExamId),
                     new SqlParameter("@CD_PId",ExamId),
                     new SqlParameter("@CD_MId",UserId),
                     new SqlParameter("@CD_Time",openTime),
                };
                commBll.AddIdentity("tb_CountDown", list, value, pars);
            }
            else
            {
                openTime = commBll.GetListSclar("CD_Time", "tb_CountDown", $" and CD_MId={UserId} and CD_EId={ExamId}");
            }
            erModel.openTime = openTime;

            erModel.LinkId = GetSubLinkByLinkId(int.Parse(erModel.LinkId));
            ViewBag.ErModel = erModel;


            //还得判断场景是否开启
            var taskSceneEnableDt = SqlHelper.ExecuteDataTable($"select StartScene,HallScene,CounterScene,EndScene from bsi_Task where ID={erModel.TaskId}");

            var taskCustomerDt = SqlHelper.ExecuteDataTable($"select ID from bsi_TaskCustomer where TaskId = {TaskId} order by CustomerOrder");
            var customerIDList = taskCustomerDt.AsEnumerable().Select(t => t.Field<int>("ID").ToString()).ToList();


            if (erModel.LinkId == "1")
            {
                if (taskSceneEnableDt.Rows[0]["StartScene"].ToString() == "1")
                {
                    ViewBag.ErModel = erModel;
                    return View("KaigongCj");
                }
                else
                {
                    var nextCustomerId = getNextCustomerId(erModel.CustomerId, customerIDList);
                    if (nextCustomerId == "0")
                    {
                        erModel.LinkId = "18";
                    }
                    else
                    {
                        erModel.LinkId = "2";
                        erModel.CustomerId = nextCustomerId;
                    }

                }
            }

            if (erModel.LinkId == "2" || erModel.LinkId == "3" || erModel.LinkId == "4")
            {
                if (taskSceneEnableDt.Rows[0]["HallScene"].ToString() == "1")
                {
                    ViewBag.ErModel = erModel;
                    return View("TingtangCj");
                }
                else
                {
                    erModel.LinkId = "7";
                }
            }
            else if (erModel.LinkId == "5" || erModel.LinkId == "6")
            {
                ViewBag.ErModel = erModel;
                return View("TingtangTiandanCj");
            }

        GuimianHuanjie:
            if (erModel.LinkId == "7" || erModel.LinkId == "8" || erModel.LinkId == "9" || erModel.LinkId == "10"
                || erModel.LinkId == "11" || erModel.LinkId == "12" || erModel.LinkId == "13" || erModel.LinkId == "14" || erModel.LinkId == "15" || erModel.LinkId == "151"
                || erModel.LinkId == "91" || erModel.LinkId == "92" || erModel.LinkId == "133" || erModel.LinkId == "134")
            {
                if (taskSceneEnableDt.Rows[0]["CounterScene"].ToString() == "1")
                {
                    ViewBag.ErModel = erModel;
                    return View("GuimianCj");
                }
                else
                {
                    erModel.LinkId = "16";
                }

            }

            if (erModel.LinkId == "16")
            {
                if (taskSceneEnableDt.Rows[0]["HallScene"].ToString() == "1")
                {
                    ViewBag.ErModel = erModel;
                    return View("TingtangCj");
                }
                else
                {
                    var nextCustomerId = getNextCustomerId(erModel.CustomerId, customerIDList);
                    if (nextCustomerId == "0")
                    {
                        erModel.LinkId = "17";
                    }
                    else
                    {
                        erModel.LinkId = "7";
                        erModel.CustomerId = nextCustomerId;
                        goto GuimianHuanjie;
                    }

                }
            }

            if (erModel.LinkId == "17" || erModel.LinkId == "18")
            {
                if (taskSceneEnableDt.Rows[0]["EndScene"].ToString() == "1")
                {
                    erModel.LinkId = "16";
                    ViewBag.ErModel = erModel;
                    return View("TingtangCj");
                }
                else
                {
                    erModel.LinkId = "16";
                    ViewBag.ErModel = erModel;
                    return View("TingtangCj");
                }
            }
            if (erModel.LinkId == "20")
            {
                erModel.LinkId = "2.5";
                ViewBag.ErModel = erModel;
                return View("TingtangCj");
            }
            return View();
        }

        private string getNextCustomerId(string customerId, List<string> customerIdList)
        {
            if (customerIdList.Count == 0) return "0";
            if (customerId == "-1")
            {
                return customerIdList[0];
            }
            else if (customerId == "-2")
            {
                return "0";
            }
            else
            {
                for (int i = 0; i < customerIdList.Count - 1; i++)
                {
                    if (customerIdList[i] == customerId)
                    {
                        return customerIdList[i + 1];
                    }
                }
            }
            return "0";
        }


        public string KaigongToTingtang()
        {
            var TRId = Request["TRId"];
            var TaskId = Request["TaskId"];
            var ExamId = Request["ExamId"];
            var CustomerId = Request["CustomerId"];
            var LinkId = Request["LinkId"];

            /*测试使用*/
            //if (LinkId != "1")
            //{
            //    SqlHelper.ExecuteNonQuery($"delete from bsi_TaskCustomerRecord where TRId={TRId}");
            //    LinkId = "1";
            //}


            if (LinkId != "1")
            {
                return "-1";
            }

            var positionName = getUserPositionName(TRId, TaskId);
            if (positionName != "" && positionName != "高柜柜员")
            {
                return "-2";
            }

            commBll.UpdateInfo("bsi_TaskCustomerRecord", " CompletionOrNot = 1", $" and TRId={TRId} and TaskId={TaskId} and ExamId={ExamId} and CustomerId={CustomerId} and LinkId={LinkId}");

            var taskCustomerDt = SqlHelper.ExecuteDataTable($"select ID from bsi_TaskCustomer where TaskId = {TaskId} order by CustomerOrder");

            CustomerId = "-2";
            if (taskCustomerDt.Rows.Count > 0)
            {
                CustomerId = taskCustomerDt.Rows[0]["ID"].ToString();
            }
            if (CustomerId == "-2")
            {
                LinkId = "17";
            }
            else
            {
                LinkId = "2";
            }

            var tcrId = int.Parse(commBll.AddIdentity("bsi_TaskCustomerRecord", "TRId,ExamId,TaskId,CustomerId,LinkId,UserId,Satisfaction,CompletionOrNot,AddUserId,AddTime",
                    $"'{TRId}','{ExamId}','{TaskId}','{CustomerId}','{LinkId}','{UserId}','100','0',{UserId},GetDate()", null).ToString());

            return tcrId > 0 ? "1" : "-1";
        }

        public string TingtangToTiandan()
        {
            var TRId = Request["TRId"];
            var TaskId = Request["TaskId"];
            var ExamId = Request["ExamId"];
            var CustomerId = Request["CustomerId"];
            var LinkId = Request["LinkId"];


            if (LinkId != "4")
            {
                return "-1";
            }

            var uCount = commBll.UpdateInfo("bsi_TaskCustomerRecord", " LinkId = 5", $" and TRId={TRId} and TaskId={TaskId} and ExamId={ExamId} and CustomerId={CustomerId} ");
            return uCount > 0 ? "1" : "-1";
        }

        public string TingtangToGuimian()
        {
            var TRId = Request["TRId"];
            var TaskId = Request["TaskId"];
            var ExamId = Request["ExamId"];
            var CustomerId = Request["CustomerId"];
            var LinkId = Request["LinkId"];


            if (LinkId != "4" && LinkId != "20")
            {
                return "-1";
            }

            var uCount = commBll.UpdateInfo("bsi_TaskCustomerRecord", " LinkId = 7", $" and TRId={TRId} and TaskId={TaskId} and ExamId={ExamId} and CustomerId={CustomerId}  ");
            return uCount > 0 ? "1" : "-1";
        }

        public string TiandanToGuimian()
        {
            var TRId = Request["TRId"];
            var TaskId = Request["TaskId"];
            var ExamId = Request["ExamId"];
            var CustomerId = Request["CustomerId"];
            var LinkId = Request["LinkId"];


            if (LinkId != "6")
            {
                return "-1";
            }

            var uCount = commBll.UpdateInfo("bsi_TaskCustomerRecord", " LinkId = 7", $" and TRId={TRId} and TaskId={TaskId} and ExamId={ExamId} and CustomerId={CustomerId} ");
            return uCount > 0 ? "1" : "-1";
        }

        public string GuimianToTingtang()
        {
            var TRId = Request["TRId"];
            var TaskId = Request["TaskId"];
            var ExamId = Request["ExamId"];
            var CustomerId = Request["CustomerId"];
            var LinkId = Request["LinkId"];


            if (LinkId != "151")
            {
                return "-1";
            }

            var uCount = commBll.UpdateInfo("bsi_TaskCustomerRecord", " LinkId = 16", $" and TRId={TRId} and TaskId={TaskId} and ExamId={ExamId} and CustomerId={CustomerId}  ");
            return uCount > 0 ? "1" : "-1";
        }

        public string NextCustomer()
        {
            var TRId = Request["TRId"];
            var TaskId = Request["TaskId"];
            var ExamId = Request["ExamId"];
            var CustomerId = Request["CustomerId"];
            var LinkId = Request["LinkId"];


            if (LinkId != "161")
            {
                return "-1";
            }

            var nextCustomerId = "";

            var cDt = commBll.GetListDatatable("ID,CustomerName", "bsi_TaskCustomer", $" and TaskId = {TaskId} order by CustomerOrder");
            for (int i = 0; i < cDt.Rows.Count; i++)
            {
                if (cDt.Rows[i]["ID"].ToString() == CustomerId)
                {
                    if (i == cDt.Rows.Count - 1) break;
                    nextCustomerId = cDt.Rows[i + 1]["ID"].ToString();
                }
            }

            if (nextCustomerId == "")
            {
                nextCustomerId = "-2";
                LinkId = "17";
            }
            else
            {
                LinkId = "2";
            }

            var tcrId = int.Parse(commBll.AddIdentity("bsi_TaskCustomerRecord", "TRId,ExamId,TaskId,CustomerId,LinkId,UserId,Satisfaction,CompletionOrNot,AddUserId,AddTime",
                    $"'{TRId}','{ExamId}','{TaskId}','{nextCustomerId}','{LinkId}','{UserId}','100','0',{UserId},GetDate()", null).ToString());

            return tcrId > 0 ? "1" : "-1";


        }

        public string getUserPositionName(string TRId, string TaskId)
        {
            var trDt = commBll.GetListDatatable("Tstate,Grouping_ID", "bsi_TotalResult", $" and Id={TRId}");
            if (trDt.Rows[0]["Grouping_ID"] == DBNull.Value || trDt.Rows[0]["Grouping_ID"].ToString() == "0")
            {
                return "";
            }

            var totalResultTaskList = commBll.GetListDatatable("b.PositionName", "bsi_TotalResultTask a join bsi_TeamPosition b on a.File_ID = b.ID", $" and a.TRId = {TRId} and a.TaskId={TaskId} and a.UserId={UserId}");
            if (totalResultTaskList.Rows.Count == 0)
            {
                return "-1";//未分配岗位
            }
            return totalResultTaskList.Rows[0]["PositionName"].ToString();


        }



        public string GetCustomerInfoById()
        {
            var dt = commBll.GetListDatatable("a.*,b.BusinessName", "bsi_TaskCustomer a left join bsi_TaskBusiness b on a.BusinessId = b.Id", $" and a.Id = {Request["CustomerId"]}");
            return JsonConvert.SerializeObject(dt);
        }

        public string DeductSatisfaction()
        {

            var TRId = Request["TRId"];
            var ExamId = Request["ExamId"];
            var TaskId = Request["TaskId"];
            var CustomerId = Request["CustomerId"];

            var ret = commBll.UpdateInfo("bsi_TaskCustomerRecord", " Satisfaction = Satisfaction - 1", $" and TRId={TRId} and ExamId={ExamId} and TaskId={TaskId} and CustomerId={CustomerId}  and CompletionOrNot = 0 and Satisfaction>=1");
            var dt = commBll.GetListDatatable("Satisfaction", "bsi_TaskCustomerRecord", $" and TRId={TRId} and ExamId={ExamId} and TaskId={TaskId} and CustomerId={CustomerId}  and CompletionOrNot = 0 ");
            if (dt.Rows.Count > 0)
            {
                return dt.Rows[0]["Satisfaction"].ToString();
            }

            return "-1";
        }

        /// <summary>
        /// 公共获取下拉选项方法 
        /// ModeId：环节编号
        /// </summary>
        /// <returns></returns>
        public string GetCommonSelectOptions()
        {
            var ModeId = Request["ModeId"];
            if (string.IsNullOrEmpty(ModeId))
            {
                return "";
            }
            var sql = "";
            DataTable dt;
            if (ModeId == "15" || ModeId == "16")//意向理财产品
            {
                sql = "select [ID] as value,[ProductName] as name from [bsi_ProductSettings]";
                dt = SqlHelper.ExecuteDataTable(sql);
                return JsonConvert.SerializeObject(dt);
            }

            var whereStr = " [Status]=1 ";
            var sortStr = " [Sort]";

            if (ModeId == "91")
            {
                whereStr += $" and [ModeId] = 9 and [ParentId] = '1201'";
            }
            else if (ModeId == "92")
            {
                whereStr += $" and [ModeId] = 9 and [ParentId] = '1202' and not Tmname like '%复印件%'";
            }
            else if (ModeId == "93")
            {
                whereStr += $" and [ModeId] = 9 and [ParentId] = '1202' and  Tmname like '%复印件%'";
            }
            else if (ModeId == "133" || ModeId == "134")
            {//13盖章，签字
                whereStr += $" and [SubModeId] = 13 ";
                sortStr = " [TMNO] ";
            }
            else if (ModeId == "14") //返还资料
            {
                whereStr += $" and [SubModeId14] = 14 ";
                sortStr = " [TMNO] ";
            }
            else
            {
                whereStr += $" and [ModeId] = {ModeId} and [ParentId] != '0'";
            }


            sql = $"select [TMNO] as value,[TMName] as name from [bsi_TM] where {whereStr} order by {sortStr}";
            dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);
        }

        //获取任务明细   现金收取环节
        public string GetCashEditTaskDetailInfo()
        {
            var TaskId = Request["TaskId"];
            var CustomerId = Request["CustomerId"];
            var LinkId = "10";

            var sql = $"select * from [bsi_TaskDetail] where [TaskId] = {TaskId} and [CustomerId] = {CustomerId} and [LinkId] = {LinkId} and [Types]=1";
            var dt = SqlHelper.ExecuteDataTable(sql);

            return JsonConvert.SerializeObject(dt);
        }

        //获取现金明细  真假币 残损币
        public string GetDiscernCashDetailInfo()
        {
            var TaskDetailId = Request["TaskDetailId"];
            var sql = $"select * from bsi_CashCollectionDetail where [TaskDetailId] = {TaskDetailId} ";
            var dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);
        }

        //获取操作明显
        public string GetTaskDetailTypeInfo()
        {
            var TaskId = Request["TaskId"];
            var sql = $"select * from bsi_TaskDetail where [TaskId] = {TaskId} and Types in (1,2) order by SubLinkId";
            var dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);
        }

        //学生端 点击结算成绩 触发
        public string StuSubmitTask()
        {
            string TaskId = Request["TaskId"].ToString();
            string TRId = Request["TotalResultId"].ToString();


            //判断是否是小组长
            var Grouping_ID = commBll.GetListSclar("Grouping_ID", "bsi_TotalResult", $" and Id = {TRId}");

            var groupId = 0;
            int.TryParse(Grouping_ID, out groupId);
            if (groupId > 0)
            {//有分组
                var StudentID = commBll.GetListSclar("StudentID", "bsi_Groupingrelation", $" and GroupingnameID = {groupId} and Groupingstate = 1");
                if (int.Parse(StudentID) != UserId)
                {
                    return "-2";
                }

            }




            var AdditionScoresStr = "";

            var crTb = SqlHelper.ExecuteDataTable($"select * from bsi_TaskCustomerRecord where TRId = {TRId} and TaskId = {TaskId} and [Satisfaction] = 100 and [CustomerId]>0");
            for (int i = 0; i < crTb.Rows.Count; i++)
            {
                var ID = crTb.Rows[i]["ID"];
                var CustomerId = crTb.Rows[i]["CustomerId"];
                var getScoresDetailStr = $@"select a.ID as TaskDetailId,ISNULL(b.Scores,0) as Scores
                                              from
                                              (select * from bsi_TaskDetail where TaskId = {TaskId} and Status = 1 and[CustomerId] = {CustomerId}) a
                                             left join(select * from bsi_TotalResultDetailed where TRTId in (select ID from bsi_TotalResultTask where TRId = {TRId})) b on a.ID = b.TaskDetailId";
                var getScoresDetailStrDt = SqlHelper.ExecuteDataTable(getScoresDetailStr);
                var needAdd = true;
                foreach (DataRow item in getScoresDetailStrDt.Rows)
                {
                    if (int.Parse(item["Scores"].ToString()) == 0)
                    {
                        needAdd = false;
                    }
                }
                if (needAdd)
                {
                    //AdditionScoresStr += $"update bsi_TaskCustomerRecord set AdditionScores = 3 where ID = ${ID};";
                    AdditionScoresStr += $"update bsi_TaskCustomerRecord set AdditionScores = 0 where ID = ${ID};";
                }
            }
            if (AdditionScoresStr.Length > 0)
            {
                commBll.ExecuteNonQuery(AdditionScoresStr);
            }


            var dt = commBll.GetListDatatable("a.*", "bsi_TotalResult a", $" and a.ID = {TRId}");
            var Type_All = dt.Rows[0]["Type_All"].ToString();



            var updateStr = $"update bsi_TotalResultTask set Tstate = 1  where TRId = {TRId} and TaskId = {TaskId};";
            updateStr += $@"update bsi_TotalResult 
                                set Scores = ISNULL((select sum(Scores) from bsi_TotalResult where TRId = {TRId}),0),
                                UpdateTime = getdate()
                                where ID = {TRId};";
            if (Type_All == "2" || Type_All == "3" || Type_All == "1")
            {
                updateStr += $"update bsi_TotalResult set Tstate = 1 where ID = {TRId};";
            }

            var ret = commBll.ExecuteNonQuery(updateStr);


            //top (1)





            if (ret >= 0)
            {
                if (Type_All != "3")
                {
                    return Type_All.ToString();
                }
                if (Type_All == "3")//教学模式额外需要新增下个案例首次成绩记录
                {
                    var dtPracticeIds = SqlHelper.ExecuteDataTable($@"select a.ID as PracticeId, c.ID as TaskId
                                                                        from
                                                                        (select * from  bsi_PracticeAssessment where Type_All = 3) a 
                                                                        inner join bsi_PracticeTasks b on a.ID = b.PracticeId
                                                                        inner join bsi_Task c on b.TaskId = c.ID 
                                                                        inner join bsi_ExercisePracticeChapters d on  d.Types = 2 and ForeignkeyId= c.ID
                                                                        inner join (select * from bsi_Curriculum where State = 1 and (AddUserId = 1 or AddUserId = {TeacherId})) e on e.ID = d.CourseId
                                                                        inner join bsi_Chapter f on f.ID = d.ChapterId
                                                                        inner join bsi_Section g on g.ID = d.SectionId
                                                                        where c.EnabledState = 1 and c.PublicState=1 and (c.AddUserId = 1 or c.AddUserId = {TeacherId})
                                                                        order by e.Sort,f.Sort,g.Sort");
                    var practiceId = "";
                    for (int i = 0; i < dtPracticeIds.Rows.Count - 1; i++)
                    {
                        DataRow item = dtPracticeIds.Rows[i];
                        if (item["TaskId"].ToString() == TaskId)
                        {
                            practiceId = dtPracticeIds.Rows[i + 1]["PracticeId"].ToString();
                        }
                    }
                    if (practiceId == "")
                    {
                        practiceId = dtPracticeIds.Rows[0]["PracticeId"].ToString();
                    }


                    ret = int.Parse(commBll.AddIdentity("bsi_TotalResult", "ExamId,Scores,Tstate,UserId,Type_All,Grouping_ID,File_ID,UpdateTime,AddTime,AddUserId",
                        $"{practiceId},'0',0,{UserId},3,0,0,GETDATE(),GETDATE(),{UserId}", null).ToString());
                    if (ret >= 0)
                    {
                        return Type_All.ToString();
                    }

                }

            }

            return "-1";
        }


        //获取质询明细  in 环节 客户
        public string GetInquiriesByLinkId()
        {
            var CustomerId = Request["CustomerId"];
            var LinkId = Request["LinkId"];
            var sql = $"select * from bsi_TaskCustomerInquiry where [CustomerId] = {CustomerId} and LinkNumber = {LinkId} order by SerialNumber ";
            var dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);
        }


        //获取剩余任务信息，右上角  开工 剩余客户 完工
        public string GetShengyuRenwuInfo()
        {
            var TaskId = Request["TaskId"];
            //var LinkId = Request["LinkId"];
            var CustomerId = Request["CustomerId"];

            var sql = $"select * from bsi_TaskCustomer where TaskId = {TaskId} order by CustomerOrder";
            var custormerDt = SqlHelper.ExecuteDataTable(sql);

            var cusIndex = -1;

            for (int i = 0; i < custormerDt.Rows.Count; i++)
            {
                DataRow customer = custormerDt.Rows[i];
                if (customer["ID"].ToString() == CustomerId)
                {
                    cusIndex = i;
                }
            }

            cusIndex++;

            var TotalCustomer = custormerDt.Rows.Count;
            var LeftCustomer = TotalCustomer - cusIndex;

            var taskDt = SqlHelper.ExecuteDataTable($"select StartScene,EndScene from bsi_Task where ID = {TaskId}");
            var StartScene = taskDt.Rows[0]["StartScene"];
            var EndScene = taskDt.Rows[0]["EndScene"];

            var ret = new
            {
                TotalCustomer,
                LeftCustomer,
                StartScene,
                EndScene
            };
            return JsonConvert.SerializeObject(ret);
        }


        //清空顾客物品栏物品
        public string ClearInventoryItem()
        {
            var CustomerRecordId = GetCustomerRecordId();
            if (CustomerRecordId == "0")
            {//未找到，理论上不会出现
                return "-1";
            }

            commBll.DeleteInfo("bsi_TaskCustomerInventory", $" and CustomerRecordId={CustomerRecordId}");

            return "1";
        }

        //添加顾客物品栏物品
        public string AddInventoryItem()
        {
            var CustomerRecordId = GetCustomerRecordId();
            if (CustomerRecordId == "0")
            {//未找到，理论上不会出现
                return "-1";
            }

            var ItemName = Request["ItemName"];
            var ItemValue = Request["ItemValue"];
            var ItemSrc = Request["ItemSrc"];

            var ret = int.Parse(commBll.AddIdentity("bsi_TaskCustomerInventory", "CustomerRecordId,ItemName,ItemValue,ItemSrc,AddUserId,AddTime", $"{CustomerRecordId},'{ItemName}','{ItemValue}','{ItemSrc}',{UserId},GETDATE()", null).ToString());

            if (ret > 0)
            {
                return "1";
            }
            return "-2";
        }

        //添加顾客物品栏物品
        public string DelInventoryItem()
        {
            var CustomerRecordId = GetCustomerRecordId();
            if (CustomerRecordId == "0")
            {//未找到，理论上不会出现
                return "-1";
            }

            //var ItemName = Request["ItemName"];
            var ItemValue = Request["ItemValue"];
            //var ItemSrc = Request["ItemSrc"];

            var ret = commBll.DeleteInfo("bsi_TaskCustomerInventory", $" and CustomerRecordId = {CustomerRecordId} and ItemValue='{ItemValue}'");
            //if (ret > 0)
            //{
            return "1";
            //}
            //return "-2";
        }

        //获取顾客物品栏物品
        public string GetInventoryItem()
        {
            var CustomerRecordId = GetCustomerRecordId();
            if (CustomerRecordId == "0")
            {//未找到，理论上不会出现
                return "-1";
            }

            var dt = commBll.GetListDatatable("*", "bsi_TaskCustomerInventory", $" and CustomerRecordId= {CustomerRecordId}");

            return JsonConvert.SerializeObject(dt);
        }

        private string GetCustomerRecordId()
        {
            var TRId = Request["TRId"];
            var TaskId = Request["TaskId"];
            var CustomerId = Request["CustomerId"];

            var CustomerRecordId = commBll.GetListSclar("Id", "bsi_TaskCustomerRecord", $" and TRId={TRId} and TaskId = {TaskId} and CustomerId={CustomerId}");
            return CustomerRecordId;
        }


        public string ChangePWD()
        {
            var pwd1 = Request["pwd1"] ?? "";
            var pwd2 = Request["pwd2"] ?? "";
            if (pwd1 == "" || pwd2 == "")
            {
                return "请输入密码";
            }
            if(pwd1!=pwd2)
            {
                return "两次密码输入不一致";
            }
            return SqlHelper.ExecuteNonQuery("update tb_user set Password='" + pwd1 + "' where U_ID=" + UserId).ToString();

        }

    }
}
