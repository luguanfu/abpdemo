using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank.Models;
using Dy_SimulatedBank_Bll;
using Dy_SimulatedBank_DBUtility;
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
    public class Resources_AddController : BaseController
    {
        CommonBll commBll = new CommonBll();
        /***************************************************************
          FileName:BSI_保险:课件管理-新增
          Copyright（c）2018-金融教育在线技术开发部
          Author:邵(编写)，李林燊(修改)
          Create Date:2018-5月15号
          ******************************************************************/

        public ActionResult Index()
        {
            var rid = Request["Id"];

            ViewData["ResourcesName"] = " ";
            var dt = commBll.GetListDatatable("*", "bsi_Resources", " and ID=" + rid + "");
            if (dt.Rows.Count > 0)
            {
                ViewData["ResourcesName"] = dt.Rows[0]["ResourcesName"];

            }

            return View();
        }
        #region 1.0上传新课件
        
        public string Upload()
        {
            string AbilityandScore = Request["AbilityandScore"];
            double FileSize = 0;
            string imgName = string.Empty;
            //课程id
            string Curriculumid = Request["Curriculumid"];
            //章id
            string Chapterid = Request["Chapterid"];
            //课程节id
            string SectionId = Request["iid"];
            string url = string.Empty;
            string filePath = string.Empty;
            string CourseName = Request["txtTitle"];
            HttpPostedFileBase hpFile = Request.Files["upfile"];

            //rid=0表示新增，大于0表示编辑
            var rid = Convert.ToInt32(Request["ReId"]);

            //1.0判断文件是否为空
            if (hpFile != null)
            {
                //1.1获取文件后缀名
                string FileType = System.IO.Path.GetExtension(hpFile.FileName);
                //1.2获取路径
                string FileName = Path.GetFileName(hpFile.FileName).Replace(FileType, "").Replace(".", "") + FileType;

                url = ResourceConversionURL(FileName);

                filePath = Server.MapPath(url);
                hpFile.SaveAs(filePath);
                //获取文件大小
                System.IO.FileInfo fileinfo = new System.IO.FileInfo(Server.MapPath(url));
                FileSize = System.Math.Ceiling(fileinfo.Length / 1024.0);
                LicenseHelper.ModifyInMemory.ActivateMemoryPatching();
                if (FileType == ".pptx" || FileType == ".ppt")
                {
                    if (rid > 0)
                    {
                        int j = 0;
                        j = Edit(Curriculumid, Chapterid, SectionId, CourseName, FileType, url, rid, AbilityandScore);
                        if (j > 0)
                        {
                            return "1";
                        }
                        else if (j == -2)
                        {
                            return "999";
                        }
                        else
                        {
                            return "0";
                        }
                    }
                    int i = 0;
                    i = Add(Curriculumid, Chapterid, SectionId, CourseName, FileType, url, rid, AbilityandScore);
                    if (i > 0)
                    {
                        return "1";
                    }
                    else if (i == -2)
                    {
                        return "999";
                    }
                    else
                    {
                        return "0";
                    }
                }
                else if (FileType == ".mp4")
                {
                    if (FileSize > 0)
                    {
                        if (rid > 0)
                        {
                            int j = 0;
                            j = Edit(Curriculumid, Chapterid, SectionId, CourseName, FileType, url, rid, AbilityandScore);
                            if (j > 0)
                            {
                                return "1";
                            }
                            else if (j == -2)
                            {
                                return "999";
                            }
                            else
                            {
                                return "0";
                            }
                        }
                        int i = 0;
                        i = Add(Curriculumid, Chapterid, SectionId, CourseName, FileType, url, rid, AbilityandScore);
                        if (i > 0)
                        {
                            return "1";
                        }
                        else if (i == -2)
                        {
                            return "999";
                        }
                        else
                        {
                            return "0";
                        }
                    }
                }
                else
                {
                    return "-1";
                }
            } else if (rid>0&& hpFile==null)
            {
                if (rid > 0)
                {
                    int j = 0;
                    j = NullFileEdit(Curriculumid, Chapterid, SectionId,CourseName,rid,AbilityandScore);
                    if (j > 0)
                    {
                        return "1";
                    }
                    else if (j == -2)
                    {
                        return "999";
                    }
                    else
                    {
                        return "0";
                    }
                }
            }
            return "";
        }
        #endregion
        #region 2.0资源路径转换
        /// <summary>
        /// 资源路径转换
        /// </summary>
        /// <param name="resname">文件名称</param>
        /// <returns>返回路径</returns>
        public string ResourceConversionURL(string resname)
        {
            //文件夹名称
            string wjjname = "";
            //后缀
            string hz = resname.Split('.')[1];
            hz = hz.ToLower();//转小写
            if (hz == "doc" || hz == "docx")
            {
                wjjname = "word";//文件夹名称
            }
            if (hz == "xls" || hz == "xlsx")
            {
                wjjname = "excel";
            }
            if (hz == "ppt" || hz == "pptx")
            {
                wjjname = "ppt";
            }
            //图片
            if (hz == "gif" || hz == "bmp" || hz == "jpg" || hz == "jpeg"
                || hz == "tif" || hz == "png" || hz == "pcx")
            {
                wjjname = "img";
            }
            if (hz == "txt")
            {
                wjjname = "txt";
            }
            if (hz == "pdf")
            {
                wjjname = "pdf";
            }
            //视频
            if (hz == "swf" || hz == "mp3" || hz == "mp4" || hz == "rm"
                || hz == "rmvb" || hz == "wmv" || hz == "avi"
                 || hz == "3gp" || hz == "mkv" || hz == "flv")
            {
                wjjname = "mp4";
            }
            return "/Resources/" + wjjname + "/" + resname;
        }
        #endregion


        #region 3.0获取选中课程列表
        //public string Choice_curriculum()
        //{
        //    string wheres = " ";
        //    string CurriculumName = Request["CurriculumName"];
        //    if (CurriculumName != "" || CurriculumName != null)
        //    {
        //        wheres += " and  CurriculumName like '%" + CurriculumName + "%'";
        //    }
        //    PageModel m = new PageModel();
        //    m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
        //    m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
        //    m.Sort = "  Sort asc"; //排序必须填写
        //    m.strFld = @" * ";
        //    m.tab = @"bsi_Curriculum";
        //    m.strWhere = wheres;
        //    int PageCount = 0;//总数
        //    var dt = Pager.GetList(m, ref PageCount);
        //    return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        //}
        #endregion
        #region 4.0获取课程下的章
        public string Choice_Chapter()
        {
            string CurriculumID = Request["Choiceid"];
            string wheres = "";
            if (CurriculumID != null || CurriculumID != "")
            {
                wheres += " and CurriculumID=" + CurriculumID + "";
            }
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = "  C.Sort asc"; //排序必须填写
            m.strFld = @" C.*,U.CurriculumName ";
            m.tab = @"bsi_Chapter C left join bsi_Curriculum U on C.CurriculumID=U.ID";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }
        #endregion

        #region 5.0 获取章下的节名称
        public string Chapter_Section()
        {
            string Chapterid = Request["Chapterid"];
            string wheres = "" ;
            if (Chapterid != null || Chapterid != "")
            {
                wheres += " and ChapterID=" + Chapterid + "";
            }
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = "  C.Sort asc"; //排序必须填写
            m.strFld = @" C.*,U.ResourcesName ";
            m.tab = @"bsi_Section C left join bsi_Chapter U on C.ChapterID=U.ID";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }
        #endregion

        #region 6.0 保存数据
        public int Add(string Curriculumid, string Chapterid, string SectionId, string CourseName, string FileType, string Url, int RID, string AbilityandScore)
        {
            //检查是否存在同名课程
            DataTable NameDt = commBll.GetListDatatable("select * from bsi_Resources where ResourcesName='" + CourseName + "'");
            if (NameDt.Rows.Count > 0)
            {
                return -2;
            }
            string table = "bsi_Resources";
            string List = "";
            string value = "";
            var Stateid = 0;
            if (FileType == ".mp4")
            {
                List = "CurriculumID,ChapterID,SectionID,ResourcesName,Type,URL,AddUserId,AddTime";
                value = "@CurriculumID,@ChapterID,@SectionID,@ResourcesName,@Type,@URL,@AddUserId,@AddTime";
                SqlParameter[] pars = new SqlParameter[]
                {
                new SqlParameter("@CurriculumID",Curriculumid),
                new SqlParameter("@ChapterID",Chapterid),
                new SqlParameter("@SectionID",SectionId),
                new SqlParameter("@ResourcesName",CourseName),
                new SqlParameter("@Type",FileType),
                new SqlParameter("@URL",Url),
                new SqlParameter("@AddUserId",UserId),
                new SqlParameter("@AddTime",DateTime.Now ),
                };
                Stateid = Convert.ToInt32(commBll.AddIdentity(table, List, value, pars));
            }
            if (FileType == ".pptx" || FileType == ".ppt")
            {

                List = "CurriculumID,ChapterID,SectionID,ResourcesName,Type,OriginalUrl,AddUserId,AddTime";
                value = "@CurriculumID,@ChapterID,@SectionID,@ResourcesName,@Type,@OriginalUrl,@AddUserId,@AddTime";
                SqlParameter[] pars = new SqlParameter[]
                {
                new SqlParameter("@CurriculumID",Curriculumid),
                new SqlParameter("@ChapterID",Chapterid),
                new SqlParameter("@SectionID",SectionId),
                new SqlParameter("@ResourcesName",CourseName),
                new SqlParameter("@Type",FileType),
                new SqlParameter("@OriginalUrl",Url),
                new SqlParameter("@AddUserId",UserId),
                new SqlParameter("@AddTime",DateTime.Now ),
                };
                Stateid = Convert.ToInt32(commBll.AddIdentity(table, List, value, pars));
            }
            #region 能力分值表修改
            //获取对应能力及分值
            if (AbilityandScore != "")
            {
                commBll.DeleteInfo("tb_CoursewareAbility", " and ResourcesId=" + Stateid);
                var strlist = AbilityandScore.Split(',');
                for (int i = 0; i < strlist.Length; i++)
                {
                    string tables = "tb_CoursewareAbility"; //表名
                    string lists = "ResourcesId, AbilityId, CAScore, AddUserId, AddTime";//列
                    string vla = "@ResourcesId, @AbilityId, @CAScore, @AddUserId, @AddTime";
                    var postlist = strlist[i];
                    var ability = postlist.Split('-')[0];//能力
                    var score = postlist.Split('-')[1];//分数
                    //新增
                    SqlParameter[] par = new SqlParameter[]
                    {
                        new SqlParameter("@ResourcesId",Stateid),
                        new SqlParameter("@AbilityId",ability),
                        new SqlParameter("@CAScore",score),
                        new SqlParameter("@AddUserId",UserId),
                        new SqlParameter("@AddTime",DateTime.Now)
                    };
                    var resultcounts = commBll.Add(tables, lists, vla, par);
                }
            }
            #endregion
            return Convert.ToInt32(Stateid);
        }
        #endregion

        //编辑
        public int Edit(string Curriculumid, string Chapterid, string SectionId, string CourseName, string FileType, string Url, int RID, string AbilityandScore)
        {

            //检查该课程，该章节，该节下是否存在同名课程
            DataTable NameDt = commBll.GetListDatatable("select * from bsi_Resources where ResourcesName='" + CourseName + "' and CurriculumID="+ Curriculumid + " and ChapterID="+ Chapterid + " and SectionID="+ SectionId + " and ID!="+ RID + "");
            if (NameDt.Rows.Count > 0)
            {
                return -2;
            }
            string table = "";
            string set = "";
            SqlParameter[] parsup = null;
            if (FileType == ".mp4")
            {
                table = "bsi_Resources";
                set = "CurriculumID=@CurriculumID,ChapterID=@ChapterID,SectionID=@SectionID,ResourcesName=@ResourcesName,Type=@Type,URL=@URL,AddUserId=@AddUserId,AddTime=@AddTime";
                parsup = new SqlParameter[]
                {
                new SqlParameter("@CurriculumID",Curriculumid),
                new SqlParameter("@ChapterID",Chapterid),
                new SqlParameter("@SectionID",SectionId),
                new SqlParameter("@ResourcesName",CourseName),
                new SqlParameter("@Type",FileType),
                new SqlParameter("@URL",Url),
                new SqlParameter("@AddUserId",UserId),
                new SqlParameter("@AddTime",DateTime.Now )
                };
            }

            if (FileType == ".pptx" || FileType == ".ppt")
            {
                table = "bsi_Resources";
                set = "CurriculumID=@CurriculumID,ChapterID=@ChapterID,SectionID=@SectionID,ResourcesName=@ResourcesName,Type=@Type,URL=@URL,OriginalUrl=@OriginalUrl,AddUserId=@AddUserId,AddTime=@AddTime";
                parsup = new SqlParameter[]
                {
                new SqlParameter("@CurriculumID",Curriculumid),
                new SqlParameter("@ChapterID",Chapterid),
                new SqlParameter("@SectionID",SectionId),
                new SqlParameter("@ResourcesName",CourseName),
                new SqlParameter("@Type",FileType),
                 new SqlParameter("@URL",null),
                new SqlParameter("@OriginalUrl",Url),
                new SqlParameter("@AddUserId",UserId),
                new SqlParameter("@AddTime",DateTime.Now )
                };
            }
            var Stateid = commBll.UpdateInfo(table, set, " and ID=" + RID + "", parsup);


            #region 能力分值表修改
            var checkcount = commBll.DeleteInfo("tb_CoursewareAbility", " and ResourcesId=" + RID);
            //获取对应能力及分值
            if (AbilityandScore != "")
            {
                var strlist = AbilityandScore.Split(',');
                for (int i = 0; i < strlist.Length; i++)
                {
                    string tables = "tb_CoursewareAbility"; //表名
                    string lists = "ResourcesId, AbilityId, CAScore, AddUserId, AddTime";//列
                    string vla = "@ResourcesId, @AbilityId, @CAScore, @AddUserId, @AddTime";
                    var postlist = strlist[i];
                    var ability = postlist.Split('-')[0];//能力
                    var score = postlist.Split('-')[1];//分数

                    //新增
                    SqlParameter[] par = new SqlParameter[]
                    {
                    new SqlParameter("@ResourcesId",RID),
                    new SqlParameter("@AbilityId",ability),
                    new SqlParameter("@CAScore",score),
                    new SqlParameter("@AddUserId",UserId),
                    new SqlParameter("@AddTime",DateTime.Now)
                    };
                    var resultcounts = commBll.Add(tables, lists, vla, par);
                }
            }
            #endregion
            return Convert.ToInt32(Stateid);
        }

        public int NullFileEdit(string Curriculumid, string Chapterid, string SectionId, string CourseName,int rid, string AbilityandScore)
        {
           string table = "bsi_Resources";
           string set = "CurriculumID=@CurriculumID,ChapterID=@ChapterID,SectionID=@SectionID,ResourcesName=@ResourcesName,AddUserId=@AddUserId,AddTime=@AddTime";
            SqlParameter[] parsup = new SqlParameter[]
            {
                new SqlParameter("@CurriculumID",Curriculumid),
                new SqlParameter("@ChapterID",Chapterid),
                new SqlParameter("@SectionID",SectionId),
                new SqlParameter("@ResourcesName",CourseName),
                new SqlParameter("@AddUserId",UserId),
                new SqlParameter("@AddTime",DateTime.Now )
            };
            var Stateid = commBll.UpdateInfo(table, set, " and ID=" + rid + "", parsup);

            #region 能力分值表修改
            //获取对应能力及分值
            if (AbilityandScore != "")
            {
                commBll.DeleteInfo("tb_CoursewareAbility", " and ResourcesId=" + rid);
                var strlist = AbilityandScore.Split(',');
                for (int i = 0; i < strlist.Length; i++)
                {
                    string tables = "tb_CoursewareAbility"; //表名
                    string lists = "ResourcesId, AbilityId, CAScore, AddUserId, AddTime";//列
                    string vla = "@ResourcesId, @AbilityId, @CAScore, @AddUserId, @AddTime";
                    var postlist = strlist[i];
                    var ability = postlist.Split('-')[0];//能力
                    var score = postlist.Split('-')[1];//分数
                    //新增
                    SqlParameter[] par = new SqlParameter[]
                    {
                        new SqlParameter("@ResourcesId",rid),
                        new SqlParameter("@AbilityId",ability),
                        new SqlParameter("@CAScore",score),
                        new SqlParameter("@AddUserId",UserId),
                        new SqlParameter("@AddTime",DateTime.Now)
                    };
                    var resultcounts = commBll.Add(tables, lists, vla, par);
                }
            }
            #endregion

            return Convert.ToInt32(Stateid);
        }
        /// <summary>
        /// 李林燊
        /// </summary>
        /// <returns></returns>
        #region 7.0 获取课程名称
        public string GetCurriculumList()
        {
            string wheres = " ";
            DataTable dt = commBll.GetListDatatable("*", "bsi_Curriculum", wheres);

            return JsonConvert.SerializeObject(dt);
        }
        #endregion

        #region 8.0 获取章名称
        public string Getchapter()
        {
            var curriculumid = Request["curriculumid"];
            DataTable dt = commBll.GetListDatatable("*", "bsi_Chapter", "and CurriculumID='" + curriculumid + "'");
            return JsonConvert.SerializeObject(dt);
        }
        #endregion

        #region 9.0 获取节名称
        public string GetSection()
        {
            var checkchapter = Request["checkchapter"];
            DataTable dt = commBll.GetListDatatable("*", "bsi_Section", "and ChapterID='" + checkchapter + "'");
            return JsonConvert.SerializeObject(dt);
        }
        #endregion

        #region 10.0获取选中课程列表
        public string Choice_curriculum()
        {
            //只获取当前账号创建的课程章节
            string wheres="";
            if (UserType==1)
            {
                wheres = " and c.AddUserId= " + UserId + " and State=1 ";
            }
            if (UserType == 2)
            {
                wheres = " and (c.AddUserId= " + UserId + " or c.CurrType=1) and State=1 ";
            }
            string CurriculumName = Request["CurriculumName"];
            string checkcurriculum = Request["checkcurriculum"];
            string checkchapter = Request["checkchapter"];
            string checksection = Request["checksection"];
            if (checkcurriculum != "" && checkchapter == "")
            {
                wheres += " and c.ID =" + checkcurriculum;
            }
            if (checkcurriculum != "" && checkchapter != "" && checksection == "")
            {
                wheres += " and c.ID =" + checkcurriculum + " and b.ID =" + checkchapter;
            }
            if (checkcurriculum != "" && checkchapter != "" && checksection != "")
            {
                wheres += " and c.ID =" + checkcurriculum + " and b.ID =" + checkchapter + " and a.ID=" + checksection;
            }
            if (CurriculumName != "" || CurriculumName != null)
            {
                wheres += " and CurriculumName like '%" + CurriculumName + "%'";
            }
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " a.Sort asc"; //排序必须填写
            m.strFld = @" a.ID as ID,a.Sort,c.CurriculumName,b.ResourcesName,a.SectionName,b.ID as checkchapterid,c.ID as checkcurriculumid";
            m.tab = @"bsi_Section a
 inner join bsi_Chapter b on b.ID=a.ChapterID
 inner join bsi_Curriculum c on b.CurriculumID=c.ID";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }
        #endregion

        #region 11.0 一键转图
        public string Transformation()
        {
            //接收要转换的id
            string ids = Request["Ids"];
            var strid = ids.Split(',');
            string imgUrl = "/Resources/img/Map";
            string imgState = string.Empty;
            string filePath = string.Empty;
            string url = string.Empty;
            string FileType = string.Empty;
            for (int i = 0; i < strid.Length; i++)
            {
                DataTable dt = commBll.GetListDatatable("*", "bsi_Resources", " and ID=" + strid[i] + "");
                if (dt.Rows.Count > 0)
                {
                    if ((dt.Rows[0]["Type"].ToString() == ".pptx" || dt.Rows[0]["Type"].ToString() == ".ppt") && dt.Rows[0]["URL"].ToString() == "")
                    {

                        url = dt.Rows[0]["OriginalUrl"].ToString();
                        filePath = Server.MapPath(url);
                        FileType = dt.Rows[0]["Type"].ToString();
                        //调用转图片的方法
                        PictureConversion pc = new PictureConversion();
                        imgState = pc.ConvertToImage_PPT(filePath, Server.MapPath(imgUrl), 0, 0, 145, FileType, imgUrl);
                        if (imgState == "888")
                        {
                            imgState = "888";
                        }
                        else
                        {
                            commBll.UpdateInfo("bsi_Resources", "URL='" + imgState + "'", " and ID=" + strid[i] + "");
                            imgState = "1";
                        }
                    }
                }
            }

            return imgState;
        }
        #endregion

        #region 12.0 获取选中课程的章节名称
        public string UpdateChapterState()
        {
            //节id
            string Sectionid = Request["iid"];
            //课程id
            string Curriculumid = Request["Curriculumid"];
            //章id
            string Chapterid = Request["Chapterid"];
            string Text = "";
            DataTable dt1 = commBll.GetListDatatable("CurriculumName", "bsi_Curriculum", " and ID=" + Curriculumid + "");
            DataTable dt2 = commBll.GetListDatatable("ResourcesName", "bsi_Chapter", " and ID=" + Chapterid + "");
            DataTable dt3 = commBll.GetListDatatable("SectionName", "bsi_Section", " and ID=" + Sectionid + "");
            if (dt1.Rows.Count > 0 && dt2.Rows.Count > 0 && dt3.Rows.Count > 0)
            {
                Text = dt1.Rows[0]["CurriculumName"].ToString() + "_" + dt2.Rows[0]["ResourcesName"].ToString() + "_" + dt3.Rows[0]["SectionName"].ToString();
            }
            return Text;
        }
        #endregion

        #region 13.0 根据课件id查询到课程名称，章名称，节名称 （修改反显使用）
        public string GetUpdateChapterState()
        {
            //资源id
            string ResourcesId = Request["ResourcesId"];
            //节id
            string Sectionid ="0";
            //课程id
            string Curriculumid ="0";
            //章id
            string Chapterid ="0";
            string Text = string.Empty;
            DataTable dt = commBll.GetListDatatable("*", "bsi_Resources", " and ID="+ ResourcesId + "");
            if (dt.Rows.Count>0)
            {
                Curriculumid = dt.Rows[0]["CurriculumID"].ToString();
                Chapterid = dt.Rows[0]["ChapterID"].ToString();
                Sectionid = dt.Rows[0]["SectionID"].ToString();
            }
            DataTable dt1 = commBll.GetListDatatable("CurriculumName", "bsi_Curriculum", " and ID=" + Curriculumid + "");
            DataTable dt2 = commBll.GetListDatatable("ResourcesName", "bsi_Chapter", " and ID=" + Chapterid + "");
            DataTable dt3 = commBll.GetListDatatable("SectionName", "bsi_Section", " and ID=" + Sectionid + "");
            if (dt1.Rows.Count > 0 && dt2.Rows.Count > 0 && dt3.Rows.Count > 0)
            {
                Text = dt1.Rows[0]["CurriculumName"].ToString() + "_" + dt2.Rows[0]["ResourcesName"].ToString() + "_" + dt3.Rows[0]["SectionName"].ToString();
            }
            return Text;
        }
        /// <summary>
        /// 文件名称
        /// </summary>
        /// <returns></returns>
        public string GetFileName()
        {
            string Text = string.Empty;
            //资源id
            string ResourcesId = Request["ResourcesId"];
            DataTable dt = commBll.GetListDatatable("*", "bsi_Resources", " and ID=" + ResourcesId + "");
            if (dt.Rows.Count > 0)
            {
                string FileName = "";
                if (dt.Rows[0]["URL"].ToString().Contains('/'))
                {
                    string[] strArr = dt.Rows[0]["URL"].ToString().Split('/');
                    FileName = strArr[strArr.Count() - 1];
                }
                Text = FileName + "," + dt.Rows[0]["CurriculumID"].ToString() + "," + dt.Rows[0]["ChapterID"].ToString() + "," + dt.Rows[0]["SectionID"].ToString();
            }
            return Text;
        }
        #endregion

        #region 绑定能力下拉框
        public string Capacity() {
            DataTable dt = commBll.GetListDatatable("select * from bsi_CapabilityModel");
            return JsonConvert.SerializeObject(dt);
        }
        #endregion

        public string getCapacity() {
            string ResourcesId = Request["ResourcesId"];
            DataTable dt = commBll.GetListDatatable("*", "tb_CoursewareAbility a inner join bsi_CapabilityModel b on a.AbilityId=b.ID", " and ResourcesId=" + ResourcesId + "");
            return JsonConvert.SerializeObject(dt);
        }

    }
}
