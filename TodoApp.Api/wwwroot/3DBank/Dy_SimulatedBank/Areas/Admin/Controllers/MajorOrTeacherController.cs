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
    public class MajorOrTeacherController : BaseController
    {
        //
        // GET: /Admin/MajorOrTeacher/

        /***************************************************************
        FileName:管理员端 专业管理、教师管理
        Copyright（c）2018-金融教育在线技术开发部
        Author:唐雄剑
        Create Date:2018-02-26
        ******************************************************************/
        CommonBll commBll = new CommonBll();


        #region 专业管理 2018-02-26
        public ActionResult Major()
        {
            return View();
        }
        /// <summary>
        /// 专业列表
        /// </summary>
        /// <returns></returns>
        public string MajorGetList()
        {
            string School = Request["School"];
            string College = Request["College"];
            string Keyword = Request["Keyword"];

            string wheres = "";//" and Mstate in (2,3) and b.PlatformID=" + PlatId;
            if (!string.IsNullOrEmpty(School))
            {
                wheres += " and m.SchoolId=" + School;
            }
            if (!string.IsNullOrEmpty(College))
            {
                wheres += " and m.CollegeId=" + College;
            }
            if (!string.IsNullOrEmpty(Keyword))
            {
                wheres += " and (m.MajorName like '%" + Keyword + "%' or (select top 1 s.SchoolName from tb_School s where s.S_ID=m.SchoolId) like '%" + Keyword + "%' or (select top 1 c.CollegeName from tb_College c where c.C_ID=m.CollegeId) like '%" + Keyword + "%' )";
            }
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " m.AddTime "; //排序必须填写
            m.strFld = @"m.M_ID,(select top 1 s.SchoolName from tb_School s where s.S_ID=m.SchoolId) as SchoolName,m.SchoolId,
                        (select top 1 c.CollegeName from tb_College c where c.C_ID=m.CollegeId) as CollegeName,m.CollegeId,
                        m.MajorName,
                        (select COUNT(1) from tb_Class l where l.SchoolId=m.SchoolId and l.CollegeId=m.CollegeId and l.MajorId=m.M_ID) ClassCou,
                        (select COUNT(1) from tb_Student t where t.SchoolId=m.SchoolId and t.CollegeId=m.CollegeId and t.MajorId=m.M_ID) StudentCou";
            m.tab = "tb_Major m ";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }
        /// <summary>
        /// 编辑专业
        /// </summary>
        /// <returns></returns>
        public string EditMajor()
        {
            string School = Request["School"];
            string College = Request["College"];
            string MajorName = Request["MajorName"];
            string M_ID = Request["M_ID"];

            if (!string.IsNullOrEmpty(M_ID))//修改
            {
                if (GetCount("tb_Major", " and SchoolId=" + School + " and MajorName='" + MajorName + "' and M_ID!=" + M_ID))//是否存在重复
                {
                    return "2";
                }
                var count = SqlHelper.ExecuteNonQuery("update tb_Major set SchoolId=" + School + ",CollegeId=" + College + ",MajorName='" + MajorName + "'where M_ID=" + M_ID);
                if (count > 0)
                {
                    return "1";
                }
                return "0";
            }
            else
            {
                if (GetCount("tb_Major", " and SchoolId=" + School + " and MajorName='" + MajorName + "'"))//是否存在重复
                {
                    return "2";
                }
                //新增
                string table = "tb_Major"; //表名
                string list = "SchoolId, CollegeId, MajorName,AddUserId,AddTime";//列
                string vlaue = "@SchoolId, @CollegeId, @MajorName,@AddUserId,@AddTime";
                SqlParameter[] pars = new SqlParameter[]
                    {
                        new SqlParameter("@SchoolId",School),
                        new SqlParameter("@CollegeId",College),
                        new SqlParameter("@MajorName",MajorName),
                        new SqlParameter("@AddUserId",UserId),
                        new SqlParameter("@AddTime",DateTime.Now)
                    };
                var count = commBll.Add(table, list, vlaue, pars);
                if (count > 0)
                {
                    return "1";
                }
                return "0";
            }




        }

        /// <summary>
        /// 删除专业  
        /// </summary>
        /// <returns></returns>
        public string DelMajor()
        {
            string Ids = Request["Ids"];
            try
            {
                commBll.DeleteInfo("tb_Major", " and M_ID in(" + Ids + ")");

                //      确定后，从系统中删除对应学校信息及下方所有组织及帐号，
                //      学生端、教师端对应用户在系统中进行任意操作，退回至登录页，不影响已进行的操作

                //删除数据
                //删除学生登陆号
                commBll.DeleteInfo("tb_User", " and U_ID in(select UserId from tb_Student where MajorId in(" + Ids + "))");
                //删除学生表
                commBll.DeleteInfo("tb_Student", " and  MajorId in(" + Ids + ")");

                //删除班级
                commBll.DeleteInfo("tb_Class", " and  MajorId in(" + Ids + ")");
                return "1";
            }
            catch
            {
                return "0";
            }


        }



        #endregion


        #region 教师管理 2018-02-27
        public ActionResult Teacher()
        {
            return View();
        }
        /// <summary>
        /// 教师列表
        /// </summary>
        /// <returns></returns>
        public string TeacherGetList()
        {
            string School = Request["School"];
            string Keyword = Request["Keyword"];

            string wheres = "";//" and Mstate in (2,3) and b.PlatformID=" + PlatId;
            if (!string.IsNullOrEmpty(School))
            {
                wheres += " and t.SchoolId=" + School;
            }
            if (!string.IsNullOrEmpty(Keyword))
            {
                wheres += " and ((select top 1 s.SchoolName from tb_School s where s.S_ID=t.SchoolId) like '%" + Keyword + "%' or t.TeacherName like '%" + Keyword + "%' or u.LoginNo like '%" + Keyword + "%' or t.Contact like '%" + Keyword + "%' )";
            }
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " t.AddTime "; //排序必须填写
            m.strFld = @" t.T_ID,u.U_ID,(select top 1 s.SchoolName from tb_School s where s.S_ID=t.SchoolId) as SchoolName,t.SchoolId,
                            u.LoginNo, t.TeacherName,u.Password,t.Contact,t.Email,u.State";
            m.tab = "tb_Teacher t left join tb_User u on(t.UserId=u.U_ID)";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }
        /// <summary>
        /// 编辑教师
        /// </summary>
        /// <returns></returns>
        public string EditTeacher()
        {
            string School = Request["School"];
            string TeacherName = Request["TeacherName"];
            string LoginNo = Request["LoginNo"];
            string U_ID = Request["U_ID"];
            string Contact = Request["Contact"];
            string Email = Request["Email"];
            //用户表
            string table = "tb_User"; //表名

            //教师表
            string tables = "tb_Teacher"; //表名

            if (!string.IsNullOrEmpty(U_ID))//修改
            {
                if (GetCount("tb_User", " and  LoginNo='" + LoginNo + "' and U_ID<>" + U_ID))//是否存在重复
                {
                    return "2";
                }
                string set = "LoginNo=@LoginNo";
                string where = " and U_ID=@U_ID";
                SqlParameter[] pars = new SqlParameter[]
                         {
                        new SqlParameter("@LoginNo",LoginNo),
                        new SqlParameter("@U_ID",U_ID)
                         };
                var r = commBll.UpdateInfo(table, set, where, pars);
                if (r > 0)
                {
                    string sets = "SchoolId=@SchoolId,TeacherName=@TeacherName,Contact=@Contact,Email=@Email";
                    string wheres = " and UserId=@UserId";
                    SqlParameter[] parss = new SqlParameter[]
                             {
                        new SqlParameter("@SchoolId",School),
                        new SqlParameter("@TeacherName",TeacherName),
                        new SqlParameter("@Contact",Contact),
                        new SqlParameter("@Email",Email),
                        new SqlParameter("@UserId",U_ID)
                             };
                    var rs = commBll.UpdateInfo(tables, sets, wheres, parss);
                    if (rs > 0)
                    {
                        return "1";
                    }
                }


            }
            else //添加
            {
                if (GetCount("tb_User", " and  LoginNo='" + LoginNo + "'"))//是否存在重复
                {
                    return "2";
                }

                string list = "LoginNo, Password, Type,State,AddUserId,AddTime";//列
                string vlaue = "@LoginNo, @Password, @Type,@State,@AddUserId,@AddTime";
                SqlParameter[] pars = new SqlParameter[]
                        {
                        new SqlParameter("@LoginNo",LoginNo),
                        new SqlParameter("@Password","888888"),
                        new SqlParameter("@Type","2"),
                        new SqlParameter("@State","1"),
                        new SqlParameter("@AddUserId",UserId),
                        new SqlParameter("@AddTime",DateTime.Now)
                        };
                var count = commBll.AddIdentity(table, list, vlaue, pars);
                if (Convert.ToInt32(count) > 0)
                {

                    string lists = "SchoolId, UserId, TeacherName,Contact,Email,AddUserId,AddTime";//列
                    string vlaues = "@SchoolId, @UserId, @TeacherName,@Contact,@Email,@AddUserId,@AddTime";
                    SqlParameter[] parss = new SqlParameter[]
                            {
                        new SqlParameter("@SchoolId",School),
                        new SqlParameter("@UserId",count),
                        new SqlParameter("@TeacherName",TeacherName),
                        new SqlParameter("@Contact",Contact),
                        new SqlParameter("@Email",Email),
                        new SqlParameter("@AddUserId",UserId),
                        new SqlParameter("@AddTime",DateTime.Now)
                            };
                    var counts = commBll.Add(tables, lists, vlaues, parss);
                    if (counts > 0)
                    {
                        return "1";
                    }
                }
            }
            return "0";
        }

        /// <summary>
        /// 删除教师
        /// </summary>
        /// <returns></returns>
        public string DelTeacher()
        {
            string Ids = Request["Ids"];
            try
            {
                commBll.DeleteInfo("tb_User", " and U_ID in(" + Ids + ")");
                commBll.DeleteInfo("tb_Teacher", " and UserId in(" + Ids + ")");

                return "1";
            }
            catch
            {
                return "0";
            }


        }

        /// <summary>
        /// 启用/禁用 教师
        /// </summary>
        /// <returns></returns>
        public string EnableTeacher()
        {
            string Ids = Request["Ids"];
            string State = Request["State"];
            try
            {
                var r = commBll.UpdateInfo("tb_User", "State=" + State, " and U_ID in(" + Ids + ")");
                if (r > 0)
                {
                    return "1";
                }
                return "0";
            }
            catch
            {
                return "0";
            }
        }

        /// <summary>
        /// 重置密码 教师
        /// </summary>
        /// <returns></returns>
        public string ResetTeacher()
        {
            string U_ID = Request["U_ID"];
            try
            {
                var r = commBll.UpdateInfo("tb_User", "Password='888888'", "and U_ID =" + U_ID);
                if (r > 0)
                {
                    return "1";
                }
                return "0";
            }
            catch
            {
                return "0";
            }
        }

        #endregion
    }

}
