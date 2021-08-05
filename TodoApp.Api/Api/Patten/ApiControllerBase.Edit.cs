using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;
using TodoApp.IService.IService.Patten;

namespace TodoApp.Api.Api.Patten
{
    public abstract class ApiControllerBase<TEntity, TEditGetModel, TEntityViewModel, TKey> : ApiBase<TEntity, TEditGetModel, TEntityViewModel, TKey>
        where TEntity : class,IEntity<TKey>,new()
        where TKey : struct
    {
        protected override BillNumberRule billNumberRule => null;
        protected override LoadResult ProcessGetLoadResult(LoadOptions options)
        {
            var query = ProcessGetListViewModelDataQuery();
            LoadResult loadResult = new LoadResult
            {
                Data = query.ToList()
            };
            GetListReload(loadResult);

            return loadResult;
        }
    }
}
