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
    public class CaseManagementController : BaseController
    {

        CommonBll commonbll = new CommonBll();
        //
        // GET: /Admin/CaseManagement/

        public ActionResult Index()
        {
            return View();
        }


        public string GetList()
        {
            string wheres = " ";
            if (UserType == 1)
            { //管理员
                if (UserNo != "admin")
                {
                    wheres += $" and (a.[AddUserId] = {UserId})";
                }
            }
            else if (UserType == 2)
            { //教师
                wheres += $" and (a.[AddUserId] = {UserId} or (a.EnabledState = 1 and f.Type = 1))";
            }
            //查询条件
            if (Request["SearchName"].Length > 0)
            {
                wheres += " and TaskName like '%" + Request["SearchName"] + "%'";
            }
            if (Request["PublicState"] != "0")
            {
                wheres += " and [PublicState] =" + Request["PublicState"] + "";
            }
            if (Request["EnabledState"] != "0")
            {
                wheres += " and [EnabledState] =" + Request["EnabledState"] + "";
            }
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.AddTime desc"; //排序必须填写
            m.strFld = @" a.ID,a.TaskName,a.StartScene,a.HallScene,a.CounterScene,a.EndScene,a.PublicState,a.EnabledState,(select count(*) from bsi_TaskCustomer where TaskId = a.ID) as CustomNum,a.IsAccessibility,
                            e.ID as SectionId,e.SectionName as SectionName,d.ID as ChapterId,d.ResourcesName as ChapterName,c.ID as CourseId,c.CurriculumName as CourseName,
                            a.AddUserId";
            m.tab = $@"bsi_Task a
                        left join bsi_ExercisePracticeChapters b on b.Types=2 and ForeignkeyId = a.ID
                        left join bsi_Curriculum c on c.State=1 and c.ID = b.CourseId
                        left join bsi_Chapter d on d.ID = b.ChapterId
                        left join bsi_Section e on e.ID = b.SectionId
                        left join tb_User f on a.AddUserId = f.U_ID";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);

            dt.Columns.Add("HasAuth", Type.GetType("System.String"));
            foreach (DataRow item in dt.Rows)
            {

                if (item["AddUserId"].ToString() == UserId.ToString())
                {
                    item["HasAuth"] = "1";
                }
                else
                {
                    item["HasAuth"] = "0";
                }
            }


            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }

        public ActionResult AddOrEdit()
        {
            string taskid = string.IsNullOrEmpty(Request["taskid"]) ? "0" : Request["taskid"];
            string addtype = string.IsNullOrEmpty(Request["addtype"]) ? "1" : Request["addtype"];//1新增，2编辑
            string operscene = string.IsNullOrEmpty(Request["operscene"]) ? "1" : Request["operscene"];//1基本信息，2业务场景，3客户列表

            ViewData["taskid"] = taskid;
            ViewData["addtype"] = addtype;
            ViewData["operscene"] = operscene;

            if (taskid == "0")
            {
                ViewData["addtype"] = 1;
                ViewData["operscene"] = 1;
                return View("AddOrEditInfo");
            }

            switch (operscene)
            {
                case "1":
                    return View("AddOrEditInfo");
                case "2":
                    return View("AddOrEditScene");
                case "3":
                    break;

            }

            return View("AddOrEditInfo");
        }

        public string GetTaskInfoById()
        {
            string taskid = Request["taskid"];
            if (string.IsNullOrEmpty(taskid))
            {
                return "";
            }

            var sql = $@"select a.ID,a.TaskName,a.TaskDescribe,a.TaskImportant,a.TaskExplain ,a.IsAccessibility
                        from 
                        bsi_Task a
                        where a.ID = {taskid}";
            var dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);
        }

        public string AddOrEditTaskInfo()
        {
            string taskid = Request["taskid"];
            string TaskName = Request["TaskName"];
            string IsAccessibility = Request["IsAccessibility"];
            string TaskDescribe = Request["TaskDescribe"];
            string TaskImportant = Request["TaskImportant"];
            string TaskExplain = Request["TaskExplain"];

            var sql = "";

            if (taskid == "0") //新增
            {
                sql = $"select count(*) from bsi_Task where TaskName = '{TaskName}'";
                var count = int.Parse(SqlHelper.ExecuteNonQuerys(sql).ToString());
                if (count > 0)
                {
                    return "-77";
                }
                sql = $"insert into bsi_Task([TaskName],[TaskDescribe],[TaskImportant],[TaskExplain],[IsAccessibility],[AddUserId],[AddTime],[UpdateTime]) values('{TaskName}','{TaskDescribe}','{TaskImportant}','{TaskExplain}','{IsAccessibility}',{UserId},GETDATE(),GETDATE())";
                count = int.Parse(SqlHelper.ExecuteNonQuerys(sql).ToString());
                //AddTaskPracticeWithTask(count.ToString(), 2);//练习
                //AddTaskPracticeWithTask(count.ToString(), 3);//教学

                //var updateStr = $@"update b set IsAccessibility = {IsAccessibility}
                //                from 
                //                bsi_PracticeTasks a 
                //                join bsi_PracticeAssessment b on a.PracticeId = b.ID and (b.Type_All = 2 or b.Type_All = 3)
                //                where a.TaskId = {count}";
                //SqlHelper.ExecuteNonQuerys(updateStr);

                return count.ToString();

            }
            else //编辑
            {
                sql = $"select count(*) from bsi_Task where TaskName = '{TaskName}' and ID !={taskid}";
                var count = int.Parse(SqlHelper.ExecuteNonQuerys(sql).ToString());
                if (count > 0)
                {
                    return "-77";
                }
                sql = $"update bsi_Task set [TaskName]='{TaskName}',[TaskDescribe]='{TaskDescribe}',[TaskImportant]='{TaskImportant}',[TaskExplain]='{TaskExplain}',[IsAccessibility]='{IsAccessibility}',[UpdateTime]=GETDATE() where ID = {taskid};";
                //var updateStr = $@"update b set IsAccessibility = {IsAccessibility}
                //                from 
                //                bsi_PracticeTasks a 
                //                join bsi_PracticeAssessment b on a.PracticeId = b.ID and b.Type_All = 2
                //                where a.TaskId = {taskid}";
                //sql += updateStr;
                SqlHelper.ExecuteNonQuerys(sql);
                return "1";
            }
        }

        public string AddTaskPracticeWithTask(string TaskId, int Type_All)
        {
            var taskId = TaskId;

            StringBuilder sb = new StringBuilder();

            var practiceId = "0";
            var practiceId2 = "0";

            var ptDt = SqlHelper.ExecuteDataTable($@"select a.PracticeId
                                                                from 
                                                                bsi_PracticeTasks a 
                                                                join bsi_PracticeAssessment b on a.PracticeId = b.ID and b.Type_All = Type_All
                                                                where a.TaskId = {taskId}");
            if (ptDt.Rows.Count > 0)
            {
                practiceId = ptDt.Rows[0]["PracticeId"].ToString();
                if (Type_All == 2)
                {
                    practiceId2 = ptDt.Rows[1]["PracticeId"].ToString();
                }
            }




            if (practiceId == "0")//找不到记录 第一次激活
            {
                var taskName = "";
                taskName = commonbll.GetListSclar("TaskName", "bsi_Task", $" and ID = {taskId}");

                string table = "bsi_PracticeAssessment"; //表名
                string list = "PracticeName,PracticeStarTime, PracticeLong, PracticeState, PracticeType,Type_All, AddUserId, AddTime";//列
                string vlaue = "@PracticeName,@PracticeStarTime, @PracticeLong, @PracticeState, @PracticeType,@Type_All, @AddUserId, @AddTime";


                SqlParameter[] pars = new SqlParameter[]
                    {
                        new SqlParameter("@PracticeName",taskName),
                        new SqlParameter("@PracticeStarTime",DateTime.Now),
                        new SqlParameter("@PracticeLong",10000100),
                        new SqlParameter("@PracticeState",1),
                        new SqlParameter("@PracticeType",1),
                        new SqlParameter("@Type_All",2),
                        //new SqlParameter("@IsAccessibility",2),
                        new SqlParameter("@AddUserId",UserId),
                        new SqlParameter("@AddTime",DateTime.Now)
                    };
                practiceId = commonbll.AddIdentity(table, list, vlaue, pars).ToString();
                sb.Append($"insert into bsi_PracticeTasks(PracticeId,TaskId) values({practiceId},{taskId});");


                if (Type_All == 2)
                {
                    pars = new SqlParameter[]
                        {
                        new SqlParameter("@PracticeName",taskName),
                        new SqlParameter("@PracticeStarTime",DateTime.Now),
                        new SqlParameter("@PracticeLong",10000100),
                        new SqlParameter("@PracticeState",1),
                        new SqlParameter("@PracticeType",2),
                        new SqlParameter("@Type_All",2),
                        //new SqlParameter("@IsAccessibility",2),
                        new SqlParameter("@AddUserId",UserId),
                        new SqlParameter("@AddTime",DateTime.Now)
                        };
                    practiceId2 = commonbll.AddIdentity(table, list, vlaue, pars).ToString();
                    sb.Append($"insert into bsi_PracticeTasks(PracticeId,TaskId) values({practiceId2},{taskId});");
                }


            }

            sb.Append($"update bsi_PracticeAssessment set PracticeState = 1 where ID = {practiceId};");
            if (Type_All == 2)
            {
                sb.Append($"update bsi_PracticeAssessment set PracticeState = 1 where ID = {practiceId2};");
            }

            //处理实训考核班级关系
            sb.Append($"delete bsi_PracticeClass where PracticeId = {practiceId};");
            if (Type_All == 2)
            {
                sb.Append($"delete bsi_PracticeClass where PracticeId = {practiceId2};");
            }
            var classDt = SqlHelper.ExecuteDataTable("select C_ID from tb_Class");
            foreach (DataRow item in classDt.Rows)
            {
                var classId = item["C_ID"];
                sb.Append($"insert into bsi_PracticeClass(PracticeId,ClassId) values({practiceId},{classId});");
                if (Type_All == 2)
                {
                    sb.Append($"insert into bsi_PracticeClass(PracticeId,ClassId) values({practiceId2},{classId});");
                }
            }

            if (sb.Length > 0)
            {
                SqlHelper.ExecuteNonQuery(sb.ToString());
            }

            return "";
        }

        public string UpdateCase()
        {
            var Ids = Request["Ids"];
            var FieldName = Request["FieldName"];
            var Status = Request["Status"];

            var sql = $"update bsi_Task set [{FieldName}] = {Status} where ID in ({Ids});";
            SqlHelper.ExecuteNonQuerys(sql).ToString();

            StringBuilder sb = new StringBuilder();
            //设置对应的实训考核
            if (Status == "2") //关闭
            {
                sb.Append($@"update b set PracticeState = 2
                            from 
                            bsi_PracticeTasks a 
                            join bsi_PracticeAssessment b on a.PracticeId = b.ID and b.Type_All = 2
                            where a.TaskId in ({Ids})");
            }
            else if (Status == "1") //开启
            {



                var taskIdArr = Ids.Split(',');
                for (int i = 0; i < taskIdArr.Length; i++)
                {
                    var taskId = taskIdArr[i];
                    var isEnable = commonbll.GetRecordCount("bsi_Task", $" and ID={taskId} and PublicState=1 and EnabledState =1");
                    if (isEnable == 0) continue;

                    //AddTaskPracticeWithTask(taskId, 2);
                    //AddTaskPracticeWithTask(taskId, 3);


                    //var ptDt = SqlHelper.ExecuteDataTable($@"select a.PracticeId
                    //                                            from 
                    //                                            bsi_PracticeTasks a 
                    //                                            join bsi_PracticeAssessment b on a.PracticeId = b.ID and b.Type_All = 2
                    //                                            where a.TaskId = {taskId}");




                    //更新考核状态
                    sb.Append($@"update b set PracticeState = 1
                                from 
                                bsi_PracticeTasks a 
                                join bsi_PracticeAssessment b on a.PracticeId = b.ID and (b.Type_All = 2 or b.Type_All = 3)
                                where a.TaskId = {taskId}");

                }

            }

            if (sb.Length > 0)
            {
                SqlHelper.ExecuteNonQuery(sb.ToString());
            }



            return "1";
        }

        public string DelCase()
        {
            var Ids = Request["Ids"];
            var sql = $"delete bsi_Task where ID in ({Ids});";
            SqlHelper.ExecuteNonQuerys(sql).ToString();
            return "1";
        }

        public string GetTaskSceneById()
        {
            string taskid = Request["taskid"];
            if (string.IsNullOrEmpty(taskid))
            {
                return "";
            }

            var sql = $@"select a.* from
                        (select ID, StartScene, HallScene, CounterScene, EndScene, TaskDescribe, TaskImportant ,OperManualUrl ,OperManualName from bsi_Task where ID = {taskid}) a";
            var dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);
        }

        public string AddOrEditTaskScene()
        {

            string taskid = Request["taskid"];
            string StartScene = Request["StartScene"];
            string HallScene = Request["HallScene"];
            string CounterScene = Request["CounterScene"];
            string EndScene = Request["EndScene"];

            if (string.IsNullOrEmpty(taskid) || (string.IsNullOrEmpty(StartScene) && string.IsNullOrEmpty(HallScene) && string.IsNullOrEmpty(CounterScene) && string.IsNullOrEmpty(EndScene)))
            {
                return "-1";
            }

            var setsql = "";
            if (!string.IsNullOrEmpty(StartScene))
            {
                setsql += $"[StartScene] = {StartScene},";
            }
            if (!string.IsNullOrEmpty(HallScene))
            {
                setsql += $"[HallScene] = {HallScene},";
            }
            if (!string.IsNullOrEmpty(CounterScene))
            {
                setsql += $"[CounterScene] = {CounterScene},";
            }
            if (!string.IsNullOrEmpty(EndScene))
            {
                setsql += $"[EndScene] = {EndScene},";
            }
            setsql = setsql.Substring(0, setsql.Length - 1);

            var sql = $"update bsi_Task set {setsql} where ID = {taskid}";
            SqlHelper.ExecuteNonQuerys(sql).ToString();
            return "1";

        }

        //获取对应表单盖章   GaiZhangStr
        public string GetTaskFormSeal()
        {
            var TaskId = Request["TaskId"];
            var CustomerId = Request["CustomerId"];
            var Types = Request["Types"];
            var FormId = Request["FormId"];

            //只处理 133盖章位置
            if (Types != "133")
            {
                return "";
            }

            var sql = $"select * from [bsi_TaskDetail] where TaskId = '{TaskId}' and CustomerId = '{CustomerId}' and LinkId = '{Types}' and FormId = '{FormId}';";
            var dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);
        }


        public string AddTaskForm()
        {
            var TaskId = Request["TaskId"];
            var CustomerId = Request["CustomerId"];
            var Types = Request["Types"];
            var FormId = Request["FormId"];

            //只处理 133盖章位置 14返还资料 134签字
            if (Types != "133" && Types != "14" && Types != "134")
            {
                return "-1";
            }

            var sql = $"delete bsi_TaskFormRelation where TaskId = '{TaskId}' and CustomerId = '{CustomerId}' and Types = '{Types}' and FormId = '{FormId}';";
            sql += $"delete bsi_KeyAnswer where TaskId={TaskId} and CustomerId={CustomerId} and FormId = {FormId};";

            var GaiZhangStr = "";
            if (Types == "133")
            {
                GaiZhangStr = Request["GaiZhangStr"];
            }
            sql += $@"insert into bsi_TaskFormRelation([TaskId],[CustomerId],[Types],[GaiZhangStr],[FormId],[AddUserId],[AddTime]) 
                    values('{TaskId}','{CustomerId}','{Types}','{GaiZhangStr}','{FormId}',{UserId},GETDATE())";
            SqlHelper.ExecuteNonQuerys(sql).ToString();
            return "1";
        }

        public string DelTaskForm()
        {
            var TaskId = Request["TaskId"];
            var CustomerId = Request["CustomerId"];
            var Types = Request["Types"];
            var FormId = Request["FormId"];

            var sql = $"delete bsi_TaskFormRelation where TaskId = '{TaskId}' and CustomerId = '{CustomerId}' and Types = '{Types}' and FormId = '{FormId}';";
            sql += $"delete bsi_KeyAnswer where TaskId={TaskId} and CustomerId={CustomerId} and FormId = {FormId};";
            SqlHelper.ExecuteNonQuerys(sql).ToString();
            return "1";
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
                whereStr += $" and [ModeId] = 9 and [ParentId] = '1202'";
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
            else if (ModeId == "12")
            {
                whereStr += $" and ModeId='12' and ParentId in (2000,20001) ";
                sortStr = "[TMNO]";
            }
            else
            {
                whereStr += $" and [ModeId] = {ModeId} and [ParentId] != '0'";                
            }


            sql = $"select [TMNO] as value,[TMName] as name from [bsi_TM] where {whereStr} order by {sortStr}";
            dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);
        }


        /// <summary>
        /// 公共获取已添加的表单
        /// TaskId：任务id，CustomerId：客户id，Types：环节编号
        /// </summary>
        /// <returns></returns>
        public string GetCommonTaskFormRelation()
        {
            //TaskId,CustomerId,Types
            var TaskId = Request["TaskId"].ToString();
            var CustomerId = Request["CustomerId"].ToString();
            var LinkId = Request["LinkId"].ToString();
            var Types = 2;

            var sql = $@"select b.TMNO,b.TMName ,a.ID as TaskDetailId
                        from  
                        (select [ID],[FormId] from [bsi_TaskDetail] where [TaskId] = {TaskId} and [CustomerId] = {CustomerId} and LinkId = {LinkId} and [Types] = {Types}) a
                        join [bsi_TM] b on a.FormId = b.TMNO
                        order by a.ID";

            if (LinkId == "5" || LinkId == "8" || LinkId == "91" || LinkId == "92" || LinkId == "14")//这些环节表单存在一条记录里面
            {

                var td_Dt = SqlHelper.ExecuteDataTable($"select [ID],[Answer],FormId from [bsi_TaskDetail] where [TaskId] = {TaskId} and [CustomerId] = {CustomerId} and LinkId = {LinkId} and [Types] = 1");
                var strWhere = " 1=1 ";
                if (LinkId == "91")
                {
                    strWhere += " and ParentId='1201' ";
                }
                else if (LinkId == "92")
                {
                    strWhere += " and ParentId='1202' ";
                }
                var tm_Dt = SqlHelper.ExecuteDataTable($"select [TMNO],[TMName] from [bsi_TM] where {strWhere}");

                if (td_Dt.Rows.Count == 0)
                {
                    return "";
                }

                var Answer = td_Dt.Rows[0]["Answer"].ToString();
                string[] formlist;

                var tempList = new List<object>();
                if (LinkId == "5")
                {
                    if (td_Dt.Rows[0]["FormId"].ToString() != "")
                    {
                        formlist = new string[td_Dt.Rows.Count];
                        for (int i = 0; i < td_Dt.Rows.Count; i++)
                        {
                            formlist[i] = td_Dt.Rows[i]["FormId"].ToString();
                        }
                    }
                    else
                    {
                        formlist = Answer.Split(',');
                    }

                }
                else
                {
                    formlist = Answer.Split(',');
                }

                for (int i = 0; i < formlist.Length; i++)
                {
                    var formid = formlist[i];
                    var item = tm_Dt.AsEnumerable().FirstOrDefault(t => t.Field<string>("TMNO") == formid);
                    if (item != null)
                    {
                        var temp = new
                        {
                            TMNO = item["TMNO"].ToString(),
                            TMName = item["TMName"].ToString(),
                            TaskDetailId = "0"
                        };
                        tempList.Add(temp);
                    }
                }

                return JsonConvert.SerializeObject(tempList);



            }



            //if (LinkId == "91")
            //{
            //    sql = $@"select b.TMNO,b.TMName ,a.ID as TaskDetailId
            //            from  
            //            (select [ID],[FormId] from [bsi_TaskDetail] where [TaskId] = {TaskId} and [CustomerId] = {CustomerId} and LinkId = {LinkId} and [Types] = {Types}) a
            //            join [bsi_TM] b on a.FormId = b.TMNO and b.ParentId='1201'
            //            order by a.ID";
            //}
            //else if (LinkId == "92")
            //{
            //    sql = $@"select b.TMNO,b.TMName ,a.ID as TaskDetailId
            //            from  
            //            (select [ID],[FormId] from [bsi_TaskDetail] where [TaskId] = {TaskId} and [CustomerId] = {CustomerId} and LinkId = {LinkId} and [Types] = {Types}) a
            //            join [bsi_TM] b on a.FormId = b.TMNO and b.ParentId='1202'
            //            order by a.ID";
            //}



            var dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);

        }



        #region   关联章节数据所需

        public string GetCourseList()
        {
            var sql = $"select ID,CurriculumName as CourseName from bsi_Curriculum where State = 1 order by Sort";
            var dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);
        }

        public string GetChapterList()
        {
            var sql = $"select ID,ResourcesName as ChapterName from bsi_Chapter where CurriculumID = {Request["CourseId"]} order by Sort";
            var dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);
        }


        public string GetSectionList()
        {
            string wheres = " and c.State = 1 ";
            if (UserType == 1)
            { //管理员
                wheres += $" and (a.[AddUserId] = {UserId})";
            }
            else if (UserType == 2)
            { //教师
                wheres += $" and (a.[AddUserId] = {UserId} or a.AddUserId = 1)";
            }

            //查询条件
            if (Request["CourseId"].Length > 0 && Request["CourseId"] != "0")
            {
                wheres += $" and c.ID = '{Request["CourseId"]}'";
            }
            if (Request["ChapterId"].Length > 0 && Request["ChapterId"] != "0")
            {
                wheres += $" and b.ID = '{Request["ChapterId"]}'";
            }
            if (Request["SectionName"].Length > 0)
            {
                wheres += $" and a.SectionName like '%{Request["SectionName"]}%'";
            }
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " c.Sort,b.Sort,a.Sort"; //排序必须填写
            m.strFld = @" a.ID as SectionId,a.SectionName as SectionName,b.ID as ChapterId,b.ResourcesName as ChapterName,c.ID as CourseId,c.CurriculumName as CourseName ";
            m.tab = @"bsi_Section a
                        join bsi_Chapter b on a.ChapterID = b.ID
                        join bsi_Curriculum c on b.CurriculumID = c.ID";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }

        public string LinkTaskAndSection()
        {
            //CourseId,ChapterId,SectionId,TaskId
            var TaskId = Request["TaskId"];
            var CourseId = Request["CourseId"];
            var ChapterId = Request["ChapterId"];
            var SectionId = Request["SectionId"];
            var isDelete = string.IsNullOrEmpty(Request["isDelete"]) ? 0 : 1;
            if (string.IsNullOrEmpty(TaskId) || string.IsNullOrEmpty(CourseId) || string.IsNullOrEmpty(ChapterId) || string.IsNullOrEmpty(SectionId))
            {
                return "-1";
            }

            var sql = "";
            var len = commonbll.GetRecordCount("bsi_ExercisePracticeChapters", $" and Types = 2 and ForeignkeyId = {TaskId}");
            if (len > 0)
            {
                if (isDelete == 1)
                {
                    sql = $"delete bsi_ExercisePracticeChapters where Types = 2 and ForeignkeyId = {TaskId}";
                }
                else
                {
                    sql = $"update bsi_ExercisePracticeChapters set CourseId = '{CourseId}',ChapterId = '{ChapterId}',SectionId = '{SectionId}' where Types = 2 and ForeignkeyId = {TaskId}";
                }


            }
            else
            {
                sql = $"insert into bsi_ExercisePracticeChapters values('{CourseId}','{ChapterId}','{SectionId}','{TaskId}','2','{UserId}',GETDATE())";
            }

            var ret = SqlHelper.ExecuteNonQuery(sql);


            StringBuilder sb = new StringBuilder();

            var classDt = SqlHelper.ExecuteDataTable("select C_ID from tb_Class");


            var taskId = TaskId;
            var practiceId = "0";
            var ptDt = SqlHelper.ExecuteDataTable($@"select a.PracticeId
                                                            from 
                                                            bsi_PracticeTasks a 
                                                            join bsi_PracticeAssessment b on a.PracticeId = b.ID and b.Type_All = 3
                                                            where a.TaskId = {taskId}");
            if (ptDt.Rows.Count > 0)
            {
                practiceId = ptDt.Rows[0]["PracticeId"].ToString();
            }

            if (practiceId == "0")//找不到记录 关联章节
            {
                var taskName = "";
                taskName = commonbll.GetListSclar("TaskName", "bsi_Task", $" and ID = {taskId}");

                string table = "bsi_PracticeAssessment"; //表名
                string list = "PracticeName,PracticeStarTime, PracticeLong, PracticeState, PracticeType,Type_All, AddUserId, AddTime";//列
                string vlaue = "@PracticeName,@PracticeStarTime, @PracticeLong, @PracticeState, @PracticeType,@Type_All, @AddUserId, @AddTime";


                SqlParameter[] pars = new SqlParameter[]
                    {
                    new SqlParameter("@PracticeName",taskName),
                    new SqlParameter("@PracticeStarTime",DateTime.Now),
                    new SqlParameter("@PracticeLong",10000100),
                    new SqlParameter("@PracticeState",1),
                    new SqlParameter("@PracticeType",1),
                    new SqlParameter("@Type_All",3),
                    new SqlParameter("@AddUserId",UserId),
                    new SqlParameter("@AddTime",DateTime.Now)
                    };
                practiceId = commonbll.AddIdentity(table, list, vlaue, pars).ToString();
                sb.Append($"insert into bsi_PracticeTasks(PracticeId,TaskId) values({practiceId},{taskId});");
            }


            //更新考核状态
            sb.Append($"update bsi_PracticeAssessment set PracticeState = 1 where ID = {practiceId};");

            //处理实训考核班级关系
            sb.Append($"delete bsi_PracticeClass where PracticeId = {practiceId};");
            foreach (DataRow item in classDt.Rows)
            {
                var classId = item["C_ID"];
                sb.Append($"insert into bsi_PracticeClass(PracticeId,ClassId) values({practiceId},{classId});");
            }

            if (sb.ToString().Length > 0)
            {
                SqlHelper.ExecuteNonQuery(sb.ToString());
            }

            return ret > 0 ? "1" : "-2";
        }



        #endregion


        #region 所有案例设置都会更新到 任务明细表/bsi_TaskDetail

        public string AddOrEditTaskDetail()
        {
            var TaskDetailId = Request["TaskDetailId"].ToString();
            var TaskId = Request["TaskId"].ToString();
            var LinkId = Request["LinkId"].ToString();
            var CustomerId = Request["CustomerId"].ToString();
            var Types = Request["Types"].ToString();
            var OperationName = Request["OperationName"].ToString();
            var Answer = Request["Answer"].ToString();



            var sb = new StringBuilder();

            //1开工 
            //3.取号，4.取号后引导，5.填单，6.填单后引导 16厅堂送别，20厅堂服务分流
            //8，单据收取 9，证件收取与校验（91.身份证 92非身份证） 10 现金处理  11.柜员填单 12业务办理，13 需要打印的单据,133盖章位置,134签字 14返还资料 15柜台送别
            //17完工
            var SceneId = GetSceneByLinkId(int.Parse(LinkId));
            var SubLinkId = GetSubLinkByLinkId(int.Parse(LinkId));

            //1操作，2表单，3质询
            if (Types == "1")
            {
                if (string.IsNullOrEmpty(Answer))//不设置答案认为是删除任务明细
                {
                    var FormId = Request["FormId"].ToString();
                    if (TaskDetailId == "0") //特殊删除
                    {
                        var td_dt = SqlHelper.ExecuteDataTable($"select ID from bsi_TaskDetail where TaskId='{TaskId}' and SceneId='{SceneId}' and LinkId='{LinkId}' and CustomerId='{CustomerId}' and Types='{Types}'  and FormId='{FormId}';");
                        if (td_dt.Rows.Count > 0)
                        {
                            TaskDetailId = td_dt.Rows[0]["ID"].ToString();
                        }
                    }
                    if (LinkId == "5")
                    {

                        sb.Append($"delete bsi_TaskDetail where TaskId='{TaskId}' and SceneId='{SceneId}' and LinkId='{LinkId}' and CustomerId='{CustomerId}' and Types='{Types}' and FormId='{FormId}';");
                    }
                    sb.Append($"delete bsi_TaskDetail where ID = {TaskDetailId};");
                    if (LinkId == "10")
                    {
                        sb.Append($"delete bsi_CashCollectionDetail where TaskDetailId = {TaskDetailId};");
                    }
                    if (LinkId == "3")//删除取号的同时删除接待
                    {
                        sb.Append($"delete bsi_TaskDetail where TaskId='{TaskId}' and SceneId='{SceneId}' and LinkId=2 and CustomerId='{CustomerId}' and Types='{Types}'; ");
                    }
                }
                else
                {
                    if (TaskDetailId == "0") //新增
                    {
                        var rLen = 0;
                        if (LinkId == "3")//取号要额外添加厅堂接待操作
                        {
                            rLen = commonbll.GetRecordCount("bsi_TaskDetail", $" and TaskId='{TaskId}' and SceneId=2 and LinkId=2 and CustomerId='{CustomerId}' and Types=1");
                            if (rLen == 0)
                            {
                                sb.Append($@"insert into bsi_TaskDetail(TaskId,SceneId,LinkId,CustomerId,Types,OperationName,Answer,FormId,InquiryId,Status,SubLinkId,AddUserId,AddTime) 
                                         values('{TaskId}','2','2','{CustomerId}','1','厅堂接待','接待完成','','0','1','2','{UserId}',GetDate());");
                            }

                        }



                        var td_dt = SqlHelper.ExecuteDataTable($"select ID from bsi_TaskDetail where TaskId='{TaskId}' and SceneId='{SceneId}' and LinkId='{LinkId}' and CustomerId='{CustomerId}' and Types='{Types}'");
                        if (LinkId != "10")
                        {
                            if (LinkId == "5")
                            {
                                var FormId = Request["FormId"].ToString();
                                sb.Append($@"insert into bsi_TaskDetail(TaskId,SceneId,LinkId,CustomerId,Types,OperationName,Answer,FormId,InquiryId,Status,SubLinkId,AddUserId,AddTime) 
                                         values('{TaskId}','{SceneId}','{LinkId}','{CustomerId}','{Types}','{OperationName}','{Answer}','{FormId}','0','1','{SubLinkId}','{UserId}',GetDate());");
                            }
                            else if (td_dt.Rows.Count == 0)
                            {
                                sb.Append($@"insert into bsi_TaskDetail(TaskId,SceneId,LinkId,CustomerId,Types,OperationName,Answer,FormId,InquiryId,Status,SubLinkId,AddUserId,AddTime) 
                                         values('{TaskId}','{SceneId}','{LinkId}','{CustomerId}','{Types}','{OperationName}','{Answer}','','0','1','{SubLinkId}','{UserId}',GetDate());");
                            }
                            else
                            {
                                TaskDetailId = td_dt.Rows[0]["ID"].ToString();
                                sb.Append($"update bsi_TaskDetail set Answer = '{Answer}' where ID = {TaskDetailId};");
                            }
                        }
                        else  //10现金操作单独处理
                        {
                            if (td_dt.Rows.Count == 0)
                            {
                                TaskDetailId = commonbll.AddIdentity("bsi_TaskDetail",
                                    "TaskId,SceneId,LinkId,CustomerId,Types,OperationName,Answer,FormId,InquiryId,Status,SubLinkId,AddUserId,AddTime",
                                    $"'{TaskId}','{SceneId}','{LinkId}','{CustomerId}','{Types}','{OperationName}','{Answer}','','0','1','{SubLinkId}','{UserId}',GetDate()", null).ToString();
                            }
                            else
                            {
                                TaskDetailId = td_dt.Rows[0]["ID"].ToString();
                            }
                            sb.Append($"update bsi_TaskDetail set Answer = '{Answer}' where ID = {TaskDetailId};");
                            //获取额外 现金明细并存表 [bsi_CashCollectionDetail]
                            sb.Append(GetCashDetailSqlString(TaskDetailId));
                        }


                        //if (LinkId == "15")//柜台营销要额外添加柜台送别操作
                        //{
                        //    rLen = commonbll.GetRecordCount("bsi_TaskDetail", $" and TaskId='{TaskId}' and SceneId=3 and LinkId=151 and CustomerId='{CustomerId}' and Types=1");
                        //    if (rLen == 0)
                        //    {
                        //        sb.Append($@"insert into bsi_TaskDetail(TaskId,SceneId,LinkId,CustomerId,Types,OperationName,Answer,FormId,InquiryId,Status,SubLinkId,AddUserId,AddTime) 
                        //                 values('{TaskId}','3','151','{CustomerId}','1','柜台送别','送别完成','','0','1','15','{UserId}',GetDate());");
                        //    }

                        //}
                        //else if (LinkId == "16")//厅堂营销要额外添加厅堂送别操作
                        //{
                        //    rLen = commonbll.GetRecordCount("bsi_TaskDetail", $" and TaskId='{TaskId}' and SceneId=2 and LinkId=161 and CustomerId='{CustomerId}' and Types=1");
                        //    if (rLen == 0)
                        //    {
                        //        sb.Append($@"insert into bsi_TaskDetail(TaskId,SceneId,LinkId,CustomerId,Types,OperationName,Answer,FormId,InquiryId,Status,SubLinkId,AddUserId,AddTime) 
                        //                 values('{TaskId}','2','161','{CustomerId}','1','厅堂送别','送别完成','','0','1','16','{UserId}',GetDate());");
                        //    }

                        //}
                    }
                    else
                    {
                        sb.Append($"update bsi_TaskDetail set Answer = '{Answer}' where ID = {TaskDetailId};");
                        if (LinkId == "10")
                        {
                            //获取额外 现金明细并存表 [bsi_CashCollectionDetail]
                            sb.Append(GetCashDetailSqlString(TaskDetailId));
                        }
                    }
                }
            }
            else if (Types == "2")
            {
                var FormId = Request["FormId"].ToString();

                if (LinkId == "8" || LinkId == "92" || LinkId == "14")//这些环节 表单  没有单独的明细列 只有一个总列，返回后前端会继续更新总列
                {
                    if (LinkId == "8")//单据收取要额外添加柜台接待操作
                    {
                        var rLen = commonbll.GetRecordCount("bsi_TaskDetail", $" and TaskId='{TaskId}' and SceneId=3 and LinkId=7 and CustomerId='{CustomerId}' and Types=1");
                        if (rLen == 0)
                        {
                            SqlHelper.ExecuteNonQuery($@"insert into bsi_TaskDetail(TaskId,SceneId,LinkId,CustomerId,Types,OperationName,Answer,FormId,InquiryId,Status,SubLinkId,AddUserId,AddTime) 
                                         values('{TaskId}','3','7','{CustomerId}','1','柜面接待','接待完成','','0','1','7','{UserId}',GetDate());");
                        }

                    }
                    return "1";
                }


                //if (LinkId == "5")//填单环节表单修改 会更新填单操作
                //{
                //    var tiandanForms = new List<string>();
                //    DataTable tiandan5_dt = SqlHelper.ExecuteDataTable($"select [FormId] from bsi_TaskDetail where TaskId='{TaskId}' and SceneId='{SceneId}' and LinkId='{LinkId}' and CustomerId='{CustomerId}' and Types='{Types}';");
                //    foreach (DataRow item in tiandan5_dt.Rows)
                //    {
                //        tiandanForms.Add(item["FormId"].ToString());
                //    }
                //    var hasInForm = false;
                //    foreach (var item in tiandanForms)
                //    {
                //        if (item.Trim() == FormId.Trim()) {
                //            hasInForm = true;
                //        }
                //    }
                //    if (string.IsNullOrEmpty(Answer) && hasInForm)//不设置答案认为是删除任务明细
                //    {
                //        tiandanForms.Remove(FormId);
                //    }
                //    if (!string.IsNullOrEmpty(Answer) && !hasInForm)//设置答案认为是新增任务明细
                //    {
                //        tiandanForms.Add(FormId);
                //    }

                //    var caozuo5_dt = SqlHelper.ExecuteDataTable($"select [ID] from bsi_TaskDetail where TaskId='{TaskId}' and SceneId='{SceneId}' and LinkId='{LinkId}' and CustomerId='{CustomerId}' and Types='1';");
                //    if (caozuo5_dt.Rows.Count == 0)
                //    {
                //        if (tiandanForms.Count > 0)
                //        {
                //            sb.Append($@"insert into bsi_TaskDetail(TaskId,SceneId,LinkId,CustomerId,Types,OperationName,Answer,FormId,InquiryId,Status,SubLinkId,AddUserId,AddTime) 
                //                         values('{TaskId}','{SceneId}','{LinkId}','{CustomerId}','1','厅堂填单列表','{string.Join(",",tiandanForms)}','{FormId}','0','1','{SubLinkId}','{UserId}',GetDate());");
                //        }
                //    }
                //    else {
                //        if (tiandanForms.Count > 0)
                //        {
                //            sb.Append($"update bsi_TaskDetail set Answer = '{string.Join(",", tiandanForms)}' where ID = {caozuo5_dt.Rows[0]["ID"].ToString()};");
                //        }
                //        else
                //        {
                //            sb.Append($"delete bsi_TaskDetail where ID = {caozuo5_dt.Rows[0]["ID"].ToString()};");
                //        }
                //    }

                //}




                if (string.IsNullOrEmpty(Answer))//不设置答案认为是删除任务明细
                {
                    sb.Append($"delete bsi_TaskDetail where TaskId='{TaskId}' and SceneId='{SceneId}' and LinkId='{LinkId}' and CustomerId='{CustomerId}' and Types='{Types}' and FormId='{FormId}';");
                    sb.Append($"delete bsi_KeyAnswer where TaskId={TaskId} and CustomerId={CustomerId} and FormId = '{FormId}';");
                    sb.Append($"delete dal_DefaultValue where TaskId={TaskId}  and TMNO = '{FormId}';");
                    if (LinkId == "5")//填单环节有个标注答案环节需要额外处理
                    {
                        sb.Append($"delete bsi_TaskFilInTheBill where TaskId={TaskId} and CustomerId={CustomerId} and FormId = '{FormId}';");
                    }
                }
                else
                {
                    var Status = "1"; //是否启用 13环节 打印 不需要计分
                    if (LinkId == "13")
                    {
                        Status = "0";
                    }

                    if (TaskDetailId == "0")
                    {
                        if (LinkId == "91")
                        {
                            Answer = "已校验";
                        }
                        else if (LinkId == "134")
                        {
                            Answer = "已签字";
                        }
                        var td_dt = SqlHelper.ExecuteDataTable($"select ID from bsi_TaskDetail where TaskId='{TaskId}' and SceneId='{SceneId}' and LinkId='{LinkId}' and CustomerId='{CustomerId}' and Types='{Types}' and FormId='{FormId}';");
                        if (td_dt.Rows.Count == 0)
                        {
                            sb.Append($@"insert into bsi_TaskDetail(TaskId,SceneId,LinkId,CustomerId,Types,OperationName,Answer,FormId,InquiryId,Status,SubLinkId,AddUserId,AddTime) 
                                         values('{TaskId}','{SceneId}','{LinkId}','{CustomerId}','{Types}','{OperationName}','{Answer}','{FormId}','0','{Status}','{SubLinkId}','{UserId}',GetDate());");
                        }
                        //sb.Append($@"insert into bsi_TaskDetail(TaskId,SceneId,LinkId,CustomerId,Types,OperationName,Answer,FormId,InquiryId,Status,AddUserId,AddTime) 
                        //             values('{TaskId}','{SceneId}','{LinkId}','{CustomerId}','{Types}','{OperationName}','{Answer}','{FormId}','0','1','{UserId}',GetDate());");
                    }
                    else //理论上来说表单只有新增和删除，修改在表单内部  一般不会进入到这里
                    {
                        sb.Append($"update bsi_TaskDetail set Answer = '{Answer}' where ID = {TaskDetailId};");
                    }

                }



            }
            else if (Types == "3")
            {
                //质询操作代码 暂时在 CustomerConsultationController 中
            }
            if (sb.ToString().Length != 0)
            {
                SqlHelper.ExecuteNonQuery(sb.ToString());
            }

            return "1";
        }




        /// <summary>
        /// 获取 开工 厅堂 柜台 完工 4大场景的信息
        /// [TaskId]，[SceneId]，[CustomerId]
        /// </summary>
        /// <returns></returns>
        public string GetSceneInfo()
        {
            var TaskId = Request["TaskId"];
            var CustomerId = Request["CustomerId"];
            var SceneId = Request["SceneId"];

            var sql = $"SELECT * FROM [bsi_TaskDetail] where [TaskId] = {TaskId} and [CustomerId] = {CustomerId} and [SceneId] = {SceneId} and [Types] != 3";
            var dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);
        }



        #endregion


        public string GetCashDetailSqlString(string TaskDetailId)
        {
            if (TaskDetailId == "0" || string.IsNullOrEmpty(TaskDetailId))
            {
                return "";
            }


            StringBuilder sb = new StringBuilder();
            sb.Append($"delete bsi_CashCollectionDetail where TaskDetailId = {TaskDetailId};");
            var CashDetails = Request["CashDetails"];
            if (CashDetails != null)
            {
                var CashDetailList = JsonConvert.DeserializeObject<List<CashDetailModel>>(CashDetails);
                foreach (var item in CashDetailList)
                {
                    sb.Append($"insert into [bsi_CashCollectionDetail] values('{TaskDetailId}','{item.Type}','{item.DamageType}','{item.CounterfeitType}','1',GETDATE());");

                }
            }

            return sb.ToString();
        }

        public string GetCashDetailInfo()
        {
            var TaskDetailId = Request["TaskDetailId"];
            if (TaskDetailId == null) return "";

            var sql = $"select * from bsi_CashCollectionDetail where TaskDetailId = {TaskDetailId};";
            var dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);

        }



        //预览
        public string AddPreviewTask()
        {


            try
            {

                var TaskId = Request["TaskId"];


                var taskId = TaskId;
                var practiceId = "0";
                var ptDt = SqlHelper.ExecuteDataTable($@"select a.PracticeId
                                                            from 
                                                            bsi_PracticeTasks a 
                                                            join bsi_PracticeAssessment b on a.PracticeId = b.ID and b.Type_All = 3
                                                            where a.TaskId = {taskId}");
                if (ptDt.Rows.Count > 0)
                {
                    practiceId = ptDt.Rows[0]["PracticeId"].ToString();
                }

                string table = "";
                string list = "";
                string vlaue = "";

                if (practiceId == "0")//找不到记录 关联章节
                {
                    var taskName = "";
                    taskName = commonbll.GetListSclar("TaskName", "bsi_Task", $" and ID = {taskId}");

                    table = "bsi_PracticeAssessment"; //表名
                    list = "PracticeName,PracticeStarTime, PracticeLong, PracticeState, PracticeType,Type_All, AddUserId, AddTime";//列
                    vlaue = "@PracticeName,@PracticeStarTime, @PracticeLong, @PracticeState, @PracticeType,@Type_All, @AddUserId, @AddTime";


                    SqlParameter[] pars = new SqlParameter[]
                        {
                    new SqlParameter("@PracticeName",taskName),
                    new SqlParameter("@PracticeStarTime",DateTime.Now),
                    new SqlParameter("@PracticeLong",10000100),
                    new SqlParameter("@PracticeState",1),
                    new SqlParameter("@PracticeType",1),
                    new SqlParameter("@Type_All",3),
                    new SqlParameter("@AddUserId",UserId),
                    new SqlParameter("@AddTime",DateTime.Now)
                        };
                    practiceId = commonbll.AddIdentity(table, list, vlaue, pars).ToString();
                    commonbll.ExecuteNonQuery($"insert into bsi_PracticeTasks(PracticeId,TaskId) values({practiceId},{taskId});");
                }

                table = "bsi_TotalResult";
                list = "ExamId, Scores, Tstate, UserId, Type_All, Grouping_ID, File_ID,UpdateTime, AddTime, AddUserId";
                vlaue = "@ExamId, @Scores, @Tstate, @UserId, @Type_All, @Grouping_ID, @File_ID,@UpdateTime, @AddTime, @AddUserId";

                SqlParameter[] parsin = new SqlParameter[]{
                new SqlParameter("@ExamId",practiceId),
                new SqlParameter("@Scores","0"),
                new SqlParameter("@Tstate","0"),
                new SqlParameter("@UserId",UserId),
                new SqlParameter("@Type_All",3),
                new SqlParameter("@Grouping_ID","0"),
                new SqlParameter("@File_ID","-1"),
                new SqlParameter("@AddTime",DateTime.Now),
                new SqlParameter("@UpdateTime",DateTime.Now),
                new SqlParameter("@AddUserId",UserId)
                };

                var re = commonbll.AddIdentity(table, list, vlaue, parsin);
                //返回成绩id
                return re.ToString();

            }
            catch (Exception)
            {

                return "-1";
            }


        }


        public string GetEditTextInfo()
        {
            var TaskId = Request["TaskId"];

            var sql = $"select [TaskDescribe],[TaskImportant],[OperManualUrl],[OperManualName] from bsi_Task  where ID= {TaskId}";

            var dt = SqlHelper.ExecuteDataTable(sql);

            return JsonConvert.SerializeObject(dt);

        }


        public string SetEditTextInfo()
        {
            //"customerid": customerid, "FieldName": name, "FieldValue": value

            var TaskId = Request["TaskId"];
            var FieldName = Request["FieldName"];
            var FieldValue = Request["FieldValue"];

            FieldValue = FieldValue.Replace("'", "''");

            var setSql = $"update bsi_Task set {FieldName} = '{FieldValue}'  where ID= {TaskId}";

            var ret = SqlHelper.ExecuteNonQuery(setSql);

            if (ret > 0)
            {
                return "1";
            }
            else
            {
                return "-1";
            }
        }


        //add by yk 上传文件的同时 传递其它参数，其它地方可以作为参考
        [HttpPost]
        public ActionResult UploadFile(HttpPostedFileBase FormFiles)
        {

            try
            {


                var TaskId = Request["TaskId"];

                //获得浏览器端 传过来 第一个文件选择框的数据  
                string filePath = "/Export";
                //获得上传上来的文件名称  
                string fileName = System.IO.Path.GetFileName(FormFiles.FileName);
                //fileName = fileName.Substring(fileName.LastIndexOf('.'));

                string fileNameNew = DateTime.Now.Year + "" + DateTime.Now.Month + "" + DateTime.Now.Day + "" + DateTime.Now.Hour + "" + DateTime.Now.Minute + "" + DateTime.Now.Second + DateTime.Now.Millisecond + "_" + TaskId + "操作手册" + fileName.Substring(fileName.LastIndexOf('.'));
                //获得 要保存的物理路径  

                filePath = Server.MapPath(filePath + "/" + fileNameNew);
                //将上传来的 文件数据 保存在 对应的 物理路径上  
                FormFiles.SaveAs(filePath);

                //修改数据库数据
                SqlHelper.ExecuteNonQuery($"update bsi_Task set OperManualUrl = '/Export/{fileNameNew}',OperManualName = '{fileName}'  where ID= {TaskId}");

                return Content("1");
            }
            catch
            {
                return Content("99");
            }

        }

        public string SetTaskScore()
        {
            string result = "0";
            try
            {
                var TaskId = Request["TaskId"].ToString();
                var formid = Request["formid"].ToString();
                var CustomerId = Request["CustomerId"].ToString();
                var score = Request["score"].ToString();
                SqlHelper.ExecuteNonQuery($"update bsi_TaskDetail set Score={score} where TaskId={TaskId} and CustomerId={CustomerId} and FormId='{formid}'");
                result = "1";
            }
            catch (Exception ex)
            {

            }
            return result;
        }

        public string GetTaskScore()
        {
            string result = "0";
            try
            {
                var TaskId = Request["TaskId"].ToString();
                var formid = Request["formid"].ToString();
                var CustomerId = Request["CustomerId"].ToString();
                var objs = SqlHelper.ExecuteSclar($"select Score from bsi_TaskDetail where TaskId={TaskId} and CustomerId={CustomerId} and FormId='{formid}'");
                result = objs == null || objs.ToString()=="" ? "0" : objs.ToString();
            }
            catch (Exception ex)
            {

            }
            return result;
        }



    }

    public class CashDetailModel
    {
        public string Type { get; set; }
        public string DamageType { get; set; }
        public string CounterfeitType { get; set; }
    }

}

