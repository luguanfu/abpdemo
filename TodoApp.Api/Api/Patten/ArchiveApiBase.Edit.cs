using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Api.Api.Patten
{
    public abstract class ArchiveApiBase<TEntity, TGetViewModel, TGetListViewModel, TKey>: ArchiveApiBase<TEntity, TGetListViewModel, TKey>
        where TEntity : class, IEntity<TKey>, new()
        where TKey : struct
    {
    }
}
