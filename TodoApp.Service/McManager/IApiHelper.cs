using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.IService.IService.Patten;
using WebApiClientCore;
using WebApiClientCore.Attributes;

namespace TodoApp.Service.ApiManager
{
    [HttpHost("https://localhost:44373")]
    public interface IApiHelper : IHttpApi, IDependency
    {
        [HttpPost("/api/demo/Home/Test")]
        ITask<string> Test([FormField] string value);
    }
}
