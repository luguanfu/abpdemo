using CsharpHttpHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Util.Helper
{
    public class MyHttpHelper
    {
        public static string GetHtml(string url)
        {
            string cookiestr = "ali_apache_id=11.134.216.2.1630980188126.240839.5; aep_usuc_f=site=glo&c_tp=USD&region=CN&b_locale=en_US; xman_f=c335r3AIpyYzUsahqdD3rXQF20XuibYfM/kBj4Re6i07cCr+bFhXwyRIhKAh8TuSnEjVdcHgQc1Z+a+qzurtoj0h/sDZGMvcvyDNG6ckDfq4wWgFIj9IzQ==; cna=TaJlGdTwPRkCAa8JjDSL4MG1; xlly=1; _gid=GA1.2.607066471.1630980190; _gcl_au=1.1.315795443.1630980191; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005001942312372; acs_usuc_t=x_csrf=1ejmo6givm5ih&acs_rt=2fafb11639294766ac421a25a4535699; intl_locale=en_US; xman_t=DQPKextdyAbWAMPfWuumoTqaBYDwsV2pxO5ZVg4TmN99bpwWS9r2KeBc+UYX9HU5; _m_h5_tk=61c70f9da0dda9c48a44480be3def6af_1631072059229; _m_h5_tk_enc=0036c21ea67c5b932a818ebd4d14e5fe; xman_us_f=x_locale=en_US&x_l=1&x_c_chg=0&x_as_i=%7B%22cookieCacheEffectTime%22%3A1631062493738%2C%22isCookieCache%22%3A%22Y%22%2C%22ms%22%3A%220%22%7D&acs_rt=b2eda6d0173242f1bcba3c9a3e09a212; intl_common_forever=mLH9Ou5hse+xYWvcwgTTiCtWuwo5FkGsVEnQ7jzK3m3mpa/zy+XiOg==; JSESSIONID=70090D48E3DE3F271D287AC28B063FDC; _gat=1; _ga_VED1YSGNC7=GS1.1.1631061620.5.1.1631062195.0; _ga=GA1.1.1888613621.1630980190; isg=BA8PUjfHsj7lC7bM2RFkUo6fnqMZNGNWCWN2biEcq36F8C_yKQTzpg3i9iDOkzvO; l=eBI1upuVgMorqt_DBOfanurza77OSIRYYuPzaNbMiOCPOD5B5O0VW63tk286C3GVh622R35_0mukBeYBqQAonxvt7eT2sCDmn; tfstk=cHaOBPj4A9XGd6hLalIhh0JDOYXlwwBxdCMDk1befLK7wv10_z4Rk8ssGd3d9";

            HttpHelper http = new HttpHelper();

            HttpItem item1 = new HttpItem()
            {
                URL = url,//URL     必需项    

                ContentType = "text/html;charset=UTF-8",
                Referer = "",
                UserAgent = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
                ResultType = CsharpHttpHelper.Enum.ResultType.String,
                AutoRedirectCookie = true,
                Method = "GET",

                Cookie = cookiestr,
                Encoding = Encoding.UTF8,

                Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
            };
            HttpResult result1 = http.GetHtml(item1);

            return result1.Html;
        }
    }
}
