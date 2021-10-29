using Dy_SimulatedBank.App_Start;
using Dy_SimulatedBank.Filters;
using Dy_SimulatedBank.Models;
using Dy_SimulatedBank_Bll;
using Dy_SimulatedBank_DBUtility.Sql;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Controllers
{
    [SystemLoginVerification]
    public class BaseController : Controller
    {
        CommonBll commonbll = new CommonBll();
        LoggerHelper log = new LoggerHelper();

        public BaseController()
        {
            ViewBag.Title = ConfigurationManager.AppSettings["title"].ToString();
        }

        #region 分页
        /// <summary>
        /// 分页  
        /// </summary>
        /// <typeparam name="TModel">类型</typeparam>
        /// <param name="total">总共条数</param>
        /// <param name="pageIndex">当前页</param>
        /// <param name="model">IEnumerable<TModel></param>
        /// <returns></returns>
        protected JsonResult JsonResultPagedList(int total, int pageIndex, int PageSize, string Html)
        {
            PageListModel m = new PageListModel();
            m.Total = total;
            m.PageIndex = pageIndex;
            m.PageTotal = total % PageSize == 0 ? (total / PageSize) : (total / PageSize) + 1;
            m.PageSize = PageSize;
            m.TableHTML = Html;
            JsonResult json = new JsonResult();
            json.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            json.Data = m;
            return json;
        }
        /// <summary>
        /// 分页  
        /// </summary>
        /// <typeparam name="TModel">类型</typeparam>
        /// <param name="total">总共条数</param>
        /// <param name="pageIndex">当前页</param>
        /// <param name="model">IEnumerable<TModel></param>
        /// <returns></returns>
        protected JsonResult JsonResultPagedList(int total, int pageIndex, int PageSize, DataTable tb)
        {
            PageListModel m = new PageListModel();
            m.Total = total;
            m.PageIndex = pageIndex;
            m.PageTotal = total % PageSize == 0 ? (total / PageSize) : (total / PageSize) + 1;
            m.PageSize = PageSize;
            m.Tb = tb;
            JsonResult json = new JsonResult();
            json.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            json.Data = m;
            return json;
        }
        /// 分页  
        /// </summary>
        /// <typeparam name="TModel">类型</typeparam>
        /// <param name="total">总共条数</param>
        /// <param name="pageIndex">当前页</param>
        /// <param name="model">IEnumerable<TModel></param>
        /// <returns></returns>
        protected PageListModel JsonResultPagedLists(int total, int pageIndex, int PageSize, DataTable tb)
        {
            PageListModel m = new PageListModel();
            m.Total = total;
            m.PageIndex = pageIndex;
            m.PageTotal = total % PageSize == 0 ? (total / PageSize) : (total / PageSize) + 1;
            m.PageSize = PageSize;
            m.Tb = tb;

            return m;
        }
        /// <summary>
        /// 返回
        /// </summary>
        /// <typeparam name="TModel"></typeparam> 
        /// <returns></returns>
        protected JsonResult PhotosJsonResult<TModel>(IEnumerable<TModel> model)
        {
            JsonResult json = new JsonResult();
            json.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            json.Data = model;
            return json;
        }

        protected DataTable PrepareActionResultPageSize(int totalRecode, int pageIndex, int PageSize, DataTable data)
        {
            ViewBag.Total = totalRecode;
            ViewBag.PageIndex = pageIndex;
            ViewBag.PageTotal = totalRecode % PageSize == 0 ? (totalRecode / PageSize) : (totalRecode / PageSize) + 1;
            return data;
        }


        protected JsonResult PrepareJsonResultPageSize<TModel>(int totalRecode, int pageIndex, int PageSize, IEnumerable<TModel> model, object groups = null)
        {
            var data = new
            {
                Total = totalRecode,
                PageIndex = pageIndex,
                PageTotal = totalRecode % PageSize == 0 ? (totalRecode / PageSize) : (totalRecode / PageSize) + 1,
                Data = model,
                Groups = groups,
            };

            JsonResult json = new JsonResult();
            json.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            json.Data = data;

            return json;

            //return Json(data, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region 字典

        #endregion

        #region 防sql注入

        /// <summary>
        /// 防sql注入
        /// </summary>
        /// <param name="inputString">参数</param>
        /// <returns></returns>
        public bool ProcessSqlStr(string inputString)
        {
            string SqlStr = @"and|or|exec|execute|insert|select|delete|update|alter|create|drop|count|\*|chr|char|asc|mid|substring|master|truncate|declare|xp_cmdshell|restore|backup|net +user|net +localgroup +administrators";
            try
            {
                if ((inputString != null) && (inputString != String.Empty))
                {
                    string str_Regex = @"\b(" + SqlStr + @")\b";

                    Regex Regex = new Regex(str_Regex, RegexOptions.IgnoreCase);
                    //string s = Regex.Match(inputString).Value; 
                    if (true == Regex.IsMatch(inputString))
                        return false;

                }
            }
            catch
            {
                return false;
            }
            return true;
        }

        #endregion

        #region 是否相同的记录

        public bool GetCount(string tab, string where)
        {
            int Result = commonbll.GetRecordCount(tab, where);
            if (Result > 0)
            {
                return true;
            }
            else
            {
                return false;
            }

        }

        #endregion


        #region 防止重复提交
        /// <summary>
        /// 防止重复提交:false 重复提交
        /// </summary>
        /// <returns></returns>
        public bool IsTimeStamp()
        {
            DateTime timeStamp;

            if (Session["TimeStamp"] != null)
            {
                DateTime.TryParse(Session["TimeStamp"].ToString(), out timeStamp);
                TimeSpan ts = DateTime.Now - timeStamp;

                if (ts.TotalMilliseconds < 500)
                {
                    return false;
                }
            }
            Session["TimeStamp"] = DateTime.Now;

            return true;
        }

        #endregion


        #region 导出excel
        [HttpPost]
        public ActionResult ExportExcelHelp(FormCollection form, string FileName)
        {
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            sb.Append("<html xmlns:x=\"urn:schemas-microsoft-com:office:excel\">");
            sb.Append(" <head>");
            sb.Append(" <!--[if gte mso 9]><xml>");
            sb.Append("<x:ExcelWorkbook>");
            sb.Append("<x:ExcelWorksheets>");
            sb.Append("<x:ExcelWorksheet>");
            sb.Append("<x:Name></x:Name>");
            sb.Append("<x:WorksheetOptions>");
            sb.Append("<x:Print>");
            sb.Append("<x:ValidPrinterInfo />");
            sb.Append(" </x:Print>");
            sb.Append("</x:WorksheetOptions>");
            sb.Append("</x:ExcelWorksheet>");
            sb.Append("</x:ExcelWorksheets>");
            sb.Append("</x:ExcelWorkbook>");
            sb.Append("</xml>");
            sb.Append("<![endif]-->");
            sb.Append(" </head>");
            sb.Append("<body>");

            string htmlt = "</body></html>";
            string strHtml = sb + form["hHtml"] + htmlt;

            strHtml = HttpUtility.HtmlDecode(strHtml);//Html解码 

            byte[] b = System.Text.Encoding.UTF8.GetBytes(strHtml);//字串转byte阵列 

            return File(b, "application/vnd.ms-excel", FileName + "[" + DateTime.Now.ToString("yyyy/MM/dd") + "].xls");//输出档案给Client端
        }
        #endregion

        #region 公用方法
        public CommonBll Base_Common()
        {
            CommonBll commonbll = new CommonBll();
            return commonbll;
        }


        /// <summary>
        /// 学校下拉
        /// </summary>
        /// <returns></returns>
        public string SchoolList()
        {
            DataTable dt = commonbll.GetListDatatable("S_ID,SchoolName", "tb_School", "");
            return JsonConvert.SerializeObject(dt);
        }
        /// <summary>
        /// 学院下拉
        /// </summary>
        /// <returns></returns>
        public string CollegeList()
        {
            string S_ID = Request["S_ID"];
            if (string.IsNullOrEmpty(S_ID))
            {
                S_ID = "0";
            }
            DataTable dt = commonbll.GetListDatatable("C_ID,CollegeName", "tb_College", " and SchoolId=" + S_ID);
            return JsonConvert.SerializeObject(dt);
        }



        /// <summary>
        /// 是否必填
        /// </summary>
        /// <returns></returns>
        public string ISRequired()
        {
            string FormId = Request["FormId"];
            var dt = commonbll.GetListDatatable("*", "bsi_FormItem", " and FormId='" + FormId + "' and ISRequired=1");
            return JsonConvert.SerializeObject(dt);

        }

        /// <summary>
        /// 读取任务案例 描述
        /// </summary>
        /// <returns></returns>
        public string GetTaskInfo()
        {
            string TaskId = Request["TaskId"];
            var dt = commonbll.GetListDatatable("*", "bsi_Task", " and ID=" + TaskId);
            return JsonConvert.SerializeObject(dt);
        }



        /// <summary>
        /// 页面数据反显
        /// </summary>
        /// <returns></returns>
        public string GetQuery()
        {
            try
            {
                string FormId = Request["FormId"];
                string ExamId = Request["ExamId"];
                string TaskId = Request["TaskId"];
                string TRId = Request["TRId"];

                string bsi_Name = "bsi_" + FormId + " a ";
                StringBuilder str = new StringBuilder();

                str.Append(" and TRId=" + TRId + " and TaskId=" + TaskId + " and ExamId=" + ExamId + " and FormId='" + FormId + "'");
                DataTable dt = commonbll.GetListDatatable("a.*,(select top 1 b.ControlName from bsi_FormItem b where b.ID=a.FormItemId) as FormItemStr ", bsi_Name, str.ToString());
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }



        /// <summary>
        /// 后台表单关键字答案读取反显
        /// </summary>
        /// <returns></returns>
        public string GetQueryThree()
        {
            try
            {
                string FormId = Request["FormId"];
                string TaskId = Request["TaskId"];//任务id
                string CustomerId = Request["CustomerId"];//客户id
                string bsi_Name = "bsi_KeyAnswer a ";
                StringBuilder str = new StringBuilder();

                str.Append($" and TaskId={TaskId} and FormId='{FormId}' and  CustomerId = {CustomerId}");
                DataTable dt = commonbll.GetListDatatable("a.*,(select top 1 b.ControlName from bsi_FormItem b where b.ID=a.FormItemId) as FormItemStr ", bsi_Name, str.ToString());
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        /// <summary>
        /// 表单关键字答案学生操作答案读取反显
        /// </summary>
        /// <returns></returns>
        public string GetQueryStuOperation()
        {
            try
            {
                string TRId = Request["TRId"];
                string FormId = Request["FormId"];
                string TaskId = Request["TaskId"];//任务id
                string CustomerId = Request["CustomerId"];//客户id

                var sql = $@"select a.StudentAnswer as SingleAnswer,b.ControlName as FormItemStr from
  (select * from bsi_{FormId} where TRId ={TRId} and TasKId ={TaskId} and CustomerId = {CustomerId} and UserId ={UserId}) a 
  join bsi_FormItem b on a.FormItemId = b.ID";

                var dt = SqlHelper.ExecuteDataTable(sql);
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }


        //各个场景对应的环节编号
        int[] StartLinks = new int[] { 1 };
        int[] HallLinks = new int[] { 2, 3, 4, 5, 6, 16 };
        int[] CounterLinks = new int[] { 7, 9, 10, 11, 12, 133, 134, 15 }; //8,单据收取  14，返还资料 只有单操作  13 打印没有计分项
        int[] EndLinks = new int[] { 17 };

        /// <summary>
        /// 根据案例id获取案例总分
        /// </summary>
        /// <param name="taskid"></param>
        /// <returns></returns>
        public int GetTaskTotalScores(string taskid)
        {

            int scores = 0;
            var num = commonbll.GetRecordCount("bsi_TaskDetail", $" and TaskId={taskid} and Status = 1");
            if (num < 1)
            {
                num = 1;
            }
            return num;

            /*
            var taskDt = commonbll.GetListDatatable("StartScene,HallScene,CounterScene,EndScene", "bsi_Task", $"ID = {taskid}");
            var StartScene = int.Parse(taskDt.Rows[0]["StartScene "].ToString());
            var HallScene = int.Parse(taskDt.Rows[0]["HallScene "].ToString());
            var CounterScene = int.Parse(taskDt.Rows[0]["CounterScene "].ToString());
            var EndScene = int.Parse(taskDt.Rows[0]["EndScene "].ToString());

            var linksList = new List<int>();
            if (StartScene == 1) {
                linksList.AddRange(StartLinks);
            }
            if (HallScene == 1)
            {
                linksList.AddRange(HallLinks);
            }
            if (CounterScene == 1)
            {
                linksList.AddRange(CounterLinks);
            }
            if (EndScene == 1)
            {
                linksList.AddRange(EndLinks);
            }
            var linksString = "-1";
            if (linksList.Count > 0) {
                linksString = string.Join(",", linksList);
            }


            int formCount = 0;//表单个数
            formCount = commonbll.GetRecordCount("bsi_TaskFormRelation", $"TaskId = {taskid} and Types in ({linksString})");
            int inquiryCount = 0;//质询个数
            inquiryCount = commonbll.GetRecordCount("bsi_TaskCustomerInquiry", $"TaskId = {taskid} and LinkNumber in ({linksString})");


            var customerDt = commonbll.GetListDatatable("ID,CustomerName,BusinessType,BusinessId", "bsi_TaskCustomer", $"TaskId = {taskid}");
            int operateCount = 0;//操作个数
            foreach (DataRow item in customerDt.Rows)
            {
                var customerId = item["ID"];
                var BusinessType = item["BusinessType"];

                var businessFormRelationDt = commonbll.GetListDatatable("*", "bsi_BusinessFormRelation", $"CustomerId = {customerId}");

                if (HallScene == 1)
                {
                    //02接待
                    operateCount++;
                    //03取号
                    operateCount++;
                    //04取号后引导
                    operateCount++;
                    if ( !(businessFormRelationDt.Rows[0]["Names_4"] is DBNull) && businessFormRelationDt.Rows[0]["Names_4"].ToString() == "填写单据")
                    {
                        //05填单  填单选取
                        operateCount++;
                        //06填单后引导
                        operateCount++;
                    }
                    
                    if (!(businessFormRelationDt.Rows[0]["Names_16"] is DBNull) && businessFormRelationDt.Rows[0]["Names_16"].ToString() != "0")
                    {
                        //16营销转介
                        operateCount++;
                    }
                    //16送别
                    operateCount++;
                }
                if (CounterScene == 1)
                {
                    //07接待
                    operateCount++;
                    //08单据收取
                    operateCount++;
                    //09资料收取与校验
                    operateCount++;
                    //10柜员填单
                    if (!(businessFormRelationDt.Rows[0]["ShowAmount"] is DBNull))
                    {
                        //11现金处理
                        operateCount++;
                    }
                    //12业务办理
                    //13单据盖章与签字
                    //14返还资料
                    operateCount++;
                    if (!(businessFormRelationDt.Rows[0]["Names_15"] is DBNull) && businessFormRelationDt.Rows[0]["Names_15"].ToString() != "0")
                    {
                        //15营销转介
                        operateCount++;
                    }
                    //15送别
                    operateCount++;

                }


            }

            scores = formCount + inquiryCount + operateCount;
            */


            scores = commonbll.GetRecordCount("bsi_TaskDetail", $" and TaskId = {taskid} and Status = 1");


            return scores;
        }

        /// <summary>
        /// 根据案例 顾客 环节 操作 获取正确答案
        /// </summary>
        /// <returns></returns>
        public string GetRightKey(string bsi_TaskDetail)
        {
            string ret = "xxx";



            return ret;
        }




        /// <summary>
        /// 提交之前校验
        /// </summary>
        /// <returns></returns>
        public string BeforeSubmitCheck(string TRId, string ExamId, string TaskId, string LinkId, string CustomerId)
        {

            //return "";//暂时不校验

            //1.如果是考试模式 是否已经提交
            //2.如果是考试模式 是否在当前考试时间内
            //if (ExamId != "0")
            //{
            //首先校验是否已经提交过




            var trDt = commonbll.GetListDatatable("Tstate,Grouping_ID", "bsi_TotalResult", $" and ExamId={ExamId}  and UserId={UserId}");
            DataTable edt = commonbll.GetListDatatable("*", "bsi_PracticeAssessment", " and ID=" + ExamId);
            if (edt.Rows.Count > 0)
            {
                if (edt.Rows[0]["Type_All"].ToString() == "1")
                {
                    DateTime StartTime = Convert.ToDateTime(edt.Rows[0]["PracticeStarTime"]);//考试开始时间
                    int MinLen = Convert.ToInt32(edt.Rows[0]["PracticeLong"].ToString());//考试结束时间


                    //实际结束 大于当前时间  考试时间已经过了
                    if (DateTime.Now > StartTime.AddMinutes(MinLen))
                    {
                        //AddExamination();
                        return "77";
                    }
                }

                if (trDt.Rows.Count > 0 && trDt.Rows[0]["Tstate"].ToString() == "2" && edt.Rows[0]["Type_All"].ToString() == "1")//已经提交过了
                {
                    return "88";
                }
            }
            //}


            var customerList = commonbll.GetListDatatable("BusinessType,BusinessId", "bsi_TaskCustomer", $" and ID = {CustomerId}");
            var BusinessType = "";
            if (customerList.Rows.Count > 0)
            {
                BusinessType = customerList.Rows[0]["BusinessType"].ToString();
            }
            if (trDt.Rows.Count > 0 && trDt.Rows[0]["Grouping_ID"] != DBNull.Value && trDt.Rows[0]["Grouping_ID"].ToString() != "0")//团队模式
            {

                var totalResultTaskList = commonbll.GetListDatatable("b.PositionName", "bsi_TotalResultTask a join bsi_TeamPosition b on a.File_ID = b.ID", $" and a.TRId = {TRId} and a.TaskId={TaskId} and a.UserId={UserId}");
                if (totalResultTaskList.Rows.Count == 0)
                {
                    return "66";
                }
                var sublink = int.Parse(GetSubLinkByLinkId(int.Parse(LinkId)));
                if (totalResultTaskList.Rows[0]["PositionName"].ToString() == "大堂经理")
                {
                    if (sublink == 2 || sublink == 3 || sublink == 4 || sublink == 5 || sublink == 6 || sublink == 16)
                    {

                    }
                    else
                    {
                        return "66";
                    }
                }
                else if (totalResultTaskList.Rows[0]["PositionName"].ToString() == "高柜柜员")
                {
                    if (BusinessType == "对公业务")
                    {
                        return "66";
                    }
                    if (sublink == 1 || sublink == 17 || sublink == 7 || sublink == 8 || sublink == 9 || sublink == 10 || sublink == 11 || sublink == 12 || sublink == 13 || sublink == 14 || sublink == 15)
                    {

                    }
                    else
                    {
                        return "66";
                    }
                }
                else if (totalResultTaskList.Rows[0]["PositionName"].ToString() == "低柜柜员")
                {
                    if (BusinessType == "零售业务")
                    {
                        return "66";
                    }
                    if (sublink == 7 || sublink == 8 || sublink == 9 || sublink == 10 || sublink == 11 || sublink == 12 || sublink == 13 || sublink == 14 || sublink == 15)
                    {

                    }
                    else
                    {
                        return "66";
                    }
                }
                else
                {
                    return "66";
                }


            }

            return "";
        }





        /// <summary>
        /// 更新记录表
        /// </summary>
        /// <returns></returns>
        public string AfterSubmitUpdateRecord(string TRId, string ExamId, string TaskId, string CustomerId, string LinkId, string StuOperationalAnswers)
        {



            var dt = commonbll.GetListDatatable("ID,LinkId", "bsi_TaskCustomerRecord", $" and TRId={TRId} and ExamId = {ExamId} and TaskID={TaskId} and CustomerId={CustomerId}");
            var tcrId = "0";
            if (dt.Rows.Count > 0)
            {
                tcrId = dt.Rows[0]["ID"].ToString();
            }
            else
            {
                tcrId = commonbll.AddIdentity("bsi_TaskCustomerRecord", "TRId,ExamId,TaskId,CustomerId,LinkId,UserId,Satisfaction,CompletionOrNot,AddUserId,AddTime",
                    $"'{TRId}','{ExamId}','{TaskId}','{CustomerId}','{LinkId}','{UserId}','100','0',{UserId},GetDate()", null).ToString();
            }

            if (LinkId == "91" || LinkId == "92")
            {
                return "";
            }
            //因为物品栏关系 暂时不做保存环节设置
            //if (LinkId == "10" || LinkId == "11" || LinkId == "12" || LinkId == "13" || LinkId == "133" || LinkId == "134" || LinkId == "14")
            //{
            //    return "";
            //}
            var updateSql = $" LinkId={LinkId}";
            if (LinkId == "161")
            {
                updateSql += ",CompletionOrNot=1";
            }
            commonbll.UpdateInfo("bsi_TaskCustomerRecord", updateSql, $" and ID={tcrId}");

            if (LinkId == "14")
            {//资料返还需要移除物品栏对应物品
                var stuAnswerList = StuOperationalAnswers.Split(',').ToList();

                var delSql = "";
                foreach (var item in stuAnswerList)
                {
                    if (item.Length == 0) continue;
                    delSql += $"delete from bsi_TaskCustomerInventory where CustomerRecordId = {tcrId} and ItemValue = '{item}';";
                }

                if (delSql.Length > 0)
                {
                    commonbll.ExecuteNonQuery(delSql);
                }

            }






            return "";
        }


        /// <summary>
        /// 提交完成之后后续操作
        /// </summary>
        /// <returns></returns>
        public string AfterSubmitOperation(string TRId, string ExamId, string TaskId, string TaskDetailId, decimal score, int hasDoRecordCount)
        {
            if (score <= 0 || hasDoRecordCount > 0) return "";
            DataTable tdt = commonbll.GetListDatatable("*", "bsi_Task", " and ID=" + TaskId);
            if (tdt.Rows.Count == 0)
            {
                return "";
            }

            if (tdt.Rows[0]["IsAccessibility"].ToString() != "1") //获取能力关闭
            {
                return "";
            }

            //理论上来说可以不管能力值上限 这里值插记录表，统计表会控制上限
            DataTable cdt = commonbll.GetListDatatable("a.AbilityId,a.AbilityScores,a.TaskDetailId,b.AbilityName,b.AbilityUpperLimit", "bsi_CaseCapabilityScore a join bsi_CapabilityModel b on a.AbilityId = b.ID", " and TaskDetailId=" + TaskDetailId);
            if (cdt.Rows.Count == 0)
            {
                return "";
            }

            StringBuilder sb = new StringBuilder();

            for (int i = 0; i < cdt.Rows.Count; i++)
            {
                var AbilityId = cdt.Rows[i]["AbilityId"].ToString();
                var StuScore = cdt.Rows[i]["AbilityScores"].ToString();
                var EventInfo = "xxxx";//通过任务明细组事件字符串 待定

                var record = commonbll.GetRecordCount("bsi_StuAbilityScore", $" and TRId = {TRId} and  PracticeId = {ExamId} and TaskId = {TaskId} and TaskDetailId = {TaskDetailId} and AbilityId = {AbilityId} and UserId = {UserId}");
                if (record == 0)
                {
                    sb.Append($@"insert into bsi_StuAbilityScore(TRId,PracticeId,TaskId,TaskDetailId,AbilityId,StuScore,EventInfo,UserId,AddUserId,AddTime) values({TRId},{ExamId},{TaskId},{TaskDetailId},{AbilityId},'{StuScore}','{EventInfo}',{UserId},{UserId},GETDATE());");
                }

            }

            if (sb.Length > 0)
            {
                commonbll.ExecuteNonQuery(sb.ToString());
            }


            return "";
        }

        /// <summary>
        /// 学生端表单提交
        /// </summary>
        /// <param name="FormId">表单ID</param>
        /// <param name="ExamId">考试ID</param>
        /// <param name="TaskId">任务ID</param>
        /// <param name="TRId">主表成绩ID</param>
        /// <returns></returns>
        public string Submission()
        {
            try
            {
                string Types = Request["Types"].ToString(); // 1操作类 2表单 3质询
                string FormId = Request["FormId"];
                string ExamId = Request["ExamId"].ToString();
                string TaskId = Request["TaskId"].ToString();
                string TRId = Request["TRId"].ToString();
                string CustomerId = Request["CustomerId"].ToString();//客户id
                string LinkId = Request["LinkId"].ToString();//环节id
                string mid = Request["TRId"].ToString();

                var OperationName = "业务办理"; //Request["OperationName"];
                var StuOperationalAnswers = Request["StuOperationalAnswers"];
                var verificationSuccessful = Request["verificationSuccessful"];

                if (TaskId == "")
                {
                    return "99";
                }

                var retStr = BeforeSubmitCheck(TRId, ExamId, TaskId, LinkId, CustomerId);
                if (!string.IsNullOrEmpty(retStr))
                {
                    return retStr;
                }




                //var recordTb = commonbll.GetListDatatable("*", "bsi_TaskCustomerRecord", $"  and ExamId={ExamId}");
                //if (recordTb.Rows.Count > 0)
                //{
                //    if (recordTb.Rows[0]["CompletionOrNot"].ToString() == "1")
                //    {
                //        return "99"; //当前客户已完成
                //    }

                //    var linkold = int.Parse(recordTb.Rows[0]["LinkId"].ToString());
                //    var linknew = int.Parse(LinkId);

                //    var sublinkold = int.Parse(GetSubLinkByLinkId_(linkold));
                //    var sublinknew = int.Parse(GetSubLinkByLinkId_(linknew));

                //    if (sublinknew < sublinkold)//环节不能倒退
                //    {
                //        //扣满意度 -1
                //        //commonbll.UpdateInfo("bsi_TaskCustomerRecord", " Satisfaction = Satisfaction - 1", $" and ID={recordTb.Rows[0]["ID"]} and Satisfaction>=1");
                //        return "98";
                //    }


                //}

                //var TRTId = "";
                //var totalResultTaskList = commonbll.GetListDatatable("*", "bsi_TotalResultTask", $" and TRId = {TRId} and TaskId={TaskId} and UserId={UserId}");
                //if (totalResultTaskList.Rows.Count > 0)
                //{
                //    TRTId = totalResultTaskList.Rows[0]["ID"].ToString();
                //}
                //else
                //{
                //    TRTId = commonbll.AddIdentity("bsi_TotalResultTask", "TRId,TaskId,Scores,Tstate,UserId,AddUserId,AddTime,UpdateTime",
                //        $"{TRId},{TaskId},'0',0,{UserId},{UserId},GETDATE(),GETDATE()", null).ToString();
                //}


                decimal Scores = 0m;

                var TaskDetailId = "";

                var hasDoRecordCount = 0;

                //验证是否开启任务
                if (Types != "1")
                {
                    if (Request.UrlReferrer.ToString().IndexOf("review") < 0)
                    {
                        var tdtd2 = commonbll.GetListDatatable("*", "zhyw_ExamCurrentTask as a", $" and '" + FormId + "' in (select FormId from  bsi_TaskDetail where TaskId=a.TaskId and CustomerId=" + mid + ") and TaskId=" + TaskId + " and ExamId=" + ExamId + " and USID=" + UserId);
                        if (tdtd2.Rows.Count == 0) return "97"; // 操作类不验证任务开启
                    }
                }


                if (Types == "1")
                {
                    var tdtd = commonbll.GetListDatatable("*", "bsi_TaskDetail", $" and TaskId={TaskId} and LinkId={LinkId} and CustomerId={CustomerId} and Types = {Types} and OperationName='{OperationName}'");
                    if (tdtd.Rows.Count == 0) return "1"; // 操作类不验证任务开启
                    TaskDetailId = tdtd.Rows[0]["ID"].ToString();
                    var Answer = tdtd.Rows[0]["Answer"].ToString();

                    if (LinkId == "15" || LinkId == "16")//营销转介环节答案特别处理
                    {
                        var strAnswerList = StuOperationalAnswers.Split(',');
                        var productId = strAnswerList[0];
                        var quyuName = strAnswerList[1];

                        var productTd = commonbll.GetListDatatable("*", "bsi_ProductSettings", $" and ID in (${productId},${Answer})");

                        var AnswerRow = productTd.AsEnumerable().Where(p => p.Field<int>("ID") == int.Parse(Answer)).First();
                        Answer = AnswerRow.Field<string>("ProductName") + "," + AnswerRow.Field<string>("TaskDescribe");
                        var stuAnswerRow = productTd.AsEnumerable().Where(p => p.Field<int>("ID") == int.Parse(productId)).First();
                        StuOperationalAnswers = stuAnswerRow.Field<string>("ProductName") + "," + quyuName;
                    }


                    Scores = 0;

                    if (LinkId == "5" || LinkId == "8" || LinkId == "91" || LinkId == "92" || LinkId == "14")//这些环节操作的答案是表单号用 , 隔开，顺序对不上也能得分  需要重新排序
                    {
                        if (LinkId == "5")
                        {
                            return "1";
                        }

                        var answerList = Answer.Split(',').ToList();
                        var stuAnswerList = StuOperationalAnswers.Split(',').ToList();
                        answerList.Sort();
                        stuAnswerList.Sort();
                        if (Enumerable.SequenceEqual(answerList, stuAnswerList))
                        {
                            Scores = 1;
                        }
                        else
                        {
                            Scores = 0;
                        }

                    }
                    else
                    {
                        if (StuOperationalAnswers == Answer)
                        {
                            Scores = 1;
                        }
                    }
                }
                else
                if (Types == "2")
                {
                    DataTable tdtd;
                    if (LinkId == "99")
                    {
                        tdtd = commonbll.GetListDatatable("*", "bsi_TaskDetail", $" and TaskId={TaskId} and LinkId=5 and CustomerId={CustomerId} and Types = 1 and FormId={FormId}");
                    }
                    else
                    {
                        tdtd = commonbll.GetListDatatable("*", "bsi_TaskDetail", $" and TaskId={TaskId} and LinkId={LinkId} and Types = {Types} and FormId={FormId} and CustomerId=" + CustomerId);
                    }
                    if (tdtd.Rows.Count == 0) return "1";
                    TaskDetailId = tdtd.Rows[0]["ID"].ToString();

                    if (LinkId == "5")//填单5 虽然是表单 但是和其它表单处理不同  它是勾选
                    {
                        //获取关键字集合
                        DataTable Itemlist = GetFormItemList(FormId);
                        StringBuilder str = new StringBuilder();
                        Scores = 1; 
                    }
                    else if (LinkId == "91" || LinkId == "133" || LinkId == "134")//身份证校验,签字，盖章 虽然是表单 但是类似于操作
                    {
                        var Answer = tdtd.Rows[0]["Answer"].ToString();

                        Scores = 0;
                        if (LinkId == "133")//这些环节操作的答案是表单号用 , 隔开，顺序对不上也能得分  需要重新排序
                        {
                            var answerList = Answer.Split(',').ToList();
                            var stuAnswerList = StuOperationalAnswers.Split(',').ToList();
                            answerList.Sort();
                            stuAnswerList.Sort();
                            if (Enumerable.SequenceEqual(answerList, stuAnswerList))
                            {
                                Scores = 1;
                            }
                            else
                            {
                                Scores = 0;
                            }
                        }
                        else
                        {
                            if (StuOperationalAnswers == Answer)
                            {
                                Scores = 1;
                            }
                        }

                        if (LinkId == "133" || LinkId == "134")
                        {
                            var StuAnswersOtherInfo = Request["StuAnswersOtherInfo"];
                            if (!string.IsNullOrEmpty(StuAnswersOtherInfo))
                            {
                                Scores = 0;
                                StuOperationalAnswers = StuOperationalAnswers + ";" + StuAnswersOtherInfo;
                            }

                        }

                        //只保留第一次做题操作 后续只判对错 不计分
                        //hasDoRecordCount = commonbll.GetRecordCount("bsi_TotalResultDetailed", " and TRTId=" + TRTId + " and TaskDetailId=" + TaskDetailId + " and UserId=" + UserId);
                        //if (hasDoRecordCount == 0)
                        //{
                        //    var strsql = @" insert into bsi_TotalResultDetailed(TRTId, TaskDetailId, Scores,RightKey,StuOperationalAnswers, UserId, AddUserId, AddTime) 
                        //values(" + TRTId + ", " + TaskDetailId + ", '" + Scores + "','" + Answer + "','" + StuOperationalAnswers + "'," + UserId + ", " + UserId + ",GETDATE())";

                        //    commonbll.ExecuteNonQuery(strsql);
                        //}

                        //删除之前的
                        //string strsql = @"delete from bsi_TotalResultDetailed where TRTId=" + TRTId + " and TaskDetailId=" + TaskDetailId + " and UserId=" + UserId;
                        ////存入学生成绩表
                        //strsql += @" insert into bsi_TotalResultDetailed(TRTId, TaskDetailId, Scores,RightKey,StuOperationalAnswers, UserId, AddUserId, AddTime) 
                        //values(" + TRTId + ", " + TaskDetailId + ", '" + Scores + "','" + Answer + "','" + StuOperationalAnswers + "'," + UserId + ", " + UserId + ",GETDATE())";

                        //commonbll.ExecuteNonQuery(strsql);
                    }
                    else  //一般表单处理
                    {
                        bool yzbz = true;
                        if (string.IsNullOrEmpty(Request["yzBz"]))
                        {
                            yzbz = false;
                        }
                        //获取关键字集合
                        DataTable Itemlist = GetFormItemList(FormId);
                        List<KeyAnswerModel> list = GetKeyAnswerList(FormId, TaskId, CustomerId, yzbz);

                        StringBuilder str = new StringBuilder();
                        string bsi_Name = "bsi_" + FormId;
                        int YesScores = 0;//正确个数

                        var fillinName = new List<string>();
                        var stufillinName = new List<string>();

                        str.Append(" delete from " + bsi_Name + " where  TaskId=" + TaskId + " and ExamId=" + ExamId + " and FormId='" + FormId + "'");
                        //删除描述记录

                        List<string> recondList = new List<string>();
                        List<string> logList = new List<string>();
                        int myRequest = 0;
                        foreach (DataRow item in Itemlist.Rows)
                        {
                            int Id = Convert.ToInt32(item["ID"].ToString());
                            string ControlName = item["ControlName"].ToString();
                            string keyName = item["Title"].ToString().Replace("s", "");
                            keyName = keyName.IndexOf('_') > -1 ? keyName.Split('_')[0] : keyName;
                            var m = list.Where(x => x.FormItemId == Id).ToList();
                            string SingleAnswer = "";//关键字答案
                            if (m != null && m.Count > 0)
                            {
                                SingleAnswer = m[0].SingleAnswer;//获取关键字答案
                            }

                            string StudentAnswer = Request[ControlName] ?? "";//循环得到页面form 内容
                            string ISOK = "未知";

                            if (!string.IsNullOrEmpty(StudentAnswer) && !string.IsNullOrWhiteSpace(StudentAnswer))
                            {
                                myRequest++;
                            }

                            if (!string.IsNullOrEmpty(SingleAnswer) && SingleAnswer.Trim().Length > 0)
                            {
                                fillinName.Add(SingleAnswer);
                                stufillinName.Add(StudentAnswer);
                                string trueAnswer = SingleAnswer;
                                string trueStuAnswer = StudentAnswer;
                                if (StudentAnswer.IndexOf('-') >= 0)
                                {
                                    StudentAnswer = StudentAnswer.Split('-')[0];
                                }
                                if (SingleAnswer.IndexOf('-') >= 0)
                                {
                                    SingleAnswer = SingleAnswer.Split('-')[0];
                                }
                                if (ControlName.ToLower().IndexOf("money_") > -1)
                                {
                                    SingleAnswer = SingleAnswer.Replace(",", "");
                                    StudentAnswer = StudentAnswer.Replace(",", "");
                                }
                                decimal aOut = 0m;
                                bool isPrice = decimal.TryParse(StudentAnswer, out aOut) && decimal.TryParse(SingleAnswer, out aOut) ? decimal.Parse(StudentAnswer) == decimal.Parse(SingleAnswer) : false;
                                //开放性字段单独处理
                                if ((!string.IsNullOrEmpty(StudentAnswer) && (StudentAnswer.Trim() == SingleAnswer.Trim() || isPrice)) || SingleAnswer.Trim() == "*")
                                {
                                    ISOK = "正确";
                                    YesScores++;
                                    recondList.Add(keyName + ":[" + trueAnswer + "]");
                                    logList.Add(keyName + ":" + trueStuAnswer + "");
                                }
                                else
                                {
                                    ISOK = "错误";
                                    if (FormId == "080707" && (ControlName == "mon_ey_lb" || ControlName == "money_z" || ControlName == "money_je"))
                                    {
                                        YesScores++;
                                        recondList.Add(keyName + ":[" + trueAnswer + "]");
                                    }
                                    else
                                    {
                                        recondList.Add(keyName + ":{" + trueAnswer + "}(学生答案：" + trueStuAnswer + ")");
                                    }
                                    logList.Add(keyName + ":" + trueStuAnswer + "");
                                }
                            }

                            //显存入实体表 010101
                            str.Append(" insert into ").Append(bsi_Name);
                            str.Append("(TRId,TaskId,ExamId,CustomerId,FormId,FormItemId,StudentAnswer,ISOK,UserId,AddUserId,AddTime)");
                            str.Append(" values(" + TRId + "," + TaskId + "," + ExamId + "," + CustomerId + ",'" + FormId + "'," + Id + ",'" + StudentAnswer.Replace(",", "") + "','" + ISOK + "'," + UserId + "," + UserId + ",GETDATE())");


                        }
                        var r = commonbll.ExecuteNonQuery(str.ToString());
                        decimal trueScore = tdtd.Rows[0]["Score"] != null && tdtd.Rows[0]["Score"].ToString() != "" ? decimal.Parse(tdtd.Rows[0]["Score"].ToString()) : 0;
                        if (r > 0)
                        {


                            //正确个数/答案个数
                            Scores = 0;
                            if (YesScores > 0 && YesScores == list.Count) //全对得1分
                            {
                                Scores = tdtd.Rows[0]["Score"] != null && tdtd.Rows[0]["Score"].ToString() != "" ? decimal.Parse(tdtd.Rows[0]["Score"].ToString()) : 0;
                            }
                            //删除之前的
                            //        string strsql = @"delete from bsi_TotalResultDetailed where TRTId=" + TRTId + " and TaskDetailId=" + TaskDetailId + " and UserId=" + UserId;
                            //        //存入学生成绩表
                            //        strsql += @" insert into bsi_TotalResultDetailed(TRTId, TaskDetailId, Scores,RightKey,StuOperationalAnswers, UserId, AddUserId, AddTime) 
                            //values(" + TRTId + ", " + TaskDetailId + ", '" + Scores + "','" + string.Join(",", fillinName) + "','" + string.Join(",", stufillinName) + "'," + UserId + ", " + UserId + ",GETDATE())";

                            //commonbll.ExecuteNonQuery(strsql);

                            var dtTM = commonbll.GetListDatatable("TMName", "bsi_TM", $" and TMNO='" + FormId + "'");
                            if (myRequest > 0)
                            {
                                commonbll.ExecuteNonQuery("delete from tb_TaskResultDesc where TaskId=" + TaskId + " and FormId='" + FormId + "' and  ExamId='" + ExamId + "' and CustomerId=" + UserId + " and oldcustomerId=" + CustomerId);
                                //插入做题记录
                                string descSql = "insert into [tb_TaskResultDesc]([TaskId],[TaskName],[FormId],[CustomerId],[TRId],[ExamId],[SysName],[SysDesc],[AddDate],Score,trueScore,oldCustomerId) " +
                                    "values(" + TaskId + ",'" + dtTM.Rows[0]["TMName"] + "','" + FormId + "'," + UserId + ",0," + ExamId + ",'','" + string.Join(",", recondList) + "',getdate()," + Scores + "," + trueScore + "," + CustomerId + ")";
                                commonbll.ExecuteNonQuery(descSql);
                                //插入操作日志
                                string descSql1 = "insert into [zhyw_ExamLog]([USID],[ExamId],[TaskId],[TMNO],[LogDate],[Remark],TellerId) " +
                                   "values(" + UserId + "," + ExamId + "," + TaskId + ",'" + FormId + "',getdate(),'" + (dtTM.Rows[0]["TMName"] + "|" + string.Join(";", logList)) + "'," + CustomerId + ")";
                                commonbll.ExecuteNonQuery(descSql1);
                            }

                            #region 处理总分

                            SqlHelper.ExecuteNonQuery("delete from bsi_TotalResult where ExamId=" + ExamId + " and UserId=" + UserId);
                            SqlHelper.ExecuteNonQuery("delete from bsi_TotalResultTask where TaskId in (select TaskId from bsi_PracticeTasks where id=" + ExamId + ") and UserId=" + UserId);


                            var dtScore = SqlHelper.ExecuteDataTable("select * from tb_TaskResultDesc where CustomerId=" + UserId + "  and  ExamId=" + ExamId + " order by TaskId");
                            List<string> taskList = new List<string>();
                            if (dtScore != null && dtScore.Rows.Count > 0)
                            {
                                string taskid = "";
                                decimal score = 0m;
                                int index = 0;
                                foreach (DataRow dr in dtScore.Rows)
                                {
                                    if (taskid != dr["TaskId"].ToString())
                                    {
                                        if (index != 0)
                                        {
                                            taskList.Add(taskid + "|" + score);
                                        }
                                        taskid = dr["TaskId"].ToString();
                                        score = 0m;
                                    }
                                    if (taskid == dr["TaskId"].ToString())
                                    {
                                        score += decimal.Parse(dr["Score"].ToString());
                                    }
                                    index++;
                                    if (index == dtScore.Rows.Count)
                                    {
                                        taskList.Add(taskid + "|" + score);
                                    }
                                }
                            }
                            if (taskList != null && taskList.Count > 0)
                            {
                                var dto = SqlHelper.ExecuteDataTable("select * from bsi_PracticeAssessment where id=" + ExamId);
                                decimal sumScore = taskList.Sum(s => decimal.Parse(s.Split('|')[1]));
                                var sqlResult = SqlHelper.ExecuteSclar("INSERT INTO [bsi_TotalResult]([ExamId],[Scores],[Tstate],[UserId],[Type_All],[Grouping_ID],[File_ID],[UpdateTime],[AddTime],[AddUserId]) output inserted.Id VALUES(" + ExamId + "," + sumScore + ",1," + UserId + "," + dto.Rows[0]["Type_All"].ToString() + ",0,0,getdate(),getdate()," + UserId + ")");
                                int trid = int.Parse(sqlResult.ToString());
                                foreach (string s in taskList)
                                {

                                    SqlHelper.ExecuteNonQuery("INSERT INTO [bsi_TotalResultTask]([TRId],[TaskId],[Scores],[Tstate],[UserId],[AddUserId],[AddTime],[UpdateTime],[File_ID])  VALUES(" + trid + "," + (s.Split('|')[0]) + "," + (s.Split('|')[1]) + ",1," + UserId + "," + UserId + ",getdate(),getdate(),0)");
                                }
                            }
                            #endregion
                        }
                        log.Info("做题答案：IP=" + Request.UserHostAddress + "|userid=" + UserId + "|LoginNo=" + UserNo + "|FormID=" + FormId + "|Answer:" + string.Join(",", recondList));
                    }


                    LinkId = LinkId == "99" ? "5" : LinkId;

                }
                else if (Types == "3")
                {
                    var InquiryId = Request["InquiryId"];
                    var tdtd = commonbll.GetListDatatable("*", "bsi_TaskDetail", $" and TaskId={TaskId}  and CustomerId={CustomerId} and Types = {Types} and OperationName='{OperationName}' and InquiryId = {InquiryId}");
                    if (tdtd.Rows.Count == 0) return "1"; // --操作类不验证任务开启
                    TaskDetailId = tdtd.Rows[0]["ID"].ToString();


                    var tcitd = commonbll.GetListDatatable("*", "bsi_TaskCustomerInquiry", $"  and ID = {InquiryId}");
                    if (tcitd.Rows.Count == 0) return "1"; // --操作类不验证任务开启
                    var Answer = tcitd.Rows[0]["RightKey"].ToString();


                    Scores = 0;

                    if (StuOperationalAnswers == Answer)
                    {
                        Scores = 1;
                    }


                    //只保留第一次做题操作 后续只判对错 不计分
                    //hasDoRecordCount = commonbll.GetRecordCount("bsi_TotalResultDetailed", " and TRTId=" + TRTId + " and TaskDetailId=" + TaskDetailId + " and UserId=" + UserId);
                    //if (hasDoRecordCount == 0)
                    //{
                    //    var strsql = @" insert into bsi_TotalResultDetailed(TRTId, TaskDetailId, Scores,RightKey,StuOperationalAnswers, UserId, AddUserId, AddTime) 
                    //values(" + TRTId + ", " + TaskDetailId + ", '" + Scores + "','" + Answer + "','" + StuOperationalAnswers + "'," + UserId + ", " + UserId + ",GETDATE())";

                    //    commonbll.ExecuteNonQuery(strsql);
                    //}

                    ////删除之前的
                    //string strsql = @"delete from bsi_TotalResultDetailed where TRTId=" + TRTId + " and TaskDetailId=" + TaskDetailId + " and UserId=" + UserId;
                    ////存入学生成绩表
                    //strsql += @" insert into bsi_TotalResultDetailed(TRTId, TaskDetailId, Scores,RightKey,StuOperationalAnswers, UserId, AddUserId, AddTime) 
                    //values(" + TRTId + ", " + TaskDetailId + ", '" + Scores + "','" + Answer + "','" + StuOperationalAnswers + "'," + UserId + ", " + UserId + ",GETDATE())";

                    //commonbll.ExecuteNonQuery(strsql);

                }


                //更新成绩主表 及 成绩案例表
                var totalScores = GetTaskTotalScores(TaskId);
                //var curScores = commonbll.GetListSclar("sum(Scores)", "bsi_TotalResultDetailed", $" and TRTId={TRTId}");
                //var sqlStr1 = $@"update bsi_TotalResultTask 
                //                set Scores = ISNULL((select sum(Scores) from bsi_TotalResultDetailed where TRTId = {TRTId}),0) * 200.0 /{totalScores},
                //                UpdateTime = getdate()
                //                where ID = {TRTId};";
                //sqlStr1 += $@"update bsi_TotalResult 
                //                set Scores = ISNULL((select sum(Scores) from bsi_TotalResultTask where TRId = {TRId}),0) + ISNULL((select SUM(AdditionScores) from bsi_TaskCustomerRecord where TRId={TRId}),0),
                //                UpdateTime = getdate()
                //                where ID = {TRId};";
                //commonbll.ExecuteNonQuery(sqlStr1);


                //更新顾客记录表
                AfterSubmitUpdateRecord(TRId, ExamId, TaskId, CustomerId, LinkId, StuOperationalAnswers);



                //提交完成之后后续操作
                AfterSubmitOperation(TRId, ExamId, TaskId, TaskDetailId, Scores, hasDoRecordCount);


                DataTable edt = commonbll.GetListDatatable("*", "bsi_PracticeAssessment", " and ID=" + ExamId);
                if (edt.Rows.Count > 0)
                {
                    if (edt.Rows[0]["Type_All"].ToString() == "2" || edt.Rows[0]["Type_All"].ToString() == "3")//练习模式 教学模式
                    {
                        if (Scores == 0 && Types != "2")
                        {//做错
                            return edt.Rows[0]["Type_All"].ToString(); //返回 2或者3 表示前端需要重做
                        }
                    }
                }

                return "1";

            }
            catch (Exception ex)
            {
                return ex.ToString();
            }

            //返回0 失败
#pragma warning disable CS0162 // 检测到无法访问的代码
            return "0";
#pragma warning restore CS0162 // 检测到无法访问的代码
        }



        /// <summary>
        /// 后台关键字答案保存
        /// </summary>
        /// <returns></returns>
        public string BackstagePreservation()
        {
            try
            {
                string TaskId = Request["TaskId"].ToString();
                string FormId = Request["FormId"].ToString();
                string CustomerId = Request["CustomerId"].ToString();//客户id
                string Types = Request["Types"].ToString();//环节编号
                //获取关键字集合
                DataTable Itemlist = GetFormItemList(FormId);
                List<KeyAnswerModel> list = GetKeyAnswerList(FormId, TaskId, CustomerId, false);
                StringBuilder str = new StringBuilder();
                //先删除
                commonbll.DeleteInfo("bsi_KeyAnswer", " and TaskId=" + TaskId + " and FormId='" + FormId + "' and CustomerId=" + CustomerId);

                if (Itemlist.Rows.Count == 0)
                {
                    return "22";
                }

                foreach (DataRow item in Itemlist.Rows)
                {
                    int Id = Convert.ToInt32(item["ID"].ToString());
                    string ControlName = item["ControlName"].ToString();

                    string SingleAnswer = Request[ControlName];//循环得到页面form 内容

                    if (!string.IsNullOrEmpty(SingleAnswer) && SingleAnswer.Trim().Length > 0)
                    {
                        //是否已经存在
                        //存入关键字答案表
                        str.Append(" insert into bsi_KeyAnswer");
                        str.Append("(TaskId, CustomerId,FormId, FormItemId, SingleAnswer, AddUserId, AddTime)");
                        str.Append(" values(" + TaskId + "," + CustomerId + ",'" + FormId + "'," + Id + ",'" + SingleAnswer.Replace(",","") + "'," + UserId + ",GETDATE())");

                    }

                }

                if (str.Length > 0)
                {
                    commonbll.ExecuteNonQuery(str.ToString());

                    //存储多条实操设置表
                    //string strsql = "delete from bsi_TaskFormRelation where TaskId=" + TaskId + " and CustomerId=" + CustomerId + " and Types='" + Types + "' and FormId='" + FormId + "'";
                    //strsql += @" insert into bsi_TaskFormRelation(TaskId, CustomerId, Types, FormId, AddUserId, AddTime) values('" + TaskId + "','" + CustomerId
                    //   + "','" + Types + "','" + FormId + "','" + UserId + "',getdate())";
                    //commonbll.ExecuteNonQuery(strsql);
                }
                return "1";


            }
            catch (Exception ex)
            {
                return ex.ToString();
            }

        }


        /// <summary>
        /// 获取关键字答案集合
        /// </summary>
        /// <returns></returns>
        public List<KeyAnswerModel> GetKeyAnswerList(string FormId, string TaskId, string CustomerId, bool yzbz)
        {
            string wheres = $"and TaskId={TaskId} and FormId='{FormId}' and CustomerId=" + CustomerId;
            //if (yzbz)
            //{
            //    wheres += $" and IsTagging=1";
            //}
            DataTable dt = commonbll.GetListDatatable("*", "bsi_KeyAnswer", wheres);
            var list = ConvertTo<KeyAnswerModel>(dt).ToList();
            return list;
        }
        /// <summary>
        /// 获取关键字集合
        /// </summary>
        /// <returns></returns>
        public DataTable GetFormItemList(string FormId)
        {
            DataTable dt = commonbll.GetListDatatable("*", "bsi_FormItem", " and FormId='" + FormId + "'");
            return dt;
        }

        /// <summary>
        /// 查询字典
        /// </summary>
        /// <returns></returns>
        public string getselect()
        {
            var action = Request["action"];

            DataTable dt = commonbll.GetListDatatable("Dic_Name,Dic_Value", "bsi_Data_Dic", " and Class_Code='" + action + "'");

            return JsonConvert.SerializeObject(dt);

        }




        #endregion

        #region   DataTable 转 List
        /// <summary>
        /// DataTable 转 List
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="table"></param>
        /// <returns></returns>
        public static IList<T> ConvertTo<T>(DataTable table)
        {
            if (table == null)
            {
                return null;
            }

            List<DataRow> rows = new List<DataRow>();

            foreach (DataRow row in table.Rows)
            {
                rows.Add(row);
            }

            return ConvertTo<T>(rows);
        }


        public static IList<T> ConvertTo<T>(IList<DataRow> rows)
        {
            IList<T> list = null;

            if (rows != null)
            {
                list = new List<T>();

                foreach (DataRow row in rows)
                {
                    T item = CreateItem<T>(row);
                    list.Add(item);
                }
            }

            return list;
        }

        public static T CreateItem<T>(DataRow row)
        {
            T obj = default(T);
            if (row != null)
            {
                obj = Activator.CreateInstance<T>();

                foreach (DataColumn column in row.Table.Columns)
                {
                    PropertyInfo prop = obj.GetType().GetProperty(column.ColumnName);
                    try
                    {
                        object value = row[column.ColumnName];
                        prop.SetValue(obj, value, null);
                    }
                    catch
                    {  //You can log something here     
                        //throw;    
                    }
                }
            }

            return obj;
        }

        #endregion


        #region session实体
        /// <summary>
        /// 考试Id
        /// </summary>
        public int ExamId
        {
            get
            {
                if (this.Session["Exam_ID"] != null)
                {
                    return Convert.ToInt32(this.Session["Exam_ID"].ToString());
                }
                else
                {
                    return 0;
                }

            }
        }
        ////投保单号
        //public string InsureSingleNumber
        //{
        //    get
        //    {
        //        return this.Session["InsureSingleNumber"].ToString();//;
        //    }
        //}

        ////客户编号
        //public string CustomerNumber
        //{
        //    get
        //    {
        //        return this.Session["CustomerNumber"].ToString();//;
        //    }
        //}

        /// <summary>
        /// 分组Id
        /// </summary>
        public int Grouping_ID
        {
            get
            {
                if (this.Session["Grouping_ID"] != null)
                {
                    return Convert.ToInt32(this.Session["Grouping_ID"].ToString());
                }
                else
                {
                    return 0;
                }
            }
        }


        /// <summary>
        /// 模式类型 1 比赛 2练习 3教学
        /// </summary>
        public int Type_All
        {
            get
            {
                if (this.Session["Type_All"] != null)
                {
                    return Convert.ToInt32(this.Session["Type_All"].ToString());
                }
                else
                {
                    return 1;
                }
            }
        }

        /// <summary>
        /// 后台
        /// </summary>
        public int Type_All_Admin
        {
            get
            {
                if (this.Session["Type_All_Admin"] != null)
                {
                    return Convert.ToInt32(this.Session["Type_All_Admin"].ToString());
                }
                else
                {
                    return 1;
                }
            }
        }

        /// <summary>
        /// 存档Id
        /// </summary>
        public int File_ID
        {
            get
            {
                if (this.Session["File_ID"] != null)
                {
                    return Convert.ToInt32(this.Session["File_ID"].ToString());
                }
                else
                {
                    return 0;
                }
            }
        }

        /// <summary>
        /// 任务ID
        /// </summary>
        public int Base_TaskId
        {
            get
            {
                if (this.Session["TaskId"] != null)
                {
                    return Convert.ToInt32(this.Session["TaskId"].ToString());
                }
                else
                {
                    return 1;
                }
            }
        }

        /// <summary>
        /// 用户类型
        /// </summary>
        public int UserType
        {
            get
            {
                return Convert.ToInt32(this.Session["UserType"].ToString());
            }
        }
        /// <summary>
        /// 用户Id
        /// </summary>
        public int UserId
        {
            get
            {
                return Convert.ToInt32(this.Session["UserId"].ToString());

            }
        }
        /// <summary>
        /// 用户UserNo
        /// </summary>
        public string UserNo
        {
            get
            {
                return this.Session["UserNo"].ToString();
            }
        }
        /// <summary>
        /// 班级
        /// </summary>
        public string ClassId
        {
            get
            {
                //var m = this.Session["UserInfo"] as UserModel;
                //return m.Teller_No;
                return this.Session["ClassId"].ToString();
            }
        }

        /// <summary>
        /// 用户姓名
        /// </summary>
        public string StuName
        {
            get
            {
                //var m = this.Session["UserInfo"] as UserModel;
                //return m.Teller_No;
                return this.Session["StuName"].ToString();
            }
        }

        /// <summary>
        /// 用户学校编号
        /// </summary>
        public string UserSchoolNo
        {
            get
            {
                return this.Session["USchool"].ToString();
            }
        }
        ///// <summary>
        ///// 用户实体
        ///// </summary>
        //public UserModel Base_UserInfo
        //{
        //    get
        //    {
        //        return this.Session["UserInfo"] as UserModel;
        //    }
        //}

        /// <summary>
        /// 教师id
        /// </summary>
        public string TeacherId
        {
            get
            {
                var TeacherId = SqlHelper.ExecuteSclar($"select TeacherId from tb_Class where C_ID={ClassId}");
                return TeacherId.ToString();
            }
        }

        /// <summary>
        /// 所属班级id
        /// </summary>
        public string SubBankId
        {
            get
            {
                return "0";
            }
        }

        /// <summary>
        /// 部门Id
        /// </summary>
        public int DepartmentId
        {
            get
            {
                return 0;
            }
        }
        /// <summary>
        /// 用户编号
        /// </summary>
        public string Teller_No
        {
            get
            {
                return "0";
            }
        }

        #endregion


        #region 其他
        /// <summary>
        /// 获取枚举变量值的 Description 属性
        /// </summary>
        /// <param name="obj">枚举变量</param>
        /// <param name="isTop">是否改变为返回该类、枚举类型的头 Description 属性，而不是当前的属性或枚举变量值的 Description 属性</param>
        /// <returns>如果包含 Description 属性，则返回 Description 属性的值，否则返回枚举变量值的名称</returns>
        public static string GetDescription(object obj)
        {
            bool isTop = false;
            if (obj == null)
            {
                return string.Empty;
            }
            try
            {
                Type _enumType = obj.GetType();
                DescriptionAttribute dna = null;
                if (isTop)
                {
                    dna = (DescriptionAttribute)Attribute.GetCustomAttribute(_enumType, typeof(DescriptionAttribute));
                }
                else
                {
                    FieldInfo fi = _enumType.GetField(Enum.GetName(_enumType, obj));
                    dna = (DescriptionAttribute)Attribute.GetCustomAttribute(
                       fi, typeof(DescriptionAttribute));
                }
                if (dna != null && string.IsNullOrEmpty(dna.Description) == false)
                    return dna.Description;
            }
            catch
            {
            }
            return obj.ToString();
        }

        ///// <summary>
        ///// 短信模版内容
        ///// </summary>
        ///// <param name="TContent">模板内容</param>
        ///// <param name="Content">短信参数值</param>
        ///// <returns>完整短信内容</returns>
        //public static string ShowShortContent(string TContent, string Content)
        //{
        //    string Str = "";

        //    //解析json
        //    SendSMS sms = Common.JsonDeserialize<SendSMS>(Content);
        //    PropertyInfo[] properties = sms.GetType().GetProperties();
        //    //替换字段  得到字段的数量 逐个替换
        //    foreach (PropertyInfo p in properties)
        //    {
        //        // Console.WriteLine("Name:{0} ", p.Name, p.GetValue(sms, null));
        //        string name = p.Name;
        //        string value = "";
        //        try
        //        {
        //            value = p.GetValue(sms, null).ToString();
        //        }
        //        catch { }
        //        TContent = TContent.Replace("${" + name.ToLower() + "}", value);
        //    }
        //    Str = TContent;
        //    return Str;
        //}

        ///// <summary>
        ///// 订单短信发送情况
        ///// </summary>
        ///// <param name="OrderNO">订单号</param>
        ///// <returns>0 没有失败信息， 1 有失败信息</returns>
        //public static int SmsState(string OrderNO)
        //{
        //    int num = 0;
        //    try
        //    {
        //        DataTable tb = Shove._Web.Cache.GetCacheAsDataTable("ASDFGHJKLDQW");

        //        string select = "select * from tb_shortmessage where OrderNO='" + OrderNO + "' ";
        //        if (tb == null || !string.IsNullOrEmpty(select))
        //        {
        //            tb = MySQL.Select(select.ToString());

        //            Shove._Web.Cache.SetCache("ASDFGHJKLDQW", tb);
        //        }
        //        foreach (DataRow item in tb.Rows)
        //        {
        //            num = 0;
        //            ShortmessageModel m = new ShortmessageModel();
        //            m.Id = Int32.Parse(item["Id"].ToString());
        //            if (Int32.Parse(item["State"].ToString()) == 3)
        //            {
        //                num++;
        //            }
        //            if (Int32.Parse(item["State"].ToString()) == 2)
        //            {
        //                num = -1;
        //                break;
        //            }
        //        }
        //    }
        //    catch { }
        //    return num;
        //}

        ///// <summary>
        ///// 得到发送短信条数
        ///// </summary>
        ///// <param name="count">短信字符数量</param>
        ///// <param name="index">每条短信字符数量</param>
        ///// <returns></returns>
        //public static int Numberlength(int count, int index)
        //{
        //    int scount = 0;
        //    int num1 = count % index;

        //    if (num1 > 0)
        //    {
        //        int num2 = (count - num1) / index;
        //        scount = num2 + 1;
        //    }
        //    else
        //    {
        //        scount = (count - num1) / index;
        //    }
        //    return scount;
        //}
        ///// <summary>
        ///// 修改短信状态
        ///// </summary>
        ///// <param name="OrderNo">订单号</param>
        ///// <returns></returns>
        //public static bool UpdateshortState(string OrderNo)
        //{
        //    bool flag = false;
        //    string str = "update tb_shortmessage set State=0 where  OrderNo='" + OrderNo + "' and State=3;";
        //    var tb = Shove.Database.MySQL.ExecuteNonQuery(str);
        //    if (tb >= 0)
        //    {
        //        flag = true;
        //    }
        //    return flag;
        //}
        #endregion


        /// <summary>
        /// 退出后台
        /// </summary>
        public void PostUserClear()
        {
            Session.Abandon();
            Session.Clear();
            Response.Redirect("/Login");
        }

        /// <summary>
        /// 保存文件
        /// </summary>
        /// <param name="file">文件</param>
        /// <param name="catalog">路径</param>
        /// <param name="fileName">md值</param>
        /// <returns>文件的相对路径，可存进数据库</returns>
        public static string SaveImage(HttpPostedFileBase file, string catalog, string fileName)
        {
            if (file.ContentLength != 0)
            {
                string absolutePath = System.Web.HttpContext.Current.Server.MapPath(catalog);
                string fileExten = Path.GetExtension(file.FileName);
                fileName += fileExten;
                string fullAbsolutePath = Path.Combine(absolutePath, fileName);
                file.SaveAs(fullAbsolutePath);
                return catalog + fileName;
            }
            return null;
        }

        protected PageListModel JsonResultPagedListsNew(int total, int pageIndex, int PageSize, DataTable tb)
        {
            PageListModel m = new PageListModel();
            m.Total = total;
            m.PageIndex = pageIndex;
            m.PageTotal = total % PageSize == 0 ? (total / PageSize) : (total / PageSize) + 1;
            m.PageSize = PageSize;
            m.Tb = tb;

            return m;
        }

        /// <summary>
        /// 替换常用特殊字符
        /// </summary>
        /// <param name="Parameter"></param>
        /// <returns></returns>
        public string SQLSafe(string Parameter)
        {

            Parameter = Parameter.Replace("'", "");
            Parameter = Parameter.Replace(">", "");
            Parameter = Parameter.Replace("<", "");
            Parameter = Parameter.Replace("\\", "");
            return Parameter;
        }


        #region  任务明细表增删改操作  
        //暂时只迁徙 数据获取到basecontroller

        public string GetSceneByLinkId(int linkId)
        {
            var sceneId = "0";
            //1开工 
            //3.取号，4.取号后引导，5.填单，6.填单后引导 16厅堂送别
            //8，单据收取 9，证件收取与校验（91.身份证 92非身份证） 10 柜员填单 11.现金处理 12业务办理，13 需要打印的单据,133盖章位置,134签字 14返还资料 15柜台送别
            //17完工
            var scene1 = new List<int>() { 1 };
            var scene2 = new List<int>() { 2, 3, 4, 5, 6, 16, 17, 161, 20 };
            var scene3 = new List<int>() { 7, 8, 9, 91, 92, 10, 11, 12, 13, 133, 134, 14, 15, 151 };
            var scene4 = new List<int>() { 17 };

            var allScene = new Dictionary<string, List<int>>();
            allScene.Add("1", scene1);
            allScene.Add("2", scene2);
            allScene.Add("3", scene3);
            allScene.Add("4", scene4);

            foreach (var item in allScene)
            {
                if (item.Value.Contains(linkId))
                {
                    sceneId = item.Key;
                }
            }

            return sceneId;
        }

        public string GetSubLinkByLinkId(int linkId)
        {
            var subLinkId = linkId;
            //1开工 
            //3.取号，4.取号后引导，5.填单，6.填单后引导 16厅堂送别
            //8，单据收取 9，证件收取与校验（91.身份证 92非身份证） 10 柜员填单 11.现金处理 12业务办理，13 需要打印的单据,133盖章位置,134签字 14返还资料 15柜台送别
            //17完工
            if (subLinkId == 91 || subLinkId == 92)
            {
                subLinkId = 9;
            }
            else if (subLinkId == 133 || subLinkId == 134)
            {
                subLinkId = 13;
            }
            else if (subLinkId == 151)
            {
                subLinkId = 15;
            }
            else if (subLinkId == 161)
            {
                subLinkId = 16;
            }
            else if (subLinkId == 20)
            {
                subLinkId = 20;
            }
            return subLinkId.ToString();
        }

        public string GetSubLinkByLinkId_(int linkId)
        {
            var subLinkId = linkId;
            //1开工 
            //3.取号，4.取号后引导，5.填单，6.填单后引导 16厅堂送别
            //8，单据收取 9，证件收取与校验（91.身份证 92非身份证） 10 柜员填单 11.现金处理 12业务办理，13 需要打印的单据,133盖章位置,134签字 14返还资料 15柜台送别
            //17完工
            if (subLinkId == 91 || subLinkId == 92)
            {
                subLinkId = 9;
            }
            else if (subLinkId == 133 || subLinkId == 134)
            {
                subLinkId = 13;
            }
            else if (subLinkId == 151)
            {
                subLinkId = 15;
            }
            else if (subLinkId == 161)
            {
                subLinkId = 16;
            }
            else if (subLinkId == 20)
            {
                subLinkId = 2;
            }
            return subLinkId.ToString();
        }


        #endregion



    }
}
