using Dy_SimulatedBank_Bll;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Controllers
{
    public class GetDefaultValueController : BaseController
    {
        //
        // GET: /GetDefaultValue/获取表单默认值
        CommonBll commBll = new CommonBll();
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 获取默认值
        /// </summary>
        /// <returns></returns>
        public string GetDefaultValueForFormItem()
        {
            //formid, examid, userid, siteid, prev_formid
            string msg = "ok:0";
            string formid = Request["Formid"];
            string examid = Request["Examid"];
            string siteid = Request["Siteid"];
            string prev_formid = Request["prev_formid"];
            string taskid = Request["Taskid"];
            string haveShouQuan = "0";
            string examResultTaskDetailSQL = "";
            string sql_task = "SELECT [Id],[Key_Ids],TM_No ,[Key_Names],[Score],KeyPMKY,KeyWordId,KeyWordName,KeyType,DefaultValue,isnull(ShowDefaultC,'') ShowDefaultC,isnull(FromTMNO,'') FromTMNO,isnull(FromDefaultC,'') FromDefaultC,isnull(type,'') type,isnull(errormsg,'') errormsg,busiName,sysname FROM [dbo].V_TaskInfo where Task_Id=" + taskid + " and (TM_No='" + formid + "' or TM_No='010001') order by TM_No desc";
            string detailFirst = "INSERT INTO zhyw_ExamResultTaskDetail(DetailsId,ExamResultTaskId,KeyWordId,AnswerRight,IfTrue,QuestionAnswer,ListMethod,haveScore,formName,SysName,formid)VALUES(";
            if (formid == "010001")
            {
                sql_task = "SELECT [Id],[Key_Ids],TM_No ,[Key_Names],[Score],KeyPMKY,KeyWordId,KeyWordName,KeyType,DefaultValue,isnull(ShowDefaultC,'') ShowDefaultC,isnull(FromTMNO,'') FromTMNO,isnull(FromDefaultC,'') FromDefaultC,isnull(type,'') type,isnull(errormsg,'') errormsg,busiName,sysname FROM [dbo].V_TaskInfo where Task_Id=" + taskid + " and (TM_No='" + formid + "' or TM_No='010001') and Key_Ids like '%" + prev_formid + "%' order by TM_No desc";
            }
            DataTable dt = commBll.GetListDatatable(sql_task);
            if (dt.Rows.Count > 0) // 没有开启当前页面的任务
            {
                // 取出关键字和答案:score:分数,控件名1:答案,控件名2:答案证件类型:身份证,证件号码:622584199008162438
                var taskinfolist = "";
                string key_Names = dt.Rows[0]["key_Names"].ToString();
                string[] keyNameArray = key_Names.Split(',');
                int score = 0;
                string detailsId = dt.Rows[0]["Id"].ToString();
                string keydefaultValue = dt.Rows[0]["DefaultValue"].ToString();
                string sysname = dt.Rows[0]["sysname"].ToString();
                string formName = dt.Rows[0]["busiName"].ToString();
                score = Convert.ToInt32(dt.Rows[0]["Score"]);
                // 快查判断字段
                var findData = dt.Rows[0]["ShowDefaultC"] + ";" + dt.Rows[0]["FromTMNO"] + ";" + dt.Rows[0]["FromDefaultC"] + ";" + dt.Rows[0]["type"] + ";" + dt.Rows[0]["errormsg"];
                string oldkeyName = "";
                var index = 0;
                for (var i = 0; i < dt.Rows.Count; i++)
                {
                    string keyWordId = dt.Rows[i]["KeyWordId"].ToString();
                    string Tm_No = dt.Rows[i]["TM_No"].ToString().Trim();
                    if (formid != Tm_No)
                    {
                        haveShouQuan = "1";
                        continue;
                    }
                    var keyPMKY = dt.Rows[i]["KeyPMKY"];
                    string keyWordName = dt.Rows[i]["KeyWordName"].ToString();

                    if (oldkeyName == keyWordName)
                    {
                        continue;
                    }
                    // 找到控件名和答案
                    for (var m = 0; m < keyNameArray.Length; m++)
                    {
                        var nameValue = keyNameArray[m].Split(':');
                        if (nameValue[0] == keyWordName)
                        {
                            if (nameValue.Length > 1)
                            {

                                if (taskinfolist == "")
                                {
                                    taskinfolist = keyPMKY + "#" + nameValue[1]; //加上KeyWordName+"#" + KeyWordName 
                                }
                                else
                                {
                                    taskinfolist = taskinfolist + "," + keyPMKY + "#" + nameValue[1]; //加上KeyWordName+"#" + KeyWordName 
                                }

                                //  拼接明细SQL
                                if (i == 0)
                                {
                                    examResultTaskDetailSQL = examResultTaskDetailSQL + detailFirst + detailsId + ",'**ExamResultTaskId','" + keyWordId + "','" + nameValue[1] + "','" + index + "true" + index +
                                        "','" + index + "QuestionAnswer" + index + "','zhyw_ExamResultTaskDetail_1_" + index + "',score**,'" + formName + "','" + sysname + "','" + formid + "');";
                                }
                                else
                                {
                                    examResultTaskDetailSQL = examResultTaskDetailSQL + detailFirst + detailsId + ",'**ExamResultTaskId','" + keyWordId + "','" + nameValue[1] + "','" + index + "true" + index +
                                        "','" + index + "QuestionAnswer" + index + "','zhyw_ExamResultTaskDetail_1_" + index + "',0,'" + formName + "','" + sysname + "','" + formid + "');"; //只在第一行存储分数
                                }
                                index++;
                            }
                        }
                    }
                    oldkeyName = keyWordName;
                }
                msg = "ok" + haveShouQuan + ":" + score + ":" + taskinfolist + ":" + examResultTaskDetailSQL + ":" + keydefaultValue + ":" + findData + ":" + detailsId + ":" + formName; //后面加冒号分隔:zhyw_ExamResultTaskDetail的SQL
            }
            else
            {
                msg = "ok:0";
            }

            // var data = { taskid: taskid, msg: msg };
            string returnValue = taskid + "^^" + msg;
            return returnValue;
        }


        /// <summary>
        /// 查找默认定
        /// </summary>
        /// <returns></returns>
        public string GetDefaultValue()
        {
            //select * from dal_DefaultValue where TaskId=180 and  TMNO='065401' and AddUser=189
             string TaskId = Request["TaskId"];
            string TMNO = Request["TMNO"];
            string CustomerId = Request["CustomerId"];
            if (TaskId=="") {
                TaskId = "0";
            }
            string sql = "select * from dal_DefaultValue where TaskId=" + TaskId + " and  TMNO='" + TMNO + "' and (CustomerId=" + CustomerId + " or CustomerId is null)";
            DataTable dt = commBll.GetListDatatable(sql);
            return JsonConvert.SerializeObject(dt);
        }
    }
}
