using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank.Models;
using Dy_SimulatedBank_Bll;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Areas.Admin.Controllers
{
    public class ResourcesController : BaseController
    {

        /***************************************************************
          FileName:BSI_保险:课件管理
          Copyright（c）2018-金融教育在线技术开发部
          Author:邵
          Create Date:2018-5月15号
          ******************************************************************/
        CommonBll commBll = new CommonBll();
        public ActionResult Index()
        {
            return View();
        }

        #region 1.0获取列表
        public string GetList()
        {
            string SelectName = Request["SelectName"];
            string wheres = " ";
            if (UserType != 1)
            {
                wheres = " and (R.AddUserId=" + UserId + " or C.CurrType=1)";
            }
            else
            {
                wheres = " and  u.Type=1 ";
            }
            if (SelectName != "" || SelectName != null)
            {
                wheres += " and R.ResourcesName like '%" + SelectName + "%'";
            }
            PageModel m = new PageModel();
            m.PageIndex = !string.IsNullOrEmpty(Request["page"]) ? int.Parse(Request["page"]) : 1;
            m.PageSize = !string.IsNullOrEmpty(Request["PageSize"]) ? int.Parse(Request["PageSize"]) : 10;
            m.Sort = "  R.AddTime desc"; //排序必须填写
            m.strFld = @" R.*,C.CurriculumName,D.abilityString,C.CurrType, u.Type as Utype";
            m.tab = @"bsi_Resources R  left join bsi_Curriculum C on C.ID=R.CurriculumID left join  tb_User u on R.AddUserId =u.U_ID
 left join (  select ResourcesId, abilityString=stuff
(
    (
         select ','+ convert(varchar,[AbilityName]) from tb_CoursewareAbility t  inner join bsi_CapabilityModel n on t.AbilityId =n.ID  where [ResourcesId]=a.ResourcesId for xml path('')
    ),
    1, 
    1, 
    ''
) 
  from 
  (tb_CoursewareAbility a
  inner join bsi_CapabilityModel b on a.AbilityId =b.ID)
   group by ResourcesId 
   ) D on D.ResourcesId=R.ID";
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
            try
            {
                //删除资源
                commBll.DeleteInfo("bsi_Resources", " and ID in(" + id + ")");
                //删除学习记录
                commBll.DeleteInfo("bsi_ResourceRecord", "and ResourcesID in(" + id + ")");

                //删除能力
                commBll.DeleteInfo("tb_CoursewareAbility", "and ResourcesID in(" + id + ")");
                return 1;
            }
            catch
            {
                return 99;
            }
        }
        #endregion
    }
}
