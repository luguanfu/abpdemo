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
    public class CollegeManageController : BaseController
    {
        /***************************************************************
         FileName:管理员端 学院管理
         Copyright（c）2018-金融教育在线技术开发部
         Author:袁学
         Create Date:2018-02-26
         ******************************************************************/
        CommonBll commBll = new CommonBll();
        public ActionResult Index()
        {
            DataTable dt = commBll.GetListDatatable("*", "tb_School", "");
            return View(dt);

        }
        /// <summary>
        ///  列表数据
        /// </summary>
        /// <returns></returns>
        public string GetList()
        {

            string wheres = " ";
            //查询条件
            if (Request["txtSchoolId"].ToString() != "")
            {
                wheres += " and SchoolId='" + Request["txtSchoolId"] + "'";
            }

            if (Request["txtCollegeName"].Length > 0)
            {
                wheres += " and (CollegeName like '%" + Request["txtCollegeName"] + "%' or SchoolName like '%" + Request["txtCollegeName"] + "%' )";
            }


            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.AddTime desc"; //排序必须填写
            m.strFld = @" a.*,SchoolName,
(select COUNT(1) from tb_Major where CollegeId=a.C_ID) as zhuanye";
            m.tab = @"tb_College a inner join tb_School b on a.SchoolId=b.S_ID";
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
            string table = "tb_College"; //表名
            string list = "SchoolId, CollegeName, AddUserId, AddTime";//列
            string vlaue = "@SchoolId, @CollegeName, @AddUserId, @AddTime";

            var SelSchoolId = Request["SelSchoolId"];
            var txtName = Request["txtName"];


            //校验学院名称是否已存在
            var count = commBll.GetRecordCount("tb_College", " and SchoolId='" + SelSchoolId + "' and CollegeName='" + txtName + "'");
            if (count > 0)
            {
                return "77";

            }

            //新增
            SqlParameter[] pars = new SqlParameter[] 
            { 
                new SqlParameter("@SchoolId",SelSchoolId),
                new SqlParameter("@CollegeName",txtName),
                new SqlParameter("@AddUserId",UserId),
                new SqlParameter("@AddTime",DateTime.Now)
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
                commBll.DeleteInfo("tb_College", " and C_ID in(" + Ids + ")");

                //      确定后，从系统中删除对应学校信息及下方所有组织及帐号，
                //      学生端、教师端对应用户在系统中进行任意操作，退回至登录页，不影响已进行的操作

                //删除数据
                //删除学生登陆号
                commBll.DeleteInfo("tb_User", " and U_ID in(select UserId from tb_Student where CollegeId in(" + Ids + "))");
                //删除学生表
                commBll.DeleteInfo("tb_Student", " and  CollegeId in(" + Ids + ")");


                //删除专业
                commBll.DeleteInfo("tb_Major", " and  CollegeId in(" + Ids + ")");
                //删除班级
                commBll.DeleteInfo("tb_Class", " and  CollegeId in(" + Ids + ")");
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
            DataTable dt = commBll.GetListDatatable("*,(select SchoolName from tb_School where S_ID=SchoolId) as SchoolName", "tb_College", " and C_ID=" + Request["C_ID"]);
            return JsonConvert.SerializeObject(dt);

        }

        /// <summary>
        /// 修改
        /// </summary>
        /// <returns></returns>
        public string Update()
        {
            string table = "tb_College"; //表名
            string Set = "SchoolId=@SchoolId, CollegeName=@CollegeName";


            var SelSchoolId = Request["SelSchoolId"];
            var txtName = Request["txtName"];
            var CID = Request["CID"];

            //校验学院名称是否已存在
            var count = commBll.GetRecordCount("tb_College", " and SchoolId='" + SelSchoolId + "' and CollegeName='" + txtName + "' and C_ID!=" + CID);
            if (count > 0)
            {
                return "77";

            }

            SqlParameter[] pars = new SqlParameter[] 
            { 
                new SqlParameter("@SchoolId",SelSchoolId),
                new SqlParameter("@CollegeName",txtName),
                new SqlParameter("@C_ID",CID)
            };
            var resultcount = commBll.UpdateInfo(table, Set, " and C_ID=@C_ID", pars);
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
