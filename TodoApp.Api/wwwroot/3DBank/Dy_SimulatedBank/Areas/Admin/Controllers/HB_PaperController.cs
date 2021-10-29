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
using System.Collections;
namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class HB_PaperController : BaseController
    {
        //
        // GET: /Admin/HB_Paper/
        CommonBll commonbll = new CommonBll();
        public ActionResult Index()
        {
            ViewData["UserType"] = UserType;
            return View();
        }

        /// <summary>
        /// 手工组卷视图
        /// </summary>
        /// <returns></returns>
        public ActionResult ManualTestPaper()
        {
            ViewData["UserType"] = UserType;
            return View();
        }

        /// <summary>
        /// 智能组卷视图
        /// </summary>
        /// <returns></returns>
        public ActionResult IntelligentTestPaper()
        {
            ViewData["UserType"] = UserType;
            return View();
        }

        /// <summary>
        /// 试卷列表
        /// </summary>
        /// <returns></returns>
        public string GetList()
        {

            string wheres = " and P_State=1";//试卷状态
            if (UserType == 1)
            {
                wheres += " and P_AddOperator=" + UserId ;//试卷状态
            }
            else {
                wheres += " and (P_AddOperator=" + UserId + ") or P_Kind=1";//试卷状态
            }


            if (Request["P_Name"] != null && Request["P_Name"].ToString().Length > 0)//试卷名称
            {

                wheres += " and P_Name like '%" + Request["P_Name"].ToString() + "%'";
            }



            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = "P_AddTime desc"; //排序必须填写
            m.strFld = " a.*,(select SUM(EP_Score) from tb_HB_ExaminationPapers where EP_PId=PId) as Score ";
            m.tab = "tb_HB_Paper a";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));

        }

        /// <summary>
        /// 获取单行数据
        /// </summary>
        /// <returns></returns>
        public string GetListById()
        {
            DataTable dt = commonbll.GetListDatatable("*", "tb_HB_Paper", " and PId=" + Request["PId"]);

            return JsonConvert.SerializeObject(dt);
        }


        /// <summary>
        /// 编辑
        /// </summary>
        /// <returns></returns>
        public string Edit()
        {
            string PId = Request["PId"];
            string EditP_Name = Request["EditP_Name"];//试卷名称
            string IsOrder = Request["IsOrder"];//是否打乱顺序

            string checkewheres = " and P_AddOperator=" + UserId;

            checkewheres += " and P_State=1  and P_Name='" + EditP_Name + "' and PId!=" + PId;

            //验证裁判名称是否存在
            var checkcount = commonbll.GetRecordCount("tb_HB_Paper", checkewheres);
            if (checkcount > 0)
            {
                return "88";
            }

            SqlParameter[] pars = new SqlParameter[] 
                {
                    new SqlParameter("@P_Name",EditP_Name),
                    new SqlParameter("@P_IsOrder",IsOrder),
                    new SqlParameter("@P_Operator",UserId),
                    new SqlParameter("@PId",PId)
                };
            //修改状态 操作人
            var resultcount = commonbll.UpdateInfo("tb_HB_Paper", " P_Name=@P_Name,P_IsOrder=@P_IsOrder,P_Operator=@P_Operator", " and PId=@PId", pars);
            return resultcount.ToString();

        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <returns></returns>
        public string DelPaper()
        {
            try
            {
                var Ids = Request["Ids"];
                //需要检验
                SqlParameter[] pars = new SqlParameter[] 
                {
                    new SqlParameter("@P_Operator",UserId),
                    new SqlParameter("@P_State","0")
                };

                commonbll.UpdateInfo("tb_HB_Paper", " P_State=@P_State,P_Operator=@P_Operator", " and PId in(" + Ids + ") and P_AddOperator=" + UserId, pars);


                return "1";
            }
            catch
            {
                return "99";
            }
        }

        /// <summary>
        /// 读取试题标签
        /// </summary>
        /// <returns></returns>
        public string Gettb_HB_QuestionBQ()
        {
            DataTable dt = commonbll.GetListDatatable("*", "tb_HB_QuestionBQ", " and (AddUserId=" + UserId + " or BQ_Kind=1)");

            return JsonConvert.SerializeObject(dt);
        }
        /// <summary>
        /// 手工组建-题目列表
        /// </summary>
        /// <returns></returns>
        public string GetQuestionBankList()
        {
            string st_wheres = " and QB_State=1";//试题状态
            string wheres = "";


            st_wheres += " and (QB_AddOperator=" + UserId + " or QB_Kind=1)";


            if (Request["PaperQB_Type"] != null && Request["PaperQB_Type"].ToString() != "0")//题型选择
            {
                wheres += " and QB_Type='" + Request["PaperQB_Type"].ToString() + "'";
            }

            if (Request["PaperQB_Description"] != null && Request["PaperQB_Description"].ToString().Length > 0)//题目描述
            {

                wheres += " and QB_Description like '%" + Request["PaperQB_Description"].ToString() + "%'";
            }

            if (Request["PaperStateK"] != null && Request["PaperStateK"].ToString() != "0")//加卷状态
            {
                if (Request["PaperStateK"].ToString() == "1")//已加入当前试卷
                {
                    wheres += " and t.CountPaper>0";
                }
                else
                {
                    wheres += " and t.CountPaper=0";
                }

            }

            if (Request["PaperIsUse"] != null && Request["PaperIsUse"].ToString() != "0")//是否被使用
            {
                if (Request["PaperIsUse"].ToString() == "1")//已使用
                {
                    wheres += " and t.CountNum>0";
                }
                else
                {
                    wheres += " and t.CountNum=0";
                }
            }



            if (Request["SelQuestonBQName"] != null && Request["SelQuestonBQName"].ToString() != "0")//
            {

                wheres += " and QB_Custom1=" + Request["SelQuestonBQName"];
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " QB_AddTime desc"; //排序必须填写
            m.strFld = " * ";
            m.tab = @"(select QuestionBId,QB_Description,QB_Type,QB_AddTime,QuestonBQName,QB_Custom1,
  (select COUNT(1) from tb_HB_ExaminationPapers where EP_QBId=a.QuestionBId and EP_PId='" + Request["MPId"] + @"') as  CountPaper,
  (select COUNT(1) from tb_HB_ExaminationPapers m inner join tb_HB_Paper e on m.EP_PId=e.PId where EP_QBId=a.QuestionBId and (P_State=1 or EP_PId='" + Request["MPId"] + @"')) as CountNum 
  from tb_HB_QuestionBank a  inner join tb_HB_QuestionBQ b on a.QB_Custom1=b.ID where 1=1 " + st_wheres + ") t ";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));

        }

        /// <summary>
        /// 手工组卷-新增
        /// </summary>
        /// <returns></returns>
        public string AddManualTestPaper()
        {
            string error = "0";//错误
            string pid = "";//返回的试卷Id

            //先建试卷后 新增试卷试题表数据 返回 试卷Id
            string table = "tb_HB_Paper"; //表名
            string list = "P_Name, P_IsOrder, P_State, P_Kind, P_Operator, P_AddOperator, P_AddTime,P_Custom2";//列
            string vlaue = "@P_Name, @P_IsOrder, @P_State, @P_Kind, @P_Operator, @P_AddOperator, @P_AddTime,@P_Custom2";

            string AddP_Name = Request["AddP_Name"];
            string IsOrder = Request["IsOrder"];
            string P_Kind = UserType.ToString();//1系统 2是教师 正好与角色相对应

            string P_Operator = UserId.ToString();//操作
            string P_AddOperator = UserId.ToString();//创建人
            DateTime P_AddTime = DateTime.Now;
            string P_Custom2 = UserNo;//登录账号

            string wheres = " and P_State=1 and P_Name='" + AddP_Name + "'";//试卷状态

            //角色区分  //暂时不考虑独立打包客户，需要web加个配置 读取 控制 后期加

            wheres += " and P_AddOperator=" + UserId;


            //验证试卷名称
            var checkcount = commonbll.GetRecordCount("tb_HB_Paper", wheres);
            if (checkcount > 0)
            {
                var json = new object[] {
                        new{
                            error="88",
                            pid=pid
                        }
                    };
                return JsonConvert.SerializeObject(json);
            }

            SqlParameter[] pars = new SqlParameter[] 
            {
                new SqlParameter("@P_Name",AddP_Name),
                new SqlParameter("@P_IsOrder",IsOrder),
                new SqlParameter("@P_State","0"),//先存0
                new SqlParameter("@P_Kind",P_Kind),
                new SqlParameter("@P_Operator",P_Operator),

                new SqlParameter("@P_AddOperator",P_AddOperator),
                new SqlParameter("@P_AddTime",P_AddTime),
                new SqlParameter("@P_Custom2",P_Custom2)
            };
            var resultcount = commonbll.Add(table, list, vlaue, pars);
            if (resultcount == 1)
            {
                try
                {
                    //获取最新 新增的
                    string NPid = commonbll.GetListSclar("max(PId) as PId", "tb_HB_Paper", " and P_State=0 and P_Kind='" + P_Kind + "' and P_AddOperator='" + P_AddOperator + "'");
                    pid = NPid;
                    string Ids = Request["Ids"];
                    //然后 数据存入试卷试题关联表
                    var SptList = Ids.Split(',');
                    string sqlstr = "";
                    for (var i = 0; i < SptList.Length; i++)
                    {
                        if (SptList[i].Length > 0)
                        {
                            //验证该题是否已经加入过了
                            var checkcountTo = commonbll.GetRecordCount("tb_HB_ExaminationPapers", " and EP_PId='" + NPid + "' and EP_QBId='" + SptList[i] + "'");
                            if (checkcountTo == 0)
                            {
                                sqlstr += @"insert into tb_HB_ExaminationPapers values('" + NPid + "','" + SptList[i] + "','0','" + UserId + "','" + UserId + "','" + DateTime.Now + "',null,'" + UserNo + "',null);";
                            }

                        }

                    }

                    //插入
                    SqlHelper.ExecuteNonQuery(sqlstr);
                    error = "1";

                }
                catch
                {
                    error = "99";
                }
            }
            else
            {
                error = "99";
            }


            var jsonTo = new object[] {
                        new{
                            error=error,
                            pid=pid
                        }
                    };
            return JsonConvert.SerializeObject(jsonTo);
        }

        /// <summary>
        /// 手工组卷-加入试卷
        /// </summary>
        /// <returns></returns>
        public string AddtoManualTestPaper()
        {

            try
            {
                string Ids = Request["Ids"];
                string NPid = Request["NPid"];
                //然后 数据存入试卷试题关联表
                var SptList = Ids.Split(',');
                string sqlstr = "";
                for (var i = 0; i < SptList.Length; i++)
                {
                    if (SptList[i].Length > 0)
                    {
                        //验证该题是否已经加入过了
                        var checkcount = commonbll.GetRecordCount("tb_HB_ExaminationPapers", " and EP_PId='" + NPid + "' and EP_QBId='" + SptList[i] + "'");
                        if (checkcount == 0)
                        {
                            sqlstr += @"insert into tb_HB_ExaminationPapers values('" + NPid + "','" + SptList[i] + "','0','" + UserId + "','" + UserId + "','" + DateTime.Now + "',null,'" + UserNo + "',null);";
                        }

                    }

                }

                //插入
                SqlHelper.ExecuteNonQuery(sqlstr);
                return "1";
            }
            catch
            {
                return "99";
            }
        }


        /// <summary>
        /// 手工组卷-移除试卷
        /// </summary>
        /// <returns></returns>
        public string DeltoManualTestPaper()
        {
            try
            {
                string Ids = Request["Ids"];
                string NPid = Request["NPid"];
                //然后 数据存入试卷试题关联表
                commonbll.DeleteInfo("tb_HB_ExaminationPapers", " and EP_PId='" + NPid + "' and EP_QBId in(" + Ids + ")");
                return "1";
            }
            catch
            {
                return "99";
            }
        }

        /// <summary>
        /// 手工组卷-总提交
        /// </summary>
        /// <returns></returns>
        public string EditManualTestPaper()
        {
            try
            {
                string Ids = Request["Ids"];
                string IsOrder = Request["IsOrder"];
                string AddP_Name = Request["AddP_Name"];
                string NPid = Request["NPid"];

                string wheres = " and P_State=1 and P_Name='" + AddP_Name + "'";//试卷状态

                //角色区分  //暂时不考虑独立打包客户，需要web加个配置 读取 控制 后期加

                wheres += " and P_AddOperator=" + UserId;

                //验证试卷名称
                var checkcount = commonbll.GetRecordCount("tb_HB_Paper", wheres + " and PId!=" + NPid);
                if (checkcount > 0)
                {

                    return "88";
                }


                SqlParameter[] pars = new SqlParameter[] 
                {
                    new SqlParameter("@P_Name",AddP_Name),
                    new SqlParameter("@P_IsOrder",IsOrder),
                    new SqlParameter("@P_Operator",UserId),
                    new SqlParameter("@P_State","1"),
                    new SqlParameter("@PId",NPid)
                };
                //修改状态
                var resultcount = commonbll.UpdateInfo("tb_HB_Paper", " P_State=@P_State,P_Name=@P_Name,P_IsOrder=@P_IsOrder,P_Operator=@P_Operator", " and PId=@PId", pars);
                //然后为试卷试题设置分值

                var SptList = Ids.Split(',');

                for (var i = 0; i < SptList.Length; i++)
                {
                    if (SptList[i].Length > 0)
                    {
                        //试题类型
                        var Ttype = SptList[i].Split('-')[0];
                        //试题分值
                        var TScore = SptList[i].Split('-')[1];

                        SqlHelper.ExecuteNonQuery("update tb_HB_ExaminationPapers set EP_Score=" + TScore + @"
                     where EP_QBId in (select EP_QBId from tb_HB_ExaminationPapers  
                                    a inner join tb_HB_QuestionBank  
                                    b on a.EP_QBId=b.QuestionBId where EP_PId='" + NPid + "' and QB_Type=" + Ttype + ") and  EP_PId='" + NPid + "'");
                    }

                }
                return "1";
            }
            catch
            {
                return "99";
            }
        }

        /// <summary>
        /// 手工组卷-获取单前试卷各类题型
        /// </summary>
        /// <returns></returns>
        public string GetManualTestPaperByType()
        {

            DataTable dt = commonbll.GetListDatatable("QB_Type,count(1) as num", "tb_HB_ExaminationPapers a inner join tb_HB_QuestionBank b on a.EP_QBId=b.QuestionBId", " and EP_PId='" + Request["PId"] + "' group by QB_Type");
            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 导出试卷
        /// </summary>
        /// <returns></returns>
        public string Export()
        {
            DataTable dt = commonbll.GetListDatatable("P_Name,EP_Score ,b.*,QuestonBQName",
                                 @"tb_HB_ExaminationPapers a 
                                   inner join tb_HB_QuestionBank b on b.QuestionBId=a.EP_QBId 
                                   inner join tb_HB_Paper c on c.PId=A.EP_PId inner join tb_HB_QuestionBQ d on b.QB_Custom1=d.ID", " and PId='" + Request["Pid"] + "'");
            Aspose.Cells.Workbook wk = new Aspose.Cells.Workbook();

            string excelFile = string.Empty;
            excelFile = "/Export/理论知识试卷导出模版.xls";
#pragma warning disable CS0618 // “Workbook.Open(string)”已过时:“Use Workbook(string) constructor method instead.”
            wk.Open(System.Web.HttpContext.Current.Server.MapPath(excelFile));
#pragma warning restore CS0618 // “Workbook.Open(string)”已过时:“Use Workbook(string) constructor method instead.”

            string filename = "";
            if (dt.Rows.Count > 0)
            {
                wk.Worksheets[0].Cells[1, 0].PutValue(dt.Rows[0]["P_Name"].ToString().Trim());//试卷名称
                //循环写入数据
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    wk.Worksheets[0].Cells[i + 1, 1].PutValue(dt.Rows[i]["EP_Score"].ToString().Trim());//分值
                    wk.Worksheets[0].Cells[i + 1, 2].PutValue(dt.Rows[i]["QB_Type"].ToString().Trim());//题型
                    wk.Worksheets[0].Cells[i + 1, 3].PutValue(dt.Rows[i]["QB_Description"].ToString().Trim());//题名

                    wk.Worksheets[0].Cells[i + 1, 4].PutValue(dt.Rows[i]["QB_A"].ToString().Trim());//a
                    wk.Worksheets[0].Cells[i + 1, 5].PutValue(dt.Rows[i]["QB_B"].ToString().Trim());//b
                    wk.Worksheets[0].Cells[i + 1, 6].PutValue(dt.Rows[i]["QB_C"].ToString().Trim());//c   
                    wk.Worksheets[0].Cells[i + 1, 7].PutValue(dt.Rows[i]["QB_D"].ToString().Trim());//d
                    wk.Worksheets[0].Cells[i + 1, 8].PutValue(dt.Rows[i]["QB_E"].ToString().Trim());//e

                    wk.Worksheets[0].Cells[i + 1, 9].PutValue(dt.Rows[i]["QB_Answer"].ToString().Trim());//标准答案
                    wk.Worksheets[0].Cells[i + 1, 10].PutValue(dt.Rows[i]["QB_Keyword"].ToString().Trim());//关键字
                    wk.Worksheets[0].Cells[i + 1, 11].PutValue(dt.Rows[i]["QuestonBQName"].ToString().Trim());

                }

                string ExcelName = DateTime.Now.ToString("yyyyMMdd") + "" + DateTime.Now.Millisecond + "理论知识试卷";
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

        /// <summary>
        /// 智能组卷-获取数据库现有各类型题量
        /// </summary>
        /// <returns></returns>
        public string GetIntelligentTestPaperByType()
        {
            string st_wheres = " and QB_State=1";//试题状态

            if (Request["SelQuestonBQName"] != null && Request["SelQuestonBQName"].ToString().Length > 0)//
            {

                st_wheres += " and QB_Custom1 in (" + Request["SelQuestonBQName"] + ")";
            }

            st_wheres += " and (QB_AddOperator=" + UserId + " or QB_Kind=1)";


            string sql = @"select QB_Type,COUNT(QuestionBId) as num,(COUNT(QuestionBId)- COUNT(NoUseQuestionBId)) as NoUsenum from (
select QB_Type,QuestionBId,
(select distinct(EP_QBId)  from tb_HB_ExaminationPapers where EP_QBId=a.QuestionBId) as NoUseQuestionBId
 from tb_HB_QuestionBank a where 1=1  " + st_wheres + ") t group by QB_Type";
            DataTable dt = SqlHelper.ExecuteDataTable(sql);
            return JsonConvert.SerializeObject(dt);

        }


        /// <summary>
        /// 智能组卷-新增
        /// </summary>
        /// <returns></returns>
        public string AddIntelligentTestPaper()
        {
            //先建试卷后 新增试卷试题表数据 返回 试卷Id
            string table = "tb_HB_Paper"; //表名
            string list = "P_Name, P_IsOrder, P_State, P_Kind, P_Operator, P_AddOperator, P_AddTime,P_Custom2";//列
            string vlaue = "@P_Name, @P_IsOrder, @P_State, @P_Kind, @P_Operator, @P_AddOperator, @P_AddTime,@P_Custom2";

            string AddP_Name = Request["AddP_Name"];
            string IsOrder = Request["IsOrder"];
            string P_Kind = UserType.ToString();//1系统 2是教师 正好与角色相对应
            string SelQuestonBQName = Request["SelQuestonBQName"];//题库

            string P_Operator = UserId.ToString();//操作
            string P_AddOperator = UserId.ToString();//创建人
            DateTime P_AddTime = DateTime.Now;
            string P_Custom2 = UserNo;//登录账号

            string wheres = " and P_State=1 and P_Name='" + AddP_Name + "'";//试卷状态


            wheres += " and P_AddOperator=" + UserId;

            //验证试卷名称
            var checkcount = commonbll.GetRecordCount("tb_HB_Paper", wheres);
            if (checkcount > 0)
            {
                return "88";
            }

            SqlParameter[] pars = new SqlParameter[] 
            {
                new SqlParameter("@P_Name",AddP_Name),
                new SqlParameter("@P_IsOrder",IsOrder),
                new SqlParameter("@P_State","1"),
                new SqlParameter("@P_Kind",P_Kind),
                new SqlParameter("@P_Operator",P_Operator),

                new SqlParameter("@P_AddOperator",P_AddOperator),
                new SqlParameter("@P_AddTime",P_AddTime),
                new SqlParameter("@P_Custom2",P_Custom2)
            };
            var resultcount = commonbll.Add(table, list, vlaue, pars);
            if (resultcount == 1)
            {
                try
                {
                    //获取最新 新增的
                    string NPid = commonbll.GetListSclar("max(PId) as PId", "tb_HB_Paper", " and P_State=1 and P_Kind='" + P_Kind + "' and P_AddOperator='" + P_AddOperator + "'");


                    //获取传过的拼接数据  题型-抽取题-未被使用-分值,
                    string Ids = Request["Ids"];
                    string sqlstr = "";
                    //然后 数据存入试卷试题关联表
                    var SptList = Ids.Split(',');
                    for (var i = 0; i < SptList.Length; i++)
                    {
                        if (SptList[i].Length > 0)
                        {
                            var ToSptList = SptList[i].Split('-');
                            //题型
                            var Type = ToSptList[0];//题型
                            var CQTnum = ToSptList[1];//随机抽取
                            var WBTnum = ToSptList[2];//未被使用
                            var TScore = ToSptList[3];//分值
                            //计算实际随机抽取
                            int num = Convert.ToInt32(CQTnum);
                            int nonum = 0;//未被使用的抽取多少道
                            if (WBTnum != "" && WBTnum.Length > 0)
                            {
                                nonum = Convert.ToInt32(WBTnum);
                                num = Convert.ToInt32(CQTnum) - Convert.ToInt32(WBTnum);

                            }

                            string st_wheres = " and QB_State=1";//试题状态

                            st_wheres += " and (QB_AddOperator=" + UserId + " or QB_Kind=1)";

                            st_wheres += " and QB_Type=" + Type + "";
                            if (SelQuestonBQName !=""&& SelQuestonBQName !=null)
                            {
                                st_wheres += " and QB_Custom1 in (" + SelQuestonBQName + ")";
                            }
                          

                            //首先 判断是否存在抽取未被使用的//////////////////////////////////////////////
                            if (nonum > 0)
                            {
                                string wheresTo = " and QuestionBId not in (select EP_QBId from tb_HB_ExaminationPapers)";
                                //先抽取未被使用的个数题，未被使用条件参数//////////////////////////////////////////////////
                                sqlstr += AddPaPerCalculation(NPid, nonum, st_wheres + wheresTo, TScore);

                                //再抽使用了题，使用过条件参数//////////////////////////////////////////////////////////////////
                                wheresTo = " and QuestionBId  in (select EP_QBId from tb_HB_ExaminationPapers)";
                                DataTable dt = commonbll.GetListDatatable("QuestionBId", "tb_HB_QuestionBank", st_wheres + wheresTo);
                                //计算剩余重复题是否满足随机抽取的
                                if (num > dt.Rows.Count)//不满足就一顿乱抽取
                                {
                                    //实际随机抽取数量，无抽取限制（使用被使用）
                                    sqlstr = AddPaPerCalculation(NPid, num, st_wheres, TScore);

                                }
                                else
                                {
                                    //满足继续/////////////实际随机抽取数量，已经使用过的题条件////////////////////////////////////////////////
                                    sqlstr += AddPaPerCalculation(NPid, num, st_wheres + wheresTo, TScore);
                                }
                            }
                            else
                            {
                                ///////////当前题型没有抽取未被使用，全部随机抽取/////////////////////////////////////////
                                //实际随机抽取数量，无抽取限制（使用被使用）
                                sqlstr += AddPaPerCalculation(NPid, num, st_wheres, TScore);
                            }

                        }
                    }
                    var n = sqlstr;
                    SqlHelper.ExecuteNonQuery(n);
                    return "1";
                }
                catch
                {
                    return "99";
                }
            }
            else
            {
                return "99";
            }
        }


        /// <summary>
        /// 货币知识 智能组卷共用方法
        /// </summary>
        /// <param name="NPid">试卷Id</param>
        /// <param name="num">随机抽取</param>
        /// <param name="st_wheres">条件</param>
        /// <param name="TScore">分值</param>
        /// <returns></returns>
        public string AddPaPerCalculation(string NPid, int num, string st_wheres, string TScore)
        {
            string sqlstr = "";
            DataTable dt = commonbll.GetListDatatable("QuestionBId", "tb_HB_QuestionBank", st_wheres);
            if (dt.Rows.Count > 0)
            {
                ArrayList arrP = new ArrayList();//init arrP;//题库中题目的ID号组
                for (int f = 0; f < dt.Rows.Count; f++)
                {
                    arrP.Add(dt.Rows[f]["QuestionBId"].ToString()); //得到该题型下所有试题

                }
                //该题下随机抽取
                ArrayList arrT = new ArrayList();
                Random rand = new Random();
                int j = 0;
                while (j < num)
                {
                    int index = rand.Next(0, Convert.ToInt32(dt.Rows.Count));
                    if (!arrT.Contains(arrP[index])) //不重复
                    {
                        arrT.Add(arrP[index]);
                        j++;
                    }
                }
                //////////////抽取结束/拼接////////////////////////
                for (int m = 0; m < arrT.Count; m++)
                {
                    //验证该题是否已经加入过了
                    var checkcountTo = commonbll.GetRecordCount("tb_HB_ExaminationPapers", " and EP_PId='" + NPid + "' and EP_QBId='" + arrT[m] + "'");
                    if (checkcountTo == 0)
                    {
                        sqlstr += @"insert into tb_HB_ExaminationPapers values('" + NPid + "','" + arrT[m] + "','" + TScore + "','" + UserId + "','" + UserId + "','" + DateTime.Now + "',null,'" + UserNo + "',null);";
                    }
                }


            }
            return sqlstr;

        }

    }
}
