using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model.MenuManager;
using TodoApp.IService.DTO.MenuManager;
using TodoApp.IService.IService.Patten;

namespace TodoApp.IService.IService.MenuManager
{
    public interface IMenuService : IServiceBase<Menu, Guid>
    {
        IQueryable<MenuViewModel> GetListData();

        void ImportData(List<MenuImportModel> dataList);
    }
}
