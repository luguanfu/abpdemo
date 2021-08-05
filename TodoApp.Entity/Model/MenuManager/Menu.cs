using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Entity.Model.MenuManager
{
    public class Menu : EntityBaseTree<Guid>
    {
        public string Name { get; set; }
        public Guid? MenuId { get; set; }
    }
}
