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
    public class TeacherClassManagementController : BaseController
    {
        /***************************************************************
   FileName:管理员端 班级管理
   Copyright（c）2018-金融教育在线技术开发部
   Author:邵世铨
   Create Date:2018-023-6
   ******************************************************************/
        CommonBll commBll = new CommonBll();
        public ActionResult Index()
        {
            string wheres = " and S_ID in (select SchoolId from tb_Teacher where UserId=" + UserId + ")";//老师只能看自己

            DataTable dt = commBll.GetListDatatable("*", "tb_School", wheres);
            return View(dt);
        }


        #region 2 获取学校下面的学院数据
        public string GetCollege()
        {
            string Schoolid = Request["Schoolid"];
            string sql = "select * from tb_College where SchoolId=" + Schoolid + "";
            var Dt = commBll.GetListDatatable(sql);
            return JsonConvert.SerializeObject(Dt);
        }
        #endregion

        #region 3 获取学院下的专业
        public string GetMajor()
        {
            string Collegeid = Request.Params["Majorid"];
            string Schoolid = Request.Params["Schoolid"];
            string sql = "select * from tb_Major where SchoolId=" + Schoolid + " and CollegeId=" + Collegeid + "";
            var Dt = commBll.GetListDatatable(sql);
            return JsonConvert.SerializeObject(Dt);
        }
        #endregion


        #region 5 获取班级列表
        public string GetList()
        {
            string wheres = " and a.TeacherId=" + UserId;//老师只能看自己学校的班级
            //查询条件
            if (Request["Schoolid"].ToString() != "0")
            {
                wheres += " and a.SchoolId=" + Request["Schoolid"] + "";
            }
            if (Request["Collegeid"].ToString() != "0")
            {
                wheres += " and a.CollegeId=" + Request["Collegeid"] + "";
            }
            if (Request["Majorid"].ToString() != "0")
            {
                wheres += " and a.MajorId=" + Request["MajorId"] + " ";
            }

            if (Request["ClassName"].Length > 0)
            {
                wheres += " and ((ClassName like '%" + Request["ClassName"] + "%') or (S.SchoolName like '%" + Request["ClassName"] + "%') or (C.CollegeName like '%" + Request["ClassName"] + "%') or (M.MajorName like '%" + Request["ClassName"] + "%') or  ( a.C_ID in (select ClassId from  tb_Student where Name like '%" + Request["ClassName"] + "%' ) ))";
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.AddTime desc"; //排序必须填写
            m.strFld = @" a.*,
(select SchoolName from tb_School where S_ID=a.SchoolId) as SchoolName,
(select CollegeName from tb_College where C_ID=a.CollegeId) as CollegeName,
(select MajorName from tb_Major where M_ID=a.MajorId) as MajorName,
(select COUNT(1) from tb_Student where SchoolId=a.SchoolId and CollegeId=a.CollegeId and MajorId=a.MajorId and ClassId=a.C_ID) as xuesheng";
            m.tab = @"tb_Class a left join tb_School S on S.S_ID=a.SchoolId left join tb_College C on C.C_ID=a.CollegeId left join tb_Major M on M.M_ID=a.MajorId ";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }

        #endregion

    }
}
