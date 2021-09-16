using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using TodoApp.WebFramework.FormManager.Filters;

namespace TodoApp.WebFramework.FormManager.Forms
{
    public class MyForm
    { }

    public class Form01 : MyForm
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        public int Age { get; set; }
    }
    public class Form02 : MyForm
    {
        [Required(ErrorMessage ="Name必填")]
        public string Name { get; set; }

        public int Age { get; set; }
        public DateTime? Birthday { get; set; }
    }
}