using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Common.Upload
{
    public class MessageEntity
    {
        private int _Code = 0;
        private string _Msg = string.Empty;
        private object _Data = new object();

        /// <summary>
        /// 状态标识
        /// </summary>
        public int Code { get => _Code; set => _Code = value; }
        /// <summary>
        /// 返回消息
        /// </summary>
        public string Msg { get => _Msg; set => _Msg = value; }
        /// <summary>
        /// 返回数据
        /// </summary>
        public object Data { get => _Data; set => _Data = value; }
    }
}
