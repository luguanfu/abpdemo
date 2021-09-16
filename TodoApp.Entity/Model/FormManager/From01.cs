using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Filters;

namespace TodoApp.Entity.Model.FormManager
{
    /// <summary>
    /// 表单模型-01
    /// </summary>
    public class From01
    {
        [HtmlControl(Name = "productName", Id = "productName")]
        public string ProductName { get; set; }
    }
}
