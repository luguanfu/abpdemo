using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dy_SimulatedBank.App_Start
{
    public class ImplementLog
    {  
        /// <summary>
        /// 
        /// </summary> 
        /// <param name="SchoolNo">学校编号</param>
        /// <param name="UId">用户id</param>
        /// <param name="OperationContent">内容</param>
        public static void ImpLog(string SchoolNo, int UId, string OperationContent)
        {
            var time = DateTime.Now;
            //PaperCalculators.Add(AddUserErrorlog(SchoolNo, UId, time, OperationContent));
            //Thread.Sleep(1000);
        }
        /// <summary>
        /// 操作日志
        /// </summary>
        /// <param name="SchoolNo">学校编号</param>
        /// <param name="UId">用户id</param>
        /// <param name="OperationContent">内容</param>
        /// <returns></returns>
        public static string AddUserErrorlog(string SchoolNo, int UId, DateTime time, string OperationContent = "")
        {

            string sql = " insert into Tb_OperationLog(SchoolNo,OperationUserId,OperationTime,OperationContent,CreateTime)";
            sql += " values('" + SchoolNo + "'," + UId + ",'" + DateTime.Now + "','" + OperationContent + "','" + time + "')";
            return sql;

        }
    }
}