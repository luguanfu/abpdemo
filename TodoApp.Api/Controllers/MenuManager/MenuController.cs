using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    }
}
