using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Entity.Model.ProductManager
{
    public class ProductStock : EntityBase<Guid>
    {
        /// <summary>
        /// 产品Id
        /// </summary>
        [Display(Name= "产品Id")]
        public Guid ProductId { get; set; }
        /// <summary>
        /// 店铺Id
        /// </summary>
        [Display(Name = "店铺Id")]
        public Guid ShopId { get; set; }
        /// <summary>
        /// 库存数
        /// </summary>
        [Display(Name = "库存数")]
        public int Stock { get; set; }
    }
}
