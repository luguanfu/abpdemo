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
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class PersonalTrainingController : BaseController
    {
        //个人实训考核
        CommonBll commonbll = new CommonBll();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Add()
        {
            return View();
        }


        /// <summary>
        /// 添加考核内容
        /// </summary>
        /// <returns></returns>
        public ActionResult AddTraining()
        {
            return View();
        }




        #region 首页


        /// <summary>
        ///获取个人实训考核列表
        /// </summary>
        /// <returns></returns>
        public string GetList()
        {
            string eName = Request["EName"].ToString().Trim();
            string AllType = Request["AllType"];//个人 还是团队
            string where = " and PracticeType=" + AllType + "  and  AddUserId=" + UserId;
            if (!string.IsNullOrEmpty(eName))
            {
                where += " and PracticeName like '%" + eName + "%'";
            }
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " AddTime desc"; //排序必须填写
            m.strFld = " * ";
            m.tab = "bsi_PracticeAssessment";
            m.strWhere = where;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }

        /// <summary>
        /// 添加考核
        /// </summary>
        /// <returns></returns>
        public string AddInfo()
        {
            try
            {
                string EName = Request["EName"];//考核名称
                string StartTime = Request["StartTime"]; //开始时间
                string EndTime = Request["EndTime"]; //结束时间
                string AddE_TeamId = Request["AddE_TeamId"];//班级
                string AllType = Request["AllType"];//个人 还是团队
                string PracticeId = Request["PracticeId"];
                string addType = Request["addType"];
                string PracticeLong = Request["PracticeLong"];
                //TimeSpan ts1 = Convert.ToDateTime(EndTime) - Convert.ToDateTime(StartTime);

                string AddUserId = UserId.ToString();//操作人 
                DateTime AddTime = DateTime.Now;//当前时间
                if (PracticeId == "0")
                {//新增



                    //校验考试名称是否存在
                    string wheres = " and PracticeName='" + EName + "' and PracticeType=" + AllType+ " and AddUserId="+ AddUserId;//试卷状态  
                    var checkcount = commonbll.GetRecordCount("bsi_PracticeAssessment", wheres);
                    if (checkcount > 0)
                    {
                        return "-88";
                    }
                    string table = "bsi_PracticeAssessment"; //表名
                    string list = "PracticeName,PracticeStarTime, PracticeLong, PracticeState, PracticeType,Type_All,AddUserId, AddTime,EndTime";//列
                    string vlaue = "@PracticeName,@PracticeStarTime, @PracticeLong, @PracticeState, @PracticeType,@Type_All, @AddUserId, @AddTime,@EndTime";


                    SqlParameter[] pars = new SqlParameter[]
                        {
                        new SqlParameter("@PracticeName",EName),
                        new SqlParameter("@PracticeStarTime",StartTime),
                        new SqlParameter("@PracticeLong",Convert.ToInt32(PracticeLong)),
                        new SqlParameter("@PracticeState",0),
                        new SqlParameter("@PracticeType",AllType),
                        new SqlParameter("@Type_All",addType),
                        new SqlParameter("@AddUserId",AddUserId),
                        new SqlParameter("@AddTime",AddTime),
                        new SqlParameter("@EndTime",EndTime)
                        };
                    string state = commonbll.AddIdentity(table, list, vlaue, pars).ToString();
                    //新增考核班级关系表
                    if (Convert.ToInt16(state) > 0)
                    {

                        var teamlist = AddE_TeamId.Split(',');//班级
                        string sqltxt = "";
                        for (int i = 0; i < teamlist.Length; i++)
                        {
                            if (teamlist[i].Length > 0)
                            {

                                sqltxt += " insert into bsi_PracticeClass values('" + state + "','" + teamlist[i] + "','" + AddUserId + "','" + AddTime + "')";
                            }
                        }

                        if (sqltxt.Length > 0)
                        {
                            SqlHelper.ExecuteNonQuery(sqltxt);
                        }
                    }
                    return state;
                }
                else
                {
                    //编辑
                    string wheres = " and PracticeName='" + EName + "' and Type_All=" + AllType+ " and AddUserId="+ AddUserId + " and ID!=" + PracticeId;//试卷状态  
                    var checkcount = commonbll.GetRecordCount("bsi_PracticeAssessment", wheres);
                    if (checkcount > 0)
                    {
                        return "-88";
                    }
                  
                    string table =" bsi_PracticeAssessment"; //表名
                    string list = " PracticeName=@PracticeName,PracticeStarTime=@PracticeStarTime,PracticeLong=@PracticeLong,@Type_All=Type_All,EndTime=@EndTime";
                    SqlParameter[] pars = new SqlParameter[]
                      {
                        new SqlParameter("@PracticeName",EName),
                        new SqlParameter("@PracticeStarTime",StartTime),
                        new SqlParameter("@PracticeLong",Convert.ToInt32(PracticeLong)),
                        new SqlParameter("@EndTime",EndTime),
                        new SqlParameter("@ID",PracticeId),
                        new SqlParameter("@Type_All",addType)
                      };

                    string state = commonbll.UpdateInfo(table, list, " and ID=@ID", pars).ToString();
                    //新增考核班级关系表
                    if (Convert.ToInt16(state) > 0)
                    {

                        var teamlist = AddE_TeamId.Split(',');//班级
                        string sqltxt = "delete from bsi_PracticeClass where PracticeId="+ PracticeId;
                        for (int i = 0; i < teamlist.Length; i++)
                        {
                            if (teamlist[i].Length > 0)
                            {

                                sqltxt += " insert into bsi_PracticeClass values('" + PracticeId + "','" + teamlist[i] + "','" + AddUserId + "','" + AddTime + "')";
                            }
                        }

                        SqlHelper.ExecuteNonQuery(sqltxt);
                        
                    }

                    //还是返回id
                    return PracticeId;
                }
            }
            catch
            {
                return "-99";
            }

        }
        /// <summary>
        /// 删除考核
        /// </summary>
        /// <returns></returns>
        public string deletePractice()
        {
            string Ids = Request["Ids"];
            try
            {
                commonbll.DeleteInfo("bsi_PracticeAssessment", " and ID in(" + Ids + ")");
                return "1";
            }
            catch
            {
                return "99";
            }
        }
        /// <summary>
        /// 激活
        /// </summary>
        /// <returns></returns>
        public string UpdateState()
        {
            try
            {
                var Ids = Request["Ids"];
                var PracticeState = Request["PracticeState"];
                //需要检验
                SqlParameter[] pars = new SqlParameter[]
                {
                    new SqlParameter("@PracticeState",PracticeState)

                };
                //修改状态 操作人
                commonbll.UpdateInfo("bsi_PracticeAssessment", " PracticeState=@PracticeState", " and ID in(" + Ids + ")", pars);
                return "1";
            }
            catch
            {
                return "99";
            }

        }
        #endregion


        #region 考核内容

        /// <summary>
        /// 添加考核实训关系
        /// </summary>
        /// <returns></returns>
        public string AddTrainingInfo()
        {
            try
            {
                string PracticeId = Request["PracticeId"];
                string TaskId = Request["TaskId"];
                string AddUserId = UserId.ToString();
                DateTime AddTime = DateTime.Now;

                string table = "bsi_PracticeTasks";
                string list = "PracticeId,TaskId, AddUserId, AddTime";
                string vlaue = "@PracticeId,@TaskId, @AddUserId, @AddTime";
                SqlParameter[] pars = new SqlParameter[]
                    {
                        new SqlParameter("@PracticeId",PracticeId),
                        new SqlParameter("@TaskId",TaskId),
                        new SqlParameter("@AddUserId",AddUserId),
                        new SqlParameter("@AddTime",AddTime)
                    };
                string state = commonbll.Add(table, list, vlaue, pars).ToString();
                return state;
            }
            catch
            {
                return "99";
            }


        }

        /// <summary>
        /// 获取单行数据
        /// </summary>
        /// <returns></returns>
        public string GetListById()
        {
            DataTable dt = commonbll.GetListDatatable(@"*,DATEADD(mi,PracticeLong,PracticeStarTime) as EndTime,E_TeamId = (
        stuff(
            (select ',' + cast(ClassId as varchar(20)) from bsi_PracticeClass where PracticeId = a.ID for xml path('')),
            1,
            1,
            ''
        )
    ) ", "bsi_PracticeAssessment a", " and ID=" + Request["PracticeId"]);

            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 获取考核任务关系列表
        /// </summary>
        /// <returns></returns>
        public string GetPracticeTasksList()
        {
            string PracticeId = Request["PracticeId"];
            string where = " and PracticeId=" + PracticeId;
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.ID desc"; //排序必须填写
            m.strFld = " a.ID,b.TaskName,c.LoginNo,b.EnabledState,b.StartScene,b.HallScene,b.CounterScene,b.PublicState,b.EndScene,(select count(1) from bsi_TaskCustomer where TaskId=a.TaskId) as KeHuNum ";
            m.tab = " bsi_PracticeTasks  a inner join bsi_Task b on a.TaskId = b.ID inner join tb_User c on b.AddUserId = c.U_ID ";
            m.strWhere = where;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }

        /// <summary>
        /// 获取任务列表
        /// </summary>
        /// <returns></returns>
        public string GetTaskList()
        {
            string Task_Name = Request["Task_Name"];
            string PracticeId = Request["PracticeId"];
            string wheres = " and (b.Type=1 or a.AddUserId=" + UserId + ") and EnabledState=1";
            if (Task_Name.Length > 0)
            {
                wheres += " and TaskName like '%" + Task_Name + "%'";
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = "  a.ID desc"; //排序必须填写
            m.strFld = "a.*,b.LoginNo,(select count(1) from bsi_PracticeTasks where PracticeId=" + PracticeId + " and TaskId=a.ID)as isto,(select count(1) from bsi_TaskCustomer where TaskId=a.ID) as KeHuNum ";
            m.tab = " bsi_Task a inner join tb_User b on a.AddUserId=b.U_ID ";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }

        /// <summary>
        /// 添加考核与任务关系表
        /// </summary>
        /// <returns></returns>
        public string AddPracticeTasks()
        {
            try
            {
                string AddUserId = UserId.ToString();//操作人 
                DateTime AddTime = DateTime.Now;//当前时间 
                string table = "bsi_PracticeTasks"; //表名
                string list = "PracticeId,TaskId, AddUserId, AddTime";//列
                string vlaue = "@PracticeId,@TaskId, @AddUserId, @AddTime";

                string ids = Request["ids"];//任务id
                string PracticeId = Request["PracticeId"];

                string[] sArray = ids.Split(',');
                for (int i = 0; i < sArray.Length; i++)
                {
                    if (sArray[i].Length > 0)
                    {
                        SqlParameter[] pars = new SqlParameter[]
                       {
                        new SqlParameter("@PracticeId",PracticeId),
                        new SqlParameter("@TaskId",sArray[i]),
                        new SqlParameter("@AddUserId",AddUserId),
                        new SqlParameter("@AddTime",AddTime)
                       };
                        commonbll.Add(table, list, vlaue, pars).ToString();
                    }
                }
                return "1";

            }
            catch
            {
                return "99";
            }

        }

        /// <summary>
        /// 删除考核实训关系表
        /// </summary>
        /// <returns></returns>
        public string DeleteTraining()
        {
            string ids = Request["ids"];
            try
            {
                commonbll.DeleteInfo(" bsi_PracticeTasks", " and ID in(" + ids + ")").ToString();
                return "1";
            }
            catch
            {
                return "99";
            }
        }

        #endregion
    }
}
