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
    public class TeachinghoursController : BaseController
    {
        //
        // GET: /Admin/Teachinghours/
        /***************************************************************
   FileName:教师端 课时安排
   Copyright（c）2018-金融教育在线技术开发部
   Author:伍贤成
   Create Date:2018-7-24
   ******************************************************************/
        CommonBll commBll = new CommonBll();

        public ActionResult Index()
        {
            string wheres = " and SchoolId in (select SchoolId from tb_Teacher where UserId=" + UserId + ")";//老师只能看自己

            DataTable dt = commBll.GetListDatatable("*", "tb_College", wheres);
            return View(dt);
        }

        //获取列表
        public string GetList()
        {

            string wheres = " and TeacherId=" + UserId + "";
            if (Request["CollegeNameId"].ToString() != "0")
            {
                wheres += " and a.CollegeId =" + Request["CollegeNameId"] + "";
            }
            if (Request["Majorid"].ToString() != "0")
            {
                wheres += " and a.MajorId =" + Request["Majorid"] + "";
            }
            if (Request["ClassNameid"].Length > 0)
            {
                wheres += " and a.ClassName like '%" + Request["ClassNameid"] + "%'";
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["Page"]) ? int.Parse(Request["Page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.AddTime desc";
            m.strFld = @"a.*,(select CollegeName from tb_College where C_ID=a.CollegeId) as CollegeName,(select MajorName from tb_Major where M_ID=a.MajorId) as MajorName,
	(select COUNT(1) from tb_Student where CollegeId=a.CollegeId and MajorId=a.MajorId and ClassId=a.C_ID) as Pcount";
            m.tab = @"tb_Class a left join tb_College C on C.C_ID=a.CollegeId left join tb_Major M on M.M_ID=a.MajorId";
            m.strWhere = wheres;
            int PageCount = 0;//分页总数
            var dt = Pager.GetList(m, ref PageCount);

            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }

        //课时详情
        public ActionResult Detailed()
        {

            Session["C_ID"] = Request["id"];

            var dt = commBll.GetListDatatable("select * from tb_Class where C_ID = " + Request["id"] + "");
            ViewData["ClassName"] = dt.Rows[0]["ClassName"];

            return View();
        }

        //安排详情数据列表
        public string GetCurriculumList()
        {
            var udt = commBll.GetListDatatable("select * from tb_User where LoginNo = 'admin'");

            string wheres = " and [State]=1 and (AddUserId=" + UserId + " OR  AddUserId= " + udt.Rows[0]["U_ID"] + ") ";

            if (!string.IsNullOrEmpty(Request["CurriculumName"]))
            {
                wheres += " and CurriculumName like '%" + Request["CurriculumName"] + "%'";
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["Page"]) ? int.Parse(Request["Page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.AddTime desc";
            m.strFld = @"a.*,
(SELECT COUNT(1) FROM bsi_Chapter b WHERE b.CurriculumID=a.ID)AS ChapterCount,
(SELECT COUNT(1) FROM dbo.bsi_Section c WHERE c.CurriculumID=a.ID) AS SectionCount";
            m.tab = @" dbo.bsi_Curriculum a ";
            m.strWhere = wheres;
            int PageCount = 0;//分页总数

            var dt = Pager.GetList(m, ref PageCount);

            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }

        //课时详情列表
        public string GetDetailedList()
        {
            var Type = Request["Type"];

            DataTable dt = new DataTable();
            if (Type == "1")
            {//获取列表
                var cid = int.Parse(Session["C_ID"].ToString());
                dt = commBll.GetListDatatable("select * from bsi_ClassHourM where ClassId in (" + cid + ")");
            }
            if (Type == "2")
            {//编辑获取数据
                var hid = Request["Ids"];
                dt = commBll.GetListDatatable("select * from bsi_ClassHourM where ID in (" + hid + ")");
            }
            if (Type == "3")//首页
            {

                dt = commBll.GetListDatatable("select * from bsi_ClassHourM where ClassId in (select ClassId from tb_Student where UserId =" + UserId + ")");
            }


            return JsonConvert.SerializeObject(dt);
        }

        //新增编辑
        public string EditAdd()
        {
            try
            {

                var StudyTime = Request["StudyTime"];
                var Nr = Request["Nr"];
                var Id = Request["Id"];
                var cid = int.Parse(Session["C_ID"].ToString());
                string tab = "bsi_ClassHourM";
                //新增查重
                int rein = commBll.GetRecordCount("bsi_ClassHourM", " and LearningContent='" + Nr + "' and LongLearningTime='" + StudyTime + "' and ClassId=" + cid + "");
                if (rein > 0)
                {
                    return "99";
                }

                string list = "ClassId,LearningContent,LongLearningTime,AddUserId,AddTime";
                string value = "@ClassId,@LearningContent,@LongLearningTime,@AddUserId,@AddTime";

                SqlParameter[] parsin = new SqlParameter[]{
                new SqlParameter("@ClassId",cid),
                new SqlParameter("@LearningContent",Nr),
                new SqlParameter("@LongLearningTime",StudyTime),
                new SqlParameter("@AddUserId",UserId),
                new SqlParameter("@AddTime",DateTime.Now)
                };

                int re = commBll.Add(tab, list, value, parsin);
                if (re > 0)
                {
                    return "1";
                }
                return "99";

            }
            catch (Exception)
            {

                return "88";
            }
        }

        //编辑
        public string Bj()
        {

            try
            {

                var StudyTime = Request["StudyTime"];
                var Nr = Request["Nr"];
                var Id = Request["Id"];
                var cid = int.Parse(Session["C_ID"].ToString());
                string tab = "bsi_ClassHourM";

                string set = "LearningContent=@LearningContent,LongLearningTime=@LongLearningTime";

                SqlParameter[] parsup = new SqlParameter[]{
                  new SqlParameter("@LearningContent",Nr),
                  new SqlParameter("@LongLearningTime",StudyTime)
                  };

                commBll.UpdateInfo(tab, set, " and ID=" + Id + "", parsup);

                return "1";


            }
            catch (Exception)
            {

                return "99";
            }

        }

        //删除

        public string Del()
        {

            try
            {
                var id = Request["Ids"].ToString();

                commBll.DeleteInfo("bsi_ClassHourM", " and ID in (" + id + ")");

                return "1";
            }
            catch (Exception)
            {

                return "99";
            }
        }

        //学院
        public string GetCollege()
        {
            var Dt = commBll.GetListDatatable("select * from tb_College");
            return JsonConvert.SerializeObject(Dt);
        }
        //专业
        public string GetMajor()
        {
            string Collegeid = Request.Params["CollegeId"];

            string sql = "select * from tb_Major where  CollegeId=" + Collegeid + "";
            var Dt = commBll.GetListDatatable(sql);
            return JsonConvert.SerializeObject(Dt);
        }

        //统一安排
        public string Ty()
        {
            try
            {
                var cid = Request["Hid"];

                string wheres = " and TeacherId=" + UserId + "";
                if (Request["CollegeNameId"].ToString() != "0")
                {
                    wheres += " and a.CollegeId =" + Request["CollegeNameId"] + "";
                }
                if (Request["Majorid"].ToString() != "0")
                {
                    wheres += " and a.MajorId =" + Request["Majorid"] + "";
                }
                if (Request["ClassNameid"].Length > 0)
                {
                    wheres += " and a.ClassName like '%" + Request["ClassNameid"] + "%'";
                }
                var class_dt = commBll.GetListDatatable(@"a.*,(select CollegeName from tb_College where C_ID=a.CollegeId) as CollegeName,(select MajorName from tb_Major where M_ID=a.MajorId) as MajorName,
    (select COUNT(1) from tb_Student where CollegeId = a.CollegeId and MajorId = a.MajorId and ClassId = a.C_ID) as Pcount", "tb_Class a left join tb_College C on C.C_ID=a.CollegeId left join tb_Major M on M.M_ID=a.MajorId", wheres);

                var section = commBll.GetListDatatable("select * from bsi_Section");//节

                //1.循环所有班级
                foreach (DataRow classrows in class_dt.Rows)
                {
                    //2.循环节表
                    foreach (DataRow dr in section.Rows)
                    {
                        var dt = GetOpeningTime(cid, dr["ID"].ToString());//根据班级id + 节id 获取开课时间

                        var ClassHourM = commBll.GetListDatatable("select * from bsi_ClassHourM where ClassId=" + classrows["C_ID"] + " and SectionId=" + dr["ID"].ToString());//获得中间表
                        if (ClassHourM != null && ClassHourM.Rows.Count > 0)//根据班级Id+节id效验在关系表里面是否存在
                        {
                            string set = "ClassId=@ClassId,CourseId=@CourseId,ChapterId=@ChapterId,SectionId=@SectionId,OpeningTime=@OpeningTime";
                            SqlParameter[] parsin1 = new SqlParameter[]{
                                new SqlParameter("@ClassId",classrows["C_ID"]),//班级id
                                new SqlParameter("@CourseId",dr["CurriculumID"]),//课程id
                                new SqlParameter("@ChapterId",dr["ChapterID"]),//章id
                                new SqlParameter("@SectionId",dr["ID"]),//节Id
                                new SqlParameter("@OpeningTime",dt),
                            };
                            var recount1 = commBll.UpdateInfo("bsi_ClassHourM", set, " and ClassId=@ClassId and ChapterId=@ChapterId and SectionId=@SectionId ", parsin1);
                            if (recount1 > 0)
                            {
                                //result = "1";
                            }
                        }
                        else
                        {
                            string list = "ClassId, CourseId, ChapterId,SectionId, OpeningTime, AddUserId, AddTime";
                            string value = "@ClassId,@CourseId,@ChapterId,@SectionId,@OpeningTime,@AddUserId,@AddTime";
                            SqlParameter[] parsin = new SqlParameter[]{
                                new SqlParameter("@ClassId",classrows["C_ID"]),//班级id
                                new SqlParameter("@CourseId",dr["CurriculumID"]),//课程id
                                new SqlParameter("@ChapterId",dr["ChapterID"]),//章id
                                new SqlParameter("@SectionId",dr["ID"]),//节Id
                                new SqlParameter("@OpeningTime",dt),
                                new SqlParameter("@AddUserId",UserId),
                                new SqlParameter("@AddTime",DateTime.Now)
                            };
                            var recount = commBll.Add("bsi_ClassHourM", list, value, parsin);
                            if (recount > 0)
                            {
                                //result = "1";
                            }
                        }

                    }

                }

                return "1";
            }
            catch (Exception)
            {

                return "99";
            }
        }

        /// <summary>
        /// 选中勾选的班级ID +循环的课程id+循环的节id 获取  设置的时间
        /// </summary>
        /// <returns></returns>
        public DateTime? GetOpeningTime(string Cid, string ChapterId)
        {
            DateTime? OpeningTime = null;
            var ClassHourM = commBll.GetListDatatable("select * from bsi_ClassHourM where ClassId=" + Cid + " and SectionId=" + ChapterId);//获得中间表
            if (ClassHourM != null && ClassHourM.Rows.Count > 0 && ClassHourM.Rows[0]["OpeningTime"] != DBNull.Value)
            {
                OpeningTime = Convert.ToDateTime(ClassHourM.Rows[0]["OpeningTime"]);
            }
            else
            {
                OpeningTime = null;
            }

            return OpeningTime;
        }

        /// <summary>
        /// 呈现课时内容
        /// </summary>
        /// <returns></returns>
        public ActionResult DetailedInfo()
        {

            string cid = Request["cid"];
            string sid = Request["sid"];

            var dt = commBll.GetListDatatable("select * from tb_Class where C_ID = " + cid + "");
            return View();
        }

        //获得课程下面的章数据列表
        public string GetChapterList()
        {
            string cid = Request["cid"];
            string sid = Request["sid"];
            string aid = Request["aid"];
            var dt = commBll.GetListDatatable("select * from bsi_Chapter b where b.CurriculumID=" + sid);
            return JsonConvert.SerializeObject(dt);

        }

        /// <summary>
        /// 获得节数据列表
        /// </summary>
        /// <returns></returns>
        public string GetSectionList()
        {
            string aid = Request["aid"];
            string gid = Request["gid"];//章id
            var cid = Request["cid"];//班级id

            var where = " and b.ClassId=" + cid + " where  c.ID = " + gid;

            var dt = commBll.GetListDatatable(@"select b.ID,a.id AS section_id,a.CurriculumID,c.ID AS section_id,a.SectionName,(case b.OpeningTime when NULL then '未安排' else b.OpeningTime end) as open_time_str  from bsi_Section a 
LEFT JOIN bsi_Chapter c ON c.ID = a.ChapterID AND a.CurriculumID = c.CurriculumID
left join bsi_ClassHourM b on a.ID = b.SectionId " + where + "");
            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 编辑在该编辑改章节设置课时
        /// </summary>
        /// <returns></returns>
        public string UpdateOpenTime()
        {
            string sids = Request["sids"];//关系表主键id
            var CourseId = Request["CourseId"];
            var cid = Request["cid"];
            var sectionId = Request["sectionId"];//节id
            string open_time = Request["open_time"];
            if (open_time == "")
            {
                open_time = null;
            }

            var Ids = sids.Split(new char[] { ',' });
            var sectionIds = sectionId.Split(new char[] { ',' });
            var result = "99";

            for (int i = 0; i < Ids.Length; i++)
            {
                if (Ids[i] == "null" || Ids[i] == "")
                {
                    string list = "ClassId, CourseId, ChapterId, SectionId, OpeningTime, AddUserId, AddTime";
                    string value = "@ClassId,@CourseId,@ChapterId,@SectionId,@OpeningTime,@AddUserId,@AddTime";

                    var dt = commBll.GetListDatatable("select * from bsi_Section b where ID=" + sectionIds[i]);
                    int? ChapterId = null;
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        ChapterId = Convert.ToInt32(dt.Rows[0]["ChapterId"]);//获得章ID
                    }

                    SqlParameter[] parsin = new SqlParameter[]{
                        new SqlParameter("@ClassId",cid),
                        new SqlParameter("@CourseId",CourseId),
                        new SqlParameter("@ChapterId",ChapterId),//章id
                        new SqlParameter("@SectionId",sectionIds[i]),//节Id
                        new SqlParameter("@OpeningTime",open_time),
                        new SqlParameter("@AddUserId",UserId),
                        new SqlParameter("@AddTime",DateTime.Now)
                        };
                    var recount = commBll.Add("bsi_ClassHourM", list, value, parsin);
                    if (recount > 0)
                    {
                        result = "1";
                    }

                }
                else
                {
                    string set = "OpeningTime=@OpeningTime";
                    SqlParameter[] parsin = new SqlParameter[]{
                        new SqlParameter("@OpeningTime",open_time),
                        };
                    var recount = commBll.UpdateInfo("bsi_ClassHourM", set, " and id in(" + Ids[i] + ")", parsin);
                    if (recount > 0)
                    {
                        result = "1";
                    }
                }
            }

            return result;

        }

        /// <summary>
        /// 恢复进入该班级下面的所选课程的开课时间
        /// </summary>
        /// <returns></returns>
        public string ResetSetingForClassid()
        {
            string cid = Request["cid"];
            string strid = Request["strid"];
            string set = "OpeningTime=@OpeningTime";
            SqlParameter[] parsin = new SqlParameter[]{
                        new SqlParameter("@OpeningTime",null),
                        };
            commBll.UpdateInfo("bsi_ClassHourM", set, " and classid=" + cid + " and CourseId in (" + strid + ")", parsin);
            return "1";
        }

        /// <summary>
        /// 恢复进入该班级下面的所选课程的节的开课时间
        /// </summary>
        /// <returns></returns>
        public string ResetSetingForAid()
        {
            string cid = Request["cid"];//班级id
            string chkstr = Request["chkstr"];//节id
            string set = "OpeningTime=@OpeningTime";
            SqlParameter[] parsin = new SqlParameter[]{
                        new SqlParameter("@OpeningTime",null),
                        };
            commBll.UpdateInfo("bsi_ClassHourM", set, " and classid=" + cid + " and  sectionId in (" + chkstr + ")", parsin);
            return "1";
        }

    }
}
