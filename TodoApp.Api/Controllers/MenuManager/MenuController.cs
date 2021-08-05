using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Api.Api.Patten;
using TodoApp.Entity.Model.MenuManager;
using TodoApp.IService.IService.MenuManager;

namespace TodoApp.Api.Controllers.MenuManager
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : TreeApiControllerBase<Menu, Guid>
    {
        protected override bool? IsDeleted => null;
        protected override List<Menu> GetListByParentId(Guid? parentId)
        {
            return GetService<IMenuService>().GetQuery().Where(s => s.ParentId == parentId).ToList();
        }
    }
}
