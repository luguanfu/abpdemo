using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Api.Api.Patten
{
    public abstract class NumberApiBase<TEntity, TEntityGetModel, TEntityViewModel, TKey> : NumberApiBase<TEntity, TEntityViewModel, TKey>
        where TEntity : class, IEntity<TKey>, new()
        where TEntityViewModel : class
        where TKey : struct
    {
    }
}
