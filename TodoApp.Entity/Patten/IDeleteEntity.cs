using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Entity.Patten
{
    public interface IDeleteEntity
    {
        Guid? DeleteBy { get; set; }
        DateTimeOffset? DeleteTime { get; set; }
        bool IsDeleted { get; set; }
    }
}
