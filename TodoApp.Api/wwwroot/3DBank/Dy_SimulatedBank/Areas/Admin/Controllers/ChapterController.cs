using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank.Models;
using Dy_SimulatedBank_Bll;
using Dy_SimulatedBank_DBUtility.Sql;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class ChapterController : BaseController
    {
        /***************************************************************
            FileName:BSI_保险 课程-章节
            Copyright（c）2018-金融教育在线技术开发部
            Author:邵
            Create Date:2018-5月18号
            ******************************************************************/
        CommonBll commBll = new CommonBll();
        public ActionResult Index()
        {
            return View();
        }

        #region 1.0  新增章
        public int Add()
        {
            string id = Request["Cid"];
            string txtChapter_Name = Request["txtChapter_Name"];

            DataTable SortDt = commBll.GetListDatatable("select Max(Sort) as Sort from bsi_Chapter");
            int Sort = 0;
            if (SortDt.Rows.Count > 0)
            {
                try
                {
                    Sort = Convert.ToInt32(SortDt.Rows[0]["Sort"]) + 1;
                }
                catch
                {
                    Sort = 0;
                }

            }
            else
            {
                Sort = 0;
            }
            //检查是否存在同名课程
            DataTable NameDt = commBll.GetListDatatable("select * from bsi_Chapter where CurriculumID=" + id + " and ResourcesName='" + txtChapter_Name + "'");
            if (NameDt.Rows.Count > 0)
            {
                return -2;
            }
            string table = "bsi_Chapter";
            string List = "CurriculumID,ResourcesName,Sort,AddUserId,AddTime";
            string value = "@CurriculumID,@ResourcesName,@Sort,@AddUserId,@AddTime";
            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@CurriculumID",id),
                new SqlParameter("@ResourcesName",txtChapter_Name),
                new SqlParameter("@Sort",Sort),
                new SqlParameter("@AddUserId",UserId),
                new SqlParameter("@AddTime",DateTime.Now ),
            };
            var Stateid = commBll.AddIdentity(table, List, value, pars);
            return Convert.ToInt32(Stateid);
        }
        #endregion

        #region 2.0 获取章列表
        public string GetList()
        {
            string Curriculumid = Request["Cid"];
            string wheres = " ";
            if (Curriculumid!=""||Curriculumid!=null)
            {
                wheres += " and CurriculumID="+Curriculumid+"";
            }
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = "  Sort asc"; //排序必须填写
            m.strFld = @" * ";
            m.tab = @"bsi_Chapter";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }
        #endregion

        #region 3.0 获取修改数据
        public string GetListEdit()
        {
            string id = Request["id"];
            DataTable dt = commBll.GetListDatatable("select * from bsi_Chapter where ID=" + id + "");
            return JsonConvert.SerializeObject(dt);
        }
        #endregion

        #region 4.0 保存修改的章
        public int EditBtnSubim()
        {
            string id = Request["Cid"];
            string txtChapter_Name = Request["txtChapter_Name"];

            string table = "bsi_Chapter"; //表名
            string Set = "ResourcesName=@ResourcesName";


            //检查章是否存在
            var count = commBll.GetRecordCount("bsi_Chapter", " and ResourcesName='" + txtChapter_Name + "' and ID!=" + id);
            if (count > 0)
            {
                return -2;

            }

            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@ResourcesName",txtChapter_Name),
            };
            var resultcount = commBll.UpdateInfo(table, Set, " and ID="+ id + "", pars);
            if (resultcount == 1)
            {
                return 1;
            }
            else
            {
                return -1;
            }
        }
        #endregion

        #region 5.0 删除章
        public int Del()
        {
            string id = Request["Ids"];
            try
            {
                //删除章
                commBll.DeleteInfo("bsi_Chapter", " and ID in(" + id + ")");
                //删除节
                commBll.DeleteInfo("bsi_Section", " and ChapterID in(" + id + ")");

                return 1;
            }
            catch
            {
                return 99;
            }
        }
        #endregion

        #region  6.0 获取章名称
        public string GetChapterName()
        {
            string ChapterId = Request["ChapterId"];
            var Dt = commBll.GetListDatatable("select * from bsi_Chapter where ID="+ ChapterId + "");
            string Str = "";
            if (Dt.Rows.Count>0)
            {
                Str = Dt.Rows[0]["ResourcesName"].ToString();
            }
            return Str;
            
        }
        #endregion

        #region 7.0 新增节名称
        public int AddSection()
        {
            string id = Request["Cid"];
            string txt_Section = Request["txt_Section"];
            string publicChapterId = Request["publicChapterId"];

            DataTable SortDt = commBll.GetListDatatable("select Max(Sort) as Sort from bsi_Section");
            int Sort = 0;
            if (SortDt.Rows.Count > 0)
            {
                try
                {
                    Sort = Convert.ToInt32(SortDt.Rows[0]["Sort"]) + 1;
                }
                catch
                {
                    Sort = 0;
                }

            }
            else
            {
                Sort = 0;
            }
            //检查是否存在同名课程
            DataTable NameDt = commBll.GetListDatatable("select * from bsi_Section where SectionName='" + txt_Section + "' and ChapterID="+ publicChapterId + " and CurriculumID="+ id + "");
            if (NameDt.Rows.Count > 0)
            {
                return -2;
            }
            string table = "bsi_Section";
            string List = "ChapterID,SectionName,Sort,AddUserId,AddTime,CurriculumID";
            string value = "@ChapterID,@SectionName,@Sort,@AddUserId,@AddTime,@CurriculumID";
            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@ChapterID",publicChapterId),
                new SqlParameter("@SectionName",txt_Section),
                new SqlParameter("@Sort",Sort),
                new SqlParameter("@AddUserId",UserId),
                new SqlParameter("@AddTime",DateTime.Now ),
                new SqlParameter("@CurriculumID",id),
            };
            var Stateid = commBll.AddIdentity(table, List, value, pars);
            return Convert.ToInt32(Stateid);
        }
        #endregion

        #region 8.0 加载节的列表
        public string GetSectionList()
        {
            string Sectionid = Request["publicChapterId"];
            var dt = commBll.GetListDatatable("*","bsi_Section", "and ChapterID=" + Sectionid + "ORDER BY Sort ASC");
            return JsonConvert.SerializeObject(dt);
        }
        #endregion

        #region 9.0 根据节名称获取课程名称
        public string GetSectionListEdit()
        {
            string id = Request["id"];
            DataTable dt = commBll.GetListDatatable("select *,(select SectionName from bsi_Section where ID=" + id + ") as SectionName from bsi_Chapter where ID=(select ChapterID from bsi_Section where ID=" + id + ")");
            return JsonConvert.SerializeObject(dt);
        }
        #endregion

        #region 10.0修改节保存
        public int EditSection()
        {
            string txt_Section = Request["txt_Section"];
            string Sectionid = Request["Sectionid"];

            string table = "bsi_Section"; //表名
            string Set = "SectionName=@SectionName";
            //检查章是否存在
            //var count = commBll.GetRecordCount("bsi_Section", " and SectionName='" + txt_Section + "' and ID!=" + Sectionid);
            //if (count > 0)
            //{
            //    return -2;

            //}

            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@SectionName",txt_Section),
            };
            var resultcount = commBll.UpdateInfo(table, Set, " and ID=" + Sectionid + "", pars);
            if (resultcount == 1)
            {
                return 1;
            }
            else
            {
                return -1;
            }
        }
        #endregion

        #region 11.0 删除节
        public int DelSection()
        {
            string id = Request["Ids"];
            try
            {
                //删除节
                commBll.DeleteInfo("bsi_Section", " and ID in(" + id + ")");

                return 1;
            }
            catch
            {
                return 99;
            }
        }
        #endregion

        #region 12.0 章上移下移
        public string Move()
        {
            try
            {
                string Curriculumid = Request["Curriculumid"];
                string id = Request["Id"];
                string Type = Request["Type"];
                //1.0 查出当前序号
                var Sort = Convert.ToInt32(commBll.GetListSclar("Sort", "bsi_Chapter", " and ID=" + id + ""));
                var MaxSort = Convert.ToInt32(commBll.GetListSclar("Max(Sort)", "bsi_Chapter", " and CurriculumID=" + Curriculumid + ""));
                string sql = "";
                if (Type == "+1")//下移
                {
                    //判断当前的数据是不是最后一条
                    if (Sort != MaxSort)
                    {
                        //下一条的序号-1
                        sql += "update bsi_Chapter set Sort=Sort-1 where Sort=" + (Sort + 1) + "";
                        //当这条的序号+1
                        sql += @" update bsi_Chapter set Sort=Sort+1 where ID=" + id + "";
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
                        sql += "update bsi_Chapter set Sort=Sort+1 where Sort=" + (Sort - 1) + " ";
                        sql += @" update bsi_Chapter set Sort=Sort-1 where ID=" + id + "";
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

        #region 13.0 节上移下移
        public string SectionMove()
        {
            try
            {
                string Curriculumid = Request["Curriculumid"];
                string Chapterid = Request["Chapterid"];
                string id = Request["Id"];
                string Type = Request["Type"];
                //1.0 查出当前序号
                var Sort = Convert.ToInt32(commBll.GetListSclar("Sort", "bsi_Section", " and ID=" + id + ""));
                var MaxSort = Convert.ToInt32(commBll.GetListSclar("Max(Sort)", "bsi_Section", " and CurriculumID="+ Curriculumid + " and ChapterID="+ Chapterid + ""));
                string sql = "";
                if (Type == "+1")//下移
                {
                    //判断当前的数据是不是最后一条
                    if (Sort != MaxSort)
                    {
                        //下一条的序号-1
                        sql += "update bsi_Section set Sort=Sort-1 where Sort=" + (Sort + 1) + "";
                        //当这条的序号+1
                        sql += @" update bsi_Section set Sort=Sort+1 where ID=" + id + "";
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
                        sql += "update bsi_Section set Sort=Sort+1 where Sort=" + (Sort - 1) + " ";
                        sql += @" update bsi_Section set Sort=Sort-1 where ID=" + id + "";
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
    }
}
