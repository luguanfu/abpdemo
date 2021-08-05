using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;
using TodoApp.IService.IService.Patten;

namespace TodoApp.Api.Api.Patten
{
    public abstract class ApiControllerBase<TEntity, TEntityViewModel, TKey> : ApiBase<TEntity, TEntityViewModel, TKey>
        where TEntityViewModel : class
        where TEntity : class,IEntity<TKey>,new()
        where TKey : struct
    {
        protected override BillNumberRule billNumberRule => null;

        protected override LoadResult ProcessGetLoadResult(LoadOptions options)
        {
            var query = ProcessGetListViewModelDataQuery();

            return Search(query, options);
        }
    }
}
