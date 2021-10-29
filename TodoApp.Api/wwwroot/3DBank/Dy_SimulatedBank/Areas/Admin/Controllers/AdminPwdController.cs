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

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class AdminPwdController : BaseController
    {
        /***************************************************************
        FileName:管理员端 修改密码
        Copyright（c）2018-金融教育在线技术开发部
        Author:袁学
        Create Date:2018-03-02
        ******************************************************************/
        CommonBll commBll = new CommonBll();

        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 修改密码
        /// </summary>
        /// <returns></returns>
        public string Update()
        {
            try
            {
                string table = "tb_User"; //表名
                string Set = "Password=@Password";

                var OldPassword = Request["OldPassword"];
                var NewPassword = Request["NewPassword"];

                //校验当前密码能否查到
                var count = commBll.GetRecordCount("tb_User", " and LoginNo='"+UserNo+"' and Password='" + OldPassword + "'");
                if (count == 0)
                {
                    return "77"; //没有 就是错误的 密码

                }

                SqlParameter[] pars = new SqlParameter[] 
                { 

                    new SqlParameter("@Password",NewPassword)
                };
                var resultcount = commBll.UpdateInfo(table, Set, " and LoginNo='" + UserNo + "'", pars);
                if (resultcount == 1)
                {
                    return "1";
                }
                else
                {
                    return "99";
                }

            }
            catch
            {
                return "99";

            }

        }

    }
}
