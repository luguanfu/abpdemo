using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoApp.Api.Api.Patten
{
    public class ApiResult<T> : ApiResult
    {
        public T Data { get; set; }

        public ApiResult(T data)
        {
            this.Data = data;
        }
    }
    public class ApiResult
    {
        public int Code { get; set; }
        public string Message { get; set; }

        public Task<ApiResult<T>> Of<T>(T data)
        {
            return Task.FromResult(new ApiResult<T>(data));
        }

        public Task<ApiResult> SuccessFul(string message = "")
        {
            return Task.FromResult(new ApiResult() { Message = message });
        }
    }
}
