using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.IService.DTO
{
    public class PageResult<T>
    {
        public List<T> Data { get; set; }
        public int TotalItems { get; set; }
    }
    public class PageInput<T>
    {
        public T Input { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }
}
