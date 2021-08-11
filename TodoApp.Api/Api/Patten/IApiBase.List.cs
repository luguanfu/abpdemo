using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoApp.Api.Api.Patten
{
    public interface IApiBase<TEntity, TGetListViewModel, TKey>
    {
        LoadResult ProcessGetLoadResult(LoadOptions options);

        IQueryable<TGetListViewModel> ProcessGetListViewModelDataQuery();
    }
}
