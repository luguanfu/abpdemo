using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoApp.Api.Api.Patten
{
    public class DetailTable<TEntity, TKey>
    {
        public string TableName { get; set; }
        public string ForeignKey { get; set; }

        public Action<List<TEntity>, TKey, dynamic> BeginInsertOrEdit;
    }
}
