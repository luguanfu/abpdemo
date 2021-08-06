using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Todo.App.Cache;
using TodoApp.Entity.Model;
using TodoApp.IService.IService.Patten;
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
        public EfDbContext context;
        DbSet<TEntity> DbSet { get; set; }

        public ServiceBase()
        {
            //string connection = "Data Source=.; User Id=sa; PassWord=000000; Initial Catalog=TodoApp;";
            string connection = Extention.GetConnectionString("TodoAppConnection");
            DbContextOptions<EfDbContext> options = new DbContextOptions<EfDbContext>();
            DbContextOptionsBuilder<EfDbContext> dbContextOptionBuilder = new DbContextOptionsBuilder<EfDbContext>(options);
            context = new EfDbContext(dbContextOptionBuilder.UseSqlServer(connection).Options);

            DbSet = context.Set<TEntity>();
        }
        public virtual TEntity Insert(TEntity entity)
        {
            AddOrUpdate(entity, null, true);
            DbSet.Add(entity);

            InsertOperationLog(OperationLog_Operation.Insert, JsonConvert.SerializeObject(entity));

            context.SaveChanges();
            return entity;
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
        private int GetLevel(Guid? id)
        {
            List<Guid> idList = GetParentIds(id) ?? new List<Guid>();
            if (id != null)
            {
                idList.Insert(0, id.Value);
            }

            return (idList?.Count ?? 0) + 1;
        }
        public List<Guid> GetParentIds(Guid? nodeId)
        {
            List<Guid> list = new List<Guid>();
            GetParentIdList(list, nodeId);
            return list;
        }
        private Guid? GetParentIdList(Guid? nodeId)
        {
            var model = GetModelById(nodeId);

            return GetParentId(model);
        }
        private void GetParentIdList(List<Guid> list, Guid? nodeId)
        {
            Guid? result = GetParentIdList(nodeId);
            if (result != null)
            {
                list.Add(result.Value);

                GetParentIdList(list, result.Value);
            }
        }
        private int GetMaxOrderIndex(Guid? parentId)
        {
            Type type = typeof(TEntity);
            var propertys = type.GetProperties();
            if (propertys.FirstOrDefault(s => s.Name.Equals("ParentId")) != null)
            {
                return (int)this.GetQuery().WhereFilter(new SearchField[] { new SearchField { Field = "ParentId", Op = "=", Value = parentId?.ToString() } })
                    .MaxValue("OrderIndex", 0);
            }
            else
            {
                return (int)this.GetQuery().MaxValue("OrderIndex", 0);
            }
        }
        private Guid? GetParentId(TEntity entity)
        {
            if (entity == null)
                return null;
            Type type = entity.GetType();
            var propertys = type.GetProperties();

            try
            {
                foreach (var item in propertys)
                {
                    if (item.Name.Equals("ParentId"))
                    {
                        var parentId = item.GetValue(entity);
                        if (parentId != null && parentId != DBNull.Value)
                        {
                            return Guid.Parse(parentId.ToString());
                        }
                    }
                }
            }
            catch (Exception ex)
            {

            }
            return null;
        }
        private void AddOrUpdate(TEntity entity, int? orderIndex, bool newCreate = true)
        {
            Type type = entity.GetType();
            var propertys = type.GetProperties();
            if (newCreate)
            {
                //新增
                foreach (var pro in propertys)
                {
                    switch (pro.Name)
                    {
                        case "CreateBy":
                            pro.SetValue(entity, UserCacheProject.LoginUserId);
                            break;
                        case "CreateTime":
                            pro.SetValue(entity, DateTimeOffset.Now);
                            break;
                        case "UpdateBy":
                            pro.SetValue(entity, UserCacheProject.LoginUserId);
                            break;
                        case "UpdateTime":
                            pro.SetValue(entity, DateTimeOffset.Now);
                            break;
                        case "OrderIndex":
                            int oIndex = orderIndex ?? GetMaxOrderIndex(GetParentId(entity)) + 1;
                            pro.SetValue(entity, oIndex);
                            break;
                        case "Level":
                            pro.SetValue(entity, GetLevel(GetParentId(entity) ?? null));
                            break;
                    }
                }
            }
            else
            {
                //修改
                foreach (var pro in propertys)
                {
                    switch (pro.Name)
                    {
                        case "UpdateBy":
                            pro.SetValue(entity, UserCacheProject.LoginUserId);
                            break;
                        case "UpdateTime":
                            pro.SetValue(entity, DateTimeOffset.Now);
                            break;
                        case "UpdateVersion":
                            int version = Convert.ToInt32(pro.GetValue(entity));
                            pro.SetValue(entity, version + 1);
                            break;
                    }
                }
            }
        }
        public virtual void BulkInsert(List<TEntity> entities)
        {
            int orderIndex = GetMaxOrderIndex(GetParentId(entities[0]));
            foreach (var item in entities)
            {
                orderIndex++;
                AddOrUpdate(item, orderIndex, true);
                InsertOperationLog(OperationLog_Operation.Insert, JsonConvert.SerializeObject(item));
            }
            DbSet.AddRange(entities);
            context.SaveChanges();
        }
        public virtual void BulkUpdate(List<TEntity> entities)
        {
            foreach (var item in entities)
            {
                AddOrUpdate(item, null, false);

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
            Type type = entity.GetType();
            var propertys = type.GetProperties();
            var idpro = propertys.FirstOrDefault(s => s.Name.Equals("Id"));
            if (Guid.TryParse(idpro.GetValue(entity)?.ToString(), out Guid idValue))
            {
                var oldEntity = DbSet.AsNoTracking().WhereFilter(new SearchField[] { new SearchField { Field = "Id", Op = "=", Value = idValue.ToString() } }).FirstOrDefault();

                StringBuilder result = new StringBuilder();

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
        public virtual TEntity Update(TEntity entity)
        {
            AddOrUpdate(entity, null, false);
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

        public virtual List<TEntity> GetListByParentId(Guid? parentId)
        {
            return null;
        }

        public bool Delete(List<TKey> ids)
        {
            foreach (var id in ids)
            {
                var model = DbSet.Find(id);
                Delete(model, true);
            }
            return true;
        }
        public bool Delete(List<TEntity> entities)
        {
            foreach (var model in entities)
            {
                Delete(model, true);

            }
            return true;
        }
        private void Delete(TEntity entity, bool isDelete)
        {
            if (entity == null)
                return;
            Type type = entity.GetType();
            var propertys = type.GetProperties();
            var pro = propertys.FirstOrDefault(s => s.Name.Equals("IsDeleted"));
            if (pro != null)
            {
                pro.SetValue(entity, isDelete);
                if (isDelete)
                {
                    foreach (var proinfo in propertys)
                    {
                        switch (proinfo.Name)
                        {
                            case "DeleteBy":
                                proinfo.SetValue(entity, UserCacheProject.LoginUserId);
                                break;
                            case "DeleteTime":
                                proinfo.SetValue(entity, DateTimeOffset.Now);
                                break;
                        }
                    }
                }
                DbSet.Update(entity);

                if (isDelete)
                {
                    var idpro = propertys.FirstOrDefault(s => s.Name.Equals("Id"));
                    Guid.TryParse(idpro.GetValue(entity)?.ToString(), out Guid idValue);
                    InsertOperationLog(OperationLog_Operation.Delete, JsonConvert.SerializeObject(entity), keyId: idValue);
                }

                context.SaveChanges();
            }
        }

        public bool CancelDelete(List<TKey> ids)
        {
            foreach (var id in ids)
            {
                var model = DbSet.Find(id);
                Delete(model, false);
            }
            return true;
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
