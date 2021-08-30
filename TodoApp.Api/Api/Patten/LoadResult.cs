using DevExtreme.AspNet.Data.ResponseModel;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoApp.Api.Api.Patten
{
    public class LoadResult
    {
        /// <summary>
        /// 结果集
        /// </summary>
        public IEnumerable Data { get; set; }
        /// <summary>
        /// 汇总对象
        /// </summary>
        public dynamic TModel { get; set; }
        /// <summary>
        /// 总记录数
        /// </summary>
        public int TotalSummary { get; set; }
    }
    public static class ApiExtention
    {
        public static List<T> GetData<T>(this LoadResult loadResult)
        {
            return loadResult.Data.Cast<T>().ToList();
        }
    }
}
