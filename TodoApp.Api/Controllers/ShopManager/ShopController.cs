using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Todo.App.Cache;
using TodoApp.Api.Api.Patten;
using TodoApp.Entity.Model.ShopManager;
using TodoApp.IService.DTO;
using TodoApp.IService.DTO.ShopManager;
using TodoApp.IService.IService.ShopManager;

namespace TodoApp.Api.Controllers.ShopManager
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShopController : ApiControllerBase<Shop, Guid>
    {
        /// <summary>
        /// 出入库记录
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        [HttpPost, Route("OutInShopList")]
        public async Task<ApiResult<PageResult<OutInShopDto>>> OutInShopList([FromBody]PageInput<OutInShopInput> input)
        {
            var list = GetService<IShopService>().GetOutInShopList(input.PageIndex,input.PageSize,input.Input);
            if (list.Data?.Count > 0)
            {
                var shopList = GetService<IShopService>().GetQuery().ToList();
                list.Data.ForEach(item =>
                {
                    if (item.OutShop.HasValue)
                    {
                        item.OutShopName = shopList.FirstOrDefault(s => s.Id == item.OutShop.Value)?.Name;
                    }
                    if (item.InShop.HasValue)
                    {
                        item.InShopName = shopList.FirstOrDefault(s => s.Id == item.InShop.Value)?.Name;
                    }
                    if (item.CreateBy.HasValue)
                    {
                        item.CreateByName = UserCacheProject.GetUserName(item.CreateBy);
                    }
                    item.TypeName = item.OutInType.GetEnumDescription();
                });
            }
            return await ApiResult.Of(list);
        }
    }
}
