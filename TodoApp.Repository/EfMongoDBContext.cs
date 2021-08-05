using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Repository
{
    public class EfMongoDBContext<TEntity>
    {
        public readonly IMongoDatabase _database = null;

        public EfMongoDBContext()
        {
            string connectionStr = Extention.GetConfigValue("AppSettings:MongoServerSettingString");
            string dbName = Extention.GetConfigValue("AppSettings:MongoServerSettingStringDB");

            var client = new MongoClient(connectionStr);
            if (client != null)
            {
                _database = client.GetDatabase(dbName);
            }
        }

        public IMongoCollection<TEntity> DbSet
        {
            get
            {
                return _database.GetCollection<TEntity>(typeof(TEntity).Name);
            }
        }
    }
}
