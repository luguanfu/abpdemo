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
    public class HB_ExamResultController : BaseController
    {
        //
        // GET: /Admin/HB_ExamResult/
        CommonBll commonbll = new CommonBll();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ResultIndex()
        {
            ViewData["E_Name"] = commonbll.GetListSclar("E_Name", "tb_HB_Examination", " and EId=" + Request["EId"]);
            return View();
        }
        /// <summary>
        /// 列表
        /// </summary>
        /// <returns></returns>
        public string GetList()
        {
            string wheres = " and E_IsState=1";//激活的


            wheres += " and E_AddOperator=" + UserId;

            wheres += "  and  '" + DateTime.Now + "'>E_EndTime";//已经结束的 考试

            if (Request["E_Name"] != null && Request["E_Name"].ToString().Length > 0)//考试名称
            {

                wheres += " and E_Name like '%" + Request["E_Name"].ToString() + "%'";
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
        /// 详情
        /// </summary>
        /// <returns></returns>
        public string GetListResult()
        {
            var EId = Request["EId"];
            var PId = Request["PId"];
            var descby = Request["descby"];
            string wheres = "";//激活的

            if (Request["stuinfo"] != null && Request["stuinfo"].ToString().Length > 0)
            {
                wheres += " and (Name like '%" + Request["stuinfo"].ToString() + "%' or (LoginNo like '%" + Request["stuinfo"].ToString() + "%' )";
            }
            //得出考试下的班级
            var EClassId = commonbll.GetListSclar("E_TeamId", "tb_HB_Examination", " and EId=" + EId);
            EClassId = "0" + EClassId + "0";

            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = descby; //排序必须填写
            m.strFld = "*,ROW_NUMBER() OVER(order by Scores desc,tiTime desc) as pm";
            m.tab = @"(
select Name,LoginNo,ClassName,MajorName,CollegeName,
Isnull((select ER_Score from  tb_ExaminationResult  where ER_EId=" + EId + " and ER_PId=" + PId + @" and ER_State=0 and ER_MId=a.UserId),0) as Scores ,
(select ER_AddTime from  tb_ExaminationResult  where ER_EId=" + EId + " and ER_PId=" + PId + @" and ER_State=0 and ER_MId=a.UserId) as tiTime 
from tb_Student a
 inner join tb_User b on a.UserId=b.U_ID
 inner join tb_Class c on c.C_ID=a.ClassId
 inner join tb_Major d  on d.M_ID=c.MajorId
 inner join tb_College f on f.C_ID=d.CollegeId
 where ClassId in(" + EClassId + ")) t";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));

        }

        /// <summary>
        /// 导出
        /// </summary>
        /// <returns></returns>
        public string ExportExamResult()
        {

            var EId = Request["EId"];
            var PId = Request["PId"];
            var descby = Request["descby"];
            string wheres = "";//激活的

            if (Request["stuinfo"] != null && Request["stuinfo"].ToString().Length > 0)
            {
                wheres += " and (Name like '%" + Request["stuinfo"].ToString() + "%' or (LoginNo like '%" + Request["stuinfo"].ToString() + "%' )";
            }
            //得出考试下的班级
            var EClassId = commonbll.GetListSclar("E_TeamId", "tb_HB_Examination", " and EId=" + EId);
            EClassId = "0" + EClassId + "0";

            string list = @"*,ROW_NUMBER() OVER(order by Scores desc,tiTime asc) as pm";
            string table = @"(
select (select E_Name from tb_HB_Examination where EId=" + EId + @")as EName,Name,LoginNo,CollegeName,MajorName,ClassName,
Isnull((select ER_Score from  tb_ExaminationResult  where ER_EId=" + EId + " and ER_PId=" + PId + @" and ER_State=0 and ER_MId=a.UserId),0) as Scores ,
(select ER_AddTime from  tb_ExaminationResult  where ER_EId=" + EId + " and ER_PId=" + PId + @" and ER_State=0 and ER_MId=a.UserId) as tiTime 
from tb_Student a
 inner join tb_User b on a.UserId=b.U_ID
 inner join tb_Class c on c.C_ID=a.ClassId
 inner join tb_Major d  on d.M_ID=c.MajorId
 inner join tb_College f on f.C_ID=d.CollegeId
 where ClassId in(" + EClassId + ")) t";

            DataTable dt = commonbll.GetListDatatable(list, table, wheres + " order by " + descby);//加排序

            string ExcelName = DateTime.Now.ToString("yyyyMMdd") + "" + DateTime.Now.Millisecond + "理论考核成绩";
            string filename = "/Export/" + ExcelName + ".xlsx";

            OfficeHelper officeHp = new OfficeHelper();
            var Result = officeHp.DtToExcel(dt, "理论考核成绩", new string[] { "考试名称", "学生姓名", "学生账号", "所属学院", "所属专业", "所属班级", "考试得分", "提交时间", "排名" }, "理论考核成绩", ExcelName);

            var json = new object[] {
                        new{
                            filename=filename,
                        }
                    };
            return JsonConvert.SerializeObject(json);

        }
    }
}
