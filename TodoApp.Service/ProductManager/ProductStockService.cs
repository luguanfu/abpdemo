using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model.ProductManager;
using TodoApp.IService.IService.ProductManager;
using TodoApp.IService.Patten;
using TodoApp.Service.Patten;

namespace TodoApp.Service.ProductManager
{
    public class ProductStockService : ServiceBase<ProductStock, Guid>, IProductStockService
    {
    }
}
