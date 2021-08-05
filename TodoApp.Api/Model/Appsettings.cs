using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Todo;
using Todo.App.Cache;

namespace TodoApp.Api.Model
{
    public class Appsettings
    {
        /// <summary>
        /// JWT的Issuer，token是谁颁发的
        /// </summary>
        public static string Issuer;

        /// <summary>
        /// JWT的Audience，token可以给那些客户端使用
        /// </summary>
        public static string Audience;

        /// <summary>
        /// JWT的SecretKey，长度必须大于16
        /// </summary>
        public static string SecretKey;

        /// <summary>
        /// JWT的Token有效期
        /// </summary>
        public static int TokenValidMinutes;

        /// <summary>
        /// JWT的Token失效缓冲期
        /// </summary>
        public static int TokenCacheMinutes;

        /// <summary>
        /// 初始化json文件中的配置项
        /// </summary>
        /// <param name="configuration"></param>
        public static void Initial(IConfiguration configuration)
        {

            Issuer = configuration["JwtSettings:Issuer"];

            Audience = configuration["JwtSettings:Audience"];

            SecretKey = configuration["JwtSettings:SecretKey"];

            try
            {
                TokenValidMinutes = Convert.ToInt32(configuration["TokenValidMinutes"]);
            }
            catch (Exception)
            {
                TokenValidMinutes = 2;
            }

            try
            {
                TokenCacheMinutes = Convert.ToInt32(configuration["TokenCacheMinutes"]);
            }
            catch (Exception)
            {
                TokenCacheMinutes = 5;
            }

        }
        public static void InitialCache(IConfiguration configuration)
        {
            //redis缓存
            var section = configuration.GetSection("Redis:Default");
            //连接字符串
            string _connectionString = section.GetSection("Connection").Value;
            //端口
            int _port = int.Parse(section.GetSection("Port").Value);
            //默认数据库 
            int _defaultDB = int.Parse(section.GetSection("DefaultDB").Value ?? "0");

            CacheHelper.db = _defaultDB;
            CacheHelper.host = _connectionString;
            CacheHelper.port = _port;
        }
    }
}
