using Dy_SimulatedBank_Bll;
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
    public class AreaIntroduceController : Controller
    {
        CommonBll commBll = new CommonBll();

        //
        // GET: /Admin/AreaIntroduce/

        public ActionResult Index()
        {
            return View();
        }

        public string GetList()
        {
            var dt = commBll.GetListDatatable("*", "AreaIntroduce", "");
            return JsonConvert.SerializeObject(dt);
        }


        /// <summary>
        /// 获取单行信息
        /// </summary>
        /// <returns></returns>
        public string GetListById()
        {
            DataTable dt = commBll.GetListDatatable("*", "AreaIntroduce", " and id=" + Request["ID"]);
            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 修改
        /// </summary>
        /// <returns></returns>
        public string Update()
        {
            string table = "AreaIntroduce"; //表名
            string Set = " describe=@describe ";

            var describe = Request["txtdescribe"];//大厅功能区介绍
            var id = Convert.ToInt32(Request["ID"]);

            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@ID",id),
                new SqlParameter("@describe",describe),
            };
            var resultcount = commBll.UpdateInfo(table, Set, " and id=@id", pars);
            if (resultcount == 1)
            {
                return "1";
            }
            else
            {
                return "99";
            }
        }

    }
}
