using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp
{
    public static partial class Extention
    {
        public static string FirstToLower(this string str)
        {
            return str[0].ToString().ToLower() + str.Substring(1);
        }
    }
}
