using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Dynamic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Common
{
    public static class DynamicExtensions
    {
        public static dynamic ToExpando(this object o)
        {
            if (o is ExpandoObject)
            {
                return (dynamic)o;
            }
            ExpandoObject expandoObject = new ExpandoObject();
            IDictionary<string, object> dictionary = expandoObject;
            if (o.GetType() == typeof(NameValueCollection) || o.GetType().IsSubclassOf(typeof(NameValueCollection)))
            {
                NameValueCollection nameValueCollection = (NameValueCollection)o;
                string[] allKeys = nameValueCollection.AllKeys;
                foreach (string text in allKeys)
                {
                    dictionary.Add(new KeyValuePair<string, object>(text, nameValueCollection[text]));
                }
            }
            else
            {
                PropertyInfo[] properties = o.GetType().GetProperties();
                foreach (PropertyInfo propertyInfo in properties)
                {
                    dictionary.Add(propertyInfo.Name, propertyInfo.GetValue(o, null));
                }
            }
            return expandoObject;
        }
    }
}
