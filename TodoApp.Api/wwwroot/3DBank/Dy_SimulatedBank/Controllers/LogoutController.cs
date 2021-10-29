using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Controllers
{
    public class LogoutController : Controller
    {
        //
        // GET: /Logout/

        public ActionResult Index()
        {
            Session["UserId"] = null;
            Session.Abandon();  //清除Session 
            Session.Clear();
            Response.Redirect("/Login");
            return View();
        }

    }
}
