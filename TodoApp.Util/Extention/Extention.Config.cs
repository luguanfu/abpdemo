using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp
{
    public static partial class Extention
    {
        /// <summary>
        /// 获取appsettings.json配置参数
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <returns></returns>
        public static string GetConnectionString(string key)
        {
            string keyDir = System.IO.Directory.GetCurrentDirectory();

            IConfiguration config = new ConfigurationBuilder()
                .SetBasePath(keyDir)
                .Add(new JsonConfigurationSource { Path = "appsettings.json", ReloadOnChange = true })
                .Build();

            return config.GetConnectionString(key);

            //var appconfig = new ServiceCollection()
            //    .AddOptions()
            //    .Configure<T>(config.GetSection(key))
            //    .BuildServiceProvider()
            //    .GetService<IOptions<T>>()
            //    .Value;
            //return appconfig;
        }
    }
}
