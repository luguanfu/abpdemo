
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.IService.UnitManager
{
    public class UnitOfWork : IUnitOfWork
    {
        private DbContext _context;
        private IDbContextTransaction _tran;
        public UnitOfWork(DbContext context)
        {
            this._context = context;

            BeginTransaction();
        }

        private void BeginTransaction()
        {
            _tran = _context.Database.BeginTransaction();
        }

        public void Commit()
        {
            _tran.Commit();
        }

        public void Dispose()
        {
            _tran.Dispose();
        }
        public void Rollback()
        {
            _tran.Rollback();
        }
    }
}
