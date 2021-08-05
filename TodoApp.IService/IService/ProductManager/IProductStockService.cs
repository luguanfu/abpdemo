using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model.ProductManager;
using TodoApp.IService.IService.Patten;

namespace TodoApp.IService.IService.ProductManager
{
    public interface IProductStockService : IServiceBase<ProductStock, Guid>
    {
    }
}
