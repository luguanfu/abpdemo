using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Entity.Model.ShopManager
{
    public class Shop : EntityBase<Guid>
    {
        /// <summary>
        /// 店铺名称
        /// </summary>
        [Display(Name = "店铺名称")]
        [PinYinFilter]
        public string Name { get; set; }
        /// <summary>
        /// 地址
        /// </summary>
        [Display(Name = "地址")]
        [PinYinFilter]
        public string Address { get; set; }
    }
}
