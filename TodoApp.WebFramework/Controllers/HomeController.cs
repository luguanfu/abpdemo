using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TodoApp.WebFramework.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            Session[""] = "";
            ViewBag.Name = User.Identity.Name;
            return View();
        }
    }
}