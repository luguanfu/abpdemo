using ServiceStack.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Todo.App.Cache
{
    public class CacheHelper
    {
        public static string host;
        public static int port;
        public static string password;
        public static long db;

        private static RedisClient redis
        {
            get
            {
                return new RedisClient(host, port, password, db);
            }
        }
        /// <summary>
        /// 是否有缓存
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static bool IsSet(string key)
        {
            return redis.ContainsKey(key);
        }

        /// <summary>
        /// 写缓存
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public static void SetCache<T>(string key, T value)
        {
            redis.Set<T>(key, value);
        }
        public static void SetCache<T>(string key, T value, int cacheTime)
        {
            redis.Set<T>(key, value, DateTime.Now.AddMinutes(cacheTime));
        }
        /// <summary>
        /// 读缓存
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <returns></returns>
        public static T GetCache<T>(string key)
        {
            return redis.Get<T>(key);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <param name="refreshCache"></param>
        /// <param name="cacheTime">过期时间(分钟)</param>
        /// <returns></returns>
        public static T GetCache<T>(string key, Func<string, T> refreshCache, int cacheTime)
        {
            if (IsSet(key))
            {
                return GetCache<T>(key);
            }
            T val = refreshCache(key);
            SetCache(key, val, cacheTime);
            return val;
        }
        /// <summary>
        /// 删除缓存
        /// </summary>
        /// <param name="ke"></param>
        public static void RemoveCache(string key)
        {
            redis.Remove(key);
        }
        /// <summary>
        /// 删除缓存
        /// </summary>
        /// <param name="ke"></param>
        public static void RemoveCache(string key, bool isRemove = true)
        {
            if (isRemove)
            {
                redis.Remove(key);
            }
        }
    }
}
