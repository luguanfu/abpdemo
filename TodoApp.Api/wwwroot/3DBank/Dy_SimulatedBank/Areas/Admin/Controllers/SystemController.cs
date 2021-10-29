using Newtonsoft.Json;
using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank.Models;
using Dy_SimulatedBank_Bll;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class SystemController : BaseController
    {
        //
        // GET: /Admin/System/
        CommonBll commonbll = new CommonBll();


        /// <summary>
        /// 学生评级
        /// </summary>
        /// <returns></returns>
        public ActionResult Rating()
        {
            ViewData["UserId"] = Session["UserId"];
            return View();
        }

        /// <summary>
        /// 获取评级信息
        /// </summary>
        /// <returns></returns>
        public string GetRating()
        {
            string SelectName = Request["SelectName"].ToString();
            string where = " ";
            if (SelectName != ""&&SelectName!=null)
            {
                where = " and RankName like '%" + SelectName + "%'";

            }
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " SerialNumber "; //排序必须填写
            m.strFld = @" *";
            m.tab = @"bsi_StudentRating ";
            m.strWhere = where;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }

        /// <summary>
        /// 移动排序
        /// </summary>
        /// <returns></returns>
        public string MoveSort()
        {
            string id = Request["id"];
            string type = Request["type"];
            string SerialNumber = Request["SerialNumber"];
            string where = " ";
            if (type == "up")
            {
                where = where + " and a.SerialNumber<" + SerialNumber;
                where = where + " order by a.SerialNumber desc";
            }
            else
            {
                where = where + " and a.SerialNumber>" + SerialNumber;
                where = where + " order by a.SerialNumber";
            }

            var rdata = commonbll.GetListDatatable("a.*", "bsi_StudentRating a", where);
            if (rdata.Rows.Count <= 0)
            {
                return "88";
            }
            string moveid = rdata.Rows[0]["id"].ToString();
            string moveSerialNumber = rdata.Rows[0]["SerialNumber"].ToString();
            commonbll.UpdateInfo("bsi_StudentRating", " SerialNumber=" + moveSerialNumber, " and id=" + id);
            var rcount = commonbll.UpdateInfo("bsi_StudentRating", " SerialNumber=" + SerialNumber, " and id=" + moveid);
            if (rcount == 1)
            {
                return "1";
            }
            return "99";
        }

        /// <summary>
        /// 删除评级
        /// </summary>
        /// <returns></returns>
        public string Delrating()
        {
            string id = Request["ModeId"];
            var rcount = commonbll.DeleteInfo("bsi_StudentRating", " and ID in(" + id + ")");
            if (rcount > 0)
            {
                return "1";
            }
            return "99";
        }

        /// <summary>
        /// 添加评级
        /// </summary>
        /// <returns></returns>
        public string Addrating()
        {
            string name = SQLSafe(Request["EditQuestonBQName"]);
            var rdata = commonbll.GetListDatatable("*", "bsi_StudentRating", " and RankName='" + name + "'");
            if (rdata.Rows.Count > 0)
            { return "88"; }
            var rdatas = commonbll.GetListDatatable("max(SerialNumber) as SerialNumber", "bsi_StudentRating", " ");
            if (rdatas.Rows.Count < 1)
            { return "99"; }
            var ms = rdatas.Rows[0]["SerialNumber"] ?? 0;
            if (ms == DBNull.Value)
            {
                ms = 0;
            }
            string fileds = "RankName,SerialNumber,AddUserId,AddTime";
            string values = "@RankName,@SerialNumber,@AddUserId,@AddTime";
            SqlParameter[] pars = new SqlParameter[]
              {
                   new SqlParameter("@RankName",name),
                   new SqlParameter("@SerialNumber",Convert.ToInt32(ms)+1),
                   new SqlParameter("@AddUserId",UserId),
                   new SqlParameter("@AddTime",DateTime.Now),
              };
            var rcount = commonbll.Add("bsi_StudentRating", fileds, values, pars);
            if (rcount == 1)
            {
                return "1";
            }
            else
            {
                return "99";
            }
        }

        /// <summary>
        /// 编辑评级
        /// </summary>
        /// <returns></returns>
        public string updaterating()
        {
            string name = SQLSafe(Request["EditQuestonBQName"]);
            string id = Request["ID"];

            var rdata = commonbll.GetListDatatable("*", "bsi_StudentRating", " and ID!=" + id + " and RankName='" + name + "'");
            if (rdata.Rows.Count > 0)
            { return "88"; }
            var rcount = commonbll.UpdateInfo("bsi_StudentRating", " RankName='" + name + "'", " and ID=" + id + "");
            if (rcount == 1)
            {
                return "1";
            }
            else
            {
                return "99";
            }
        }

        /// <summary>
        /// 获得编辑的评级名称
        /// </summary>
        /// <returns></returns>
        public string lookids()
        {
            string id = Request["ID"];
            DataTable dt = commonbll.GetListDatatable(" * ", " bsi_StudentRating ", " and ID=" + id + "");
            return JsonConvert.SerializeObject(dt);
        }

    }
}
