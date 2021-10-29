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

namespace Dy_SimulatedBank.Controllers
{
    public class Sys_ValidationController : BaseController
    {
        /***************************************************************
         FileName:参数管理
         Copyright（c）2018-金融教育在线技术开发部
         Author:袁学
         Create Date:2018-5-9
        ******************************************************************/

        CommonBll commonbll = new CommonBll();
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 列表数据
        /// </summary>
        /// <returns></returns>
        public string GetList()
        {
            string wheres = " ";

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " Id"; //排序必须填写
            m.strFld = " * ";
            m.tab = "bsi_Data_Dic_Class";

            if (!string.IsNullOrEmpty(Request["DicName"]))
            {
                wheres += " and Class_Name like '%" + Request["DicName"] + "%'";
            }
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));

        }


        /// <summary>
        /// 字典值列表数据
        /// </summary>
        /// <returns></returns>
        public string GetListTo()
        {
            string wheres = " and Class_Code in (select Class_Code from bsi_Data_Dic_Class where Id=" + Request["Dic_ClassId"] + ")";

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " Id"; //排序必须填写
            m.strFld = " * ";
            m.tab = "bsi_Data_Dic";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));

        }

        /// <summary>
        /// 字典新增
        /// </summary>
        /// <returns></returns>
        public string Add()
        {
            string table = "bsi_Data_Dic_Class"; //表名
            string list = "Class_Name, Class_Code, Is_System";//列
            string vlaue = "@Class_Name, @Class_Code, @Is_System";

            var txtClass_Name = Request["txtClass_Name"];
            var txtClass_Code = Request["txtClass_Code"];
            var txtIs_System = Request["txtIs_System"];

            //新增
            SqlParameter[] pars = new SqlParameter[] 
            { 
                new SqlParameter("@Class_Name",txtClass_Name),
                new SqlParameter("@Class_Code",txtClass_Code),
                new SqlParameter("@Is_System",txtIs_System)
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
        /// 字典值删除
        /// </summary>
        /// <returns></returns>
        public string Del()
        {
            try
            {
                var Ids = Request["Ids"];
                //修改状态 操作人
                commonbll.DeleteInfo("bsi_Data_Dic", " and Id in(" + Ids + ")");
                return "1";
            }
            catch
            {
                return "99";
            }

        }


        /// <summary>
        /// 获取字典单行数据
        /// </summary>
        /// <returns></returns>
        public string GetListById()
        {
            DataTable dt = commonbll.GetListDatatable("*", "bsi_Data_Dic_Class", " and Id=" + Request["Id"]);

            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 获取字典值单行数据
        /// </summary>
        /// <returns></returns>
        public string GetListByIdTo()
        {
            DataTable dt = commonbll.GetListDatatable("*", "bsi_Data_Dic", " and Id=" + Request["Id"]);

            return JsonConvert.SerializeObject(dt);
        }

        
        /// <summary>
        /// 字典编辑
        /// </summary>
        /// <returns></returns>
        public string Edit()
        {
            var Id = Request["Id"];
            var txtClass_Name = Request["txtEditClass_Name"];
            var txtClass_Code = Request["txtEditClass_Code"];
            var txtIs_System = Request["txtIs_System"];

            string set = "Class_Name=@Class_Name,Class_Code=@Class_Code,Is_System=@Is_System";
            SqlParameter[] pars = new SqlParameter[] 
            {
              
                new SqlParameter("@Class_Name",txtClass_Name),
                new SqlParameter("@Class_Code",txtClass_Code),
                new SqlParameter("@Is_System",txtIs_System),
                new SqlParameter("@Id",Id)
            };
            var count = commonbll.UpdateInfo("bsi_Data_Dic_Class", set, " and Id=@Id", pars);
            return count.ToString();
        }

        /// <summary>
        /// 字典值新增
        /// </summary>
        /// <returns></returns>
        public string AddTo()
        {
            string table = "bsi_Data_Dic"; //表名
            string list = "Class_Code, Dic_Name, Dic_Value,CreateTime";//列
            string vlaue = "@Class_Code, @Dic_Name, @Dic_Value,@CreateTime";

            var txtDic_Name = Request["txtDic_Name"];
            var txtDic_Value = Request["txtDic_Value"];
            var totxtClass_Code = Request["totxtClass_Code"];

            //新增
            SqlParameter[] pars = new SqlParameter[] 
            { 
                new SqlParameter("@Class_Code",totxtClass_Code),
                new SqlParameter("@Dic_Name",txtDic_Name),
                new SqlParameter("@Dic_Value",txtDic_Value),
                new SqlParameter("@CreateTime",DateTime.Now)
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
        /// 字典值编辑
        /// </summary>
        /// <returns></returns>
        public string EditTo()
        {
            var Id = Request["Id"];
            var txtDic_Name = Request["EdittxtDic_Name"];
            var txtDic_Value = Request["EdittxtDic_Value"];


            string set = "Dic_Name=@Dic_Name,Dic_Value=@Dic_Value";
            SqlParameter[] pars = new SqlParameter[] 
            {
              
                new SqlParameter("@Dic_Name",txtDic_Name),
                new SqlParameter("@Dic_Value",txtDic_Value),
                new SqlParameter("@Id",Id)
            };
            var count = commonbll.UpdateInfo("bsi_Data_Dic", set, " and Id=@Id", pars);
            return count.ToString();
        }



    }
}
