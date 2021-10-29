using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank_DBUtility.Sql;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class ExamSettingController : BaseController
    {
        //
        // GET: /Admin/ExamSetting/

        public ActionResult Index()
        {
            var dtAssessment = SqlHelper.ExecuteDataTable("select * from bsi_PracticeAssessment");
            ViewData["Assessment"] = dtAssessment;
            return View();
        }

        public string GetList()
        {
            var dtList = SqlHelper.ExecuteDataTable("select * from ExamSetting");

            return JsonConvert.SerializeObject(dtList);
        }

        public string GetOnly()
        {
            var id = Request["ID"] ?? "0";
            var dtOnly = SqlHelper.ExecuteDataTable("select * from ExamSetting where ID=" + id);

            return JsonConvert.SerializeObject(dtOnly);
        }

        public string update()
        {
            var id = Request["ID"] ?? "0";
            var ExamIDS = Request["ExamIDS"] ?? "";
            var dtOnly = SqlHelper.ExecuteNonQuery("update ExamSetting set ExamIDS='" + ExamIDS + "',UpdateTime=getdate(),Updater='" + UserNo + "' where ID=" + id);
            return dtOnly.ToString();
        }

    }
}
