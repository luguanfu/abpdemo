using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Todo.App.Cache;
using TodoApp.Api.Api.Patten;
using TodoApp.Api.Helper;
using TodoApp.Entity.Model.UserModel;
using TodoApp.IService.DTO.UserManager;
using TodoApp.IService.IService.UserManager;

namespace TodoApp.Api.Controllers.UserManager
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ApiBase<User, Guid>
    {
        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="userName">帐号</param>
        /// <param name="password">密码</param>
        /// <returns></returns>
        [HttpGet, Route("Login")]
        [AllowAnonymous]
        public IActionResult GetToken(string userName, string password)
        {
            var user = GetService<IUserService>().GetQuery().FirstOrDefault(s => s.UserName.Equals(userName));
            if (user == null || user.Password != password)
            {
                throw new Exception($"{userName}不存在或密码错误");
            }
            CacheHelper.SetCache("User", user);
            var responseResult = new
            {
                Success = true,
                Data = JWTUtil.GetToken(user),
            };
            return Ok(responseResult);
        }
    }
}
