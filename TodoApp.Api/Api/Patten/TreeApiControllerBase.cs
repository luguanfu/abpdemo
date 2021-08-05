using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;
using TodoApp.IService.IService.Patten;

namespace TodoApp.Api.Api.Patten
{
    public abstract class TreeApiControllerBase<TEntity, TKey> : TreeApiBase<TEntity, TKey>
        where TEntity : class, ITreeEntity<TKey>, new()
        where TKey : struct
    {
        protected override BillNumberRule billNumberRule => null;
    }
}
