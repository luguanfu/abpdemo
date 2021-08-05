using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model.ShopManager;
using TodoApp.IService.DTO;
using TodoApp.IService.DTO.ShopManager;
using TodoApp.IService.IService.Patten;

namespace TodoApp.IService.IService.ShopManager
{
    public interface IShopService : IServiceBase<Shop, Guid>
    {
        PageResult<OutInShopDto> GetOutInShopList(int pageIndex, int pageSize, OutInShopInput input);
    }
}
