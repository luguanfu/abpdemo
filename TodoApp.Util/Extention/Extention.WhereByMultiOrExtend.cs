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
        public static IQueryable<T> WhereByMultiOr<T, TFilter>(this IQueryable<T> entitySet, IEnumerable<TFilter> filters, Expression<Func<T, TFilter, bool>> predicate)
        {
            var innerFilters = filters.ToArray();
            if (innerFilters == null || innerFilters.Length == 0)
                throw new ArgumentOutOfRangeException(nameof(filters));

            //条件参数数据常量化，所以参数只保留 被过滤的数据
            var pe = predicate.Parameters.First();
            var orElseExpressions = innerFilters.Select(filter => new ParameterModifier<TFilter>().Modify(predicate, filter))
                .ToList();
            var predicateBody = orElseExpressions.First();
            if (orElseExpressions.Count > 1)
            {
                for (var i = 1; i < orElseExpressions.Count; i++)
                {
                    predicateBody = Expression.OrElse(predicateBody, orElseExpressions[i]);
                }
            }

            var whereCallExpression = Expression.Call(
                typeof(Queryable),
                "Where",
                new[] { typeof(T) },
                entitySet.Expression,
                Expression.Lambda<Func<T, bool>>(predicateBody, pe)
            );
            return entitySet.Provider.CreateQuery<T>(whereCallExpression);
        }
        private class ParameterModifier<TFilter> : ExpressionVisitor
        {
            private TFilter _localParam;

            public Expression Modify(Expression expression, TFilter param)
            {
                _localParam = param;
                return Visit(expression);
            }

            protected override Expression VisitBinary(BinaryExpression node)
            {
                var left = Visit(node.Left);
                var right = Visit(node.Right);
                string memberName;
                if (CheckForParameter(left))
                    left = Expression.Constant(_localParam);
                else if (CheckForProperty(left, out memberName))
                    left = Expression.Constant(_localParam.GetType().GetProperty(memberName).GetValue(_localParam, null));
                if (CheckForParameter(right))
                    right = Expression.Constant(_localParam);
                else if (CheckForProperty(right, out memberName))
                    right = Expression.Constant(_localParam.GetType().GetProperty(memberName)
                        .GetValue(_localParam, null));
                // right为常量的时候，需要转换成和left一样的类型，比如 int 转换成 Nullable<int>
                right = Expression.Convert(right, left.Type);
                return Expression.MakeBinary(node.NodeType, left, right);
            }

            private static bool CheckForParameter(Expression e)
            {
                return e is ParameterExpression;
            }
            private static bool CheckForProperty(Expression e, out string memberName)
            {
                memberName = string.Empty;
                if (!(e is MemberExpression me) || me.Expression.Type != typeof(TFilter))
                    return false;
                memberName = me.Member.Name;
                return true;
            }

            protected override Expression VisitLambda<T>(Expression<T> node)
            {
                return Visit(node.Body);
            }
        }
    }   
}
