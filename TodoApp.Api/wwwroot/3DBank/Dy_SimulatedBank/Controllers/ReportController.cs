using Dy_SimulatedBank_Bll;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Configuration;
using Dy_SimulatedBank_Models;

namespace Dy_SimulatedBank.Controllers
{
    public class ReportController : ApiController
    {
        CommonBll commonBll = new CommonBll();


        #region 导出成绩
        [HttpGet]
        public HttpResponseMessage Exportcj()
        {
            DataTable dt = commonBll.GetListDatatable("select * from ExamSetting");

            var dtxd = commonBll.GetListDatatable(2, "ISNULL(a.Teller_Name,'')Teller_Name,b.TeamName,c.Result,d.Plan_Name,datediff(SECOND,(select BeginTime from dal_ComplexTimer where ComplexPlanId=d.id),c.SubmitTime) AddTime,a.Teller_No as LoginNo", "bi_BankTeller a left join bi_Team b on a.Team_Id=b.Id left join zhyw_ExamResult c on a.Id = c.TellerId left join dal_ComplexPlan d on c.PlanId = d.Id", " and c.PlanId=" + GetExamID(dt, 1, 1) + "", "c.Result desc");
            var dtxd1 = commonBll.GetListDatatable(2, "ISNULL(a.Teller_Name,'')Teller_Name,b.TeamName,c.Result,d.Plan_Name,datediff(SECOND,(select BeginTime from dal_ComplexTimer where ComplexPlanId=d.id),c.SubmitTime) AddTime,a.Teller_No as LoginNo", "bi_BankTeller a left join bi_Team b on a.Team_Id=b.Id left join zhyw_ExamResult c on a.Id = c.TellerId left join dal_ComplexPlan d on c.PlanId = d.Id", " and c.PlanId=" + GetExamID(dt, 1, 2) + "", "c.Result desc");
            var dtlc = commonBll.GetListDatatable(3, "ISNULL(a.Teller_Name,'')Teller_Name,b.TeamName,c.Result,d.Plan_Name,datediff(SECOND,(select BeginTime from dal_ComplexTimer where ComplexPlanId=d.id),c.SubmitTime) AddTime,a.Teller_No  as LoginNo", "bi_BankTeller a left join bi_Team b on a.Team_Id=b.Id left join zhyw_ExamResult c on a.Id = c.TellerId left join dal_ComplexPlan d on c.PlanId = d.Id", " and c.PlanId=" + GetExamID(dt, 2, 1) + "", "c.Result desc");
            var dtdt = commonBll.GetListDatatable(5, "ISNULL(a.[Name],'')Teller_Name,b.ClassName TeamName,c.Scores Result,d.PracticeName Plan_Name,datediff(SECOND,d.PracticeStarTime,c.UpdateTime) AddTime ,e.LoginNo", "tb_Student a left join tb_class b on a.classid=b.c_id left join bsi_TotalResult c on a.UserId=c.UserId left join bsi_PracticeAssessment d on c.ExamId=d.ID inner join tb_User e on e.u_id=a.UserId", " and c.ExamId=" + GetExamID(dt, 3, 1) + "", "c.Scores desc");
            var dtgy = commonBll.GetListDatatable(6, "ISNULL(a.[Name],'')Teller_Name,b.ClassName TeamName,c.Scores Result,d.PracticeName Plan_Name,datediff(SECOND,d.PracticeStarTime,c.AddTime) AddTime,e.LoginNo", "tb_Student a left join tb_class b on a.classid=b.c_id left join bsi_TotalResult c on a.UserId=c.UserId left join bsi_PracticeAssessment d on c.ExamId=d.ID inner join tb_User e on e.u_id=a.UserId", " and c.ExamId=" + GetExamID(dt, 4, 1) + "", "c.Scores desc");


            Aspose.Cells.Workbook wk = new Aspose.Cells.Workbook();

            string excelFile = string.Empty;
            excelFile = "/Export/四项竞赛成绩.xls";
            wk.Open(System.Web.HttpContext.Current.Server.MapPath(excelFile));

            string filename = "";
            #region 装箱数据
            List<ScoreModel> xdList = new List<ScoreModel>();
            if (dtxd != null && dtxd.Rows.Count > 0)
            {
                foreach (DataRow dr in dtxd.Rows)
                {
                    if (xdList.Where(w => w.Teller_Name == dr["Teller_Name"].ToString() && w.TeamName == dr["TeamName"].ToString()).ToList().Count > 0)
                    {
                        continue;
                    }
                    ScoreModel model = new ScoreModel();
                    model.Teller_Name = dr["Teller_Name"].ToString();
                    model.TeamName = dr["TeamName"].ToString();
                    model.Result = decimal.Parse(dr["Result"].ToString()) > 200 ? 200 : decimal.Parse(dr["Result"].ToString());
                    model.Plan_Name = dr["Plan_Name"].ToString();
                    model.AddTime = int.Parse(dr["AddTime"].ToString());
                    model.LoginNo = dr["LoginNo"].ToString();
                    xdList.Add(model);
                }
            }
            List<ScoreModel> xdList1 = new List<ScoreModel>();
            if (dtxd1 != null && dtxd1.Rows.Count > 0)
            {
                foreach (DataRow dr in dtxd1.Rows)
                {
                    if (xdList1.Where(w => w.Teller_Name == dr["Teller_Name"].ToString() && w.TeamName == dr["TeamName"].ToString()).ToList().Count > 0)
                    {
                        continue;
                    }
                    ScoreModel model = new ScoreModel();
                    model.Teller_Name = dr["Teller_Name"].ToString();
                    model.TeamName = dr["TeamName"].ToString();
                    model.Result = decimal.Parse(dr["Result"].ToString()) > 200 ? 200 : decimal.Parse(dr["Result"].ToString());
                    model.Plan_Name = dr["Plan_Name"].ToString();
                    model.AddTime = int.Parse(dr["AddTime"].ToString());
                    model.LoginNo = dr["LoginNo"].ToString();
                    xdList1.Add(model);
                }
            }
            List<ScoreModel> lcList = new List<ScoreModel>();
            if (dtlc != null && dtlc.Rows.Count > 0)
            {
                foreach (DataRow dr in dtlc.Rows)
                {
                    if (lcList.Where(w => w.Teller_Name == dr["Teller_Name"].ToString() && w.TeamName == dr["TeamName"].ToString()).ToList().Count > 0)
                    {
                        continue;
                    }
                    ScoreModel model = new ScoreModel();
                    model.Teller_Name = dr["Teller_Name"].ToString();
                    model.TeamName = dr["TeamName"].ToString();
                    model.Result = decimal.Parse(dr["Result"].ToString()) > 200 ? 200 : decimal.Parse(dr["Result"].ToString());
                    model.Plan_Name = dr["Plan_Name"].ToString();
                    model.AddTime = int.Parse(dr["AddTime"].ToString());
                    model.LoginNo = dr["LoginNo"].ToString();
                    lcList.Add(model);
                }
            }
            List<ScoreModel> dtList = new List<ScoreModel>();
            if (dtdt != null && dtdt.Rows.Count > 0)
            {
                foreach (DataRow dr in dtdt.Rows)
                {
                    if (dtList.Where(w => w.Teller_Name == dr["Teller_Name"].ToString() && w.TeamName == dr["TeamName"].ToString()).ToList().Count > 0)
                    {
                        continue;
                    }
                    ScoreModel model = new ScoreModel();
                    model.Teller_Name = dr["Teller_Name"].ToString();
                    model.TeamName = dr["TeamName"].ToString();
                    model.Result = decimal.Parse(dr["Result"].ToString()) > 200 ? 200 : decimal.Parse(dr["Result"].ToString());
                    model.Plan_Name = dr["Plan_Name"].ToString();
                    model.AddTime = int.Parse(dr["AddTime"].ToString());
                    model.LoginNo = dr["LoginNo"].ToString();
                    dtList.Add(model);
                }
            }
            List<ScoreModel> gyList = new List<ScoreModel>();
            if (dtgy != null && dtgy.Rows.Count > 0)
            {
                foreach (DataRow dr in dtgy.Rows)
                {
                    if (gyList.Where(w => w.Teller_Name == dr["Teller_Name"].ToString() && w.TeamName == dr["TeamName"].ToString()).ToList().Count > 0)
                    {
                        continue;
                    }
                    ScoreModel model = new ScoreModel();
                    model.Teller_Name = dr["Teller_Name"].ToString();
                    model.TeamName = dr["TeamName"].ToString();
                    model.Result = decimal.Parse(dr["Result"].ToString()) > 200 ? 200 : decimal.Parse(dr["Result"].ToString());
                    model.Plan_Name = dr["Plan_Name"].ToString();
                    model.AddTime = int.Parse(dr["AddTime"].ToString());
                    model.LoginNo = dr["LoginNo"].ToString();
                    gyList.Add(model);
                }
            }
            #endregion

            if (xdList.Count > 0)
            {
                //循环写入数据
                for (int i = 0; i < xdList.Count; i++)
                {
                    if (xdList1.Where(w => w.LoginNo.Equals(xdList[i].LoginNo)).ToList().Count > 0)
                    {
                        wk.Worksheets[0].Cells[i + 1, 0].PutValue(xdList[i].TeamName.Trim());
                        wk.Worksheets[0].Cells[i + 1, 1].PutValue(xdList[i].LoginNo.ToString().Trim());
                        wk.Worksheets[0].Cells[i + 1, 2].PutValue(xdList[i].Teller_Name.Trim());
                        wk.Worksheets[0].Cells[i + 1, 3].PutValue(xdList[i].Result);
                        decimal score = 0;
                        score = xdList1.Where(w => w.LoginNo.Equals(xdList[i].LoginNo)).ToList().FirstOrDefault().Result;
                        xdList[i].Result1 = score;
                        wk.Worksheets[0].Cells[i + 1, 4].PutValue(score);
                        // wk.Worksheets[0].Cells[i + 1, 5].PutValue((xdList[i].AddTime / 3600) + "小时" + (xdList[i].AddTime % 3600 / 60) + "分" + (xdList[i].AddTime % 60) + "秒");
                    }

                }
            }
            if (xdList1.Count > 0)
            {
                for (int i = 0; i < xdList1.Count; i++)
                {
                    if (xdList.Where(w => w.LoginNo.Equals(xdList1[i].LoginNo)).ToList().Count == 0)
                    {
                        wk.Worksheets[0].Cells[i + xdList.Count + 1, 0].PutValue(xdList1[i].TeamName.Trim());
                        wk.Worksheets[0].Cells[i + xdList.Count + 1, 1].PutValue(xdList1[i].LoginNo.ToString().Trim());
                        wk.Worksheets[0].Cells[i + xdList.Count + 1, 2].PutValue(xdList1[i].Teller_Name.Trim());
                        wk.Worksheets[0].Cells[i + xdList.Count + 1, 3].PutValue("0");
                        wk.Worksheets[0].Cells[i + xdList.Count + 1, 4].PutValue(xdList1[i].Result);
                        //wk.Worksheets[0].Cells[i + xdList.Count + 1, 5].PutValue((xdList[i].AddTime / 3600) + "小时" + (xdList[i].AddTime % 3600 / 60) + "分" + (xdList[i].AddTime % 60) + "秒");
                    }

                }
            }
            if (lcList.Count > 0)
            {
                //循环写入数据
                for (int i = 0; i < lcList.Count; i++)
                {
                    wk.Worksheets[1].Cells[i + 1, 0].PutValue(lcList[i].TeamName.Trim());//题型
                    wk.Worksheets[1].Cells[i + 1, 1].PutValue(lcList[i].LoginNo.Trim());
                    wk.Worksheets[1].Cells[i + 1, 2].PutValue(lcList[i].Teller_Name.Trim());//题名
                    wk.Worksheets[1].Cells[i + 1, 3].PutValue(lcList[i].Result);//a
                    //wk.Worksheets[1].Cells[i + 1, 4].PutValue((lcList[i].AddTime / 3600) + "小时" + (lcList[i].AddTime % 3600 / 60) + "分" + (lcList[i].AddTime % 60) + "秒");
                }
            }
            if (dtList.Count > 0)
            {
                //循环写入数据
                for (int i = 0; i < dtList.Count; i++)
                {
                    wk.Worksheets[2].Cells[i + 1, 0].PutValue(dtList[i].TeamName.Trim());
                    wk.Worksheets[2].Cells[i + 1, 1].PutValue(dtList[i].LoginNo.Trim());
                    wk.Worksheets[2].Cells[i + 1, 2].PutValue(dtList[i].Teller_Name.Trim());
                    wk.Worksheets[2].Cells[i + 1, 3].PutValue(dtList[i].Result);
                    //wk.Worksheets[2].Cells[i + 1, 4].PutValue((dtList[i].AddTime / 3600) + "小时" + (dtList[i].AddTime % 3600 / 60) + "分" + (dtList[i].AddTime % 60) + "秒");
                }
            }
            if (gyList.Count > 0)
            {
                //循环写入数据
                for (int i = 0; i < gyList.Count; i++)
                {
                    wk.Worksheets[3].Cells[i + 1, 0].PutValue(gyList[i].TeamName.Trim());
                    wk.Worksheets[3].Cells[i + 1, 1].PutValue(gyList[i].LoginNo.Trim());
                    wk.Worksheets[3].Cells[i + 1, 2].PutValue(gyList[i].Teller_Name.Trim());
                    wk.Worksheets[3].Cells[i + 1, 3].PutValue(gyList[i].Result);
                    //wk.Worksheets[3].Cells[i + 1, 4].PutValue((gyList[i].AddTime / 3600) + "小时" + (gyList[i].AddTime % 3600 / 60) + "分" + (gyList[i].AddTime % 60) + "秒");
                }
            }
            var dtClass = commonBll.GetListDatatable("select * from tb_Class");

            List<TotalScoreModel> totalList = new List<TotalScoreModel>();
            if (dtClass != null && dtClass.Rows.Count > 0)
            {
                foreach (DataRow dr in dtClass.Rows)
                {
                    TotalScoreModel m = new TotalScoreModel();
                    m.TeamName = dr["ClassName"].ToString();
                    m.khjlScore = 0;
                    if (xdList1 != null && xdList1.Count > 0 && xdList1.Where(w => w.TeamName.Equals(m.TeamName)).ToList().Count > 0)
                    {
                        m.khjlScore = xdList1.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().Result;
                        m.AddTime = xdList1.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().AddTime;
                    }
                    if (xdList != null && xdList.Count > 0 && xdList.Where(w => w.TeamName.Equals(m.TeamName)).ToList().Count > 0)
                    {
                        m.khjlScore += xdList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().Result;
                        m.AddTime = xdList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().AddTime;
                    }
                    m.lcjlScore = 0;
                    if (lcList != null && lcList.Count > 0 && lcList.Where(w => w.TeamName.Equals(m.TeamName)).ToList().Count > 0)
                    {
                        m.lcjlScore = lcList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().Result;
                        m.AddTime = m.AddTime < lcList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().AddTime ? lcList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().AddTime : m.AddTime;
                    }
                    m.dtjlScore = 0;
                    if (dtList != null && dtList.Count > 0 && dtList.Where(w => w.TeamName.Equals(m.TeamName)).ToList().Count > 0)
                    {
                        m.dtjlScore = dtList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().Result;
                        m.AddTime = m.AddTime < dtList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().AddTime ? dtList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().AddTime : m.AddTime;
                    }
                    m.zhgyScore = 0;
                    if (gyList != null && gyList.Count > 0 && gyList.Where(w => w.TeamName.Equals(m.TeamName)).ToList().Count > 0)
                    {
                        m.zhgyScore = gyList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().Result;
                        m.AddTime = m.AddTime < gyList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().AddTime ? gyList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().AddTime : m.AddTime;
                    }
                    m.Result = m.khjlScore + m.lcjlScore + m.dtjlScore + m.zhgyScore;

                    totalList.Add(m);
                }
            }

            if (totalList != null && totalList.Count > 0)
            {
                totalList = totalList.OrderByDescending(o => o.Result).ToList();
            }
            if (totalList.Count > 0)
            {
                //循环写入数据
                for (int i = 0; i < totalList.Count; i++)
                {
                    wk.Worksheets[4].Cells[i + 1, 0].PutValue(totalList[i].TeamName.Trim());
                    wk.Worksheets[4].Cells[i + 1, 1].PutValue(totalList[i].khjlScore.ToString().Trim());
                    wk.Worksheets[4].Cells[i + 1, 2].PutValue(totalList[i].lcjlScore.ToString().Trim());
                    wk.Worksheets[4].Cells[i + 1, 3].PutValue(totalList[i].dtjlScore.ToString().Trim());
                    wk.Worksheets[4].Cells[i + 1, 4].PutValue(totalList[i].zhgyScore.ToString().Trim());
                    wk.Worksheets[4].Cells[i + 1, 5].PutValue(totalList[i].Result.ToString().Trim());
                    int second = totalList[i].AddTime;
                    //wk.Worksheets[4].Cells[i + 1, 6].PutValue((second / 3600) + "小时" + (second % 3600 / 60) + "分" + (second % 60) + "秒");
                    //wk.Worksheets[4].Cells[i + 1, 3].PutValue(totalList[i].Index);    
                }
            }



            string ExcelName = DateTime.Now.ToString("yyyyMMdd") + "" + DateTime.Now.Millisecond + "四项成绩";
            filename = "/Export/" + ExcelName + ".xls";
            string serverPath = System.Web.HttpContext.Current.Server.MapPath(filename);
            wk.Save(serverPath);

            var json = new object[] {
                        new{
                            filename=filename,
                        }
                    };
            return new HttpResponseMessage { Content = new StringContent(JsonConvert.SerializeObject(json), System.Text.Encoding.UTF8, "application/json") };
        }
        #endregion


