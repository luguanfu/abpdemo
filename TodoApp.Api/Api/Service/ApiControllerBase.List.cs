using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Api.Api.Patten;
using TodoApp.Entity.Patten;

namespace TodoApp.Api.Api.Service
{
    public class ApiControllerBase<TEntity, TGetListViewModel, TKey> : ApiBase<TEntity, TGetListViewModel, TKey>
         where TEntity : class, IEntity<TKey>, new()
         where TGetListViewModel : class
         where TKey : struct
    {
    }
}
