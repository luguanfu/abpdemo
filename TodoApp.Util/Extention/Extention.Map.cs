using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using ExpressMapper;
using System.Collections.Generic;
using System.Linq;

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
    public static List<T> GetData<T>(this LoadResult result, DataSourceLoadOptionsBase loadOptions)
    {
        if (loadOptions.Group != null && loadOptions.Group.Length != 0)
        {
            List<Group> list = result.data?.Cast<Group>().ToList();
            List<T> list2 = new List<T>();
            if (list != null)
            {
                foreach (Group item in list)
                {
                    List<T> list3 = item.items?.Cast<T>().ToList();
                    if (list3 != null && list3.Count > 0)
                    {
                        list2.AddRange(list3);
                    }
                }

                return list2;
            }

            return list2;
        }

        return result.data?.Cast<T>().ToList();
    }
}
