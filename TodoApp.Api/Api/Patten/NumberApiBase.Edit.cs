using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Api.Api.Patten
{
    public abstract class NumberApiBase<TEntity, TGetViewModel, TGetListViewModel, TKey> : NumberApiBase<TEntity, TGetListViewModel, TKey>
        where TEntity : class, IEntity<TKey>, new()
        where TGetListViewModel : class
        where TKey : struct
    {
    }
}
