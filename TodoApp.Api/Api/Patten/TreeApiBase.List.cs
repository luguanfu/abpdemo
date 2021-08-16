using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Api.Api.Patten
{
    public abstract class TreeApiBase<TEntity, TGetListViewModel, TKey> : TreeApiBase<TEntity, TKey>
        where TEntity : class, ITreeEntity<TKey>, new()
        where TGetListViewModel : class
        where TKey : struct
    {
    }
}
