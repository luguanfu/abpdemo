using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Text;
using System.Threading;
using TodoApp.Entity.Model.ProductManager;
using TodoApp.Util.DataStructureAlgorithm.List;

namespace TodoApp.App
{
    class Program
    {
        static void Main(string[] args)
        {
            int[,] t = new int[2, 3];
            t[0, 0] = 1;
            t[0, 1] = 2;

            for (int i = 0; i < 2; i++)
            {
                for (int j = 0; j < 3; j++)
                {
                    t[i, j] = i * j;
                    Console.WriteLine($"{i}*{j}={t[i, j]}");
                }
            }

            int[][] x = new int[2][];
            x[0] = new int[] { 1, 2 };
            x[1] = new int[] { 2, 3, 4 };

            return;

            SeqList<int> list = new SeqList<int>(10);

            list.Append(555);
            list.Append(556);
            list.Append(557);
            list.Append(558);
            list.Append(559);
            list.Insert(550, 3);

            for (int k = 0; k <= list.Last; k++)
            {
                Console.WriteLine(list.Items[k]);
            }
            Console.WriteLine(list.GetItem(3));
            Console.WriteLine("MaxSize:" + list.MaxSize);
            Console.WriteLine("Last:" + list.Last);
            return;


            new AsyncHelper().Run();
            //Console.ReadLine();
            return;
            Console.Write("发送or接收(1/2?):");
            int type = int.Parse(Console.ReadLine());

            if (type == 1)
            {
                SendMessage();
            }
            if (type == 2)
            {
                GetMessage();
            }
        }

        static void SendMessage()
        {
            Console.Write("QueueName:");
            string queueName = Console.ReadLine();

            IConnectionFactory conFactory = new ConnectionFactory
            {
                HostName = "127.0.0.1",
                Port = 5672,
                UserName = "admin",
                Password = "000000"
            };
            using (IConnection con = conFactory.CreateConnection())
            {
                using (IModel channel = con.CreateModel())
                {
                    var st = channel.QueueDeclare(queueName, false, false, false, null);
                    while (true)
                    {
                        Console.Write("Send Body:");
                        string body = Console.ReadLine();
                        ProductCategory pc = new ProductCategory { Id = Guid.NewGuid(), TypeName = body };
                        string json = JsonConvert.SerializeObject(pc);
                        //消息内容
                        byte[] buffer = Encoding.UTF8.GetBytes(json);

                        channel.BasicPublish(exchange: "", routingKey: queueName, basicProperties: null, body: buffer);
                    }
                }
            }

        }
        static void GetMessage()
        {
            Console.Write("QueueName:");
            string queueName = Console.ReadLine();

            IConnectionFactory conFactory = new ConnectionFactory
            {
                HostName = "127.0.0.1",
                Port = 5672,
                UserName = "admin",
                Password = "000000"
            };
            using (var con = conFactory.CreateConnection())
            {
                using (var channel = con.CreateModel())
                {
                    channel.QueueDeclare(queueName, false, false, false, null);
                    var consumer = new EventingBasicConsumer(channel);
                    consumer.Received += (a, b) =>
                    {
                        var message = b.Body.ToArray();
                        string json = Encoding.UTF8.GetString(message);
                        ProductCategory pc = JsonConvert.DeserializeObject<ProductCategory>(json);
                        Console.WriteLine("Receive Body:" + pc.TypeName);
                        //channel.BasicAck(b.DeliveryTag, true);

                        ParameterizedThreadStart ParStart = new ParameterizedThreadStart(CateStart);
                        Thread thread = new Thread(ParStart);
                        thread.Start(pc);
                    };
                    //消费者开启监听
                    channel.BasicConsume(queue: queueName, autoAck: true, consumer: consumer);
                    Console.ReadKey();
                }
            }
            static void CateStart(object obj)
            {
                Thread.Sleep(2000);
                ProductCategory pc = obj as ProductCategory;
                Console.WriteLine("Thread:" + pc.TypeName);
            }
        }
    }
}
