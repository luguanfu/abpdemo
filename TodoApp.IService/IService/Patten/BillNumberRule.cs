using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.IService.IService.Patten
{
    public enum BillDateRuleEnum
    {
        /// <summary>
        /// 年份(短格式)(21)
        /// </summary>
        ShortYear,
        /// <summary>
        /// 年份(2021)
        /// </summary>
        Year,
        /// <summary>
        /// 短格式年月(2107)
        /// </summary>
        ShortYearMonth,
        /// <summary>
        /// 完整格式的年月(202107)
        /// </summary>
        YearMonth,
        /// <summary>
        /// 短年份格式的年月日(210701)
        /// </summary>
        ShortYearMonthDay,
        /// <summary>
        /// 完整格式的年月日(20210701)
        /// </summary>
        YearMonthDay,
        /// <summary>
        /// 不包含日期部分
        /// </summary>
        [Description("不包含日期部分")]
        None
    }
    public class BillNumberRule
    {
        /// <summary>
        /// 编号字段名称,默认为BillNumber
        /// </summary>
        public string NumberName { get; set; } = "BillNumber";
        /// <summary>
        /// 编号日期组成部分,默认为ShortYearMonth
        /// </summary>
        public BillDateRuleEnum BillDateRuleEnum { get; set; } = BillDateRuleEnum.ShortYearMonth;
        /// <summary>
        /// 编号前缀,默认为空
        /// </summary>
        public string BillNumberPrefixStr { get; set; } = "";
        /// <summary>
        /// 流水号位数,默认4位
        /// </summary>
        public int SerialNumber { get; set; } = 4;
        /// <summary>
        /// 流水号起始数,默认为1
        /// </summary>
        public int StartSerial { get; set; } = 1;
        /// <summary>
        /// 流水号步进数
        /// </summary>
        public int SerialStep { get; set; } = 1;
        /// <summary>
        /// 是否开启随机英文
        /// </summary>
        public bool OpenRandomEnglish { get; set; } = false;
        /// <summary>
        /// 随机英文位数
        /// </summary>
        public int RandomEnglisthLength { get; set; } = 3;
        /// <summary>
        /// 是否开启随机数字
        /// </summary>
        public bool OpenRandomNumber { get; set; } = false;
        /// <summary>
        /// 随机数字位数
        /// </summary>
        public int RandomNumberLength { get; set; } = 3;

        public string ResultNumber(string lastNumber)
        {
            string result = string.Empty;
            if (!string.IsNullOrEmpty(BillNumberPrefixStr))
            {
                result += BillNumberPrefixStr;
            }
            switch (BillDateRuleEnum)
            {
                case BillDateRuleEnum.ShortYear:
                    result += DateTime.Now.ToString("yy");
                    break;
                case BillDateRuleEnum.Year:
                    result += DateTime.Now.ToString("yyyy");
                    break;
                case BillDateRuleEnum.ShortYearMonth:
                    result += DateTime.Now.ToString("yyMM");
                    break;
                case BillDateRuleEnum.YearMonth:
                    result += DateTime.Now.ToString("yyyyMM");
                    break;
                case BillDateRuleEnum.ShortYearMonthDay:
                    result += DateTime.Now.ToString("yyMMdd");
                    break;
                case BillDateRuleEnum.YearMonthDay:
                    result += DateTime.Now.ToString("yyyyMMdd");
                    break;
                case BillDateRuleEnum.None:
                    break;
            }
            if (OpenRandomEnglish && RandomEnglisthLength > 0)
            {
                string englishStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                for (int i = 0; i < RandomEnglisthLength; i++)
                {
                    result += englishStr[new Random().Next(0, englishStr.Length - 1)];
                }
            }
            if (OpenRandomNumber && RandomNumberLength > 0)
            {
                for (int i = 0; i < RandomNumberLength; i++)
                {
                    result += new Random().Next(0, 9);
                }
            }
            int maxNumber = StartSerial;
            if (!string.IsNullOrEmpty(lastNumber))
            {
                maxNumber = Convert.ToInt32(lastNumber.Right(SerialNumber)) + SerialStep;
            }
            result += maxNumber.ToString().PadLeft(SerialNumber, '0');

            return result;


        }
    }
}
