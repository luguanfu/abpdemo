
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Entity.Model.ShopManager
{
    /// <summary>
    /// 出入库记录
    /// </summary>
    public class StockRecord : IEntity<Guid>
    {
        /// <summary>
        /// 主键
        /// </summary>
        [BsonId]
        [BsonElement("Id")]
        public Guid Id { get; set; }
        /// <summary>
        /// 库存变更类型
        /// </summary>
        [BsonElement("RecordType")]
        public int RecordType { get; set; }
    }
}
