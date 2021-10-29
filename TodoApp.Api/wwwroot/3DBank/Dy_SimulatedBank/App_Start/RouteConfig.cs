using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Dy_SimulatedBank
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Login", action = "Index", id = UrlParameter.Optional },
                namespaces: new string[] { "Dy_SimulatedBank.Controllers" }
            );
            routes.MapRoute(
                name: "Default1",
                url: "api/{controller}/{action}",
                defaults: new { controller = "Login", action = "Index"}
            );
        }
    }
}