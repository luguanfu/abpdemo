using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank.Models;
using Dy_SimulatedBank_Bll;
using Dy_SimulatedBank_DBUtility.Sql;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class PracticeResultController : BaseController
    {
        CommonBll commBll = new CommonBll();

        public ActionResult Index()
        {
            var dtAssessment = SqlHelper.ExecuteDataTable("select * from bsi_PracticeAssessment");

            ViewData["Assessment"] = dtAssessment;
            var trid = Request["TotalResultId"] ?? "0";
            var trdt = SqlHelper.ExecuteDataTable("select *,(select LoginNo from tb_User where U_ID=UserId) as LoginNo from bsi_TotalResult where ID=" + trid);
            ViewData["LoginNo"] = "";
            ViewData["ExamID"] = "";
            if (trdt != null && trdt.Rows.Count > 0)
            {
                ViewData["LoginNo"] = trdt.Rows[0]["LoginNo"].ToString();
                ViewData["ExamID"] = trdt.Rows[0]["ExamId"].ToString();
            }
            return View();
        }

        public string GetList()
        {
            string wheres = " ";
            //查询条件
            if (Request["LoginNo"].ToString() != "")
            {
                wheres += " t5.UserId = (select U_ID from tb_User where LoginNo = '" + Request["LoginNo"] + "')";
            }

            if (Request["practiceID"].ToString() != "-1")
            {
                wheres += " and t5.ExamId=" + Request["practiceID"];
            }
            var page = Request["page"] ?? "1";

            var dt = commBll.GetListDatatable("select t3.TaskName, t1.CustomerName, t2.TMName, '' as RightKey,isnull((select SysDesc from tb_TaskResultDesc where ExamId = t5.ExamId and CustomerId = t5.UserId and TaskId = t3.ID and oldCustomerId = t1.ID and FormId = t2.TMNO), '') as StuOperationalAnswers,(case  when isnull((select SysDesc from tb_TaskResultDesc where ExamId = t5.ExamId and CustomerId = t5.UserId and TaskId = t3.ID and oldCustomerId = t1.ID and FormId = t2.TMNO), '')= '' then '此环节未做' else '答案错误' end) as IsTrue,t1.CustomerOrder,t2.TMNO,t0.TaskId,t0.CustomerId,t5.id from bsi_TaskCustomer as t1 inner join bsi_TaskDetail as t0 on t0.TaskId = t1.TaskId and t0.CustomerId = t1.ID inner join bsi_TM as t2 on t2.TMNO = t0.FormId inner join bsi_Task as t3 on t3.ID = t0.TaskId inner join bsi_PracticeTasks t4 on t4.TaskId = t0.TaskId inner join bsi_TotalResult as t5 on t5.ExamId = t4.PracticeId where " + wheres + " order by CustomerOrder");
            DataTable showDT = new DataTable();
            showDT.Columns.Add("TaskName");
            showDT.Columns.Add("CustomerName");
            showDT.Columns.Add("TMName");
            showDT.Columns.Add("RightKey");
            showDT.Columns.Add("StuOperationalAnswers");
            showDT.Columns.Add("IsTrue");
            showDT.Columns.Add("PageCount");
            showDT.Columns.Add("PIC");
            int index = 0;
            string custName = "";
            if (dt != null && dt.Rows.Count > 0)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    if (custName != dr["CustomerName"].ToString())
                    {
                        custName = dr["CustomerName"].ToString();
                        index++;
                    }
                    if (index == int.Parse(page))
                    {
                        DataRow drr = showDT.NewRow();
                        drr["TaskName"] = dr["TaskName"].ToString();
                        drr["CustomerName"] = dr["CustomerName"].ToString();
                        drr["TMName"] = dr["TMName"].ToString();
                        drr["RightKey"] = dr["RightKey"].ToString();
                        drr["StuOperationalAnswers"] = dr["StuOperationalAnswers"].ToString();
                        drr["IsTrue"] = dr["IsTrue"].ToString();

                        //证件类型:[c - 营业执照],证件号码:[93320223589780301B],产品代码:[20071 - 单位保证金活期存款],浮动值:[1.000000],浮动后比率:{1.000000}(学生答案：),是否计息:[Y - 是],产品:{7 - 担保}(学生答案：9 - 代理合作业务),摘要:[深圳桑达电子设备有限公司缴纳保证金],是否对账:[Y - 是],对账渠道:[CETS - 柜面]
                        List<string> rightList = new List<string>();
                        if (drr["IsTrue"].ToString() == "此环节未做")
                        {
                            rightList = new List<string>();
                            var dtAnswer = commBll.GetListDatatable("select *,(select title from bsi_FormItem where id=FormItemId) as title from bsi_KeyAnswer where FormId='" + dr["TMNO"] + "' and CustomerId=" + dr["CustomerId"] + " and TaskId=" + dr["TaskId"]);
                            drr["RightKey"] = "";
                            if (dtAnswer != null && dtAnswer.Rows.Count > 0)
                            {
                                foreach (DataRow dr5 in dtAnswer.Rows)
                                {
                                    rightList.Add(dr5["title"].ToString() + ":" + dr5["SingleAnswer"].ToString());
                                }

                            }
                            drr["RightKey"] = string.Join(",", rightList);
                        }
                        List<string> stuList = new List<string>();
                        if (dr["StuOperationalAnswers"].ToString() != "")
                        {
                            rightList = new List<string>();
                            int errorIndex = 0;
                            foreach (string s in dr["StuOperationalAnswers"].ToString().Split(','))
                            {
                                if (s.IndexOf("[") > -1)
                                {
                                    rightList.Add(s.Replace("[", "").Replace("]", ""));
                                    stuList.Add(s.Replace("[", "").Replace("]", ""));
                                }
                                else if (s.IndexOf("{") > -1)
                                {
                                    rightList.Add(s.Split('(')[0].Replace("{", "").Replace("}", ""));
                                    stuList.Add(s.Split(':')[0] + ":" + s.Split('(')[1].Replace("(", "").Replace(")", "").Replace("学生答案：", ""));
                                    errorIndex++;
                                }
                            }
                            drr["RightKey"] = string.Join(",", rightList);
                            drr["StuOperationalAnswers"] = string.Join(",", stuList);
                            if (errorIndex == 0)
                            {
                                drr["IsTrue"] = "答案正确";
                            }
                        }
                        drr["PageCount"] = "0";
                        showDT.Rows.Add(drr);
                    }
                }
                showDT.Rows[0]["PageCount"] = index;
                var resultDT = commBll.GetListDatatable("select showPic from bsi_TotalResult where id=" + dt.Rows[0]["id"]);
                showDT.Rows[0]["PIC"] = resultDT.Rows[0]["showPic"].ToString();
            }


            return JsonConvert.SerializeObject(showDT);

        }



        public string Report()
        {
            string wheres = " ";
            //查询条件
            if (Request["LoginNo"].ToString() != "")
            {
                wheres += " t5.UserId = (select U_ID from tb_User where LoginNo = '" + Request["LoginNo"] + "')";
            }

            if (Request["practiceID"].ToString() != "-1")
            {
                wheres += " and t5.ExamId=" + Request["practiceID"];
            }
            var page = Request["page"] ?? "1";

            var dt = commBll.GetListDatatable("select t3.TaskName, t1.CustomerName, t2.TMName, '' as RightKey,isnull((select SysDesc from tb_TaskResultDesc where ExamId = t5.ExamId and CustomerId = t5.UserId and TaskId = t3.ID and oldCustomerId = t1.ID and FormId = t2.TMNO), '') as StuOperationalAnswers,(case  when isnull((select SysDesc from tb_TaskResultDesc where ExamId = t5.ExamId and CustomerId = t5.UserId and TaskId = t3.ID and oldCustomerId = t1.ID and FormId = t2.TMNO), '')= '' then '此环节未做' else '答案错误' end) as IsTrue,t1.CustomerOrder,t2.TMNO,t0.TaskId,t0.CustomerId from bsi_TaskCustomer as t1 inner join bsi_TaskDetail as t0 on t0.TaskId = t1.TaskId and t0.CustomerId = t1.ID inner join bsi_TM as t2 on t2.TMNO = t0.FormId inner join bsi_Task as t3 on t3.ID = t0.TaskId inner join bsi_PracticeTasks t4 on t4.TaskId = t0.TaskId inner join bsi_TotalResult as t5 on t5.ExamId = t4.PracticeId where " + wheres + " order by CustomerOrder");
            DataTable showDT = new DataTable();
            showDT.Columns.Add("TaskName");
            showDT.Columns.Add("CustomerName");
            showDT.Columns.Add("TMName");
            showDT.Columns.Add("RightKey");
            showDT.Columns.Add("StuOperationalAnswers");
            showDT.Columns.Add("IsTrue");
            showDT.Columns.Add("PageCount");
            if (dt != null && dt.Rows.Count > 0)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    DataRow drr = showDT.NewRow();
                    drr["TaskName"] = dr["TaskName"].ToString();
                    drr["CustomerName"] = dr["CustomerName"].ToString();
                    drr["TMName"] = dr["TMName"].ToString();
                    drr["RightKey"] = dr["RightKey"].ToString();
                    drr["StuOperationalAnswers"] = dr["StuOperationalAnswers"].ToString();
                    drr["IsTrue"] = dr["IsTrue"].ToString();

                    //证件类型:[c - 营业执照],证件号码:[93320223589780301B],产品代码:[20071 - 单位保证金活期存款],浮动值:[1.000000],浮动后比率:{1.000000}(学生答案：),是否计息:[Y - 是],产品:{7 - 担保}(学生答案：9 - 代理合作业务),摘要:[深圳桑达电子设备有限公司缴纳保证金],是否对账:[Y - 是],对账渠道:[CETS - 柜面]
                    List<string> rightList = new List<string>();
                    if (drr["IsTrue"].ToString() == "此环节未做")
                    {
                        rightList = new List<string>();
                        var dtAnswer = commBll.GetListDatatable("select *,(select title from bsi_FormItem where id=FormItemId) as title from bsi_KeyAnswer where FormId='" + dr["TMNO"] + "' and CustomerId=" + dr["CustomerId"] + " and TaskId=" + dr["TaskId"]);
                        drr["RightKey"] = "";
                        if (dtAnswer != null && dtAnswer.Rows.Count > 0)
                        {
                            foreach (DataRow dr5 in dtAnswer.Rows)
                            {
                                rightList.Add((dr5["title"].ToString().IndexOf("_") > -1 ? dr5["title"].ToString().Split('_')[0] : dr5["title"].ToString()) + ":" + dr5["SingleAnswer"].ToString());
                            }

                        }
                        drr["RightKey"] = string.Join(",", rightList);
                    }
                    List<string> stuList = new List<string>();
                    if (dr["StuOperationalAnswers"].ToString() != "")
                    {
                        rightList = new List<string>();
                        int errorIndex = 0;
                        foreach (string s in dr["StuOperationalAnswers"].ToString().Split(','))
                        {
                            if (s.IndexOf("[") > -1)
                            {
                                rightList.Add(s.Replace("[", "").Replace("]", ""));
                                stuList.Add(s.Replace("[", "").Replace("]", ""));
                            }
                            else if (s.IndexOf("{") > -1)
                            {
                                rightList.Add(s.Split('(')[0].Replace("{", "").Replace("}", ""));
                                stuList.Add(s.Split(':')[0] + ":" + s.Split('(')[1].Replace("(", "").Replace(")", "").Replace("学生答案：", ""));
                                errorIndex++;
                            }
                        }
                        drr["RightKey"] = string.Join(",", rightList);
                        drr["StuOperationalAnswers"] = string.Join(",", stuList);
                        if (errorIndex == 0)
                        {
                            drr["IsTrue"] = "答案正确";
                        }
                    }
                    drr["PageCount"] = "0";
                    showDT.Rows.Add(drr);

                }
            }


            Aspose.Cells.Workbook wk = new Aspose.Cells.Workbook();
            string filename = "";
            string excelFile = string.Empty;
            excelFile = "/Export/综合柜员岗试卷解析.xls";
            wk.Open(System.Web.HttpContext.Current.Server.MapPath(excelFile));

            if (showDT != null && showDT.Rows.Count > 0)
            {
                Aspose.Cells.Style style = wk.Styles[wk.Styles.Add()];
                style.ForegroundColor = System.Drawing.Color.FromArgb(255, 0, 0);
                //循环写入数据
                for (int i = 0; i < showDT.Rows.Count; i++)
                {
                    if (dt.Rows[i]["IsTrue"].ToString().Trim() == "答案错误")
                    {
                        wk.Worksheets[0].Cells[i + 1, 0].SetStyle(style);
                        wk.Worksheets[0].Cells[i + 1, 1].SetStyle(style);
                        wk.Worksheets[0].Cells[i + 1, 2].SetStyle(style);
                        wk.Worksheets[0].Cells[i + 1, 3].SetStyle(style);
                        wk.Worksheets[0].Cells[i + 1, 4].SetStyle(style);
                        wk.Worksheets[0].Cells[i + 1, 5].SetStyle(style);
                        wk.Worksheets[0].Cells[i + 1, 6].SetStyle(style);
                    }
                    wk.Worksheets[0].Cells[i + 1, 0].PutValue(showDT.Rows[i]["TaskName"].ToString().Trim());
                    wk.Worksheets[0].Cells[i + 1, 1].PutValue(showDT.Rows[i]["CustomerName"].ToString().Trim());
                    wk.Worksheets[0].Cells[i + 1, 2].PutValue(showDT.Rows[i]["TMName"].ToString().Trim());
                    wk.Worksheets[0].Cells[i + 1, 4].PutValue(showDT.Rows[i]["RightKey"].ToString().Trim());
                    wk.Worksheets[0].Cells[i + 1, 5].PutValue(showDT.Rows[i]["StuOperationalAnswers"].ToString().Trim());
                    wk.Worksheets[0].Cells[i + 1, 6].PutValue(showDT.Rows[i]["IsTrue"].ToString().Trim());
                }
            }

            string ExcelName = DateTime.Now.ToString("yyyyMMdd") + "" + DateTime.Now.Millisecond + "大堂经理岗试卷解析";
            filename = "/Export/" + ExcelName + ".xls";
            string serverPath = System.Web.HttpContext.Current.Server.MapPath(filename);
            wk.Save(serverPath);

            var json = new object[] {
                        new{
                            filename=filename,
                        }
                    };
            return filename;
        }

    }
}
