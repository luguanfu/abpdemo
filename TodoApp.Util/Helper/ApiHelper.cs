using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace TodoApp.Util.Helper
{
    public class ApiHelper
    {
        public static string GetToken(string url, Dictionary<string, object> parameters)
        {
            HttpWebRequest request = null;
            HttpWebResponse response = null;
            Stream reqStream = null;

            request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "POST";
            request.ReadWriteTimeout = 5000;
            //System.Net.WebProxy wp = new System.Net.WebProxy("127.0.0.1:5555", true);// 调试模式下，用于postman拦截测试参数问题
            //request.Proxy = wp;
            request.ProtocolVersion = HttpVersion.Version10;
            request.KeepAlive = false;
            request.ContentType = "application/x-www-form-urlencoded;charset=utf-8";
            request.ServicePoint.Expect100Continue = false;
            //添加Authorization到HTTP头
            //request.Headers.Add("Authorization", "Basic ****************");
            //Dictionary<string, string> parameters = new Dictionary<string, string>();    //参数列表
            //parameters.Add("paraName", "paraValue");
            byte[] data = Encoding.UTF8.GetBytes(BuildQuery(parameters, "utf8"));   //使用utf-8格式组装post参数
            request.ContentLength = data.Length;
            reqStream = request.GetRequestStream();
            reqStream.Write(data, 0, data.Length);
            reqStream.Close();
            //获取服务端返回
            response = (HttpWebResponse)request.GetResponse();
            StreamReader sr = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
            var result = sr.ReadToEnd().Trim();
            JObject jarray = JObject.Parse(result);
            var str = jarray["data"]["token"].ToString();

            sr.Close();

            return str;
        }
        public static void Post<TResult>(string url, Dictionary<string, object> parameters, ref TResult result, string token)
        {
            HttpWebRequest request = null;
            HttpWebResponse response = null;
            Stream reqStream = null;

            request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "POST";
            request.ReadWriteTimeout = 5000;
            //System.Net.WebProxy wp = new System.Net.WebProxy("127.0.0.1:5555", true);// 调试模式下，用于postman拦截测试参数问题
            //request.Proxy = wp;
            request.ProtocolVersion = HttpVersion.Version10;
            request.KeepAlive = false;
            request.ContentType = "application/json";
            request.ServicePoint.Expect100Continue = false;
            //添加Authorization到HTTP头
            request.Headers.Add("Authorization", $"Bearer {token}");
            //Dictionary<string, string> parameters = new Dictionary<string, string>();    //参数列表
            //parameters.Add("paraName", "paraValue");            
            var pars = JsonConvert.SerializeObject(parameters);
            byte[] data = Encoding.UTF8.GetBytes(pars);   //使用utf-8格式组装post参数
            request.ContentLength = data.Length;
            reqStream = request.GetRequestStream();
            reqStream.Write(data, 0, data.Length);
            reqStream.Close();
            //获取服务端返回
            response = (HttpWebResponse)request.GetResponse();
            StreamReader sr = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
            var str = sr.ReadToEnd().Trim();
            JObject jarray = JObject.Parse(str);

            result = JsonConvert.DeserializeObject<TResult>(jarray["data"].ToString());

            sr.Close();
        }
        public static void Post<TResult>(string url, Dictionary<string, object> parameters, ref TResult tr)
        {
            HttpWebRequest request = null;
            HttpWebResponse response = null;
            Stream reqStream = null;

            request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "POST";
            request.ReadWriteTimeout = 5000;
            //System.Net.WebProxy wp = new System.Net.WebProxy("127.0.0.1:5555", true);// 调试模式下，用于postman拦截测试参数问题
            //request.Proxy = wp;
            request.ProtocolVersion = HttpVersion.Version10;
            request.KeepAlive = false;
            request.ContentType = "application/x-www-form-urlencoded;charset=utf-8";
            request.ServicePoint.Expect100Continue = false;
            //添加Authorization到HTTP头
            //request.Headers.Add("Authorization", "Basic ****************");
            //Dictionary<string, string> parameters = new Dictionary<string, string>();    //参数列表
            //parameters.Add("paraName", "paraValue");
            byte[] data = Encoding.UTF8.GetBytes(BuildQuery(parameters, "utf8"));   //使用utf-8格式组装post参数
            request.ContentLength = data.Length;
            reqStream = request.GetRequestStream();
            reqStream.Write(data, 0, data.Length);
            reqStream.Close();
            //获取服务端返回
            response = (HttpWebResponse)request.GetResponse();
            StreamReader sr = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
            var result = sr.ReadToEnd().Trim();
            JObject jarray = JObject.Parse(result);

            tr = JsonConvert.DeserializeObject<TResult>(jarray["data"].ToString());

            sr.Close();
        }
        private static string BuildQuery(IDictionary<string, object> parameters, string encode)
        {
            StringBuilder postData = new StringBuilder();
            bool hasParam = false;
            IEnumerator<KeyValuePair<string, object>> dem = parameters.GetEnumerator();
            while (dem.MoveNext())
            {
                string name = dem.Current.Key;
                string value = dem.Current.Value.ToString();
                // 忽略参数名或参数值为空的参数
                if (!string.IsNullOrEmpty(name))
                {
                    if (hasParam)
                    {
                        postData.Append("&");
                    }
                    postData.Append(name);
                    postData.Append("=");
                    if (encode == "gb2312")
                    {
                        postData.Append(HttpUtility.UrlEncode(value, Encoding.GetEncoding("gb2312")));
                    }
                    else if (encode == "utf8")
                    {
                        postData.Append(HttpUtility.UrlEncode(value, Encoding.UTF8));
                    }
                    else
                    {
                        postData.Append(value);
                    }
                    hasParam = true;
                }
            }
            return postData.ToString();
        }
        public static TResult Get<TResult>(string url, string token)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            request.ContentType = "text/html;charset=UTF-8";
            request.Headers.Add("Authorization", $"Basic {token}");

            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream myResponseStream = response.GetResponseStream();
            StreamReader myStreamReader = new StreamReader(myResponseStream, Encoding.UTF8);
            string retString = myStreamReader.ReadToEnd();
            TResult tr = JsonConvert.DeserializeObject<TResult>(retString);
            myStreamReader.Close();
            myResponseStream.Close();

            return tr;
        }
    }
}
