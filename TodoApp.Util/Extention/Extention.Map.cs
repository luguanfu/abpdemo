using ExpressMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp
{
    public static partial class Extention
    {
        public static TTarget Map<TSource, TTarget>(this TSource source)
        {
            if (!Mapper.MapExists(typeof(TSource), typeof(TTarget)))
            {
                Mapper.Register<TSource, TTarget>();
            }

            return Mapper.Map<TSource, TTarget>(source);
        }
        public static List<TTarget> MapList<TSource, TTarget>(this List<TSource> source)
        {
            if (!Mapper.MapExists(typeof(TSource), typeof(TTarget)))
            {
                Mapper.Register<TSource, TTarget>();
            }

            List<TTarget> list = new List<TTarget>();
            foreach (TSource item2 in source)
            {
                TTarget item = Mapper.Map<TSource, TTarget>(item2);
                list.Add(item);
            }

            return list;
        }
    }
}
