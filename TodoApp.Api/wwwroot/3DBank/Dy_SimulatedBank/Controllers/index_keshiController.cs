using Dy_SimulatedBank_Bll;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Controllers
{
    public class index_keshiController : BaseController
    {
        CommonBll commBll = new CommonBll();

        //
        // GET: /TeachingHours/

        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 获得课程列表
        /// </summary>
        /// <returns></returns>
        public string GetCurriculum()
        {
            string sql = @"SELECT c.CurriculumName,CourseId,OpeningTime FROM (SELECT CourseId,OpeningTime FROM dbo.bsi_ClassHourM WHERE ClassId=" + ClassId + " AND OpeningTime IS NOT NULL GROUP BY CourseId,OpeningTime )temp" +
" INNER JOIN dbo.bsi_Curriculum c ON c.ID = temp.CourseId ORDER BY OpeningTime DESC ";
            var dt = commBll.GetListDatatable(sql);
            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 获得章列表
        /// </summary>
        /// <returns></returns>
        public string GetChapter()
        {
            var CurriculumID = Request["CurriculumID"];//课程id
            var OpeningTime = Request["OpeningTime"];//开课时间

            string sql = @"select * from (
select distinct ChapterId  from  bsi_ClassHourM  WHERE OpeningTime IS NOT NULL and OpeningTime='" + OpeningTime +
"' ) tmp inner join bsi_Chapter a on a.ID = tmp.ChapterId " +
"where a.CurriculumID = " + CurriculumID;
            var dt = commBll.GetListDatatable(sql);
            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 获得节列表
        /// </summary>
        /// <returns></returns>
        public string GetSection()
        {
            var ChapterID = Request["ChapterID"]; //章id
            var OpeningTime = Request["OpeningTime"];//开课时间

            string sql = @"SELECT * FROM bsi_Section a
INNER JOIN bsi_ClassHourM b ON a.ID = b.SectionId WHERE  a.ChapterID=" + ChapterID + " AND OpeningTime IS NOT NULL and OpeningTime='" + OpeningTime + "' ORDER BY OpeningTime DESC";
            var dt = commBll.GetListDatatable(sql);
            return JsonConvert.SerializeObject(dt);
        }

    }
}
