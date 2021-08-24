using Autofac;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Todo.App.Cache;
using TodoApp.Api.Api.DetailTable;
using TodoApp.Api.Api.Patten;
using TodoApp.Entity.Model.ProductManager;
using TodoApp.IService.DTO.ProductManager;
using TodoApp.IService.IService.ProductManager;

namespace TodoApp.Api.Controllers.ProductManager
{
    /// <summary>
    /// 产品
    /// </summary>
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
            IsLogicDelete = true,
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

            float a = 26.24f;
            float b = a * 100.0f;
            float c = b / 100.0f;

            double d = 26.32d;

            return new ContentResult() { Content = $"{a},{b},{c}" };
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
        protected override void GetListReload(LoadResult list, LoadOptions options)
        {
            base.GetListReload(list, options);
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
