using LinqKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model.MenuManager;
using TodoApp.IService.DTO.MenuManager;
using TodoApp.IService.IService.MenuManager;
using TodoApp.Service.Patten;

namespace TodoApp.Service.MenuManager
{
    public class MenuService : ServiceBase<Menu, Guid>, IMenuService
    {
        protected override bool? IsDelete => true;

        public override List<Menu> GetListByParentId(Guid? parentId)
        {
            return GetQuery().Where(s => s.ParentId == parentId).ToList();
        }
        public IQueryable<MenuViewModel> GetListData()
        {
            Expression<Func<Menu, MenuViewModel>> s = (a) => new MenuViewModel
            {
                MyTestName = "test"
            };
            s = s.BuildExtendSelectExpre();

            return from a in this.GetQuery().AsExpandable()
                   select s.Invoke(a);
        }
    }
}
