using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Entity.Patten
{
    public class EntityBaseArchive<TKey> : EntityBase<TKey>, IArchiveEntity
    {
        /// <summary>
        /// 是否已归档
        /// </summary>
        [Display(Name= "是否已归档")]
        public bool? IsArchived { get; set; }
        /// <summary>
        /// 归档人
        /// </summary>
        [Display(Name = "归档人")]
        public Guid? ArchivedUserId { get; set; }
        /// <summary>
        /// 归档人名称
        /// </summary>
        [NotMapped]
        public Guid? ArchivedUserName { get; set; }
        /// <summary>
        /// 归档时间
        /// </summary>
        [Display(Name ="归档时间")]
        public DateTimeOffset? ArchivedTime { get; set; }
        /// <summary>
        /// 取消归档人
        /// </summary>
        [Display(Name = "取消归档人")]
        public Guid? CancelArchivedUserId { get; set; }
        /// <summary>
        /// 取消归档人名称
        /// </summary>
        [NotMapped]
        public Guid? CancelArchivedUserName { get; set; }
        /// <summary>
        /// 取消归档时间
        /// </summary>
        [Display(Name = "取消归档时间")]
        public DateTimeOffset? CancelArchivedTime { get; set; }
    }
}
