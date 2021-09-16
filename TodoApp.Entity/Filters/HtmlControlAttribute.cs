using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Entity.Filters
{
    public class HtmlControlAttribute : Attribute
    {
        public string Name { get; set; }
        public string Id { get; set; }
    }
}
