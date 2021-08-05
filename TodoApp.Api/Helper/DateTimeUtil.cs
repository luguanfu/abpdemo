using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoApp.Api.Helper
{
    public class DateTimeUtil
    {
        /// <summary>
        /// 将Unix时间戳(秒) 转换为 DateTime时间
        /// </summary>
        /// <param name="secondsFrom1970"></param>
        /// <returns></returns>
        public static DateTime Unix2Datetime(double secondsFrom1970)
        {
            #region 旧版
            //DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1)); 
            #endregion
            DateTime startTime = TimeZoneInfo.ConvertTimeFromUtc(new DateTime(1970, 1, 1), TimeZoneInfo.Local);
            return startTime.AddSeconds(secondsFrom1970);
        }

        /// <summary>
        /// 将DateTime时间 转换为 Unix时间戳(秒)
        /// </summary>
        /// <param name="time"></param>
        /// <returns></returns>
        public static Double Datetime2Unix(DateTime time)
        {
            #region 旧版
            //DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1)); 
            #endregion
            DateTime startTime = TimeZoneInfo.ConvertTimeFromUtc(new DateTime(1970, 1, 1), TimeZoneInfo.Local);
            return (time - startTime).TotalSeconds;
        }
    }
}
