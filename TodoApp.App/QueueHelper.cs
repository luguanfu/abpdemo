using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace TodoApp.App
{
    public class QModel
    {
        public string Name { get; set; }
        public int Age { get; set; }
    }
    public class Q1
    {
        private readonly Queue<QModel> list = new Queue<QModel>();

        public Action Action;

        public void Add(QModel model)
        {
            list.Enqueue(model);
            if (Action != null)
            {
                Action();
            }
        }
        public QModel Get()
        {
            return list.Dequeue();
        }
    }
    public class Q2
    {
        public Q1 q1 { get; set; }

        public Q2(Q1 q1)
        {
            this.q1 = q1;
            this.q1.Action = () =>
              {
                  QModel t = q1.Get();
                  while (t != null)
                  {
                      Console.WriteLine(t.Name + "->" + t.Age);
                      Thread.Sleep(1000);

                      t = q1.Get();
                  }
                  Console.WriteLine("无队列数据");
              };
        }
    }
    public class QueueHelper
    {
        public static void Run()
        {
            Console.Write("生产者/消息费(1/2)：");
            string type = Console.ReadLine();
            if (type.Equals("1"))
            {
                Q1 q1 = new Q1();
                string isExsit = string.Empty;
                while(!isExsit.Equals("y"))                
                {
                    Console.Write("消息者名称:");
                    string name = Console.ReadLine();
                    q1.Add(new QModel { Name = name });


                    Console.Write("是否退出(y/n)：");
                    isExsit = Console.ReadLine();
                }
            }
            else if (type.Equals("2"))
            {
                Q2 q2 = new Q2();
            }
        }
    }
}
