using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp
{
    public struct SearchField
    {
        /// <summary>
        /// 分组,相同的Group查询时为or,不同的为and
        /// </summary>
        public int? Group { get; set; }
        /// <summary>
        /// 查询字段
        /// </summary>
        public string Field { get; set; }
        /// <summary>
        /// 查询动作
        /// </summary>
        public string Op { get; set; }
        /// <summary>
        /// 过滤值
        /// </summary>
        public string Value { get; set; }
        /// <summary>
        /// 多选值分隔符
        /// </summary>
        public string Split { get; set; }
    }
    public static partial class Extention
    {
        public static IQueryable<T> WhereFilter<T>(this IQueryable<T> query, SearchField[] filterRules)
        {
            if (filterRules != null && filterRules.Length > 0)
            {
                var ps = new List<WhereParameters>();

                int index = -1;
                foreach (var item in filterRules)
                {
                    if (string.IsNullOrEmpty(item.Value))
                        continue;

                    var names = item.Field.Split(',');
                    foreach (var name in names)
                    {
                        var values = item.Value.Split(new string[] { item.Split }, StringSplitOptions.RemoveEmptyEntries);
                        foreach (var value in values)
                        {
                            #region 处理String转Guid报错
                            object valParameter = value;
                            bool tryGuidResult = Guid.TryParse(value, out Guid val);
                            if (tryGuidResult)
                                valParameter = val;
                            #endregion

                            var wp = new WhereParameters() { value = valParameter, name = name, group = item.Group ?? index };
                            if (item.Value == "is null")
                            {
                                wp.value = null;
                                wp.isnotnull = false;
                                wp.wherefun = WhereFun.Equal;
                            }
                            else if (item.Value == "is not null")
                            {
                                wp.value = null;
                                wp.isnotnull = true;
                                wp.wherefun = WhereFun.NotEqual;
                            }
                            else
                            {
                                switch (item.Op.ToLower())
                                {
                                    case "=":
                                    case "==":
                                    case "equal":
                                    case "eq":
                                        wp.wherefun = WhereFun.Equal;
                                        break;

                                    case "!=":
                                    case "neq":
                                    case "notequal":
                                        wp.wherefun = WhereFun.NotEqual;
                                        break;

                                    case "<":
                                    case "lt":
                                    case "less":
                                        wp.wherefun = WhereFun.LessThan;
                                        break;

                                    case "<=":
                                    case "lte":
                                    case "lessorequal":
                                        wp.wherefun = WhereFun.LessThanOrEqual;
                                        break;

                                    case ">":
                                    case "gt":
                                    case "greater":
                                        wp.wherefun = WhereFun.GreaterThan;
                                        break;

                                    case ">=":
                                    case "gte":
                                    case "greaterorequal":
                                        wp.wherefun = WhereFun.GreaterThanOrEqual;
                                        break;

                                    case "!c":
                                    case "doesnotcontain":
                                        wp.wherefun = WhereFun.NotContains;
                                        break;

                                    case "^c":
                                    case "startswith":
                                        wp.wherefun = WhereFun.StartsWith;
                                        break;

                                    case "c$":
                                    case "endswith":
                                        wp.wherefun = WhereFun.EndsWith;
                                        break;

                                    case "like":
                                        wp.wherefun = WhereFun.Like;
                                        break;

                                    case "notlike":
                                        wp.wherefun = WhereFun.NotLike;
                                        break;

                                    default:
                                        wp.wherefun = WhereFun.Contains;
                                        break;

                                }
                            }
                            ps.Add(wp);
                        }
                    }

                    index--;
                }
                return query.Where(WhereEx<T>.Create(ps, true).ToFun());
            }
            return query;
        }
    }
    public class WhereParameters
    {
        public WhereParameters() { }
        public WhereParameters(object value, string name, WhereFun wherefun = WhereFun.Contains, bool isnotnull = true, int group = 0)
        {
            this.value = value;
            this.name = name;
            this.wherefun = wherefun;
            this.isnotnull = isnotnull;
            this.group = group;
        }
        public bool IsAddWhere(Type type)
        {
            if (this.isnotnull && IsValueNull(type))
                return false;
            return true;
        }
        public bool IsValueNull(Type type)
        {
            return string.IsNullOrEmpty(Convert.ToString(this.value));
        }
        public object value { get; set; }
        public string name { get; set; }
        public WhereFun wherefun { get; set; }
        public bool isnotnull { get; set; }
        public int group { get; set; }
    }
    public class WhereEx<T>
    {
        private Expression ex { get; set; }
        private ParameterExpression p_model { get; set; }
        public static WhereEx<T> Create(List<WhereParameters> ps, bool isand = true)
        {
            var model = new WhereEx<T>();
            model.p_model = Expression.Parameter(typeof(T), "p_model_where");
            if (ps == null || ps.Count == 0)
                return model;
            var grouplist = ps.GroupBy(d => d.group);
            if (isand)
            {
                foreach (var item in grouplist)
                    model.And(item.ToArray());
            }
            else
            {
                foreach (var item in grouplist)
                    model.Or(item.ToArray());
            }
            return model;
        }
        public static WhereEx<T> Create(object value, string name, WhereFun wherefun = WhereFun.Contains, bool isnotnull = true)
        {
            var model = new WhereEx<T>();
            model.p_model = Expression.Parameter(typeof(T), "p_model_where");
            model.And(new WhereParameters(value, name, wherefun, isnotnull));
            return model;
        }
        public WhereEx<T> And(object value, string name, WhereFun wherefun = WhereFun.Contains, bool isnotnull = true)
        {
            return this.And(new WhereParameters(value, name, wherefun, isnotnull));
        }
        public WhereEx<T> Or(object value, string name, WhereFun wherefun = WhereFun.Contains, bool isnotnull = true)
        {
            return this.Or(new WhereParameters(value, name, wherefun, isnotnull));
        }
        public WhereEx<T> And(params WhereParameters[] ps)
        {
            var psex = this.GetWhereEx(false, ps);
            if (psex != null)
            {
                if (this.ex == null)
                    this.ex = Expression.Constant(true, typeof(bool));
                this.ex = Expression.AndAlso(this.ex, psex);
            }
            return this;
        }
        public WhereEx<T> Or(params WhereParameters[] ps)
        {
            var psex = this.GetWhereEx(true, ps);
            if (psex != null)
            {
                if (this.ex == null)
                    this.ex = Expression.Constant(false, typeof(bool));
                this.ex = Expression.OrElse(this.ex, psex);
            }
            return this;
        }
        public Expression<Func<T, bool>> ToFun()
        {
            if (this.ex == null)
                this.ex = Expression.Constant(true, typeof(bool));
            return Expression.Lambda<Func<T, bool>>(this.ex, this.p_model);
        }
        private Expression GetWhereEx(bool isand, params WhereParameters[] ps)
        {
            Expression psex = Expression.Constant(isand);

            if (ps.Length == 0)
                return psex;

            bool isaddps = false; 
            foreach (var item in ps)
            {
                var pro = this.p_model.Type.GetProperty(item.name);
                if (pro == null)
                    continue;
                if (!item.IsAddWhere(pro.PropertyType))
                    continue;
                isaddps = true;
                var pro_type = pro.PropertyType;
                Expression left = Expression.Property(this.p_model, pro);
                
                Expression right = Expression.Constant(null);
                if (item.value != null)
                {
                    if (pro_type.IsGenericType && pro_type.GetGenericTypeDefinition() == typeof(Nullable<>))
                    {
                        right = Expression.Constant(Convert.ChangeType(item.value, (new System.ComponentModel.NullableConverter(pro_type)).UnderlyingType), pro_type);
                    }
                    else
                    {
                        right = Expression.Constant(Convert.ChangeType(item.value, pro_type), pro_type);
                    }
                }
                Expression body = null;
                if (item.wherefun == WhereFun.Contains || item.wherefun == WhereFun.StartsWith || item.wherefun == WhereFun.EndsWith)
                {
                    body = Expression.AndAlso(Expression.NotEqual(left, Expression.Constant(null, pro_type)), Expression.Call(left, pro_type.GetMethod(item.wherefun.ToString(), new Type[] { typeof(string) }), right));
                }
                else if (item.wherefun == WhereFun.NotContains)
                {
                    body = Expression.AndAlso(Expression.NotEqual(left, Expression.Constant(null, pro_type)), Expression.Not(Expression.Call(left, pro_type.GetMethod(WhereFun.Contains.ToString(), new Type[] { typeof(string) }), right)));
                }
                else if (item.wherefun == WhereFun.Equal)
                {
                    if (item.IsValueNull(pro_type) && pro_type == typeof(string))
                    {
                        body = Expression.Call(null, typeof(string).GetMethod("IsNullOrEmpty", new Type[] { typeof(string) }), left);
                    }
                    else
                    {
                        body = Expression.Equal(left, right);
                    }
                }
                else if (item.wherefun == WhereFun.NotEqual)
                {
                    if (item.IsValueNull(pro_type) && pro_type == typeof(string))
                    {
                        body = Expression.Not(Expression.Call(null, typeof(string).GetMethod("IsNullOrEmpty", new Type[] { typeof(string) }), left));
                    }
                    else
                    {
                        body = Expression.NotEqual(left, right);
                    }
                }
                else
                {
                    if (pro_type == typeof(string))
                    {
                        left = Expression.Call(left, pro_type.GetMethod("CompareTo", new Type[] { typeof(string) }), right);
                        right = Expression.Constant(0);
                    }
                    if (item.wherefun == WhereFun.GreaterThan)
                    {
                        body = Expression.GreaterThan(left, right);
                    }
                    else if (item.wherefun == WhereFun.GreaterThanOrEqual)
                    {
                        body = Expression.GreaterThanOrEqual(left, right);
                    }
                    else if (item.wherefun == WhereFun.LessThan)
                    {
                        body = Expression.LessThan(left, right);
                    }
                    else if (item.wherefun == WhereFun.LessThanOrEqual)
                    {
                        body = Expression.LessThanOrEqual(left, right);
                    }
                    if (body != null && pro_type == typeof(string))
                    {
                        body = Expression.AndAlso(Expression.NotEqual(Expression.Property(this.p_model, pro), Expression.Constant(null, pro_type)), body);
                    }
                }
                if (isand)
                {
                    psex = Expression.AndAlso(psex, body);
                }
                else
                {
                    psex = Expression.OrElse(psex, body);
                }
            }
            if (isaddps)
            {
                return psex;
            }
            else
            {
                return null;
            }
        }
    }

    public enum WhereFun
    {
        Contains = 1,
        Equal = 2,
        NotEqual = 3,
        GreaterThan = 4,
        GreaterThanOrEqual = 5,
        LessThan = 6,
        LessThanOrEqual = 7,
        StartsWith = 8,
        EndsWith = 9,
        NotContains = 10,
        Like = 11,
        NotLike = 12
    }
}
