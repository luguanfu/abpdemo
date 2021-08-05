using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model.ShopManager;
using TodoApp.IService.IService.Patten;

namespace TodoApp.IService.IService.ShopManager
{
    public interface IAdjustStockDetailService : IServiceBase<AdjustStockDetail, Guid>
    {
    }
}
