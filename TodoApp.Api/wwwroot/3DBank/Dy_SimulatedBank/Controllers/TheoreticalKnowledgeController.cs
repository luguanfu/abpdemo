using Dy_SimulatedBank.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dy_SimulatedBank_Bll;
using System.Data;
using System.Data.SqlClient;
using Dy_SimulatedBank_DBUtility.Sql;

namespace Dy_SimulatedBank.Controllers
{
    public class TheoreticalKnowledgeController : BaseController
    {
        //
        // GET: /TheoreticalKnowledge/
        CommonBll commonbll = new CommonBll();
        public ActionResult Index()
        {
            return View();
        }
        public string Getindexlist()
        {
            var TeacherId = commonbll.GetListSclar("TeacherId", "tb_Class", " and C_id =" + ClassId + "");
            string wheres = " and (AddUserId =" + TeacherId + " or CurrType=1)";

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.Sort "; //排序必须填写
            m.strFld = " a.ID,a.CurriculumName,a.Cover,a.Synopsis,(select COUNT(1) from bsi_Section s where s.CurriculumID=a.ID ) as Section,";
            m.strFld += "(select COUNT(1) from bsi_Resources s where s.CurriculumID=a.ID) as COUResources, ";
            m.strFld += " (select COUNT(1) from bsi_ResourceRecord s where s.CurriculumID=a.ID and s.UserID=" + UserId + ") as COUResourceRecord ";

            m.tab = "bsi_Curriculum a";

            if (!string.IsNullOrEmpty(Request["CurriculumName"]))
            {
                wheres += " and a.CurriculumName like '%" + Request["CurriculumName"] + "%'";
            }
            wheres += " and a.State=1";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }
        public ActionResult Details()
        {
            return View();
        }
        public string GetSectionList()
        {
            //string CurriculumID = Request["CurriculumID"];
            //暂时没有 入口,所以写死了一个id
            string CurriculumID = "0";
            var TeacherId = SqlHelper.ExecuteSclar("select TeacherId from dbo.tb_Class where C_ID = " + ClassId);

            DataTable mdt = Base_Common().GetListDatatable(" top 4 ID ", "bsi_Curriculum", " and State=1 and (AddUserId="+ TeacherId + " or AddUserId=1) order by Sort asc");

            string Type = Request["Type"];
            if (Type == "1")
            {
                CurriculumID = "60";
                
            }
            if (Type == "2")
            {
                CurriculumID = "59";
            }
            if (Type == "3")
            {
                CurriculumID = "61";
            }
            if (Type == "4")
            {
                CurriculumID = "62";
            }
            string strwhere = " and a.CurriculumID=" + CurriculumID;



            var Curriculum = Base_Common().GetListDatatable(" top 1 a.ID,a.Cover,a.CurriculumName,a.Synopsis ", " bsi_Curriculum a ", " and a.ID=" + CurriculumID);

            var Chapter = Base_Common().GetListDatatable("a.ID,a.ResourcesName as Name,(select COUNT(1) from bsi_Resources r where r.CurriculumID=a.CurriculumID and r.ChapterID=a.ID) as COUResources,(select COUNT(1) from bsi_ResourceRecord r inner join  bsi_Resources b on r.ResourcesID=b.ID where r.CurriculumID=a.CurriculumID and r.ChapterID=a.ID  and b.ChapterID=r.ChapterID  and r.UserID=" + UserId + ") as COUResourceRecord", " bsi_Chapter a ", strwhere + " order by a.Sort");
            var Section = Base_Common().GetListDatatable("a.ID,a.ChapterID,a.SectionName as Name ", " bsi_Section a left join bsi_Chapter c on c.id=a.ChapterID", strwhere + " order by a.Sort");
            var Resources = Base_Common().GetListDatatable("a.OriginalUrl,a.URL,a.ID,a.ChapterID,a.SectionID,a.ResourcesName as Name,a.Type,(select COUNT(1) from bsi_ResourceRecord r where r.CurriculumID=a.CurriculumID and r.ChapterID=a.ChapterID and r.SectionID=a.SectionID and r.ResourcesID=a.ID and UserId=" + UserId + ") as IsRecord ", " bsi_Resources a left join bsi_Chapter c on a.ChapterID=c.id left join bsi_Section s on a.SectionID=s.id", strwhere);
            var Practice = Base_Common().GetListDatatable($" a.SectionId,a.ChapterId,a.CourseId,a.ForeignkeyId,b.E_Name,b.E_PId,(select count(*) from tb_ExaminationResult where ER_EId = b.EId and ER_MId = {UserId}) as IsRecord ", " bsi_ExercisePracticeChapters a inner join tb_HB_Examination b on  a.ForeignkeyId = b.EId", " and  a.Types=1 and CourseId = " + CurriculumID+ "and b.E_IsState=1 and b.E_AddOperator=" + TeacherId);
            //var PracticeAssessment = Base_Common().GetListDatatable(" a.SectionId,a.ChapterId,a.CourseId,a.ForeignkeyId,b.PracticeName,b.Id ", " bsi_ExercisePracticeChapters a inner join bsi_PracticeAssessment b on  a.ForeignkeyId = b.ID", " and  a.Types=2 and CourseId = " + CurriculumID);
            var PracticeAssessment = Base_Common().GetListDatatable($" a.SectionId,b.TaskName,b.ID as TaskId,d.ID as Eid,(select count(*) from bsi_TotalResult where  Tstate=1 and ExamId = d.ID and UserId={UserId}) as IsRecord ", " bsi_ExercisePracticeChapters a inner join bsi_Task b on a.ForeignkeyId=b.ID and b.PublicState=1 inner join bsi_PracticeTasks c on b.ID=c.TaskId inner join bsi_PracticeAssessment d on c.PracticeId=d.ID and Type_All=3 ", $" and  a.Types=2 and CourseId = {CurriculumID} and (d.AddUserId={TeacherId} or d.AddUserId=1)");

            var tb = new
            {
                Curriculum = Curriculum,
                Chapter = Chapter,
                Section = Section,
                Resources = Resources,
                Practice = Practice,
                PracticeAssessment = PracticeAssessment,
            };

            return JsonConvert.SerializeObject(tb);
        }

