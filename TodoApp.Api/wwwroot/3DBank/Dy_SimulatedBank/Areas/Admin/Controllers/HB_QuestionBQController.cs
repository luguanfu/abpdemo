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
namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class HB_QuestionBQController : BaseController
    {
        //试题标签 程序猿  2018-07-31
        // GET: /Admin/HB_QuestionBQ/
        CommonBll commonbll = new CommonBll();
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        ///  列表数据
        /// </summary>
        /// <returns></returns>
        public string GetList()
        {
            //string wheres = " and BQ_Kind=" + Request["BQ_Kind"] + " and AddUserId=" + UserId;
            string wheres = "";
            if (UserType == 2)//用户类型为教师
            {
                wheres = " and (AddUserId=" + UserId + " OR AddUserId=1) ";
            }

            //查询条件
            if (Request["txtQuestonBQName"].Length > 0)
            {
                wheres += " and QuestonBQName like '%" + Request["txtQuestonBQName"] + "%'";
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.AddTime desc"; //排序必须填写
            m.strFld = @" a.*,
(select COUNT(1) from tb_HB_QuestionBank where QB_Custom1=a.ID and QB_State!=0) as STnum";
            m.tab = @"tb_HB_QuestionBQ a";
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
            string table = "tb_HB_QuestionBQ"; //表名
            string list = "QuestonBQName, BQ_Kind, AddTime, AddUserId";//列
            string vlaue = "@QuestonBQName, @BQ_Kind, @AddTime, @AddUserId";

            var AddQuestonBQName = Request["AddQuestonBQName"];
            var BQ_Kind = Request["BQ_Kind"];

            //校验学校名称是否已存在
            var count = commonbll.GetRecordCount("tb_HB_QuestionBQ", " and QuestonBQName='" + AddQuestonBQName + "' and BQ_Kind=" + BQ_Kind + " and AddUserId=" + UserId);
            if (count > 0)
            {
                return "77";

            }

            //新增
            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@QuestonBQName",AddQuestonBQName),
                new SqlParameter("@BQ_Kind",BQ_Kind),
                new SqlParameter("@AddUserId",UserId),
                new SqlParameter("@AddTime",DateTime.Now)
            };
            var resultcount = commonbll.Add(table, list, vlaue, pars);
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
                //校验标签下 是否存在试题
                var count = commonbll.GetRecordCount("tb_HB_QuestionBank", " and QB_Custom1 in(" + Ids + ") and QB_State=1");
                if (count > 0)
                {
                    return "77";

                }
                commonbll.DeleteInfo("tb_HB_QuestionBQ", " and ID in(" + Ids + ")");

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
            DataTable dt = commonbll.GetListDatatable("*", "tb_HB_QuestionBQ", " and ID=" + Request["ID"]);
            return JsonConvert.SerializeObject(dt);

        }

        /// <summary>
        /// 修改
        /// </summary>
        /// <returns></returns>
        public string Update()
        {
            string table = "tb_HB_QuestionBQ"; //表名
            string Set = "QuestonBQName=@QuestonBQName";


            var EditQuestonBQName = Request["EditQuestonBQName"];
            var ID = Request["ID"];
            var BQ_Kind = Request["BQ_Kind"];

            var count = commonbll.GetRecordCount("tb_HB_QuestionBQ", " and QuestonBQName='" + EditQuestonBQName + "' and BQ_Kind=" + BQ_Kind + " and AddUserId=" + UserId + " and ID!=" + ID);
            if (count > 0)
            {
                return "77";

            }


            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@QuestonBQName",EditQuestonBQName),
                new SqlParameter("@ID",ID)
            };
            var resultcount = commonbll.UpdateInfo(table, Set, " and ID=@ID", pars);
            if (resultcount == 1)
            {
                return "1";
            }
            else
            {
                return "99";
            }


        }
    }
}
