using Dy_SimulatedBank_Bll;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Controllers
{
    public class HallProcessController : BaseController
    {

        CommonBll commBll = new CommonBll();

        //
        // GET: /HallProcess/

        public ActionResult Index()
        {

            return View();
        }

        public string GetBusinessByType()
        {
            var typeName = Request["TypeName"];
            string strWhere = " and 1=1";
            if (!string.IsNullOrEmpty(typeName))
            {
                strWhere = " and TypeName='" + typeName + "'";
            }
            DataTable dt = commBll.GetListDatatable("*", "bsi_TaskBusiness", strWhere);
            return JsonConvert.SerializeObject(dt);
        }


        public ActionResult FillForm()
        {
            return View();
        }

    }
}
