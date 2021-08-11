using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Entity.Patten
{
    public abstract class EntityBase<TKey> : IEntity<TKey>, ICreateEntity, IUpdateEntity, IDeleteEntity, IOrderEntity
    {
        [Display(Name = "主键Id")]
        public virtual TKey Id { get; set; }
        [Display(Name = "创建人")]
        public Guid? CreateBy { get; set; }
        [NotMapped]
        public string CreateByName { get; set; }
        [Display(Name = "创建时间")]
        public DateTimeOffset? CreateTime { get; set; }
        [Display(Name = "修改人")]
        public Guid? UpdateBy { get; set; }
        [NotMapped]
        public string UpdateByName { get; set; }
        /// <summary>
        /// 修改版本
        /// </summary>
        [Display(Name = "修改版本")]
        public virtual int UpdateVersion { get; set; }
        [Display(Name = "修改时间")]
        public DateTimeOffset? UpdateTime { get; set; }
        [Display(Name = "删除人")]
        public Guid? DeleteBy { get; set; }
        [NotMapped]
        public string DeleteByName { get; set; }
        [Display(Name = "删除时间")]
        public DateTimeOffset? DeleteTime { get; set; }
        [Display(Name = "删除状态")]
        public bool IsDeleted { get; set; }
        [Display(Name = "排序")]
        public int OrderIndex { get; set; }
        /// <summary>
        /// 条件过滤
        /// </summary>
        [Display(Name = "条件过滤")]
        public string FilterContent { get; set; }
    }
}
