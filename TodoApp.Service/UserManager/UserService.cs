using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model.UserModel;
using TodoApp.IService.IService.UserManager;
using TodoApp.Service.Patten;

namespace TodoApp.Service.UserManager
{
    public class UserService : ServiceBase<User, Guid>, IUserService
    {
        public List<User> GetListData()
        {
            throw new NotImplementedException();
        }
    }
}
