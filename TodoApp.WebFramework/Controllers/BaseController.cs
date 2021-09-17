using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TodoApp.WebFramework.Service;

namespace TodoApp.WebFramework.Controllers
{
    public class BaseController<TEntity> : Controller
        where TEntity : class
    {
        protected ServiceBase<TEntity> service = new ServiceBase<TEntity>();

        public void GetOnline(string Name)
        {
            Hashtable SingleOnline = (Hashtable)System.Web.HttpContext.Current.Application["Online"];
            if (SingleOnline == null)
                SingleOnline = new Hashtable();

            Session["mySession"] = "Test";
            //SessionID
            if (SingleOnline.ContainsKey(Name))
            {
                SingleOnline[Name] = Session.SessionID;
            }
            else
                SingleOnline.Add(Name, Session.SessionID);

            System.Web.HttpContext.Current.Application.Lock();
            System.Web.HttpContext.Current.Application["Online"] = SingleOnline;
            System.Web.HttpContext.Current.Application.UnLock();
        }
    }
}