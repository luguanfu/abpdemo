using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model.ShopManager;
using TodoApp.IService.IService.Patten;
using TodoApp.IService.IService.ShopManager;
using TodoApp.IService.Patten;
using TodoApp.Service.Patten;

namespace TodoApp.Service.ShopManager
{
    public class PurchaseService : ServiceBase<Purchase, Guid>, IPurchaseService
    {
    }
}
