using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Entity.Model.ShopManager
{
    public class AdjustStock:EntityBase<Guid>
    {
        public string Number { get; set; }
        public Guid OutShop { get; set; }
        public Guid InShop { get; set; }
    }
}
