using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Entity.Patten
{
    public class EntityBaseTenant<TKey> : EntityBase<TKey>, ITenantEntity
    {
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
