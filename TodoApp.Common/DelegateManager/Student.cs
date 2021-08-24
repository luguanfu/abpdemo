using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Common.DelegateManager
{
    public class Student
    {
        public string Name { get; set; }

        public Action<string, int> BorrowEvent;

        public List<string> Result = new List<string>();

        public Student(string name)
        {
            this.Name = name;
        }
        /// <summary>
        /// 供书方法
        /// </summary>
        /// <param name="bookName"></param>
        /// <param name="count"></param>
        public void Borrow(string bookName, int count)
        {
            if (BorrowEvent != null)
            {
                BorrowEvent(bookName, count);
            }
        }
    }
}
