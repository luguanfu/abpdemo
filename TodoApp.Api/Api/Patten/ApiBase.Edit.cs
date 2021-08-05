using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Api.Api.Patten
{
    public abstract class ApiBase<TEntity, TEntityGetModel, TEntityViewModel, TKey> : ApiBase<TEntity, TKey>
        where TEntity : class, IEntity<TKey>,new()
        where TKey : struct
    {
        public virtual IQueryable<TEntityViewModel> ProcessGetListViewModelDataQuery()
        {
            return null;
        }
        [HttpGet, Route("GetViewModelById")]
        public virtual TEntityGetModel ProcessGetViewModelById(Guid id)
        {
            throw new NotImplementedException();
        }
    }
}
