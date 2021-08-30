using Microsoft.EntityFrameworkCore;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using TodoApp.Entity.Model;
using TodoApp.Entity.Model.MenuManager;
using TodoApp.Entity.Model.ProductManager;
using TodoApp.Entity.Model.ShopManager;
using TodoApp.Entity.Model.UserModel;
using TodoApp.IService.IService.Patten;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Volo.Abp.Users.EntityFrameworkCore;

namespace TodoApp.Repository
{
    public class EfDbContext : AbpDbContext<EfDbContext>, IDependency
    {
        private const string DbTablePrefix = "Todo_";
        public EfDbContext(DbContextOptions<EfDbContext> options) : base(options) { }

        public int ExcuteProcedure(string parcedureName, params SqlParameter[] ps)
        {
            using (var cmd = this.Database.GetDbConnection().CreateCommand())
            {
                cmd.CommandText = parcedureName;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddRange(ps);
                this.Database.OpenConnection();
                var r = cmd.ExecuteNonQuery();
                this.Database.CloseConnection();
                return r;
            }
        }
        public object ExcuteFunction(string functionName, params SqlParameter[] ps)
        {
            using (var cmd = this.Database.GetDbConnection().CreateCommand())
            {
                // 参数字符串，传参时注意顺序
                var pString =
                      $"'{ps.Aggregate(string.Empty, (c, n) => $"{c}','{n.Value}").TrimStart(new[] { ',', '\'' })}'";

                // 可用this.Database.IsXXX()，判读数据库类型，拼command字符串，这里不写了
                cmd.CommandText = $"select {functionName}({pString});";
                this.Database.OpenConnection();
                var r = cmd.ExecuteScalar();
                this.Database.CloseConnection();
                return r;
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(b =>
            {
                b.ToTable(DbTablePrefix + "User");
                b.ConfigureByConvention();
            });
            modelBuilder.Entity<Product>(b =>
            {
                b.ToTable(DbTablePrefix + "Product");
                b.ConfigureByConvention();
            });
            modelBuilder.Entity<ProductProperty>(b =>
            {
                b.ToTable(DbTablePrefix + "ProductProperty");
                b.ConfigureByConvention();
            });
            modelBuilder.Entity<Menu>(b =>
            {
                b.ToTable(DbTablePrefix + "Menu");
                b.ConfigureByConvention();
            });
            modelBuilder.Entity<OperationLog>(b =>
            {
                b.ToTable(DbTablePrefix + "OperationLog");
                b.ConfigureByConvention();
            });
            modelBuilder.Entity<ProductStock>(b =>
            {
                b.ToTable(DbTablePrefix + "ProductStock");
                b.ConfigureByConvention();
            });
            modelBuilder.Entity<Shop>(b =>
            {
                b.ToTable(DbTablePrefix + "Shop");
                b.ConfigureByConvention();
            });
            modelBuilder.Entity<Purchase>(b =>
            {
                b.ToTable(DbTablePrefix + "Purchase");
                b.ConfigureByConvention();
            });
            modelBuilder.Entity<PurchaseDetail>(b =>
            {
                b.ToTable(DbTablePrefix + "PurchaseDetail");
                b.ConfigureByConvention();
            });
            modelBuilder.Entity<AdjustStock>(b =>
            {
                b.ToTable(DbTablePrefix + "AdjustStock");
                b.ConfigureByConvention();
            });
            modelBuilder.Entity<AdjustStockDetail>(b =>
            {
                b.ToTable(DbTablePrefix + "AdjustStockDetail");
                b.ConfigureByConvention();
            });
        }
    }
}
