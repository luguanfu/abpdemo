using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;

namespace TodoApp.WebFramework
{
    public partial class Model1 : DbContext
    {
        public Model1()
            : base("name=connection")
        {
        }
        public virtual DbSet<Form_Data> Form_Data { get; set; }
        public virtual DbSet<Todo_AdjustStock> Todo_AdjustStock { get; set; }
        public virtual DbSet<Todo_AdjustStockDetail> Todo_AdjustStockDetail { get; set; }
        public virtual DbSet<Todo_Menu> Todo_Menu { get; set; }
        public virtual DbSet<Todo_OperationLog> Todo_OperationLog { get; set; }
        public virtual DbSet<Todo_Product> Todo_Product { get; set; }
        public virtual DbSet<Todo_ProductProperty> Todo_ProductProperty { get; set; }
        public virtual DbSet<Todo_ProductStock> Todo_ProductStock { get; set; }
        public virtual DbSet<Todo_Purchase> Todo_Purchase { get; set; }
        public virtual DbSet<Todo_PurchaseDetail> Todo_PurchaseDetail { get; set; }
        public virtual DbSet<Todo_Shop> Todo_Shop { get; set; }
        public virtual DbSet<Todo_User> Todo_User { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
        }
    }
}
