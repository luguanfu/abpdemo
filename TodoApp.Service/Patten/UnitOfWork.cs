
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
using TodoApp.IService.Patten;
using TodoApp.Repository;

namespace TodoApp.Service.Patten
{
    public class UnitOfWork : IUnitOfWork
    {
        private EfDbContext _context;
        private IDbContextTransaction _tran;
        public UnitOfWork(EfDbContext context)
        {
            this._context = context;
        }

        public void BeginTransaction()
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
