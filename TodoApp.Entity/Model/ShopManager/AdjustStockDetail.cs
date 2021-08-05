using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Entity.Model.ShopManager
{
    public class AdjustStockDetail:EntityBase<Guid>
    {
        public Guid ParentId { get; set; }
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
