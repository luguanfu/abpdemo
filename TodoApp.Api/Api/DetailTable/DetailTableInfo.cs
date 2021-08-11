using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;
using TodoApp.Service.Patten;

namespace TodoApp.Api.Api.DetailTable
{
    public class DetailTableInfo<TEntity, TKey> : IDetailTableInfo<TKey>
        where TEntity : class, IEntity<TKey>, new()
        where TKey : struct
    {
        public string TableName { get; set; }
        public string ForeignKey { get; set; }

        public Action<List<TEntity>, TKey, object> BeginInsertOrEdit;

        public Func<List<TEntity>, TKey, List<TEntity>> EndInsertOrEdit;

        public void SaveDetails(string detailsData, List<TKey> deleteKeys, TKey mainId, dynamic mainEntity)
        {
            ServiceBase<TEntity, TKey> services = new ServiceBase<TEntity, TKey>();

            if (!string.IsNullOrEmpty(detailsData))
            {
                List<TEntity> list = JsonConvert.DeserializeObject<List<TEntity>>(detailsData);
                if (BeginInsertOrEdit != null)
                {
                    BeginInsertOrEdit(list, mainId, mainEntity);
                }

                Type type = typeof(TEntity);
                var propertys = type.GetProperties();
                var foreignKey = propertys.FirstOrDefault(s => s.Name.Equals(ForeignKey));
                list.ForEach(item =>
                {
                    foreignKey.SetValue(item, mainId);
                });
                services.BulkInsert(list);

                if (EndInsertOrEdit != null)
                {
                    list = EndInsertOrEdit(list, mainId);
                }
            }
            if (deleteKeys?.Count > 0)
            {
                services.Delete(deleteKeys);
            }
        }
    }
}
