using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank.Models;
using Dy_SimulatedBank_Bll;
using Dy_SimulatedBank_DBUtility.Sql;
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
    public class Ads_FormController : BaseController
    {
        //
        // GET: /Admin/Ads_Form/ 所有后台设置案例的表单存到这子视图

        public ActionResult Index()
        {
            return View();
        }

        #region 环节12 原bsi银行 122个表单
        public ActionResult Form_010101()
        {
            return View();
        }
        public ActionResult Form_010102()
        {
            return View();
        }
        public ActionResult Form_010001()
        {
            return View();
        }
        public ActionResult Form_010104()
        {
            return View();
        }
        public ActionResult Form_010108()
        {
            return View();
        }
        public ActionResult Form_010103()
        {
            return View();
        }
        public ActionResult Form_010110()
        {
            return View();
        }
        public ActionResult Form_010106()
        {
            return View();
        }
        public ActionResult Form_010105()
        {
            return View();
        }
        public ActionResult Form_010114()
        {
            return View();
        }
        public ActionResult Form_010109()
        {
            return View();
        }
        public ActionResult Form_010303()
        {
            return View();
        }
        public ActionResult Form_010302()
        {
            return View();
        }
        public ActionResult Form_010301()
        {
            return View();
        }
        public ActionResult Form_010107()
        {
            return View();
        }
        public ActionResult Form_010402()
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
        public ActionResult Form_010501()
        {
            return View();
        }
        public ActionResult Form_010901()
        {
            return View();
        }
        public ActionResult Form_010902()
        {
            return View();
        }
        public ActionResult Form_010702()
        {
            return View();
        }
        public ActionResult Form_010903()
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
        public ActionResult Form_020501()
        {
            return View();
        }
        public ActionResult Form_010910()
        {
            return View();
        }
        public ActionResult Form_010907()
        {
            return View();
        }
        public ActionResult Form_020502()
        {
            return View();
        }
        public ActionResult Form_020704()
        {
            return View();
        }
        public ActionResult Form_050503()
        {
            return View();
        }
        public ActionResult Form_030104()
        {
            return View();
        }
        public ActionResult Form_030604()
        {
            return View();
        }
        public ActionResult Form_030601()
        {
            return View();
        }
        public ActionResult Form_030605()
        {
            return View();
        }
        public ActionResult Form_030603()
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
        public ActionResult Form_030606()
        {
            return View();
        }
        public ActionResult Form_030607()
        {
            return View();
        }
        public ActionResult Form_030608()
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
        public ActionResult Form_030611()
        {
            return View();
        }
        public ActionResult Form_030612()
        {
            return View();
        }
        public ActionResult Form_030101()
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
        public ActionResult Form_050510()
        {
            return View();
        }
        public ActionResult Form_060201()
        {
            return View();
        }
        public ActionResult Form_060302()
        {
            return View();
        }
        public ActionResult Form_060202()
        {
            return View();
        }
        public ActionResult Form_060501()
        {
            return View();
        }
        public ActionResult Form_060505()
        {
            return View();
        }
        public ActionResult Form_060701()
        {
            return View();
        }
        public ActionResult Form_060702()
        {
            return View();
        }
        public ActionResult Form_060703()
        {
            return View();
        }
        public ActionResult Form_060704()
        {
            return View();
        }
        public ActionResult Form_060707()
        {
            return View();
        }
        public ActionResult Form_062001()
        {
            return View();
        }
        public ActionResult Form_062003()
        {
            return View();
        }
        public ActionResult Form_062002()
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
        public ActionResult Form_065401()
        {
            return View();
        }
        public ActionResult Form_065501()
        {
            return View();
        }
        public ActionResult Form_062004()
        {
            return View();
        }
        public ActionResult Form_062005()
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
        public ActionResult Form_063301()
        {
            return View();
        }
        public ActionResult Form_063901()
        {
            return View();
        }
        public ActionResult Form_063902()
        {
            return View();
        }
        public ActionResult Form_080102()
        {
            return View();
        }
        public ActionResult Form_080101()
        {
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
        public ActionResult Form_080701()
        {
            return View();
        }
        public ActionResult Form_080702()
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
        public ActionResult Form_080707()
        {
            return View();
        }
        public ActionResult Form_080705()
        {
            return View();
        }
        public ActionResult Form_080708()
        {
            return View();
        }
        public ActionResult Form_080706()
        {
            return View();
        }
        public ActionResult Form_080803()
        {
            return View();
        }
        public ActionResult Form_081001()
        {
            return View();
        }
        public ActionResult Form_081004()
        {
            return View();
        }
        public ActionResult Form_081003()
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
        public ActionResult Form_081201()
        {
            return View();
        }
        public ActionResult Form_090202()
        {
            return View();
        }
        public ActionResult Form_090203()
        {
            return View();
        }
        public ActionResult Form_090201()
        {
            return View();
        }
        public ActionResult Form_090204()
        {
            return View();
        }
        public ActionResult Form_090206()
        {
            return View();
        }
        public ActionResult Form_090207()
        {
            return View();
        }
        public ActionResult Form_091001()
        {
            return View();
        }
        public ActionResult Form_091003()
        {
            return View();
        }
        public ActionResult Form_091006()
        {
            return View();
        }
        public ActionResult Form_091008()
        {
            return View();
        }
        public ActionResult Form_091004()
        {
            return View();
        }
        public ActionResult Form_091009()
        {
            return View();
        }
        public ActionResult Form_091010()
        {
            return View();
        }
        public ActionResult Form_091005()
        {
            return View();
        }
        public ActionResult Form_091007()
        {
            return View();
        }
        public ActionResult Form_091012()
        {
            return View();
        }
        public ActionResult Form_091101()
        {
            return View();
        }
        public ActionResult Form_091105()
        {
            return View();
        }
        public ActionResult Form_091104()
        {
            return View();
        }
        public ActionResult Form_091106()
        {
            return View();
        }
        public ActionResult Form_100101()
        {
            return View();
        }
        public ActionResult Form_091107()
        {
            return View();
        }
        public ActionResult Form_100103()
        {
            return View();
        }
        public ActionResult Form_100104()
        {
            return View();
        }
        public ActionResult Form_100102()
        {
            return View();
        }
        public ActionResult Form_110101()
        {
            return View();
        }
        #endregion



        /// <summary>
        /// ...
        /// </summary>
        /// <returns></returns>
        /// 
         #region 环节5

        public ActionResult Form_110201()
        {
            return View();
        }



        public ActionResult Form_110202()
        {
            return View();
        }
        public ActionResult Form_110203()
        {
            return View();
        }


        public ActionResult Form_110204()
        {
            return View();
        }

        public ActionResult Form_110205()
        {
            return View();
        }


        public ActionResult Form_110206()
        {
            return View();
        }

        public ActionResult Form_110208()
        {
            return View();
        }


        public ActionResult Form_110209()
        {
            return View();
        }


        public ActionResult Form_110210()
        {
            return View();
        }


        public ActionResult Form_110211()
        {
            return View();
        }

        public ActionResult Form_110212()
        {
            return View();
        }

        #endregion



        #region 环节08


        //110301  一般业务申请书 
        public ActionResult Form_110301()
        {
            return View();
        }
        //110302  个人开户与银行签约服务申请书  
        public ActionResult Form_110302()
        {
            return View();
        }
        //110303  特定业务申请书 
        public ActionResult Form_110303()
        {
            return View();
        }
        //110304  转账支票    
        public ActionResult Form_110304()
        {
            return View();
        }
        //110305  进账单     
        public ActionResult Form_110305()
        {
            return View();
        }
        //110306  个人同城转账/异地汇款凭证   
        public ActionResult Form_110306()
        {
            return View();
        }

        //110308  撤销银行结算账户申请书     
        public ActionResult Form_110308()
        {
            return View();
        }
        //110309  结算业务申请书 
        public ActionResult Form_110309()
        {
            return View();
        }
        //110310  开立单位银行结算账户申请书   
        public ActionResult Form_110310()
        {
            return View();
        }
        //110311  空白凭证领用单 
        public ActionResult Form_110311()
        {
            return View();
        }
        //110312  现金交款单   
        public ActionResult Form_110312()
        {
            return View();
        }



        #endregion 



        #region 环节09

        /*资料收取（身份证） ------------------------------*/
        //120101	客户身份证
        public ActionResult Form_120101()
        {
            return View();
        }

        //120102	代理人身份证
        public ActionResult Form_120102()
        {
            return View();
        }
        //120103	法人代表身份证
        public ActionResult Form_120103()
        {
            return View();
        }
        //120104	经办人身份证
        public ActionResult Form_120104()
        {
            return View();
        }


        /*资料收取（非身份证）------------------------------*/
        //120201	银行卡 
        public ActionResult Form_120201()
        {
            return View();
        }
        //120202	存折 
        public ActionResult Form_120202()
        {
            return View();
        }
        //120203	定期存单 
        public ActionResult Form_120203()
        {
            return View();
        }
        //120204	代理人办理相关证明 
        public ActionResult Form_120204()
        {
            return View();
        }
        //120205	一本通 
        public ActionResult Form_120205()
        {
            return View();
        }
        //120206	授权申请书 
        public ActionResult Form_120206()
        {
            return View();
        }
        //120207	授权委托书 
        public ActionResult Form_120207()
        {
            return View();
        }
        //120208	支付通知书 
        public ActionResult Form_120208()
        {
            return View();
        }
        //120209	银行保证金合同 
        public ActionResult Form_120209()
        {
            return View();
        }
        //120210	签约协议 
        public ActionResult Form_120210()
        {
            return View();
        }
        //120211	冻结通知书 
        public ActionResult Form_120211()
        {
            return View();
        }
        //120212	扣划通知书 
        public ActionResult Form_120212()
        {
            return View();
        }
        //120213	委托扣款协议书 
        public ActionResult Form_120213()
        {
            return View();
        }
        //120214	银行端查询缴税凭证 
        public ActionResult Form_120214()
        {
            return View();
        }
        //120215	协助扣划存款通知书 
        public ActionResult Form_120215()
        {
            return View();
        }
        //120216	裁定书 
        public ActionResult Form_120216()
        {
            return View();
        }
        //120217	查询书 
        public ActionResult Form_120217()
        {
            return View();
        }
        //120218	法院人员一工作证
        public ActionResult Form_120218()
        {
            return View();
        }
        //120219	营业执照 
        public ActionResult Form_120219()
        {
            return View();
        }
        //120220	社保卡 
        public ActionResult Form_120220()
        {
            return View();
        }
        //120221	公安机关人员证件 
        public ActionResult Form_120221()
        {
            return View();
        }
        //120222	代理人护照 
        public ActionResult Form_120222()
        {
            return View();
        }
        //120223	法人银行卡 
        public ActionResult Form_120223()
        {
            return View();
        }
        //120224	剩余转账支票 
        public ActionResult Form_120224()
        {
            return View();
        }
        //120225	印鉴卡（销户）	
        public ActionResult Form_120225()
        {
            return View();
        }
        //120226	营业执照复印件 
        public ActionResult Form_120226()
        {
            return View();
        }
        //120227	单位定期证实书  null
        public ActionResult Form_120227()
        {
            return View();
        }
        //120228	法院人员二工作证 
        public ActionResult Form_120228()
        {
            return View();
        }
        //120229	公安机关人员二证件 
        public ActionResult Form_120229()
        {
            return View();
        }





        //120230	法院人员一工作证（复印件）
        public ActionResult Form_120230()
        {
            return View();
        }
        //120231	法院人员二工作证（复印件）
        public ActionResult Form_120231()
        {
            return View();
        }
        //120232	公安机关人员一证件（复印件）
        public ActionResult Form_120232()
        {
            return View();
        }
        //120233	公安机关人员二证件（复印件）
        public ActionResult Form_120233()
        {
            return View();
        }

        //120234	协助查询通知书
        public ActionResult Form_120234()
        {
            return View();
        }
        //120235	协助查询通知书（回执）
        public ActionResult Form_120235()
        {
            return View();
        }

        #endregion

        #region 环节10
        //130101	解除止付通知书	
        public ActionResult Form_130101()
        {
            return View();
        }
        //130102	授权申请书	
        public ActionResult Form_130102()
        {
            return View();
        }
        //130103	授权委托书	
        public ActionResult Form_130103()
        {
            return View();
        }
        //130104	止付通知书	
        public ActionResult Form_130104()
        {
            return View();
        }
        //130105	假币收缴凭证	
        public ActionResult Form_130105()
        {
            return View();
        }

        //130106	冻结回执	
        public ActionResult Form_130106()
        {
            return View();
        }
        //130107	扣划回执	
        public ActionResult Form_130107()
        {
            return View();
        }

        #endregion

        #region 环节13
        //140101	通用业务凭证（耗材）	
        public ActionResult Form_140101()
        {
            return View();
        }
        //140102	客户身份证联网核查结果	
        public ActionResult Form_140102()
        {
            return View();
        }
        //140103	代理人身份证联网核查结果	
        public ActionResult Form_140103()
        {
            return View();
        }
        //140104	经办人身份证联网核查结果	
        public ActionResult Form_140104()
        {
            return View();
        }
        //140105	利息清单（耗材）	
        public ActionResult Form_140105()
        {
            return View();
        }
        //140106	法人身份证联网核查结果	
        public ActionResult Form_140106()
        {
            return View();
        }
        //140107	单位定期证实书	
        public ActionResult Form_140107()
        {
            return View();
        }
        //140108	印鉴卡（开户）	
        public ActionResult Form_140108()
        {
            return View();
        }
        //140109	新的定期存单	
        public ActionResult Form_140109()
        {
            return View();
        }
        //140110	个人同城转账/异地汇款凭证	
        public ActionResult Form_140110()
        {
            return View();
        }
        #endregion

        public ActionResult ToForm()
        {
            string formId = Request["FormId"];
            if (formId.StartsWith("200"))
            {
                ViewBag.FormId = formId;
                ViewBag.ToFormId = Request["ToFormId"];
                return View("ToForm");
            }
            return View("Form_" + formId);
        }
    }
}