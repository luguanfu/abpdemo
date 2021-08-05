using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.IService.IService.Patten
{
    public interface IServiceBaseMongoDB<TEntity>
    {
        List<TEntity> GetListData();
        TEntity InsertModel(TEntity model);
    }
}
