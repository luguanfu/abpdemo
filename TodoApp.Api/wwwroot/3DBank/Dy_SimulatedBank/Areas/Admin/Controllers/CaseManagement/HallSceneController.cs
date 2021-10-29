using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank_DBUtility.Sql;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class HallSceneController : BaseController
    {
        //
        // GET: /Admin/HallScene/

        public ActionResult Index()
        {
            //string taskid = string.IsNullOrEmpty(Request["taskid"]) ? "0" : Request["taskid"];
            //string addtype = string.IsNullOrEmpty(Request["addtype"]) ? "1" : Request["addtype"];//1新增，2编辑
            string customerid = string.IsNullOrEmpty(Request["customerid"]) ? "0" : Request["customerid"]; ;//客户id
            //string customername = Request["customername"]; ;//客户名称

            ViewData["taskid"] = "0";
            ViewData["addtype"] = "2";
            ViewData["customerid"] = customerid;
            ViewData["customername"] = "";

            var sql = $"select [TaskId],[CustomerName] from [bsi_TaskCustomer] where ID = {customerid}";
            var dt = SqlHelper.ExecuteDataTable(sql);
            if (dt.Rows.Count > 0)
            {
                ViewData["taskid"] = dt.Rows[0]["TaskId"];
                ViewData["customername"] = dt.Rows[0]["CustomerName"];
            }

            return View();
        }

        
        /// <summary>
        /// 已弃用
        /// </summary>
        /// <returns></returns>
        public string SetHallScene() {

            var TaskId = Request["TaskId"];
            var CustomerId = Request["CustomerId"];

            if (string.IsNullOrEmpty(TaskId) || string.IsNullOrEmpty(CustomerId)) {
                return "-1";
            }

            var Names_3 = Request["Names_3"];
            var Names_4 = Request["Names_4"];
            var Names_6 = Request["Names_6"];
            var Names_16 = Request["Names_16"];

            var sql = $"select count(*) from bsi_BusinessFormRelation where [TaskId] = {TaskId} and [CustomerId] = {CustomerId}";
            var count = int.Parse(SqlHelper.ExecuteNonQuerys(sql).ToString());

            if (count == 0)
            { //新增
                sql = $"insert into bsi_BusinessFormRelation([TaskId],[CustomerId],[Names_3],[Names_4],[Names_6],[Names_16],[AddUserId],[AddTime]) values('{TaskId}','{CustomerId}','{Names_3}','{Names_4}','{Names_6}','{Names_16}',{UserId},GETDATE())";
                count = int.Parse(SqlHelper.ExecuteNonQuerys(sql).ToString());
                return count.ToString();
            }
            else //更新
            {
                var setsql = "";
                if (!string.IsNullOrEmpty(Names_3))
                {
                    setsql += $"[Names_3] = '{Names_3}',";
                }
                if (!string.IsNullOrEmpty(Names_4))
                {
                    setsql += $"[Names_4] = '{Names_4}',";
                }
                if (!string.IsNullOrEmpty(Names_6))
                {
                    setsql += $"[Names_6] = '{Names_6}',";
                }
                if (!string.IsNullOrEmpty(Names_16))
                {
                    setsql += $"[Names_16] = '{Names_16}',";
                }
                setsql = setsql.Substring(0, setsql.Length - 1);
                sql = $"update [bsi_BusinessFormRelation] set {setsql} where [TaskId] = {TaskId} and [CustomerId] = {CustomerId}";
                SqlHelper.ExecuteNonQuerys(sql).ToString();
                return "1";
            }



            




        }

    }
}
