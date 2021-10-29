using Newtonsoft.Json;
using Dy_SimulatedBank_Bll;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Controllers
{
    public class StuRecentlearningController : BaseController
    {
        //
        // GET: /StuRecentlearning/
        CommonBll commonbll = new CommonBll();

        public ActionResult Index()
        {
            return View();
        }
        public string GetList()
        {
            DataTable dt = commonbll.GetListDatatable(" top 8 b.CurriculumID as CurriculumID,d.Cover as Cover,d.CurriculumName as CurriculumName,c.ResourcesName as CResourcesName,b.SectionName as SectionName,a.ResourcesName as ResourcesName,d.State as Cstate", @"bsi_Resources a
  left join bsi_Section b on a.SectionID=b.ID
  left join bsi_Chapter c on b.ChapterID=c.ID
  left join bsi_Curriculum d on c.CurriculumID=d.ID
  left join bsi_CourseLearningRecords e on e.ResourcesID=a.ID", " and e.UserId=" + UserId + " and e.[Types]=1 order by e.AddTime desc");
            return JsonConvert.SerializeObject(dt);
        }
    }
}
