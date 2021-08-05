using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model.MenuManager;
using TodoApp.IService.IService.Patten;

namespace TodoApp.IService.IService.MenuManager
{
    public interface IMenuService : IServiceBase<Menu, Guid>
    {
        
    }
}
