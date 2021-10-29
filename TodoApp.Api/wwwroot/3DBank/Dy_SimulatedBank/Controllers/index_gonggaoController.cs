using Dy_SimulatedBank.Models;
using Dy_SimulatedBank_Bll;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Controllers
{
    public class index_gonggaoController : BaseController
    {
        CommonBll commonbll = new CommonBll();

        //
        // GET: /index_gonggao/

        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 获得公告栏
        /// </summary>
        /// <returns></returns>
        public string GetList()
        {
           //自己班级的 和管理员发的
            string wheres = " and a.NoticeState=1 and b.ClassId="+ClassId;
            //if (Request["SelectcheckName"].Length > 0)
            //{
            //    wheres += " and NoticeTitle like '%" + Request["SelectcheckName"] + "%'";
            //}
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = " ReleaseTime desc"; //排序必须填写
            m.strFld = @" a.ID as ID,NoticeTitle,ReleaseTime,NoticeContent,(select COUNT(1) from bsi_NoticeUser c where c.NoticeID=a.ID and UserId=" + UserId + ") as num,Types,(select TeacherName from tb_Teacher where UserId=a.AddUserId) as TeacherName,LoginNo";
            m.tab = @" bsi_Notice a inner join bsi_NoticeClass b on a.ID=b.NoticeID inner join tb_User c on c.U_ID=a.AddUserId";
            m.strWhere = wheres;
            int PageCount = 0;//总数
            var dt = Pager.GetList(m, ref PageCount);
            return JsonConvert.SerializeObject(JsonResultPagedLists(PageCount, m.PageIndex, m.PageSize, dt));
        }

   
        /// <summary>
        /// 新增公告栏
        /// </summary>
        /// <returns></returns>
        public string Addready()
        {
            try
            {
                var NoticeID = Request["NoticeID"];//Id
                DataTable dt = commonbll.GetListDatatable("select a.*,(select TeacherName from tb_Teacher where UserId=a.AddUserId) as TeacherName,LoginNo from bsi_Notice a inner join tb_User c on c.U_ID=a.AddUserId where a.ID=" + NoticeID + "");

                var ckcount = commonbll.GetRecordCount("bsi_NoticeUser", " and NoticeID='" + NoticeID + "' and UserId='" + UserId + "'");
                if (ckcount > 0)
                {
                    return JsonConvert.SerializeObject(dt);
                }

                string table = "bsi_NoticeUser"; //表名
                string list = "NoticeID, UserId,AddUserId,AddTime";//列
                string vlaue = "@NoticeID, @UserId, @AddUserId,@AddTime";
                //新增
                SqlParameter[] pars = new SqlParameter[]
                {
                    new SqlParameter("@NoticeID",NoticeID),
                    new SqlParameter("@UserId",UserId),
                    new SqlParameter("@AddUserId",UserId),
                    new SqlParameter("@AddTime",DateTime.Now)
                };
                var resultcount = commonbll.Add(table, list, vlaue, pars);

                return JsonConvert.SerializeObject(dt);

            }
            catch
            {
                return "99";
            }

        }

        /// <summary>
        /// 返回代办事项
        /// </summary>
        /// <returns></returns>
        public string Getdaibanshixiang() {
            //我的团队Id
            var GID = commonbll.GetListSclar("GroupingnameID", @"bsi_Groupmanagement a
  INNER JOIN bsi_Groupingrelation b ON a.G_ID = b.GroupingnameID", " and StudentID=" +UserId);
            var lx_gr = 0;//练习 个人
            var lx_td = 0;//练习 团队
            var zskh = 0;//知识考核
            var js_gr = 0;//考核 个人
            var js_td = 0;//考核 团队

            lx_gr = commonbll.GetRecordCount(@"bsi_PracticeAssessment a 
  inner JOIN bsi_PracticeTasks b ON a.ID=b.PracticeId
  inner JOIN dbo.bsi_Task c ON c.ID=b.TaskId
  inner JOIN bsi_TotalResult d ON a.ID=d.ExamId AND d.Type_All=2 and d.UserId="+UserId, " and a.PracticeState=1 AND a.Type_All=2  AND a.PracticeType=1 and d.Tstate=0");
            lx_td= commonbll.GetRecordCount(@"bsi_PracticeAssessment a 
  inner JOIN bsi_PracticeTasks b ON a.ID=b.PracticeId
  inner JOIN dbo.bsi_Task c ON c.ID=b.TaskId
  inner JOIN bsi_TotalResult d ON a.ID=d.ExamId AND d.Type_All=2 and d.Grouping_ID=" + GID, " and a.PracticeState=1 AND a.Type_All=2  AND a.PracticeType=2 and d.Tstate=0");

            zskh = commonbll.GetRecordCount(@"tb_HB_Examination a", @" and a.E_Type=1 AND a.E_IsState=1 and (a.E_TeamId like '%," + ClassId +@",%') 
  and a.E_AddTime<GETDATE() and a.E_EndTime>GETDATE()  
  and EId not in(select ER_EId from tb_ExaminationResult where ER_Type=1 and ER_State=0 and ER_MId="+UserId+") ");


            js_gr = commonbll.GetRecordCount(@" bsi_PracticeAssessment a", @" and a.PracticeState=1 
  AND a.Type_All=1 AND a.PracticeType=1 AND a.ID IN 
  (SELECT DISTINCT PracticeId FROM  bsi_PracticeClass  WHERE ClassId=" + ClassId+@")
  and  a.PracticeStarTime<GETDATE() and DATEADD(mi, a.PracticeLong, a.PracticeStarTime)>GETDATE()  
  and ID not in (select ExamId from bsi_TotalResult  where  Type_All=1 and  UserId="+UserId+" and Tstate=1 and Grouping_ID=0)");

            js_td = commonbll.GetRecordCount(@" bsi_PracticeAssessment a", @" and a.PracticeState=1 
  AND a.Type_All=1 AND a.PracticeType=2 AND a.ID IN 
  (SELECT DISTINCT PracticeId FROM  bsi_PracticeClass  WHERE ClassId=" + ClassId + @")
  and  a.PracticeStarTime<GETDATE() and DATEADD(mi, a.PracticeLong, a.PracticeStarTime)>GETDATE()  
  and ID not in (select ExamId from bsi_TotalResult  where  Type_All=1  and Tstate=1 and Grouping_ID>0)");


            var json = new object[] {
                        new{
                            lx_gr=lx_gr,
                            lx_td=lx_td,
                            zskh=zskh,
                            js_gr=js_gr,
                            js_td=js_td
                    }
            };
            return JsonConvert.SerializeObject(json);
          
        }

    }
}
