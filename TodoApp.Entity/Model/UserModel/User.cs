using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Entity.Model.UserModel
{
    public class User : IEntity<Guid>
    {
        public Guid Id { get; set; }
        [Display(Name = "登录名")]
        public string LoginName { get; set; }
        [Display(Name = "密码")]
        public string Password { get; set; }
        [Display(Name = "姓名")]
        public string UserName { get; set; }
        /// <summary>
        /// 生日
        /// </summary>
        [Display(Name = "生日")]
        public DateTimeOffset? Birthday { get; set; }
        /// <summary>
        /// 部门
        /// </summary>
        [Display(Name = "部门")]
        public string Department { get; set; }
        /// <summary>
        /// 租户Id
        /// </summary>
        [Display(Name = "租户Id")]
        public Guid? TenantId { get; set; }
        /// <summary>
        /// 租户项目Id
        /// </summary>
        [Display(Name = "租户项目Id")]
        public Guid? TenantProjectId { get; set; }
    }
}
