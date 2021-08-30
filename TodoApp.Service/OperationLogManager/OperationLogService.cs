using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model;
using TodoApp.IService.IService.OptionLogManager;
using TodoApp.IService.Patten;
using TodoApp.Service.Patten;

namespace TodoApp.Service.OperationLogManager
{
    public class OperationLogService : ServiceBase<OperationLog, Guid>, IOperationLogService
    {
    }
}
