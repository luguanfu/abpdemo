using DevExtreme.AspNet.Data.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Api.Api.LoadOptions;
using TodoApp.Entity.Patten;

namespace TodoApp.Api.Api.Patten
{
    public abstract class ApiBase<TEntity, TGetListViewModel, TKey> : ApiBase<TEntity, TKey>
        where TEntity : class, IEntity<TKey>, new()
        where TGetListViewModel : class
        where TKey : struct
    {
        protected override LoadResult ProcessGetLoadResult(LoadOptions options)
        {
            var query = ProcessGetListViewModelDataQuery();

            //return DataSourceLoaderEx.LoadList(query, options);
            return Search(query, options);
        }
        protected virtual IQueryable<TGetListViewModel> ProcessGetListViewModelDataQuery()
        {
            return null;
        }
    }
}
