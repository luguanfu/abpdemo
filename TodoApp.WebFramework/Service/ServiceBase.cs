using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace TodoApp.WebFramework.Service
{
    public class ServiceBase<TEntity>
        where TEntity : class
    {
        protected Model1 context = new Model1();
        protected DbSet<TEntity> DbSet;

        public ServiceBase()
        {
            DbSet = context.Set<TEntity>();
        }

        public IQueryable<TEntity> GetQuery()
        {
            return DbSet.AsQueryable();
        }
        public void Insert(TEntity entity)
        {
            DbSet.Add(entity);
            context.SaveChanges();
        }
        public void BulkInsert(List<TEntity> entities)
        {
            DbSet.AddRange(entities);
            context.SaveChanges();
        }
    }
}