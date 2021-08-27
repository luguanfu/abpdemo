using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model.ProductManager;

namespace TodoApp.IService.DTO.ProductManager
{
    public class ProductViewModel : Product
    {
        public string ProductName { get; set; }
    }    
}
