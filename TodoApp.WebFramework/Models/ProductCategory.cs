using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace TodoApp.WebFramework.Models
{
    public class ProductCategory
    {
        public Guid Id { get; set; }
        [Required]
        public string CategoryName { get; set; }
    }
}