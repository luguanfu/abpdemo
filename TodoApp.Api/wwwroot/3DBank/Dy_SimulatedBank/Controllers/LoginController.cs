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
using System.Collections;
using System.Configuration;
using System.Security.Cryptography;
using System.Text;
using System.IO;

namespace Dy_SimulatedBank.Controllers
{
    public class LoginController : Controller
    {
        //
        // GET: /Login/
        CommonBll commnBll = new CommonBll();
        public ActionResult Index()
        {
            string SerialNo = ConfigurationManager.AppSettings["SerialNo"].ToString();
            DateTime dt0 = DateTime.Now;
            var dttime = Decrypt(SerialNo, "j[1*q-wr");
            if (dttime == "99")
            {
                ViewData["dq"] = "-2";//秘钥错误
                return View();
            }
            DateTime dt11 = DateTime.Parse(dttime);



            if (dt0 > dt11)//已经过期了
            {
                ViewData["dq"] = "-1";//即将到期给提示
            }
            else
            {
                TimeSpan ts = dt11 - dt0;
                //到期时间大于当前时间
                if (ts.TotalDays > 0 && ts.TotalDays <= 31)
                {
                    ViewData["dq"] = "1";
                }
                else
                {
                    ViewData["dq"] = "0";//未到期 且大于1个月
                }

                //没有过期 并且
            }
            ViewBag.Title = ConfigurationManager.AppSettings["title"].ToString();
            return View();
        }

        /// <summary>
        /// 解密方法
        /// </summary>
        /// <param name="pToDecrypt">需要解密的字符串</param>
        /// <param name="sKey">密匙</param>
        /// <returns>解密后的字符串</returns>
        public static string Decrypt(string pToDecrypt, string SKey)
        {
            try
            {
                DESCryptoServiceProvider des = new DESCryptoServiceProvider();
                byte[] inputByteArray = new byte[pToDecrypt.Length / 2];
                for (int x = 0; x < pToDecrypt.Length / 2; x++)
                {
                    int i = (Convert.ToInt32(pToDecrypt.Substring(x * 2, 2), 16));
                    inputByteArray[x] = (byte)i;
                }

                //建立加密对象的密钥和偏移量
                des.Key = ASCIIEncoding.ASCII.GetBytes(SKey);
                des.IV = ASCIIEncoding.ASCII.GetBytes(SKey);
                MemoryStream ms = new MemoryStream();
                CryptoStream cs = new CryptoStream(ms, des.CreateDecryptor(), CryptoStreamMode.Write);
                cs.Write(inputByteArray, 0, inputByteArray.Length);
                cs.FlushFinalBlock();
                //建立StringBuild对象，CreateDecrypt使用的是流对象，必须把解密后的文本变成流对象
                StringBuilder ret = new StringBuilder();
                return System.Text.Encoding.Default.GetString(ms.ToArray());
            }
            catch
            {
                //JS.Alert("读取配置信息失败，详细信息：" + ex.Message.Replace("\r\n", "").Replace("'", ""));

                return "99";
            }

        }

