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
    public class PersonalTrainingEndController : BaseController
    {
        CommonBll commonbll = new CommonBll();
        //
        // GET: /Admin/PersonalTrainingEnd/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult PracticeStudentInfo()
        {
            return View();
        }

        public ActionResult ScoreManagement()
        {
            return View();
        }



        /// <summary>
        ///获取个人实训考核列表
        /// </summary>
        /// <returns></returns>
        public string GetList()
        {
            string eName = Request["EName"].ToString().Trim();
            string AllType = Request["AllType"];//个人 还是团队
            //string where = " and GETDATE()> endtime and PracticeType=" + AllType + "  and Type_All=1  and AddUserId=" + UserId;
            string where = "  and AddUserId=" + UserId;
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

        //成绩排序查询
        public string GetListStudentInfo()
        {
            var PracticeId = Request["PracticeId"];
            var stuinfo = Request["stuinfo"];
            var descby = Request["descby"];
            var AllType = Request["AllType"];
            string wheres = "";//激活的

            if (Request["stuinfo"] != null && Request["stuinfo"].ToString().Length > 0)
            {
                wheres += " and (Name like '%" + Request["stuinfo"].ToString() + "%') or (LoginNo like '%" + Request["stuinfo"].ToString() + "%')";
            }

            //分组成绩

            if (AllType == "1")
            {//个人成绩

                PageModel m = new PageModel();
                m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
                m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
                m.Sort = descby; //排序必须填写
                m.strFld = "*,ROW_NUMBER() OVER(order by Scores desc,tiTime asc) as pm";
                m.tab = @"(
                        select Name,LoginNo,ClassName,MajorName,CollegeName,a.Userid,
                        ISNULL(y.Scores,0) Scores,
                        y.UpdateTime tiTime,y.AddTime,DATEDIFF(ss,y.AddTime,y.UpdateTime) diffTime
                        from tb_Student a
                         inner join tb_User b on a.UserId=b.U_ID
                         inner join tb_Class c on c.C_ID=a.ClassId
                         inner join tb_Major d  on d.M_ID=c.MajorId
                        left join bsi_TotalResult y on a.UserId=y.UserId and y.Type_All in (1,2) and y.Grouping_ID=0 and y.ExamId=" + PracticeId + @"
                         inner join tb_College f on f.C_ID=d.CollegeId where ClassId in(select ClassId  from bsi_PracticeClass  where  PracticeId=" + PracticeId + ")) t";
                m.strWhere = wheres;
                int PageCount = 0;//总数
                var dt = Pager.GetList(m, ref PageCount);
                return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));


            }
            else
            {


                //团队成绩
                PageModel m = new PageModel();
                m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
                m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
                m.Sort = descby; //排序必须填写
                m.strFld = "*,ROW_NUMBER() OVER(order by Scores desc,tiTime asc) as pm";
                m.tab = @"(
                        select Name,LoginNo,ClassName,MajorName,CollegeName,a.Userid,
                        ISNULL(y.Scores,0) Scores,
                        y.UpdateTime tiTime,y.AddTime,DATEDIFF(ss,y.AddTime,y.UpdateTime) diffTime
                        from tb_Student a
                         inner join tb_User b on a.UserId=b.U_ID
                         inner join tb_Class c on c.C_ID=a.ClassId
                         inner join tb_Major d  on d.M_ID=c.MajorId
                         left join bsi_TotalResult y on a.UserId=y.UserId and y.Type_All in (1,2) and y.Grouping_ID in(select GroupingnameID from bsi_Groupingrelation  where StudentID=a.UserId) and Tstate=1 and y.ExamId=" + PracticeId + @"
                         inner join tb_College f on f.C_ID=d.CollegeId where ClassId in(select ClassId  from bsi_PracticeClass  where  PracticeId=" + PracticeId + ")) t";
                m.strWhere = wheres;
                int PageCount = 0;//总数
                var dt = Pager.GetList(m, ref PageCount);
                return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));


            }
        }

        //成绩导出
        public string ExportExamResult()
        {
            var PracticeId = Request["PracticeId"];
            var descby = Request["descby"];
            var AllType = Request["AllType"];
            string wheres = "";//激活的

            if (Request["stuinfo"] != null && Request["stuinfo"].ToString().Length > 0)
            {
                wheres += " and (Name like '%" + Request["stuinfo"].ToString() + "%' or (LoginNo like '%" + Request["stuinfo"].ToString() + "%' )";
            }

            //分组成绩

            if (AllType == "1")
            {//个人成绩
                string list = "*,ROW_NUMBER() OVER(order by Scores desc,tiTime asc) as pm";
                string table = @"(
                        select Name,LoginNo,ClassName,MajorName,CollegeName,
                        ISNULL(y.Scores,0) Scores,
                        y.UpdateTime tiTime,DATEDIFF(ss,y.AddTime,y.UpdateTime) diffTime,'' as answerTime
                        from tb_Student a
                         inner join tb_User b on a.UserId=b.U_ID
                         inner join tb_Class c on c.C_ID=a.ClassId
                         inner join tb_Major d  on d.M_ID=c.MajorId
                        left join bsi_TotalResult y on a.UserId=y.UserId and y.Type_All in (1,2) and y.Grouping_ID=0 and y.ExamId=" + PracticeId + @"
                         inner join tb_College f on f.C_ID=d.CollegeId where ClassId in(select ClassId  from bsi_PracticeClass  where  PracticeId=" + PracticeId + ")) t";

                DataTable dt = commonbll.GetListDatatable(list, table, wheres + " order by " + descby);//加排序

                string ExcelName = DateTime.Now.ToString("yyyyMMdd") + "" + DateTime.Now.Millisecond + "个人考核成绩";
                string filename = "/Export/" + ExcelName + ".xlsx";

                dt = ResetTable(dt);
                OfficeHelper officeHp = new OfficeHelper();
                var Result = officeHp.DtToExcel(dt, "个人考核成绩", new string[] { "学生姓名", "学生账号", "所属学院", "所属专业", "所属班级", "考试得分", "提交时间", "作答用时", "排名" }, "个人考核成绩", ExcelName);

                var json = new object[] {
                        new{
                            filename=filename,
                        }
                    };
                return JsonConvert.SerializeObject(json);


            }
            else
            {

                string list = "*,ROW_NUMBER() OVER(order by Scores desc,tiTime asc) as pm";
                string table = @"(
                        select Name,LoginNo,ClassName,MajorName,CollegeName,
                        ISNULL(y.Scores,0) Scores,
                        y.UpdateTime tiTime,DATEDIFF(ss,y.AddTime,y.UpdateTime) diffTime,'' as answerTime
                        from tb_Student a
                         inner join tb_User b on a.UserId=b.U_ID
                         inner join tb_Class c on c.C_ID=a.ClassId
                         inner join tb_Major d  on d.M_ID=c.MajorId
                         left join bsi_TotalResult y on a.UserId=y.UserId and y.Type_All in (1,2) and y.Grouping_ID in(select GroupingnameID from bsi_Groupingrelation  where StudentID=a.UserId) and Tstate=1 and y.ExamId=" + PracticeId + @"
                         inner join tb_College f on f.C_ID=d.CollegeId where ClassId in(select ClassId  from bsi_PracticeClass  where  PracticeId=" + PracticeId + ")) t";

                DataTable dt = commonbll.GetListDatatable(list, table, wheres + " order by " + descby);//加排序
                string ExcelName = DateTime.Now.ToString("yyyyMMdd") + "" + DateTime.Now.Millisecond + "团队考核成绩";
                string filename = "/Export/" + ExcelName + ".xlsx";

                dt = ResetTable(dt);
                OfficeHelper officeHp = new OfficeHelper();
                var Result = officeHp.DtToExcel(dt, "团队考核成绩", new string[] { "学生姓名", "学生账号", "所属学院", "所属专业", "所属班级", "考试得分", "提交时间", "作答用时", "排名" }, "团队考核成绩", ExcelName);

                var json = new object[] {
                        new{
                            filename=filename,
                        }
                    };
                return JsonConvert.SerializeObject(json);


            }
        }
        private DataTable ResetTable(DataTable dt)
        {
            foreach (DataRow dr in dt.Rows)
            {
                int seconds = 0;
                int.TryParse(dr["diffTime"].ToString(), out seconds);

                dr["answerTime"] = answerTime(seconds);
            }
            dt.Columns.Remove("diffTime");

            return dt;
        }
        private string answerTime(int seconds)
        {
            int second = seconds % 60;
            int mins = seconds / 60;
            int hour = 0;
            if (mins >= 60)
            {
                hour = mins / 60;
                mins = mins % 60;
            }
            string result = hour.ToString().PadLeft(2, '0') + "：";
            result += mins.ToString().PadLeft(2, '0') + "：";
            result += $"{second.ToString().PadLeft(2, '0')}";
            return result;
        }

        /// <summary>
        /// 该考核下面的案例列表
        /// </summary>
        /// <returns></returns>
        public string CaseList()
        {
            var PracticeId = Request["PracticeId"];
            var AllType = Request["AllType"];//类型（1：个人，2：团队）
            var UserId = Request["Userid"];//考试id

            string wheres = " and PracticeId=" + PracticeId;

            string wheresyx = " and c.UserId=" + UserId;
            if (AllType == "2")//团队
            {
                var FZID = commonbll.GetListSclar("top 1 GroupingnameID", "bsi_Groupingrelation", " and StudentID=" + UserId);
                wheresyx = "  and c.Grouping_ID=" + FZID;
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.AddTime desc"; //排序必须填写
            m.strFld = @" b.ID as TaskId,c.ID as TRID,a.PracticeId as ID,TaskName,d.Scores,
  (SELECT top 1 PositionName FROM bsi_TeamPosition where ID=d.File_ID) AS PositionName,
  d.UpdateTime,d.Tstate";
            m.tab = @"bsi_PracticeTasks  a
  INNER JOIN bsi_Task b ON a.TaskId=b.ID
  left JOIN bsi_TotalResult c ON c.ExamId=a.PracticeId  and c.Type_All=1 " + wheresyx + @"
  left JOIN bsi_TotalResultTask d  ON d.TRId=c.ID and d.TaskId=a.TaskId and d.UserId=" + UserId;
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }


    }

}
