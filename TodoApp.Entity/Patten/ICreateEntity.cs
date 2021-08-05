using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Entity.Patten
{
    public interface ICreateEntity
    {
        Guid? CreateBy { get; set; }
        DateTimeOffset? CreateTime { get; set; }
    }
}
