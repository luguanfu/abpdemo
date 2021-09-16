using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TodoApp.WebFramework.Controllers
{
    public class MenuController : BaseController<Todo_Menu>
    {
        // GET: Menu
        public ActionResult List()
        {
            var list = service.GetQuery().ToList();
            return View(list);
        }
    }
}