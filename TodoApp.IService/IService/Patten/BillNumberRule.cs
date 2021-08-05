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
        public string NumberName { get; set; }
        public BillDateRuleEnum BillDateRuleEnum { get; set; }
        public string BillNumberPrefixStr { get; set; }
        public int SerialNumber { get; set; }

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
            int maxNumber = 1;
            if (!string.IsNullOrEmpty(lastNumber))
            {
                maxNumber = Convert.ToInt32(lastNumber.Right(SerialNumber)) + 1;
            }
            result += maxNumber.ToString().PadLeft(SerialNumber, '0');

            return result;
        }
    }
}
