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
        public static Expression<Func<TBase, TResult>> BuildExtendSelectExpre<TBase, TResult>(this Expression<Func<TBase, TResult>> expression)
        {
            return GetExtendSelectExpre<TBase, TResult, Func<TBase, TResult>>(expression);
        }
        public static Expression<Func<TBase, T1, TResult>> BuildExtendSelectExpre<TBase, T1, TResult>(this Expression<Func<TBase, T1, TResult>> expression)
        {
            return GetExtendSelectExpre<TBase, TResult, Func<TBase, T1, TResult>>(expression);
        }
        public static Expression<Func<TBase, T1, T2, TResult>> BuildExtendSelectExpre<TBase, T1, T2, TResult>(this Expression<Func<TBase, T1, T2, TResult>> expression)
        {
            return GetExtendSelectExpre<TBase, TResult, Func<TBase, T1, T2, TResult>>(expression);
        }
        private static Expression<TDelegate> GetExtendSelectExpre<TBase, TResult, TDelegate>(Expression<TDelegate> expression)
        {
            NewExpression newBody = Expression.New(typeof(TResult));
            MemberInitExpression oldExpression = (MemberInitExpression)expression.Body;

            ParameterExpression[] oldParamters = expression.Parameters.ToArray();
            List<string> existsProperties = new List<string>();
            oldExpression.Bindings.ToList().ForEach(aBinding =>
            {
                existsProperties.Add(aBinding.Member.Name);
            });

            List<MemberBinding> newBindings = new List<MemberBinding>();
            typeof(TBase).GetProperties().Where(x => !existsProperties.Contains(x.Name)).ToList().ForEach(aProperty =>
            {
                if (typeof(TResult).GetMembers().Any(x => x.Name == aProperty.Name))
                {
                    MemberBinding newMemberBinding = null;
                    var valueExpre = Expression.Property(oldParamters[0], aProperty.Name);
                    if (typeof(TBase).IsAssignableFrom(typeof(TResult)))
                    {
                        newMemberBinding = Expression.Bind(aProperty, valueExpre);
                    }
                    else
                    {
                        newMemberBinding = Expression.Bind(typeof(TResult).GetProperty(aProperty.Name), valueExpre);
                    }
                    newBindings.Add(newMemberBinding);
                }
            });

            newBindings.AddRange(oldExpression.Bindings);

            var body = Expression.MemberInit(newBody, newBindings.ToArray());
            var resExpression = Expression.Lambda<TDelegate>(body, oldParamters);

            return resExpression;
        }
    }
}