        public string Logon(string LoginName, string UserPwd,string datenow, string isSaveCookie)
        {
            DateTime dtnow = Convert.ToDateTime(datenow);
            if (dtnow.AddDays(1) < DateTime.Now)
            {
                return  "-10";
            }
            Random re = new Random(DateTime.Now.Millisecond);
            int type = re.Next(1, 4);
            //验证权key
            //string str_re = RegisterPro.keycon.CheckKey(type.ToString(), ConfigurationManager.AppSettings["keypath"].ToString());

            //if (str_re != "1") return str_re;

            ////是否过期
            ////系统过期
            //DateTime dt0 = DateTime.Now;
            //string SerialNo = ConfigurationManager.AppSettings["SerialNo"].ToString();
            //try
            //{

            //    var dttime = Decrypt(SerialNo, "j[1*q-wr");
            //    if (dttime == "99")
            //    {
            //        return "9";//秘钥错误
            //    }
            //    DateTime dt11 = DateTime.Parse(dttime);

            //    if (dt0 > dt11)
            //    {
            //        return "999";//到期
            //    }

            //}
            //catch
            //{
            //    return "9";// 序列号无效，直接提示过期
            //}

            string USchool = "0";
            string ClassId = "0";
            string StuName = "";
            //查询帐号和密码是否存在
            DataTable data = LoginDal(LoginName.Trim(), UserPwd.Trim());
            if (data.Rows.Count > 0)
            {

                //是否禁用
                if (data.Rows[0]["State"].ToString().Trim() == "0")
                {
                    return "88";

                }
                var fanhuizhi = "99";
                ///验证角色
                ///1.管理员 2.教师  3.学生
                ///
                if (data.Rows[0]["Type"].ToString().Trim() == "1")//管理员
                {
                    fanhuizhi = "1";
                }
                if (data.Rows[0]["Type"].ToString().Trim() == "2")//教师
                {

                    fanhuizhi = "2";
                    //学校ID
                    USchool = commnBll.GetListSclar("SchoolId", "tb_Teacher", " and UserId=" + data.Rows[0]["U_ID"].ToString());
                    //校验 是否到期 试用 学校
                    var EnddateTime = commnBll.GetListSclar("Extra3", "tb_School", " and S_ID=" + USchool);
                    if (Convert.ToDateTime(EnddateTime) < DateTime.Now)
                    {
                        return "77";
                    }

                }
                if (data.Rows[0]["Type"].ToString().Trim() == "3")//学生
                {

                    //学校Id
                    USchool = commnBll.GetListSclar("SchoolId", "tb_Student", " and UserId=" + data.Rows[0]["U_ID"].ToString());
                    //班级ID
                    ClassId = commnBll.GetListSclar("ClassId", "tb_Student", " and UserId=" + data.Rows[0]["U_ID"].ToString());
                    StuName = commnBll.GetListSclar("Name", "tb_Student", " and UserId=" + data.Rows[0]["U_ID"].ToString());
                    fanhuizhi = "3";
                    //校验 是否到期 试用 学校
                    var EnddateTime = commnBll.GetListSclar("Extra3", "tb_School", " and S_ID=" + USchool);
                    if (Convert.ToDateTime(EnddateTime) < DateTime.Now)
                    {
                        return "77";
                    }
                    ///存储记录
                    var countt = commnBll.GetRecordCount("tb_loginJL", " and DateDiff(dd,AddTime,getdate())=0  and UserId=" + data.Rows[0]["U_ID"]);
                    if (countt == 0)
                    {
                        SqlHelper.ExecuteNonQuery("insert into tb_loginJL values('" + data.Rows[0]["U_ID"] + "',getdate())");
                    }

                }

                /****************单点登录******************************************/
                string UserID = data.Rows[0]["U_ID"].ToString();
                SSOHelper ssomodel = new SSOHelper();
                ssomodel.LoginRegister(UserID);
                /**********************************************************/

                Session["UserNo"] = LoginName;
                Session["USchool"] = USchool;
                Session["ClassId"] = ClassId;
                Session["StuName"] = StuName;
                //帐号Id存入Session中
                Session["UserId"] = data.Rows[0]["U_ID"].ToString();//用户详情表用户ID
                //登录类型存入Session中
                Session["UserType"] = data.Rows[0]["Type"].ToString();
                return fanhuizhi;

            }
            else
            {
                return "99";
            }
        }


        public ActionResult Lout(int LoutId = 0)
        {
            ViewData["Lout"] = LoutId;
            return View();
        }


        public DataTable LoginDal(string name, string Pwd)
        {
            DataTable data = new DataTable();
            string sql = "SELECT * FROM tb_User  WHERE  LoginNo=@LoginNo and Password=@Password";
            SqlParameter[] pars = new SqlParameter[] 
             {
                 new SqlParameter("@LoginNo",name),
                 new SqlParameter("@Password",Pwd)
             };
            return SqlHelper.ExecuteDataTable(sql, CommandType.Text, pars);
        }


    }
}
