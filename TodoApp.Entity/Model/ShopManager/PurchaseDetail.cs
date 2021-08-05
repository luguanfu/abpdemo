using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Entity.Model.ShopManager
{
    public class PurchaseDetail : EntityBase<Guid>
    {
        /// <summary>
        /// 采购单Id
        /// </summary>
        [Display(Name = "采购单Id")]
        public Guid ParentId { get; set; }
        /// <summary>
        /// 产品Id
        /// </summary>
        [Display(Name = "产品Id")]
        public Guid ProductId { get; set; }
        /// <summary>
        /// 采购数量
        /// </summary>
        [Display(Name = "采购数量")]
        public int Quantity { get; set; }
    }
}
