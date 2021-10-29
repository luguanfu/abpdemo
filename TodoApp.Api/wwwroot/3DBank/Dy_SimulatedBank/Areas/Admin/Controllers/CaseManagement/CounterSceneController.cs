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
    public class CounterSceneController : BaseController
    {
        //
        // GET: /Admin/CounterScene/

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
        public string GetCounterScene()
        {
            var taskid = Request["taskid"];
            var customerid = Request["customerid"];

            var sql = $"SELECT [ID],[TaskId],[CustomerId],[ShowAmount],[CounterfeitMoney],[DamagedMoney],[ActualAmount],[Names_15] FROM [bsi_BusinessFormRelation] where [TaskId] = {taskid} and [CustomerId] = {customerid}";
            var dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 已弃用
        /// </summary>
        /// <returns></returns>
        public string SetCounterScene()
        {

            var TaskId = Request["TaskId"];
            var CustomerId = Request["CustomerId"];

            if (string.IsNullOrEmpty(TaskId) || string.IsNullOrEmpty(CustomerId))
            {
                return "-1";
            }

            var ShowAmount = Request["ShowAmount"];
            var CounterfeitMoney = Request["CounterfeitMoney"];
            var DamagedMoney = Request["DamagedMoney"];
            var ActualAmount = Request["ActualAmount"];
            var Names_15 = Request["Names_15"];


            var sql = $"select count(*) from bsi_BusinessFormRelation where [TaskId] = {TaskId} and [CustomerId] = {CustomerId}";
            var count = int.Parse(SqlHelper.ExecuteNonQuerys(sql).ToString());

            if (count == 0)
            { //新增
                sql = $@"insert into bsi_BusinessFormRelation([TaskId],[CustomerId],[ShowAmount],[CounterfeitMoney],[DamagedMoney],[ActualAmount],[Names_15],[AddUserId],[AddTime]) 
                         values('{TaskId}','{CustomerId}','{ShowAmount}','{CounterfeitMoney}','{DamagedMoney}','{ActualAmount}','{Names_15}',{UserId},GETDATE())";
                count = int.Parse(SqlHelper.ExecuteNonQuerys(sql).ToString());
                return count.ToString();
            }
            else //更新
            {
                var setsql = "";
                if (!string.IsNullOrEmpty(ShowAmount))
                {
                    setsql += $"[ShowAmount] = '{ShowAmount}',";
                }
                if (!string.IsNullOrEmpty(CounterfeitMoney))
                {
                    setsql += $"[CounterfeitMoney] = '{CounterfeitMoney}',";
                }
                if (!string.IsNullOrEmpty(DamagedMoney))
                {
                    setsql += $"[DamagedMoney] = '{DamagedMoney}',";
                }
                if (!string.IsNullOrEmpty(ActualAmount))
                {
                    setsql += $"[ActualAmount] = '{ActualAmount}',";
                }
                if (!string.IsNullOrEmpty(Names_15))
                {
                    setsql += $"[Names_15] = '{Names_15}',";
                }
                setsql = setsql.Substring(0, setsql.Length - 1);
                sql = $"update [bsi_BusinessFormRelation] set {setsql} where [TaskId] = {TaskId} and [CustomerId] = {CustomerId}";
                SqlHelper.ExecuteNonQuerys(sql).ToString();
                return "1";
            }








        }


        public string GetEditTextInfo()
        {
            //"customerid": customerid, "FieldName": name, "FieldValue": value

            var customerid = Request["customerid"];

            var sql = $"select [TaskDescribe],[TaskImportant],[OperManualUrl],[OperManualName] from bsi_TaskCustomer  where ID= {customerid}";

            var dt = SqlHelper.ExecuteDataTable(sql);

            return JsonConvert.SerializeObject(dt);
            
        }


        public string SetEditTextInfo()
        {
            //"customerid": customerid, "FieldName": name, "FieldValue": value

            var customerid = Request["customerid"];
            var FieldName = Request["FieldName"];
            var FieldValue = Request["FieldValue"];

            FieldValue = FieldValue.Replace("'", "''");

            var setSql = $"update bsi_TaskCustomer set {FieldName} = '{FieldValue}'  where ID= {customerid}";

            var ret = SqlHelper.ExecuteNonQuery(setSql);

            if (ret > 0)
            {
                return "1";
            }
            else
            {
                return "-1";
            }
        }

        [HttpPost]
        public ActionResult UploadFile(HttpPostedFileBase FormFiles)
        {

            try
            {


                var customerid = Request["customerid"];
                
                //获得浏览器端 传过来 第一个文件选择框的数据  
                string filePath = "/Export";
                //获得上传上来的文件名称  
                string fileName = System.IO.Path.GetFileName(FormFiles.FileName);
                //fileName = fileName.Substring(fileName.LastIndexOf('.'));

                string fileNameNew = DateTime.Now.Year + "" + DateTime.Now.Month + "" + DateTime.Now.Day + "" + DateTime.Now.Hour + "" + DateTime.Now.Minute + "" + DateTime.Now.Second + DateTime.Now.Millisecond + "_" + customerid + "操作手册" + fileName.Substring(fileName.LastIndexOf('.'));
                //获得 要保存的物理路径  

                filePath = Server.MapPath(filePath + "/" + fileNameNew);
                //将上传来的 文件数据 保存在 对应的 物理路径上  
                FormFiles.SaveAs(filePath);

                //修改数据库数据
                SqlHelper.ExecuteNonQuery($"update bsi_TaskCustomer set OperManualUrl = '/Export/{fileNameNew}',OperManualName = '{fileName}'  where ID= {customerid}");

                return Content("1");
            }
            catch
            {
                return Content("99");
            }

        }


    }
}
