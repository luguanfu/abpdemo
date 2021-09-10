using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TodoApp.Entity.Model.ProductManager;

namespace TodoApp.Util.Helper
{
    public class QueueHelper
    {
        public static string hostName = "127.0.0.1";
        public static int port = 5672;
        public static string userName = "admin";
        public static string password = "000000";
        public static void QueueSend<T>(string queueName, T obj)
        {
            IConnectionFactory conFactory = new ConnectionFactory
            {
                HostName = hostName,
                Port = port,
                UserName = userName,
                Password = password
            };
            using (IConnection con = conFactory.CreateConnection())
            {
                using (IModel channel = con.CreateModel())
                {
                    var st = channel.QueueDeclare(queueName, false, false, false, null);

                    string json = JsonConvert.SerializeObject(obj);
                    //消息内容
                    byte[] buffer = Encoding.UTF8.GetBytes(json);

                    channel.BasicPublish(exchange: "", routingKey: queueName, basicProperties: null, body: buffer);
                }
            }
        }
        public static void QueueReceive<T>(string queueName)
            where T : class
        {
            IConnectionFactory conFactory = new ConnectionFactory
            {
                HostName = hostName,
                Port = port,
                UserName = userName,
                Password = password
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
                        T t = JsonConvert.DeserializeObject<T>(json);

                        ParameterizedThreadStart ParStart = new ParameterizedThreadStart(CateStart<T>);
                        Thread thread = new Thread(ParStart);
                        thread.Start(t);
                    };
                    //消费者开启监听
                    channel.BasicConsume(queue: queueName, autoAck: true, consumer: consumer);
                }
            }

        }
        static void CateStart<T>(object obj)
            where T : class
        {
            Thread.Sleep(2000);
            if (obj is ProductCategory pc)
            {
                Console.WriteLine("Thread:" + pc.TypeName);
            }
        }
    }
}
