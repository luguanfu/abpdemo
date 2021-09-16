using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TodoApp.WebFramework.FormManager.Filters
{
    public class HtmlControlAttribute:Attribute
    {
        public string Name { get; set; }
        public string Id { get; set; }
    }
}