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

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class TeacherNoticeboardController : BaseController
    {
        //
        /***************************************************************
         FileName:教师端 公告栏 
         Copyright（c）2018-金融教育在线技术开发部
         Author:李林燊
         Create Date:2018-7-25
     ******************************************************************/
        // GET: /Admin/TeacherNoticeboard/

        CommonBll commonbll = new CommonBll();

        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 公告栏列表
        /// </summary>
        /// <returns></returns>
        public string GetNoticeList()
        {
            string wheres = " and AddUserId="+UserId;
            if (Request["SelectcheckName"].Length > 0)
            {
                wheres += " and NoticeTitle like '%" + Request["SelectcheckName"] + "%'";
            }
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " ID desc"; //排序必须填写
            m.strFld = @" *";
            m.tab = @" bsi_Notice";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));

        }

        /// <summary>
        /// 获取教师的班级
        /// </summary>
        /// <returns></returns>
        public string GetTeacherList()
        {
            string wheres = " and TeacherId=" + UserId;
            DataTable dt = commonbll.GetListDatatable("*", "tb_Class", wheres);

            return JsonConvert.SerializeObject(dt);
        }
        /// <summary>
        /// 新增公告栏
        /// </summary>
        /// <returns></returns>
        public int AddBulletincontent()
        {
            try
            {
                var Bulletintitle = Request["Bulletintitle"];//公告标题
                var Bulletincontent = Request["Bulletincontent"];//公告内容
                var AddTeamId = Request["AddTeamId"];//新增班级

                string table = "bsi_Notice"; //表名
                string list = "NoticeTitle,NoticeContent,ReleaseTime,NoticeState,AddUserId,AddTime";//列
                string vlaue = "@NoticeTitle,@NoticeContent,@ReleaseTime,@NoticeState,@AddUserId,@AddTime";
                //新增公告表
                SqlParameter[] pars = new SqlParameter[]
                                            {
                                                new SqlParameter("@NoticeTitle",Bulletintitle),
                                                new SqlParameter("@NoticeContent",Bulletincontent),
                                                new SqlParameter("@ReleaseTime",DateTime.Now),
                                                new SqlParameter("@NoticeState","0"),
                                                new SqlParameter("@AddUserId",UserId),
                                                new SqlParameter("@AddTime",DateTime.Now)
                                            };
                var resultcount = commonbll.Add(table, list, vlaue, pars);

                //新增公告对象关系表
                var NoticeID = commonbll.GetListSclar("ID", "bsi_Notice", "and NoticeTitle='" + Bulletintitle + "' and NoticeContent='" + Bulletincontent + "'");
                string table2 = "bsi_NoticeClass"; //表名
                string list2 = "NoticeID, ClassId,AddUserId,AddTime";//列
                string vlaue2 = "@NoticeID, @ClassId, @AddUserId,@AddTime";
                var AddTeam = AddTeamId.Split(',');
                for (int i = 0; i < AddTeam.Length; i++)
                {
                    var TeamId = AddTeam[i];//岗位编号
                    SqlParameter[] pars2 = new SqlParameter[]
                                            {
                                                new SqlParameter("@NoticeID",NoticeID),
                                                new SqlParameter("@ClassId",TeamId),
                                                new SqlParameter("@AddUserId",UserId),
                                                new SqlParameter("@AddTime",DateTime.Now)
                                            };
                    var resultcount2 = commonbll.Add(table2, list2, vlaue2, pars2);
                }
                return 1;
            }
            catch
            {
                return 99;
            }


        }

        /// <summary>
        /// 更改发布状态
        /// </summary>
        /// <returns></returns>
        public int UpdateBulletinState()
        {
            int Noticeid =Convert.ToInt32(Request["Noticeid"]);
            var resultcount = commonbll.UpdateInfo("bsi_Notice", "NoticeState=1", " and ID in(" + Noticeid + ")");
            if (resultcount > 0)
            {
                return 1;
            }
            else
            {
                return 99;
            }

        }

        /// <summary>
        /// 批量删除公告栏列表
        /// </summary>
        /// <returns></returns>
        public int Del()
        {
            string id = Request["Ids"];
            try
            {
                commonbll.DeleteInfo("bsi_Notice", " and ID in(" + id + ")");
                commonbll.DeleteInfo("bsi_NoticeClass", " and NoticeID in(" + id + ")");
                return 1;
            }
            catch
            {
                return 99;
            }
        }
    }
}
