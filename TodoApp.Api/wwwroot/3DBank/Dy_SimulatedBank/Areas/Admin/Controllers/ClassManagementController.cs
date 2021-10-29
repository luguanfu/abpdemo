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
    public class ClassManagementController : BaseController
    {
        /***************************************************************
        FileName:管理员端 班级管理
        Copyright（c）2018-金融教育在线技术开发部
        Author:邵世铨
        Create Date:2018-02-26
        ******************************************************************/
        CommonBll commBll = new CommonBll();
        public ActionResult Index()
        {
            DataTable dt = commBll.GetListDatatable("*", "tb_School", "");
            return View(dt);
        }
        #region 1 获取新增时内置年级数据 修改为 获取教师
        public string GetGrade()
        {
            string sql = "select TeacherName,UserId from tb_Teacher where SchoolId=" + Request["SchoolId"];
            var Dt = commBll.GetListDatatable(sql);
            return JsonConvert.SerializeObject(Dt);
        }
        #endregion

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
            string sql = "select * from tb_Major where SchoolId in(" + Schoolid + ") and CollegeId=" + Collegeid + "";
            var Dt = commBll.GetListDatatable(sql);
            return JsonConvert.SerializeObject(Dt);
        }
        #endregion

        #region 4 新增班级
        public int AddClass()
        {
            string Schoolid = Request.Params["Schoolid"];
            string Collegeid = Request.Params["Collegeid"];
            string Majorid = Request.Params["Majorid"];
            string TeacherId = Request.Params["TeacherId"];
            string ClassName = Request.Params["ClassName"];
            //验证是否有重复的班级名称 
            string Sql = "select * from tb_Class where SchoolId=" + Schoolid + " and ClassName='" + ClassName + "'";
            var Dt = commBll.GetListDatatable(Sql);
            if (Dt.Rows.Count > 0)
            {
                return 2;
            }
            //新增
            string Table = "tb_Class";
            string List = "SchoolId,CollegeId,MajorId,TeacherId,ClassName,AddUserId,AddTime";
            string Value = "@SchoolId,@CollegeId,@MajorId,@TeacherId,@ClassName,@AddUserId,@AddTime";
            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@SchoolId",Schoolid),
                new SqlParameter("@CollegeId",Collegeid),
                new SqlParameter("@MajorId",Majorid),
                new SqlParameter("@TeacherId",TeacherId),
                new SqlParameter("@ClassName",ClassName),
                new SqlParameter("@AddUserId",UserId),
                new SqlParameter("@AddTime",DateTime.Now),
            };
            int State = commBll.Add(Table, List, Value, pars);
            return State;
        }
        #endregion

        #region 5 获取班级列表
        public string GetList()
        {
            string wheres = " ";
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
            //if (Request["Gradeid"].ToString() != "0")
            //{
            //    wheres += " and a.Grade=" + Request["Gradeid"] + " ";
            //}
            if (Request["ClassName"].Length > 0)
            {
                wheres += " and ((ClassName like '%" + Request["ClassName"] + "%') or (S.SchoolName like '%" + Request["ClassName"] + "%') or (C.CollegeName like '%" + Request["ClassName"] + "%') or (M.MajorName like '%" + Request["ClassName"] + "%') or (G.TeacherName like '%" + Request["ClassName"] + "%') or ( a.C_ID in (select ClassId from  tb_Student where Name like '%" + Request["ClassName"] + "%' ) ))";
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.AddTime desc"; //排序必须填写
            m.strFld = @" a.*,
(select SchoolName from tb_School where S_ID=a.SchoolId) as SchoolName,
(select CollegeName from tb_College where C_ID=a.CollegeId) as CollegeName,
(select MajorName from tb_Major where M_ID=a.MajorId) as MajorName,
(TeacherName) as GradeYear,
(select COUNT(1) from tb_Student where SchoolId=a.SchoolId and CollegeId=a.CollegeId and MajorId=a.MajorId and ClassId=a.C_ID) as xuesheng";
            m.tab = @"tb_Class a left join tb_School S on S.S_ID=a.SchoolId left join tb_College C on C.C_ID=a.CollegeId left join tb_Major M on M.M_ID=a.MajorId left join tb_Teacher G on G.UserId=a.TeacherId ";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }


        #endregion

        #region 6 删除班级
        public string Delete()
        {
            string Ids = Request["Ids"];
            try
            {
                commBll.DeleteInfo("tb_Class", " and C_ID in(" + Ids + ")");
                commBll.DeleteInfo("tb_User", " and U_ID in (select UserId from tb_Student where ClassId in(" + Ids + "))");
                commBll.DeleteInfo("tb_Student", " and ClassId in(" + Ids + ")");
                return "1";
            }
            catch
            {
                return "99";
            }
        }
        #endregion

    

        #region 11保存修改
        public int UpdateSave()
        {
            string Schoolid = Request.Params["Schoolid"].ToString();
            string CollegeNameId = Request.Params["CollegeNameId"].ToString();
            string Majorid = Request.Params["Majorid"].ToString();
            string TeacherId = Request.Params["Gradeid"].ToString();
            string ClassValue = Request.Params["ClassValue"].ToString();
            string Classid = Request.Params["Classid"].ToString();
            string Table = "tb_Class";
            string Set = "SchoolId=@Schoolid,CollegeId=@CollegeNameId,MajorId=@Majorid,TeacherId=@TeacherId,ClassName=@ClassValue";
            SqlParameter[] pars = new SqlParameter[]
           {
                new SqlParameter("@Schoolid",Schoolid),
                new SqlParameter("@CollegeNameId",CollegeNameId),
                new SqlParameter("@Majorid",Majorid),
                new SqlParameter("@TeacherId",TeacherId),
                 new SqlParameter("@ClassValue",ClassValue),
           };
            int State = commBll.UpdateInfo(Table, Set," and C_ID="+Classid+"",pars);
            if (State == 1)
            {
                return 1;
            }
            else
            {
                return -1;
            }
        }
        #endregion

        #region 12 获取班级信息
        public string GerClassinfo()
        {
            var Cid = Request["C_ID"];
            var Dt = commBll.GetListDatatable("C.*,S.SchoolName", "tb_Class C left join tb_School S on C.SchoolId=S.S_ID", " and C_ID="+ Cid + "");
            return JsonConvert.SerializeObject(Dt);
        }
        #endregion
    }
}