        /// <summary>
        /// 根据系统编号获取赛项列表
        /// </summary>
        /// <param name="SystemId">系统编号(1=易考通2=信贷3=理财4=银行5=大堂经理6=柜员)</param>
        /// <returns></returns>
        ///[EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpGet]
        public HttpResponseMessage GetComplexPlanList(int SystemId)
        {
            var hrm = new HttpResponseMessage();
            var dt = new DataTable();
            string json = string.Empty;
            string strSql = string.Empty;
            switch (SystemId)
            {
                //易考通
                case 1:
                    dt = commonBll.GetListDatatable(SystemId, "E_PId PlanId,E_Name Plan_Name", "tb_HB_Examination", "", "");
                    json = JsonConvert.SerializeObject(dt);
                    hrm = new HttpResponseMessage { Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json") };
                    break;
                case 5:
                    dt = commonBll.GetListDatatable(SystemId, "ID PlanId,PracticeName Plan_Name", "bsi_PracticeAssessment", "", "");
                    json = JsonConvert.SerializeObject(dt);
                    hrm = new HttpResponseMessage { Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json") };
                    break;
                case 6:
                    dt = commonBll.GetListDatatable(SystemId, "ID PlanId,PracticeName Plan_Name", "bsi_PracticeAssessment", "", "");
                    json = JsonConvert.SerializeObject(dt);
                    hrm = new HttpResponseMessage { Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json") };
                    break;
                default:
                    dt = commonBll.GetListDatatable(SystemId, "Id PlanId,Plan_Name", "dal_ComplexPlan", "", "");
                    json = JsonConvert.SerializeObject(dt);
                    hrm = new HttpResponseMessage { Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json") };
                    break;
            }
            return hrm;
        }

        /// <summary>
        /// 根据系统编号获取赛项成绩列表
        /// </summary>
        /// <param name="SystemId">系统编号(1=易考通2=信贷3=理财4=银行5=大堂经理6=柜员)</param>
        /// <param name="PlanId">赛项编号</param>
        /// <returns></returns>
        //[EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpGet]
        public HttpResponseMessage GetComplexPlanResultList(int SystemId, int PlanId)
        {
            var hrm = new HttpResponseMessage();
            var dt = new DataTable();
            string json = string.Empty;
            string strSql = string.Empty;
            switch (SystemId)
            {
                //易考通
                case 1:
                    dt = commonBll.GetListDatatable(SystemId, "ISNULL(a.UserName,'')Teller_Name,b.[Name] TeamName,c.ER_Score Result,d.E_Name Plan_Name", "tb_UserInfo a left join tb_School b on a.UserSchoolId=b.Id left join tb_ExaminationResult c on a.UId = c.ER_MId left join tb_HB_Examination d on c.ER_PId = d.E_PId", " and c.ER_PId=" + PlanId + "", "c.ER_Score desc");
                    json = JsonConvert.SerializeObject(dt);
                    hrm = new HttpResponseMessage { Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json") };
                    break;
                case 5:
                    dt = commonBll.GetListDatatable(SystemId, "ISNULL(a.[Name],'')Teller_Name,b.SchoolName TeamName,c.Scores Result,d.PracticeName Plan_Name,f.C_ID as TeamID", "tb_Student a left join tb_School b on a.SchoolId=b.S_ID left join bsi_TotalResult c on a.UserId=c.UserId left join bsi_PracticeAssessment d on c.ExamId=d.ID inner join tb_Class f on f.C_ID=a.ClassId", " and c.ExamId=" + PlanId + "", "c.Scores desc");
                    json = JsonConvert.SerializeObject(dt);
                    hrm = new HttpResponseMessage { Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json") };
                    break;
                case 6:
                    dt = commonBll.GetListDatatable(SystemId, "ISNULL(a.[Name],'')Teller_Name,b.SchoolName TeamName,c.Scores Result,d.PracticeName Plan_Name,f.C_ID TeamID", "tb_Student a left join tb_School b on a.SchoolId=b.S_ID left join bsi_TotalResult c on a.UserId=c.UserId left join bsi_PracticeAssessment d on c.ExamId=d.ID inner join tb_Class f on f.C_ID=a.ClassId", " and c.ExamId=" + PlanId + "", "c.Scores desc");
                    json = JsonConvert.SerializeObject(dt);
                    hrm = new HttpResponseMessage { Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json") };
                    break;
                default:
                    dt = commonBll.GetListDatatable(SystemId, "ISNULL(a.Teller_Name,'')Teller_Name,b.id TeamID, b.TeamName,c.Result,d.Plan_Name,b.Id TeamID", "bi_BankTeller a left join bi_Team b on a.Team_Id=b.Id left join zhyw_ExamResult c on a.Id = c.TellerId left join dal_ComplexPlan d on c.PlanId = d.Id", " and c.PlanId=" + PlanId + "", "c.Result desc");
                    json = JsonConvert.SerializeObject(dt);
                    hrm = new HttpResponseMessage { Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json") };
                    break;
            }
            return hrm;
        }


        /// <summary>
        /// 根据系统编号获取赛项成绩列表
        /// </summary>
        /// <param name="SystemId">系统编号(1=易考通2=信贷3=理财4=银行5=大堂经理6=柜员)</param>
        /// <param name="PlanId">赛项编号</param>
        /// <returns></returns>
        //[EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpGet]
        public HttpResponseMessage GetResultList(string a, string b, string c)
        {
            DataTable dt = commonBll.GetListDatatable("select * from ExamSetting");
            //string examStr = ConfigurationManager.AppSettings["examStr"] ?? "";
            var dtxd = commonBll.GetListDatatable(2, "ISNULL(a.Teller_Name,'')Teller_Name,b.TeamName,c.Result,d.Plan_Name,datediff(SECOND,(select BeginTime from dal_ComplexTimer where ComplexPlanId=d.id),c.SubmitTime) AddTime,a.Teller_No as LoginNo", "bi_BankTeller a left join bi_Team b on a.Team_Id=b.Id left join zhyw_ExamResult c on a.Id = c.TellerId left join dal_ComplexPlan d on c.PlanId = d.Id", " and c.PlanId=" + GetExamID(dt, 1, 1) + "", "c.Result desc");
            var dtxd1 = commonBll.GetListDatatable(2, "ISNULL(a.Teller_Name,'')Teller_Name,b.TeamName,c.Result,d.Plan_Name,datediff(SECOND,(select BeginTime from dal_ComplexTimer where ComplexPlanId=d.id),c.SubmitTime) AddTime,a.Teller_No as LoginNo", "bi_BankTeller a left join bi_Team b on a.Team_Id=b.Id left join zhyw_ExamResult c on a.Id = c.TellerId left join dal_ComplexPlan d on c.PlanId = d.Id", " and c.PlanId=" + GetExamID(dt, 1, 2) + "", "c.Result desc");
            var dtlc = commonBll.GetListDatatable(3, "ISNULL(a.Teller_Name,'')Teller_Name,b.TeamName,c.Result,d.Plan_Name,datediff(SECOND,(select BeginTime from dal_ComplexTimer where ComplexPlanId=d.id),c.SubmitTime) AddTime,a.Teller_No  as LoginNo", "bi_BankTeller a left join bi_Team b on a.Team_Id=b.Id left join zhyw_ExamResult c on a.Id = c.TellerId left join dal_ComplexPlan d on c.PlanId = d.Id", " and c.PlanId=" + GetExamID(dt, 2, 1) + "", "c.Result desc");
            var dtdt = commonBll.GetListDatatable(5, "ISNULL(a.[Name],'')Teller_Name,b.ClassName TeamName,c.Scores Result,d.PracticeName Plan_Name,datediff(SECOND,d.PracticeStarTime,c.UpdateTime) AddTime ,e.LoginNo", "tb_Student a left join tb_class b on a.classid=b.c_id left join bsi_TotalResult c on a.UserId=c.UserId left join bsi_PracticeAssessment d on c.ExamId=d.ID inner join tb_User e on e.u_id=a.UserId", " and c.ExamId=" + GetExamID(dt, 3, 1) + "", "c.Scores desc");
            var dtgy = commonBll.GetListDatatable(6, "ISNULL(a.[Name],'')Teller_Name,b.ClassName TeamName,c.Scores Result,d.PracticeName Plan_Name,datediff(SECOND,d.PracticeStarTime,c.AddTime) AddTime,e.LoginNo", "tb_Student a left join tb_class b on a.classid=b.c_id left join bsi_TotalResult c on a.UserId=c.UserId left join bsi_PracticeAssessment d on c.ExamId=d.ID inner join tb_User e on e.u_id=a.UserId", " and c.ExamId=" + GetExamID(dt, 4, 1) + "", "c.Scores desc");


            #region 装箱数据
            List<ScoreModel> xdList = new List<ScoreModel>();
            if (dtxd != null && dtxd.Rows.Count > 0)
            {
                foreach (DataRow dr in dtxd.Rows)
                {
                    if (xdList.Where(w => w.Teller_Name == dr["Teller_Name"].ToString() && w.TeamName == dr["TeamName"].ToString()).ToList().Count > 0)
                    {
                        continue;
                    }
                    ScoreModel model = new ScoreModel();
                    model.Teller_Name = dr["Teller_Name"].ToString();
                    model.TeamName = dr["TeamName"].ToString();
                    model.Result = decimal.Parse(dr["Result"].ToString()) > 200 ? 200 : decimal.Parse(dr["Result"].ToString());
                    model.Plan_Name = dr["Plan_Name"].ToString();
                    model.AddTime = int.Parse(dr["AddTime"].ToString());
                    model.LoginNo = dr["LoginNo"].ToString();
                    xdList.Add(model);
                }
            }
            List<ScoreModel> xdList1 = new List<ScoreModel>();
            if (dtxd1 != null && dtxd1.Rows.Count > 0)
            {
                foreach (DataRow dr in dtxd1.Rows)
                {
                    if (xdList1.Where(w => w.Teller_Name == dr["Teller_Name"].ToString() && w.TeamName == dr["TeamName"].ToString()).ToList().Count > 0)
                    {
                        continue;
                    }
                    ScoreModel model = new ScoreModel();
                    model.Teller_Name = dr["Teller_Name"].ToString();
                    model.TeamName = dr["TeamName"].ToString();
                    model.Result = decimal.Parse(dr["Result"].ToString()) > 200 ? 200 : decimal.Parse(dr["Result"].ToString());
                    model.Plan_Name = dr["Plan_Name"].ToString();
                    model.AddTime = int.Parse(dr["AddTime"].ToString());
                    model.LoginNo = dr["LoginNo"].ToString();
                    xdList1.Add(model);
                }
            }
            List<ScoreModel> lcList = new List<ScoreModel>();
            if (dtlc != null && dtlc.Rows.Count > 0)
            {
                foreach (DataRow dr in dtlc.Rows)
                {
                    if (lcList.Where(w => w.Teller_Name == dr["Teller_Name"].ToString() && w.TeamName == dr["TeamName"].ToString()).ToList().Count > 0)
                    {
                        continue;
                    }
                    ScoreModel model = new ScoreModel();
                    model.Teller_Name = dr["Teller_Name"].ToString();
                    model.TeamName = dr["TeamName"].ToString();
                    model.Result = decimal.Parse(dr["Result"].ToString()) > 200 ? 200 : decimal.Parse(dr["Result"].ToString());
                    model.Plan_Name = dr["Plan_Name"].ToString();
                    model.AddTime = int.Parse(dr["AddTime"].ToString());
                    model.LoginNo = dr["LoginNo"].ToString();
                    lcList.Add(model);
                }
            }
            List<ScoreModel> dtList = new List<ScoreModel>();
            if (dtdt != null && dtdt.Rows.Count > 0)
            {
                foreach (DataRow dr in dtdt.Rows)
                {
                    if (dtList.Where(w => w.Teller_Name == dr["Teller_Name"].ToString() && w.TeamName == dr["TeamName"].ToString()).ToList().Count > 0)
                    {
                        continue;
                    }
                    ScoreModel model = new ScoreModel();
                    model.Teller_Name = dr["Teller_Name"].ToString();
                    model.TeamName = dr["TeamName"].ToString();
                    model.Result = decimal.Parse(dr["Result"].ToString()) > 200 ? 200 : decimal.Parse(dr["Result"].ToString());
                    model.Plan_Name = dr["Plan_Name"].ToString();
                    model.AddTime = int.Parse(dr["AddTime"].ToString());
                    model.LoginNo = dr["LoginNo"].ToString();
                    dtList.Add(model);
                }
            }
            List<ScoreModel> gyList = new List<ScoreModel>();
            if (dtgy != null && dtgy.Rows.Count > 0)
            {
                foreach (DataRow dr in dtgy.Rows)
                {
                    if (gyList.Where(w => w.Teller_Name == dr["Teller_Name"].ToString() && w.TeamName == dr["TeamName"].ToString()).ToList().Count > 0)
                    {
                        continue;
                    }
                    ScoreModel model = new ScoreModel();
                    model.Teller_Name = dr["Teller_Name"].ToString();
                    model.TeamName = dr["TeamName"].ToString();
                    model.Result = decimal.Parse(dr["Result"].ToString()) > 200 ? 200 : decimal.Parse(dr["Result"].ToString());
                    model.Plan_Name = dr["Plan_Name"].ToString();
                    model.AddTime = int.Parse(dr["AddTime"].ToString());
                    model.LoginNo = dr["LoginNo"].ToString();
                    gyList.Add(model);
                }
            }
            #endregion
            var dtClass = commonBll.GetListDatatable("select * from tb_Class");

            List<TotalScoreModel> totalList = new List<TotalScoreModel>();
            if (dtClass != null && dtClass.Rows.Count > 0)
            {
                foreach (DataRow dr in dtClass.Rows)
                {
                    TotalScoreModel m = new TotalScoreModel();
                    m.TeamName = dr["ClassName"].ToString();
                    m.khjlScore = 0;
                    if (xdList1 != null && xdList1.Count > 0 && xdList1.Where(w => w.TeamName.Equals(m.TeamName)).ToList().Count > 0)
                    {
                        m.khjlScore = xdList1.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().Result;
                        m.AddTime = xdList1.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().AddTime;
                    }
                    if (xdList != null && xdList.Count > 0 && xdList.Where(w => w.TeamName.Equals(m.TeamName)).ToList().Count > 0)
                    {
                        m.khjlScore += xdList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().Result;
                        m.AddTime = xdList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().AddTime;
                    }
                    m.lcjlScore = 0;
                    if (lcList != null && lcList.Count > 0 && lcList.Where(w => w.TeamName.Equals(m.TeamName)).ToList().Count > 0)
                    {
                        m.lcjlScore = lcList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().Result;
                        m.AddTime = m.AddTime < lcList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().AddTime ? lcList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().AddTime : m.AddTime;
                    }
                    m.dtjlScore = 0;
                    if (dtList != null && dtList.Count > 0 && dtList.Where(w => w.TeamName.Equals(m.TeamName)).ToList().Count > 0)
                    {
                        m.dtjlScore = dtList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().Result;
                        m.AddTime = m.AddTime < dtList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().AddTime ? dtList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().AddTime : m.AddTime;
                    }
                    m.zhgyScore = 0;
                    if (gyList != null && gyList.Count > 0 && gyList.Where(w => w.TeamName.Equals(m.TeamName)).ToList().Count > 0)
                    {
                        m.zhgyScore = gyList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().Result;
                        m.AddTime = m.AddTime < gyList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().AddTime ? gyList.Where(w => w.TeamName.Equals(m.TeamName)).FirstOrDefault().AddTime : m.AddTime;
                    }
                    m.Result = m.khjlScore + m.lcjlScore + m.dtjlScore + m.zhgyScore;

                    totalList.Add(m);
                }
            }

            if (totalList != null && totalList.Count > 0)
            {
                totalList = totalList.OrderByDescending(o => o.Result).ToList();
            }
            return new HttpResponseMessage { Content = new StringContent(JsonConvert.SerializeObject(totalList), System.Text.Encoding.UTF8, "application/json") };

        }

        #region 获取各会场数据
        /// <summary>
        /// 获取各会场数据
        /// </summary>
        /// <param name="SystemId">系统编号(1=易考通2=信贷3=理财4=银行5=大堂经理)</param>
        /// <returns></returns>
        [HttpGet]
        public HttpResponseMessage GetEveryResultList(int SystemId, string a, string b, string c)
        {
            List<TScoreModel> list = new List<TScoreModel>();
            DataTable dt = commonBll.GetListDatatable("select * from ExamSetting");
            //string examStr = ConfigurationManager.AppSettings["examStr"] ?? "";            
            switch (SystemId)
            {
                case 2:
                    var dtxd = commonBll.GetListDatatable(2, "ISNULL(a.Teller_Name,'')Teller_Name,b.TeamName,b.Id TeamID,c.Result,d.Plan_Name,c.AddTime,a.Teller_No as LoginNo", "bi_BankTeller a left join bi_Team b on a.Team_Id=b.Id left join zhyw_ExamResult c on a.Id = c.TellerId left join dal_ComplexPlan d on c.PlanId = d.Id", " and c.PlanId=" + GetExamID(dt, 1, 1) + "", "c.Result desc");
                    var dtxd2 = commonBll.GetListDatatable(2, "ISNULL(a.Teller_Name,'')Teller_Name,b.TeamName,b.Id TeamID,c.Result,d.Plan_Name,c.AddTime,a.Teller_No as LoginNo", "bi_BankTeller a left join bi_Team b on a.Team_Id=b.Id left join zhyw_ExamResult c on a.Id = c.TellerId left join dal_ComplexPlan d on c.PlanId = d.Id", " and c.PlanId=" + GetExamID(dt, 1, 2) + "", "c.Result desc");
                    list = new List<TScoreModel>();
                    if (dtxd != null && dtxd.Rows.Count > 0)
                    {
                        foreach (DataRow dr in dtxd.Rows)
                        {
                            if (list.Where(w => w.Teller_Name == dr["Teller_Name"].ToString() && w.TeamName == dr["TeamName"].ToString()).ToList().Count > 0)
                            {
                                continue;
                            }
                            TScoreModel model = new TScoreModel();
                            model.Teller_Name = dr["Teller_Name"].ToString();
                            model.TeamName = dr["TeamName"].ToString();
                            model.TeamID = dr["TeamID"].ToString();
                            model.Result = decimal.Parse(dr["Result"].ToString()) > 100 ? 100 : decimal.Parse(dr["Result"].ToString());
                            model.Plan_Name = dr["Plan_Name"].ToString();
                            model.AddTime = DateTime.Parse(dr["AddTime"].ToString());
                            list.Add(model);
                        }
                        foreach (DataRow dr2 in dtxd2.Rows)
                        {
                            if (list.Where(w => w.TeamName == dr2["TeamName"].ToString() && w.Teller_Name == dr2["Teller_Name"].ToString()).ToList().Count > 0)
                            {
                                var r = list.Where(w => w.TeamName == dr2["TeamName"].ToString() && w.Teller_Name == dr2["Teller_Name"].ToString()).FirstOrDefault();
                                r.Result += decimal.Parse(dr2["Result"].ToString()) > 100 ? 100 : decimal.Parse(dr2["Result"].ToString());
                            }
                            else
                            {
                                TScoreModel tsss = new TScoreModel();
                                tsss.Teller_Name = dr2["Teller_Name"].ToString();
                                tsss.TeamName = dr2["TeamName"].ToString();
                                tsss.TeamID = dr2["TeamID"].ToString();
                                tsss.Result = decimal.Parse(dr2["Result"].ToString()) > 100 ? 100 : decimal.Parse(dr2["Result"].ToString());
                                tsss.Plan_Name = dr2["Plan_Name"].ToString();
                                tsss.AddTime = DateTime.Parse(dr2["AddTime"].ToString());
                                list.Add(tsss);
                            }
                        }
                    }
                    break;

                case 3:
                    var dtlc = commonBll.GetListDatatable(3, "ISNULL(a.Teller_Name,'')Teller_Name,b.TeamName,b.Id TeamID,c.Result,d.Plan_Name,c.AddTime,a.Teller_No  as LoginNo", "bi_BankTeller a left join bi_Team b on a.Team_Id=b.Id left join zhyw_ExamResult c on a.Id = c.TellerId left join dal_ComplexPlan d on c.PlanId = d.Id", " and c.PlanId=" + GetExamID(dt, 2, 1) + "", "c.Result desc");
                    list = new List<TScoreModel>();
                    if (dtlc != null && dtlc.Rows.Count > 0)
                    {
                        foreach (DataRow dr in dtlc.Rows)
                        {
                            if (list.Where(w => w.Teller_Name == dr["Teller_Name"].ToString() && w.TeamName == dr["TeamName"].ToString()).ToList().Count > 0)
                            {
                                continue;
                            }
                            TScoreModel model = new TScoreModel();
                            model.Teller_Name = dr["Teller_Name"].ToString();
                            model.TeamName = dr["TeamName"].ToString();
                            model.TeamID = dr["TeamID"].ToString();

                            model.Result = decimal.Parse(dr["Result"].ToString()) > 200 ? 200 : decimal.Parse(dr["Result"].ToString());
                            model.Plan_Name = dr["Plan_Name"].ToString();
                            model.AddTime = DateTime.Parse(dr["AddTime"].ToString());
                            list.Add(model);
                        }
                    }
                    break;
                case 5:
                    var dtdt = commonBll.GetListDatatable(5, "ISNULL(a.[Name],'')Teller_Name,f.ClassName TeamName,f.C_ID TeamID,c.Scores Result,d.PracticeName Plan_Name,c.AddTime,e.LoginNo", "tb_Student a left join tb_School b on a.SchoolId=b.S_ID left join bsi_TotalResult c on a.UserId=c.UserId left join bsi_PracticeAssessment d on c.ExamId=d.ID inner join tb_User e on e.u_id=a.UserId inner join tb_Class f on f.C_ID=a.ClassId", " and c.ExamId=" + GetExamID(dt, 3, 1) + "", "c.Scores desc");
                    list = new List<TScoreModel>();
                    if (dtdt != null && dtdt.Rows.Count > 0)
                    {
                        foreach (DataRow dr in dtdt.Rows)
                        {
                            if (list.Where(w => w.Teller_Name == dr["Teller_Name"].ToString() && w.TeamName == dr["TeamName"].ToString()).ToList().Count > 0)
                            {
                                continue;
                            }
                            TScoreModel model = new TScoreModel();
                            model.Teller_Name = dr["Teller_Name"].ToString();
                            model.TeamName = dr["TeamName"].ToString();
                            model.TeamID = dr["TeamID"].ToString();
                            model.Result = decimal.Parse(dr["Result"].ToString()) > 200 ? 200 : decimal.Parse(dr["Result"].ToString());
                            model.Plan_Name = dr["Plan_Name"].ToString();
                            model.AddTime = DateTime.Parse(dr["AddTime"].ToString());
                            list.Add(model);
                        }
                    }
                    break;
                case 6:
                    var dtgy = commonBll.GetListDatatable(6, "ISNULL(a.[Name],'')Teller_Name,f.ClassName TeamName,f.C_ID TeamID,c.Scores Result,d.PracticeName Plan_Name,c.AddTime,e.LoginNo", "tb_Student a left join tb_School b on a.SchoolId=b.S_ID left join bsi_TotalResult c on a.UserId=c.UserId left join bsi_PracticeAssessment d on c.ExamId=d.ID inner join tb_User e on e.u_id=a.UserId inner join tb_Class f on f.C_ID=a.ClassId", " and c.ExamId=" + GetExamID(dt, 4, 1) + "", "c.Scores desc");
                    list = new List<TScoreModel>();
                    if (dtgy != null && dtgy.Rows.Count > 0)
                    {
                        foreach (DataRow dr in dtgy.Rows)
                        {
                            if (list.Where(w => w.Teller_Name == dr["Teller_Name"].ToString() && w.TeamName == dr["TeamName"].ToString()).ToList().Count > 0)
                            {
                                continue;
                            }
                            TScoreModel model = new TScoreModel();
                            model.Teller_Name = dr["Teller_Name"].ToString();
                            model.TeamID = dr["TeamID"].ToString();
                            model.TeamName = dr["TeamName"].ToString();
                            model.Result = decimal.Parse(dr["Result"].ToString()) > 200 ? 200 : decimal.Parse(dr["Result"].ToString());
                            model.Plan_Name = dr["Plan_Name"].ToString();
                            model.AddTime = DateTime.Parse(dr["AddTime"].ToString());
                            list.Add(model);
                        }
                    }
                    break;

            }

            if (list != null && list.Count > 0)
            {
                list = list.OrderByDescending(o => o.Result).ToList();
            }

            return new HttpResponseMessage { Content = new StringContent(JsonConvert.SerializeObject(list), System.Text.Encoding.UTF8, "application/json") };
        }
        #endregion

        #region 获取考核成绩数据
        /// <summary>
        /// 获取考核成绩数据
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="modeid"></param>
        /// <param name="index"></param>
        /// <returns></returns>
        public string GetExamID(DataTable dt, int modeid, int index)
        {
            string examID = string.Empty;
            foreach (DataRow dr in dt.Rows)
            {
                if (dr["DBID"].ToString() == modeid.ToString())
                {
                    var str = dr["ExamIDS"].ToString();
                    if (str.IndexOf(",") > -1)
                    {
                        examID = str.Split(',')[index - 1];
                        break;
                    }
                    else
                    {
                        examID = str;
                        break;
                    }
                }
            }
            return examID;
        }
        #endregion

    }
}
