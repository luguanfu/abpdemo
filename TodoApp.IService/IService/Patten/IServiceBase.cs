using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.IService.IService.Patten
{
    public interface IServiceBase<TEntity, TKey> : IDependency
    {
        TEntity Insert(TEntity entity);

        TEntity Update(TEntity entity);

        TEntity GetModelById(Guid? id);

        IQueryable<TEntity> GetQuery();

        List<TEntity> GetListByParentId(Guid? parentId);

        bool Delete(List<TKey> ids);
        bool CancelDelete(List<TKey> ids);
    }
}
