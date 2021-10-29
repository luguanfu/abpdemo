using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank.Controllers
{
    public class CounterController : BaseController
    {
        //
        // GET: /Counter/

        public ActionResult Index()
        {
            return View();
        }

    }
}
