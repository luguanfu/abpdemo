using Microsoft.AspNetCore.Mvc;
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
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseController : NumberApiBase<Purchase, Guid>
    {
        protected override BillNumberRule billNumberRule => new BillNumberRule
        {
            NumberName = nameof(Purchase.Number),
            BillDateRuleEnum = BillDateRuleEnum.YearMonthDay,
            BillNumberPrefixStr = "PU",
            SerialNumber = 5
        };
        readonly DetailTableInfo<PurchaseDetail, Guid> _detailEmp = new DetailTableInfo<PurchaseDetail, Guid>
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

    }
}
