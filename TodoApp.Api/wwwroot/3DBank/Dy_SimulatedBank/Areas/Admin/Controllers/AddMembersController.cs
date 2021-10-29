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
    public class AddMembersController : BaseController
    {
        CommonBll commBll = new CommonBll();
        // GET: /Teacher/AddMembers/
        /// <summary>
        /// 团队成员列表
        /// </summary>
        /// <returns></returns>
        public ActionResult Index(int ID)
        {
            ViewData["ID"] = ID;
            return View();
        }
        #region  获取学校全部学生列表
        public string GetList()
        {
            var ID = Request["ID"];
            string wheres = " and a.ClassId=b.C_ID and b.MajorId=c.M_ID and c.CollegeId=d.C_ID and a.SchoolId in (select bsi_Groupmanagement.SchoolId from bsi_Groupmanagement where G_ID =" + ID + " )  ";
            //查询条件
            if (Request["CollegeNameId"].ToString() != "0")
            {
                wheres += " and a.CollegeId=" + Request["CollegeNameId"] + "";
            }
            if (Request["Majorid"].ToString() != "0")
            {
                wheres += " and a.MajorId=" + Request["Majorid"] + " ";
            }
        
            if (Request["ClassNameid"].Length > 0)
            {
                wheres += " and ( b.ClassName like '%" + Request["ClassNameid"]
               + "%' or a.Name like '%" + Request["ClassNameid"] + "%' )";
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.AddTime desc"; //排序必须填写
            m.strFld = @" a.UserId, CollegeName,MajorName,ClassName,Name,StudentNo
 ,(case when (select max(GroupingnameID) from bsi_Groupingrelation s where s.StudentID=a.UserId  and GroupingnameID in( select G_ID from bsi_Groupmanagement where Type=2))Is null  then 0
 else
 (select max(GroupingnameID) from bsi_Groupingrelation s where s.StudentID=a.UserId  and GroupingnameID in( select G_ID from bsi_Groupmanagement where Type=2))
 end) as states";
            m.tab = @"tb_Student a,tb_Class b,tb_Major c,tb_College d";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }
        #endregion
        /// <summary>
        /// 添加
        /// </summary>
        /// <returns></returns>
        public string Add()
        {
            string ID = Request["ID"].ToString();
            string Ids = Request["Ids"].ToString();
            string[] s = Ids.Split(new char[] { ',' });
            for (int i = 0; i < s.Length; i++)
            {
                if (commBll.GetRecordCount("bsi_Groupingrelation", " and StudentID=" + s[i] + "   and GroupingnameID in( select G_ID from bsi_Groupmanagement where Type=2)") == 0)
                {
                    string table = "bsi_Groupingrelation"; //表名
                    string list = "GroupingnameID, StudentID, Groupingstate, AddUserId, AddTime";//列
                    string vlaue = "@GroupingnameID, @StudentID, @Groupingstate, @AddUserId, @AddTime";
                    SqlParameter[] pars = new SqlParameter[] 
                    {
                        new SqlParameter("@GroupingnameID",ID),
                        new SqlParameter("@StudentID",s[i].ToString()),
                        new SqlParameter("@Groupingstate",'0'),
                        new SqlParameter("@AddUserId",UserId),
                        new SqlParameter("@AddTime",DateTime.Now),
                    };
                    var count = commBll.Add(table, list, vlaue, pars);
                }

            }
            return "1";
        }


        public string GetCollege()
        {
            string sql = " select SchoolId from bsi_Groupmanagement where G_ID=" + Request["Schoolid"];
            DataTable dt = commBll.GetListDatatable(sql);
            return dt.Rows[0]["SchoolId"].ToString();
        }
    }
}
