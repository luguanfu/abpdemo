using Dy_SimulatedBank.Controllers;
using Dy_SimulatedBank_Bll;
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
    public class CurriculumAddController : BaseController
    {
        CommonBll commBll = new CommonBll();
        /***************************************************************
           FileName:BSI_保险
           Copyright（c）2018-金融教育在线技术开发部
           Author:邵
           Create Date:2018-5月15号
           ******************************************************************/

        public ActionResult Index()
        {
            return View();
        }
        #region 1.0新增课程
        /// <summary>
        /// 新增课程
        /// </summary>
        /// <returns></returns>
        public int Add()
        {
            string CurriculumName = Request["txtTitle"];
            int State = 0;
            string Cover = Request["img"];
            string Synopsis = Request["synopsis"];
            int Sort = 1;

            DataTable SortDt = commBll.GetListDatatable("select Max(Sort) as Sort from bsi_Curriculum");
            if (SortDt.Rows.Count > 0)
            {
                try
                {
                    Sort = Convert.ToInt32(SortDt.Rows[0]["Sort"].ToString()==""?0: SortDt.Rows[0]["Sort"]) + 1;
                }
                catch
                {
                    Sort = 1;
                }

            }
            else
            {
                Sort = 0;
            }
            //检查是否存在同名课程
            DataTable NameDt = commBll.GetListDatatable("select * from bsi_Curriculum where CurriculumName='"+ CurriculumName + "'");
            if (NameDt.Rows.Count>0)
            {
                return -2;
            }
            string table = "bsi_Curriculum";
            string List = "CurriculumName,State,Cover,Synopsis,Sort,AddUserId,AddTime,CurrType";
            string value = "@CurriculumName,@State,@Cover,@Synopsis,@Sort,@AddUserId,@AddTime,@CurrType";
            
            int CType = UserType;
            if (CType != 1)
            {
                CType = 2;
            }
            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@CurriculumName",CurriculumName),
                new SqlParameter("@State",State),
                new SqlParameter("@Cover",Cover),
                new SqlParameter("@Synopsis",Synopsis),
                new SqlParameter("@Sort",Sort),
                new SqlParameter("@AddUserId",UserId),
                new SqlParameter("@AddTime",DateTime.Now ),
                new SqlParameter("@CurrType",CType)
            };
            var Stateid = commBll.AddIdentity(table, List, value, pars);
            return Convert.ToInt32(Stateid);
        }
        #endregion
        #region 2.0 编辑时给输入框赋值
        public string GetEdit()
        {

            string Type = Request["Edit"];


            string id = Request["id"];
            if (id == "" || id == null)
            {
                id = "0";
            }
            DataTable dt = commBll.GetListDatatable("select * from bsi_Curriculum where ID=" + id + "");


            return JsonConvert.SerializeObject(dt);
        }
        #endregion
        #region 3.0 修改
        public int Edit()
        {
            string id = Request["id"];
            string CurriculumName = Request["txtTitle"];
            string Cover = Request["img"];
            string Synopsis = Request["synopsis"];

            string table = "bsi_Curriculum"; //表名
            string Set = "CurriculumName=@CurriculumName, Cover=@Cover, Synopsis=@Synopsis";
         

            //校验学校名称是否已存在
            var count = commBll.GetRecordCount("bsi_Curriculum", " and CurriculumName='" + CurriculumName + "' and ID!=" + id);
            if (count > 0)
            {
                return -2;

            }

            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@CurriculumName",CurriculumName),
                new SqlParameter("@Cover",Cover),
                new SqlParameter("@Synopsis",Synopsis),
                new SqlParameter("@ID",id)
            };
            var resultcount = commBll.UpdateInfo(table, Set, " and ID=@ID", pars);
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

    }
}
