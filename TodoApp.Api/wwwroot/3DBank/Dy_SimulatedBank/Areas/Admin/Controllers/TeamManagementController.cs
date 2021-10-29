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
using Dy_SimulatedBank.App_Start;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class TeamManagementController : BaseController
    {
        CommonBll commBll = new CommonBll();
        /// <summary>
        /// 团队管理
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }
        public string GetList()
        {
            var SchoolId = commBll.GetListDatatable("SchoolId", "tb_Teacher", " and UserId=" + UserId).Rows[0]["SchoolId"].ToString();
            string wheres = " ";
            //查询条件
            if (Request["txtSchoolName"].Length > 0)
            {
                wheres += " and ( SchoolName like '%" + Request["txtSchoolName"] + "%' or Groupingname like '%" + Request["txtSchoolName"] + "%' or Studentinfo like '%" + Request["txtSchoolName"] + "%')";
            }


            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.AddTime desc"; //排序必须填写
            m.strFld = @"*";
            m.tab = @"(
select G_ID, b.SchoolName,b.province,b.City ,Groupingname,a.AddTime , Studentinfo = (
        stuff(
            (select ',' + cast(Name as varchar(20))+'('+cast(StudentNo as varchar(20))+')' from tb_Student,bsi_Groupingrelation d  where tb_Student.UserId=d.StudentID and d.GroupingnameID=a.G_ID   for xml path('')),
            1,
            1,
            ''
        )
    ) 
from bsi_Groupmanagement a,tb_School b 
where 1=1 and a.SchoolId=b.S_ID and Type=2  and a.SchoolId=" + SchoolId + " ) as a  ";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }
        /// <summary>
        /// 添加团队
        /// </summary>
        /// <returns></returns>
        public string AddGroup()
        {
            string table = "bsi_Groupmanagement"; //表名
            string list = "Groupingname, SchoolId, Type, AddUserId, AddTime";//列
            string vlaue = "@Groupingname, @SchoolId, @Type, @AddUserId, @AddTime";

            var SchoolId = commBll.GetListDatatable("SchoolId", "tb_Teacher", " and UserId=" + UserId).Rows[0]["SchoolId"].ToString();
            var Groupingname = Request["AddGroupName"];


            //校验团队名称是否已存在
            var count = commBll.GetRecordCount("bsi_Groupmanagement", "and Type=2 and Groupingname='" + Groupingname + "'");
            if (count > 0)
            {
                return "77";

            }

            //新增
            SqlParameter[] pars = new SqlParameter[] 
            { 
                new SqlParameter("@Groupingname",Groupingname),
                new SqlParameter("@SchoolId",SchoolId),
                new SqlParameter("@Type",2),
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
        /// 修改团队
        /// </summary>
        /// <returns></returns>
        public string Edit()
        {
            string table = "bsi_Groupmanagement"; //表名
            string Set = "Groupingname=@Groupingname";

            var Groupingname = Request["AddGroupName"];
            var GID = Request["GID"];

            //校验团队名称是否已存在
            var count = commBll.GetRecordCount("bsi_Groupmanagement", "and Type=2 and G_ID not in(" + GID + ")  and Groupingname='" + Groupingname + "'");
            if (count > 0)
            {
                return "77";

            }

            //新增
            SqlParameter[] pars = new SqlParameter[] 
            { 
                 new SqlParameter("@GID",GID),
                new SqlParameter("@Groupingname",Groupingname)
            };
            var resultcount = commBll.UpdateInfo(table, Set, " and G_ID=@GID", pars);
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
                commBll.DeleteInfo("bsi_Groupmanagement", " and G_ID in(" + Ids + ")");
                //删除分组关系表
                commBll.DeleteInfo("bsi_Groupingrelation", " and GroupingnameID in(" + Ids + ")");
                return "1";
            }
            catch
            {
                return "99";
            }


        }
        public string GetStuListSum()
        {
            DataTable data = commBll.GetListDatatable(@"a.G_ID,a.Groupingname,
(select Count(*) from bsi_Groupingrelation  b  where a.G_ID=b.GroupingnameID ) as stunum "
                , "bsi_Groupmanagement a "
                , " and Type=2  and G_ID =  " + Request["G_ID"] + "" + " ");
            string sum = "0";
            if (data.Rows[0]["stunum"] != null && Convert.ToString(data.Rows[0]["stunum"]) != "null")
            {
                sum = data.Rows[0]["stunum"].ToString();
            }
            return sum;
        }
        /// <summary>
        /// 团队成员列表页面
        /// </summary>
        /// <returns></returns>
        public ActionResult TeamListIndex(string name, string ID)
        {
            DataTable data = commBll.GetListDatatable(@"a.G_ID,a.Groupingname,
(select Count(*) from bsi_Groupingrelation  b  where a.G_ID=b.GroupingnameID ) as stunum "
            , "bsi_Groupmanagement a "
            , " and Type=2  and a.G_ID='" + ID.Trim() + "'");
            ViewData["Groupingname"] = name.Replace("'", "");
            ViewData["stunum"] = 0;
            if (data.Rows.Count > 0)
            {
                if (data.Rows[0]["stunum"] != null && Convert.ToString(data.Rows[0]["stunum"]) != "null")
                {
                    ViewData["stunum"] = data.Rows[0]["stunum"];
                }
            }

            ViewData["GID"] = data.Rows[0]["G_ID"];
            var checkeded = commBll.GetRecordCount("bsi_Groupingrelation", " and Groupingstate=1 and GroupingnameID=" + data.Rows[0]["G_ID"]);
            if (checkeded <= 0)
            {
                DataTable dt = commBll.GetListDatatable(@"a.UserId, CollegeName,MajorName,(select GradeYear from tb_Grade where GradeID=b.Grade)  as Grade,ClassName,Name,StudentNo
 ,(select Groupingstate from bsi_Groupingrelation s where s.StudentID=a.UserId  and GroupingnameID in( select G_ID from bsi_Groupmanagement where Type=1)) as Groupingstate"
                , "tb_Student a,tb_Class b,tb_Major c,tb_College d"
                , @"and a.ClassId=b.C_ID and a.MajorId=c.M_ID and a.CollegeId=d.C_ID and UserId in (select StudentID from bsi_Groupingrelation where GroupingnameID =" + data.Rows[0]["G_ID"] + " ) ");
                if (dt.Rows.Count > 0)
                {
                    var SID = dt.Rows[0]["UserId"].ToString();
                    var id = data.Rows[0]["G_ID"].ToString();
                    string table = "bsi_Groupingrelation"; //表名
                    string Set = "Groupingstate=@Groupingstate";

                    SqlParameter[] pars = new SqlParameter[] 
                    { 
                        new SqlParameter("@Groupingstate",'0'),
                        new SqlParameter("@GroupingnameID",id)
                    };
                    var resultcount = commBll.UpdateInfo(table, Set, " and GroupingnameID=@GroupingnameID", pars);
                    int a = 1;
                    SqlParameter[] pars1 = new SqlParameter[] 
                    { 
                        new SqlParameter("@Groupingstate",a),
                        new SqlParameter("@StudentID",SID),
                        new SqlParameter("@GroupingnameID",id)
                    };
                    var resultcount1 = commBll.UpdateInfo(table, Set, " and GroupingnameID=@GroupingnameID and StudentID=@StudentID", pars1);
                }
            }
            return View();
        }
        #region  获取团队成员列表
        public string GetStuList()
        {
            var id = Request["G_ID"];
            string wheres = " and a.ClassId=b.C_ID and  b.MajorId=c.M_ID and c.CollegeId=d.C_ID and UserId in (select StudentID from bsi_Groupingrelation where GroupingnameID =" + id + " )  ";


            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.AddTime desc"; //排序必须填写
            m.strFld = @"a.UserId, CollegeName,MajorName,ClassName,Name,StudentNo
 ,(select Groupingstate from bsi_Groupingrelation s where s.StudentID=a.UserId  and GroupingnameID in( select G_ID from bsi_Groupmanagement where Type=2)) as Groupingstate";
            m.tab = @"tb_Student a,tb_Class b,tb_Major c,tb_College d";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }
        #endregion
        /// <summary>
        /// 剔除成员
        /// </summary>
        /// <returns></returns>
        public string DelGroup()
        {
            string Ids = Request["Ids"];
            try
            {
                //commBll.DeleteInfo("bsi_Groupingrelation", " and G_ID in(" + Ids + ")");

                //删除分组关系表
                commBll.DeleteInfo("bsi_Groupingrelation", " and StudentID in(" + Ids + ")   and GroupingnameID in( select G_ID from bsi_Groupmanagement where Type=2)");
                return "1";
            }
            catch
            {
                return "99";
            }


        }
        #region  修改小队长
        public string UpdateGroupOne()
        {
            var id = Request["G_ID"];
            var SID = Request["SID"];
            string table = "bsi_Groupingrelation"; //表名
            string Set = "Groupingstate=@Groupingstate";

            SqlParameter[] pars = new SqlParameter[] 
            { 
                new SqlParameter("@Groupingstate",'0'),
                new SqlParameter("@GroupingnameID",id)
            };
            var resultcount = commBll.UpdateInfo(table, Set, " and GroupingnameID=@GroupingnameID", pars);
            int a = 1;
            SqlParameter[] pars1 = new SqlParameter[] 
            { 
                new SqlParameter("@Groupingstate",a),
                new SqlParameter("@StudentID",SID),
                new SqlParameter("@GroupingnameID",id)
            };
            var resultcount1 = commBll.UpdateInfo(table, Set, " and GroupingnameID=@GroupingnameID and StudentID=@StudentID", pars1);
            return "1";

            //新增

        }
        #endregion
        /// <summary>
        /// 批量导入团队
        /// </summary>
        /// <returns></returns>
        public string Upload()
        {
            HttpPostedFileBase hpFile = Request.Files[0];
            string filePath = Server.MapPath("/ExcelTemplate/") + hpFile.FileName;
            hpFile.SaveAs(filePath);
            Aspose.Cells.Workbook wk = new Aspose.Cells.Workbook();
#pragma warning disable CS0618 // “Workbook.Open(string)”已过时:“Use Workbook(string) constructor method instead.”
            wk.Open(filePath);
#pragma warning restore CS0618 // “Workbook.Open(string)”已过时:“Use Workbook(string) constructor method instead.”
            int Error = 0;
            int Success = 0;
            for (int i = 0; i < wk.Worksheets[0].Cells.Rows.Count - 2; i++)
            {
                try
                {
                    if (wk.Worksheets[0].Cells[i + 2, 0].Value != null && wk.Worksheets[0].Cells[i + 2, 1].Value != null &&
                        wk.Worksheets[0].Cells[i + 2, 2].Value != null && wk.Worksheets[0].Cells[i + 2, 3].Value != null)
                    {
                        //学校名称
                        string SchoolName = wk.Worksheets[0].Cells[i + 2, 0].Value.ToString().Trim();

                        //团队名称
                        string Groupingname = wk.Worksheets[0].Cells[i + 2, 1].Value.ToString().Trim();
                        //队长帐号
                        string StudentIDS = wk.Worksheets[0].Cells[i + 2, 2].Value.ToString().Trim();
                        //团队成员帐号
                        string StudentID = wk.Worksheets[0].Cells[i + 2, 3].Value.ToString().Trim();
                        var ShcoolID = "";  //学校ID
                        var G_ID = "";    //分组ID
                        var S_ID = "";    //登录ID
                        var S_IDS = "";    //小队长登录ID
                        //根据学校名称得到学校ID
                        var tab = commBll.GetListDatatable("S_ID", "tb_School", " and SchoolName='" + SchoolName + "'");
                        if (tab.Rows.Count == 0)
                        {
                            continue;
                        }
                        else
                        {
                            ShcoolID = tab.Rows[0][0].ToString(); //获取到了学校ID
                        }

                        //根据团队名称得到分组ID
                        var tab1 = commBll.GetListDatatable("G_ID", "bsi_Groupmanagement", " and Groupingname='" + Groupingname + "'  and SchoolId=" + ShcoolID);
                        if (tab1.Rows.Count == 0)  //创建新团队
                        {
                            string list = @"[Groupingname],[SchoolId],[Type],[AddUserId],[AddTime]";
                            string vlaue = "@Groupingname,@SchoolId,@Type,@AddUserId,@AddTime";
                            SqlParameter[] para = new SqlParameter[]{
                                new SqlParameter("@Groupingname",Groupingname),
                                new SqlParameter("@SchoolId", ShcoolID),
                                new SqlParameter("@Type","2"),
                                new SqlParameter("@AddUserId",UserId),
                                new SqlParameter("@AddTime",DateTime.Now)
                            };
                            //新增团队（返回新增的ID）
                            G_ID = commBll.AddIdentity("bsi_Groupmanagement", list, vlaue, para).ToString();
                        }
                        else
                        {
                            G_ID = tab1.Rows[0][0].ToString(); //获取到了分组ID
                        }
                        //根据学生帐号得到登录ID
                        var tab2 = commBll.GetListDatatable("U_ID", "tb_User", " and LoginNo='" + StudentID + "'");
                        if (tab2.Rows.Count == 0)
                        {
                            continue;
                        }
                        else
                        {
                            S_ID = tab2.Rows[0][0].ToString(); //获取到了登陆ID
                        }

                        //判断改学生帐号是否已经在团队
                        int Count = commBll.GetRecordCount("bsi_Groupingrelation", " and GroupingnameID=" + G_ID + " and StudentID=" + S_ID);
                        if (Count > 0)
                        {
                            Error++;
                            continue;
                        }
                        ////判断改学生帐号是否在导入数据的学校
                        //int Count1 = commBll.GetRecordCount("tb_Student", " and UserId=" + S_ID + " and SchoolId=" + ShcoolID);
                        //if (Count1 == 0)
                        //{
                        //    Error++;
                        //    continue;
                        //}
                        else
                        {
                            string list = "GroupingnameID, StudentID, Groupingstate, AddUserId, AddTime";
                            string vlaue = "@GroupingnameID, @StudentID, @Groupingstate, @AddUserId, @AddTime";
                            SqlParameter[] para = new SqlParameter[]{
                                new SqlParameter("@GroupingnameID",G_ID),
                                new SqlParameter("@StudentID", S_ID),
                                new SqlParameter("@Groupingstate","0"),
                                new SqlParameter("@AddUserId",ShcoolID),
                                new SqlParameter("@AddTime",DateTime.Now)
                                
                            };
                            //新增进入团队（返回新增的ID）
                            string InstID = commBll.AddIdentity("bsi_Groupingrelation", list, vlaue, para).ToString();
                            Success++;
                        }
                        //根据小队长帐号得到登录ID
                        var tab3 = commBll.GetListDatatable("U_ID", "tb_User", " and LoginNo='" + StudentIDS + "'");
                        if (tab3.Rows.Count == 0)
                        {
                            continue;
                        }
                        else
                        {
                            S_IDS = tab3.Rows[0][0].ToString(); //获取到了小队长登录ID
                        }
                        //判断改小队长帐号是否在这个团队下面
                        int Count2 = commBll.GetRecordCount("bsi_Groupingrelation", " and GroupingnameID=" + G_ID + " and StudentID='" + S_IDS + "'");
                        if (Count2 == 0)
                        {
                            continue;
                        }
                        //判断改小队长帐号是否已经是小队长
                        int Count3 = commBll.GetRecordCount("bsi_Groupingrelation", "and Groupingstate=1 and GroupingnameID=" + G_ID + " and StudentID='" + S_IDS + "'");
                        if (Count3 > 0)
                        {
                            continue;
                        }
                        else
                        {
                            string table = "bsi_Groupingrelation"; //表名
                            string Set = "Groupingstate=@Groupingstate";

                            SqlParameter[] pars = new SqlParameter[] 
                            { 
                                new SqlParameter("@Groupingstate",'0'),
                                new SqlParameter("@GroupingnameID",G_ID)
                            };
                            var resultcount = commBll.UpdateInfo(table, Set, " and GroupingnameID=@GroupingnameID", pars);
                            int a = 1;
                            SqlParameter[] pars1 = new SqlParameter[] 
                            { 
                                new SqlParameter("@Groupingstate",a),
                                new SqlParameter("@StudentID",S_IDS),
                                new SqlParameter("@GroupingnameID",G_ID)
                            };
                            var resultcount1 = commBll.UpdateInfo(table, Set, " and GroupingnameID=@GroupingnameID and StudentID=@StudentID", pars1);
                        }
                    }                   
                }
#pragma warning disable CS0168 // 声明了变量“ex”，但从未使用过
                catch (Exception ex)
#pragma warning restore CS0168 // 声明了变量“ex”，但从未使用过
                {
                    return "-1";
                }
            }
            ImplementLog.ImpLog(UserSchoolNo, UserId, "新增《" + Convert.ToInt32(wk.Worksheets[0].Cells.Rows.Count - 2) + "》团队成功！");
            var json = new[]{
                new {
                    Error=Error,
                    //CountRows=CountRows,
                    Success=Success
                }
            };
            return JsonConvert.SerializeObject(json);
        }


    }
}
