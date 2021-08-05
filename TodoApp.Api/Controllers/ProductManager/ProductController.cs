using Autofac;
using ExpressMapper.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Todo;
using Todo.App.Cache;
using TodoApp.Api.Api.DetailTable;
using TodoApp.Api.Api.Patten;
using TodoApp.Api.Filters;
using TodoApp.Entity.Model.ProductManager;
using TodoApp.IService.DTO.ProductManager;
using TodoApp.IService.IService.Patten;
using TodoApp.IService.IService.ProductManager;
using TodoApp.Repository;

namespace TodoApp.Api.Controllers.ProductManager
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ApiBase<Product, ProductViewModel, Guid>
    {
        private readonly ILogger<ProductController> logger;
        public ProductController(ILogger<ProductController> logger)
        {
            this.logger = logger;
        }

        readonly DetailTableInfo<ProductProperty, Guid> _detailEmp = new DetailTableInfo<ProductProperty, Guid>
        {
            TableName = "PropertyList",
            ForeignKey = "ProductId",
            BeginInsertOrEdit = (list, mainId, entity) =>
              {
                  if (list?.Count > 0)
                  {
                      var items = list.GroupBy(s => s.PropertyValue);
                      foreach (var item in items)
                      {
                          if (item.ToList().Count > 1)
                          {
                              throw new Exception($"{item.Key} 不能重复");
                          }
                      }
                  }
              }
        };
        protected override List<IDetailTableInfo<Guid>> DetailsTableInfo
        {
            get
            {
                return new List<IDetailTableInfo<Guid>>
                {
                    _detailEmp
                };
            }
        }

        readonly DeleteTableInfo<ProductProperty, Guid> _deleteTemp = new DeleteTableInfo<ProductProperty, Guid>
        {
            ForeignKey = "ProductId",
        };

        protected override List<IDeleteTableInfo<Guid>> DeletesTableInfo
        {
            get
            {
                return new List<IDeleteTableInfo<Guid>>
                {
                    _deleteTemp
                };
            }
        }


        [HttpGet, Route("LogTest")]
        public ActionResult LogTest()
        {
            List<string> list = new List<string>() { "aa", "bb" };

            var bytes = list.ExportExcel();

            logger.LogError("LogTest error start");
            logger.LogDebug("LogTest debug start");
            logger.LogWarning("LogTest warning start");
            logger.LogInformation("LogTest start");

            CacheHelper.SetCache("Name", "Tom");

            return File(bytes, "application/x-xls", Guid.NewGuid() + ".xls");
        }
        [HttpGet, Route("setCache")]
        public ActionResult SetCache(string key)
        {
            var list = GetService<IProductService>().GetQuery().Where(s => s.Name.Equals("222222")).ToList();
            CacheHelper.SetCache(key, list);


            return new ContentResult() { Content = "true" };
        }
        [HttpGet, Route("getCache")]
        public ActionResult GetCache(string key)
        {
            var value = CacheHelper.GetCache<List<Product>>(key);

            return new ContentResult() { Content = JsonConvert.SerializeObject(value) };
        }

        protected override IQueryable<ProductViewModel> ProcessGetListViewModelDataQuery()
        {
            return GetService<IProductService>().GetListData();
        }
        protected override void GetListReload(LoadResult list)
        { 
            base.GetListReload(list);
            var items = list.GetData<ProductViewModel>();
            items.ForEach(item =>
            {
                item.CreateByName = "张三";
            });
        }

        [HttpGet, Route("SqlQueryTest")]
        public async Task<ApiResult<List<Product>>> SqlQueryTest(string name)
        {
            var list = GetService<IProductService>().SqlDataList(name).ToList();
            return await ApiResult.Of(list);
        }
    }
}
