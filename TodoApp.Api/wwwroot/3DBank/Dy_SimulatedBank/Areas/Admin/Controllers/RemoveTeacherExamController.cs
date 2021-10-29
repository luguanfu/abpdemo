using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank_Bll;
using Dy_SimulatedBank_DBUtility.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class RemoveTeacherExamController : BaseController
    {
        CommonBll commBll = new CommonBll();
        public ActionResult Index()
        {
            DataTable dt = commBll.GetListDatatable("*", "tb_Teacher", "");
            return View(dt);
        }


        /// <summary>
        /// 教师试卷转移
        /// </summary>
        /// <param name="OLdTeacherId">源教师</param>
        /// <param name="NewTeacherId">接收教师</param>
        /// <returns></returns>
        public string RemoveTeacherExam()
        {
            try
            {
                string OLdTeacherId = Request["OLdTeacherId"];
                string NewTeacherId = Request["NewTeacherId"];
                //转入教师的账号
                string NewTeacherName = commBll.GetListSclar("LoginNo", "tb_User", " and U_ID=" + NewTeacherId).Trim();

                //先查询出 之前的有的
                string sqlHBExaminationPapers = "";
                DataTable dt = commBll.GetListDatatable("PId,P_Name", "tb_HB_Paper", " and  P_State=1 and P_AddOperator=" + OLdTeacherId);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    //先校验的 新的账号是否已经存在该试卷
                    string sqlHBPaper1 = "insert into tb_HB_Paper select [P_Number],[P_Name],[P_IsOrder],[P_State],2," + NewTeacherId + "," + NewTeacherId + ",[P_AddTime],[P_Custom1],'" + NewTeacherName + "',[P_Custom3] from tb_HB_Paper where PId=" + dt.Rows[i]["PId"];
                    var newHBPaperId = SqlHelper.ExecuteNonQueryidentity(sqlHBPaper1);

                    DataTable dt2 = commBll.GetListDatatable("EPId", "tb_HB_ExaminationPapers", " and EP_PId=" + dt.Rows[i]["PId"]);
                    for (int j = 0; j < dt2.Rows.Count; j++)
                    {
                        sqlHBExaminationPapers += " insert into tb_HB_ExaminationPapers select " + newHBPaperId + ",EP_QBId,EP_Score," + NewTeacherId + "," + NewTeacherId + ",getdate(),[EP_Custom1],'" + NewTeacherName + "',[EP_Custom3] from tb_HB_ExaminationPapers where EPId=" + dt2.Rows[j]["EPId"];
                    }
                }
                if (sqlHBExaminationPapers.Length > 0)
                {
                    SqlHelper.ExecuteNonQuery(sqlHBExaminationPapers);
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
