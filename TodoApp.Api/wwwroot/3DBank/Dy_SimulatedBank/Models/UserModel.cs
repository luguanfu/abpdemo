using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dy_SimulatedBank.Models
{
    public class UserModel
    {
        /// <summary>
        /// Id
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// 账号
        /// </summary>
        public string LoginNo { get; set; }
        /// <summary>
        /// 密码
        /// </summary>
        public string Password { get; set; }
        /// <summary>
        /// 姓名
        /// </summary>
        public string UserName { get; set; }
        /// <summary>
        /// 头像
        /// </summary>
        public string PictureUrl { get; set; }
        /// <summary>
        /// 类型
        /// </summary>
        public int Type { get; set; }
        /// <summary>
        /// 状态（1 启用、0禁用）
        /// </summary>
        public int State { get; set; }
        /// <summary>
        /// 用户编号
        /// </summary>
        public string Teller_No { get; set; }
        /// <summary>
        /// 部门id
        /// </summary>
        public int DepartmentId { get; set; }
        /// <summary>
        /// 所属班级id
        /// </summary>
        public string SubBankId { get; set; }
    }
}