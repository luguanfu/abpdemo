using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Api.Api.LoadOptions;
using TodoApp.Entity.Patten;
using TodoApp.IService.IService.Patten;
using TodoApp.Service.Patten;

namespace TodoApp.Api.Api.DetailTable
{
    public class DetailTableInfo<TEntity, TKey> : IDetailTableInfo<TKey>
        where TEntity : class, IEntity<TKey>, new()
        where TKey : struct
    {
        public string TableName { get; set; }
        public string ForeignKey { get; set; }
        public bool IsLogicDelete { get; set; }

        public Action<List<TEntity>, TKey, object> BeginInsertOrEdit;

        public Func<List<TEntity>, TKey, List<TEntity>> EndInsertOrEdit;

        public Action<TKey> MainDataDelete;

        public void MainDataDeleteExecute(TKey tKey, dynamic mainEntity)
        {
            if (MainDataDelete != null)
            {
                MainDataDelete(tKey);
            }
            else
            {
                var service = TodoApp.Service.Patten.ServiceLocator.GetService<IServiceBase<TEntity, TKey>>();
                var list = service.GetQuery().WhereFilter(new SearchField[] { new SearchField { Field = ForeignKey, Op = "=", Value = tKey.ToString() } }).ToList();
                foreach (var curItem in list)
                {
                    var curModel = curItem as TEntity;
                    if (curModel == null) continue;
                    if (IsLogicDelete)
                    {
                        service.DeleteLogic(curModel);
                    }
                    else
                    {
                        service.Delete(curModel);
                    }
                }
            }
        }

        public void SaveDetails(string detailsData, List<TKey> deleteKeys, TKey mainId, dynamic mainEntity)
        {
            var service = TodoApp.Service.Patten.ServiceLocator.GetService<IServiceBase<TEntity, TKey>>();

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
                service.BulkInsert(list);

                if (EndInsertOrEdit != null)
                {
                    list = EndInsertOrEdit(list, mainId);
                }
            }
            if (deleteKeys?.Count > 0)
            {
                service.Delete(deleteKeys);
            }
        }
    }
}
