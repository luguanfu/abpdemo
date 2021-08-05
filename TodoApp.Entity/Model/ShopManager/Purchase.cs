using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Entity.Model.ShopManager
{
    public class Purchase : EntityBase<Guid>
    {
        /// <summary>
        /// 采购单号
        /// </summary>
        [Display(Name = "采购单号")]
        public string Number { get; set; }
        /// <summary>
        /// 采购店铺
        /// </summary>
        [Display(Name = "采购店铺")]
        public Guid ShopId { get; set; }
    }
}
