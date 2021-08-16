using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;

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
    public static string GetConfigValue(string key)
    {
        string keyDir = System.IO.Directory.GetCurrentDirectory();

        IConfiguration config = new ConfigurationBuilder()
            .SetBasePath(keyDir)
            .Add(new JsonConfigurationSource { Path = "appsettings.json", ReloadOnChange = true })
            .Build();

        return config[key];
    }
}
