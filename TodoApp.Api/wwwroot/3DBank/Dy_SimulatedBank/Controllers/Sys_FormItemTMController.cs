using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dy_SimulatedBank_DBUtility;
using Newtonsoft.Json;
using Dy_SimulatedBank.Controllers;
using System.Data.SqlClient;
using Dy_SimulatedBank.Models;
using System.Data;
using System.IO;
using System.Text.RegularExpressions;
using Aspose.Cells;
using Dy_SimulatedBank_Bll;

namespace Dy_SimulatedBank.Controllers
{
    public class Sys_FormItemTMController : BaseController
    {
        //
        // GET: /Sys_FormItemTMController/

        /***************************************************************
        FileName:菜单管理
        Copyright（c）2018-金融教育在线技术开发部
        Author:李森林
        Create Date:2018-5-9
       ******************************************************************/

        CommonBll combll = new CommonBll();

    
        
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 下拉框显示
        /// </summary>
        /// <returns></returns>
        public string Bind() {
            DataTable dt = combll.GetListDatatable("ID,ModularName", "bsi_Mode", "");
            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 菜单列表数据
        /// </summary>
        /// <returns></returns>
        public string GetList() {
            
            string wheres = " and Status=1";
            string name = Request["txtSearch"];
            string id = Request["ModeId"];//新增下拉框

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;//分页页码
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;//分页数量
            m.tab = "bsi_TM";//表名
            m.strFld = " *";//查询结果
            m.Sort = " TMNO";//排序

            if (!string.IsNullOrEmpty(Request["txtSearch"]))
            {

                wheres += " and TMName like '%" + name+ "%'";
            }
            //添加下拉框搜索
            if (Request["ModeId"]!="0")
            {

                wheres += " and ModeId ='" + id + "'";
            }
            
            m.strWhere = wheres;//条件
            int PageCount = 0;//分页总数
            var db = Pager.GetList(m, ref PageCount);//查出表格并返回总数
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, db));//返回分页集合
        }

