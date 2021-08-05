using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;
using TodoApp.IService.IService.Patten;

namespace TodoApp.Api.Api.Patten
{
    public abstract class ApiControllerBase<TEntity, TKey> : ApiBase<TEntity, TKey>
        where TEntity : class,IEntity<TKey>,new()
        where TKey : struct
    {
        protected override BillNumberRule billNumberRule => null;
    }
}
