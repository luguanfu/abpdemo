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
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class CustomerController : BaseController
    {
        CommonBll commBll = new CommonBll();

        //
        // GET: /Admin/Product/

        public ActionResult Index()
        {
            ViewBag.taskid = Request["taskid"];
            return View();
        }

        /// <summary>
        /// 客户列表
        /// </summary>
        /// <returns></returns>
        public string GetList()
        {
            string Keyword = Request["Keyword"];
            var taskid = Request["taskid"];
            string wheres = " and 1=1";

            if (!string.IsNullOrEmpty(Keyword))
            {
                wheres += " and CustomerName like '%" + Keyword + "%'";
            }
            if (!string.IsNullOrEmpty(taskid))
            {
                wheres += " and TaskId='" + taskid + "'";
            }
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " CustomerOrder "; //排序必须填写
            m.strFld = @" a.*, b.HallScene,b.CounterScene ";
            m.tab = " bsi_TaskCustomer a LEFT JOIN bsi_Task b ON a.TaskId = b.ID ";
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
            string table = "bsi_TaskCustomer"; //表名
            string list = " TaskId, CustomerName,CustomerOrder, AddUserId, AddTime";//列
            string vlaue = "@TaskId, @CustomerName,@CustomerOrder, @AddUserId, @AddTime";

            var txtCustomerName = Request["txtCustomerName"];
            var taskid = Request["taskid"];

            //校验账号是否已存在
            //var count = commBll.GetRecordCount("bsi_TaskCustomer", " and CustomerName='" + txtCustomerName + "'");
            //if (count > 0)
            //{
            //    return "77";
            //}

            //新增
            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@TaskId",taskid),
                new SqlParameter("@CustomerOrder",GetMaxSortNum(Convert.ToInt32(taskid))),
                new SqlParameter("@CustomerName",txtCustomerName),
                new SqlParameter("@AddUserId",UserId),
                new SqlParameter("@AddTime",DateTime.Now),
            };
            var resultcount = commBll.Add(table, list, vlaue, pars);
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
        /// 修改
        /// </summary>
        /// <returns></returns>
        public string Update()
        {
            string table = "bsi_TaskCustomer"; //表名
            string Set = "CustomerName=@CustomerName";
            var txtCustomerName = Request["txtCustomerName"];

            var id = Convert.ToInt32(Request["id"]);

            //校验账号是否已存在
            //var count = commBll.GetRecordCount("bsi_TaskCustomer", " and CustomerName='" + txtCustomerName + "' and id!=" + id);
            //if (count > 0)
            //{
            //    return "77";
            //}

            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@ID",id),
                new SqlParameter("@CustomerName",txtCustomerName),
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
        /// 修改客户情况设置
        /// </summary>
        /// <returns></returns>
        public string UpdateSituationSet()
        {
            string table = "bsi_TaskCustomer"; //表名
            string Set = "  Appearance=@Appearance, BusinessType=@BusinessType,BusinessId=@BusinessId, Prologue=@Prologue, Recording=@Recording, Motion=@Motion,CaseDescription=@CaseDescription";

            var showName = Request["showName"];
            var selCustomerOrder = Request["selCustomerOrder"];
            var BusinessType = Request["BusinessType"];
            var txtPrologue = Request["txtPrologue"];
            var motionName = Request["MotionName"];
            var Appearance = Request["Appearance"];
            var taskid = Request["taskid"];//任务案例id
            var id = Convert.ToInt32(Request["id"]);
            var CaseDescription = Request["CaseDescription"];
            HttpPostedFileBase fileBase = Request.Files["file"];//上传文件
            Random random = new Random();
            int s = random.Next(1000, 9999);
            string rstr = s.ToString().Substring(0, 4);

            var Icon = string.Empty;
            if (fileBase != null)
            {
                Icon = SaveImage(fileBase, "/Resources/mp4/", DateTime.Now.ToString("yyyyMMddHHmmssffff") + rstr);
            }
            else
            {
                var dt = commBll.GetListDatatable("*", "bsi_TaskCustomer", " and ID= " + id);
                Icon = dt.Rows[0]["Recording"].ToString();
            }

            //校验账号是否已存在
            //var count = commBll.GetRecordCount("bsi_TaskCustomer", " and CustomerOrder=" + selCustomerOrder + "and id!=" + id + " and taskid=" + taskid);
            //if (count > 0)
            //{
            //    return "77";
            //}

            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@ID",id),
                new SqlParameter("@Appearance",showName),
                //new SqlParameter("@CustomerOrder", GetMaxSortNum(Convert.ToInt32(taskid))),
                new SqlParameter("@BusinessType",Appearance),
                new SqlParameter("@Prologue",txtPrologue),
                new SqlParameter("@Recording",Icon),
                new SqlParameter("@Motion",motionName),
                new SqlParameter("@BusinessId",Convert.ToInt32(BusinessType)),
                new SqlParameter("@taskid",taskid),
                new SqlParameter("@CaseDescription",CaseDescription)
            };
            var resultcount = commBll.UpdateInfo(table, Set, " and id=@id and taskid=@taskid", pars);
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
                string text = "delete from bsi_TaskCustomer where id in(" + Ids + ");";
                text += "delete from bsi_TaskDetail where CustomerId in(" + Ids + ");";
                commBll.ExecuteNonQuery(text);
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
            DataTable dt = commBll.GetListDatatable("*", "bsi_TaskCustomer", " and id=" + Request["ID"]);
            return JsonConvert.SerializeObject(dt);
        }

        #region 上移下移
        public string Move()
        {
            try
            {
                string id = Request["Id"];
                string Type = Request["Type"];
                var taskid = Request["taskid"];

                //1.0 查出当前序号
                var Sort = Convert.ToInt32(commBll.GetListSclar("CustomerOrder", "bsi_TaskCustomer", " and ID=" + id + " and taskid=" + taskid));
                var MaxSort = Convert.ToInt32(commBll.GetListSclar("Max(CustomerOrder)", "bsi_TaskCustomer", " and taskid=" + taskid));
                string sql = "";
                if (Type == "+1")//下移
                {
                    //判断当前的数据是不是最后一条
                    if (Sort != MaxSort)
                    {
                        //下一条的序号-1
                        sql += "update bsi_TaskCustomer set CustomerOrder=CustomerOrder-1 where CustomerOrder=" + (Sort + 1) + " and taskid=" + taskid;
                        //当这条的序号+1
                        sql += @" update bsi_TaskCustomer set CustomerOrder=CustomerOrder+1 where ID=" + id + " and taskid=" + taskid;
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
                        sql += "update bsi_TaskCustomer set CustomerOrder=CustomerOrder+1 where CustomerOrder=" + (Sort - 1) + " and taskid=" + taskid;
                        sql += @" update bsi_TaskCustomer set CustomerOrder=CustomerOrder-1 where ID=" + id + " and taskid=" + taskid;
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
            ViewBag.taskid = Request["taskid"];
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
            //var AppearanceId = Request["AppearanceId"];
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

        /// <summary>
        /// 返回最大的序号加1
        /// </summary>
        /// <returns></returns>
        public int GetMaxSortNum(int taskid)
        {
            int Sort = 1;
            DataTable SortDt = commBll.GetListDatatable("select Max(CustomerOrder) as CustomerOrder from bsi_TaskCustomer where taskid=" + taskid);
            if (SortDt.Rows.Count > 0)
            {
                try
                {
                    Sort = Convert.ToInt32(SortDt.Rows[0]["CustomerOrder"].ToString() == "" ? 0 : SortDt.Rows[0]["CustomerOrder"]) + 1;
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

    }
}
