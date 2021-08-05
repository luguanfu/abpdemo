using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Entity.Model.UserModel
{
    public abstract class ValueObject<T> where T : ValueObject<T>
    {
    }
    public class Money : ValueObject<Money>
    {
        protected readonly decimal Value;

        public Money(decimal value)
        {
            this.Value = value;
        }
        public Money() : this(0m)
        { 
            
        }
        public static Money operator +(Money left, Money right)
        {
            return new Money(left.Value + right.Value);
        }
    }
    public class Test 
    {
        public void Test1()
        {
            Money m1 = new Money(1);
            Money m2 = new Money(2);
            var m3 = m1 + m2;
        }
    }
}
