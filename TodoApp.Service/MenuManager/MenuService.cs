using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model.MenuManager;
using TodoApp.IService.IService.MenuManager;
using TodoApp.Service.Patten;

namespace TodoApp.Service.MenuManager
{
    public class MenuService : ServiceBase<Menu, Guid>, IMenuService
    {
        public override List<Menu> GetListByParentId(Guid? parentId)
        {
            return GetQuery().Where(s => s.ParentId == parentId).ToList();
        }
    }
}
