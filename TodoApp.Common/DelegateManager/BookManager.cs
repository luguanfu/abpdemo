using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Common.DelegateManager
{
    public class BookManager
    {
        public Student student { get; set; }

        public BookManager(Student s)
        {
            this.student = s;
            //this.student.BorrowEvent += new Action<string, int>(Borrow);
            this.student.BorrowEvent = (a, b) =>
              {
                  this.student.Result.Add($"{this.student.Name}借阅了{a} {b}本");
              };
        }
        //public void Borrow(string bookName, int count)
        //{
        //    this.student.Result.Add($"{this.student.Name}借阅了{bookName} {count}本");
        //}
    }
}
