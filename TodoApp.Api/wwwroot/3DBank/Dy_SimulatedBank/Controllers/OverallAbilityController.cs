using Aspose.Words;
using Aspose.Words.Tables;
using Dy_SimulatedBank.Models;
using Dy_SimulatedBank_Bll;
using Dy_SimulatedBank_DBUtility.Sql;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;  

namespace Dy_SimulatedBank.Controllers
{
    public class OverallAbilityController : BaseController
    {
        CommonBll commonbll = new CommonBll();

        /// <summary>
        /// 我的能力
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            GetStudengInfo();//实训报告基本信息
            GetTeacherEvaluationInformation();//教师或学生评级信息

            return View();
        }
        /// <summary>
        /// 获取能力数据
        /// </summary>
        /// <returns></returns>
        public string getData()
        {
            string weekId = Request["WeekID"];
            string type = Request["Type"];
            //weekId  1:一周  2:两周 3:1个月 4:3个月  5:6个月
            //type 1:个人  2:班级

            string dateTimeNow = DateTime.Now.AddDays(1).ToShortDateString();
            string lastDateTime = "";
            if (weekId == "1")
            {
                lastDateTime = DateTime.Now.AddDays(-7).ToShortDateString();
            }
            else if (weekId == "2")
            {
                lastDateTime = DateTime.Now.AddDays(-14).ToShortDateString();
            }
            else if (weekId == "3")
            {
                lastDateTime = DateTime.Now.AddMonths(-1).ToShortDateString();
            }
            else if (weekId == "4")
            {
                lastDateTime = DateTime.Now.AddMonths(-3).ToShortDateString();
            }
            else if (weekId == "5")
            {
                lastDateTime = DateTime.Now.AddMonths(-6).ToShortDateString();
            }
            string table = "";
            string para = "";
            string where = "";
            DataTable dt = null;
            if (type == "1")
            {
                table = @" bsi_StuTotalAbilityScore a join  bsi_CapabilityModel b on a.AbilityId=b.ID ";
                para = " b.AbilityName,a.* ";
                where = " and a.UserId ="+UserId+" and a.AddTime  between '"+ lastDateTime + "' and '"+ dateTimeNow + "' order by a.AddTime ";
                dt = commonbll.GetListDatatable(para, table, where);
               

            }
            else if (type == "2")
            {
                 dt = commonbll.GetListDatatable($@" select '个人能力总分' as AbilityName,AddTime,sum(TotalStuScore) as TotalStuScore from bsi_StuTotalAbilityScore 
 where  UserId = {UserId} group by AddTime 
 union 
select  '班级平均分' as AbilityName,f.AddTime,round((sum(sumSource)/(select COUNT(*) from tb_Student  where ClassId = {ClassId})),2)
 from (select UserId ,SUM(TotalStuScore) sumSource,AddTime from bsi_StuTotalAbilityScore
 where UserId in (select UserId from tb_Student  where ClassId = {ClassId})  group by UserId ,AddTime ) f group by f.AddTime");
              
            }
            return JsonConvert.SerializeObject(dt);
        }

        public string SelectGetlog() {

            
            DataTable dt = commonbll.GetListDatatable($@" select AbilityName, MAX(b.TotalStuScore) as TotalStuScore,max(b.AddTime) as AddTime
 from bsi_CapabilityModel a
 inner
 join bsi_StuTotalAbilityScore b on b.AbilityId = a.ID
 where UserId = {UserId} and b.AddTime < getdate()  group by AbilityName ");
            return JsonConvert.SerializeObject(dt);
        }
        public string SelectScroc() {
            var DateNum = Request["DateNum"];
            string dateTimeNow = DateTime.Now.AddDays(1).ToShortDateString();
            string lastDateTime = "";
            DataTable dt=null;
            if (DateNum == "1") {
                lastDateTime = DateTime.Now.AddDays(-7).ToShortDateString();
            }
            if (DateNum == "2")
            {
                lastDateTime = DateTime.Now.AddDays(-14).ToShortDateString();
            }
            if (DateNum == "3")
            {
                lastDateTime = DateTime.Now.AddMonths(-1).ToShortDateString();
            }
            if (DateNum == "4")
            {
                lastDateTime = DateTime.Now.AddMonths(-3).ToShortDateString();
            }
            if (DateNum == "5")
            {
                lastDateTime = DateTime.Now.AddMonths(-6).ToShortDateString();
            }

            
             dt = commonbll.GetListDatatable($@" select b.AbilityName,TotalStuScore,a.AddTime from bsi_StuTotalAbilityScore a 
inner join  bsi_CapabilityModel b on a.AbilityId=b.ID  where  UserId={UserId}
 and  a.AddTime  between '{lastDateTime}' and '{dateTimeNow}'
 order by a.AddTime
 "); 
            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 获取得分日志
        /// </summary>
        /// <returns></returns>
        public string getLog()
        {
            string SelectAbilityId = Request["SelectAbilityId"];

            var SelectshijId = Request["SelectshijId"];
            string SelectId_1 = "";
            string SelectId_2 = "";
            if (!string.IsNullOrEmpty(SelectshijId)) {
                SelectshijId.Split(',');
                SelectId_1 = Convert.ToString(SelectshijId[0]);
                SelectId_2 = Convert.ToString(SelectshijId[2]);
            }
            string OperationName = Request["OperationName"];
            var where = "";
            if (!string.IsNullOrEmpty(SelectAbilityId))
            {
                where += " and a.AbilityId=" + SelectAbilityId;
            }
            if (!string.IsNullOrEmpty(OperationName))
            {
                where += " and d.PracticeName like '%" + OperationName + "%'";
            }
            if (!string.IsNullOrEmpty(SelectshijId))
            {
                where += " and d.PracticeType=" + SelectId_1 + " and d.Type_All=" + SelectId_2;
            }
            string sql = $@" select a.*,d.PracticeName,d.PracticeType,d.Type_All,b.AbilityName,b.AbilityUpperLimit 
 from(select PracticeId, AbilityId, SUM(StuScore) as StuScore,MAX(AddTime) as AddTime  from bsi_StuAbilityScore where UserId = {UserId} group by PracticeId, AbilityId) a
    inner join bsi_CapabilityModel b on a.AbilityId = b.ID
 inner join bsi_PracticeAssessment d on a.PracticeId = d.ID  where 1=1 {where} order by AddTime desc";
            var dt = SqlHelper.ExecuteDataTable(sql);
            var query = from t in dt.AsEnumerable()
                        group t by new { t1 = t.Field<int>("PracticeId"), t2 = t.Field<string>("AbilityName") } into m
                        select new
                        {
                            PracticeId = m.Key.t1,
                            AbilityName = m.Key.t2,
                            StuScore = m.Sum(d => d.Field<int>("StuScore")),
                            AddTime = m.Max(d => d.Field<DateTime>("AddTime")),
                            PracticeName=m.FirstOrDefault().Field<string>("PracticeName"),
                            PracticeType = m.FirstOrDefault().Field<int>("PracticeType"),
                            Type_All = m.FirstOrDefault().Field<int>("Type_All"),
                            AbilityUpperLimit = m.FirstOrDefault().Field<double>("AbilityUpperLimit"),

                        };

            var query2 = from t in query.ToList()
                         group t by new { t1 = t.PracticeId } into m
                         select new
                         {
                             AbilityString = string.Join(";", m.Select(y => ($"{y.AbilityName}:{Math.Min(y.StuScore, y.AbilityUpperLimit) }分"))),
                             AddTime = m.Max(d => d.AddTime),
                             PracticeName = m.FirstOrDefault().PracticeName,
                             PracticeType = m.FirstOrDefault().PracticeType,
                             Type_All = m.FirstOrDefault().Type_All,
                             AbilityUpperLimit = m.FirstOrDefault().AbilityUpperLimit
                         };

            var PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            var PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            var tb = query2.ToList();
            var Tatb = tb.Skip((PageIndex - 1) * PageSize).Take(PageSize).ToList();
            DataTable table = new DataTable();
            table.Columns.Add("AbilityString", typeof(string));
            table.Columns.Add("Addtime",typeof(string));
            table.Columns.Add("PracticeName",typeof(string));
            table.Columns.Add("PracticeType", typeof(string));
            table.Columns.Add("Type_All", typeof(string));
            for (int i = 0; i < Tatb.Count; i++)
            {
                table.Rows.Add(new string[] { Tatb[i].AbilityString, Tatb[i].AddTime.ToShortDateString(), Tatb[i].PracticeName, Tatb[i].PracticeType.ToString(), Tatb[i].Type_All.ToString()});
            };
            return JsonConvert.SerializeObject(JsonResultPagedLists(tb.Count, PageIndex, PageSize, table) );



        }

        public string ExportExamResult()
        {
            string SelectAbilityId = Request["SelectAbilityId"];

            var SelectshijId = Request["SelectshijId"];
            string SelectId_1 = "";
            string SelectId_2 = "";
            if (!string.IsNullOrEmpty(SelectshijId))
            {
                SelectshijId.Split(',');
                SelectId_1 = Convert.ToString(SelectshijId[0]);
                SelectId_2 = Convert.ToString(SelectshijId[2]);
            }
            string OperationName = Request["OperationName"];
            var where = "";
            if (!string.IsNullOrEmpty(SelectAbilityId))
            {
                where += " and a.AbilityId=" + SelectAbilityId;
            }
            if (!string.IsNullOrEmpty(OperationName))
            {
                where += " and d.PracticeName like '%" + OperationName + "%'";
            }
            if (!string.IsNullOrEmpty(SelectshijId))
            {
                where += " and d.PracticeType=" + SelectId_1 + " and d.Type_All=" + SelectId_2;
            }
            string sql = $@" select a.*,d.PracticeName,d.PracticeType,d.Type_All,b.AbilityName,b.AbilityUpperLimit 
 from(select PracticeId, AbilityId, SUM(StuScore) as StuScore,MAX(AddTime) as AddTime  from bsi_StuAbilityScore where UserId = {UserId} group by PracticeId, AbilityId) a
    inner join bsi_CapabilityModel b on a.AbilityId = b.ID
 inner join bsi_PracticeAssessment d on a.PracticeId = d.ID  where 1=1 {where} order by AddTime desc";
            var dt = SqlHelper.ExecuteDataTable(sql);
            var query = from t in dt.AsEnumerable()
                        group t by new { t1 = t.Field<int>("PracticeId"), t2 = t.Field<string>("AbilityName") } into m
                        select new
                        {
                            PracticeId = m.Key.t1,
                            AbilityName = m.Key.t2,
                            StuScore = m.Sum(d => d.Field<int>("StuScore")),
                            AddTime = m.Max(d => d.Field<DateTime>("AddTime")),
                            PracticeName = m.FirstOrDefault().Field<string>("PracticeName"),
                            PracticeType = m.FirstOrDefault().Field<int>("PracticeType"),
                            Type_All = m.FirstOrDefault().Field<int>("Type_All"),
                            AbilityUpperLimit = m.FirstOrDefault().Field<double>("AbilityUpperLimit")

                        };

            var query2 = from t in query.ToList()
                         group t by new { t1 = t.PracticeId } into m
                         select new
                         {
                             AbilityString = string.Join(";", m.Select(y => ($"{y.AbilityName}:{Math.Min(y.StuScore, y.AbilityUpperLimit) }分"))),
                             AddTime = m.Max(d => d.AddTime),
                             PracticeName = m.FirstOrDefault().PracticeName,
                             PracticeType = m.FirstOrDefault().PracticeType,
                             Type_All = m.FirstOrDefault().Type_All,
                             AbilityUpperLimit = m.FirstOrDefault().AbilityUpperLimit
                         };

            var tb = query2.ToList();
            DataTable table = new DataTable();
            table.Columns.Add("Addtime", typeof(string));
            table.Columns.Add("AbilityString", typeof(string));
            
            table.Columns.Add("PracticeName", typeof(string));

            for (int i = 0; i < tb.Count; i++)
            {
                table.Rows.Add(new string[] { tb[i].AddTime.ToShortDateString(), tb[i].AbilityString, tb[i].PracticeName });
            };

            string ExcelName = DateTime.Now.ToString("yyyyMMdd") + "" + DateTime.Now.Millisecond + "得分日志";
            string filename = "/Export/" + ExcelName + ".xlsx";

            OfficeHelper officeHp = new OfficeHelper();
            var Result = officeHp.DtToExcel(table, "得分日志", new string[] { "时间","能力类型", "事件"}, "得分日志", ExcelName);

            var json = new object[] {
                        new{
                            filename=filename,
                        }
                    };
            return JsonConvert.SerializeObject(json);
        }

        public string GetAbilityList()
        {
            string strWhere = " and 1=1";
            DataTable dt = commonbll.GetListDatatable("*", "bsi_CapabilityModel", strWhere);
            return JsonConvert.SerializeObject(dt);
        }



        #region  实训报告
        /// <summary>
        /// 获取实训报告学生个人信息
        /// </summary>
        /// <returns></returns>
        public string GetStudengInfo()
        {
            DataTable dt = commonbll.GetListDatatable(@"select *
  from tb_Student a 
left join tb_School sc on a.SchoolId=sc.S_ID
left join tb_College co on a.CollegeId=co.C_ID
left join tb_Major ma on a.MajorId=ma.M_ID
left join tb_Class c on a.ClassId=c.C_ID
left join tb_teacher te on c.TeacherId=te.UserId
LEFT join bsi_Groupingrelation me on a.UserId=me.StudentID
LEFT join bsi_Groupmanagement mg on me.GroupingnameID=mg.G_ID AND mg.SchoolId=a.SchoolId 
where a.UserId=" + StudentId());

            if (dt != null && dt.Rows.Count > 0)
            {
                ViewData["SchoolName"] = dt.Rows[0]["SchoolName"]; //学校名
                ViewData["CollegeName"] = dt.Rows[0]["CollegeName"];//学院名
                ViewData["MajorName"] = dt.Rows[0]["MajorName"];//专业名
                ViewData["ClassName"] = dt.Rows[0]["ClassName"];//班级名
                ViewData["Name"] = dt.Rows[0]["Name"];//学员姓名
                ViewData["StudentNo"] = dt.Rows[0]["StudentNo"];//学员账号
                ViewData["TeacherName"] = dt.Rows[0]["TeacherName"];//老师姓名
                ViewData["Groupingname"] = dt.Rows[0]["Groupingname"]; //所属分组名
            }

            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 获得个人能力分数
        /// </summary>
        /// <returns></returns>
        public string getAllAbilityScore()
        {
            DataTable dt = commonbll.GetListDatatable(@"SELECT AbilityName,AbilityUpperLimit, MAX(TotalStuScore)as TotalStuScore FROM tb_Student a
		INNER JOIN  bsi_StuTotalAbilityScore b ON a.UserId= b.UserId 
		INNER JOIN bsi_CapabilityModel c ON c.ID = b.AbilityId
		WHERE b.UserId=" + StudentId() +
        "GROUP BY AbilityName,AbilityUpperLimit");

            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 获取所有的考试
        /// </summary>
        /// <returns></returns>
        public string GetExamination()
        {
            string sql = @"     
		SELECT c.PracticeName,(CASE WHEN c.PracticeType=1 THEN '个人实训考核' WHEN c.PracticeType=2 THEN '团队实训考核'END)AS PracticeType,
		c.PracticeStarTime,Scores
		 FROM dbo.tb_Student a 
		INNER JOIN  bsi_TotalResult  b ON a.UserId = b.UserId AND b.Type_All=1  AND b.UserId=" + StudentId() +
        "INNER JOIN dbo.bsi_PracticeAssessment c ON c.ID = b.ExamId AND  c.Type_All=1 AND c.PracticeState=1 and GETDATE() > DATEADD(MINUTE,c.PracticeLong,c.PracticeStarTime) " +
        " UNION ALL " +
        "SELECT E_Name,'知识考核' AS PracticeType,c.E_StartTime,ER_Score FROM dbo.tb_Student a " +
        "INNER JOIN tb_ExaminationResult b ON a.UserId = b.ER_MId AND b.ER_Type=1 AND ER_State=0 AND b.ER_MId=" + StudentId() +
        "INNER JOIN tb_HB_Examination c ON b.ER_EId = c.EId AND c.E_Type=1 and c.E_IsState=1" +
        "WHERE GETDATE()> c.E_EndTime	";

            DataTable dt = commonbll.GetListDatatable(sql);

            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 查看班级排名
        /// </summary>
        /// <returns></returns>
        public string GetExamRanking()
        {

            string classid = "";

            DataTable class_dt = commonbll.GetListDatatable($@" select b.ClassId,c.TeacherId from 
  tb_User a 
  join tb_Student b on U_ID = b.UserId
  join tb_Class c on b.ClassId = c.C_ID 
  where a.U_ID = {StudentId()}");
            if (class_dt != null && class_dt.Rows.Count > 0)
            {
                var TeacherId = class_dt.Rows[0]["TeacherId"];
                DataTable dtc = commonbll.GetListDatatable("SELECT * FROM dbo.tb_Class WHERE TeacherId =" + TeacherId);
                foreach (DataRow item in dtc.Rows)
                {
                    if (item["C_ID"].ToString() == "" || item["C_ID"].ToString() == null)
                    {

                    }
                    else { classid += item["C_ID"].ToString() + ","; }
                }
                if (!string.IsNullOrEmpty(classid))
                {
                    classid = classid.Substring(0, classid.Length - 1);
                }
                else
                {
                    classid = "0";
                }
            }

            var tId = class_dt.Rows[0]["TeacherId"];
            string wheres = " and a.state = 1 and a.is_delete = 1 and a.add_user=" + tId;
            string table = " dbo.tb_Exam_rank a left join tb_Exam_rank_range b on a.id = b.rank_id  ";

            DataTable dt = commonbll.GetListDatatable("*", table, wheres);

            DataView dataView = dt.DefaultView;
            DataTable dataTableDistinct = dataView.ToTable(true, "id", "rank_name", "add_time");
            if (dataTableDistinct.Rows.Count > 0)
            {
                dataTableDistinct.Columns.Add("newrank", typeof(string));//排名
            }
            foreach (DataRow item in dataTableDistinct.Rows)
            {
                SqlParameter[] sqlparam = new SqlParameter[] {
                    new SqlParameter("@rank_id",item["id"]),
                    new SqlParameter("@stuName",""),
                    new SqlParameter("@classId",classid)
                };

                DataSet ds = SqlHelper.ExecuteDataSet("exec Pro_Exam_rank_statistics @rank_id,@stuName,@classId", CommandType.Text, sqlparam);

                DataRow[] dr = ds.Tables[0].Select(" UserId =" + StudentId());
                if (dr.Length > 0)
                {
                    item["newrank"] = dr[0]["newrank"];
                }
            }

            return JsonConvert.SerializeObject(dataTableDistinct);
        }

        /// <summary>
        /// 教师评价信息
        /// </summary>
        /// <returns></returns>
        public string GetTeacherEvaluationInformation()
        {
            string sql = @"SELECT c.RankName AS teacherRankName,b.TeacherComment,d.RankName AS stuRankName,b.StuComment FROM dbo.tb_Student a
		LEFT JOIN bsi_Evaluate b ON a.UserId = b.StuId
		LEFT JOIN dbo.bsi_StudentRating c ON c.ID = b.TeacherRanKId
	    LEFT JOIN dbo.bsi_StudentRating d ON d.ID = b.StuRankId
		WHERE a.UserId=" + StudentId();
            DataTable dt = commonbll.GetListDatatable(sql);
            if (dt != null && dt.Rows.Count > 0)
            {
                var teacherRankName = dt.Rows[0]["teacherRankName"];//教师评级名称
                var teacherComment = dt.Rows[0]["TeacherComment"]; //教师评语
                var stuRankName = dt.Rows[0]["stuRankName"];//学生评级名称
                var stuComment = dt.Rows[0]["StuComment"]; //教师评语

                ViewBag.teacherRankName = teacherRankName;
                ViewBag.teacherComment = teacherComment;
                ViewBag.stuRankName = stuRankName;
                ViewBag.stuComment = stuComment;
            }
            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 自我评价
        /// </summary>
        /// <returns></returns>
        public string SelfEvaluation()
        {
            string rank = Request["self_rating_id"].ToString();//评级等级id
            if (rank == "")
            {
                rank = null;
            }
            string teacherComment = Request["self_rating_txt"].ToString();//评价语

            string Ssql = "select * from bsi_Evaluate where StuId=" + UserId + "";
            var studentDt = commonbll.GetListDatatable(Ssql);
            if (studentDt != null && studentDt.Rows.Count > 0)//存在做更新，否则新增
            {
                string StudentTable = "bsi_Evaluate";
                string set = "StuRankId=@StuRankId, StuComment=@StuComment, StuId=@StuId, StuTime=@StuTime";

                SqlParameter[] Studentpars = new SqlParameter[]
                {
                    new SqlParameter("@StuRankId",rank),
                    new SqlParameter("@StuComment",teacherComment),
                    new SqlParameter("@StuId",UserId),
                    new SqlParameter("@StuTime",DateTime.Now),
                };
                var resultcount = commonbll.UpdateInfo(StudentTable, set, " and StuId=@StuId ", Studentpars);
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
                string StudentList = "StuRankId, StuComment, StuId, StuTime, UserId";
                string StudentValue = "@StuRankId,@StuComment,@StuId,@StuTime,@UserId";
                SqlParameter[] Studentpars = new SqlParameter[]
                {
                    new SqlParameter("@StuRankId",rank),
                    new SqlParameter("@StuComment",teacherComment),
                    new SqlParameter("@StuId",UserId),
                    new SqlParameter("@StuTime",DateTime.Now),
                    new SqlParameter("@UserId",UserId),
                };
                int resultcount = commonbll.Add(StudentTable, StudentList, StudentValue, Studentpars);
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
        /// 打印实训报告
        /// </summary>
        public string Export_Word()
        {
            string templateFile = Server.MapPath("~/Export/实训报告模板.docx");
            string file_path = "~/Resources/TrainingReport_word/" + Session["StuName"] + "实训报告.doc";
            string pdf_path = System.AppDomain.CurrentDomain.SetupInformation.ApplicationBase + "/Resources/TrainingReport_pdf/" + Session["StuName"] + "实训报告.pdf";
            string pdf_file_path = "~/Resources/TrainingReport_pdf/" + Session["StuName"] + "实训报告.pdf";
            string saveDocFile = Server.MapPath(file_path);
            try
            {
                Aspose.Words.Document doc = new Aspose.Words.Document(templateFile);
                Aspose.Words.DocumentBuilder builder = new Aspose.Words.DocumentBuilder(doc);

                #region 基本信息

                DataTable uer_info_dt = commonbll.GetListDatatable(@"select SchoolName,CollegeName,MajorName,ClassName,Name,StudentNo,TeacherName,Groupingname,sa.RankName AS teacherRankName,b.TeacherComment,d.RankName AS stuRankName,b.StuComment
  from tb_Student a 
left join tb_School sc on a.SchoolId=sc.S_ID
left join tb_College co on a.CollegeId=co.C_ID
left join tb_Major ma on a.MajorId=ma.M_ID
left join tb_Class c on a.ClassId=c.C_ID
left join tb_teacher te on c.TeacherId=te.UserId
LEFT join bsi_Groupingrelation me on a.UserId=me.StudentID
LEFT join bsi_Groupmanagement mg on me.GroupingnameID=mg.G_ID AND mg.SchoolId=a.SchoolId 
		LEFT JOIN bsi_Evaluate b ON a.UserId = b.StuId
		LEFT JOIN dbo.bsi_StudentRating sa ON sa.ID = b.TeacherRanKId
		LEFT JOIN dbo.bsi_StudentRating d ON d.ID = b.StuRankId
                    where a.UserId=" + StudentId());
                builder.MoveToBookmark("学校");
                builder.Write(uer_info_dt.Rows[0]["SchoolName"].ToString());

                builder.MoveToBookmark("学院");
                builder.Write(uer_info_dt.Rows[0]["CollegeName"].ToString());

                builder.MoveToBookmark("专业");
                builder.Write(uer_info_dt.Rows[0]["MajorName"].ToString());

                builder.MoveToBookmark("班级");
                builder.Write(uer_info_dt.Rows[0]["ClassName"].ToString());

                builder.MoveToBookmark("姓名");
                builder.Write(uer_info_dt.Rows[0]["Name"].ToString());

                builder.MoveToBookmark("账号");
                builder.Write(uer_info_dt.Rows[0]["StudentNo"].ToString());

                builder.MoveToBookmark("教师");
                builder.Write(uer_info_dt.Rows[0]["TeacherName"].ToString());

                builder.MoveToBookmark("小组名称");
                builder.Write(!string.IsNullOrEmpty(uer_info_dt.Rows[0]["Groupingname"].ToString()) ? uer_info_dt.Rows[0]["Groupingname"].ToString() : "无");


                builder.MoveToBookmark("教师评级");
                builder.Write(!string.IsNullOrEmpty(uer_info_dt.Rows[0]["teacherRankName"].ToString()) ? uer_info_dt.Rows[0]["teacherRankName"].ToString() : "无");

                builder.MoveToBookmark("教师评语");
                builder.Write(!string.IsNullOrEmpty(uer_info_dt.Rows[0]["TeacherComment"].ToString()) ? uer_info_dt.Rows[0]["TeacherComment"].ToString() : "无");

                builder.MoveToBookmark("自我评级");
                builder.Write(!string.IsNullOrEmpty(uer_info_dt.Rows[0]["stuRankName"].ToString()) ? uer_info_dt.Rows[0]["stuRankName"].ToString() : "无");

                builder.MoveToBookmark("实训总结");
                builder.Write(!string.IsNullOrEmpty(uer_info_dt.Rows[0]["StuComment"].ToString()) ? uer_info_dt.Rows[0]["StuComment"].ToString() : "无");

                builder.MoveToBookmark("打印日期");
                builder.Write(DateTime.Now.ToString("yyyy-MM-dd"));

                #endregion

                #region 能力分值
                DataTable Capabiliy_dt = commonbll.GetListDatatable(@"SELECT AbilityName,AbilityUpperLimit, MAX(TotalStuScore)as TotalStuScore FROM tb_Student a
		INNER JOIN  bsi_StuTotalAbilityScore b ON a.UserId= b.UserId 
		INNER JOIN bsi_CapabilityModel c ON c.ID = b.AbilityId
		WHERE b.UserId=" + StudentId() +
       "GROUP BY AbilityName,AbilityUpperLimit");

                builder.MoveToBookmark("能力分值");        //开始添加值
                string[] title = { "能力名称", "系统分值", "个人得分" };
                for (var j = 0; j < title.Length; j++)
                {
                    builder.InsertCell();// 添加一个单元格                    
                    builder.CellFormat.Borders.LineStyle = LineStyle.Single;
                    builder.CellFormat.Borders.Color = System.Drawing.Color.Black;
                    builder.CellFormat.Width = 143;
                    //builder.CellFormat.Borders.f
                    builder.Font.Size = 9;
                    builder.CellFormat.VerticalMerge = Aspose.Words.Tables.CellMerge.None;
                    builder.CellFormat.VerticalAlignment = CellVerticalAlignment.Center;//垂直居中对齐
                    builder.ParagraphFormat.Alignment = ParagraphAlignment.Center;//水平居中对齐
                    builder.Write(title[j].ToString());
                }
                builder.EndRow();
                decimal total_score = 0;
                decimal p_total_score = 0;
                for (var i = 0; i < Capabiliy_dt.Rows.Count; i++)
                {
                    for (var j = 0; j < 3; j++)
                    {
                        builder.InsertCell();// 添加一个单元格                    
                        builder.CellFormat.Borders.LineStyle = LineStyle.Single;
                        builder.CellFormat.Borders.Color = System.Drawing.Color.Black;
                        builder.Font.Color = System.Drawing.Color.DeepSkyBlue;
                        builder.Font.Size = 9;
                        builder.CellFormat.VerticalMerge = Aspose.Words.Tables.CellMerge.None;
                        builder.CellFormat.VerticalAlignment = CellVerticalAlignment.Center;//垂直居中对齐
                        builder.ParagraphFormat.Alignment = ParagraphAlignment.Center;//水平居中对齐
                        builder.Write(Capabiliy_dt.Rows[i][j].ToString());
                        if (j == 1)
                        {
                            total_score += decimal.Parse(Capabiliy_dt.Rows[i][j].ToString());
                        }
                        if (j == 2)
                        {
                            p_total_score += decimal.Parse(Capabiliy_dt.Rows[i][j].ToString());
                        }
                    }
                    builder.EndRow();
                }
                string[] end_row = { "总分", total_score.ToString(), p_total_score.ToString() };
                for (var j = 0; j < end_row.Length; j++)
                {
                    builder.InsertCell();// 添加一个单元格                    
                    builder.CellFormat.Borders.LineStyle = LineStyle.Single;
                    builder.CellFormat.Borders.Color = System.Drawing.Color.Black;
                    if (j == 0)
                    {
                        builder.Font.Color = System.Drawing.Color.Black;
                    }
                    else
                    {
                        builder.Font.Color = System.Drawing.Color.DeepSkyBlue;
                    }
                    builder.CellFormat.Width = 143;
                    builder.Font.Size = 9;
                    builder.CellFormat.VerticalMerge = Aspose.Words.Tables.CellMerge.None;
                    builder.CellFormat.VerticalAlignment = CellVerticalAlignment.Center;//垂直居中对齐
                    builder.ParagraphFormat.Alignment = ParagraphAlignment.Center;//水平居中对齐
                    builder.Write(end_row[j].ToString());
                }
                builder.EndRow();
                builder.EndTable();
                #endregion

                #region 考试成绩
                builder.MoveToBookmark("考试成绩");        //开始添加值
                string[] exam_title = { "考核名称", "考核类型", "考核开始时间", "得分" };
                for (var j = 0; j < exam_title.Length; j++)
                {
                    builder.InsertCell();// 添加一个单元格                    
                    builder.CellFormat.Borders.LineStyle = LineStyle.Single;
                    builder.CellFormat.Borders.Color = System.Drawing.Color.Black;
                    builder.CellFormat.Width = 108;
                    builder.Font.Size = 9;
                    builder.CellFormat.VerticalMerge = Aspose.Words.Tables.CellMerge.None;
                    builder.CellFormat.VerticalAlignment = CellVerticalAlignment.Center;//垂直居中对齐
                    builder.ParagraphFormat.Alignment = ParagraphAlignment.Center;//水平居中对齐
                    builder.Write(exam_title[j].ToString());
                }
                builder.EndRow();
                #region 

                string sql = @"     
		SELECT c.PracticeName,(CASE WHEN c.PracticeType=1 THEN '个人实训考核' WHEN c.PracticeType=2 THEN '团队实训考核'END)AS PracticeType,
		c.PracticeStarTime,Scores
		 FROM dbo.tb_Student a 
		INNER JOIN  bsi_TotalResult  b ON a.UserId = b.UserId AND b.Type_All=1  AND b.UserId=" + StudentId() +
      "INNER JOIN dbo.bsi_PracticeAssessment c ON c.ID = b.ExamId AND  c.Type_All=1 AND c.PracticeState=1 and GETDATE() > DATEADD(MINUTE,c.PracticeLong,c.PracticeStarTime) " +
      " UNION ALL " +
      "SELECT E_Name,'知识考核' AS PracticeType,c.E_StartTime,ER_Score FROM dbo.tb_Student a " +
      "INNER JOIN tb_ExaminationResult b ON a.UserId = b.ER_MId AND b.ER_Type=1 AND ER_State=0 AND b.ER_MId=" + StudentId() +
      "INNER JOIN tb_HB_Examination c ON b.ER_EId = c.EId AND c.E_Type=1 and c.E_IsState=1" +
      "WHERE GETDATE()> c.E_EndTime	";

                DataTable exam_dt = commonbll.GetListDatatable(sql);

                #endregion
                for (var i = 0; i < exam_dt.Rows.Count; i++)
                {
                    for (var j = 0; j < 4; j++)
                    {
                        builder.InsertCell();// 添加一个单元格                    
                        builder.CellFormat.Borders.LineStyle = LineStyle.Single;
                        builder.CellFormat.Borders.Color = System.Drawing.Color.Black;
                        builder.Font.Color = System.Drawing.Color.DeepSkyBlue;
                        //builder.CellFormat.Width = 108;
                        builder.Font.Size = 9;
                        builder.CellFormat.VerticalMerge = Aspose.Words.Tables.CellMerge.None;
                        builder.CellFormat.VerticalAlignment = CellVerticalAlignment.Center;//垂直居中对齐
                        builder.ParagraphFormat.Alignment = ParagraphAlignment.Center;//水平居中对齐

                        builder.Write(exam_dt.Rows[i][j].ToString());

                    }
                    builder.EndRow();
                }

                builder.EndTable();
                #endregion

                #region 班级排名
                builder.MoveToBookmark("班级排名");        //开始添加值
                string[] class_title = { "排名名称", "我的排名" };
                for (var j = 0; j < class_title.Length; j++)
                {
                    builder.InsertCell();// 添加一个单元格                    
                    builder.CellFormat.Borders.LineStyle = LineStyle.Single;
                    builder.CellFormat.Borders.Color = System.Drawing.Color.Black;
                    builder.CellFormat.Width = 215;
                    builder.Font.Size = 9;
                    builder.CellFormat.VerticalMerge = Aspose.Words.Tables.CellMerge.None;
                    builder.CellFormat.VerticalAlignment = CellVerticalAlignment.Center;//垂直居中对齐
                    builder.ParagraphFormat.Alignment = ParagraphAlignment.Center;//水平居中对齐
                    builder.Write(class_title[j].ToString());
                }
                builder.EndRow();

                #region

                string classid = "";

                DataTable class_dt = commonbll.GetListDatatable($@" select b.ClassId,c.TeacherId from 
  tb_User a 
  join tb_Student b on U_ID = b.UserId
  join tb_Class c on b.ClassId = c.C_ID 
  where a.U_ID = {StudentId()}");
                if (class_dt != null && class_dt.Rows.Count > 0)
                {
                    var TeacherId = class_dt.Rows[0]["TeacherId"];
                    DataTable dtc = commonbll.GetListDatatable("SELECT * FROM dbo.tb_Class WHERE TeacherId =" + TeacherId);
                    foreach (DataRow item in dtc.Rows)
                    {
                        if (item["C_ID"].ToString() == "" || item["C_ID"].ToString() == null)
                        {

                        }
                        else { classid += item["C_ID"].ToString() + ","; }
                    }
                    if (!string.IsNullOrEmpty(classid))
                    {
                        classid = classid.Substring(0, classid.Length - 1);
                    }
                    else
                    {
                        classid = "0";
                    }
                }

                var tId = class_dt.Rows[0]["TeacherId"];
                string wheres = " and a.state = 1 and a.is_delete = 1 and a.add_user=" + tId;
                string table = " dbo.tb_Exam_rank a left join tb_Exam_rank_range b on a.id = b.rank_id  ";

                DataTable dt = commonbll.GetListDatatable("*", table, wheres);

                DataView dataView = dt.DefaultView;
                DataTable dataTableDistinct = dataView.ToTable(true, "id", "rank_name", "add_time");
                if (dataTableDistinct.Rows.Count > 0)
                {
                    dataTableDistinct.Columns.Add("newrank", typeof(string));//排名
                }
                foreach (DataRow item in dataTableDistinct.Rows)
                {
                    SqlParameter[] sqlparam = new SqlParameter[] {
                            new SqlParameter("@rank_id",item["id"]),
                            new SqlParameter("@stuName",""),
                            new SqlParameter("@classId",classid)
                       };

                    DataSet ds = SqlHelper.ExecuteDataSet("exec Pro_Exam_rank_statistics @rank_id,@stuName,@classId", CommandType.Text, sqlparam);

                    DataRow[] dr = ds.Tables[0].Select(" UserId =" + StudentId());
                    if (dr.Length > 0)
                    {
                        item["newrank"] = dr[0]["newrank"];
                    }
                }
                #endregion
       
                for (var i = 0; i < dataTableDistinct.Rows.Count; i++)
                {
                    for (var j = 0; j < 2; j++)
                    {
                        builder.InsertCell();// 添加一个单元格                    
                        builder.CellFormat.Borders.LineStyle = LineStyle.Single;
                        builder.CellFormat.Borders.Color = System.Drawing.Color.Black;
                        builder.Font.Color = System.Drawing.Color.DeepSkyBlue;
                        //builder.CellFormat.Width = 215;
                        builder.Font.Size = 9;
                        builder.CellFormat.VerticalMerge = Aspose.Words.Tables.CellMerge.None;
                        builder.CellFormat.VerticalAlignment = CellVerticalAlignment.Center;//垂直居中对齐
                        builder.ParagraphFormat.Alignment = ParagraphAlignment.Center;//水平居中对齐

                        if (j == 0)
                        {
                            builder.Write(dataTableDistinct.Rows[i]["rank_name"].ToString());
                        }
                        if (j == 1)
                        {
                            builder.Write(dataTableDistinct.Rows[i]["newrank"].ToString());
                        }
                    }
                    builder.EndRow();
                }
                builder.EndTable();

                #endregion

                doc.Save(saveDocFile);
                Aspose.Words.Document d = new Aspose.Words.Document(saveDocFile);
                d.Save(pdf_path, Aspose.Words.SaveFormat.Pdf);
                //System.Diagnostics.Process.Start(saveDocFile);//直接打开
                return JsonConvert.SerializeObject(pdf_file_path);
            }
            catch (Exception ex)
            {
                return "99" + ex.Message;
            }
        }
        #endregion


        //教师的需要访问当前页面，传入 学生id，所以需要先判断是否有学生id，没有就取用户id
        public string StudentId () 
        {
            var StudentId = Request["StudentId"];
            if (StudentId != null && StudentId != "") {
                return StudentId.ToString();
            }
            return UserId.ToString();
        }

        public string CapabilityModel()
        {
            DataTable dt = commonbll.GetListDatatable(" select * from bsi_CapabilityModel ");
            return JsonConvert.SerializeObject(dt);
        }


    }
}
