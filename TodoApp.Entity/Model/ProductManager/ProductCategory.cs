using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Entity.Model.ProductManager
{
    public class ProductCategory : IEntity<Guid>
    {
        [Key]
        [BsonElement("Id")]
        public Guid Id { get; set; }
        [BsonElement("TypeName")]
        public string TypeName { get; set; }
    }
}
