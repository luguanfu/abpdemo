using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank_Bll;
using Dy_SimulatedBank_DBUtility.Sql;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class TMDefaultValueController : BaseController
    {
        //表单默认值
        CommonBll commBll = new CommonBll();
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 添加默认值
        /// </summary>
        /// <returns></returns>
        public int AddDefaultValue()
        {
            string TaskId = Request["TaskId"];
            string DefaultValue = Request["DefaultValue"];
            string CustomerId = Request["CustomerId"];
            string AreaValue = Request["AreaValue"];


            string TMNO = Request["TMNO"];
            string selectSQL = "select * from dal_DefaultValue where TaskId=" + TaskId + " and  TMNO='" + TMNO + "' and AddUser=" + UserId + " and (CustomerId=" + CustomerId + " or CustomerId is null)";
            var selectResult = SqlHelper.ExecuteSclar(selectSQL);
            string SQL = "";
            var count = 0;
            if (selectResult != null)
            {

                string table = "dal_DefaultValue";
                string set = "DefaultValue=@DefaultValue,CustomerId=@CustomerId,TabDefaultValue=@TabDefaultValue";
                SqlParameter[] parsup = new SqlParameter[]
                {
                new SqlParameter("@DefaultValue",DefaultValue),
                new SqlParameter("@CustomerId",CustomerId),
                new SqlParameter("@TabDefaultValue",AreaValue)
                };
                count = commBll.UpdateInfo(table, set, " and  TaskId=" + TaskId + " and  TMNO='" + TMNO + "' and AddUser=" + UserId + " and (CustomerId=" + CustomerId + " or CustomerId is null)", parsup);
            }
            else
            {
                SQL = "insert into dal_DefaultValue ([TaskId],[DefaultValue],[AddUser],[TMNO],[CustomerId],[TabDefaultValue]) VALUES (" + TaskId + ",'" + DefaultValue + "'," + UserId + ",'" + TMNO + "','" + CustomerId + "','" + AreaValue + "')";
                count = int.Parse(SqlHelper.ExecuteNonQuerys(SQL).ToString());
            }

            return count;
        }
        /// <summary>
        /// 获取内置数据
        /// </summary>
        /// <param name="TaskId"></param>
        /// <param name="TMNO"></param>
        /// <returns></returns>
        public string getValues(string TaskId, string TMNO, string CustomerId)
        {
            string sql = "select * from dal_DefaultValue where TaskId=" + TaskId + " and TMNO='" + TMNO + "' And (CustomerId=" + CustomerId + " or CustomerId is null)";
            var dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 清除内置数据
        /// </summary>
        /// <returns></returns>
        public int DelDefaultvalue()
        {
            string TaskId = Request["TaskId"];
            string TMNO = Request["FormId"];
            string sql = "select * from dal_DefaultValue where  TMNO='" + TMNO + "' and TaskId=" + TaskId;
            var selectResult = SqlHelper.ExecuteSclar(sql);
            int count = 0;
            if (selectResult != null)
            {
                string table = "dal_DefaultValue";
                string set = "DefaultValue=@DefaultValue";
                string DValue = "";
                SqlParameter[] parsup = new SqlParameter[]
                {
                new SqlParameter("@DefaultValue",DValue),
                };
                count = commBll.UpdateInfo(table, set, " and TaskId=" + TaskId + " and  TMNO='" + TMNO + "'", parsup);
            }
            else
            {
                count = 8;
            }

            return count;


        }
        /// <summary>
        /// 编辑授权内容
        /// </summary>
        /// <returns></returns>
        public int EditEmpower()
        {
            string TaskId = Request["TaskId"];
            string EmpowerInfo = Request["EValue"];
            string TMNO = Request["TMNO"];
            TMNO = TMNO.Replace("T", "");
            string selectSQL = "select * from dal_Empowe where TMNO='" + TMNO + "'";
            var selectResult = SqlHelper.ExecuteSclar(selectSQL);
            string SQL = "";
            var count = 0;
            if (selectResult != null)
            {
                string table = "dal_Empowe";
                string set = "EValue=@EValue";
                SqlParameter[] parsup = new SqlParameter[]
                {
                new SqlParameter("@EValue",EmpowerInfo),
                };
                count = commBll.UpdateInfo(table, set, " and  TMNO='" + TMNO + "'", parsup);
            }
            else
            {
                SQL = "insert into dal_Empowe ([EValue],[AddUserId],[TMNO]) VALUES (" + "'" + EmpowerInfo + "'," + UserId + ",'" + TMNO + "')";
                count = int.Parse(SqlHelper.ExecuteNonQuerys(SQL).ToString());
            }

            return count;
        }
        /// <summary>
        ///编辑时获取授权内容
        /// </summary>
        /// <param name="TaskId"></param>
        /// <param name="TMNO"></param>
        /// <returns></returns>
        public string getEmpowerValuesInfo(string TMNO)
        {
            TMNO = TMNO.Replace("T", "");
            string sql = "select * from dal_Empowe where  TMNO='" + TMNO + "'";
            var dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);
        }




    }
}
