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

namespace Dy_SimulatedBank.Controllers
{
    public class PersonalCenterController : BaseController
    {
        //
        // GET: /PersonalCenter/
        CommonBll commBll = new CommonBll();
        public ActionResult Index()
        {
            DataTable dt = commBll.GetListDatatable(@"StudentNo,(select collegeName from tb_College where C_ID=collegeId) as collegeName
 ,(select majorName from tb_Major where M_ID=MajorId) as majorName,(select className from tb_Class where C_ID=ClassId) as className
 ,Name,Extra1,Extra2,Phone,Extra3,(select Password from tb_User where U_ID=UserId) as Password,UI_UserPic,Email,Sex"
            , "tb_Student", "  and UserId=" + UserId);
            ViewData["U_UserNo"] = dt.Rows[0]["StudentNo"];

            ViewData["UI_UserName"] = dt.Rows[0]["Name"];
            ViewData["UI_UserIdentity"] = dt.Rows[0]["Extra1"];
            ViewData["UI_UserPhone"] = dt.Rows[0]["Phone"];
            ViewData["UI_UserCity"] = dt.Rows[0]["Extra2"];
            ViewData["UI_UserAddress"] = dt.Rows[0]["Extra3"];
            ViewData["U_UserPwd"] = dt.Rows[0]["Password"];
            ViewData["Email"] = dt.Rows[0]["Email"];
            ViewData["classMName"] = "无";
            ViewData["className"] = "无";
            ViewData["MajorName"] = "无";
            ViewData["Sex"] = dt.Rows[0]["Sex"].ToString().Length <= 0 ? 0 : dt.Rows[0]["Sex"];
            if (dt.Rows[0]["collegeName"].ToString().Length > 0)
            {
                ViewData["classMName"] = dt.Rows[0]["collegeName"];
            }
            if (dt.Rows[0]["className"].ToString().Length > 0)
            {
                ViewData["className"] = dt.Rows[0]["className"];
            }
            if (dt.Rows[0]["majorName"].ToString().Length > 0)
            {
                ViewData["MajorName"] = dt.Rows[0]["majorName"];
            }


            if (dt.Rows[0]["UI_UserPic"] == null || dt.Rows[0]["UI_UserPic"].ToString().Trim() == "")
            {
                ViewData["UI_UserPic"] = "/Img/xguse.png";
            }
            else
            {
                ViewData["UI_UserPic"] = dt.Rows[0]["UI_UserPic"];
            }
            return View();
        }

        public int submitImg()
        {
            var UI_UserPic = Request["use_img"];
            return commBll.UpdateInfo("tb_Student", "UI_UserPic='" + UI_UserPic + "'", " and UserId=" + UserId);
        }
        public int UpdatePwd()
        {
            var U_UserPwd = Request["U_UserPwd"];
            return commBll.UpdateInfo("tb_User", "Password='" + U_UserPwd + "'", " and U_ID=" + UserId);
        }
        public int Updateinfo()
        {
            var UI_UserName = Request["UI_UserName"];
            var UI_UserIdentity = Request["UI_UserIdentity"];
            var UI_UserPhone = Request["UI_UserPhone"];
            var UI_UserAddress = Request["UI_UserAddress"];
            var UI_UserCity = Request["UI_UserCity"];
            var Email = Request["Email"];
            var Sex = Request["sex"];
            return commBll.UpdateInfo("tb_Student", "Name='"
            + UI_UserName + "',Extra1='" + UI_UserIdentity + "'," + "Phone='" + UI_UserPhone + "',"
            + "Extra3='" + UI_UserAddress + "'," + "Extra2='" + UI_UserCity + "',Email='" + Email + "',Sex=" + Sex + ""
            , " and UserId=" + UserId);
        }

    }
}
