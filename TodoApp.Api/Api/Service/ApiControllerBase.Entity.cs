using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Api.Api.Patten;
using TodoApp.Entity.Patten;

namespace TodoApp.Api.Api.Service
{
    public class ApiControllerBase<TEntity, TKey> : ApiBase<TEntity, TKey>
        where TEntity : class, IEntity<TKey>, new()
        where TKey : struct
    {
    }
}
