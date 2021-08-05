using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model.ShopManager;
using TodoApp.IService.IService.ShopManager;
using TodoApp.Service.Patten;

namespace TodoApp.Service.ShopManager
{
    public class StockRecordService : ServiceBaseMongoDB<StockRecord>, IStockRecordService
    {
    }
}
