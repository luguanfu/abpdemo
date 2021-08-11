using Microsoft.International.Converters.PinYinConverter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace TodoApp.Util.Helper
{
    public class PinYinConverterHelp
    {
        private static Encoding gb2312 = Encoding.GetEncoding("GB2312");
        /// <summary>
        /// 汉字转全拼
        /// </summary>
        public static string ConvertToAllSpell(string strChinese, IDictionary<char, string> pinyinDic = null)
        {
            try
            {
                if (strChinese.Length != 0)
                {
                    var fullSpell = new StringBuilder();
                    for (var i = 0; i < strChinese.Length; i++)
                    {
                        var chr = strChinese[i];
                        var pinyin = GetSpell(chr);
                        fullSpell.Append(pinyin);
                    }

                    return fullSpell.ToString().ToLower();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("全拼转化出错！" + e.Message);
            }

            return string.Empty;
        }
        private static string GetSpell(char chr)
        {
            var coverchr = NPinyin.Pinyin.GetPinyin(chr);
            var isChineses = ChineseChar.IsValidChar(coverchr[0]);
            if (isChineses)
            {
                var chineseChar = new ChineseChar(coverchr[0]);
                foreach (var value in chineseChar.Pinyins)
                {
                    if (!string.IsNullOrEmpty(value))
                    {
                        return value.Remove(value.Length - 1, 1);
                    }
                }
            }

            return coverchr;

        }
    }
}
