using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp
{
    public static partial class Extention
    {
        public static string GetFormStringData(this HttpRequest request, string keyName)
        {
            return request.GetFormData(keyName).ToString();
        }
        public static StringValues GetFormData(this HttpRequest request, string keyName)
        {
            try
            {
                //if (request.Form.ContainsKey(keyName))
                //{
                //    return request.Form[keyName];
                //}

                //request.EnableBuffering();
                request.Body.Position = 0;
                string bodyStr = string.Empty;

                using (var ms = new MemoryStream())
                {
                    request.Body.CopyTo(ms);
                    var b = ms.ToArray();
                    bodyStr = Encoding.UTF8.GetString(b); //把body赋值给bodyStr
                    //var dicObj = JsonConvert.DeserializeAnonymousType(bodyStr, new Dictionary<string, object>());

                    var jObject = JObject.Parse(bodyStr);
                    return jObject[keyName]?.ToString();
                }

            }
            catch (Exception ex)
            {
                
            }

            return new StringValues((string)null);
        }
    }
}
