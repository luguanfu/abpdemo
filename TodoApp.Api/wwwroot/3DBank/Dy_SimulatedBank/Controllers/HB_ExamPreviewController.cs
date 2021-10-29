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
using System.Text;
using System.Collections;

namespace Dy_SimulatedBank.Controllers
{
    public class HB_ExamPreviewController : BaseController
    {
        //
        // GET: /HB_ExamPreview/查看明细
        CommonBll commonbll = new CommonBll();
        public ActionResult Index()
        {
            //

            var Type = Request["Type"];//学生自己查看  //2.是管理端教师端查
            string SUId = "0";
            if (Type == "1")
            {
                SUId = UserId.ToString();

            }
            if (Type == "2")
            {//教师端别的
                SUId = Request["MId"];
            }

            var Eid = Request["Eid"];
            var Pid = Request["Pid"];
            HBKaoShiModel km = new HBKaoShiModel();

            if (Eid != null && Pid != null && Eid.Length > 0 && Pid.Length > 0)
            {
                string list = @"E_Name,E_Type,E_EndTime,
(select SUM(EP_Score) from tb_HB_ExaminationPapers where EP_PId=E_PId) as Score,
(select Name from tb_Student where UserId=" + UserId + @") as UserName,
(select UI_UserPic from tb_Student where UserId=" + UserId + @") as UserPic,
(select ClassName from tb_Class  where C_ID=" + ClassId + ") as ClassName";//列
                DataTable Mdt = commonbll.GetListDatatable(list, "tb_HB_Examination", " and Eid=" + Request["Eid"]);
                if (Mdt.Rows.Count > 0)
                {
                    km.E_Name = Mdt.Rows[0]["E_Name"].ToString();//竞赛名称
                    km.Score = Mdt.Rows[0]["Score"].ToString();//分值
                    km.UserName = Mdt.Rows[0]["UserName"].ToString();//姓名

                    if (Mdt.Rows[0]["UserPic"] == null || Mdt.Rows[0]["UserPic"].ToString() == "")
                    {
                        km.UserPic = "/Img/profile_s.jpg";//头像
                    }
                    else
                    {
                        km.UserPic = Mdt.Rows[0]["UserPic"].ToString();//头像
                    }
                    km.ClassName = Mdt.Rows[0]["ClassName"].ToString();//班级
                }

                DataTable dt = commonbll.GetListDatatable("ER_Score", @"tb_ExaminationResult", "and ER_EId=" + Eid + " and ER_PId='" + Pid + "' and ER_MId=" + SUId + " and ER_Type=1 and ER_State=0 ");
                if (dt.Rows.Count > 0)
                {
                    km.ER_Score = dt.Rows[0]["ER_Score"].ToString();//总成绩

                }
                //要看时间是否已经结束 考试模式
                if (Mdt.Rows[0]["E_Type"].ToString() == "1")
                {
                    //结束时间
                    DateTime E_EndTime = Convert.ToDateTime(Mdt.Rows[0]["E_EndTime"]);
                    DateTime dqtime = DateTime.Now;
                    if (dqtime > E_EndTime)
                    {
                        //运行查看
                        km.Isallow = "1";
                    }
                    else
                    {
                        km.Isallow = "0";
                    }
                }
                else {
                    //练习模式
                    km.Isallow = "1";
                }
               
            }

            return View(km);
        }


