using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank.Models;
using Dy_SimulatedBank_Bll;
using Dy_SimulatedBank_DBUtility.Sql;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class CustomerConsultationController : BaseController
    {
        CommonBll commBll = new CommonBll();

        /// <summary>
        /// 客户质询设置页面呈现
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            ViewBag.taskid = Request["taskid"];
            GetQuestionLinkCount();
            return View();
        }

        /// <summary>
        /// 获得质询环节各案例各客户的对应类型的质询数量
        /// </summary>
        public string GetQuestionLinkCount()
        {
            var taskid = Request["taskid"]; //案例或者任务id
            var Id = Request["Id"]; //客户Id
            string str = "";
            for (int i = 2; i <= 20; i++)
            {
                var count1 = (int)SqlHelper.ExecuteSclar("SELECT COUNT(1)count1 FROM bsi_TaskCustomerInquiry WHERE CustomerId=" + Id + " AND TaskId=" + taskid + " AND LinkNumber=" + i);

                ViewData["count" + i] = count1;
                str += count1 + ",";
            }

            var Appearance = commBll.GetListSclar("Appearance", "bsi_TaskCustomer", $"and ID = {Id}");
            ViewData["Appearance"] = Appearance;

            return str;
        }

        /// <summary>
        /// 客户列表
        /// </summary>
        /// <returns></returns>
        public string GetList()
        {
            string Keyword = Request["Keyword"];
            var selQuestioning = Request["selQuestioning"];//质询环节
            var id = Request["Id"];//客户id
            var taskid = Request["taskid"];//任务Id
            string wheres = " and 1=1";

            if (!string.IsNullOrEmpty(Keyword))
            {
                wheres += " and CustomerName like '%" + Keyword + "%'";
            }
            if (!string.IsNullOrEmpty(selQuestioning))
            {
                wheres += " and LinkNumber=" + selQuestioning;
            }
            if (!string.IsNullOrEmpty(id))
            {
                wheres += " and CustomerId=" + id;
            }
            if (!string.IsNullOrEmpty(taskid))
            {
                wheres += " and TaskId=" + taskid;
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " SerialNumber "; //排序必须填写
            m.strFld = @" * ";
            m.tab = "bsi_TaskCustomerInquiry";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }

        /// <summary>
        /// 新增
        /// </summary>
        /// <returns></returns>
        public string Add()
        {
            string table = "bsi_TaskCustomerInquiry"; //表名
            string list = " TaskId, CustomerId,LinkNumber, SerialNumber, CustomerQuestion, Recording, Motion,QuestionVideo,QuestionCashAnswer, AddUserId, AddTime";//列
            string vlaue = "@TaskId, @CustomerId,@LinkNumber, @SerialNumber, @CustomerQuestion, @Recording,@Motion,@QuestionVideo,@QuestionCashAnswer,@AddUserId, @AddTime";

            var txtTaskId = Request["txtTaskId"];//任务id
            var txtCustomerId = Request["txtCustomerId"];//客户id
            var txtCustomerQuestion = Request["txtCustomerQuestion"];//客户表达
            var txtMotion = Request["txtMotion"] == "请选择" ? "" : Request["txtMotion"];//表情及动作
            var selQuestioning = Request["selQuestioning"];//质询环节
            var txtQuestionViedo = Request["txtQuestionViedo"];
            var textQuestionCashAnswer = Request["textQuestionCashAnswer"];
            HttpPostedFileBase fileBase = Request.Files["file"];//上传文件
            Random random = new Random();
            int s = random.Next(1000, 9999);
            string rstr = s.ToString().Substring(0, 4);

            var Icon = string.Empty;
            if (fileBase != null)
            {
                Icon = SaveImage(fileBase, "/Images/", DateTime.Now.ToString("yyyyMMddHHmmssffff") + rstr);
            }

            //校验账号是否已存在
            //var count = commBll.GetRecordCount("bsi_TaskCustomerInquiry", " and CustomerName='" + txtCustomerName + "'");
            //if (count > 0)
            //{
            //    return "77";
            //}

            //新增
            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@TaskId",txtTaskId),
                new SqlParameter("@CustomerId",txtCustomerId),
                new SqlParameter("@SerialNumber",GetMaxSortNum()),
                new SqlParameter("@CustomerQuestion",txtCustomerQuestion),
                new SqlParameter("@Recording",Icon),
                new SqlParameter("@Motion",txtMotion),
                new SqlParameter("@QuestionVideo",txtQuestionViedo),
                new SqlParameter("@QuestionCashAnswer",textQuestionCashAnswer),
                new SqlParameter("@AddUserId",UserId),
                new SqlParameter("@AddTime",DateTime.Now),
                new SqlParameter("@LinkNumber",selQuestioning)
            };
            var resultcount = commBll.AddIdentity(table, list, vlaue, pars);
            if (int.Parse(resultcount.ToString()) > 0)
            {
                AddTaskDetailByInquiry(txtTaskId, txtCustomerId, selQuestioning, resultcount.ToString());
                return "1";
            }
            else
            {
                return "99";
            }
        }

        /// <summary>
        /// 返回最大的序号加1
        /// </summary>
        /// <returns></returns>
        public int GetMaxSortNum()
        {
            var customerId = Request["txtCustomerId"];
            var taskid = Request["txtTaskId"];
            var selQuestioning = Request["selQuestioning"];//质询环节

            int Sort = 1;
            DataTable SortDt = commBll.GetListDatatable(" Max(SerialNumber) as SerialNumber", "bsi_TaskCustomerInquiry", " and CustomerId=" + customerId + " and taskid=" + taskid + " and LinkNumber=" + selQuestioning);
            if (SortDt.Rows.Count > 0)
            {
                try
                {
                    Sort = Convert.ToInt32(SortDt.Rows[0]["SerialNumber"].ToString() == "" ? 0 : SortDt.Rows[0]["SerialNumber"]) + 1;
                }
                catch
                {
                    Sort = 1;
                }
            }
            else
            {
                Sort = 0;
            }

            return Sort;
        }

        /// <summary>
        /// 修改
        /// </summary>
        /// <returns></returns>
        public string Update()
        {
            string table = "bsi_TaskCustomerInquiry"; //表名
            string Set = " CustomerQuestion=@CustomerQuestion,QuestionVideo=@QuestionVideo,QuestionCashAnswer=@QuestionCashAnswer,Recording=@Recording, Motion=@Motion ";
            var txtQuestionViedo = Request["txtQuestionViedo"];
            var textQuestionCashAnswer = Request["textQuestionCashAnswer"];
            var txtCustomerQuestion = Request["txtCustomerQuestion"];//客户表达
            var txtMotion = Request["txtMotion"];//表情及动作
            var id = Convert.ToInt32(Request["id"]);

            HttpPostedFileBase fileBase = Request.Files["file"];//上传文件
            Random random = new Random();
            int s = random.Next(1000, 9999);
            string rstr = s.ToString().Substring(0, 4);

            var Icon = string.Empty;
            if (fileBase != null)
            {
                Icon = SaveImage(fileBase, "/Images/", DateTime.Now.ToString("yyyyMMddHHmmssffff") + rstr);
            }
            else
            {
                var dt = commBll.GetListDatatable("*", "bsi_TaskCustomerInquiry", " and ID= " + id);
                if (dt != null && dt.Rows.Count > 0)
                {
                    Icon = dt.Rows[0]["Recording"].ToString();
                }
            }

            //校验账号是否已存在
            //var count = commBll.GetRecordCount("bsi_TaskCustomerInquiry", " and CustomerName='" + txtCustomerName + "' and id!=" + id);
            //if (count > 0)
            //{
            //    return "77";
            //}

            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@ID",id),
                new SqlParameter("@CustomerQuestion",txtCustomerQuestion),
                new SqlParameter("@Recording",Icon),
                new SqlParameter("@QuestionVideo",txtQuestionViedo),
                new SqlParameter("@QuestionCashAnswer",textQuestionCashAnswer),
                new SqlParameter("@Motion",txtMotion),
            };
            var resultcount = commBll.UpdateInfo(table, Set, " and id=@id", pars);
            if (resultcount == 1)
            {
                return "1";
            }
            else
            {
                return "99";
            }
        }

        /// <summary>
        /// 修改设置回答
        /// </summary>
        /// <returns></returns>
        public string UpdateSetupanswers()
        {
            string table = "bsi_TaskCustomerInquiry"; //表名
            string Set = " OptionA=@OptionA, OptionA_Url=@OptionA_Url, OptionB=@OptionB,OptionB_Url=@OptionB_Url,OptionC=@OptionC,OptionC_Url=@OptionC_Url,OptionD=@OptionD,OptionD_Url=@OptionD_Url," +
                "OptionE=@OptionE,OptionE_Url=@OptionE_Url,OptionF=@OptionF,OptionF_Url=@OptionF_Url,Answer=@Answer,Analysis=@Analysis ";
            var chkstr = Request["chkstr"];

            var OptionA = Request["OptionA"];
            var OptionB = Request["OptionB"];
            var OptionC = Request["OptionC"];
            var OptionD = Request["OptionD"];
            var OptionE = Request["OptionE"];
            var OptionF = Request["OptionF"];
            var Answer = Request["Answer"];
            var Analysis = Request["Analysis"];
            var id = Convert.ToInt32(Request["id"]);

            HttpPostedFileBase A = Request.Files["OptionA_Url"];//上传文件
            HttpPostedFileBase B = Request.Files["OptionB_Url"];//上传文件
            HttpPostedFileBase C = Request.Files["OptionC_Url"];//上传文件
            HttpPostedFileBase D = Request.Files["OptionD_Url"];//上传文件
            HttpPostedFileBase E = Request.Files["OptionE_Url"];//上传文件
            HttpPostedFileBase F = Request.Files["OptionF_Url"];//上传文件

            string Pictures_A = null;
            string Pictures_B = null;
            string Pictures_C = null;
            string Pictures_D = null;
            string Pictures_E = null;
            string Pictures_F = null;

            Random random = new Random();
            int s = random.Next(1000, 9999);
            string rstr = s.ToString().Substring(0, 4);

            var A_Url = string.Empty;
            var B_Url = string.Empty;
            var C_Url = string.Empty;
            var D_Url = string.Empty;
            var E_Url = string.Empty;
            var F_Url = string.Empty;
            if (A != null)
            {
                Pictures_A = A.FileName;//接受文件名字
                commBll.UpdateInfo("bsi_TaskCustomerInquiry", "Pictures_A='" + Pictures_A + "'", " and ID=" + id);
                A_Url = SaveImage(A, "/Images/", DateTime.Now.ToString("yyyyMMddHHmmssffff") + rstr);
            }
            else
            {
                var dt = commBll.GetListDatatable("*", "bsi_TaskCustomerInquiry", " and ID= " + id);
                if (dt != null && dt.Rows.Count > 0)
                {
                    A_Url = dt.Rows[0]["Recording"].ToString();
                }
            }

            if (B != null)
            {
                Pictures_B = B.FileName;//接受文件名字
                commBll.UpdateInfo("bsi_TaskCustomerInquiry", "Pictures_B='" + Pictures_B + "'", " and ID=" + id);
                B_Url = SaveImage(B, "/Images/", DateTime.Now.ToString("yyyyMMddHHmmssffff") + rstr);
            }
            else
            {
                var dt = commBll.GetListDatatable("*", "bsi_TaskCustomerInquiry", " and ID= " + id);
                if (dt != null && dt.Rows.Count > 0)
                {
                    B_Url = dt.Rows[0]["Recording"].ToString();
                }
            }

            if (C != null)
            {
                Pictures_C = C.FileName;//接受文件名字
                commBll.UpdateInfo("bsi_TaskCustomerInquiry", "Pictures_C='" + Pictures_C + "'", " and ID=" + id);
                C_Url = SaveImage(C, "/Images/", DateTime.Now.ToString("yyyyMMddHHmmssffff") + rstr);
            }
            else
            {
                var dt = commBll.GetListDatatable("*", "bsi_TaskCustomerInquiry", " and ID= " + id);
                if (dt != null && dt.Rows.Count > 0)
                {
                    C_Url = dt.Rows[0]["Recording"].ToString();
                }
            }

            if (D != null)
            {
                Pictures_D = D.FileName;//接受文件名字
                commBll.UpdateInfo("bsi_TaskCustomerInquiry", "Pictures_D='" + Pictures_D + "'", " and ID=" + id);
                D_Url = SaveImage(D, "/Images/", DateTime.Now.ToString("yyyyMMddHHmmssffff") + rstr);
            }
            else
            {
                var dt = commBll.GetListDatatable("*", "bsi_TaskCustomerInquiry", " and ID= " + id);
                if (dt != null && dt.Rows.Count > 0)
                {
                    D_Url = dt.Rows[0]["Recording"].ToString();
                }
            }

            if (E != null)
            {
                Pictures_E = E.FileName;//接受文件名字
                commBll.UpdateInfo("bsi_TaskCustomerInquiry", "Pictures_E='" + Pictures_E + "'", " and ID=" + id);
                E_Url = SaveImage(E, "/Images/", DateTime.Now.ToString("yyyyMMddHHmmssffff") + rstr);
            }
            else
            {
                var dt = commBll.GetListDatatable("*", "bsi_TaskCustomerInquiry", " and ID= " + id);
                if (dt != null && dt.Rows.Count > 0)
                {
                    E_Url = dt.Rows[0]["Recording"].ToString();
                }
            }

            if (F != null)
            {
                Pictures_F = F.FileName;//接受文件名字
                commBll.UpdateInfo("bsi_TaskCustomerInquiry", "Pictures_F='" + Pictures_F + "'", " and ID=" + id);
                F_Url = SaveImage(F, "/Images/", DateTime.Now.ToString("yyyyMMddHHmmssffff") + rstr);
            }
            else
            {
                var dt = commBll.GetListDatatable("*", "bsi_TaskCustomerInquiry", " and ID= " + id);
                if (dt != null && dt.Rows.Count > 0)
                {
                    F_Url = dt.Rows[0]["Recording"].ToString();
                }
            }
            if (chkstr != "")
            {
                commBll.UpdateInfo("bsi_TaskCustomerInquiry", "RightKey='" + chkstr + "'", " and ID=" + id);
            }

            //校验账号是否已存在
            //var count = commBll.GetRecordCount("bsi_TaskCustomerInquiry", " and CustomerName='" + txtCustomerName + "' and id!=" + id);
            //if (count > 0)
            //{
            //    return "77";
            //}

            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@ID",id),
                new SqlParameter("@OptionA",OptionA),
                new SqlParameter("@OptionA_Url",A_Url),
                new SqlParameter("@OptionB",OptionB),
                new SqlParameter("@OptionB_Url",B_Url),
                new SqlParameter("@OptionC",OptionC),
                new SqlParameter("@OptionC_Url",C_Url),
                new SqlParameter("@OptionD",OptionD),
                new SqlParameter("@OptionD_Url",D_Url),
                new SqlParameter("@OptionE",OptionE),
                new SqlParameter("@OptionE_Url",E_Url),
                new SqlParameter("@OptionF",OptionF),
                new SqlParameter("@OptionF_Url",F_Url),
                new SqlParameter("@Answer",Answer),
                new SqlParameter("@Analysis",Analysis),
            };
            var resultcount = commBll.UpdateInfo(table, Set, " and id=@id", pars);
            if (resultcount == 1)
            {
                return "1";
            }
            else
            {
                return "99";
            }
        }


        /// <summary>
        /// 删除
        /// </summary>
        /// <returns></returns>
        public string Del()
        {
            string Ids = Request["Ids"];
            try
            {
                string text = "delete from bsi_TaskCustomerInquiry where id in(" + Ids + ")";
                commBll.ExecuteNonQuery(text);
                DelTaskDetailByInquiry(Ids);
                return "1";
            }
            catch
            {
                return "99";
            }
        }

        /// <summary>
        /// 获取单行信息
        /// </summary>
        /// <returns></returns>
        public string GetListById()
        {
            DataTable dt = commBll.GetListDatatable("*", "bsi_TaskCustomerInquiry", " and id=" + Request["ID"]);
            return JsonConvert.SerializeObject(dt);
        }

        #region 上移下移
        public string Move()
        {
            try
            {
                string id = Request["Id"];
                string Type = Request["Type"];
                var customerId = Request["CustomerId"];
                var taskid = Request["taskid"];
                var selQuestioning = Request["selQuestioning"];//质询环节

                //1.0 查出当前序号
                var Sort = Convert.ToInt32(commBll.GetListSclar("SerialNumber", "bsi_TaskCustomerInquiry", " and ID=" + id + " and CustomerId=" + customerId + " and taskid=" + taskid + " and LinkNumber=" + selQuestioning));
                var MaxSort = Convert.ToInt32(commBll.GetListSclar("Max(SerialNumber)", "bsi_TaskCustomerInquiry", " and CustomerId=" + customerId + " and taskid=" + taskid + " and LinkNumber=" + selQuestioning));
                string sql = "";
                if (Type == "+1")//下移
                {
                    //判断当前的数据是不是最后一条
                    if (Sort != MaxSort)
                    {
                        //下一条的序号-1
                        sql += "update bsi_TaskCustomerInquiry set SerialNumber=SerialNumber-1 where SerialNumber=" + (Sort + 1) + " and CustomerId=" + customerId + " and taskid=" + taskid + " and LinkNumber=" + selQuestioning;
                        //当这条的序号+1
                        sql += @" update bsi_TaskCustomerInquiry set SerialNumber=SerialNumber+1 where ID=" + id + " and CustomerId=" + customerId + " and taskid=" + taskid + " and LinkNumber=" + selQuestioning;
                        SqlHelper.ExecuteNonQuery(sql);
                    }
                    else
                    {
                        //已是最后一条
                        return "-1";
                    }
                }
                if (Type == "-1")//上移
                {
                    if (Sort != 1)
                    {
                        //上一条的序号+1
                        sql += "update bsi_TaskCustomerInquiry set SerialNumber=SerialNumber+1 where SerialNumber=" + (Sort - 1) + " and CustomerId=" + customerId + " and taskid=" + taskid + " and LinkNumber=" + selQuestioning;
                        sql += @" update bsi_TaskCustomerInquiry set SerialNumber=SerialNumber-1 where ID=" + id + " and CustomerId=" + customerId + " and taskid=" + taskid + " and LinkNumber=" + selQuestioning;
                        SqlHelper.ExecuteNonQuery(sql);
                    }
                    else
                    {
                        //已经是第一条
                        return "-2";
                    }
                }
                return "1";
            }
            catch
            {
                return "99";
            }
        }
        #endregion

        /// <summary>
        /// 情况设置页面呈现
        /// </summary>
        /// <returns></returns>
        public ActionResult SituationSet()
        {
            return View();
        }

        /// <summary>
        /// 获得办理业务类型
        /// </summary>
        /// <returns></returns>
        public string GetListByType()
        {
            var typeName = Request["TypeName"];
            DataTable dt = commBll.GetListDatatable("*", "bsi_TaskBusiness", " and TypeName='" + typeName + "'");
            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 获得客户形象
        /// </summary>
        /// <returns></returns>
        public string GetAppearanceListByType()
        {
            var typeName = Request["TypeName"];
            DataTable dt = commBll.GetListDatatable("*", "bsi_Appearance", "");
            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 获得伴随表情与动作
        /// </summary>
        /// <returns></returns>
        public string GetMotion()
        {
            DataTable dt = commBll.GetListDatatable("*", "bsi_Motion", "");
            return JsonConvert.SerializeObject(dt);
        }

        //查找关系表根据形象和表情与动作获得动画图
        public string GetMotionGif()
        {
            var MotionName = Request["MotionName"];//动作表情类型
            var AppearanceName = Request["AppearanceName"];//形象
            DataTable dt = commBll.GetListDatatable("*", "bsi_AppearanceMotion", " and MotionName='" + MotionName + "' and AppearanceName='" + AppearanceName + "'");
            return JsonConvert.SerializeObject(dt);
        }


        #region 质询更新的同时更新任务明细bsi_TaskDetail表
        public string AddTaskDetailByInquiry(string TaskId, string CustomerId, string LinkId, string InquiryId)
        {
            var SceneId = GetSceneByLinkId(int.Parse(LinkId));
            var SubLinkId = GetSubLinkByLinkId(int.Parse(LinkId));
            var Answer = ",";
            var OperationName = "质询";
            var Types = "3";
            var sb = new StringBuilder();
            var td_dt = SqlHelper.ExecuteDataTable($"select ID from bsi_TaskDetail where TaskId='{TaskId}' and LinkId='{LinkId}' and CustomerId='{CustomerId}' and Types='{Types}' and InquiryId='{InquiryId}';");
            if (td_dt.Rows.Count == 0)
            {
                sb.Append($@"insert into bsi_TaskDetail(TaskId,SceneId,LinkId,CustomerId,Types,OperationName,Answer,FormId,InquiryId,Status,SubLinkId,AddUserId,AddTime) 
                                         values('{TaskId}','{SceneId}','{LinkId}','{CustomerId}','{Types}','{OperationName}','{Answer}','','{InquiryId}','1','{SubLinkId}','{UserId}',GetDate());");
                sb.Append(GetCashDetailSqlString(InquiryId));
                SqlHelper.ExecuteNonQuery(sb.ToString());
            }
            return "1";
        }
        public string GetCashDetailSqlString(string TaskDetailId)
        {
            if (TaskDetailId == "0" || string.IsNullOrEmpty(TaskDetailId))
            {
                return "";
            }


            StringBuilder sb = new StringBuilder();
            sb.Append($"delete bsi_CashCollectionDetail where TaskDetailId = {TaskDetailId};");
            var CashDetails = Request["CashDetails"];
            if (CashDetails != null && CashDetails != "0")
            {
                var CashDetailList = JsonConvert.DeserializeObject<List<CashDetailModel>>(CashDetails);
                foreach (var item in CashDetailList)
                {
                    sb.Append($"insert into [bsi_CashCollectionDetail] values('{TaskDetailId}','{item.Type}','{item.DamageType}','{item.CounterfeitType}','1',GETDATE());");

                }
            }

            return sb.ToString();
        }
        public string DelTaskDetailByInquiry(string InquiryIds)
        {
            SqlHelper.ExecuteNonQuery($"delete bsi_TaskDetail where InquiryId in ({InquiryIds})");
            return "1";
        }



        #endregion


    }
}
