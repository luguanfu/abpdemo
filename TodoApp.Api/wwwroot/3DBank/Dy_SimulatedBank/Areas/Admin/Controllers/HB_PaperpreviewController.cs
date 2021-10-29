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
using Aspose.Cells;
using Dy_SimulatedBank.App_Start;
using System.Collections;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class HB_PaperpreviewController : BaseController
    {
        //
        // GET: /Admin/HB_Paperpreview/
        CommonBll commonbll = new CommonBll();
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 视图 加点题
        /// </summary>
        /// <returns></returns>
        public ActionResult AddTIndex()
        {
            var P_Name = commonbll.GetListSclar("P_Name", "tb_HB_Paper", " and PId=" + Request["Pid"]);
            ViewData["PName"] = P_Name;
            return View();
        }

        /// <summary>
        /// 获取试卷信息
        /// </summary>
        /// <returns></returns>
        public string GetPreview()
        {
            DataTable dt = commonbll.GetListDatatable("q.*,EP_Score,P_Name",
                      @"tb_HB_QuestionBank q
                        inner join tb_HB_ExaminationPapers e on e.EP_QBId=q.QuestionBId
                        inner join tb_HB_Paper p on p.PId=e.EP_PId", " and PId=" + Request["PId"] + " order by QB_Type");

            return JsonConvert.SerializeObject(dt);

        }

        /// <summary>
        /// 单个设置分值
        /// </summary>
        /// <returns></returns>
        public string IndividualSetScore()
        {
            try
            {
                var EP_Score = Request["EP_Score"];
                var EP_QBId = Request["EP_QBId"];
                var EP_PId = Request["EP_PId"];
                SqlParameter[] pars = new SqlParameter[] 
                {
                    new SqlParameter("@EP_Score",EP_Score),
                    new SqlParameter("@EP_QBId",EP_QBId),
                    new SqlParameter("@EP_PId",EP_PId),
                    new SqlParameter("@EP_Operator",UserId)
                };
                commonbll.UpdateInfo("tb_HB_ExaminationPapers", " EP_Score=@EP_Score,EP_Operator=@EP_Operator", " and EP_QBId=@EP_QBId and EP_PId=@EP_PId", pars);

                return "1";
            }
            catch
            {
                return "99";

            }
        }

        /// <summary>
        /// 批量设置分值
        /// </summary>
        /// <returns></returns>
        public string SetBatchScores()
        {
            try
            {

                var EP_Score = Request["EP_Score"];
                var Type = Request["Type"];
                var EP_PId = Request["EP_PId"];
                SqlParameter[] pars = new SqlParameter[] 
                {
                    new SqlParameter("@EP_Score",EP_Score),
                    new SqlParameter("@QB_Type",Type),
                    new SqlParameter("@EP_PId",EP_PId),
                    new SqlParameter("@EP_Operator",UserId)
                };
                commonbll.UpdateInfo("tb_HB_ExaminationPapers", " EP_Score=@EP_Score,EP_Operator=@EP_Operator",
                    " and EPId in(select EPId from tb_HB_ExaminationPapers e inner join tb_HB_QuestionBank q on e.EP_QBId=q.QuestionBId where EP_PId=@EP_PId and QB_Type=@QB_Type)", pars);

                return "1";
            }
            catch
            {
                return "99";

            }
        }

        /// <summary>
        /// 移除试题
        /// </summary>
        /// <returns></returns>
        public string delExaminationPapers()
        {
            try
            {
                string EP_QBId = Request["EP_QBId"];
                string EP_PId = Request["EP_PId"];
                //然后 数据存入试卷试题关联表
                commonbll.DeleteInfo("tb_HB_ExaminationPapers", " and EP_PId='" + EP_PId + "' and EP_QBId='" + EP_QBId + "'");
                return "1";
            }
            catch
            {
                return "99";
            }
        }


    }
}
