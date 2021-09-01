using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.International.Converters.PinYinConverter;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Todo.App.Cache;
using TodoApp.Entity.Model;
using TodoApp.Entity.Patten;
using TodoApp.IService.IService.Patten;
using TodoApp.IService.Patten;
using TodoApp.Repository;
using TodoApp.Service.OperationLogManager;

namespace TodoApp.Service.Patten
{
    /// <summary>
    /// 服务基类
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <typeparam name="TKey"></typeparam>
    public class ServiceBase<TEntity, TKey> : IServiceBase<TEntity, TKey>
        where TEntity : class, new()
    {
        public IUnitOfWork unitOfWork;
        public EfDbContext context;
        public Guid TenantId { get; set; }
        DbSet<TEntity> DbSet { get; set; }

        public ServiceBase()
        {
            //string connection = "Data Source=.; User Id=sa; PassWord=000000; Initial Catalog=TodoApp;";
            string connection = Extention.GetConnectionString("TodoAppConnection");
            DbContextOptions<EfDbContext> options = new DbContextOptions<EfDbContext>();
            DbContextOptionsBuilder<EfDbContext> dbContextOptionBuilder = new DbContextOptionsBuilder<EfDbContext>(options);
            context = new EfDbContext(dbContextOptionBuilder.UseSqlServer(connection).Options);

            this.unitOfWork = new UnitOfWork(context);
            DbSet = context.Set<TEntity>();
        }
        public virtual TEntity Insert(TEntity entity)
        {
            InsertReset(entity);

            DbSet.Add(entity);

            InsertOperationLog(OperationLog_Operation.Insert, JsonConvert.SerializeObject(entity));

            context.SaveChanges();
            return entity;
        }
        private void InsertReset(TEntity entity, int? orderIndex = null)
        {
            SetFilterContent(entity);

            if (entity is ICreateEntity createEntity)
            {
                createEntity.CreateBy ??= UserCacheProject.LoginUserId;
                createEntity.CreateTime ??= DateTimeOffset.Now;
            }
            if (entity is ITreeEntity<TKey> treeEntity && treeEntity.Level == 0)
            {
                int level = 1;
                GetLevel(treeEntity.ParentId, ref level);
                treeEntity.Level = level;
            }
            if (entity is IOrderEntity orderEntity && orderEntity.OrderIndex == 0)
            {
                Guid? parentId = null;
                if (entity is ITreeEntity<TKey> treeEntity2)
                {
                    parentId = treeEntity2.ParentId;
                }
                orderEntity.OrderIndex = orderIndex ?? GetMaxOrderIndex(parentId) + 1;

            }
            if (entity is ITenantEntity tenantEntity)
            {
                tenantEntity.TenantId ??= null;
                tenantEntity.TenantProjectId ??= null;
            }
        }
        private void InsertOperationLog(OperationLog_Operation operation, string content, bool deleteFlag = false, Guid? keyId = null)
        {
            DbSet<OperationLog> logSet = context.Set<OperationLog>();
            OperationLog logModel = null;
            logSet.Add(logModel = new OperationLog()
            {
                OperationTime = DateTimeOffset.Now,
                OperationUser = UserCacheProject.LoginUserId,
                Content = content,
                TableName = typeof(TEntity).Name,
                Operation = operation.ToString(),
                DeleteFlag = deleteFlag,
                KeyId = keyId
            });
            context.Entry(logModel).State = EntityState.Added;
        }
        private int GetMaxOrderIndex(Guid? parentId)
        {
            Type type = typeof(TEntity);
            var propertys = type.GetProperties();
            if (propertys.FirstOrDefault(s => s.Name.Equals("ParentId")) != null)
            {
                string value = parentId == null ? "is null" : parentId.ToString();
                return (int)this.GetQuery().WhereFilter(new SearchField[] { new SearchField { Field = "ParentId", Op = "=", Value = value } })
                    .MaxValue("OrderIndex", 0);
            }
            else
            {
                return (int)this.GetQuery().MaxValue("OrderIndex", 0);
            }
        }
        public void GetLevel(Guid? parentid, ref int level)
        {
            if (parentid != null)
            {
                var model = GetModelById(parentid);
                if (model != null && model is ITreeEntity<TKey> treeEntity)
                {
                    level += 1;
                    GetLevel(treeEntity.ParentId, ref level);
                }
            }
        }
        private void SetFilterContent(TEntity entity)
        {
            if (entity is IFilterEntity filterEntity)
            {
                StringBuilder filterValue = new StringBuilder();
                var pros = entity.GetType().GetProperties();
                foreach (var info in pros)
                {
                    if (info.GetCustomAttribute<PinYinFilterAttribute>() != null)
                    {
                        var chinaValue = info.GetValue(entity)?.ToString();
                        if (!string.IsNullOrEmpty(chinaValue))
                        {
                            //filterValue += $"#{chinaValue}#{PinYinConverterHelp.ConvertToAllSpell(chinaValue)}";
                            filterValue.Append($";{chinaValue};{chinaValue.GetPinyin()}");
                        }
                    }
                }
                filterEntity.FilterContent = filterValue.ToString().Trim(';');
            }
        }
        public virtual void BulkInsert(List<TEntity> entities)
        {
            Guid? parentId = null;
            if (entities[0] is ITreeEntity<TKey> treeEntity)
            {
                parentId = treeEntity.ParentId;
            }
            int orderIndex = GetMaxOrderIndex(parentId);
            foreach (var item in entities)
            {
                SetLevel(entities, item);
                int oIndex = GetOrderIndex(entities, item, ref orderIndex);
                InsertReset(item, oIndex);
                InsertOperationLog(OperationLog_Operation.Insert, JsonConvert.SerializeObject(item));
            }
            DbSet.AddRange(entities);
            context.SaveChanges();
        }
        private void SetLevel(List<TEntity> entities, TEntity item)
        {
            if (item is ITreeEntity<TKey> treeEntity && treeEntity.Level == 0)
            {
                if (treeEntity.ParentId == null)
                {
                    treeEntity.Level = 1;
                }
                else
                {
                    int level = 1;
                    SetLevel(entities, treeEntity.ParentId, ref level);
                    treeEntity.Level = level;
                }
            }
        }
        private void SetLevel(List<TEntity> list, Guid? parentId, ref int level)
        {
            if (parentId != null)
            {
                var temp = list.FirstOrDefault(s => s is ITreeEntity<Guid> it && it.Id == parentId.Value);
                if (temp != null && temp is ITreeEntity<TKey> treeEntity)
                {
                    level++;
                    SetLevel(list, treeEntity.ParentId, ref level);
                }
            }
        }
        private int GetOrderIndex(List<TEntity> entities, TEntity item, ref int orderIndex)
        {
            if (item is ITreeEntity<TKey> treeEntity)
            {
                if (treeEntity.ParentId == null)
                    orderIndex++;
                else
                {
                    int maxOrderIndex = 0;
                    entities.ForEach(detail =>
                    {
                        if (detail is ITreeEntity<TKey> treeEntity2 && treeEntity2.ParentId == treeEntity.ParentId)
                        {
                            if (detail is IOrderEntity orderEntity && orderEntity.OrderIndex > maxOrderIndex)
                            {
                                maxOrderIndex = orderEntity.OrderIndex;
                            }
                        }
                    });
                    return maxOrderIndex + 1;
                }
            }
            else
            {
                orderIndex++;
            }
            return orderIndex;
        }
        public virtual void BulkUpdate(List<TEntity> entities)
        {
            foreach (var item in entities)
            {
                UpdateReset(item);

                string updateContent = UpdateContent(item);
                if (!string.IsNullOrEmpty(updateContent))
                {
                    InsertOperationLog(OperationLog_Operation.Update, updateContent);
                }
            }
            DbSet.UpdateRange(entities);
            context.SaveChanges();
        }
        private string UpdateContent(TEntity entity)
        {
            if (entity is IEntity<TKey> ientity)
            {
                TKey idValue = ientity.Id;

                var oldEntity = DbSet.AsNoTracking().WhereFilter(new SearchField[] { new SearchField { Field = "Id", Op = "=", Value = idValue.ToString() } }).FirstOrDefault();

                StringBuilder result = new StringBuilder();
                Type type = entity.GetType();
                var propertys = type.GetProperties();

                foreach (var pro in propertys)
                {
                    string oldValue = pro.GetValue(oldEntity)?.ToString();
                    string newValue = pro.GetValue(entity)?.ToString();
                    if (oldValue != newValue)
                    {
                        result.Append($"{pro.Name}:({oldValue}->{newValue}),");
                    }
                }

                return result.ToString().Trim(',');
            }
            return string.Empty;
        }
        private void UpdateReset(TEntity entity)
        {
            if (entity is IUpdateEntity updateEntity)
            {
                updateEntity.UpdateBy ??= UserCacheProject.LoginUserId;
                updateEntity.UpdateTime ??= DateTimeOffset.Now;
                updateEntity.UpdateVersion += 1;
            }
        }
        public virtual TEntity Update(TEntity entity)
        {
            UpdateReset(entity);

            string updateContent = UpdateContent(entity);
            if (!string.IsNullOrEmpty(updateContent))
            {
                InsertOperationLog(OperationLog_Operation.Update, updateContent);
            }

            DbSet.Update(entity);
            context.Entry(entity).State = EntityState.Modified;
            context.SaveChanges();
            return entity;
        }
        public virtual IQueryable<TEntity> GetQuery(bool? IsDelete = false)
        {
            var query = DbSet.AsQueryable();
            if (IsDelete.HasValue)
            {
                Type t = typeof(TEntity);
                var pro = t.GetProperties().FirstOrDefault(s => s.Name.Equals("IsDeleted"));
                if (pro != null)
                {
                    query = query.WhereFilter(new SearchField[] { new SearchField { Field = pro.Name, Op = "=", Value = IsDelete?.ToString() } });
                }
            }
            return query;
        }
        public TEntity GetModelById(Guid? id)
        {
            if (id == null)
                return null;
            return DbSet.Find(id);
        }
        public TEntity GetModelById(TKey id)
        {
            return DbSet.Find(id);
        }

        public virtual List<TEntity> GetListByParentId(Guid? parentId)
        {
            return null;
        }

        public bool Delete(List<TKey> ids)
        {
            Dictionary<TKey, TEntity> deleteModelDic = new Dictionary<TKey, TEntity>();
            foreach (var id in ids)
            {
                if (deleteModelDic.ContainsKey(id))
                    continue;

                TEntity model = GetModelById(id);
                if (model == null)
                    continue;
            }

            foreach (var id in ids)
            {
                var model = DbSet.Find(id);
                Delete(model, true);
            }
            return true;
        }
        /// <summary>
        /// 物理删除对象
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public bool Delete(TEntity entity)
        {
            Delete(entity, false);

            return true;
        }
        public bool Delete(List<TEntity> entities, bool isLoginDelete = true)
        {
            foreach (var model in entities)
            {
                Delete(model, isLoginDelete);
            }
            return true;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="entity">删除对象</param>
        /// <param name="isLogicDelete">是否是逻辑删除</param>
        private void Delete(TEntity entity, bool isLogicDelete)
        {
            if (entity == null)
                return;

            if (isLogicDelete)
            {
                //逻辑删除
                if (entity is IDeleteEntity dentity)
                {
                    dentity.IsDeleted = true;
                    dentity.DeleteBy = UserCacheProject.LoginUserId;
                    dentity.DeleteTime = DateTimeOffset.Now;
                }
                DbSet.Update(entity);

                if (entity is IEntity<Guid> ientity)
                    InsertOperationLog(OperationLog_Operation.LogicDelete, JsonConvert.SerializeObject(entity), keyId: ientity.Id);
            }
            else
            {
                //物理删除
                DbSet.Remove(entity);

                if (entity is IEntity<Guid> ientity)
                    InsertOperationLog(OperationLog_Operation.Delete, JsonConvert.SerializeObject(entity), keyId: ientity.Id);
            }
            context.SaveChanges();
        }

        public bool CancelDelete(List<TKey> ids)
        {
            foreach (var id in ids)
            {
                var model = DbSet.Find(id);
                if (model is IDeleteEntity ientity)
                {
                    ientity.IsDeleted = false;
                }
                DbSet.Update(model);
            }
            InsertOperationLog(OperationLog_Operation.CancelDelete, string.Join(",", ids.ToArray()));
            context.SaveChanges();
            return true;
        }

        /// <summary>
        /// 逻辑删除对象
        /// </summary>
        /// <param name="entity"></param>
        public void DeleteLogic(TEntity entity)
        {
            Delete(entity, true);
        }
        /// <summary>
        /// 执行sql返回结果集
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        public IEnumerable<T> SqlQuery<T>(string sql, params SqlParameter[] parameters)
            where T : class, new()
        {
            return context.Database.SqlQuery<T>(sql, parameters);
        }
        /// <summary>
        /// 执行存储过程返回结果集
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        public Tuple<IEnumerable<T>, int> SqlProcedure<T>(string sql, params SqlParameter[] parameters)
            where T : class, new()
        {
            return context.Database.SqlProcedure<T>(sql, parameters);
        }
    }
}
