using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model.UserModel;

namespace Todo.App.Cache
{
    public class UserCacheProject
    {
        public static Guid LoginUserId
        {
            get
            {
                return CacheHelper.GetCache<User>("User").Id;
            }
        }
        public static string GetUserName(Guid? userId)
        {
            if (CacheHelper.IsSet("UserList"))
            {
                var list = CacheHelper.GetCache<List<User>>("UserList");

                return list?.FirstOrDefault(s => s.Id == userId)?.UserName;
            }
            return string.Empty;
        }
    }
}
