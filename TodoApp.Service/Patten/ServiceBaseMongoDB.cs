using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.IService.IService.Patten;
using TodoApp.Repository;

namespace TodoApp.Service.Patten
{
    public class ServiceBaseMongoDB<TEntity>: IServiceBaseMongoDB<TEntity>
    {
        EfMongoDBContext<TEntity> context = new EfMongoDBContext<TEntity>();

        public List<TEntity> GetListData()
        {
            return context.DbSet.AsQueryable().ToList();
        }
        public TEntity InsertModel(TEntity model)
        {
            context.DbSet.InsertOne(model);
            return model;
        }
    }
}
