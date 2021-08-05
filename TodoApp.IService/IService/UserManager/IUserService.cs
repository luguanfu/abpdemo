using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model.UserModel;
using TodoApp.IService.IService.Patten;

namespace TodoApp.IService.IService.UserManager
{
    public interface IUserService : IServiceBase<User, Guid>
    {
        List<User> GetListData();
    }
}
