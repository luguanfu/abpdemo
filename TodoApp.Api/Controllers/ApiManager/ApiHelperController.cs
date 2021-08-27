using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Api.Api.Patten;
using TodoApp.Entity.Model.McDataManage;
using TodoApp.Entity.Model.MenuManager;
using TodoApp.Entity.Model.ProductManager;
using TodoApp.IService.DTO;
using TodoApp.IService.DTO.MenuManager;
using TodoApp.IService.IService.ProductManager;
using TodoApp.Service.ApiManager;
using TodoApp.Service.McManager;
using TodoApp.Util.Helper;

namespace TodoApp.Api.Controllers.ApiManager
{
    [ApiController]
    [Route("api/apihelper/[controller]")]
    public class ApiHelperController : ControllerBase
    {
        IHttpClientFactory clientFactory;
        public ApiHelperController(IHttpClientFactory factory)
        {
            this.clientFactory = factory;
        }

        public ApiResult ApiResult => new ApiResult();

        [HttpGet("GetToken")]
        public string GetToken()
        {
            string url = $"http://sukon-cloud.com/api/v1/token/initToken";

            string uid = "a7ead36ca2ab43d89e36e80af48b62f7";
            string sid = "3256d92083fe4030b570911f25a55431";
            string random = "123abc";
            var timestamp = (DateTime.Now.ToUniversalTime().Ticks - 621355968000000000) / 10000; //10000000
            var signature = string.Format("{0}{1}{2}{3}", uid, sid, random, timestamp).ToMD5String().ToUpper();

            Dictionary<string, object> dics = new Dictionary<string, object>();
            dics.Add("uid", uid);
            dics.Add("sid", sid);
            dics.Add("random", random);
            dics.Add("timestamp", timestamp);
            dics.Add("signature", signature);
            string token = ApiHelper.GetToken(url, dics);


            return token;
        }
        [HttpPost("projects")]
        public async Task<ApiResult<List<Project>>> Projects(string token)
        {
            Dictionary<string, object> data = new Dictionary<string, object>();
            data.Add("token", token);

            var result = new McService().GetProjectList(data);

            return await ApiResult.Of(result);
        }

        [HttpPost("GetMenu")]
        public async Task<ApiResult<List<Menu>>> GetMenu(string name,int? level, string token)
        {
            Dictionary<string, object> data = new Dictionary<string, object>();
            data.Add("Input", new MenuInput { Name = name, Level = level });
            data.Add("PageIndex", 1);
            data.Add("PageSize", 20);

            List<Menu> list = new List<Menu>();

            ApiHelper.Post("https://localhost:44320/api/apitest/ApiTest/GetMenu", data, ref list, token);

            return await ApiResult.Of(list);
        }
    }
}
