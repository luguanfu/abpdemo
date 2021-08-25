using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;
using Volo.Abp.Domain.Entities;

namespace TodoApp.Entity.Model.ProductManager
{
    public class Product : EntityBaseTenant<Guid>
    {
        /// <summary>
        /// 产品名称
        /// </summary>
        [Display(Name = "产品名称")]
        public string Name { get; set; }
        /// <summary>
        /// 基本售价
        /// </summary>
        [Display(Name = "基本售价")]
        public decimal Price { get; set; }
        /// <summary>
        /// 库存
        /// </summary>
        [Display(Name = "库存")]
        public int Stock { get; set; }

        /// <summary>
        /// 产品属性集合
        /// </summary>
        //[NotMapped]
        //public List<ProductProperty> PropertyList { get; set; }
    }
}
