using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Entity.Patten
{
    public interface ITenantEntity
    {
        /// <summary>
        /// 租户Id
        /// </summary>
        public Guid? TenantId { get; set; }
        /// <summary>
        /// 租户项目Id
        /// </summary>
        public Guid? TenantProjectId { get; set; }
    }
}
