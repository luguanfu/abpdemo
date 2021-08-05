using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;
using TodoApp.Service.Patten;

namespace TodoApp.Api.Api.DetailTable
{
    public class DeleteTableInfo<TEntity, TKey> : IDeleteTableInfo<TKey>
        where TEntity : class, IEntity<TKey>, new()
        where TKey : struct
    {
        public string ForeignKey { get; set; }

        public void DeleteDetails(TKey parentId)
        {
            ServiceBase<TEntity, TKey> services = new ServiceBase<TEntity, TKey>();

            var list = services.GetQuery().WhereFilter(new SearchField[] { new SearchField { Field = ForeignKey, Op = "=", Value = parentId.ToString() } }).ToList();
            services.Delete(list.Select(s => s.Id).ToList());
        }
    }
}
