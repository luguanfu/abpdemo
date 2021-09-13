using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TodoApp.WebFramework.Models;

namespace TodoApp.WebFramework.Data
{
    public class ProductDto
    {
        public static List<Product> List = new List<Product>();

        public void Add(Product item)
        {
            var temp = List.FirstOrDefault(s => s.Id == item.Id);
            if (temp != null)
            {
                temp.Name = item.Name;
            }
            else
            {
                List.Add(item);
            }
        }
    }
}