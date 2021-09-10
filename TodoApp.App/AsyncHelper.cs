using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace TodoApp.App
{
    public class AsyncHelper1
    {
        public delegate Tuple<string,int> AsyncDelegate(int a);
        public Func<int, Tuple<string, int>> f1;
        public Action action;

        public void Stop()
        {
            if (action != null)
            {
                action();
            }
        }
    }
    public class AsyncHelper
    {
        public int Test(int a, int b)
        {
            Thread.Sleep(2000);
            Console.WriteLine($"方法执行结束：{DateTime.Now}");
            return a + b;
        }
        private Func<int, int, int> m_test;
        public IAsyncResult BeginTest(int a, int b)
        {
            this.m_test = Test;
            return this.m_test.BeginInvoke(a, b, null, null);
        }
        public int EndTest(IAsyncResult result)
        {
            return this.m_test.EndInvoke(result);
        }

        public async Task Test2(int a, int b)
        {
            int c = 0;
            await Task.Run(() =>
            {
                c = Test(a, b);
            });
        }
        public async static void Test3(int a, int b)
        {
            int c = a + b;
            
            await Task.Run(() =>
            {
                while (true)
                {
                    Thread.Sleep(1000);
                    Console.WriteLine("tttt:" + c);

                    c += a;
                    if (c > 20) break;
                }
            });
            c *= b;
            Console.WriteLine("rrrrrr:" + c);

            //return c;
        }

        public void Run()
        {
            int max = 20;
            Parallel.For(1, max, (i) =>
              {
                  Thread.Sleep(1000);
                  Console.WriteLine($"{Thread.CurrentThread.ManagedThreadId}->{i}");
              });
        }

        public void T1()
        {
            Thread.Sleep(2000);
            Console.WriteLine("t1");
        }
        public void T2()
        {
            Thread.Sleep(2000);
            Console.WriteLine("t2");
        }
    }
}
