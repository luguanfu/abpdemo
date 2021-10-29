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
using System.Collections;

namespace Dy_SimulatedBank.Controllers
{
    public class HB_CompetitionController : BaseController
    {
        //
        // GET: /HB_Competition/练习列表
        CommonBll commonbll = new CommonBll();

        public ActionResult Index()
        {
            return View();
        }


        /// <summary>
        /// 列表
        /// </summary>
        /// <returns></returns>
        public string GetList()
        {
            string wheres = " and (E_TeamId like '%," + ClassId + ",%') and E_IsState=1 and E_Type=2 and E_EndTime>GETDATE()";

            //  wheres += " and '" + DateTime.Now+ "'>E_StartTime and  '" + DateTime.Now + "'<E_EndTime";
            //竞赛名称
            if (Request["E_Name"] != null && Request["E_Name"].ToString().Length > 0)
            {
                wheres += " and E_Name like '%" + Request["E_Name"] + "%'";
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = "[E_EndTime] desc"; //排序必须填写
            m.strFld = @" a.*";
            m.tab = "tb_HB_Examination a";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));

        }


        //查看是否有记录

        public string SeCount()
        {

            var count = commonbll.GetRecordCount("tb_ExaminationResult", " and ER_EId=" + Request["Eid"] + " and ER_MId=" + UserId);

            if (count > 0)
            {
                return "1";
            }
            return "99";

        }

        /// <summary>
        /// 列表进入做题页 逻辑处理
        /// </summary>
        /// <returns></returns>
        public string CheckGointo()
        {

            try
            {
                var Eid = Request["Eid"];
                var Pid = Request["Pid"];
                var Type = Request["Type"];
                //考试时间未到
                var StartTime = commonbll.GetListSclar("E_StartTime", " tb_HB_Examination", " and EID=" + Eid);
                if (Convert.ToDateTime(StartTime) > DateTime.Now)
                {
                    return "77";
                }
              
                var resultcount = commonbll.GetRecordCount("tb_CountDown", " and CD_Custom3=" + Type + " and CD_EId='" + Eid + "' and CD_PId='" + Pid + "' and CD_MId='" + UserId + "'");
                if (resultcount == 0)
                {
                    SqlHelper.ExecuteNonQuery("insert into tb_CountDown(CD_EId, CD_PId, CD_MId, CD_Time,CD_Custom3) values('" + Eid + "','" + Pid + "','" + UserId + "','" + DateTime.Now + "'," + Type + ")");

                }

                return "1";
            }
            catch
            {
                return "99";
            }
        }
    }
}
