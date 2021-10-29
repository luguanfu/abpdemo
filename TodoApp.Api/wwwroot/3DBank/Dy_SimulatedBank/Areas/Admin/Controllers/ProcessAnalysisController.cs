using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dy_SimulatedBank_DBUtility.Sql;
using System.Data;
using Newtonsoft.Json;
using Dy_SimulatedBank.Models;
using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank_Bll;
using System.Data.SqlClient;
using System.Text;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class ProcessAnalysisController : BaseController
    {
        //
        // GET: /Admin/ProcessAnalysis/
        CommonBll commonbll = new CommonBll();
        public ActionResult Index()
        {
            return View();
        }

        public string GetList()
        {
            DataTable dt = commonbll.GetListDatatable("*", "bsi_ProcessAnalysis", " order by Id asc");

            return JsonConvert.SerializeObject(dt);
        }

    }
}
