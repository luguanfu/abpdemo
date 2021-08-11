using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp
{
    public static partial class Extention
    {
        public static T SafeValue<T>(this T? value) where T : struct
        {
            return value.GetValueOrDefault();
        }
    }   
}
