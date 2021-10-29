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

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class HB_ExaminationController : BaseController
    {
        //理论考核设置
        // GET: /Admin/Lx_Examination/
        CommonBll commonbll = new CommonBll();
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 视图 新增
        /// </summary>
        /// <returns></returns>
        public ActionResult AddIndex()
        {
            ViewData["UserType"] = UserType;

            string wheres = " and P_State=1 and (P_Kind=1 or P_AddOperator="+ UserId + ")";//试卷状态

            DataTable dt = commonbll.GetListDatatable("*", "tb_HB_Paper", wheres);
            return View(dt);
        }


        /// <summary>
        /// 视图 编辑
        /// </summary>
        /// <returns></returns>
        public ActionResult EditIndex()
        {
            ViewData["UserType"] = UserType;

            string wheres = " and P_State=1 and (P_Kind=1 or P_AddOperator=" + UserId + ")";//试卷状态
            DataTable dt = commonbll.GetListDatatable("*", "tb_HB_Paper", wheres);
            return View(dt);
        }

        /// <summary>
        /// 试卷列表
        /// </summary>
        /// <returns></returns>
        public string GetList()
        {
            string wheres = " "; 

            wheres += " and E_AddOperator=" + UserId + " and E_Type in (1,3)";



            if (Request["E_Name"] != null && Request["E_Name"].ToString().Length > 0)//考试名称
            {

                wheres += " and E_Name like '%" + Request["E_Name"].ToString() + "%'";
            }

            if (Request["E_Type"] != null && Request["E_Type"].ToString() != "0")//模式
            {
                wheres += " and E_Type='" + Request["E_Type"].ToString() + "'";
            }

            //试卷状态1.考试 2练习
            if (Request["E_IsState"] != null && Request["E_IsState"].ToString() != "0")//激活状态
            {
                wheres += " and E_IsState='" + Request["E_IsState"].ToString() + "'";
            }


            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = "E_AddTime desc"; //排序必须填写
            m.strFld = " * ";
            m.tab = "tb_HB_Examination";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));

        }


        /// <summary>
        /// 激活状态修改
        /// </summary>
        /// <returns></returns>
        public string EditIsState()
        {
            try
            {
                var Ids = Request["Ids"];
                var E_IsState = Request["E_IsState"];
                //需要检验
                SqlParameter[] pars = new SqlParameter[] 
                {
                    new SqlParameter("@E_IsState",E_IsState)
                   
                };

                //修改状态 操作人
                commonbll.UpdateInfo("tb_HB_Examination", " E_IsState=@E_IsState", " and EId in(" + Ids + ")", pars);
                return "1";
            }
            catch
            {
                return "99";
            }
        }


        /// <summary>
        /// 删除
        /// </summary>
        /// <returns></returns>
        public string DelExamination()
        {
            try
            {
                var Ids = Request["Ids"];

                commonbll.DeleteInfo("tb_HB_Examination", " and E_IsState=2 and EId in (" + Ids + ")");
                return "1";
            }
            catch
            {
                return "99";
            }
        }


        /// <summary>
        /// 获取单行数据
        /// </summary>
        /// <returns></returns>
        public string GetListById()
        {
            DataTable dt = commonbll.GetListDatatable("*,(select P_Name from tb_HB_Paper where Pid=E_PId) as PName", "tb_HB_Examination", " and EId=" + Request["EId"]);

            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 获取管理员端所有试卷
        /// </summary>
        /// <returns></returns>
        public string GetListPaper()
        {

            string wheres = " and P_State=1";//试卷状态

            wheres += " and P_AddOperator=" + UserId;

            DataTable dt = commonbll.GetListDatatable("*", "tb_HB_Paper", wheres);

            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 获取教师的班级
        /// </summary>
        /// <returns></returns>
        public string GetListTeam()
        {
            string wheres = " and TeacherId=" + UserId;
            DataTable dt = commonbll.GetListDatatable("*", "tb_Class", wheres);

            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 考试下的班级名称获取
        /// </summary>
        /// <returns></returns>
        public string GetListTeamByInId()
        {
            string wheres = " and C_ID in(" + Request["Id"] + ")";
            DataTable dt = commonbll.GetListDatatable("*", "tb_Class", wheres);
            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 新增
        /// </summary>
        /// <returns></returns>
        public string Add()
        {
            try
            {
                string E_Name = Request["AddP_Name"];//试卷名称
                string E_PId = Request["AddE_PId"];
                string E_Type = Request["AddE_Type"];//模式
                string E_StartTime = Request["AddE_StartTime"];
                string E_EndTime = Request["AddE_EndTime"];
                string E_Whenlong = Request["AddE_Whenlong"];//时长
                string E_TeamId = Request["AddE_TeamId"];//班级
                string E_IsTimeBonus = Request["AddE_IsTimeBonus"];//是否时间加分
                string E_IsState = "2";//未激活
                string E_Kind = UserType.ToString();//1系统 2是教师 正好与角色相对应
                string E_Operator = UserId.ToString();//操作
                string E_AddOperator = UserId.ToString();//创建人
                DateTime E_AddTime = DateTime.Now;
                string UR_Custom2 = UserNo;//登录账号

                //var ds = DateTime.Now;
                //DateTime statetime = Convert.ToDateTime(E_StartTime);
                //DateTime endtime = Convert.ToDateTime(E_EndTime);
                //TimeSpan tsto = endtime - statetime;
                //var Towhenlong = tsto.TotalMinutes;//分钟

                //校验考试名称是否存在
                string wheres = " and E_Type=2 and E_Name='" + E_Name + "'";//试卷状态

                wheres += " and E_AddOperator=" + UserId;


                var checkcount = commonbll.GetRecordCount("tb_HB_Examination", wheres);
                if (checkcount > 0)
                {
                    return "88";
                }

                string table = "tb_HB_Examination"; //表名
                string list = "E_Name, E_PId, E_Type, E_StartTime, E_EndTime, E_Whenlong, E_TeamId, E_IsTimeBonus, E_IsState, E_Kind, E_Operator, E_AddOperator, E_AddTime, UR_Custom2";//列
                string vlaue = "@E_Name, @E_PId, @E_Type, @E_StartTime, @E_EndTime, @E_Whenlong, @E_TeamId, @E_IsTimeBonus, @E_IsState, @E_Kind, @E_Operator, @E_AddOperator, @E_AddTime, @UR_Custom2";


                SqlParameter[] pars = new SqlParameter[] 
                    {
                        new SqlParameter("@E_Name",E_Name),
                        new SqlParameter("@E_PId",E_PId),
                        new SqlParameter("@E_Type",E_Type),
                        new SqlParameter("@E_StartTime",E_StartTime),
                        new SqlParameter("@E_EndTime",E_EndTime),
                        new SqlParameter("@E_Whenlong",E_Whenlong),
                        new SqlParameter("@E_TeamId",E_TeamId),
                        new SqlParameter("@E_IsTimeBonus",E_IsTimeBonus),
                        new SqlParameter("@E_IsState",E_IsState),
                        new SqlParameter("@E_Kind",E_Kind),
                        new SqlParameter("@E_Operator",E_Operator),
                        new SqlParameter("@E_AddOperator",E_AddOperator),
              
                        new SqlParameter("@E_AddTime",E_AddTime),
                        new SqlParameter("@UR_Custom2",UR_Custom2)
                    };
                commonbll.Add(table, list, vlaue, pars);

                return "1";
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
            try
            {
                string E_Name = Request["EditP_Name"];//试卷名称
                string E_PId = Request["EditE_PId"];
                string E_Type = Request["EditE_Type"];//模式
                string E_StartTime = Request["EditE_StartTime"];
                string E_EndTime = Request["EditE_EndTime"];
                string E_Whenlong = Request["EditE_Whenlong"];//时长
                string E_TeamId = Request["EditTeamId"];//班级
                string E_IsTimeBonus = Request["EditE_IsTimeBonus"];//是否时间加分
                string EId = Request["EId"];
                string E_Operator = UserId.ToString();




                string table = "tb_HB_Examination"; //表名
                string list = @" E_Name=@E_Name, E_PId=@E_PId, E_StartTime=@E_StartTime, 
                                      E_EndTime=@E_EndTime, E_Whenlong=@E_Whenlong, E_TeamId=@E_TeamId, 
                                      E_IsTimeBonus=@E_IsTimeBonus, E_Operator=@E_Operator,E_Type=@E_Type";//列



                SqlParameter[] pars = new SqlParameter[] 
                    {
                        new SqlParameter("@E_Name",E_Name),
                        new SqlParameter("@E_PId",E_PId),
                        new SqlParameter("@E_StartTime",E_StartTime),
                        new SqlParameter("@E_EndTime",E_EndTime),
                        new SqlParameter("@E_Whenlong",E_Whenlong),
                        new SqlParameter("@E_TeamId",E_TeamId),
                        new SqlParameter("@E_IsTimeBonus",E_IsTimeBonus),
                        new SqlParameter("@E_Operator",E_Operator),
                        new SqlParameter("@EId",EId),
                        new SqlParameter("@E_Type",E_Type)
                    };
                commonbll.UpdateInfo(table, list, " and EId=@EId", pars);

                return "1";
            }
            catch
            {
                return "99";
            }

        }


    }
}
