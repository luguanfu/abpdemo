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
    public class HB_QuestionBankController : BaseController
    {
        //
        // GET: /Admin/HB_QuestionBank/
        CommonBll commonbll = new CommonBll();
        public ActionResult Index()
        {
            ViewData["UserType"] = UserType;
            return View();
        }

        /// <summary>
        /// 题库新增视图
        /// </summary>
        /// <returns></returns>
        public ActionResult AddIndex()
        {
            ViewData["UserType"] = UserType;
            return View();
        }

        /// <summary>
        /// 题库编辑视图
        /// </summary>
        /// <returns></returns>
        public ActionResult EditIndex()
        {
            ViewData["UserType"] = UserType;
            return View();
        }
        /// <summary>
        /// 题目列表
        /// </summary>
        /// <returns></returns>
        public string GetList()
        {
            string wheres = " and QB_State=1";//试题状态

            //角色区分  //暂时不考虑独立打包客户，需要web加个配置 读取 控制 后期加
            if (UserType == 1) {
                wheres += " and ( QB_Kind=" + UserType + ")";
            }
            else if (UserType == 2)//教师  如果是教师就只显示自己的题目--教师看 教师+管理员的
            {
                wheres += " and (QB_AddOperator=" + UserId + " or QB_Kind= 1 )";
            }

            if (Request["QB_Type"] != null && Request["QB_Type"].ToString() != "0")//题型选择
            {
                wheres += " and QB_Type='" + Request["QB_Type"].ToString() + "'";
            }

            if (Request["QB_Description"] != null && Request["QB_Description"].ToString().Length > 0)//题目描述
            {

                wheres += " and QB_Description like '%" + Request["QB_Description"].ToString() + "%'";
            }

            if (Request["QB_Kind"] != null && Request["QB_Kind"].ToString() != "0")//题目属性
            {
                wheres += " and QB_Kind='" + Request["QB_Kind"].ToString() + "'";
            }

          
            if (Request["QuestonBQName"] != null && Request["QuestonBQName"].ToString().Length > 0)//
            {

                wheres += " and QuestonBQName like '%" + Request["QuestonBQName"].ToString() + "%'";
            }

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = "QB_AddTime desc"; //排序必须填写
            m.strFld = " a.*,QuestonBQName";
            m.tab = "tb_HB_QuestionBank a inner join tb_HB_QuestionBQ b on a.QB_Custom1=b.ID";

            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));

        }

        /// <summary>
        /// 读取试题标签
        /// </summary>
        /// <returns></returns>
        public string Gettb_HB_QuestionBQ()
        {
            DataTable dt = commonbll.GetListDatatable("*", "tb_HB_QuestionBQ", " and AddUserId=" + UserId);

            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 获取单行数据
        /// </summary>
        /// <returns></returns>
        public string GetListById()
        {
            DataTable dt = commonbll.GetListDatatable("QuestionBId, QB_CourseId, QB_Type, QB_Description, QB_A, QB_B, QB_C, QB_D, QB_E, QB_F, QB_Answer, QB_Keyword, QB_State, QB_Kind, QB_Operator, QB_AddOperator, QB_AddTime, QB_Custom1, ISNULL((select QuestonBQName from tb_HB_QuestionBQ where ID=QB_Custom1),'无') as QB_Custom2, QB_Custom3", "tb_HB_QuestionBank", " and QuestionBId=" + Request["QuestionBId"]);

            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <returns></returns>
        public string DelQuestionBank()
        {
            try
            {
                var Ids = Request["Ids"];
                SqlParameter[] pars = new SqlParameter[] 
                {
                    new SqlParameter("@QB_Operator",UserId),
                    new SqlParameter("@QB_State","0")
                };
                DataTable tb = commonbll.GetListDatatable($"select * from tb_HB_QuestionBank where QuestionBId in ({Ids})");
                for (int i = 0; i < tb.Rows.Count; i++)
                {
                    if (tb.Rows[i]["QB_Kind"].ToString() == "1" && UserType == 2)
                    {
                        return "88";
                    }
                    
                }
                //修改状态 操作人
                commonbll.UpdateInfo("tb_HB_QuestionBank", " QB_State=@QB_State,QB_Operator=@QB_Operator", " and QuestionBId in(" + Ids + ")", pars);
                return "1";
            }
            catch
            {
                return "99";
            }
        }


        /// <summary>
        /// 新增
        /// </summary>
        /// <returns></returns>
        public string Add()
        {
            try
            {
                string table = "tb_HB_QuestionBank"; //表名
                string list = "QB_CourseId, QB_Type, QB_Description, QB_A, QB_B, QB_C, QB_D, QB_E, QB_Answer, QB_Keyword, QB_State, QB_Kind, QB_Operator, QB_AddOperator, QB_AddTime, QB_Custom1,QB_Custom2";//列
                string vlaue = "@QB_CourseId, @QB_Type, @QB_Description, @QB_A, @QB_B, @QB_C, @QB_D, @QB_E, @QB_Answer, @QB_Keyword, @QB_State, @QB_Kind, @QB_Operator, @QB_AddOperator, @QB_AddTime,@QB_Custom1, @QB_Custom2";

                string QB_CourseId = "1";
                string QB_Type = Request["QB_Type"];//题型
                string QB_Description = Request["QB_Description"];//描述
                string QB_A = Request["QB_A"];//选项A-E
                string QB_B = Request["QB_B"];
                string QB_C = Request["QB_C"];
                string QB_D = Request["QB_D"];
                string QB_E = Request["QB_E"];

                string QB_Answer = Request["QB_Answer"];//标准答案
                string QB_Keyword = Request["QB_Keyword"];//关键字
                string QB_State = "1";//状态

                string QB_Kind = UserType.ToString();//1系统 2是教师 正好与角色相对应

                string QB_Operator = UserId.ToString();//操作
                string QB_AddOperator = UserId.ToString();//创建人
                DateTime QB_AddTime = DateTime.Now;
                string QB_Custom2 = UserNo;//登录账号
                string QB_Custom1 = Request["SelQuestonBQName"];//试题标签

                //验证是否 同一试题下重复
                //教师和管理员 校验范围不一样
                string checkewheres = "";
                if (UserType == 1)//管理员
                {
                    //匹配所有系统的题重复
                    checkewheres += "  and QB_Kind=1";

                }
                if (UserType == 2)//教师
                {
                    //匹配自己的
                    checkewheres += "  and QB_AddOperator=" + QB_AddOperator;
                }
                //同一题型下 题目描述和选项均相同
                checkewheres += " and QB_State=1 and QB_Type=" + QB_Type + " and QB_Description='" + QB_Description + "'";
                checkewheres += " and QB_A='" + QB_A + "' and QB_B='" + QB_B + "' and QB_C='" + QB_C + "' and QB_D='" + QB_D + "' and QB_E='" + QB_E + "'";

                //重复校验
                int checekcount = commonbll.GetRecordCount("tb_HB_QuestionBank", checkewheres);
                if (checekcount > 0)//存在重复
                {
                    return "88";
                }
                else
                {
                    SqlParameter[] pars = new SqlParameter[] 
                    {
                        new SqlParameter("@QB_CourseId",QB_CourseId),
                        new SqlParameter("@QB_Type",QB_Type),
                        new SqlParameter("@QB_Description",QB_Description),
                        new SqlParameter("@QB_A",QB_A),
                        new SqlParameter("@QB_B",QB_B),
                        new SqlParameter("@QB_C",QB_C),
                        new SqlParameter("@QB_D",QB_D),
                        new SqlParameter("@QB_E",QB_E),
                        new SqlParameter("@QB_Answer",QB_Answer),
                        new SqlParameter("@QB_Keyword",QB_Keyword),
                        new SqlParameter("@QB_State",QB_State),
                        new SqlParameter("@QB_Kind",QB_Kind),
                        new SqlParameter("@QB_Operator",QB_Operator),
                        new SqlParameter("@QB_AddOperator",QB_AddOperator),
                        new SqlParameter("@QB_AddTime",QB_AddTime),
                        new SqlParameter("@QB_Custom1",QB_Custom1),
                        new SqlParameter("@QB_Custom2",QB_Custom2)


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
            }
            catch
            {
                return "99";
            }

        }

        /// <summary>
        /// 编辑
        /// </summary>
        /// <returns></returns>
        public string Edit()
        {

            string QB_Type = Request["QB_Type"];//题型
            string QB_Description = Request["QB_Description"];//描述
            string QB_A = Request["QB_A"];//选项A-E
            string QB_B = Request["QB_B"];
            string QB_C = Request["QB_C"];
            string QB_D = Request["QB_D"];
            string QB_E = Request["QB_E"];

            string QB_Answer = Request["QB_Answer"];//标准答案
            string QB_Keyword = Request["QB_Keyword"];//关键字
            string QB_Operator = UserId.ToString();//操作
            string QB_AddOperator = UserId.ToString();
            string QuestionBId = Request["QuestionBId"];
            string QB_Custom1 = Request["SelQuestonBQName"];//试题标签

            //验证是否 同一试题下重复
            //教师和管理员 校验范围不一样
            string checkewheres = "";
            if (UserType == 1)//管理员
            {
                //匹配所有系统的题重复
                checkewheres += "  and QB_Kind=1";

            }
            if (UserType == 2)//教师
            {
                //匹配自己的
                checkewheres += "  and QB_AddOperator=" + QB_AddOperator;
            }

            //验证当前题是不是自己的试题
            int chkcountIsmy = commonbll.GetRecordCount("tb_HB_QuestionBank", checkewheres + " and QuestionBId=" + QuestionBId);
            if (chkcountIsmy == 0)//不存在 那就是说 不是自己的题
            {
                return "77";//无权限修改
            }


            //同一题型下 题目描述和选项均相同
            checkewheres += " and QB_State=1 and QB_Type=" + QB_Type + " and QB_Description='" + QB_Description + "'";
            checkewheres += " and QB_A='" + QB_A + "' and QB_B='" + QB_B + "' and QB_C='" + QB_C + "' and QB_D='" + QB_D + "' and QB_E='" + QB_E + "'";
            checkewheres += " and QuestionBId!=" + QuestionBId;
            //重复校验
            int checekcount = commonbll.GetRecordCount("tb_HB_QuestionBank", checkewheres);
            if (checekcount > 0)//存在重复
            {
                return "88";
            }

            string table = "tb_HB_QuestionBank"; //表名
            string set = @"QB_Description=@QB_Description, QB_A=@QB_A, QB_B=@QB_B, QB_C=@QB_C, QB_D=@QB_D, QB_E=@QB_E, 
                      QB_Answer=@QB_Answer, QB_Keyword=@QB_Keyword,  QB_Operator=@QB_Operator,QB_Custom1=@QB_Custom1";
            string strWhere = " and QuestionBId=@QuestionBId";

            SqlParameter[] pars = new SqlParameter[] 
            { 
                new SqlParameter("@QB_Description",QB_Description),
                new SqlParameter("@QB_A",QB_A),
                new SqlParameter("@QB_B",QB_B),
                new SqlParameter("@QB_C",QB_C),
                new SqlParameter("@QB_D",QB_D),
                new SqlParameter("@QB_E",QB_E),
                new SqlParameter("@QB_Answer",QB_Answer),
                new SqlParameter("@QB_Keyword",QB_Keyword),
                new SqlParameter("@QB_Operator",QB_Operator),
                new SqlParameter("@QB_Custom1",QB_Custom1),
                new SqlParameter("@QuestionBId",QuestionBId)
            
            };

            var resultcount = commonbll.UpdateInfo(table, set, strWhere, pars);
            return resultcount.ToString();

        }
    }
}
