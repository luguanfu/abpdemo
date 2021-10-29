using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank.Models;
using Dy_SimulatedBank_DBUtility.Sql;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    /// <summary>
    /// 系统参数管理
    /// </summary>
    public class SystemParameterController : BaseController
    {
        //
        // GET: /Admin/SystemParameter/

        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 设置业务授权页面
        /// </summary>
        /// <returns></returns>
        public ActionResult Empowe()
        {
            return View();
        }
        /// <summary>
        /// 获取业务授权列表
        /// </summary>
        /// <returns></returns>
        public string GetList()
        {
            //string wheres = " and ParentId in(0101,0103,0104,0105,0106,0109,0205,0306,0505,0620,0801,0802,0807,0654) "; 
            //string wheres = " and IsEnd=1  and  a.TMNO NOT IN('030602', '080707', '080702', '080703', '091003', '091101', '030101') ";
            string wheres = " and IsEnd=1  and  a.TMNO NOT IN('080707', '080702', '080703', '091101') ";
            if (Request["P_Name"] != null && Request["P_Name"].ToString().Length > 0)//业务名称
            {
                //wheres += " and P_Name like '%" + Request["P_Name"].ToString() + "%'";
                wheres += " and TMName like '%"+ Request["P_Name"].ToString().Trim()+ "%'";
            }
              
            string sql = "select KeyWordName,KeyPMKY from dal_EmpoweKeyWord";
            var kwDt = SqlHelper.ExecuteDataTable(sql);

          
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = "a.TMNO "; //排序必须填写
            m.strFld = " a.TMNO,a.TMName,b.EValue ";
            m.tab = " bsi_TM a left join dal_Empowe b on a.TMNO=b.TMNO ";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            System.Data.DataTable table = new System.Data.DataTable();
            table.Columns.Add("TMNO");
            table.Columns.Add("TMName");
            table.Columns.Add("EName");
            if (dt.Rows.Count>0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    string cName = "";
                    if (dt.Rows[i]["EValue"]!="")
                    {
                        var keyWordList = dt.Rows[i]["EValue"].ToString().Split(',');
                        for (int j = 0; j < keyWordList.Count(); j++)
                        {
                            for (int k = 0; k < kwDt.Rows.Count; k++)
                            {
                                if (keyWordList[j].ToString().Trim() == kwDt.Rows[k]["KeyPMKY"].ToString().Trim())
                                {
                                    cName += kwDt.Rows[k]["KeyWordName"] + ",";
                                }
                            }
                        }
                    }
                    if (cName!="")
                    {
                        cName = cName.Substring(0, cName.Length - 1);
                    }

                    try
                    {
                        table.Rows.Add(dt.Rows[i]["TMNO"], dt.Rows[i]["TMName"], cName);
                    }
                    catch (Exception e)
                    {

                        throw e;
                    }
                   
                }
            }
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, table));
        }
    }
}
