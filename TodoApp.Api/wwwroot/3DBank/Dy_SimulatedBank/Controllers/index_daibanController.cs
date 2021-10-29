using Dy_SimulatedBank_Bll;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Controllers
{
    public class index_daibanController : BaseController
    {
        //
        // GET: /MainBacklog/
        CommonBll commonbll = new CommonBll();

        public ActionResult Index()
        {
            //--练习模式 --个人
            ViewBag.TYJNSX = commonbll.GetListSclar("COUNT(1) as num ", "bsi_PracticeAssessment a INNER JOIN bsi_PracticeClass b ON a.ID = b.PracticeId", " and a.PracticeState=1 AND a.Type_All=2 AND PracticeType=1 AND b.ClassId=" + ClassId);
            //-练习模式 --团队
            ViewBag.AMAZON = commonbll.GetListSclar("COUNT(1) as num ", "bsi_PracticeAssessment a INNER JOIN bsi_PracticeClass b ON a.ID = b.PracticeId", " and a.PracticeState=1 AND a.Type_All=2 AND PracticeType=2 AND b.ClassId=" + ClassId);
            //--比赛模式 --个人
            ViewBag.ZSKH = commonbll.GetListSclar("COUNT(1) as num", "bsi_PracticeAssessment a INNER JOIN bsi_PracticeClass b ON a.ID = b.PracticeId", " and PracticeState=1 AND Type_All=1 AND a.PracticeType=1 AND b.ClassId=" + ClassId);
            //--比赛模式 --团队
            ViewBag.JNKH = commonbll.GetListSclar("COUNT(1) as num", "bsi_PracticeAssessment a INNER JOIN bsi_PracticeClass b ON a.ID = b.PracticeId", " and PracticeState=2 AND Type_All=1 AND a.PracticeType=2 AND b.ClassId=" + ClassId);
            //知识考核
            //ViewBag.CONTEST = commonbll.GetListSclar("COUNT(1) as num", "tb_contest_manage", " and start_time<GETDATE() and end_time>GETDATE() and state=1 and is_delete=1");
            return View();
        }
        /// <summary>
        /// 获取所有任务个数
        /// </summary>
        /// <returns></returns>
        public string GetTaskNum()
        {
            string TYJNSX = commonbll.GetListSclar("COUNT(1) as num ", "tb_HB_SkillExamination_Result a left join tb_HB_SkillExamination b on a.sid=b.id left join tb_HB_QuestionBQ c on b.q_id = c.ID", " and is_submit=2 and b.type=1 and a.s_type=1 and a.is_delete=1 and a.adduserid=" + UserId);
            string AMAZON = commonbll.GetListSclar("COUNT(1) as num ", "tb_HB_SkillExamination_Result a left join tb_HB_SkillExamination b on a.sid=b.id left join tb_HB_QuestionBQ c on b.q_id = c.ID", " and is_submit=2 and b.type=2 and a.s_type=1 and a.is_delete=1 and a.adduserid=" + UserId);
            string ZSKH = commonbll.GetListSclar("COUNT(1) as num", "tb_HB_Examination a", " and (E_TeamId like '%" + ClassId + "%') and E_IsState=1 and E_Type=1 and ExaminationType =4 and IsDelete=0 and E_StartTime<GETDATE() and E_EndTime>GETDATE()");
            string JNKH = commonbll.GetListSclar("COUNT(1) as num", "tb_HB_Examination a", " and (E_TeamId like '%" + ClassId + "%') and E_IsState=1 and E_Type=1 and ExaminationType =5 and IsDelete=0 and E_StartTime<GETDATE() and E_EndTime>GETDATE()");
            string CONTEST = commonbll.GetListSclar("COUNT(1) as num", "tb_contest_manage", " and start_time<GETDATE() and end_time>GETDATE() and state=1 and is_delete=1");
            int task_num = int.Parse(TYJNSX) + int.Parse(AMAZON) + int.Parse(ZSKH) + int.Parse(JNKH) + int.Parse(CONTEST);
            return task_num.ToString();
        }

    }
}
