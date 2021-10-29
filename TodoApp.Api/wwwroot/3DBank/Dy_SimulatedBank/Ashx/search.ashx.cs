using Dy_SimulatedBank_Bll;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace IndustrySimulation.ashx
{
    /// <summary>
    /// search 的摘要说明
    /// </summary>
    public class search : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {

        CommonBll commonbll = new CommonBll();
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            //if (context.Session["UserInfo"] == null || context.Session["Type"] == null)
            //{
            //    //context.Response.Redirect("/Login/Lout?LoutId=1");
            //    //context.Response.End();
            //    context.Response.Write(JsonConvert.SerializeObject("true"));
            //    context.Response.End();
            //}
            var Keyword = context.Request["Keyword"];
            var sysname = context.Request["sysname"];
            //sysname = "核心系统";
            //var ParentId = context.Request["ParentId"].ToString();


            string Columm = @"a.*,b.RemarkName,b.busiType,b.sysname,b.KeyWord,b.showDefaultC ywCode,b.FromDefaultC FromTMNO ";
            string table = @"bsi_TM a left join zhyw_Remarks b on(a.TMNO=b.MenuId)";
            string where = " and a.TMNO like '200%'";
            if (!string.IsNullOrEmpty(Keyword))
            {
                where += " and (b.RemarkName like '%" + Keyword + "%' or b.showDefaultC like '%" + Keyword + "%') and b.sysname='" + sysname + "'";
                where += " and a.ParentId<>0 ";


                DataTable dt = commonbll.GetListDatatable(Columm, table, where + " order by b.isUseVoucherNo asc,b.RemarkId desc ");
                context.Response.Write(JsonConvert.SerializeObject(dt));
            }
            else
            {
                where += "and (a.TMNO like '200000%' or a.TMNO in ( select a1.ParentId from bsi_TM a1 join zhyw_Remarks b1 on(a1.TMNO=b1.MenuId) where b1.sysname like '%" + sysname + "%'))";

                DataTable dt = commonbll.GetListDatatable(Columm, table, where + " order by b.isUseVoucherNo asc,b.RemarkId desc ");
                var result = (from DataRow dr in dt.Rows
                              select new
                              {
                                  FromTMNO = dr["FromTMNO"],
                                  RemarkName = dr["RemarkName"],
                                  TMName = dr["TMName"],
                                  TMNO = dr["TMNO"],
                                  ywCode = dr["ywCode"],
                                  Icon = dr["Icon"],
                                  Children = (from DataRow row in GetChildrens(dr["TMNO"].ToString(), sysname).Rows
                                              select new
                                              {
                                                  FromTMNO = row["FromTMNO"],
                                                  RemarkName = row["RemarkName"],
                                                  TMName = row["TMName"],
                                                  TMNO = row["TMNO"],
                                                  ywCode = row["ywCode"],
                                                  Icon = row["Icon"],
                                              }).ToList()
                              }).ToList();

                context.Response.Write(JsonConvert.SerializeObject(result));
            }
        }

        private DataTable GetChildrens(string parentId, string sysname)
        {
            string Columm = @"a.*,b.RemarkName,b.busiType,b.sysname,b.KeyWord,b.showDefaultC ywCode,b.FromDefaultC FromTMNO ";
            string table = @"bsi_TM a left join zhyw_Remarks b on(a.TMNO=b.MenuId)";
            string where = " and a.TMNO like '200%'";
            if (!string.IsNullOrEmpty(parentId))
            {
                where += " and b.RemarkId is not null ";
                if (!string.IsNullOrEmpty(parentId))
                {
                    where += " and b.sysname like '%" + sysname + "%'";
                }
                where += " and a.ParentId=" + parentId;
            }

            return commonbll.GetListDatatable(Columm, table, where + " order by b.isUseVoucherNo asc,b.RemarkId desc ");
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}