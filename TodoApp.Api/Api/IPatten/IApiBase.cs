using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoApp.Api.Api.IPatten
{
    public interface IApiBase
    {
    }
    public static class ApiBaseExtention
    {
        /// <summary>
        /// 归档
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="apiBase"></param>
        /// <param name="ids"></param>
        /// <returns></returns>
        public static bool Archive<T>(this T apiBase,List<Guid> ids) where T : IApiBase
        {
            return false;
        }
    }
}
