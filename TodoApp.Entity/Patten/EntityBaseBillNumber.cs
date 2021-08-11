using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Entity.Patten
{
    public class EntityBaseBillNumber<TKey> : EntityBase<TKey>, IBillNumberEntity
    {
        /// <summary>
        /// 单据编号
        /// </summary>
        [Display(Name = "单据编号")]
        [MaxLength(30)]
        public string BillNumber { get; set; }
    }
}
