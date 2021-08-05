using LinqKit;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model.ProductManager;
using TodoApp.IService.DTO.ProductManager;
using TodoApp.IService.IService.ProductManager;
using TodoApp.Repository;
using TodoApp.Service.Patten;

namespace TodoApp.Service.ProductManager
{
    public class ProductService : ServiceBase<Product, Guid>, IProductService
    {
        public IQueryable<ProductViewModel> GetListData()
        {
            Expression<Func<Product, ProductViewModel>> s = (a) => new ProductViewModel
            {
                ProductName = "test"
            };
            s = s.BuildExtendSelectExpre();
            return from a in this.GetQuery().AsExpandable()
                   select s.Invoke(a);
        }

        public string GetName()
        {
            return "Product Name";
        }

        public List<Product> SqlDataList(string name)
        {
            SqlParameter sp = new SqlParameter { ParameterName = "@Name", Value = name, SqlDbType = System.Data.SqlDbType.NVarChar };

            string sql = "Select * From Todo_Product Where Name like '%'+@Name+'%'";

            return SqlQuery<Product>(sql, sp).ToList();
        }
    }
}
