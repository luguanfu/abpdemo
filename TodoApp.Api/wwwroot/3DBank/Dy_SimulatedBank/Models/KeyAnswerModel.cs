using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dy_SimulatedBank.Models
{
    public class KeyAnswerModel
    {

        /// <summary>
        /// Id
        /// </summary>
        public int ID { get; set; }
        /// <summary>
        /// 任务ID
        /// </summary>
        public int TaskId { get; set; }
        public int CustomerId { get; set; }
        /// <summary>
        /// 表单ID
        /// </summary>
        public string FormId { get; set; }
        /// <summary>
        /// 列字段Id
        /// </summary>
        public int FormItemId { get; set; }
        /// <summary>
        /// 列字段名称
        /// </summary>
        public string FormItemStr { get; set; }
        /// <summary>
        /// 关键字答案
        /// </summary>
        public string SingleAnswer { get; set; }
        /// <summary>
        /// 操作人
        /// </summary>
        public int AddUserId { get; set; }
        /// <summary>
        /// 操作时间
        /// </summary>
        public DateTime AddTime { get; set; }
        /// <summary>
        /// 操作时间
        /// </summary>
        public int IsTagging { get; set; }
        /// <summary>
        /// 操作时间
        /// </summary>
        public string AddTimeStr
        {
            get { return AddTime.ToString("yyyy-MM-dd"); }
        }
    }
}