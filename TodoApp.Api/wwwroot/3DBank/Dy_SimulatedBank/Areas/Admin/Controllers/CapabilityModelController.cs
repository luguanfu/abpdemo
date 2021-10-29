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
    public class CapabilityModelController : BaseController
    {
        CommonBll commBll = new CommonBll();

        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 获取列表数据
        /// </summary>
        /// <param name="CapabilityName">能力名称</param>
        /// <returns></returns>
        public string GetList()
        {
            string CapabilityName = Request["CapabilityName"].Trim();
            string where = " order by SerialNumber asc";
            if (!string.IsNullOrEmpty(CapabilityName))
            {
                where = "and AbilityName like '%" + CapabilityName + "%' order by SerialNumber asc";
            }

            var dt = commBll.GetListDatatable("*", "bsi_CapabilityModel", where);
            return JsonConvert.SerializeObject(dt);
        }


        /// <summary>
        /// 新增
        /// </summary>
        /// <returns></returns>
        public string Add()
        {
            string CapabilityName = Request.Form["CapabilityName"].Trim();
            string AbilityProfile = Request.Form["AbilityProfile"].Trim();
            string CMScore = Request.Form["CMScore"];
            string SerialNumber = Request.Form["SerialNumber"];

            string table = "bsi_CapabilityModel"; //表名
            string list = "AbilityName, AbilityInfo, AbilityUpperLimit, SerialNumber, AddUserId, AddTime";//列
            string vlaue = "@AbilityName, @AbilityInfo,@AbilityUpperLimit,@SerialNumber,@AddUserId, @AddTime";


            //校验名称是否已存在
            var count = commBll.GetRecordCount("bsi_CapabilityModel", " and AbilityName='" + CapabilityName + "'");
            if (count > 0)
            {
                return "77";

            }

            int Maxnumber = Convert.ToInt32(commBll.GetListSclar("isnull(MAX(SerialNumber),0)", "bsi_CapabilityModel", "")) + 1;
            //新增
            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@AbilityName",CapabilityName),
                new SqlParameter("@AbilityInfo",AbilityProfile),
                new SqlParameter("@AbilityUpperLimit",CMScore),
                new SqlParameter("@SerialNumber",Maxnumber),
                new SqlParameter("@AddUserId",UserId),
                new SqlParameter("@AddTime",DateTime.Now)
            };
            var resultcount = commBll.Add(table, list, vlaue, pars);
            if (resultcount == 1)
            {
                return "1";
            }
            else
            {
                return "99";
            }
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <returns></returns>
        public string Del(int ID, int SerialNumber)
        {

            try
            {
                commBll.DeleteInfo("bsi_CapabilityModel", " and ID in(" + ID + ")");
                DataTable dt = commBll.GetListDatatable("*", "bsi_CapabilityModel", string.Format(" and SerialNumber>{0}", SerialNumber));
                if (dt.Rows.Count > 0)
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        commBll.UpdateInfo("bsi_CapabilityModel", "SerialNumber=SerialNumber-1", " and ID=" + dt.Rows[i]["ID"] + "");
                    }
                }
                return "1";
            }
            catch
            {
                return "99";
            }

        }


        /// <summary>
        /// 修改
        /// </summary>
        /// <returns></returns>
        public string Update()
        {
            string ID = Request.Form["ID"];
            string CapabilityName = SQLSafe(Request.Form["CapabilityName"].Trim());
            string AbilityProfile = SQLSafe(Request.Form["AbilityProfile"].Trim());
            string CMScore = SQLSafe(Request.Form["CMScore"]);

            string table = "bsi_CapabilityModel"; //表名
            string Set = "AbilityName=@AbilityName, AbilityInfo=@AbilityInfo,AbilityUpperLimit=@AbilityUpperLimit";

            //校验名称是否已存在
            var count = commBll.GetRecordCount("bsi_CapabilityModel", " and AbilityName='" + CapabilityName + "' and ID!=" + ID);
            if (count > 0)
            {
                return "77";

            }

            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@ID",ID),
                new SqlParameter("@AbilityName",CapabilityName),
                new SqlParameter("@AbilityInfo",AbilityProfile),
                new SqlParameter("@AbilityUpperLimit",CMScore)
            };
            var resultcount = commBll.UpdateInfo(table, Set, " and ID=@ID", pars);
            if (resultcount == 1)
            {
                return "1";
            }
            else
            {
                return "99";
            }
        }

        /// <summary>
        /// 获取编辑信息
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        public string GetListOne(int ID)
        {
            return JsonConvert.SerializeObject(commBll.GetListDatatable("*", "bsi_CapabilityModel", "and ID=" + ID));
        }

        public int GetNum()
        {
            return Convert.ToInt32(commBll.GetListSclar("isnull(count(SerialNumber),0)", "bsi_CapabilityModel", ""));
        }

        /// <summary>
        /// 上下移
        /// </summary>
        /// <param name="id"></param>
        /// <param name="type"></param>
        /// <param name="CertificateType"></param>
        /// <returns></returns>
        public int UpandDown(string id, string type)
        {
            try
            {
                //1.0 查出当前序号
                var Sort = Convert.ToInt32(commBll.GetListSclar("SerialNumber", "bsi_CapabilityModel", " and Id=" + id));
                var MaxSort = Convert.ToInt32(commBll.GetListSclar("Max(SerialNumber)", "bsi_CapabilityModel", ""));
                string sql = "";
                if (type == "+1")//下移
                {
                    //判断当前的数据是不是最后一条
                    if (Sort != MaxSort)
                    {
                        //下一条的序号-1
                        sql += "update bsi_CapabilityModel set SerialNumber=SerialNumber-1 where SerialNumber=" + (Sort + 1) + "";
                        //当这条的序号+1
                        sql += @" update bsi_CapabilityModel set SerialNumber=SerialNumber+1 where Id=" + id + "";
                        commBll.ExecuteNonQuery(sql);
                    }
                    else
                    {
                        //已是最后一条
                        return -1;
                    }
                }

                if (type == "-1")//上移
                {
                    if (Sort != 1)
                    {
                        //上一条的序号+1
                        sql += "update bsi_CapabilityModel set SerialNumber=SerialNumber+1 where SerialNumber=" + (Sort - 1) + " ";
                        sql += @" update bsi_CapabilityModel set SerialNumber=SerialNumber-1 where Id=" + id + "";
                        commBll.ExecuteNonQuery(sql);
                    }
                    else
                    {
                        //已经是第一条
                        return -2;
                    }
                }

                return 1;
            }
            catch
            {
                return 99;
            }
        }

    }
}
