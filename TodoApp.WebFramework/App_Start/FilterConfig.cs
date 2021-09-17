using System.Web;
using System.Web.Mvc;
using TodoApp.WebFramework.Filters;

namespace TodoApp.WebFramework
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new LoginActionFilter());
        }
    }
}