        /// <summary>
        /// 获取当前题型 题量 总分值
        /// </summary>
        /// <returns></returns>
        public string GetTypeNum()
        {
            string Pid = Request["Pid"];
            DataTable dt = commonbll.GetListDatatable(" QB_Type,count(QuestionBId) as Tnum,SUM(EP_Score) as Tscoers", @"tb_HB_ExaminationPapers e inner join tb_HB_QuestionBank q on
 e.EP_QBId=q.QuestionBId", " and EP_PId='" + Pid + "' group by QB_Type");
            return JsonConvert.SerializeObject(dt);
        }


        /// <summary>
        /// 成绩统计
        /// </summary>
        /// <returns></returns>
        public string GetResult()
        {
            string Pid = Request["Pid"];
            string Type = Request["Type"];
            string Mid = Request["Mid"];
            string Eid = Request["Eid"];
            string SUId = "0";
            if (Type == "1")
            {
                SUId = UserId.ToString();

            }
            if (Type == "2")
            {//教师端别的
                SUId = Mid;
            }

            string list = @"QB_Type,SUM(EP_Score) as Tscoers,count(QuestionBId) as Tnum,( select SUM(ED_Goal)  from tb_ExaminationDetails a inner join tb_HB_QuestionBank b on a.ED_QBId=b.QuestionBId
  where ED_PId='" + Pid + "'  and QB_Type=q.QB_Type and ED_State=1 and ED_MId=" + SUId + " and ED_EId="+Eid+") as Goal";
            DataTable dt = commonbll.GetListDatatable(list, @"tb_HB_ExaminationPapers e inner join tb_HB_QuestionBank q on
 e.EP_QBId=q.QuestionBId", " and EP_PId='" + Pid + "' group by QB_Type");
            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 获取题号数据
        /// </summary>
        /// <returns></returns>
        public string KaoShiByPId_ZQList()
        {
            string QB_Type = Request["QB_Type"];//试题类型
            string Pid = Request["Pid"];
            string Eid = Request["Eid"];
            string isto = Request["isto"];//第几次读取
            //首先判断这个试卷 是否为打乱顺序的
            var P_IsOrder = commonbll.GetListSclar("P_IsOrder", "tb_HB_Paper", " and PId='" + Pid + "'");
            if (isto != null && isto == "1")
            {
                if (P_IsOrder == "0") //不打乱顺序
                {
                    DataTable dt = commonbll.GetListDatatable("QuestionBId,QB_Type",
                 @"tb_HB_ExaminationPapers e inner join tb_HB_QuestionBank q on e.EP_QBId=q.QuestionBId", " and EP_PId='" + Pid + "' and QB_Type=" + QB_Type + "  order by QB_Type");
                    return JsonConvert.SerializeObject(dt);
                }
                else
                {
                    //随机打乱顺序
                    DataTable dt = commonbll.GetListDatatable("QuestionBId,QB_Type",
                 @"tb_HB_ExaminationPapers e inner join tb_HB_QuestionBank q on e.EP_QBId=q.QuestionBId", " and EP_PId='" + Pid + "' and QB_Type=" + QB_Type + "  order by QB_Type");
                    if (dt.Rows.Count > 0)
                    {
                        string[] arr = new string[dt.Rows.Count];
                        if (Session["yxlxxx" + Eid + "_" + QB_Type] == null)
                        {
                            for (int i = 0; i < dt.Rows.Count; i++)
                            {
                                arr[i] += dt.Rows[i]["QuestionBId"].ToString();
                            }

                            Hashtable hashtable = new Hashtable();
                            Hashtable hashtable1 = new Hashtable();
                            Random rm = new Random();

                            for (int i = 0; i < dt.Rows.Count; i++)
                            {
                                var num = rm.Next(0, dt.Rows.Count);
                                var num1 = rm.Next(0, dt.Rows.Count);
                                if (!hashtable.ContainsValue(num) && num != 0 && !hashtable1.ContainsValue(num1) && num1 != 0)
                                {
                                    hashtable.Add(num, num);
                                    hashtable1.Add(num1, num1);
                                    var temp = "";
                                    temp = arr[num];
                                    arr[num] = arr[num1];
                                    arr[num1] = temp;
                                }
                            }

                            DataTable dtM = new DataTable("mydatatable");
                            dtM.Columns.Add("QuestionBId", typeof(System.String));//
                            dtM.Columns.Add("QB_Type", typeof(System.String));
                            DataRow row = dtM.NewRow();

                            for (int i = 0; i < arr.Length; i++)
                            {
                                if (arr[i] != "" && arr[i].Length > 0)
                                {
                                    row = dtM.NewRow();
                                    row["QuestionBId"] = arr[i];
                                    row["QB_Type"] = QB_Type;
                                    dtM.Rows.Add(row);
                                }
                            }

                            Session["yxlxxx" + Eid + "_" + QB_Type] = dtM;
                            return JsonConvert.SerializeObject(dtM);
                        }
                        else
                        {
                            //sesstion 存在直接取sesstion
                            DataTable dtM = new DataTable();
                            if (Session["yxlxxx" + Eid + "_" + QB_Type] != null)
                            {
                                dtM = Session["yxlxxx" + Eid + "_" + QB_Type] as DataTable;
                            }
                            return JsonConvert.SerializeObject(dtM);

                        }

                    }

                }

            }
            else
            {

                DataTable dt = commonbll.GetListDatatable("QuestionBId,QB_Type",
             @"tb_HB_ExaminationPapers e inner join tb_HB_QuestionBank q on e.EP_QBId=q.QuestionBId", " and EP_PId='" + Pid + "' and QB_Type=" + QB_Type + "  order by QB_Type");
                return JsonConvert.SerializeObject(dt);
            }
            return JsonConvert.SerializeObject(new DataTable());
        }


        /// <summary>
        /// 获取单题信息
        /// </summary>
        /// <returns></returns>
        public string GetQuestionBankByIdAndPid()
        {
            string QuestionBId = Request["QuestionBId"];
            string Pid = Request["Pid"];
            DataTable dt = commonbll.GetListDatatable("q.*,EP_Score", @"tb_HB_ExaminationPapers e inner join tb_HB_QuestionBank q on
 e.EP_QBId=q.QuestionBId", " and QuestionBId=" + QuestionBId + " and EP_PId='" + Pid + "'");
            return JsonConvert.SerializeObject(dt);
        }


        /// <summary>
        /// 单题做题情况
        /// </summary>
        /// <returns></returns>
        public string GetExaminationDetailsbysTo()
        {
            string Pid = Request["Pid"];
            string Eid = Request["Eid"];
            string QBId = Request["QBId"];
            string Type = Request["Type"];
            string Mid = Request["Mid"];

            string SUId = "0";
            if (Type == "1")
            {
                SUId = UserId.ToString();

            }
            if (Type == "2")
            {//教师端别的
                SUId = Mid;
            }


            DataTable dt = commonbll.GetListDatatable("QB_Type,ED_Content,ED_OkNo,QB_Answer,QB_Keyword", @"tb_ExaminationDetails e inner join tb_HB_QuestionBank q on
 e.ED_QBId=q.QuestionBId", " and ED_EId='" + Eid + "' and  ED_PId='" + Pid + "' and ED_MId='" + SUId + "' and ED_QBId=" + QBId + " and ED_Type=1 and ED_State=1");
            if (dt.Rows.Count == 0)
            {
                dt = commonbll.GetListDatatable("QB_Type,'' as ED_Content,'' as ED_OkNo,QB_Answer,QB_Keyword", @"tb_HB_QuestionBank", " and QuestionBId=" + QBId);
            }
            return JsonConvert.SerializeObject(dt);

        }


        /// <summary>
        /// 单题做题情况
        /// </summary>
        /// <returns></returns>
        public string GetExaminationDetailsbys()
        {
            string Pid = Request["Pid"];
            string Eid = Request["Eid"];
            string QBId = Request["QBId"];
            string Type = Request["Type"];
            string Mid = Request["Mid"];
            string QB_Type = Request["QB_Type"];

            string SUId = "0";
            if (Type == "1")
            {
                SUId = UserId.ToString();

            }
            if (Type == "2")
            {//教师端别的
                SUId = Mid;
            }

            DataTable dt = commonbll.GetListDatatable("QB_Type,ED_Content,ED_OkNo,QB_Answer,QB_Keyword,QuestionBId", @"tb_ExaminationDetails e inner join tb_HB_QuestionBank q on
 e.ED_QBId=q.QuestionBId", " and ED_EId='" + Eid + "' and  ED_PId='" + Pid + "' and ED_MId='" + SUId + "' and QB_Type=" + QB_Type + " and ED_Type=1 and ED_State=1");

            return JsonConvert.SerializeObject(dt);

        }


        /// <summary>
        /// 主入口
        /// </summary>
        /// <returns></returns>
        public ActionResult ExamPreviewCenter()
        {
            string ID = Request["ID"];
            string EId = Request["EId"];
            string EName = Request["Name"];
            string heightScoreSql = "select * from tb_ExaminationResult   where ER_EId="+ ID + " and ER_Operator= "+UserId+" order by ER_Score DESC";
            var heightScoredt = commonbll.GetListDatatable(heightScoreSql);
            int heightScore = 0;
            var hasRecord = "0";
            if (heightScoredt != null && heightScoredt.Rows.Count > 0)
            {
                heightScore = Convert.ToInt32(heightScoredt.Rows[0]["ER_Score"]);
                hasRecord = "1";
            }
            ViewData["HeightScore"] = heightScore;
            ViewData["HasRecord"] = hasRecord;
            string Sql = "SELECT COUNT(*) AS NUM ,SUM(EP_Score)AS Score ,(SELECT E_Whenlong FROM tb_HB_Examination WHERE EId ="+ ID + ") as Whenlong FROM tb_HB_ExaminationPapers WHERE EP_PId= "+ EId;
            var dt = commonbll.GetListDatatable(Sql);
            if (dt != null && dt.Rows.Count > 0)
            {
                ViewData["NUM"] = dt.Rows[0]["NUM"];
                ViewData["Score"] = dt.Rows[0]["Score"];
                ViewData["Whenlong"] = dt.Rows[0]["Whenlong"];
            }
            else {
                ViewData["NUM"] = "";
                ViewData["Score"] = "";
                ViewData["Whenlong"] = "";
            }
            ViewData["EName"] = EName;
            return View();
        }

    }
}
