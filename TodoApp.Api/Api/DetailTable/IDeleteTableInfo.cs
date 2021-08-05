using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoApp.Api.Api.DetailTable
{
    public interface IDeleteTableInfo<TKey>
    {
        string ForeignKey { get; set; }
        void DeleteDetails(TKey parentId);
    }
}
