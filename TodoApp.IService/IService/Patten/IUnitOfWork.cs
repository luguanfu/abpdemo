using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.IService.IService.Patten;

namespace TodoApp.IService.Patten
{
    public interface IUnitOfWork : IDisposable, IDependency
    {
        void Commit();
        void Rollback();
    }
}
