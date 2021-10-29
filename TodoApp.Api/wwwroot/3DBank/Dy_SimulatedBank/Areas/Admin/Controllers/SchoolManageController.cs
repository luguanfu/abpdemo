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
    public class SchoolManageController : BaseController
    {
        /***************************************************************
         FileName:管理员端 学校管理
         Copyright（c）2018-金融教育在线技术开发部
         Author:袁学
         Create Date:2018-02-10
         ******************************************************************/
        CommonBll commBll = new CommonBll();

        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        ///  列表数据
        /// </summary>
        /// <returns></returns>
        public string GetList()
        {

            string wheres = " ";
            //查询条件
            if (Request["selProvince"].ToString() != "选择省份")
            {
                wheres += " and province='" + Request["selProvince"] + "'";
            }
            if (Request["selCity"].ToString() != "全部")
            {
                wheres += " and City='" + Request["selCity"] + "'";
            }
            if (Request["txtSchoolName"].Length > 0)
            {
                wheres += " and SchoolName like '%" + Request["txtSchoolName"] + "%'";
            }


            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.AddTime desc"; //排序必须填写
            m.strFld = @" a.*,
(select COUNT(1) from tb_College where SchoolId=a.S_ID) as xueyuan,
(select COUNT(1) from tb_Major where SchoolId=a.S_ID) as zhuanye,
(select COUNT(1) from tb_Class where SchoolId=a.S_ID) as banji,
(select COUNT(1) from tb_Teacher where SchoolId=a.S_ID) as jiaoshi,
(select COUNT(1) from tb_Student where SchoolId=a.S_ID) as xuesheng";
            m.tab = @"tb_School a";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));

        }

        /// <summary>
        /// 新增
        /// </summary>
        /// <returns></returns>
        public string Add()
        {
            string table = "tb_School"; //表名
            string list = "SchoolName, province, City, DetailedAddress, AddUserId, AddTime,Extra3";//列
            string vlaue = "@SchoolName, @province, @City, @DetailedAddress, @AddUserId, @AddTime,@Extra3";

            var AddschoolName = Request["AddschoolName"];
            var seladdprovince = Request["seladdprovince"];
            var seladdCity = Request["seladdCity"];
            var EndtTime = Request["EndtTime"];

            //校验学校名称是否已存在
            var count = commBll.GetRecordCount("tb_School", " and SchoolName='" + AddschoolName + "'");
            if (count > 0)
            {
                return "77";

            }

            //新增
            SqlParameter[] pars = new SqlParameter[] 
            { 
                new SqlParameter("@SchoolName",AddschoolName),
                new SqlParameter("@province",seladdprovince),
                new SqlParameter("@City",seladdCity),
                new SqlParameter("@DetailedAddress",null),
                new SqlParameter("@AddUserId",UserId),
                new SqlParameter("@AddTime",DateTime.Now),
                new SqlParameter("@Extra3",EndtTime)
            };
            var resultcount = commBll.Add(table, list, vlaue, pars);
            if (resultcount == 1)
            {
                return "1";
            }
            else
            {
                return "99";
            }
        }


        /// <summary>
        /// 删除
        /// </summary>
        /// <returns></returns>
        public string Del()
        {
            string Ids = Request["Ids"];
            try
            {
                commBll.DeleteInfo("tb_School", " and S_ID in(" + Ids + ")");

                //      确定后，从系统中删除对应学校信息及下方所有组织及帐号，111111
                //      学生端、教师端对应用户在系统中进行任意操作，退回至登录页，不影响已进行的操作

                //删除数据
                //删除教师登陆号
                commBll.DeleteInfo("tb_User", " and U_ID in(select UserId from tb_Teacher where SchoolId in(" + Ids + "))");
                //删除教师表
                commBll.DeleteInfo("tb_Teacher", " and  SchoolId in(" + Ids + ")");
                //删除学生登陆号
                commBll.DeleteInfo("tb_User", " and U_ID in(select UserId from tb_Student where SchoolId in(" + Ids + "))");
                //删除学生表
                commBll.DeleteInfo("tb_Student", " and  SchoolId in(" + Ids + ")");

                //删除学院
                commBll.DeleteInfo("tb_College", " and  SchoolId in(" + Ids + ")");
                //删除专业
                commBll.DeleteInfo("tb_Major", " and  SchoolId in(" + Ids + ")");
                //删除班级
                commBll.DeleteInfo("tb_Class", " and  SchoolId in(" + Ids + ")");
                return "1";
            }
            catch
            {
                return "99";
            }


        }

        /// <summary>
        /// 获取单行信息
        /// </summary>
        /// <returns></returns>
        public string GetListById()
        {
            DataTable dt = commBll.GetListDatatable("*", "tb_School", " and S_ID=" + Request["S_ID"]);
            return JsonConvert.SerializeObject(dt);

        }

        /// <summary>
        /// 修改
        /// </summary>
        /// <returns></returns>
        public string Update()
        {
            string table = "tb_School"; //表名
            string Set = "SchoolName=@SchoolName, province=@province, City=@City,Extra3=@Extra3";


            var EditschoolName = Request["EditschoolName"];
            var selEditprovince = Request["selEditprovince"];
            var selEditCity = Request["selEditCity"];
            var SID = Request["SID"];
            var EndtTime = Request["EndtTime"];
            //校验学校名称是否已存在
            var count = commBll.GetRecordCount("tb_School", " and SchoolName='" + EditschoolName + "' and S_ID!=" + SID);
            if (count > 0)
            {
                return "77";

            }

            SqlParameter[] pars = new SqlParameter[] 
            { 
                new SqlParameter("@SchoolName",EditschoolName),
                new SqlParameter("@province",selEditprovince),
                new SqlParameter("@City",selEditCity),
                new SqlParameter("@S_ID",SID),
                new SqlParameter("@Extra3",EndtTime)
            };
            var resultcount = commBll.UpdateInfo(table, Set, " and S_ID=@S_ID", pars);
            if (resultcount == 1)
            {
                return "1";
            }
            else
            {
                return "99";
            }


        }

    }
}
