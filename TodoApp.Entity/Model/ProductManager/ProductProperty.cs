using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;
using Volo.Abp.Domain.Entities;

namespace TodoApp.Entity.Model.ProductManager
{
    public class ProductProperty: EntityBase<Guid>
    {
        public Guid ProductId { get; set; }
        /// <summary>
        /// 属性值
        /// </summary>
        [Display(Name ="属性值")]
        public string PropertyValue { get; set; }
    }
}
