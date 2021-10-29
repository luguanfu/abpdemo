using Dy_SimulatedBank.App_Start;
using Dy_SimulatedBank_DBUtility.Sql;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Controllers
{
    [SystemLoginVerification]
    public class FormListController : BaseController
    {
        //
        // GET: /FormList/

        public ActionResult Index()
        {
            return View();
        }


        /// <summary>
        /// 判断业务是设置授权
        /// </summary>
        /// <returns></returns>
        public int CheckEmpove()
        {
            int state = 0;
            string TMNO = Request["TMNO"];
            string sql = " select * from  dal_Empowe where TMNO= " + TMNO;
            //var selectResult = SqlHelper.ExecuteSclar(sql);
            DataTable selectResult = SqlHelper.ExecuteDataTable(sql);
            if (selectResult.Rows.Count > 0)
            {
                string EValue = selectResult.Rows[0]["EValue"].ToString();
                if (string.IsNullOrEmpty(EValue))
                {
                    state = 0;
                }
                else
                {
                    state = 1;
                }

            }
            return state;
        }


        public string GetkEmpoveList()
        {
            string TMNO = Request["TMNO"];
            string sql = " select * from  dal_Empowe where TMNO= " + TMNO;
            DataTable dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);

        }

        #region 打印页面
        public ActionResult Print()
        {
            return View();
        }
        #endregion

        #region 内部授权页面
        public ActionResult auth()
        {
            return View();
        }

        #endregion


        #region 复核页面
        public ActionResult review()
        {
            return View();
        }
        #endregion
        #region 环节10柜员填单 

        public ActionResult Form_130101()
        {
            return View();
        }


        #endregion


        #region 环节12 原bsi银行 122个表单
        public ActionResult Form_110101()
        {
            return View();
        }
        public ActionResult Form_100104()
        {
            return View();
        }
        public ActionResult Form_091104()
        {
            return View();
        }
        public ActionResult Form_091101()
        {
            return View();
        }
        public ActionResult Form_091107()
        {
            return View();
        }
        public ActionResult Form_091105()
        {
            return View();
        }
        public ActionResult Form_091012()
        {
            return View();
        }
        public ActionResult Form_100101()
        {
            return View();
        }
        public ActionResult Form_091106()
        {
            return View();
        }
        public ActionResult Form_100102()
        {
            return View();
        }
        public ActionResult Form_100103()
        {
            return View();
        }
        public ActionResult Form_090204()
        {
            return View();
        }
        public ActionResult Form_090203()
        {
            return View();
        }
        public ActionResult Form_090202()
        {
            return View();
        }
        public ActionResult Form_090206()
        {
            return View();
        }
        public ActionResult Form_090201()
        {
            return View();
        }
        public ActionResult Form_090207()
        {
            return View();
        }
        public ActionResult Form_081201()
        {
            return View();
        }
        public ActionResult Form_091010()
        {
            return View();
        }
        public ActionResult Form_091001()
        {
            return View();
        }
        public ActionResult Form_091004()
        {
            return View();
        }
        public ActionResult Form_091006()
        {
            return View();
        }
        public ActionResult Form_091005()
        {
            return View();
        }
        public ActionResult Form_091003()
        {
            return View();
        }
        public ActionResult Form_091007()
        {
            return View();
        }
        public ActionResult Form_091008()
        {
            return View();
        }
        public ActionResult Form_091009()
        {
            return View();
        }
        public ActionResult Form_080701()
        {
            return View();
        }
        public ActionResult Form_080702()
        {
            var defaultValue = SqlHelper.ExecuteDataTable("select DefaultValue from dal_DefaultValue where TMNO='080701' and TaskId=" + Request["TaskId"].ToString());
            if (defaultValue != null && defaultValue.Rows.Count>0 && !string.IsNullOrEmpty(defaultValue.Rows[0]["DefaultValue"].ToString()))
            {
                foreach (string s in defaultValue.Rows[0]["DefaultValue"].ToString().Split(';'))
                {
                    if(s.IndexOf("txt_kggy")>-1)
                    {
                        ViewData["userid"] = s.Split('#')[1];
                    }
                    if(s.IndexOf("txt_gymc") > -1)
                    {
                        ViewData["userName"]=s.Split('#')[1];
                    }
                }
            }
            return View();
        }
        public ActionResult Form_080204()
        {
            return View();
        }
        public ActionResult Form_080205()
        {
            return View();
        }
        public ActionResult Form_080703()
        {
            return View();
        }
        public ActionResult Form_080704()
        {
            return View();
        }
        public ActionResult Form_080705()
        {
            return View();
        }
        public ActionResult Form_080706()
        {
            return View();
        }
        public ActionResult Form_081001()
        {
            return View();
        }
        public ActionResult Form_080708()
        {
            return View();
        }
        public ActionResult Form_081004()
        {
            return View();
        }
        public ActionResult Form_080803()
        {
            return View();
        }
        public ActionResult Form_081003()
        {
            return View();
        }
        public ActionResult Form_080707()
        {
            return View();
        }
        public ActionResult Form_081005()
        {
            return View();
        }
        public ActionResult Form_081010()
        {
            return View();
        }
        public ActionResult Form_080201()
        {
            return View();
        }
        public ActionResult Form_062301()
        {
            return View();
        }
        public ActionResult Form_063202()
        {
            return View();
        }
        public ActionResult Form_063201()
        {
            return View();
        }
        public ActionResult Form_065501()
        {
            return View();
        }
        public ActionResult Form_065401()
        {
            return View();
        }
        public ActionResult Form_062004()
        {
            return View();
        }
        public ActionResult Form_062804()
        {
            return View();
        }
        public ActionResult Form_063101()
        {
            return View();
        }
        public ActionResult Form_062801()
        {
            return View();
        }
        public ActionResult Form_063901()
        {
            return View();
        }
        public ActionResult Form_062005()
        {
            return View();
        }
        public ActionResult Form_080102()
        {
            return View();
        }
        public ActionResult Form_063902()
        {
            return View();
        }
        public ActionResult Form_063301()
        {
            return View();
        }
        public ActionResult Form_080101()
        {
            return View();
        }
        public ActionResult Form_062003()
        {
            return View();
        }
        public ActionResult Form_050511()
        {
            return View();
        }
        public ActionResult Form_050504()
        {
            return View();
        }
        public ActionResult Form_060201()
        {
            return View();
        }
        public ActionResult Form_060202()
        {
            return View();
        }
        public ActionResult Form_050510()
        {
            return View();
        }
        public ActionResult Form_060701()
        {
            return View();
        }
        public ActionResult Form_060302()
        {
            return View();
        }
        public ActionResult Form_060505()
        {
            return View();
        }
        public ActionResult Form_060702()
        {
            return View();
        }
        public ActionResult Form_060704()
        {
            return View();
        }
        public ActionResult Form_060703()
        {
            return View();
        }
        public ActionResult Form_062001()
        {
            return View();
        }
        public ActionResult Form_060707()
        {
            return View();
        }
        public ActionResult Form_060501()
        {
            return View();
        }
        public ActionResult Form_062002()
        {
            return View();
        }
        public ActionResult Form_030104()
        {
            return View();
        }
        public ActionResult Form_030107()
        {
            return View();
        }
        public ActionResult Form_030602()
        {
            return View();
        }
        public ActionResult Form_030601()
        {
            return View();
        }
        public ActionResult Form_030604()
        {
            return View();
        }
        public ActionResult Form_030603()
        {
            return View();
        }
        public ActionResult Form_030605()
        {
            return View();
        }
        public ActionResult Form_030608()
        {
            return View();
        }
        public ActionResult Form_030606()
        {
            return View();
        }
        public ActionResult Form_030607()
        {
            return View();
        }
        public ActionResult Form_050503()
        {
            return View();
        }
        public ActionResult Form_030609()
        {
            return View();
        }
        public ActionResult Form_030610()
        {
            return View();
        }
        public ActionResult Form_030101()
        {
            return View();
        }
        public ActionResult Form_030611()
        {
            return View();
        }
        public ActionResult Form_030612()
        {
            return View();
        }
        public ActionResult Form_020704()
        {
            return View();
        }
        public ActionResult Form_010702()
        {
            return View();
        }
        public ActionResult Form_010601()
        {
            return View();
        }
        public ActionResult Form_010401()
        {
            return View();
        }
        public ActionResult Form_010901()
        {
            return View();
        }
        public ActionResult Form_010402()
        {
            return View();
        }
        public ActionResult Form_010501()
        {
            return View();
        }
        public ActionResult Form_010902()
        {
            return View();
        }
        public ActionResult Form_010904()
        {
            return View();
        }
        public ActionResult Form_010905()
        {
            return View();
        }
        public ActionResult Form_010906()
        {
            return View();
        }
        public ActionResult Form_010907()
        {
            return View();
        }
        public ActionResult Form_020501()
        {
            return View();
        }
        public ActionResult Form_010910()
        {
            return View();
        }
        public ActionResult Form_020502()
        {
            return View();
        }
        public ActionResult Form_010903()
        {
            return View();
        }
        public ActionResult Form_010303()
        {
            return View();
        }
        public ActionResult Form_010001()
        {
            return View();
        }
        public ActionResult Form_010108()
        {
            return View();
        }
        public ActionResult Form_010104()
        {
            return View();
        }
        public ActionResult Form_010110()
        {
            return View();
        }
        public ActionResult Form_010301()
        {
            return View();
        }
        public ActionResult Form_010302()
        {
            return View();
        }
        public ActionResult Form_010114()
        {
            return View();
        }
        public ActionResult Form_010107()
        {
            return View();
        }
        public ActionResult Form_010103()
        {
            return View();
        }
        public ActionResult Form_010109()
        {
            return View();
        }
        public ActionResult Form_010105()
        {
            return View();
        }
        public ActionResult Form_010106()
        {
            return View();
        }
        public ActionResult Form_010102()
        {
            return View();
        }
        public ActionResult Form_010101()
        {
            return View();
        }

        #endregion

        public ActionResult ToForm()
        {
            string toFormId = Request["FromTMNO"];
            string formId = Request["FormId"];
            if (formId.StartsWith("200"))
            {
                ViewBag.TMName = SqlHelper.ExecuteSclar("select TMName from bsi_TM where TMNO='" + formId + "'");
                ViewBag.FormId = formId;
                ViewBag.ToFromId = toFormId;

                return View("ToForm");
            }
            return View("Form_" + formId);
        }
    }
}
