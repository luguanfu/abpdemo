using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoApp.Api.Api.DetailTable
{
    public interface IDetailTableInfo<TKey>
    {
        string TableName { get; set; }

        void MainDataDeleteExecute(TKey tKey, dynamic mainEntity);
        void SaveDetails(string detailsData,List<TKey> deletedKeys, TKey mainId, dynamic mainEntity);
    }
}
