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
using System.Reflection;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Controllers
{
    public class ExamRankingController : BaseController
    {
        //
        // GET: /ExamRanking/
        CommonBll commonbll = new CommonBll();

        public ActionResult Index()
        {
            string id = Request["id"];
            ViewBag.rankid = id;
            ViewBag.rank_name = commonbll.GetListSclar("rank_name", "tb_Exam_rank", " and id=" + id);

            string classid = "";

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
        /// <summary>
        /// 查看排名
        /// </summary>
        /// <returns></returns>
        public string GetExamRanking()
        {
            string rank_name = SQLSafe(Request["rank_name"]);
            var page = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            var PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;

            //我的教师
            var TeacherId = commonbll.GetListSclar("TeacherId", "tb_Class", " and C_ID=" + ClassId);

            string wheres = " and a.state = 1 and a.is_delete = 1  and a.add_user=" + TeacherId;
            if (!string.IsNullOrEmpty(rank_name.Trim()))
            {
                wheres += " and rank_name like '%" + rank_name.Trim() + "%'";
            }

            DataTable md = commonbll.GetListDatatable("a.*", "dbo.tb_Exam_rank a  ", wheres + " order by a.add_time desc");

            DataView dataView = md.DefaultView;
            DataTable dataTableDistinct = dataView.ToTable(true, "id", "rank_name", "add_time");
            if (dataTableDistinct.Rows.Count > 0)
            {
                dataTableDistinct.Columns.Add("newrank", typeof(string));//排名
            }

            string classid = "";//教师所带的班级

            DataTable cdt = commonbll.GetListDatatable("SELECT * FROM dbo.tb_Class WHERE TeacherId =" + TeacherId);
            foreach (DataRow item in cdt.Rows)
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

            foreach (DataRow item in dataTableDistinct.Rows)
            {

                SqlParameter[] sqlparam = new SqlParameter[] {
                    new SqlParameter("@rank_id",item["id"]),
                    new SqlParameter("@stuName",""),
                    new SqlParameter("@classId",classid)
                };

                DataSet ds = SqlHelper.ExecuteDataSet("exec Pro_Exam_rank_statistics @rank_id,@stuName,@classId", CommandType.Text, sqlparam);

                DataRow[] dr = ds.Tables[0].Select(" UserId =" + UserId);
                if (dr.Length > 0)
                {
                    item["newrank"] = dr[0]["newrank"];
                }


            }
            DataTable dt = new DataTable();

            var dtlist = dataTableDistinct.AsEnumerable().ToList();
    
            dtlist.Skip((page - 1) * PageSize).Take(PageSize);
            dt = ToDataTable(dtlist.ToArray());
            if (dt == null)
            {
                 dt = new DataTable();
            }


            return JsonConvert.SerializeObject(JsonResultPagedLists(dt.Rows.Count, page, PageSize, dt));
        }


        private DataTable ToDataTable(DataRow[] rows)
        {
            if (rows == null || rows.Length == 0) return null;
            DataTable tmp = rows[0].Table.Clone(); // 复制DataRow的表结构
            foreach (DataRow row in rows)
            {

                tmp.ImportRow(row); // 将DataRow添加到DataTable中
            }
            return tmp;
        }

        /// <summary>
        /// 获取排名详细数据
        /// </summary>
        /// <returns></returns>
        public string GetExamInfo()
        {

            string html = "<div class=\"table_right \"><table border = \"0\" cellspacing = \"0\" cellpadding = \"0\"> ";

            string id = Request["id"];//排名id
                                      //string rankid = Request["rankid"];
            string stu = SQLSafe(Request["stu"]);//输入查询的学生账号或姓名

            SqlParameter[] sqlparam = new SqlParameter[] {
                new SqlParameter("@rank_id",id),
                new SqlParameter("@stuName",stu),
                new SqlParameter("@classId",ClassId)
            };

            DataSet ds = SqlHelper.ExecuteDataSet("exec Pro_Exam_rank_statistics @rank_id,@stuName,@classId", CommandType.Text, sqlparam);

            if (ds != null && ds.Tables[0].Rows.Count > 0)
            {
                List<string> list = new List<string>();
                DataColumnCollection dt = ds.Tables[0].Columns;

                int i = 1;
                foreach (DataColumn item in dt)
                {
                    if (i > 5)
                    {
                        list.Add(item.ColumnName);
                    }
                    i++;
                }

                html = "<div class=\"table_right \"><table border = \"0\" cellspacing = \"0\" cellpadding = \"0\" style=\"width:100%\"> ";

                html += "<tr>";
                foreach (var item in list)
                {
                    if (item.Length > 6)
                    {
                        html += "<th title=" + item + ">" + item.ToString().Substring(0, 6) + "</th>";
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
    }
}
