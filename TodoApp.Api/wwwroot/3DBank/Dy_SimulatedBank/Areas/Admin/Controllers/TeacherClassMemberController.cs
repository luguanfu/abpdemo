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
using System.IO;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class TeacherClassMemberController : BaseController
    {
        /***************************************************************
        FileName:管理员端 班级管理-班级成员管理
        Copyright（c）2018-金融教育在线技术开发部
        Author:邵世铨
        Create Date:2018-02-28
        ******************************************************************/
        CommonBll commBll = new CommonBll();

        public ActionResult Index()
        {
            ViewBag.filePath = System.Configuration.ConfigurationManager.AppSettings["StudentAttachmentPath"].ToString();
            ViewBag.fileName = "导入学生模版.xlsx";
            ViewBag.id = Request["id"];
            return View();
        }
        #region 1 获取班级成员列表信息
        public string GetList(string id)
        {
            string Classid = Request["Classid"].ToString();
            string sql = "select * from tb_Class where C_ID=" + Classid + "";
            var ClassDt = commBll.GetListDatatable(sql);
            string wheres = " and S.SchoolId=" + ClassDt.Rows[0]["SchoolId"] + " and S.CollegeId=" + ClassDt.Rows[0]["CollegeId"] + " and S.MajorId=" + ClassDt.Rows[0]["MajorId"] + " and S.ClassId=" + Classid + "";
            //查询条件

            if (Request["ClassNameid"].Length > 0)
            {
                wheres += " and (S.StudentNo like '%" + Request["ClassNameid"] + "%' or S.Name like '%" + Request["ClassNameid"] + "%'  or S.Phone like '%" + Request["ClassNameid"] + "%' or S.Email like '%" + Request["ClassNameid"] + "%')";
            }
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " S.AddTime desc"; //排序必须填写
            m.strFld = @" S.*,U.LoginNo,U.State,U.Password";
            m.tab = @"tb_Student S left join tb_User U on U.U_ID=S.UserId ";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }

        #endregion

        #region 2 新增学员
        public int AddStudent()
        {
            string StudentName = Request["StudentName"].ToString();
            string AddLoginNo = Request["AddLoginNo"].ToString();
            string Classid = Request["Classid"].ToString();
            string Sql = "Select * from tb_User where LoginNo='" + AddLoginNo + "' ";
            var Dt = commBll.GetListDatatable(Sql);
            if (Dt.Rows.Count > 0)
            {
                return 2;
            }
            string Table = "tb_User";
            string List = "LoginNo,Password,Type,State,AddUserId,AddTime";
            string Value = "@LoginNo,@Password,@Type,@State,@AddUserId,@AddTime";
            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@LoginNo",AddLoginNo),
                new SqlParameter("@Password","888888"),
                new SqlParameter("@Type",3),
                new SqlParameter("@State",1),
                new SqlParameter("@AddUserId",1),
                new SqlParameter("@AddTime",DateTime.Now),
            };
            var Userid = commBll.AddIdentity(Table, List, Value, pars);
            string Ssql = "select * from tb_Class where C_ID=" + Classid + "";
            var ClassDt = commBll.GetListDatatable(Ssql);

            string StudentTable = "tb_Student";
            string StudentList = "SchoolId,CollegeId,MajorId,ClassId,UserId,StudentNo,Name,Sex,Phone,Email,AddUserId,AddTime";
            string StudentValue = "@SchoolId,@CollegeId,@MajorId,@ClassId,@UserId,@StudentNo,@Name,@Sex,@Phone,@Email,@AddUserId,@AddTime";

            SqlParameter[] Studentpars = new SqlParameter[]
            {
                new SqlParameter("@SchoolId",ClassDt.Rows[0]["SchoolId"]),
                new SqlParameter("@CollegeId",ClassDt.Rows[0]["CollegeId"]),
                new SqlParameter("@MajorId",ClassDt.Rows[0]["MajorId"]),
                new SqlParameter("@ClassId",Classid),
                new SqlParameter("@UserId",Userid),
                new SqlParameter("@StudentNo",AddLoginNo),
                new SqlParameter("@Name",StudentName),
                new SqlParameter("@Sex",null),
                new SqlParameter("@Phone",null),
                new SqlParameter("@Email",null),
                new SqlParameter("@AddUserId",UserId),
                new SqlParameter("@AddTime",DateTime.Now),
            };
            int State = commBll.Add(StudentTable, StudentList, StudentValue, Studentpars);
            return State;
        }
        #endregion

        #region 3 启用学生
        public string Enable()
        {
            string Ids = Request["Ids"];
            try
            {
                commBll.UpdateInfo("tb_User", " State=1 ", " and U_ID in(" + Ids + ")");
                return "1";
            }
            catch
            {
                return "99";
            }
        }
        #endregion

        #region 4 禁用学生
        public string Disable()
        {
            string Ids = Request["Ids"];
            try
            {
                commBll.UpdateInfo("tb_User", " State=0 ", " and U_ID in(" + Ids + ")");
                return "1";
            }
            catch
            {
                return "99";
            }
        }
        #endregion

        #region 5 删除学生
        public string Delete()
        {
            string Ids = Request["Ids"];
            try
            {
                commBll.DeleteInfo("tb_User", " and U_ID in(" + Ids + ")");
                commBll.DeleteInfo("bsi_Groupingrelation", " and StudentID in(" + Ids + ")");
                commBll.DeleteInfo("tb_Student", " and UserId in(" + Ids + ")");
                return "1";
            }
            catch
            {
                return "99";
            }
        }
        #endregion

        #region 6 批量上传学生
        [HttpPost]
        public string Upload()
        {
            HttpPostedFileBase hpFile = Request.Files[0];
            string filePath = Server.MapPath("/ExcelTemplate/") + hpFile.FileName;
            hpFile.SaveAs(filePath);
            Aspose.Cells.Workbook wk = new Aspose.Cells.Workbook();
#pragma warning disable CS0618 // “Workbook.Open(string)”已过时:“Use Workbook(string) constructor method instead.”
            wk.Open(filePath);
#pragma warning restore CS0618 // “Workbook.Open(string)”已过时:“Use Workbook(string) constructor method instead.”
            int Correct = 0;
            int Error = 0;
            for (int i = 0; i < wk.Worksheets[0].Cells.Rows.Count - 2; i++)
            {
                try
                {
                    if (wk.Worksheets[0].Cells[i + 2, 0].Value != null && wk.Worksheets[0].Cells[i + 2, 1].Value != null)
                    {
                        //学生姓名
                        string StudentName = wk.Worksheets[0].Cells[i + 2, 0].Value.ToString().Trim();

                        //学号
                        string StudentNo = wk.Worksheets[0].Cells[i + 2, 1].Value.ToString().Trim();
                        //性别
                        string StudentSex = "";
                        try
                        {
                            StudentSex = wk.Worksheets[0].Cells[i + 2, 2].Value.ToString().Trim();
                        }
                        catch
                        {
                            StudentSex = "";
                        }

                        //手机
                        string StudentMobile = "";
                        try
                        {
                            StudentMobile = wk.Worksheets[0].Cells[i + 2, 3].Value.ToString().Trim();
                        }
                        catch
                        {
                            StudentMobile = "";
                        }
                        //邮箱
                        string StudentEmail = "";
                        try
                        {
                            StudentEmail = wk.Worksheets[0].Cells[i + 2, 4].Value.ToString().Trim();
                        }
                        catch
                        {
                            StudentEmail = "";
                        }
                        //检查学号是否重复
                        string sql = "select * from tb_User where LoginNo='" + StudentNo + "'";
                        var Dt = commBll.GetListDatatable(sql);
                        if (Dt.Rows.Count > 0)
                        {
                            //重复账号不允许导入
                            Error += 1;
                        }
                        else
                        {
                            //此处可能要判断手机号，和邮箱是否为正确，单可以是非必须填的所以不验证
                            string UserTable = "tb_User";
                            string UserList = "LoginNo,Password,Type,State,AddUserId,AddTime";
                            string UserValue = "@LoginNo,@Password,@Type,@State,@AddUserId,@AddTime";

                            SqlParameter[] Usertpars = new SqlParameter[]
                            {
                             new SqlParameter("@LoginNo",StudentNo),
                             new SqlParameter("@Password","888888"),
                             new SqlParameter("@Type",3),
                             new SqlParameter("@State",1),
                             new SqlParameter("@AddUserId",UserId),
                             new SqlParameter("@AddTime",DateTime.Now),
                            };
                            var UUserid = commBll.AddIdentity(UserTable, UserList, UserValue, Usertpars);
                            string Classid = Request["Classid"];
                            string Ssql = "select * from tb_Class where C_ID=" + Classid + "";
                            var ClassDt = commBll.GetListDatatable(Ssql);

                            string StudentTable = "tb_Student";
                            string StudentList = "SchoolId,CollegeId,MajorId,ClassId,UserId,StudentNo,Name,Sex,Phone,Email,AddUserId,AddTime";
                            string StudentValue = "@SchoolId,@CollegeId,@MajorId,@ClassId,@UserId,@StudentNo,@Name,@Sex,@Phone,@Email,@AddUserId,@AddTime";
                            int Sex;
                            Sex = StudentSex == "男" ? 0 : 1;
                            SqlParameter[] Studentpars = new SqlParameter[]
                            {
                new SqlParameter("@SchoolId",ClassDt.Rows[0]["SchoolId"]),
                new SqlParameter("@CollegeId",ClassDt.Rows[0]["CollegeId"]),
                new SqlParameter("@MajorId",ClassDt.Rows[0]["MajorId"]),
                new SqlParameter("@ClassId",Classid),
                new SqlParameter("@UserId",UUserid),
                new SqlParameter("@StudentNo",StudentNo),
                new SqlParameter("@Name",StudentName),
                new SqlParameter("@Sex",Sex),
                new SqlParameter("@Phone",StudentMobile),
                new SqlParameter("@Email",StudentEmail),
                new SqlParameter("@AddUserId",UserId),
                  new SqlParameter("@AddTime",DateTime.Now),
                            };
                            int State = commBll.Add(StudentTable, StudentList, StudentValue, Studentpars);
                            Correct += 1;
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

            var json = new[]{
                new {
                    Error=Error,

                    Success=Correct
                }
            };
            return JsonConvert.SerializeObject(json);
        }

        /// <summary>
        /// 判断输入的字符串是否是一个合法的手机号
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>

        #endregion


        #region 7 下载模板
        public FileStreamResult DownFile(string filePath, string fileName)
        {
            string absoluFilePath = Server.MapPath(System.Configuration.ConfigurationManager.AppSettings["StudentAttachmentPath"] + fileName);
            return File(new FileStream(absoluFilePath, FileMode.Open), "application/octet-stream", Server.UrlEncode(fileName));
        }
        #endregion

        #region 8 评价学员
        public string GetStudentRating()
        {
            return JsonConvert.SerializeObject(commBll.GetListDatatable("*", "bsi_StudentRating", ""));
        }

        /// <summary>
        /// 新增或者编辑对学生评价
        /// </summary>
        /// <returns></returns>
        public string DoingAddEdit()
        {
            string rank = Request["rank"].ToString();//评级等级id
            if (rank == "")
            {
                rank = null;
            }
            string teacherComment = Request["teacherComment"].ToString();//评价语
            string studentId = Request["studentId"].ToString();//学生id

            string Ssql = "select * from bsi_Evaluate where StuId=" + studentId + "";
            var studentDt = commBll.GetListDatatable(Ssql);
            if (studentDt != null && studentDt.Rows.Count > 0)//存在做更新，否则新增
            {
                string StudentTable = "bsi_Evaluate";
                string set = "TeacherRanKId=@TeacherRanKId, TeacherComment=@TeacherComment, StuId=@StuId, TeacherTime=@TeacherTime";

                SqlParameter[] Studentpars = new SqlParameter[]
                {
                    new SqlParameter("@TeacherRanKId",rank),
                    new SqlParameter("@teacherComment",teacherComment),
                    new SqlParameter("@StuId",studentId),
                    new SqlParameter("@TeacherTime",DateTime.Now),
                };
                var resultcount = commBll.UpdateInfo(StudentTable, set, " and StuId=@StuId ", Studentpars);
                if (resultcount == 1)
                {
                    return "1";
                }
                else
                {
                    return "99";
                }
            }
            else
            {
                string StudentTable = "bsi_Evaluate";
                string StudentList = "TeacherRanKId, TeacherComment, StuId, TeacherTime, UserId";
                string StudentValue = "@TeacherRanKId,@TeacherComment,@StuId,@TeacherTime,@UserId";
                SqlParameter[] Studentpars = new SqlParameter[]
                {
                    new SqlParameter("@TeacherRanKId",rank),
                    new SqlParameter("@teacherComment",teacherComment),
                    new SqlParameter("@StuId",studentId),
                    new SqlParameter("@TeacherTime",DateTime.Now),
                    new SqlParameter("@UserId",UserId),
                };
                int resultcount = commBll.Add(StudentTable, StudentList, StudentValue, Studentpars);
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

        /// <summary>
        /// 获得单个对象
        /// </summary>
        /// <returns></returns>
        public string GetEvaluateById()
        {
            string studentId = Request["studentId"].ToString();//学生id
            return JsonConvert.SerializeObject(commBll.GetListDatatable("*", "bsi_Evaluate", " and StuId=" + studentId));
        }

        /// <summary>
        /// 导出评价模板
        /// </summary>
        /// <returns></returns>
        public string ExportTemplate()
        {
            Workbook wk = new Workbook();

            string excelFile = string.Empty;
            excelFile = "/ExcelTemplate/导入评价模板.xlsx";
#pragma warning disable CS0618 // “Workbook.Open(string)”已过时:“Use Workbook(string) constructor method instead.”
            wk.Open(System.Web.HttpContext.Current.Server.MapPath(excelFile));
#pragma warning restore CS0618 // “Workbook.Open(string)”已过时:“Use Workbook(string) constructor method instead.”

            var dt = commBll.GetListDatatable("SELECT Name,StudentNo FROM dbo.tb_Student WHERE ClassId=" + Request["classid"]);

            if (dt != null && dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    wk.Worksheets[0].Cells[2 + i, 0].PutValue(dt.Rows[i]["Name"]);//姓名
                    wk.Worksheets[0].Cells[2 + i, 1].PutValue(dt.Rows[i]["StudentNo"]);//学号
                }
            }

            string filename = "";
            string ExcelName = DateTime.Now.ToString("yyyyMMdd") + "" + DateTime.Now.Millisecond + "导入评价模板";
            filename = "/ExcelTemplate/" + ExcelName + ".xlsx";

            string serverPath = System.Web.HttpContext.Current.Server.MapPath(filename);

            wk.Save(serverPath, SaveFormat.Auto);

            var json = new object[] {
                        new{
                            filename=filename,
                        }
                    };
            return JsonConvert.SerializeObject(json);
        }

        #region  批量上传
        [HttpPost]
        public string UploadEvaluate()
        {
            HttpPostedFileBase hpFile = Request.Files[0];
            string filePath = Server.MapPath("/ExcelTemplate/") + hpFile.FileName;
            hpFile.SaveAs(filePath);
            Aspose.Cells.Workbook wk = new Aspose.Cells.Workbook();
#pragma warning disable CS0618 // “Workbook.Open(string)”已过时:“Use Workbook(string) constructor method instead.”
            wk.Open(filePath);
#pragma warning restore CS0618 // “Workbook.Open(string)”已过时:“Use Workbook(string) constructor method instead.”
            int Correct = 0;
            int Error = 0;
            for (int i = 0; i < wk.Worksheets[0].Cells.Rows.Count - 2; i++)
            {
                try
                {
                    if (wk.Worksheets[0].Cells[i + 2, 0].Value != null && wk.Worksheets[0].Cells[i + 2, 1].Value != null)
                    {
                        //姓名
                        string name = wk.Worksheets[0].Cells[i + 2, 0].Value.ToString().Trim();
                        //账号
                        string StudentNo = wk.Worksheets[0].Cells[i + 2, 1].Value.ToString().Trim();
                        //评级等级
                        string rank = null;
                        //评语
                        string teacherComment = null;

                        int? rankId = null;
                        try
                        {
                            rank = wk.Worksheets[0].Cells[i + 2, 2].Value.ToString().Trim();

                            string sqlr = "select * from bsi_StudentRating where RankName='" + rank + "'";
                            var dataTable = commBll.GetListDatatable(sqlr);
                            if (dataTable != null && dataTable.Rows.Count > 0)
                            {
                                rankId = Convert.ToInt32(dataTable.Rows[0]["ID"]);
                            }
                        }
                        catch (Exception)
                        {
                            rankId = null;
                        }

                        try
                        {
                            teacherComment = wk.Worksheets[0].Cells[i + 2, 3].Value.ToString().Trim();
                        }
                        catch (Exception)
                        {
                            teacherComment = null;
                        }

                        int userid = 0;
                        //根据账号获取用户id
                        string sql = "select * from tb_Student where StudentNo='" + StudentNo + "' and Classid=" + Request["Classid"];
                        var uDt = commBll.GetListDatatable(sql);
                        if (uDt != null && uDt.Rows.Count > 0)//存在
                        {
                            userid = Convert.ToInt32(uDt.Rows[0]["UserId"]);

                            //检查是否重复
                            string sqlstr = "select * from bsi_Evaluate where StuId='" + userid + "'";
                            var Dt = commBll.GetListDatatable(sqlstr);
                            if (Dt.Rows.Count > 0)
                            {
                                string StudentTable = "bsi_Evaluate";
                                string set = "TeacherRanKId=@TeacherRanKId, TeacherComment=@TeacherComment, StuId=@StuId, TeacherTime=@TeacherTime";
                                SqlParameter[] Studentpars = new SqlParameter[]
                                {
                                new SqlParameter("@TeacherRanKId",rankId),
                                new SqlParameter("@teacherComment",teacherComment),
                                new SqlParameter("@StuId",userid),
                                new SqlParameter("@TeacherTime",DateTime.Now),
                                };
                                var resultcount = commBll.UpdateInfo(StudentTable, set, " and StuId=@StuId ", Studentpars);
                                //if (resultcount == 1)
                                //{
                                //    return "1";
                                //}
                                //else
                                //{
                                //    return "99";
                                //}
                                Correct += 1;
                            }
                            else
                            {
                                string StudentTable = "bsi_Evaluate";
                                string StudentList = "TeacherRanKId, TeacherComment, StuId, TeacherTime, UserId";
                                string StudentValue = "@TeacherRanKId,@TeacherComment,@StuId,@TeacherTime,@UserId";
                                SqlParameter[] Studentpars = new SqlParameter[]
                                {
                                new SqlParameter("@TeacherRanKId",rankId),
                                new SqlParameter("@teacherComment",teacherComment),
                                new SqlParameter("@StuId",userid),
                                new SqlParameter("@TeacherTime",DateTime.Now),
                                new SqlParameter("@UserId",UserId),
                                };
                                int resultcount = commBll.Add(StudentTable, StudentList, StudentValue, Studentpars);
                                //if (resultcount == 1)
                                //{
                                //    return "1";
                                //}
                                //else
                                //{
                                //    return "99";
                                //}
                                Correct += 1;
                            }
                        }
                        else //不存在
                        {
                            //重复账号不允许导入
                            Error += 1;
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

            var json = new[]{
                new {
                    Error=Error,
                    Success=Correct
                }
            };
            return JsonConvert.SerializeObject(json);
        }


        #endregion

        #endregion
    }
}