        /// <summary>
        /// 根据传递过来的参数判断是否有记录,有的话直接返回id,如果没有记录的话返回插入一条并返回id
        /// </summary>
        /// <returns></returns>
        public string Add()
        {
            try
            {
                var ExamId = Request["ExamId"]; //考试id
                var Type_All = Request["Type_All"];

                DataTable dt = commonbll.GetListDatatable("ID", "bsi_TotalResult", " and ExamId=" + ExamId + " and Type_All=3  and UserId=" + UserId);//进行中
                if (dt.Rows.Count > 0)
                {//有数据

                    return dt.Rows[0]["ID"].ToString();//返回成绩id
                }

                string tab = "bsi_TotalResult";
                string list = "ExamId, Scores, Tstate, UserId, Type_All, Grouping_ID, File_ID,UpdateTime, AddTime, AddUserId";
                string value = "@ExamId, @Scores, @Tstate, @UserId, @Type_All, @Grouping_ID, @File_ID,@UpdateTime, @AddTime, @AddUserId";

                SqlParameter[] parsin = new SqlParameter[]{
                new SqlParameter("@ExamId",ExamId),
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

                var re = commonbll.AddIdentity(tab, list, value, parsin);
                //返回成绩id
                return re.ToString();

            }
            catch (Exception)
            {

                return "-1";
            }
        }


        public ActionResult Kechen()
        {
            string ResourcesID = Request["ResourcesID"];

            string sel = " a.ID,a.CurriculumID,a.ChapterID,a.SectionID,d.CurriculumName,c.ResourcesName as ChapterName,b.SectionName,a.ResourcesName,a.Type,a.URL ";
            string tab = "bsi_Resources a left join bsi_Section b on(a.SectionID=b.ID) left join bsi_Chapter c on(b.ChapterID=c.ID) left join bsi_Curriculum d on(a.CurriculumID=d.ID)";
            string whe = " and a.ID=" + ResourcesID;
            var tb = Base_Common().GetListDatatable(sel, tab, whe);
            if (tb != null && tb.Rows.Count > 0)
            {
                var CurriculumID = tb.Rows[0]["CurriculumID"].ToString();
                var ChapterID = tb.Rows[0]["ChapterID"].ToString();
                var SectionID = tb.Rows[0]["SectionID"].ToString();
                var ID = tb.Rows[0]["ID"].ToString();
                string w = " CurriculumID=" + CurriculumID;
                string sql = "  delete from bsi_ResourceRecord where CurriculumID=" + CurriculumID + " and ChapterID=" + ChapterID + " and SectionID=" + SectionID + " and ResourcesID=" + ID + " and UserId=" + UserId;
                sql += " insert into bsi_ResourceRecord(CurriculumID,ChapterID,SectionID,ResourcesID,UserId) values (" + CurriculumID + "," + ChapterID + "," + SectionID + "," + ID + "," + UserId + ")";
                Base_Common().ExecuteNonQuery(sql);
            }
            ViewData["tb"] = tb;

            return View();
        }
        public string getResources()
        {
            DataTable dt = commonbll.GetListDatatable("*", "bsi_Resources", " and ID=" + Request["ID"]);

            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 新的播放页面
        /// </summary>
        /// <returns></returns>
        public ActionResult NewKechen()
        {
            string ResourcesID = Request["ResourcesID"];

            DataTable dt = commonbll.GetListDatatable("select * from tb_CoursewareAbility where ResourcesID=" + ResourcesID);

            var strsql = "";

            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    var AbilityId = dt.Rows[i]["AbilityId"];
                    var CAScore = dt.Rows[i]["CAScore"];
                    var res = commonbll.GetRecordCount("bsi_StuAbilityScore", $" and PracticeId={ResourcesID} and UserId={UserId} and TaskDetailId=0 and AbilityId={AbilityId}");
                    if (res == 0)
                    {
                        strsql += " insert into bsi_StuAbilityScore values (0," + ResourcesID + ",0,0," + AbilityId + "," + CAScore + ",'xxxx'," + UserId + "," + UserId + ",'" + DateTime.Now + "')";

                    }
                }
                if (strsql.Length > 0)
                {
                    Base_Common().ExecuteNonQuery(strsql);
                }
            }

            string sel = " a.ID,a.CurriculumID,a.ChapterID,a.SectionID,d.CurriculumName,c.ResourcesName as ChapterName,b.SectionName,a.ResourcesName,a.Type,a.URL ";
            string tab = "bsi_Resources a left join bsi_Section b on(a.SectionID=b.ID) left join bsi_Chapter c on(b.ChapterID=c.ID) left join bsi_Curriculum d on(a.CurriculumID=d.ID)";
            string whe = " and a.ID=" + ResourcesID;
            var tb = Base_Common().GetListDatatable(sel, tab, whe);
            if (tb != null && tb.Rows.Count > 0)
            {
                var CurriculumID = tb.Rows[0]["CurriculumID"].ToString();
                var ChapterID = tb.Rows[0]["ChapterID"].ToString();
                var SectionID = tb.Rows[0]["SectionID"].ToString();
                var ID = tb.Rows[0]["ID"].ToString();
                string w = " CurriculumID=" + CurriculumID;
                string sql = "  delete from bsi_ResourceRecord where CurriculumID=" + CurriculumID + " and ChapterID=" + ChapterID + " and SectionID=" + SectionID + " and ResourcesID=" + ID + " and UserId=" + UserId;
                sql += " insert into bsi_ResourceRecord(CurriculumID,ChapterID,SectionID,ResourcesID,UserId) values (" + CurriculumID + "," + ChapterID + "," + SectionID + "," + ID + "," + UserId + ")";
                Base_Common().ExecuteNonQuery(sql);
            }
            ViewData["tb"] = tb;
            return View();
        }
        public string LogYuangong() {

            var TeacherId = SqlHelper.ExecuteSclar("select TeacherId from dbo.tb_Class where C_ID = " + ClassId);

            DataTable mdt = Base_Common().GetListDatatable(" top 4 ID ", "bsi_Curriculum", " and State=1 and (AddUserId=" + TeacherId + " or AddUserId=1) order by Sort asc");
            return JsonConvert.SerializeObject(mdt);
        }
    }
}
