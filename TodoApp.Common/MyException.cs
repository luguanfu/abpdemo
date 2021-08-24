using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Common
{
    public class MyException : Exception
    {
        public int ErrorCode;

        public MyException(string message) : base(message)
        { }

        public MyException(int erroCode, string message) : base(message)
        {
            this.ErrorCode = erroCode;
        }
        public MyException(string message, Exception innerException) : base(message, innerException)
        {

        }
    }
}
