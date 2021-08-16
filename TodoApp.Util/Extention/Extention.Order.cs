using System;
using System.Linq;
using System.Linq.Expressions;

public struct OrderField
{
    public string FieldName { get; set; }
    public bool IsDESC { get; set; }
}
public static partial class Extention
{
    /// <summary>
    /// 升序
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="query"></param>
    /// <param name="order"></param>
    /// <returns></returns>
    public static IQueryable<T> OrderBy<T>(this IQueryable<T> query, string order)
    {
        return OrderBy(query, order, false);
    }
    /// <summary>
    /// 降序
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="query"></param>
    /// <param name="order"></param>
    /// <returns></returns>
    public static IQueryable<T> OrderByDescending<T>(this IQueryable<T> query, string order)
    {
        return OrderBy(query, order, true);
    }
    /// <summary>
    /// 组合升序
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="query"></param>
    /// <param name="order"></param>
    /// <returns></returns>
    public static IQueryable<T> ThenBy<T>(this IQueryable<T> query, string order)
    {
        return OrderBy(query, order, false, true);
    }
    /// <summary>
    /// 组合降序
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="query"></param>
    /// <param name="order"></param>
    /// <returns></returns>
    public static IQueryable<T> ThenByDescending<T>(this IQueryable<T> query, string order)
    {
        return OrderBy(query, order, true, true);
    }

    private static IQueryable<T> OrderBy<T>(this IQueryable<T> query, string order, bool isDesc, bool isThenBy = false)
    {
        try
        {
            //创建表达式变量参数
            var parameter = Expression.Parameter(typeof(T), "o");

            //根据属性名获取属性
            var property = typeof(T).GetProperty(order);
            //创建一个访问属性的表达式
            var propertyAccess = Expression.MakeMemberAccess(parameter, property);
            var orderByExp = Expression.Lambda(propertyAccess, parameter);


            string OrderName = isDesc ? "OrderByDescending" : "OrderBy";
            if (isThenBy)
            {
                OrderName = isDesc ? "ThenByDescending" : "ThenBy";
            }

            MethodCallExpression resultExp = Expression.Call(typeof(Queryable), OrderName, new Type[] { typeof(T), property.PropertyType }, query.Expression, Expression.Quote(orderByExp));
            query = query.Provider.CreateQuery<T>(resultExp);

            return query;
        }
        catch
        {
            throw new Exception($"排序异常:请检查 {order} 是否存在,大小写是否与属性匹配");
        }
    }
}
