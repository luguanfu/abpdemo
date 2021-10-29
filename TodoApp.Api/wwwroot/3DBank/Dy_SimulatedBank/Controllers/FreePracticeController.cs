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
    public class FreePracticeController : BaseController
    {
        CommonBll commonbll = new CommonBll();

        //
        // GET: /FreePractice/

        public ActionResult Index()
        {
            GetTeamAndRole();
            return View();
        }

        /// <summary>
        /// 获得个人/团队练习列表
        /// </summary>
        /// <returns></returns>
        public string GetPersonalExercises()
        {
            var practiceType = Request["PracticeType"]; //类型（1：个人，2：团队,3理论知识）
            int ptype = int.Parse(practiceType);
            if (ptype < 3)
            {
                if (practiceType == "1")
                {

                    Session["Grouping_ID"] = "0";//分组ID
                }
                else
                {
                    //团队，模式 存分组id
                    Session["Grouping_ID"] = commonbll.GetListSclar("GroupingnameID", "bsi_Groupmanagement a INNER JOIN bsi_Groupingrelation b ON a.G_ID = b.GroupingnameID", "  and [type] = 2 AND StudentID = " + UserId);

                }

                string wheres = " and a.PracticeState=1 AND a.Type_All=2  AND a.PracticeType= " + practiceType;


                //查询条件
                if (!string.IsNullOrEmpty(Request["TState"]))
                {
                    wheres += " and d.Tstate=" + Request["TState"] + "";
                }

                if (!string.IsNullOrEmpty(Request["SearchName"]))
                {
                    wheres += " and c.TaskName like  '%" + Request["SearchName"] + "%'";
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
                m.strFld = @" d.ID,b.TaskId,d.ExamId,c.TaskName,(CASE WHEN d.Tstate=0 THEN '进行中' ELSE '已完成' END)AS Tstate,
   d.Scores ,d.UpdateTime,(select top 1 PositionName from bsi_TeamPosition m inner join bsi_TotalResultTask n on m.ID=n.File_ID and n.TRId=d.ID and m.UserId=" + UserId + @") as PositionName";
                m.tab = @"bsi_PracticeAssessment a --实训考核设置表
  inner JOIN bsi_PracticeTasks b ON a.ID = b.PracticeId --实训考核案例关系表
  inner JOIN dbo.bsi_Task c ON c.ID = b.TaskId --管理端任务主表到
  inner JOIN bsi_TotalResult d ON a.ID = d.ExamId AND d.Type_All=2 " + wheresyx;

                m.strWhere = wheres;
                int PageCount = 0;//总数
                var dt = Pager.GetList(m, ref PageCount);
                return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
            }
            else {
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
    " FROM tb_HB_Examination a WHERE a.E_Type=3 AND a.E_IsState=1 and (a.E_TeamId like '%," + ClassId + ",%') ) tb";

                m.strWhere = wheres;
                int PageCount = 0;//总数
                var dt = Pager.GetList(m, ref PageCount);
                return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
            }
           
        }

        /// <summary>
        /// 练习模式显示
        /// </summary>
        /// <returns></returns>
        public ActionResult CaseView()
        {
            return View();
        }

        /// <summary>
        /// 案例历史最高分列表
        /// </summary>
        /// <returns></returns>
        public string CaseList()
        {
            var practiceType = Request["PracticeType"]; //类型（1：个人，2：团队）
            string wheres = @" and a.PracticeState= 1  and c.PublicState= 1 AND a.Type_All=2 and a.PracticeType=" + practiceType + "  AND (a.AddUserId = 1 OR a.AddUserId IN(SELECT TeacherId  FROM tb_Class  WHERE C_ID=" + ClassId + "))";

            //查询条件
            if (!string.IsNullOrEmpty(Request["SearchName"]))
            {
                wheres += " and TaskName like '%" + Request["SearchName"] + "%'";
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.ID desc"; //排序必须填写
            m.strFld = @" a.ID,b.TaskId, c.TaskName,a.AddUserId,(SELECT MAX(ISNULL(Scores,0))  FROM bsi_TotalResult  WHERE ExamId=a.ID and  Tstate=1 AND UserId=" + UserId + " and Type_All=2 )  AS scores ";
            m.tab = @" bsi_PracticeAssessment a
  INNER JOIN bsi_PracticeTasks b ON a.ID = b.PracticeId
  INNER JOIN dbo.bsi_Task c ON c.ID = b.TaskId";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }


        /// <summary>
        /// 快速开始 -查下出可以使用的案例
        /// </summary>
        /// <returns></returns>
        public string GetListByTaskId()
        {
            var practiceType = Request["PracticeType"]; //类型（1：个人，2：团队）
            string wheres = @" and a.PracticeState= 1  AND a.Type_All=2 and a.PracticeType=" + practiceType + "  AND (a.AddUserId = 1 OR a.AddUserId IN(SELECT TeacherId  FROM tb_Class  WHERE C_ID=" + ClassId + "))";

            DataTable dt = commonbll.GetListDatatable("a.ID,b.TaskId", @"bsi_PracticeAssessment a
  INNER JOIN bsi_PracticeTasks b ON a.ID = b.PracticeId
  INNER JOIN dbo.bsi_Task c ON c.ID = b.TaskId", wheres);

            if (dt.Rows.Count > 0)
            {
                //随机取值
                var randm = new Random();
                var num = randm.Next(0, dt.Rows.Count);

                var json = new object[] {
                        new{
                            EId=dt.Rows[num]["ID"],
                            TaskId=dt.Rows[num]["TaskId"]
                        }
                    };
                return JsonConvert.SerializeObject(json);
            }
            else
            {
                var json = new object[] {
                        new{

                        }
                    };
                return JsonConvert.SerializeObject(json);
            }

        }

        /// <summary>
        /// 比赛和练习的 个人新增主表
        /// </summary>
        /// <returns></returns>
        public string Add()
        {
            try
            {
                var ExamId = Request["ExamId"]; //考试id
                var Type_All = Request["Type_All"];
                var text = "";
                if (Type_All == "1")
                {//比赛模式  个人
                    //校验是否已经新增了
                    DataTable dt = commonbll.GetListDatatable("ID,Tstate", "bsi_TotalResult", " and ExamId=" + ExamId + " and Type_All=1  and UserId=" + UserId);//进行中
                    if (dt.Rows.Count > 0)
                    {//有数据
                        if (dt.Rows[0]["Tstate"].ToString() == "1") {
                            return "0";
                        }else 
                        return dt.Rows[0]["ID"].ToString();//返回成绩id
                    }
                }
                else
                {
                    DataTable dt = commonbll.GetListDatatable("ID,Tstate", "bsi_TotalResult", " and ExamId=" + ExamId + " and Type_All=2  and UserId=" + UserId);//进行中
                    if (dt.Rows.Count > 0)
                    {//有数据
                        if (dt.Rows[0]["Tstate"].ToString()== "1") {
                            var TRId = dt.Rows[0]["ID"].ToString();
                            text = $"delete  bsi_TotalResultDetailed where TRTId={TRId} ;";
                            text += $"delete  bsi_TotalResultTask where TRId={TRId} ;";
                            text += $"delete  bsi_TotalResult where ID={TRId} ;";
                            text += $"delete  tb_CountDown where CD_MId={UserId} and CD_EId={ExamId} ;";
                            commonbll.ExecuteNonQuery(text);
                        }
                        else {
                            return dt.Rows[0]["ID"].ToString();//返回成绩id
                        }
                        
                    }
                }

                string tab = "bsi_TotalResult";
                string list = "ExamId, Scores, Tstate, UserId, Type_All, Grouping_ID, File_ID,UpdateTime, AddTime, AddUserId";
                string value = "@ExamId, @Scores, @Tstate, @UserId, @Type_All, @Grouping_ID, @File_ID,@UpdateTime, @AddTime, @AddUserId";

                SqlParameter[] parsin = new SqlParameter[]{
                new SqlParameter("@ExamId",ExamId),
                new SqlParameter("@Scores","0"),
                new SqlParameter("@Tstate","0"),
                new SqlParameter("@UserId",UserId),
                new SqlParameter("@Type_All",Type_All),
                new SqlParameter("@Grouping_ID","0"),
                new SqlParameter("@File_ID","-1"),
                new SqlParameter("@AddTime",DateTime.Now),
                new SqlParameter("@UpdateTime",DateTime.Now),
                new SqlParameter("@AddUserId",UserId)
                };

                var re = commonbll.AddIdentity(tab, list, value, parsin);
                //返回成绩id
                return re.ToString();

            }
            catch (Exception)
            {

                return "-1";
            }
        }

        /// <summary>
        /// 获得团队角色
        /// </summary>
        /// <returns></returns>
        public void GetTeamAndRole()
        {
            string sql = @"SELECT * FROM bsi_Groupmanagement a
  INNER JOIN bsi_Groupingrelation b ON a.G_ID = b.GroupingnameID
  WHERE [type] = 2 AND StudentID = " + UserId;
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
            LEFT JOIN dbo.tb_Student s ON r.StudentID = s.UserId
             WHERE GroupingnameID =  " + Grouping_ID;
            return JsonConvert.SerializeObject(commonbll.GetListDatatable(sql2));
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <returns></returns>
        public string Del()
        {
            string Ids = Request["Ids"];//成绩主表ID
            string ExamId = Request["ExamId"];
            string PracticeType = Request["PracticeType"];
            try
            {
                //
                string text = "";
                // text = "delete from bsi_TeamPosition where ExamId=" + ExamId + " and UserId in(select StudentId from bsi_Groupingrelation where GroupingnameID="+Grouping_ID+")";
                //只能删除当前这条考试 关系到的岗位
                text = "delete from bsi_TeamPosition where ID in(select File_ID from bsi_TotalResultTask where TRId in(" + Ids + "))";

                text += " delete from bsi_TotalResult where ID in(" + Ids + ")";
                text += " delete from bsi_TotalResultTask where TRId in(" + Ids + ")";
                commonbll.ExecuteNonQuery(text);
                return "1";
            }
            catch
            {
                return "99";
            }
        }

        /// <summary>
        /// 清空面的所有成绩
        /// </summary>
        /// <returns></returns>
        public string DelAll()
        {
            try
            {
                var practiceType = Request["PracticeType"]; //类型（1：个人，2：团队）


                string text = " delete from bsi_TeamPosition  where UserId in(select StudentId from bsi_Groupingrelation where GroupingnameID=" + Grouping_ID + ") and ExamId in(select ExamId from bsi_TotalResult where UserId=" + UserId + " and Type_All=2 and  Grouping_ID=" + Grouping_ID + ")";

                text += " delete from bsi_TotalResultTask where TRId in(select ExamId from bsi_TotalResult where UserId=" + UserId + " and Type_All=2 and  Grouping_ID=" + Grouping_ID + ")";
                text += " delete from bsi_TotalResult where UserId=" + UserId + " and Type_All=2 and  Grouping_ID=" + Grouping_ID;
           
                commonbll.ExecuteNonQuery(text);
                return "1";
            }
            catch
            {
                return "99";
            }
        }

        /// <summary>
        /// 分配岗位
        /// </summary>
        /// <returns></returns>
        public string AllocationOfPosts()
        {
            try
            {
                string table = "bsi_TeamPosition"; //表名
                string list = "TasKId, ExamId, UserId, PositionName";//列
                string vlaue = "@TasKId, @ExamId, @UserId, @PositionName";

                var TasKId = Request["TasKId"];//任务id
                var ExamId = Request["ExamId"];//考试id
                var Type_All = Request["Type_All"];//
                var StudentId = Request["StudentId"];//学生id
                var PositionName = Request["PositionName"];//岗位


                //团队，模式 存分组id
                Session["Grouping_ID"] = commonbll.GetListSclar("GroupingnameID", "bsi_Groupmanagement a INNER JOIN bsi_Groupingrelation b ON a.G_ID = b.GroupingnameID", "  and [type] = 2 AND StudentID = " + UserId);

                //校验 当前小组长角色 必须存
                if (StudentId.IndexOf(UserId.ToString()) < 0)
                {
                    return "-66";
                }
               
                //比赛模式
                if (Type_All == "1")
                {

                    //首先校验 竞赛成绩主表有没有插入
                    var checekcount = commonbll.GetRecordCount("bsi_TotalResult", "  and ExamId = " + ExamId + " and Tstate=0 and UserId = " + UserId);
                    if (checekcount==0) {//没救新增

                        string tab1 = "bsi_TotalResult";
                        string list1 = "ExamId, Scores, Tstate, UserId, Type_All, Grouping_ID, File_ID,UpdateTime, AddTime, AddUserId";
                        string value1 = "@ExamId, @Scores, @Tstate, @UserId, @Type_All, @Grouping_ID, @File_ID,@UpdateTime, @AddTime, @AddUserId";

                       SqlParameter[] parsin1 = new SqlParameter[]{
                       new SqlParameter("@ExamId",ExamId),
                       new SqlParameter("@Scores","0"),
                       new SqlParameter("@Tstate","0"),
                       new SqlParameter("@UserId",UserId),
                       new SqlParameter("@Type_All",Type_All),
                       new SqlParameter("@Grouping_ID",Grouping_ID),
                       new SqlParameter("@File_ID","-1"),
                       new SqlParameter("@AddTime",DateTime.Now),
                       new SqlParameter("@UpdateTime",DateTime.Now),
                       new SqlParameter("@AddUserId",UserId)
                       };
                        commonbll.AddIdentity(tab1, list1, value1, parsin1);
                    }

                    //如果是比赛模式
                    var count = commonbll.GetRecordCount("bsi_TeamPosition", " and TasKId=" + TasKId + " and ExamId=" + ExamId + " and UserId=" + UserId);
                    if (count > 0)
                    {
                        //小组长自己的成绩id
                        var trIds = commonbll.GetListSclar("max(ID)", "bsi_TotalResult", " and ExamId=" + ExamId + " and Tstate=0 and UserId=" + UserId);
                        //返回trid
                        return trIds;
                    }
                    
                }
                if (Type_All == "2")
                {
                    //练习的每次都增加一条主的
                    //如果是练习模式 要再这新增自己的数据 主数据
                    string tab1 = "bsi_TotalResult";
                    string list1 = "ExamId, Scores, Tstate, UserId, Type_All, Grouping_ID, File_ID,UpdateTime, AddTime, AddUserId";
                    string value1 = "@ExamId, @Scores, @Tstate, @UserId, @Type_All, @Grouping_ID, @File_ID,@UpdateTime, @AddTime, @AddUserId";

                    SqlParameter[] parsin1 = new SqlParameter[]{
                       new SqlParameter("@ExamId",ExamId),
                       new SqlParameter("@Scores","0"),
                       new SqlParameter("@Tstate","0"),
                       new SqlParameter("@UserId",UserId),
                       new SqlParameter("@Type_All",Type_All),
                       new SqlParameter("@Grouping_ID",Grouping_ID),
                       new SqlParameter("@File_ID","-1"),
                       new SqlParameter("@AddTime",DateTime.Now),
                       new SqlParameter("@UpdateTime",DateTime.Now),
                       new SqlParameter("@AddUserId",UserId)
                     };
                    commonbll.AddIdentity(tab1, list1, value1, parsin1);
                }

                //不能删
                //commonbll.DeleteInfo("bsi_TeamPosition", " and TasKId=" + TasKId + " and ExamId=" + ExamId); //删除该任务案例考试的分配岗位
                //小组长自己的成绩id
                var TRId = commonbll.GetListSclar("max(ID)", "bsi_TotalResult", " and ExamId=" + ExamId + " and Tstate=0 and UserId=" + UserId);
                string sqltxt = "";
                //新增岗位
                var Ids = StudentId.Split(new char[] { ',' });
                var sectionIds = PositionName.Split(new char[] { ',' });
                for (int i = 0; i < Ids.Length; i++)
                {
                    //新增
                    SqlParameter[] pars = new SqlParameter[]
                    {
                        new SqlParameter("@TasKId",TasKId),
                        new SqlParameter("@ExamId",ExamId),
                        new SqlParameter("@UserId",Ids[i]),
                        new SqlParameter("@PositionName",sectionIds[i])

                    };
                    var fileID=commonbll.AddIdentity(table, list, vlaue, pars);

                    //插入明细表
                    var count1 = commonbll.GetRecordCount("bsi_TotalResultTask", " and TRId=" + TRId + " and TaskId=" + TasKId + " and UserId=" + Ids[i]);
                    if (count1 == 0)
                    {
                        sqltxt += @" insert into bsi_TotalResultTask values('" + TRId + "', '" + TasKId + "', 0, 0, '" + Ids[i] + "', '" + Ids[i] + "', getdate(), getdate(),'" + fileID + "')";
                    }

                }
                if (sqltxt.Length > 0)
                {
                    SqlHelper.ExecuteNonQuery(sqltxt);
                }


                //返回trid
                return TRId;
            }
            catch
            {
                return "-1";
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public string GetById()
        {
            var TasKId = Request["TasKId"];//任务id
            var ExamId = Request["ExamId"];//考试id
            string sql = "SELECT UserId FROM bsi_TeamPosition where TasKId=" + TasKId + " and ExamId=" + ExamId;
            return JsonConvert.SerializeObject(commonbll.GetListDatatable(sql));
        }

    }
}
