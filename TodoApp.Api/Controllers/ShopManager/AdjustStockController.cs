using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Api.Api.DetailTable;
using TodoApp.Api.Api.Patten;
using TodoApp.Entity.Model.ShopManager;
using TodoApp.IService.IService.Patten;

namespace TodoApp.Api.Controllers.ShopManager
{
    public class AdjustStockController : NumberApiBase<AdjustStock, Guid>
    {
        readonly DetailTableInfo<AdjustStockDetail, Guid> _detailEmp = new DetailTableInfo<AdjustStockDetail, Guid>
        {
            TableName = "DetailList",
            ForeignKey = "ParentId"
        };
        protected override List<IDetailTableInfo<Guid>> DetailsTableInfo
        {
            get
            {
                return new List<IDetailTableInfo<Guid>>
                {
                    _detailEmp
                };
            }
        }

        protected override BillNumberRule billNumberRule => new BillNumberRule
        {
            NumberName = nameof(Purchase.Number),
            BillDateRuleEnum = BillDateRuleEnum.YearMonthDay,
            BillNumberPrefixStr = "AD",
            SerialNumber = 7
        };
    }
}
