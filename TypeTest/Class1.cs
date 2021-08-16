using System;
using System.ComponentModel;

namespace TypeTest
{
    public class Class1
    {
        private int _age;
        public int Age 
        {
            get { return _age; }
            set { _age = value; }
        }
        [Description("aaaaa")]
        public string Name { get; set; }

        public string Test(string value,int? i)
        {
            return value;
        }
        
        public Action<string> reset { get; set; }

        public string Test1(string value, Func<string, string> func)
        {
            if (reset != null)
            {
                reset(value);
            }
            return func(this.Name);
        }
    }
}
