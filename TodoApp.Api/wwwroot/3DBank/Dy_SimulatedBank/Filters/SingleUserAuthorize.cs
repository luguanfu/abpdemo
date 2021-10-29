
using System;
using System.Collections;
using System.Web;
using System.Web.Mvc;
using Dy_SimulatedBank.Models;

namespace Dy_SimulatedBank.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class SingleUserAuthorize : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if(!SSOHelper.CheckOnline())
            {
                filterContext.HttpContext.Response.Redirect("/Login/Lout?LoutId=1");
            }

        }
        //protected override bool AuthorizeCore(HttpContextBase filterContext.HttpContext)
        //{
        //    Hashtable userOnline = (Hashtable)(filterContext.HttpContext.Application[Contants.Online]);
        //    if (userOnline != null)
        //    {
        //        IDictionaryEnumerator idE = userOnline.GetEnumerator();
        //        if (userOnline.Count > 0)
        //        {
        //            while (idE.MoveNext())
        //            {
        //                //登录时判断保存的session是否与当前页面的session相同
        //                if (userOnline.Contains(filterContext.HttpContext.Session.SessionID))
        //                {
        //                    if (idE.Key != null && idE.Key.ToString().Equals(filterContext.HttpContext.Session.SessionID))
        //                    {
        //                        //判断当前session保存的值是否为被注销值
        //                        if (idE.Value != null && Contants.RepeateLoginFlage.Equals(idE.Value.ToString()))
        //                        {
        //                            //验证被注销则清空session
        //                            userOnline.Remove(filterContext.HttpContext.Session.SessionID);
        //                            filterContext.HttpContext.Application.Lock();
        //                            filterContext.HttpContext.Application["Online"] = userOnline;
        //                            filterContext.HttpContext.Response.Write("<script>location.href='/Logout?repeate=1';</script>");

        //                            return false;
        //                        }
        //                    }
        //                }
        //                else
        //                {
        //                    return false;
        //                }
        //            }
        //            return true;
        //        }
        //        return false;

        //    }
        //    return false;
        //}


        //protected override void HandleUnauthorizedRequest(System.Web.Mvc.AuthorizationContext filterContext)
        //{
        //    if (filterContext.HttpContext.Request.IsAuthenticated)
        //    {
        //        filterContext.Result = new System.Web.Mvc.HttpStatusCodeResult((int)System.Net.HttpStatusCode.Forbidden);
        //    }
        //    else
        //    {
        //        base.HandleUnauthorizedRequest(filterContext);
        //    }
        //}
    }
}