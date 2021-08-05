using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model;
using TodoApp.IService.IService.Patten;

namespace TodoApp.IService.IService.OptionLogManager
{
    public interface IOperationLogService : IServiceBase<OperationLog, Guid>
    {
    }
}
