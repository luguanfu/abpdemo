using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoApp.Api.Filters
{
    public class CustomerExceptionFilter : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            //定义返回信息
            var res = new
            {
                Code = 500,
                Message = context.Exception.Message
            };

            context.Result = new ContentResult
            {
                // 返回状态码设置为200，表示成功
                StatusCode = StatusCodes.Status200OK,
                // 设置返回格式
                ContentType = "application/json;charset=utf-8",
                Content = JsonConvert.SerializeObject(res)
            };
        }
    }
}
