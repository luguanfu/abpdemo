using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank.Models;
using Dy_SimulatedBank_Bll;
using Dy_SimulatedBank_DBUtility.Sql;
using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class ExamineRankController : BaseController
    {
        //
        // GET: /Admin/ExamineRank/
        CommonBll commonbll = new CommonBll();
        public ActionResult Index()
        {
            ViewData["UserType"] = UserType;
            return View();
        }
        public ActionResult EditRank()
        {
            ViewData["UserType"] = UserType;
            return View();
        }
        public ActionResult ExamInfo()
        {
            ViewData["UserType"] = UserType;
            return View();
        }
        public ActionResult StudentInfo()
        {
            ViewData["UserType"] = UserType;
            return View();
        }

        //排名信息表
        public ActionResult PreviewRankS()
        {
            string id = Request["id"];
            ViewBag.rankid = id;
            ViewBag.rank_name = commonbll.GetListSclar("rank_name", "tb_Exam_rank", " and id=" + id + " and add_user=" + UserId);
            DataTable class_dt = commonbll.GetListDatatable("SELECT * FROM dbo.tb_Class WHERE TeacherId =" + UserId);
            string classid = "";
            foreach (DataRow item in class_dt.Rows)
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

            SqlParameter[] sqlparam = new SqlParameter[] {
                new SqlParameter("@rank_id",id),
                new SqlParameter("@stuName",""),
                new SqlParameter("@classId",classid)
            };

            DataSet ds = SqlHelper.ExecuteDataSet("exec Pro_Exam_rank_statistics @rank_id,@stuName,@classId", CommandType.Text, sqlparam);

            if (ds != null && ds.Tables[0].Rows.Count == 0)
            {
                return View("PreviewRanko");
            }
            return View(ds.Tables[0]);
        }



        public ActionResult PreviewRanko()
        {
            ViewData["UserType"] = UserType;
            return View();
        }



        /// <summary>
        /// 获取排名详细数据
        /// </summary>
        /// <returns></returns>
        public string GetExamInfo()
        {
            string html = "<div class=\"table_right \"><table border = \"0\" cellspacing = \"0\" cellpadding = \"0\"> ";
            string rankid = Request["rankid"];
            string stu = SQLSafe(Request["stu"]);//输入查询的学生账号或姓名
            //第一步首先根据排名编号查询出有多少个考核
            DataTable dt = commonbll.GetListDatatable("select a.* from tb_HB_Examination a left join tb_Exam_rank_range b on a.EId=b.e_id where rank_id=" + rankid + " order by a.ExaminationType asc");
            if (dt.Rows.Count < 5)
            {
                html = "<div class=\"table_right \"><table border = \"0\" cellspacing = \"0\" cellpadding = \"0\" style=\"width:100%\"> ";
            }
            html += "<tr>";
            foreach (DataRow item in dt.Rows)
            {
                if (item["E_Name"].ToString().Length > 8)
                {
                    html += "<th title=" + item["E_Name"] + ">" + item["E_Name"].ToString().Substring(0, 8) + "</th>";
                }
                else
                {
                    html += "<th title=" + item["E_Name"] + ">" + item["E_Name"] + "</th>";
                }
            }
            html += "</tr>";
            string left_html = "<div class=\"table_left \"><table border = \"0\" cellspacing = \"0\" cellpadding = \"0\" ><tr><th> 总排名 </th><th> 学生账号 </th><th> 学生姓名 </th><th> 总分 </th></tr> ";
            //得到排名数据
            DataTable class_dt = commonbll.GetListDatatable("select a.* from tb_HB_Examination a,tb_Exam_rank_range c where a.EId=c.E_Id and c.rank_id=" + rankid);
            string classid = "";
            foreach (DataRow item in class_dt.Rows)
            {
                classid += item["E_TeamId"].ToString() + ",";
            }
            if (!string.IsNullOrEmpty(classid))
            {
                classid = classid.Substring(0, classid.Length - 1);
            }
            else
            {
                classid = "0";
            }
            DataTable rank = commonbll.GetListDatatable(@"select * from(
select ROW_NUMBER() over(order by total_score desc) as newrank,* from (
select a.UserId,a.StudentNo,a.Name,(total_score+skill_score) as total_score from (
select a.UserId,a.StudentNo,a.Name,isnull((select SUM(b.ER_Score) from tb_ExaminationResult b ,tb_Exam_rank_range c 
where  b.ER_MId=a.UserId and b.ER_EId = c.E_Id and c.rank_id=" + rankid + "),0) as total_score from tb_Student a where ClassId in (" + classid + ")) a,(select s.UserId,ISNULL((select sum(a.score) from tb_HB_SkillExamination_Result a , tb_Exam_rank_range b where a.eid=b.E_id and a.s_type=2 and a.adduserid=s.UserId  and b.rank_id= " + rankid + "),0) as skill_score from tb_Student s where ClassId in (" + classid + ")) b where a.UserId=b.UserId) sss) a where a.Name like '%" + stu + "%'");

            //得到考试成绩
            //DataTable score = commonbll.GetListDatatable(@"declare @sql varchar(8000) set @sql='select ER_MId as '+'user_id'   select @sql=@sql+' , max(case ER_EId when '''+ convert(varchar,ER_EId) +''' then ER_Score else 0 end) '''+ convert(varchar,ER_EId) +''''   from (select distinct ER_EId from tb_ExaminationResult a left join dbo.tb_Exam_rank_range b on a.ER_EId=b.E_Id where rank_id=" + rankid + "  ) as a   set @sql=@sql+' from tb_ExaminationResult group by ER_MId ' exec(@sql)");
            DataTable score = commonbll.GetListDatatable(@"declare @sql varchar(8000) set @sql='select ER_MId as '+'user_id'   select @sql=@sql+' , max(case ER_EId when '''+ convert(varchar,EId) +''' then ER_Score else 0 end) '''+ convert(varchar,EId) +''''  from (select distinct a.EId from tb_HB_Examination a left join dbo.tb_Exam_rank_range b
                on a.EId=b.E_Id where rank_id=" + rankid + " and ExaminationType=4) as a   set @sql=@sql+' from tb_ExaminationResult group by ER_MId ' exec(@sql)");

            DataTable jnscore = commonbll.GetListDatatable(@"declare @sqla varchar(8000) set @sqla='select adduserid as '+'user_id'   
                select @sqla=@sqla+' , max(case eid when '''+ convert(varchar,EId) +''' then score else 0 end) '''+ convert(varchar,EId) +''''   
                from (select distinct a.EId from tb_HB_Examination a left join dbo.tb_Exam_rank_range b
             on a.EId=b.E_Id where rank_id=" + rankid + " and ExaminationType=5) as a   set @sqla=@sqla+' from tb_HB_SkillExamination_Result group by adduserid ' exec(@sqla)");



            foreach (DataRow item in rank.Rows)
            {
                left_html += "<tr>";
                left_html += "<td>" + item["newrank"] + "</td>";
                left_html += "<td>" + item["StudentNo"] + "</td>";
                left_html += "<td>" + item["Name"] + "</td>";
                left_html += "<td>" + double.Parse(item["total_score"].ToString()).ToString("F2") + "</td>";
                left_html += "</tr>";
                html += "<tr>";
                for (int i = 0; i < dt.Select(" ExaminationType=4").Length; i++)
                {
                    DataRow[] dr = score.Select(" user_id=" + item["UserId"]);
                    if (dr.Length > 0)
                    {
                        html += "<td>" + dr[0][dt.Rows[i]["EId"].ToString()] + "</td>";
                    }
                    else
                    {
                        html += "<td>0.00</td>";
                    }
                }
                for (int i = 0; i < dt.Select(" ExaminationType=5").Length; i++)
                {

                    DataRow[] s_dr = jnscore.Select(" user_id=" + item["UserId"]);
                    if (s_dr.Length > 0)
                    {
                        html += "<td>" + s_dr[0][dt.Rows[i + dt.Select(" ExaminationType=4").Length]["EId"].ToString()] + "</td>";
                    }
                    else
                    {
                        html += "<td>0.00</td>";
                    }
                }
                html += "</tr>";
            }


            html += "</table></div> ";
            left_html += "</table> </div> ";
            return JsonConvert.SerializeObject(left_html + html);
        }


        /// <summary>
        /// 获取排名详细数据
        /// </summary>
        /// <returns></returns>
        public string GetExamInfo1()
        {
            string html = "<div class=\"table_right \"><table border = \"0\" cellspacing = \"0\" cellpadding = \"0\"> ";

            string rankid = Request["rankid"];
            string stu = SQLSafe(Request["stu"]);//输入查询的学生账号或姓名

            string classid = "";

            if (UserType == 3)
            {
                DataTable class_dt = commonbll.GetListDatatable("SELECT * FROM dbo.tb_Class WHERE C_ID =" + ClassId);
                if (class_dt != null && class_dt.Rows.Count > 0)
                {
                    var TeacherId = class_dt.Rows[0]["TeacherId"];
                    DataTable dt = commonbll.GetListDatatable("SELECT * FROM dbo.tb_Class WHERE TeacherId =" + TeacherId);
                    foreach (DataRow item in dt.Rows)
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
            }
            else if (UserType == 2)
            {
                DataTable class_dt = commonbll.GetListDatatable("SELECT * FROM dbo.tb_Class WHERE TeacherId =" + UserId);
                foreach (DataRow item in class_dt.Rows)
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

            SqlParameter[] sqlparam = new SqlParameter[] {
                new SqlParameter("@rank_id",rankid),
                new SqlParameter("@stuName",stu),
                new SqlParameter("@classId",classid)
            };

            DataSet ds = SqlHelper.ExecuteDataSet("exec Pro_Exam_rank_statistics @rank_id,@stuName,@classId", CommandType.Text, sqlparam);

            if (ds != null && ds.Tables[0].Rows.Count > 0)
            {
                List<string> list = new List<string>();
                DataColumnCollection dt = ds.Tables[0].Columns;

                int i = 1;
                foreach (DataColumn item in dt)
                {
                    if (i > 6)
                    {
                        list.Add(item.ColumnName);
                    }
                    i++;
                }

                html = "<div class=\"table_right \"><table border = \"0\" cellspacing = \"0\" cellpadding = \"0\" > ";

                html += "<tr>";
                foreach (var item in list)
                {
                    if (item.Length > 6)
                    {
                        //html += "<th title=" + item + ">" + item.ToString().Substring(0, 6) + "</th>";
                        html += "<th title=" + item + ">" + item + "</th>";
                    }
                    else
                    {
                        html += "<th title=" + item + ">" + item + "</th>";
                    }
                }
                html += "</tr>";
                string left_html = "<div class=\"table_left \"><table border = \"0\" cellspacing = \"0\" cellpadding = \"0\" ><tr><th> 总排名 </th><th> 学生账号 </th><th> 学生姓名 </th><th> 总分 </th></tr> ";

                foreach (DataRow item in ds.Tables[0].Rows)
                {
                    left_html += "<tr>";
                    left_html += "<td>" + item["newrank"] + "</td>";
                    left_html += "<td>" + item["StudentNo"] + "</td>";
                    left_html += "<td>" + item["stuName"] + "</td>";
                    if (item["totalScore"] == DBNull.Value)
                    {
                        left_html += "<td>" + 0 + "</td>";
                    }
                    else
                    {
                        left_html += "<td>" + double.Parse(item["totalScore"].ToString()).ToString("F2") + "</td>";
                    }

                    left_html += "</tr>";


                    html += "<tr>";

                    //遍历费用信息列名再通过循环动态获取相应的值
                    foreach (string strItem in list)
                    {
                        if (strItem.Length > 0)
                        {
                            html += "<td>" + item[strItem] + "</td>";
                        }
                        else
                        {
                            html += "<td>0.00</td>";
                        }
                    }

                    html += "</tr>";
                }

                html += "</table></div> ";
                left_html += "</table> </div> ";
                return JsonConvert.SerializeObject(left_html + html);
            }

            return JsonConvert.SerializeObject(null);

        }



        public string ContestPersonalRankAll()
        {
            string id = Request["id"];
            string html = "<div class=\"table_right \"><table border = \"0\" cellspacing = \"0\" cellpadding = \"0\"> ";
            //string rankid = Request["rankid"];
            string stu = SQLSafe(Request["stu"]);//学生账号或姓名
            if (!ProcessSqlStr(stu))
            {
                stu = "";
            }
            //第一步首先根据排名编号查询出有多少个考核
            DataTable dt = commonbll.GetListDatatable("select a.* from tb_HB_Examination a left join tb_contest_config b on a.EId=b.e_id where b.c_id=" + id + " and b.is_delete=1 order by a.EId asc");
            if (dt.Rows.Count < 5)
            {
                html = "<div class=\"table_right \"><table border = \"0\" cellspacing = \"0\" cellpadding = \"0\"> ";
            }
            html += "<tr>";
            foreach (DataRow item in dt.Rows)
            {
                if (item["E_Name"].ToString().Length > 8)
                {
                    html += "<th title=" + item["E_Name"] + ">" + item["E_Name"].ToString().Substring(0, 8) + "</th>";
                }
                else
                {
                    html += "<th title=" + item["E_Name"] + ">" + item["E_Name"] + "</th>";
                }
            }
            html += "</tr>";
            string left_html = "<div class=\"table_left \"><table border = \"0\" cellspacing = \"0\" cellpadding = \"0\" ><tr><th> 总排名 </th><th> 学生账号 </th><th> 学生姓名 </th><th> 总分 </th></tr> ";

            DataTable rank = commonbll.GetListDatatable(@"select * from(select ROW_NUMBER() over(order by total_score desc) as newrank,* from (select top 10000 a.UserId,a.StudentNo,a.Name,a.UI_UserPic,isnull((select SUM(b.ER_Score) from tb_ExaminationResult b ,tb_contest_config c where  b.ER_MId=a.UserId and b.ER_EId = c.E_Id and c.c_id=" + id + " ),0) as total_score from tb_Student a , tb_contest_enroll co where a.UserId=co.user_id and co.c_id=" + id + " order by total_score desc) a) b where Name like '%" + stu + "%' or StudentNo like '%" + stu + "%'");
            //得到考试成绩
            DataTable score = commonbll.GetListDatatable(@"declare @sql varchar(8000) set @sql='select a.ER_MId as '+'userid'   select @sql=@sql+' , max(case ER_EId when '''+ convert(varchar,ER_EId) +''' then ER_Score else 0 end) '''+ convert(varchar,ER_EId) +''''   from (select distinct  ER_EId from tb_ExaminationResult a left join dbo.tb_contest_config b on a.ER_EId=b.E_Id where b.c_id=" + id + " ) as a   set @sql=@sql+' from tb_ExaminationResult a,tb_contest_enroll co where a.ER_MId=co.user_id and co.c_id=" + id + " group by ER_MId ' exec(@sql)");

            foreach (DataRow item in rank.Rows)
            {
                left_html += "<tr>";
                left_html += "<td>" + item["newrank"] + "</td>";
                left_html += "<td>" + item["StudentNo"] + "</td>";
                left_html += "<td>" + item["Name"] + "</td>";
                left_html += "<td>" + item["total_score"] + "</td>";
                left_html += "</tr>";
                html += "<tr>";
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    DataRow[] dr = score.Select(" userid=" + item["UserId"]);
                    if (dr.Length > 0)
                    {
                        html += "<td>" + dr[0][dt.Rows[i]["EId"].ToString()] + "</td>";
                    }
                    else
                    {
                        html += "<td>0</td>";
                    }
                }
                html += "</tr>";
            }
            html += "</table></div> ";
            left_html += "</table> </div> ";
            return JsonConvert.SerializeObject(left_html + html);
        }



        public string ContestTeamRankAll()
        {
            string id = Request["id"];
            string html = "<div class=\"table_right \"><table border = \"0\" cellspacing = \"0\" cellpadding = \"0\"> ";
            //string rankid = Request["rankid"];
            string stu = SQLSafe(Request["stu"]);//学生账号或姓名
            if (!ProcessSqlStr(stu))
            {
                stu = "";
            }
            //第一步首先根据排名编号查询出有多少个考核
            DataTable dt = commonbll.GetListDatatable("select a.* from tb_HB_Examination a left join tb_contest_config b on a.EId=b.e_id where b.c_id=" + id + " and b.is_delete=1 order by a.EId asc");
            if (dt.Rows.Count < 5)
            {
                html = "<div class=\"table_right \"><table border = \"0\" cellspacing = \"0\" cellpadding = \"0\" > ";
            }
            html += "<tr>";
            foreach (DataRow item in dt.Rows)
            {
                if (item["E_Name"].ToString().Length > 8)
                {
                    html += "<th title=" + item["E_Name"] + ">" + item["E_Name"].ToString().Substring(0, 8) + "</th>";
                }
                else
                {
                    html += "<th title=" + item["E_Name"] + ">" + item["E_Name"] + "</th>";
                }
            }
            html += "</tr>";
            string left_html = "<div class=\"table_left \"><table border = \"0\" cellspacing = \"0\" cellpadding = \"0\" ><tr><th> 总排名 </th><th> 团队名称 </th><th> 总分 </th></tr> ";

            DataTable rank = commonbll.GetListDatatable(@"select * from(select ROW_NUMBER() over(order by team_score desc) as newrank,* from (select top 10000  e.*,f.team_name,f.team_img,f.declaration from (select top 100000 team_id,SUM(total_score) as team_score from ( select user_id,team_id,b.e_id,(select ER_Score from tb_ExaminationResult c where c.ER_EId=b.e_id and c.ER_MId=a.user_id)as total_score from tb_contest_enroll a,tb_contest_config b where a.c_id=b.c_id and a.c_id=" + id + " )a group by team_id) e ,tb_contest_enroll f where e.team_id=f.team_id and c_id=" + id + " and f.leader=1  order by team_score desc) a) b where team_name like '%" + stu + "%'");
            //得到考试成绩
            DataTable score = commonbll.GetListDatatable(@"declare @sql varchar(8000) set @sql='select co.team_id, a.ER_MId as '+'userid'   select @sql=@sql+' , max(case ER_EId when '''+ convert(varchar,ER_EId) +''' then ER_Score else 0 end) '''+ convert(varchar,ER_EId) +''''   from (select distinct  ER_EId from tb_ExaminationResult a left join dbo.tb_contest_config b on a.ER_EId=b.E_Id where b.c_id=" + id + " ) as a   set @sql=@sql+' from tb_ExaminationResult a,tb_contest_enroll co where a.ER_MId=co.user_id and co.c_id=" + id + " group by ER_MId,team_id ' exec(@sql)");

            foreach (DataRow item in rank.Rows)
            {
                left_html += "<tr>";
                left_html += "<td>" + item["newrank"] + "</td>";
                left_html += "<td>" + item["team_name"] + "</td>";
                left_html += "<td>" + item["team_score"] + "</td>";
                left_html += "</tr>";
                html += "<tr>";
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    DataRow[] dr = score.Select(" team_id=" + item["team_id"]);
                    if (dr.Length > 0)
                    {
                        decimal total_score = 0;
                        for (int j = 0; j < dr.Length; j++)
                        {
                            total_score += decimal.Parse(dr[j][dt.Rows[i]["EId"].ToString()].ToString());
                        }
                        html += "<td>" + total_score + "</td>";
                    }
                    else
                    {
                        html += "<td>0</td>";
                    }
                }
                html += "</tr>";
            }
            html += "</table></div> ";
            left_html += "</table> </div> ";
            return JsonConvert.SerializeObject(left_html + html);
        }

        public string AddExma()
        {
            string id = Request["id"];
            string[] eids = Request["eids"].Split(',');
            string list = "rank_id,E_Id";
            string value = "@rank_id,@E_Id";

            int rcount = 0;
            foreach (string eid in eids)
            {
                SqlParameter[] pars = new SqlParameter[]
             {
                       new SqlParameter("@rank_id",id),
                       new SqlParameter("@E_Id",eid)
             };
                rcount = rcount + commonbll.Add("tb_Exam_rank_range", list, value, pars);
            }
            if (rcount > 0)
            {
                return "1";
            }
            return "99";
        }
        public string DelExma()
        {
            string id = Request["id"];
            string eids = Request["eids"];
            var rcount = commonbll.DeleteInfo("tb_Exam_rank_range", " and rank_id=" + id + " and E_Id in(" + eids + ")");
            if (rcount > 0)
            {
                return "1";
            }
            return "99";


        }
        public string Export()
        {

            string name = SQLSafe(Request["name"]);
            string id = SQLSafe(Request["id"]);
            string eid = SQLSafe(Request["eid"]);
            string type = Request["type"];//1：技能考核，2：知识考核

            string clas = "";
            string wheres = "and  s.SchoolId = sc.S_ID and s.CollegeId = c.C_ID and s.MajorId = m.M_ID and s.ClassId = cc.C_ID ";
            if (type == "1")//技能考核
            {
                List<int> intList = new List<int>();
                DataTable kh = commonbll.GetListDatatable("distinct Classid", " bsi_PracticeClass", " and PracticeId in (SELECT id FROM bsi_PracticeAssessment a where a.id=" + eid + "  and type_all=1 and PracticeState=1)");
                if (kh.Rows.Count > 0)
                {
                    foreach (DataRow item in kh.Rows)
                    {
                        //clas = kh.Rows[0]["Classid"].ToString();
                        var clasId = item["Classid"];
                        intList.Add(Convert.ToInt32(clasId));
                    }
                }
                string str = string.Join(",", intList.ConvertAll<string>(new Converter<int, string>(n => n.ToString())).ToArray());

                if (str != null && str != "")
                {
                    wheres += "and s.ClassId in (" + str + ")";
                }
                else
                {
                    wheres += "and s.ClassId in (0)";
                }
            }
            else //知识考核
            {
                DataTable kh = commonbll.GetListDatatable("*", " tb_HB_Examination", " AND E_Type=1 and E_IsState=1 and EId='" + eid + "'");
                if (kh.Rows.Count > 0)
                {
                    clas = kh.Rows[0]["E_TeamId"].ToString();
                    clas = "0" + clas + "0";
                    if (clas != null && clas != "")
                    {
                        wheres += "and s.ClassId in (" + clas + ")";
                    }
                    else
                    {
                        wheres += "and s.ClassId in (0)";
                    }
                }
            }

            if (name != "")
            {
                wheres += "and (  s.Name like '%" + name + "%' or s.StudentNo like '%" + name + "%')";
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = "  s.S_ID desc"; //排序
            m.strFld = " sc.SchoolName,c.CollegeName,m.MajorName,cc.ClassName,s.StudentNo,s.Name,s.S_ID,s.UserId";
            m.tab = " tb_Student s, dbo.tb_College c, dbo.tb_School sc, dbo.tb_Major m, dbo.tb_Class cc";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            if (dt.Rows.Count > 0)
            {
                dt.Columns.Add("ER_Score", typeof(string));
                dt.Columns.Add("start_time", typeof(string));
            }
            foreach (DataRow dr in dt.Rows)
            {
                //string ExaminationType = kh.Rows[0]["ExaminationType"].ToString();
                if (type == "2") //知识考核
                {
                    string uid = dr["UserId"].ToString();

                    DataTable dtss = commonbll.GetListDatatable("ER_Score, ER_AddTime ", "tb_ExaminationResult", " AND ER_Type=1 and ER_EId = '" + eid + "' and ER_MId='" + uid + "'");
                    if (dtss.Rows.Count > 0)
                    {
                        dr["ER_Score"] = dtss.Rows[0]["ER_Score"];
                        dr["start_time"] = dtss.Rows[0]["ER_AddTime"];
                    }
                    else
                    {
                        dr["ER_Score"] = 0;
                        dr["start_time"] = "未考试";
                    }
                }
                else //技能考核
                {
                    string uid = dr["UserId"].ToString();

                    DataTable dtss = commonbll.GetListDatatable("scores, addtime ", "bsi_TotalResult", " and Type_All=1 and examid = '" + eid + "' and adduserid='" + uid + "'");
                    if (dtss.Rows.Count > 0)
                    {
                        decimal isd = 0;
                        for (int i = 0; i < dtss.Rows.Count; i++)
                        {
                            isd += decimal.Parse(dtss.Rows[i]["scores"].ToString());
                        }
                        dr["ER_Score"] = isd;
                        dr["start_time"] = dtss.Rows[0]["addtime"];
                    }
                    else
                    {
                        dr["ER_Score"] = "0.00";
                        dr["start_time"] = "未考试";
                    }
                }
            }
            Aspose.Cells.Workbook wk = new Aspose.Cells.Workbook();

            string excelFile = string.Empty;
            excelFile = "/Export/成绩排名导出模版.xls";
#pragma warning disable CS0618 // “Workbook.Open(string)”已过时:“Use Workbook(string) constructor method instead.”
            wk.Open(System.Web.HttpContext.Current.Server.MapPath(excelFile));
#pragma warning restore CS0618 // “Workbook.Open(string)”已过时:“Use Workbook(string) constructor method instead.”

            string filename = "";
            if (dt.Rows.Count > 0)
            {

                //循环写入数据
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    //wk.Worksheets[0].Cells[i + 1, 0].PutValue(dt.Rows[i]["rownum"].ToString().Trim());//排名
                    wk.Worksheets[0].Cells[i + 1, 0].PutValue(i + 1);//排名
                    wk.Worksheets[0].Cells[i + 1, 1].PutValue(dt.Rows[i]["StudentNo"].ToString().Trim());//账号
                    wk.Worksheets[0].Cells[i + 1, 2].PutValue(dt.Rows[i]["Name"].ToString().Trim());//姓名

                    wk.Worksheets[0].Cells[i + 1, 3].PutValue(dt.Rows[i]["CollegeName"].ToString().Trim());//学院
                    wk.Worksheets[0].Cells[i + 1, 4].PutValue(dt.Rows[i]["MajorName"].ToString().Trim());//专业
                    wk.Worksheets[0].Cells[i + 1, 5].PutValue(dt.Rows[i]["ClassName"].ToString().Trim());//班级
                    wk.Worksheets[0].Cells[i + 1, 6].PutValue(dt.Rows[i]["ER_Score"].ToString().Trim());//分数
                    wk.Worksheets[0].Cells[i + 1, 7].PutValue(dt.Rows[i]["start_time"].ToString().Trim());//时间


                }

                string ExcelName = DateTime.Now.ToString("yyyyMMdd") + "" + DateTime.Now.Millisecond + "成绩排名";
                filename = "/Export/" + ExcelName + ".xls";

                string serverPath = System.Web.HttpContext.Current.Server.MapPath(filename);
                wk.Save(serverPath);


            }
            var json = new object[] {
                        new{
                            filename=filename,
                        }
                    };
            return JsonConvert.SerializeObject(json);

        }
        public string GetStudent()
        {
            string name = SQLSafe(Request["name"]);
            string id = SQLSafe(Request["id"]);
            string eid = SQLSafe(Request["eid"]);
            string type = Request["type"];//1：技能考核，2：知识考核

            string clas = "";
            string wheres = "and  s.SchoolId = sc.S_ID and s.CollegeId = c.C_ID and s.MajorId = m.M_ID and s.ClassId = cc.C_ID ";
            if (type == "1")//技能考核
            {
                List<int> intList = new List<int>();
                DataTable kh = commonbll.GetListDatatable("distinct Classid", " bsi_PracticeClass", " and PracticeId in (SELECT id FROM bsi_PracticeAssessment a where a.id=" + eid + "  and type_all=1 and PracticeState=1)");
                if (kh.Rows.Count > 0)
                {
                    foreach (DataRow item in kh.Rows)
                    {
                        var clasId = item["Classid"];
                        intList.Add(Convert.ToInt32(clasId));
                    }
                }
                string str = string.Join(",", intList.ConvertAll<string>(new Converter<int, string>(n => n.ToString())).ToArray());

                if (str != null && str != "")
                {
                    wheres += "and s.ClassId in (" + str + ")";
                }
                else
                {
                    wheres += "and s.ClassId in (0)";
                }
            }
            else //知识考核
            {
                DataTable kh = commonbll.GetListDatatable("*", " tb_HB_Examination", " AND E_Type=1 and E_IsState=1 and EId='" + eid + "'");
                if (kh.Rows.Count > 0)
                {
                    clas = kh.Rows[0]["E_TeamId"].ToString();
                    clas = "0" + clas + "0";
                    if (clas != null && clas != "")
                    {
                        wheres += "and s.ClassId in (" + clas + ")";
                    }
                    else
                    {
                        wheres += "and s.ClassId in (0)";
                    }
                }
            }

            if (name != "")
            {
                wheres += "and (  s.Name like '%" + name + "%' or s.StudentNo like '%" + name + "%')";
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = "  s.S_ID desc"; //排序
            m.strFld = " sc.SchoolName,c.CollegeName,m.MajorName,cc.ClassName,s.StudentNo,s.Name,s.S_ID,s.UserId";
            m.tab = " tb_Student s, dbo.tb_College c, dbo.tb_School sc, dbo.tb_Major m, dbo.tb_Class cc";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            if (dt.Rows.Count > 0)
            {
                dt.Columns.Add("ER_Score", typeof(string));
                dt.Columns.Add("start_time", typeof(string));
            }
            foreach (DataRow dr in dt.Rows)
            {
                if (type == "2") //知识考核
                {
                    string uid = dr["UserId"].ToString();

                    DataTable dtss = commonbll.GetListDatatable("ER_Score, ER_AddTime ", "tb_ExaminationResult", " AND ER_Type=1 and ER_EId = '" + eid + "' and ER_MId='" + uid + "'");
                    if (dtss.Rows.Count > 0)
                    {
                        dr["ER_Score"] = dtss.Rows[0]["ER_Score"];
                        dr["start_time"] = dtss.Rows[0]["ER_AddTime"];
                    }
                    else
                    {
                        dr["ER_Score"] = 0;
                        dr["start_time"] = "未考试";
                    }
                }
                else //技能考核
                {
                    string uid = dr["UserId"].ToString();

                    DataTable dtss = commonbll.GetListDatatable("scores, addtime ", "bsi_TotalResult", " and Type_All=1 and examid = '" + eid + "' and adduserid='" + uid + "'");
                    if (dtss.Rows.Count > 0)
                    {
                        decimal isd = 0;
                        for (int i = 0; i < dtss.Rows.Count; i++)
                        {
                            isd += decimal.Parse(dtss.Rows[i]["scores"].ToString());
                        }
                        dr["ER_Score"] = isd;
                        dr["start_time"] = dtss.Rows[0]["addtime"];
                    }
                    else
                    {
                        dr["ER_Score"] = "0.00";
                        dr["start_time"] = "未考试";
                    }
                }
            }


            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }

        /// <summary>
        /// 弹出选择的考核列表
        /// </summary>
        /// <returns></returns>
        public string GetExamData()
        {
            string sw = "";
            string id = SQLSafe(Request["id"]);
            string type = SQLSafe(Request["type"]);
            string name = SQLSafe(Request["name"]);
            string utype = "";
            if (UserType != 1)
            {
                utype = utype + " and b.add_user=" + UserId;
            }
            if (id != "" && id != null)
            {
                sw = "where b.rank_id =" + id + " ";
            }
            string where = " and a.IsDelete='false'and a.E_Type=1 and a.EId not in(select b.E_Id from tb_Exam_rank_range b  " + sw + ") and a.ExaminationType=" + type;

            if (name != null && name != "")
            {
                where = where + " and a.E_Name like '%" + name + "%'";
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.E_AddTime desc"; //排序必须填写
            m.strFld = @"a.*,
(case a.ExaminationType when 4 then '知识考核' when 5 then '技能考核' else '' end) as examinetype/*,
(select COUNT(*) from tb_ExaminationResult c where c.ER_EId=a.EId and c.ER_Score>=a.PassingScore) as qualified_p,
(select max(c.ER_Score) from tb_ExaminationResult c where c.ER_EId=a.EId)  as max_src*/";
            m.tab = @"tb_HB_Examination a";
            m.strWhere = where;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            if (dt.Rows.Count > 0)
            {
                dt.Columns.Add("start_time", typeof(string));
                dt.Columns.Add("end_time", typeof(string));
                dt.Columns.Add("AbilityandScore", typeof(string));
                dt.Columns.Add("pass_rate", typeof(string));
                dt.Columns.Add("max_src", typeof(string));
                dt.Columns.Add("qualified_p", typeof(string));
            }
            foreach (DataRow dr in dt.Rows)
            {
                if (dr["examinetype"].ToString() == "知识考核")
                {
                    string eid = dr["EId"].ToString();
                    DataTable data = commonbll.GetListDatatable("b.CapabilityName, a.CAScore", "tb_ExaminationAbility a,tb_CapabilityModelSetting b", "  and a.ExaminationType=4 and a.AbilityId=b.ID and a.AEId=" + eid);
                    string AbilityandScore = "";
                    foreach (DataRow drs in data.Rows)
                    {
                        AbilityandScore = AbilityandScore + drs["CapabilityName"] + ":" + drs["CAScore"].ToString();
                    }
                    dr["AbilityandScore"] = AbilityandScore;
                    dr["start_time"] = Convert.ToDateTime(dr["E_StartTime"].ToString()).ToString("yyyy-MM-dd HH:mm");
                    dr["end_time"] = Convert.ToDateTime(dr["E_EndTime"].ToString()).ToString("yyyy-MM-dd HH:mm");
                    dr["max_src"] = "0";
                    DataTable max_srcs = commonbll.GetListDatatable("er.ER_Score ,e.PassingScore ", " tb_HB_Examination e, tb_ExaminationResult er,tb_Student s", "and s.UserId=er.ER_Operator and e.EId = er.ER_EId and e.EId=" + eid + " order by er.ER_Score desc");
                    if (max_srcs.Rows.Count > 0)
                    {
                        if (max_srcs.Rows[0]["ER_Score"] != null && max_srcs.Rows[0]["ER_Score"].ToString() != "")
                        {
                            dr["max_src"] = max_srcs.Rows[0]["ER_Score"];
                        }
                        else { dr["max_src"] = "0"; }

                        int rss = 0;
                        for (int i = 0; i < max_srcs.Rows.Count; i++)
                        {
                            double ers = double.Parse(max_srcs.Rows[i]["ER_Score"].ToString());
                            double ps = double.Parse(max_srcs.Rows[i]["PassingScore"].ToString());
                            if (ers >= ps)
                            {
                                rss += 1;
                            }
                        }
                        dr["qualified_p"] = rss;
                        DataTable xss = commonbll.GetListDatatable("COUNT(*) as sl", " tb_Student", " and ClassId in(" + dr["E_TeamId"] + ")");
                        if (int.Parse(xss.Rows[0]["sl"].ToString()) == 0)
                        {
                            dr["pass_rate"] = "0.0%";
                        }
                        else
                        {
                            int rs = int.Parse(xss.Rows[0]["sl"].ToString());
                            double percent = (double)rss / rs;
                            dr["pass_rate"] = percent.ToString("0.0%");
                        }
                    }
                    else { dr["max_src"] = "0"; dr["qualified_p"] = "0"; dr["pass_rate"] = "0.0%"; }
                }
                else
                {
                    string eid = dr["EId"].ToString();
                    DataTable data = commonbll.GetListDatatable("b.CapabilityName, a.CAScore", "tb_ExaminationAbility a,tb_CapabilityModelSetting b", " and a.ExaminationType=5 and a.AbilityId=b.ID and a.AEId=" + eid);
                    string AbilityandScore = "";
                    foreach (DataRow drs in data.Rows)
                    {
                        AbilityandScore = AbilityandScore + drs["CapabilityName"] + ":" + drs["CAScore"].ToString();
                    }
                    dr["AbilityandScore"] = AbilityandScore;
                    dr["start_time"] = Convert.ToDateTime(dr["E_StartTime"].ToString()).ToString("yyyy-MM-dd HH:mm");
                    dr["end_time"] = Convert.ToDateTime(dr["E_EndTime"].ToString()).ToString("yyyy-MM-dd HH:mm");

                    dr["max_src"] = "0";
                    DataTable max_srcs = commonbll.GetListDatatable("er.score ,e.PassingScore ", " tb_HB_Examination e, tb_HB_SkillExamination_Result er,tb_Student s", " and er.adduserid=s.UserId  and e.EId = er.eid and e.EId=" + eid + " order by er.score desc");

                    if (max_srcs.Rows.Count > 0)
                    {
                        //最高分
                        if (max_srcs.Rows[0]["score"] != null && max_srcs.Rows[0]["score"].ToString() != "")
                        {
                            dr["max_src"] = max_srcs.Rows[0]["score"];
                        }
                        else { dr["max_src"] = "0"; }

                        int rss = 0;
                        for (int i = 0; i < max_srcs.Rows.Count; i++)
                        {
                            double ers = double.Parse(max_srcs.Rows[i]["score"].ToString());
                            double ps = double.Parse(max_srcs.Rows[i]["PassingScore"].ToString());
                            if (ers >= ps)
                            {
                                rss += 1;
                            }
                        }
                        dr["qualified_p"] = rss;//及格人数
                        string tid = "0";
                        if (dr["E_TeamId"].ToString() == null || dr["E_TeamId"].ToString() == "")
                        {
                            tid = "0";
                        }
                        else
                        {
                            tid = dr["E_TeamId"].ToString();
                        }
                        DataTable xss = commonbll.GetListDatatable("COUNT(*) as sl", " tb_Student", " and ClassId in(" + tid + ")");
                        if (int.Parse(xss.Rows[0]["sl"].ToString()) == 0)
                        {
                            dr["pass_rate"] = "0.0%";
                        }
                        else
                        {
                            int rs = int.Parse(xss.Rows[0]["sl"].ToString());
                            double percent = (double)rss / rs;
                            dr["pass_rate"] = percent.ToString("0.0%");
                        }//及格率
                    }
                    else { dr["max_src"] = "0"; dr["qualified_p"] = "0"; dr["pass_rate"] = "0.0%"; }
                }
            }
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }

        /// <summary>
        /// 获得知识考核列表
        /// </summary>
        /// <returns></returns>
        public string GetKnowledgeAssessment()
        {
            string wheres = " and E_Type=1 and E_IsState=1 and E_AddOperator=" + UserId;

            //查询条件
            if (!string.IsNullOrEmpty(Request["SearchName"])) //考核名称
            {
                wheres += " and e_Name like  '%" + Request["SearchName"] + "%'";
            }

            string id = SQLSafe(Request["id"]);
            var sw = "";
            if (id != "" && id != null)
            {
                sw = "where b.rank_id =" + id + " ";
            }

            wheres += " and a.EId not in(select b.E_Id from tb_Exam_rank_range b  " + sw + ") ";

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " E_AddTime desc "; //排序必须填写
            m.strFld = @"*";

            m.tab = @" tb_HB_Examination a";

            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }

        /// <summary>
        /// 获得实训考核列表
        /// </summary>
        /// <returns></returns>
        public string GetTrainingExamination()
        {
            var type = Request["type"];//(个人/团队)考核

            string wheres = " and a.Type_All=1 AND a.PracticeState=1 AND PracticeType= " + type + " and AddUserId= " + UserId;

            //查询条件
            if (!string.IsNullOrEmpty(Request["SearchName"])) //考核名称
            {
                wheres += " and PracticeName like  '%" + Request["SearchName"] + "%'";
            }

            string id = SQLSafe(Request["id"]);
            var sw = "";
            if (id != "" && id != null)
            {
                sw = "where b.rank_id =" + id + " ";
            }

            wheres += " and a.Id not in(select b.E_Id from tb_Exam_rank_range b  " + sw + ") ";

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " AddTime desc "; //排序必须填写
            m.strFld = @"*,DATEADD(MINUTE,PracticeLong,PracticeStarTime) PracticeEndTime";

            m.tab = @" bsi_PracticeAssessment a";

            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }

        public string GetRangDataById()
        {
            string id = SQLSafe(Request["id"]);
            string eids = SQLSafe(Request["eid"]);

            string where = " and EId =" + eids;

            string strFld = @"*";

            string tab = @"(SELECT b.ID AS Eid, b.PracticeName, b.PracticeStarTime, DATEADD(MINUTE, b.PracticeLong, b.PracticeStarTime) PracticeEndTime, '技能考核' AS ExaminationType, b.AddTime
FROM  tb_Exam_rank_range a
INNER JOIN dbo.bsi_PracticeAssessment b ON a.E_Id = b.ID AND  b.Type_All = 1 AND b.PracticeState = 1 AND a.rank_id = " + id +
    " UNION ALL " +
    "SELECT b.EId AS Eid, b.E_Name,b.E_StartTime,E_EndTime,'知识考核' AS ExaminationType,b.E_AddTime FROM tb_Exam_rank_range a " +
    "INNER JOIN tb_HB_Examination b ON a.E_Id=b.EId AND b.E_Type=1 and b.E_IsState=1 AND a.rank_id = " + id + ")as t";


            var dt = commonbll.GetListDatatable(strFld, tab, where);
            if (dt.Rows.Count > 0)
            {
                dt.Columns.Add("start_time", typeof(string));
                dt.Columns.Add("end_time", typeof(string));
                dt.Columns.Add("AbilityandScore", typeof(string));
                dt.Columns.Add("pass_rate", typeof(string));
                dt.Columns.Add("max_src", typeof(string));
                dt.Columns.Add("qualified_p", typeof(string));
                dt.Columns.Add("Score", typeof(string));
                dt.Columns.Add("ToScore", typeof(string));
            }
            foreach (DataRow dr in dt.Rows)
            {
                if (dr["ExaminationType"].ToString() == "知识考核")
                {
                    string eid = dr["EId"].ToString();

                    dr["start_time"] = Convert.ToDateTime(dr["PracticeStarTime"].ToString()).ToString("yyyy-MM-dd HH:mm");
                    dr["end_time"] = Convert.ToDateTime(dr["PracticeEndTime"].ToString()).ToString("yyyy-MM-dd HH:mm");
                    dr["max_src"] = "0";
                    DataTable max_srcs = commonbll.GetListDatatable("er.ER_Score,(select SUM(EP_Score) from tb_HB_ExaminationPapers where EP_PId=E_PId) as ToScore",
                        @" tb_HB_Examination e, tb_ExaminationResult er,tb_Student s", "and s.UserId=er.ER_Operator and e.EId = er.ER_EId AND e.E_Type=1 and e.E_IsState=1 and e.EId=" + eid + " order by er.ER_Score desc");
                    if (max_srcs.Rows.Count > 0)
                    {
                        dr["ToScore"] = max_srcs.Rows[0]["ToScore"];//总分数

                        if (max_srcs.Rows[0]["ER_Score"] != null && max_srcs.Rows[0]["ER_Score"].ToString() != "")
                        {
                            dr["max_src"] = max_srcs.Rows[0]["ER_Score"];
                        }
                        else { dr["max_src"] = "0"; }

                        int rss = 0;
                        for (int i = 0; i < max_srcs.Rows.Count; i++)
                        {
                            double ers = double.Parse(max_srcs.Rows[i]["ER_Score"].ToString());
                            if (ers >= Convert.ToInt32(max_srcs.Rows[0]["ToScore"]))
                            {
                                rss += 1;
                            }
                        }
                        dr["qualified_p"] = rss;
                        DataTable xss = commonbll.GetListDatatable("COUNT(*) as sl", " tb_ExaminationResult", " and ER_EId=" + eid);
                        if (int.Parse(xss.Rows[0]["sl"].ToString()) == 0)
                        {
                            dr["pass_rate"] = "0.0%";
                        }
                        else
                        {
                            int rs = int.Parse(xss.Rows[0]["sl"].ToString());
                            double percent = (double)rss / rs; //及格人数/考试次数
                            dr["pass_rate"] = percent.ToString("0.0%");
                        }
                    }
                    else { dr["max_src"] = "0"; dr["qualified_p"] = "0"; dr["pass_rate"] = "0.0%"; }
                }
                else
                {
                    string eid = dr["EId"].ToString();

                    dr["start_time"] = Convert.ToDateTime(dr["PracticeStarTime"].ToString()).ToString("yyyy-MM-dd HH:mm");
                    dr["end_time"] = Convert.ToDateTime(dr["PracticeEndTime"].ToString()).ToString("yyyy-MM-dd HH:mm");

                    dr["max_src"] = "0";
                    DataTable max_srcs = commonbll.GetListDatatable("er.scores ", " bsi_PracticeAssessment e, bsi_TotalResult er,tb_Student s", " and er.adduserid=s.UserId  and e.Id = er.ExamId AND  e.Type_All=1 AND e.PracticeState=1 and e.Id=" + eid + " order by er.scores desc");

                    if (max_srcs.Rows.Count > 0)
                    {
                        //最高分
                        if (max_srcs.Rows[0]["scores"] != null && max_srcs.Rows[0]["scores"].ToString() != "")
                        {
                            dr["max_src"] = max_srcs.Rows[0]["scores"];
                        }
                        else { dr["max_src"] = "0"; }

                        int rss = 0;
                        for (int i = 0; i < max_srcs.Rows.Count; i++)
                        {
                            double ers = double.Parse(max_srcs.Rows[i]["scores"].ToString());
                            if (ers >= 60)
                            {
                                rss += 1;
                            }
                        }
                        dr["qualified_p"] = rss;//及格人数

                        DataTable xss = commonbll.GetListDatatable("COUNT(*) as sl", " bsi_TotalResult ", " and ExamId=" + eid);
                        if (int.Parse(xss.Rows[0]["sl"].ToString()) == 0)
                        {
                            dr["pass_rate"] = "0.0%";
                        }
                        else
                        {
                            int rs = int.Parse(xss.Rows[0]["sl"].ToString());
                            double percent = (double)rss / rs;
                            dr["pass_rate"] = percent.ToString("0.0%");
                        }//及格率
                    }
                    else { dr["max_src"] = "0"; dr["qualified_p"] = "0"; dr["pass_rate"] = "0.0%"; }
                }

            }
            return JsonConvert.SerializeObject(dt);
        }


        /// <summary>
        /// 加载统计范围列表
        /// </summary>
        /// <returns></returns>
        public string GetRangData()
        {
            string id = SQLSafe(Request["id"]);

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " AddTime desc"; //排序必须填写
            m.strFld = @"*";
            m.tab = @"( SELECT b.ID AS Eid, b.PracticeName,b.PracticeStarTime,DATEADD(MINUTE,b.PracticeLong,b.PracticeStarTime) PracticeEndTime,'技能考核' AS ExaminationType,b.AddTime
FROM  tb_Exam_rank_range a
INNER JOIN dbo.bsi_PracticeAssessment b ON a.E_Id = b.ID AND  b.Type_All=1 AND b.PracticeState=1 AND a.rank_id =" + id +
    " UNION ALL " +
    "SELECT b.EId AS Eid, b.E_Name,b.E_StartTime,E_EndTime,'知识考核' AS ExaminationType,b.E_AddTime FROM tb_Exam_rank_range a " +
    "INNER JOIN tb_HB_Examination b ON a.E_Id=b.EId AND b.E_Type=1 and b.E_IsState=1 AND a.rank_id = " + id + ")as t";
            //m.strWhere = where;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            if (dt.Rows.Count > 0)
            {
                dt.Columns.Add("start_time", typeof(string));
                dt.Columns.Add("end_time", typeof(string));
                dt.Columns.Add("AbilityandScore", typeof(string));
                dt.Columns.Add("pass_rate", typeof(string));
                dt.Columns.Add("max_src", typeof(string));
                dt.Columns.Add("qualified_p", typeof(string));
            }
            foreach (DataRow dr in dt.Rows)
            {
                if (dr["ExaminationType"].ToString() == "知识考核")
                {
                    string eid = dr["EId"].ToString();

                    dr["start_time"] = Convert.ToDateTime(dr["PracticeStarTime"].ToString()).ToString("yyyy-MM-dd HH:mm");
                    dr["end_time"] = Convert.ToDateTime(dr["PracticeEndTime"].ToString()).ToString("yyyy-MM-dd HH:mm");
                    dr["max_src"] = "0";
                    DataTable max_srcs = commonbll.GetListDatatable("er.ER_Score", " tb_HB_Examination e, tb_ExaminationResult er,tb_Student s", "and s.UserId=er.ER_Operator and e.EId = er.ER_EId AND e.E_Type=1 and e.E_IsState=1 and e.EId=" + eid + " order by er.ER_Score desc");
                    if (max_srcs.Rows.Count > 0)
                    {
                        if (max_srcs.Rows[0]["ER_Score"] != null && max_srcs.Rows[0]["ER_Score"].ToString() != "")
                        {
                            dr["max_src"] = max_srcs.Rows[0]["ER_Score"];
                        }
                        else { dr["max_src"] = "0"; }

                        int rss = 0;
                        for (int i = 0; i < max_srcs.Rows.Count; i++)
                        {
                            double ers = double.Parse(max_srcs.Rows[i]["ER_Score"].ToString());

                            if (ers >= 60)
                            {
                                rss += 1;
                            }
                        }
                        dr["qualified_p"] = rss;
                        DataTable xss = commonbll.GetListDatatable("COUNT(*) as sl", " tb_ExaminationResult", " and ER_EId=" + eid);
                        if (int.Parse(xss.Rows[0]["sl"].ToString()) == 0)
                        {
                            dr["pass_rate"] = "0.0%";
                        }
                        else
                        {
                            int rs = int.Parse(xss.Rows[0]["sl"].ToString());
                            double percent = (double)rss / rs; //及格人数/考试次数
                            dr["pass_rate"] = percent.ToString("0.0%");
                        }
                    }
                    else { dr["max_src"] = "0"; dr["qualified_p"] = "0"; dr["pass_rate"] = "0.0%"; }
                }
                else
                {
                    string eid = dr["EId"].ToString();

                    dr["start_time"] = Convert.ToDateTime(dr["PracticeStarTime"].ToString()).ToString("yyyy-MM-dd HH:mm");
                    dr["end_time"] = Convert.ToDateTime(dr["PracticeEndTime"].ToString()).ToString("yyyy-MM-dd HH:mm");

                    dr["max_src"] = "0";
                    DataTable max_srcs = commonbll.GetListDatatable("er.scores ", " bsi_PracticeAssessment e, bsi_TotalResult er,tb_Student s", " and er.adduserid=s.UserId  and e.Id = er.ExamId AND  e.Type_All=1 AND e.PracticeState=1 and e.Id=" + eid + " order by er.scores desc");

                    if (max_srcs.Rows.Count > 0)
                    {
                        //最高分
                        if (max_srcs.Rows[0]["scores"] != null && max_srcs.Rows[0]["scores"].ToString() != "")
                        {
                            dr["max_src"] = max_srcs.Rows[0]["scores"];
                        }
                        else { dr["max_src"] = "0"; }

                        int rss = 0;
                        for (int i = 0; i < max_srcs.Rows.Count; i++)
                        {
                            double ers = double.Parse(max_srcs.Rows[i]["scores"].ToString());

                            if (ers >= 60)
                            {
                                rss += 1;
                            }
                        }
                        dr["qualified_p"] = rss;
                        //及格人数
                        DataTable xss = commonbll.GetListDatatable("COUNT(*) as sl", " bsi_TotalResult ", " and ExamId=" + eid);
                        if (int.Parse(xss.Rows[0]["sl"].ToString()) == 0)
                        {
                            dr["pass_rate"] = "0.0%";
                        }
                        else
                        {
                            int rs = int.Parse(xss.Rows[0]["sl"].ToString());
                            double percent = (double)rss / rs;
                            dr["pass_rate"] = percent.ToString("0.0%");
                        }//及格率
                    }
                    else { dr["max_src"] = "0"; dr["qualified_p"] = "0"; dr["pass_rate"] = "0.0%"; }
                }
            }
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }
        public string GetRankExamineTable()
        {
            string name = SQLSafe(Request["name"]);
            string where = " and is_delete=1 and add_user=" + UserId;

            if (name != "")
            {
                where = where + " and a.rank_name like '%" + name + "%'";
            }
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.add_time desc"; //排序必须填写
            m.strFld = @"a.* ";
            m.tab = @"tb_Exam_rank a";
            m.strWhere = where;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);


            if (dt.Rows.Count > 0)
            {
                dt.Columns.Add("IsState", typeof(string));
                dt.Columns.Add("IsOneself", typeof(string));//是否为自己添加
            }
            foreach (DataRow dr in dt.Rows)
            {
                if (dr["add_user"].ToString() == UserId.ToString())
                {
                    dr["IsOneself"] = "1";
                }
                else
                {
                    dr["IsOneself"] = "0";
                }
                if (dr["state"].ToString() == "1")//激活
                {
                    dr["IsState"] = "激活";
                }
                else
                {
                    dr["IsState"] = "未激活";
                }
            }
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));

        }
        public string DelRank()
        {
            string ids = SQLSafe(Request["ids"]);
            var rcount = commonbll.UpdateInfo("tb_Exam_rank", "is_delete=2", " and id in(" + ids + ")");
            if (rcount > 0)
            {
                return "1";
            }
            return "99";
        }
        public string UpdateRankState()
        {
            string ids = SQLSafe(Request["ids"]);
            string state = SQLSafe(Request["state"]);
            if (state == "1")//激活
            {
                string[] idss = ids.Split(',');
                for (int i = 0; i < idss.Length; i++)
                {
                    var checkcount = commonbll.GetRecordCount("tb_Exam_rank_range", " and rank_id in(" + idss[i] + ")");
                    if (checkcount <= 0)
                    {
                        return "88";
                    }
                }
                var rcount = commonbll.UpdateInfo("tb_Exam_rank", "state=" + state, " and id in(" + ids + ")");
                if (rcount > 0)
                {
                    return "1";
                }
            }
            else if (state == "2")//关闭
            {
                var rcount = commonbll.UpdateInfo("tb_Exam_rank", "state=" + state, " and id in(" + ids + ")");
                if (rcount > 0)
                {
                    return "1";
                }
            }

            return "99";
        }
        public string UpdateRankName()
        {
            string e_name = SQLSafe(Request["RankName"]);
            string id = SQLSafe(Request["id"]);
            string where = "  and is_delete=1  and rank_name='" + e_name + "' and id!=" + id;
            var checkcount = commonbll.GetRecordCount("tb_Exam_rank", where);
            if (checkcount > 0)
            {
                return "88";
            }
            SqlParameter[] pars = new SqlParameter[]
            {
                       new SqlParameter("@rank_name",e_name),
                       new SqlParameter("@id",id)
            };
            var rcount = commonbll.UpdateInfo("tb_Exam_rank", "rank_name=@rank_name", " and id=@id", pars);
            if (rcount > 0)
            {
                return "1";
            }
            return "99";
        }
        public string AddRank()
        {

            string e_name = SQLSafe(Request["RankName"]);
            string where = "  and is_delete=1 and add_user=" + UserId + " and rank_name='" + e_name + "'";
            var checkcount = commonbll.GetRecordCount("tb_Exam_rank", where);
            if (checkcount > 0)
            {
                return "88";
            }
            SqlParameter[] pars = new SqlParameter[]
              {
                       new SqlParameter("@rank_name",e_name),
                       new SqlParameter("@state","2"),
                       new SqlParameter("@is_delete","1"),
                       new SqlParameter("@add_user",UserId),
                       new SqlParameter("@add_time",DateTime.Now)
              };
            string list = "rank_name,state,is_delete,add_user,add_time";
            string values = "@rank_name,@state,@is_delete,@add_user,@add_time";
            var rcount = commonbll.Add("tb_Exam_rank", list, values, pars);
            if (rcount > 0)
            {
                return "1";
            }
            return "99";
        }

    }
}
