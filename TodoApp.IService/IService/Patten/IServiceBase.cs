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
        void BulkInsert(List<TEntity> entities);
        TEntity Update(TEntity entity);
        TEntity GetModelById(TKey id);
        TEntity GetModelById(Guid? id);
        IQueryable<TEntity> GetQuery(bool? IsDelete = false);
        List<TEntity> GetListByParentId(Guid? parentId);
        bool Delete(List<TKey> ids);
        bool Delete(TEntity entity);
        void DeleteLogic(TEntity entity);
        bool CancelDelete(List<TKey> ids);
    }
}
