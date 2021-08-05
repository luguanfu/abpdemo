using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.IService.DTO.ShopManager
{
    public enum OutInshopType
    {
        [Description("转出")]
        OutShop = 1,
        [Description("转入")]
        InShop = 2,
        [Description("采购")]
        Purchase = 3,
    }
    public class OutInShopDto
    {
        public OutInshopType OutInType { get; set; }
        public string TypeName { get; set; }
        public string Number { get; set; }
        public Guid? OutShop { get; set; }
        public string OutShopName { get; set; }
        public Guid? InShop { get; set; }
        public string InShopName { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public DateTimeOffset CreateTime { get; set; }
        public Guid? CreateBy { get; set; }
        public string CreateByName { get; set; }
    }
    public class OutInShopInput
    { 
        public int OutInType { get; set; }
        public string Name { get; set; }
    }
}
