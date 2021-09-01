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
using TodoApp.IService.Patten;
using TodoApp.Service.Patten;

namespace TodoApp.Service.MenuManager
{
    public class MenuService : ServiceBase<Menu, Guid>, IMenuService
    {
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
        public void ImportData(List<MenuImportModel> dataList)
        {
            List<Menu> insertList = new List<Menu>();
            Guid? parentId1=null, parentId2=null, parentId3=null;
            dataList?.ForEach(item =>
            {
                Menu m = new Menu();
                if (!string.IsNullOrEmpty(item.Name1))
                {
                    parentId1 = m.Id = Guid.NewGuid();
                    m.Name = item.Name1;
                    //m.Level = 1;
                }
                if (!string.IsNullOrEmpty(item.Name2))
                {
                    parentId2 = m.Id = Guid.NewGuid();
                    m.ParentId = parentId1.Value;
                    m.Name = item.Name2;
                    //m.Level = 2;
                }
                if (!string.IsNullOrEmpty(item.Name3))
                {
                    parentId3 = m.Id = Guid.NewGuid();
                    m.ParentId = parentId2.Value;
                    m.Name = item.Name3;
                    //m.Level = 3;
                }
                if (!string.IsNullOrEmpty(item.Name4))
                {
                    m.Id = Guid.NewGuid();
                    m.ParentId = parentId3.Value;
                    m.Name = item.Name4;
                    //m.Level = 4;
                }
                insertList.Add(m);
            });
            this.BulkInsert(insertList);
        }
    }
}
