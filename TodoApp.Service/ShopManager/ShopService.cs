using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model.ShopManager;
using TodoApp.IService.DTO;
using TodoApp.IService.DTO.ShopManager;
using TodoApp.IService.IService.ShopManager;
using TodoApp.IService.Patten;
using TodoApp.Service.Patten;

namespace TodoApp.Service.ShopManager
{
    public class ShopService : ServiceBase<Shop, Guid>, IShopService
    {
        public PageResult<OutInShopDto> GetOutInShopList(int pageIndex, int pageSize, OutInShopInput input)
        {

            string sql = $@"execute outinshop @name,@outintype,@pageIndex,@pageSize";
            SqlParameter[] pars = new SqlParameter[]
                {
                    new SqlParameter{ ParameterName="@name",Value=input.Name},
                    new SqlParameter{ ParameterName="@outintype",Value=input.OutInType},
                    new SqlParameter{ ParameterName="@pageIndex",Value=pageIndex},
                    new SqlParameter{ ParameterName="@pageSize",Value=pageSize},
                };

            var result = SqlProcedure<OutInShopDto>(sql, pars);

            return new PageResult<OutInShopDto>
            {
                Data = result.Item1.ToList(),
                TotalItems = result.Item2
            };
        }
    }
}
