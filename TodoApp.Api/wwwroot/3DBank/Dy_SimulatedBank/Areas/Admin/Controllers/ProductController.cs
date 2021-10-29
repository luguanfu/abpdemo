using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank.Models;
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
    public class ProductController : BaseController
    {
        CommonBll commBll = new CommonBll();

        //
        // GET: /Admin/Product/

        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 教师列表
        /// </summary>
        /// <returns></returns>
        public string GetList()
        {
            string Keyword = Request["Keyword"];
            string wheres = " and 1=1";

            if (UserType == 2)//如果用户类型是教师
            {
                wheres += " and (AddUserId=" + UserId + " OR AddUserId=1)";
            }

            if (!string.IsNullOrEmpty(Keyword))
            {
                wheres += " and (ProductName like '%" + Keyword + "%' or TaskDescribe like '%" + Keyword + "%')";
            }
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " id "; //排序必须填写
            m.strFld = @" * ";
            m.tab = "bsi_ProductSettings";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }

        /// <summary>
        /// 新增
        /// </summary>
        /// <returns></returns>
        public string Add()
        {
            string table = "bsi_ProductSettings"; //表名
            string list = " ProductName, TaskDescribe, AddUserId, AddTime,AllType";//列
            string vlaue = "@ProductName, @TaskDescribe, @AddUserId, @AddTime,@AllType";

            var txtProductName = Request["txtAddProductName"];
            var txtTaskDescribe = Request["seladdTaskDescribe"];

            //校验账号是否已存在
            var count = commBll.GetRecordCount("bsi_ProductSettings", " and ProductName='" + txtProductName + "'");
            if (count > 0)
            {
                return "77";

            }

            //新增
            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@ProductName",txtProductName),
                new SqlParameter("@TaskDescribe",txtTaskDescribe),
                new SqlParameter("@AddUserId",UserId),
                new SqlParameter("@AddTime",DateTime.Now),
                new SqlParameter("@AllType",UserType)
            };
            var resultcount = commBll.Add(table, list, vlaue, pars);
            if (resultcount == 1)
            {
                return "1";
            }
            else
            {
                return "99";
            }
        }

        /// <summary>
        /// 修改
        /// </summary>
        /// <returns></returns>
        public string Update()
        {
            string table = "bsi_ProductSettings"; //表名
            string Set = "ProductName=@ProductName, TaskDescribe=@TaskDescribe";

            var txtProductName = Request["txtAddProductName"];
            var txtTaskDescribe = Request["seladdTaskDescribe"];

            var id = Convert.ToInt32(Request["id"]);

            //校验账号是否已存在
            var count = commBll.GetRecordCount("bsi_ProductSettings", " and ProductName='" + txtProductName + "' and id!=" + id);
            if (count > 0)
            {
                return "77";

            }

            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@ProductName",txtProductName),
                new SqlParameter("@TaskDescribe",txtTaskDescribe),
                new SqlParameter("@id",id)
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


        /// <summary>
        /// 删除
        /// </summary>
        /// <returns></returns>
        public string Del()
        {
            string Ids = Request["Ids"];
            try
            {
                string text = "delete from bsi_ProductSettings where id in(" + Ids + ")";
                commBll.ExecuteNonQuery(text);
                return "1";
            }
            catch
            {
                return "99";
            }


        }

        /// <summary>
        /// 获取单行信息
        /// </summary>
        /// <returns></returns>
        public string GetListById()
        {
            DataTable dt = commBll.GetListDatatable("*", "bsi_ProductSettings", " and id=" + Request["ID"]);
            return JsonConvert.SerializeObject(dt);
        }

    }
}
