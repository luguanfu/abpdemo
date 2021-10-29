using Dy_SimulatedBank.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank_Bll;
using System.Data.SqlClient;
using Dy_SimulatedBank_DBUtility.Sql;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class CurriculumController : BaseController
    {
        /***************************************************************
          FileName:BSI_保险
          Copyright（c）2018-金融教育在线技术开发部
          Author:邵
          Create Date:2018-5月15号
          ******************************************************************/
        CommonBll commBll = new CommonBll();
        public ActionResult Index()
        {
            return View();
        }

        #region 1.0 获取课程列表
        public string GetList()
        {
            string wheres = " ";
           
            if (UserType != 1)
            {
                wheres += "  and AddUserId=" + UserId + "";
            }
            if (UserType == 2)
            {
                wheres += " and  (AddUserId= " + UserId + " or CurrType=1) ";
            }
            if (UserType == 1)
            {
                wheres += wheres += "  and AddUserId=" + UserId + " and CurrType=1";
            }
            //查询条件
            if (Request["CurriculumName"].Length > 0)
            {
                wheres += " and CurriculumName like '%" + Request["CurriculumName"] + "%'";
            }
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " Sort asc"; //排序必须填写
            m.strFld = @" *,'"+UserId+"'as UserId ";
            m.tab = @"bsi_Curriculum";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));

        }
        #endregion

        #region 2.0 删除
        public int Del()
        {
            string id = Request["Ids"];
            string Sort = Request["Sort"];
            try
            {
                //删除课程，删除章，删除节
                commBll.DeleteInfo("bsi_Curriculum", " and ID in(" + id + ")");
                DataTable dt = commBll.GetListDatatable("*", "bsi_Curriculum", " and Sort>" + Sort + "");
                if (dt.Rows.Count > 0)
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        commBll.UpdateInfo("bsi_Curriculum", "Sort=Sort-1", " and id=" + dt.Rows[i]["id"] + "");
                    }
                }
                return 1;
            }
            catch
            {
                return 99;
            }
        }
        #endregion

        #region 3.0启用和禁用
        public int Enable()
        {
            string ids = Request["Ids"];
            string State = Request["State"];

            string table = "bsi_Curriculum"; //表名
            string Set = "State=@State";

            SqlParameter[] pars = new SqlParameter[]
           {
                new SqlParameter("@State",State),

           };

            var resultcount = commBll.UpdateInfo(table, Set, " and ID in(" + ids + ")", pars);
            if (resultcount > 0)
            {
                return 1;
            }
            else
            {
                return -1;
            }

        }
        #endregion

        #region 4.0 上移下移
        public string Move()
        {
            try
            {
                string id = Request["Id"];
                string Type = Request["Type"];
                //1.0 查出当前序号
                var Sort = Convert.ToInt32(commBll.GetListSclar("Sort", "bsi_Curriculum", " and ID=" + id + ""));
                var MaxSort = Convert.ToInt32(commBll.GetListSclar("Max(Sort)", "bsi_Curriculum",""));
                string sql = "";
                if (Type=="+1")//下移
                {
                    //判断当前的数据是不是最后一条
                    if (Sort != MaxSort)
                    {
                        //下一条的序号-1
                        sql += "update bsi_Curriculum set Sort=Sort-1 where Sort="+(Sort+1)+"";
                        //当这条的序号+1
                        sql += @" update bsi_Curriculum set Sort=Sort+1 where ID="+id+"";
                        SqlHelper.ExecuteNonQuery(sql);
                    }
                    else
                    {
                        //已是最后一条
                        return "-1";
                    }
                }
                if (Type=="-1")//上移
                {
                    if (Sort != 1)
                    {
                        //上一条的序号+1
                        sql += "update bsi_Curriculum set Sort=Sort+1 where Sort=" + (Sort-1)+" ";
                        sql += @" update bsi_Curriculum set Sort=Sort-1 where ID=" + id+"";
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
        /// 预览
        /// </summary>
        /// <returns></returns>
        public string GetSectionList()
        {
            string CurriculumID = Request["CurriculumID"]; 
            string strwhere = " and a.CurriculumID=" + CurriculumID;

            var Curriculum = Base_Common().GetListDatatable(" top 1 a.ID,a.Cover,a.CurriculumName,a.Synopsis ", " bsi_Curriculum a ", " and a.ID=" + CurriculumID);

            var Chapter = Base_Common().GetListDatatable("a.ID,a.ResourcesName as Name,(select COUNT(1) from bsi_Resources r where r.CurriculumID=a.CurriculumID and r.ChapterID=a.ID) as COUResources,(select COUNT(1) from bsi_ResourceRecord r inner join  bsi_Resources b on r.ResourcesID=b.ID where r.CurriculumID=a.CurriculumID and r.ChapterID=a.ID  and b.ChapterID=r.ChapterID  and r.UserID=" + UserId + ") as COUResourceRecord", " bsi_Chapter a ", strwhere + " order by a.Sort");
            var Section = Base_Common().GetListDatatable("a.ID,a.ChapterID,a.SectionName as Name ", " bsi_Section a left join bsi_Chapter c on c.id=a.ChapterID", strwhere + " order by a.Sort");
            var PracticeAssessment = Base_Common().GetListDatatable(" a.SectionId,a.ChapterId,a.CourseId,a.ForeignkeyId,b.PracticeName,b.Id ", " bsi_ExercisePracticeChapters a inner join bsi_PracticeAssessment b on  a.ForeignkeyId = b.ID", " and  a.Types=2 and CourseId = " + CurriculumID);

            var tb = new
            {
                Curriculum = Curriculum,
                Chapter = Chapter,
                Section = Section, 
                PracticeAssessment = PracticeAssessment,
            };

            return JsonConvert.SerializeObject(tb);
        }
    }
}
