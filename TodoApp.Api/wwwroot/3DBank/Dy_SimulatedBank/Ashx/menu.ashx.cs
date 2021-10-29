using Dy_SimulatedBank_Bll;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace Dy_SimulatedBank.Ashx
{
    /// <summary>
    /// menu 的摘要说明
    /// </summary>
    public class menu : IHttpHandler
    {
        CommonBll commonbll = new CommonBll();

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string title = context.Request["title"];
            string isTop = context.Request["isTop"];
            string ywCode = title == "核心系统" ? "2000" : "2001";

            string strWhere = " and ywCode='" + ywCode + "' and len(Icon)>0 ";
            if (isTop == "true")
            {
                strWhere += " and RemarkId in (205,195,201,202,208)";
            }
            else
            {
                strWhere += " and RemarkId not in (205,195,201,202,208)";
            }
            
            strWhere += " order by isUseVoucherNo asc,RemarkId desc ";

            DataTable dt = commonbll.GetListDatatable("*", "zhyw_Remarks", strWhere);

            context.Response.Write(JsonConvert.SerializeObject(dt));
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