        /// <summary>
        /// 表单列表数据
        /// </summary>
        /// <returns></returns>
        public string GetListR() {

            string wheres = " and FormId in (select TMNO from bsi_TM where TMNO=" + Request["TM_NOId"] + ") and Title like '%" + Request["TName"] + "%'";

            PageModel m = new PageModel();//分页对象
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;//页码
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;//页数
            m.tab = "bsi_FormItem";//表面
            m.strFld = " * ";//结果
            m.Sort = " ID";//排序
            m.strWhere = wheres;//条件
            int PageCount = 0;//总数
            var db = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, db));
        }


        //添加
        public string AddR() {

            var Titel = Request["txtDic_Name"];
            var ControlName = Request["txtDic_Value"];
            var FID = Request["totxtClass_Code"];
            var ISRequired = Request["ADISRequired"];
            //是否插入重复数据
            var count = combll.GetRecordCount("bsi_FormItem", "and FormId='"+FID+"' and Title ='" + Titel + "'  and ControlName='" + ControlName + "' and ISRequired=" + ISRequired + "");
            if (count>0)
            {
                return "99";
            }
            ///
            else { 
                string tb = "bsi_FormItem";
                string list = "FormId,Title,ControlName,ISRequired";
                string values = "@FormId,@Title,@ControlName,@ISRequired";
                SqlParameter[] pars = new SqlParameter[]{
                 new SqlParameter("@FormId",FID),
                 new SqlParameter("@Title",Titel),
                 new SqlParameter("@ISRequired",ISRequired),
                 new SqlParameter("@ControlName",ControlName)
                };

                var reint = combll.Add(tb, list, values, pars);

                if (reint == 1)
                {
                    return "1";
                }
                else {
                    return "99";
                }
            }
        }


        /// <summary>
        /// 删除
        /// </summary>
        /// <returns></returns>
        public string Del()
        {
            try
            { 
                var id = Request["Ids"];
                combll.DeleteInfo("bsi_FormItem", " and ID in ("+id+")");
                return "1";

            }
            catch
            {
                
                return "99";
            }
        }


        /// <summary>
        /// 获取表单值单行数据
        /// </summary>
        /// <returns></returns>
        public string GetListTableID()
        {

            DataTable dt = combll.GetListDatatable("*","bsi_FormItem", " and ID = " + Request["Id"] + "");

            return JsonConvert.SerializeObject(dt);
        }

        /// <summary>
        /// 编辑
        /// </summary>
        /// <returns></returns>
        public string Edit() {

            var id = Request["Id"];
            var FormId = Request["FormId"];
            var Titel = Request["EdittxtDic_Name"];
            var ControlName = Request["EdittxtDic_Value"];
            var EDISRequired = Request["EDISRequired"];
           

            string set = "Title=@Title,ControlName=@ControlName,ISRequired=@ISRequired";
            string wheres = " and ID=@Id";

            int reCount = combll.GetRecordCount("bsi_FormItem", "  and FormId='"+FormId+"' and Title='" + Titel + "' and ControlName='" + ControlName + "' and ISRequired=" + EDISRequired + "");

            if (reCount > 0) {
                return "99";
            }



            SqlParameter[] pars = new SqlParameter[]{
            new SqlParameter("@Title",Titel),
            new SqlParameter("@ControlName",ControlName),
            new SqlParameter("@ISRequired",EDISRequired),
            new SqlParameter("@Id",id)
            };

            var reint = combll.UpdateInfo("bsi_FormItem", set, wheres, pars);

            if (reint == 1)
            {

                return "1";
            }
            else {
                return "99";
            }
        }

        /// <summary>
        /// 批量导入
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public string Upload() {

            HttpPostedFileBase hpFile = Request.Files[0];
            string filePath = Server.MapPath("/FormItemBDUpoad/") + hpFile.FileName;
            hpFile.SaveAs(filePath);
            Aspose.Cells.Workbook wk = new Aspose.Cells.Workbook(filePath);
            string Correct = "";
            
            for (int i = 0; i < wk.Worksheets[0].Cells.Rows.Count - 2; i++)
            {
                try
                {
                    if (wk.Worksheets[0].Cells[i + 2, 0].Value != null && wk.Worksheets[0].Cells[i + 2, 1].Value != null)
                    {
                        //表单ID
                        string FormId = wk.Worksheets[0].Cells[i + 2, 0].Value.ToString().Trim();

                        //中文名
                        string Title = wk.Worksheets[0].Cells[i + 2, 1].Value.ToString().Trim();

                        //英文名
                        string ControlName = wk.Worksheets[0].Cells[i + 2, 2].Value.ToString().Trim();
                        //英文名
                        string ISRequired = wk.Worksheets[0].Cells[i + 2, 3].Value.ToString().Trim();
                        
                        //判断是否有重复
                        var count = combll.GetRecordCount("bsi_FormItem", "and Title ='" + Title + "'  and ControlName='" + ControlName + "' and ISRequired=" + ISRequired + " and FormId=" + FormId + "");
                        if (count >=1)
                        {
                            return "99";
                        }
                        else
                        {
                        
                            string StudentTable = "bsi_FormItem";
                            string StudentList = "FormId,Title,ControlName,ISRequired";
                            string StudentValue = "@FormId,@Title,@ControlName,@ISRequired";

                            SqlParameter[] Studentpars = new SqlParameter[]
                            {
                                    new SqlParameter("@FormId",FormId),
                                    new SqlParameter("@Title",Title),
                                    new SqlParameter("@ControlName",ControlName),
                                    new SqlParameter("@ISRequired",ISRequired)
                            };
                            int State = combll.Add(StudentTable, StudentList, StudentValue, Studentpars);
                            if (State > 0)
                            {
                                Correct = "1";
                            }
                        
                        }
                          
                    }
                }
#pragma warning disable CS0168 // 声明了变量“ex”，但从未使用过
                catch (Exception ex)
#pragma warning restore CS0168 // 声明了变量“ex”，但从未使用过
                {                   
                    return "99";
                }
            }
                 
            return Correct;          
        }

        /// <summary>
        /// 批量导出
        /// </summary>
        /// <returns></returns>
        public string GetExport() {

            string wheres = "and FormId= " + Request["TM_NOId"] + "";
            //if (Request["TName"].Length > 0) {
            //    wheres += "and FormId in (select TMNO from bsi_TM where TMNO=" + Request["TM_NOId"] + ") and Title like '%" + Request["TName"] + "%' and FormId= " + Request["TM_NOId"] + " ";
            //}

            //获取表格
            DataTable dt = combll.GetListDatatable("FormId,Title,ControlName,ISRequired", "bsi_FormItem", wheres);
            OfficeHelper officeHp = new OfficeHelper();
            //定义文件名
            string ExFileName = "表单字典" + DateTime.Now.ToString("yyyyMMdd");
            //导出Excel
            var Result = officeHp.DtToExcel(dt, "BSI保险系统字典", new string[] { "表单ID", "中文名", "英文名", "是否必填" }, "表单字典", ExFileName);
            if (Result.Equals("SUCCESS"))
            {
                return "/Export/" + ExFileName + ".xlsx";
            }
            else
            {
                return Result;
            }
        }
    }
}
