using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;

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
    public static string GetClientIpAddress(this HttpRequest request)
    {
        string name = Dns.GetHostName();
        IPAddress[] ipadrlist = Dns.GetHostAddresses(name);
        foreach (IPAddress ipa in ipadrlist)
        {
            if (ipa.AddressFamily == AddressFamily.InterNetwork)
            {
                return ipa.ToString();
            }
        }
        return string.Empty;
    }
}
