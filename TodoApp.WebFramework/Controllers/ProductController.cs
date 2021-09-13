using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TodoApp.WebFramework.Data;
using TodoApp.WebFramework.Models;

namespace TodoApp.WebFramework.Controllers
{
    public class ProductController : Controller
    {
        ProductDto productDto = new ProductDto();
        // GET: Product
        public ActionResult List()
        {

            return View(ProductDto.List);
        }
        public ActionResult Add(Guid? id = null)
        {
            Product model = new Product();
            if (id != null)
            {
                model = ProductDto.List.FirstOrDefault(s => s.Id == id.Value);
            }
            return View(model);
        }
        [HttpPost]
        public ActionResult Add(Product p, bool isAdd)
        {
            if (!ModelState.IsValid)
            { 
            }
            if (p.Id == Guid.Empty)
            {
                p.Id = Guid.NewGuid();
            }
            if (isAdd)
            {
                productDto.Add(p);
            }
            return Redirect("List");
        }
    }
}