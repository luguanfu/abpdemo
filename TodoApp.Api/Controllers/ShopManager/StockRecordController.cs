using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Api.Api.Patten;
using TodoApp.Entity.Model.ShopManager;
using TodoApp.IService.IService.ShopManager;

namespace TodoApp.Api.Controllers.ShopManager
{
    /// <summary>
    /// 出入库记录
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class StockRecordController : ApiBase
    {
        private ApiResult ApiResult;

        public StockRecordController()
        {
            ApiResult = new ApiResult();
        }
        [HttpPost,Route("Insert")]
        public async Task<ApiResult<StockRecord>> Insert([FromBody] StockRecord model)
        {
            model = GetService<IStockRecordService>().InsertModel(model);

            return await ApiResult.Of(model);
        }
    }
}
