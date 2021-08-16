using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

public static partial class Extention
{
    /// <summary>
    /// 取最大值
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <param name="query"></param>
    /// <param name="field"></param>
    /// <returns></returns>
    public static long MaxValue<TEntity>(this IQueryable<TEntity> query, string field, long defaultValue = 0)
    {
        long value = defaultValue;
        Type type = typeof(TEntity);
        var propertys = type.GetProperties();

        foreach (var item in query)
        {
            var pro = propertys.FirstOrDefault(s => s.Name.Equals(field));
            if (pro != null)
            {
                long temp = Convert.ToInt64(pro.GetValue(item));
                if (temp > value)
                    value = temp;
            }
        }

        return value;
    }
    public static TEntity Summary<TEntity>(this List<TEntity> query, params string[] fields)
    {
        Type type = typeof(TEntity);
        TEntity result = Activator.CreateInstance<TEntity>();

        var propertys = type.GetProperties();
        foreach (var pro in propertys)
        {
            if (fields.Contains(pro.Name))
            {
                pro.SetValue(result, Convert.ChangeType(GetSumData(query, propertys, pro.Name), pro.PropertyType));
            }
        }

        return result;
    }
    private static object GetSumData<TEntity>(List<TEntity> query, PropertyInfo[] infos, string field)
    {
        decimal result = 0;
        query.ForEach(item =>
        {
            foreach (var info in infos)
            {
                if (info.Name.Equals(field))
                {
                    var value = info.GetValue(item);
                    if (value != null && value != DBNull.Value)
                    {
                        result += Convert.ToDecimal(value);
                    }
                }
            }
        });
        return result;
    }
}
