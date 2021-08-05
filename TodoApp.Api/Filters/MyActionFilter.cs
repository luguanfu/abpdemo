using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Api.Filters
{
    public class MyActionFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            //bool insert = context.HttpContext.Request.Path.Value?.EndsWith("Insert") ?? false;
            //if (insert)
            //{
            //    //var commandDto = context.ActionArguments["entity"] as EntityBase<Guid>;

            //    using (var msm = new MemoryStream())
            //    {
            //        string value = "aa";
            //        byte[] buffers = value.GetBytes();
            //        msm.Write(buffers, 0, buffers.Length);
            //        context.HttpContext.Request.Body = msm;
            //    }
            //}
        }
    }
}
