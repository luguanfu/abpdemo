using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Entity.Model.FormManager
{
    public class Form_Data : EntityBase<Guid>
    {
        public string FormId { get; set; }
        public Guid DataId { get; set; }
        public string FieldName { get; set; }
        public string Value { get; set; }
    }
}
