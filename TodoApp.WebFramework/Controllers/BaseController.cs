using System;
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
    }
}