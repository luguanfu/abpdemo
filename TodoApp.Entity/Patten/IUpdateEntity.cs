using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Entity.Patten
{
    public interface IUpdateEntity
    {
        Guid? UpdateBy { get; set; }
        int UpdateVersion { get; set; }
        DateTimeOffset? UpdateTime { get; set; }
    }
}
