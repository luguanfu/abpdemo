using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoApp.Api.Api.Patten
{
    public class LoadOptions
    {
        /// <summary>
        /// 跳过记录数
        /// </summary>
        public int Skip { get; set; }
        /// <summary>
        /// 返回记录数
        /// </summary>
        public int Take { get; set; }
        /// <summary>
        /// 是否返回汇总记录
        /// </summary>
        public bool IsCountQuery { get; set; }
        /// <summary>
        /// 汇总字段
        /// </summary>
        public string[] CountField { get; set; }
        /// <summary>
        /// 查询字段
        /// </summary>
        public string[] select { get; set; }
        /// <summary>
        /// 过滤条件
        /// </summary>
        public SearchField[] Filter { get; set; }
        /// <summary>
        /// 排序
        /// </summary>
        public OrderField[] sortfilter { get; set; }
    }
}
