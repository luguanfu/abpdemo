using Aspose.Cells;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Todo.App.Cache;
using TodoApp.Api.Api.Patten;
using TodoApp.Entity.Model.MenuManager;
using TodoApp.IService.DTO.MenuManager;
using TodoApp.IService.IService.MenuManager;
using TodoApp.IService.IService.Patten;

namespace TodoApp.Api.Controllers.MenuManager
{
    /// <summary>
    /// 菜单服务
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : TreeApiBase<Menu, Guid>
    {
        //protected override bool IgnoreAuth => true;
        //protected override bool? IsDeleted => null;
        protected override List<Menu> GetListByParentId(Guid? parentId)
        {
            return GetService<IMenuService>().GetQuery(IsDeleted).Where(s => s.ParentId == parentId).ToList();
        }
        [HttpGet,Route("Test")]
        public Task<ApiResult<Menu>> Test()
        {
            string menuCacheKey = "MenuCache";
            Menu m = new Menu { Name = "abcdef" };

            Func<string, Menu> f = (a) =>
            {
                m.Name += a;
                return m;
            };

            var val = CacheHelper.GetCache<Menu>(menuCacheKey, f, 60);

            return ApiResult.Of(val);
        }
        /// <summary>
        /// 导入
        /// </summary>
        /// <returns></returns>
        [HttpPost("Import")]
        public async Task<ApiResult> Import([FromBody] MenuImportDto input)
        {
            var req = WebRequest.Create(input.FileUrl) as HttpWebRequest;
            if (req != null)
            {
                Workbook book = null;
                using (var wc = new WebClient())
                {
                    //using (var str = wc.OpenRead(Zny.Common.Utils.GetAttachmentURL(input.FileUrl)))
                    using (var str = wc.OpenRead(input.FileUrl))
                    {
                        using (var ms = new MemoryStream())
                        {
                            if (str != null) str.CopyTo(ms);
                            book = new Workbook(ms);
                        }
                    }
                }
                Worksheet sheet = book.Worksheets[0];
                Cells cells = sheet.Cells;
                var columnCount = cells.Columns.Count;
                //读取Excel中的列信息，并初始化DataTable结构。
                DataTable dataTable = sheet.Cells.ExportDataTableAsString(0, 0, 1, columnCount, true);

                int rowCount = cells.Rows.Count;
                dataTable = sheet.Cells.ExportDataTableAsString(0, 0, rowCount, columnCount, true);
                book.Dispose();

                var dtJson = dataTable.ConvertToJsonByNewtonsoft();
                var datas = JsonConvert.DeserializeObject<List<MenuImportModel>>(dtJson);

                GetService<IMenuService>().ImportData(datas);
            }

            return await ApiResult.SuccessFul();
        }
    }
}
