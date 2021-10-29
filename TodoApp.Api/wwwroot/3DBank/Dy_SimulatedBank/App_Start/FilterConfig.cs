using Dy_SimulatedBank.Filters;
using System.Web;
using System.Web.Mvc;

namespace Dy_SimulatedBank
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}