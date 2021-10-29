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
    public class Abz_FormController : BaseController
    {
        //
        // GET: /Admin/ABZ_Form/ 后台5填单标注答案的存这 
        CommonBll commonbll = new CommonBll();
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 新增标注记录表 关系表
        /// </summary>
        /// <returns></returns>
        public string AddTaskFilInTheBill()
        {
            string TaskId = Request["TaskId"];
            string CustomerId = Request["CustomerId"];
            string FormId = Request["FormId"];
            string txtid = Request["txtid"];
            string Tagging = Request["TarggingId"];

            var delStr = $"delete bsi_TaskFilInTheBill where TaskId = {TaskId} and CustomerId = {CustomerId} and FormId = '{FormId}'";
            SqlHelper.ExecuteNonQuery(delStr);


            if (txtid.Length>0) {
                //存在选择了正确答案
                //
                var lists = txtid.Split(',');
                var txtsql = "";
                for (int i=0;i<lists.Length;i++) {
                    //根据中文列 反查id
                    if (lists[i].Length>0) {
                        string FormItemId = commonbll.GetListSclar("ID", "bsi_FormItem", " and FormId='" + FormId + "' and ControlName='" + lists[i] + "'");
                        txtsql += " insert into bsi_TaskFilInTheBill values('"+TaskId+ "','" + CustomerId + "','" + FormId + "','" + FormItemId + "','" + UserId + "',getdate())";
                    }
                   
                }
                if (txtsql.Length>0) {
                    SqlHelper.ExecuteNonQuery(txtsql);
                }
                editKeyAnswer(TaskId, CustomerId, FormId, Tagging);
            }
            return "1";
        }

        /// <summary>
        /// 反显标注
        /// </summary>
        /// <returns></returns>
        public string GetTaskFilInTheBill()
        {
            string TaskId = Request["TaskId"];
            string CustomerId = Request["CustomerId"];
            string FormId = Request["FormId"];
            DataTable dt = commonbll.GetListDatatable("a.FormId,FormItemId,ControlName", 
                "bsi_TaskFilInTheBill a inner join bsi_FormItem b on a.FormItemId=b.ID",
                " and TaskId="+ TaskId + " and CustomerId="+ CustomerId + " and a.FormId='" + FormId + "'");
            return JsonConvert.SerializeObject(dt);
        }

        public string editKeyAnswer(string TaskId,string CustomerId,string FormId,string Tagging)
        {
            try
            {
                //先清空以前的
                int ints = commonbll.UpdateInfo("bsi_KeyAnswer", $"IsTagging={0}", $" AND TaskId={TaskId} and CustomerId={CustomerId} and FormId={FormId}");
                int i = commonbll.UpdateInfo("bsi_KeyAnswer", $"IsTagging={1}", $" AND ID in ({Tagging})");
                return "1";
            }
            catch
            {
                return "-1";
            }

        }

        /// <summary>
        /// 一般业务申请书
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_110201()
        {
            return View();
        }

        /// <summary>
        /// 个人开户与银行签约服务申请书
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_110202()
        {
            return View();
        }

        /// <summary>
        /// 特定业务申请书
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_110203()
        {
            return View();
        }

        /// <summary>
        /// 转账支票
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_110204()
        {
            return View();
        }

        /// <summary>
        /// 进账单
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_110205()
        {
            return View();
        }

        /// <summary>
        /// 个人同城转账/异地汇款凭证
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_110206()
        {
            return View();
        }

        /// <summary>
        /// 撤销银行结算账户申请书
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_110208()
        {
            return View();
        }

        /// <summary>
        /// 结算业务申请书
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_110209()
        {
            return View();
        }

        /// <summary>
        /// 开立单位银行结算账户申请书
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_110210()
        {
            return View();
        }

        /// <summary>
        /// 空白凭证领用单
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_110211()
        {
            return View();
        }
        /// <summary>
        /// 现金取款单
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_110212()
        {
            return View();
        }
        /// <summary>
        /// 解除止付通知书
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_130101()
        {
            return View();
        }
        /// <summary>
        /// 授权申请书
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_130102()
        {
            return View();
        }
        /// <summary>
        /// 授权委托书
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_130103()
        {
            return View();
        }
        /// <summary>
        /// 止付通知书
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_130104()
        {
            return View();
        }
        /// <summary>
        /// 假币收缴凭证
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_130105()
        {
            return View();
        }
        /// <summary>
        /// 冻结回执
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_130106()
        {
            return View();
        }
        /// <summary>
        /// 扣划回执
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_130107()
        {
            return View();
        }
        /// <summary>
        /// 协助查询通知书(回执)
        /// </summary>
        /// <returns></returns>
        public ActionResult Form_120235()
        {
            return View();
        }

      
    }
}
