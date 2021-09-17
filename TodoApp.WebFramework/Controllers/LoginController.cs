using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace TodoApp.WebFramework.Controllers
{
    public class LoginController : BaseController<Form_Data>
    {
        // GET: Login
        public ActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Login(string UserName, string Password)
        {
            FormsAuthentication.SetAuthCookie(UserName, false);

            GetOnline(UserName);

            return Redirect("/Home/Index");
        }
    }
}