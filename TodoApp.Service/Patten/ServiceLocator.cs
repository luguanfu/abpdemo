using Autofac;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.Loader;
using System.Text;
using System.Threading.Tasks;
using TodoApp.IService.IService.Patten;

namespace TodoApp.Service.Patten
{
    public class ServiceLocator
    {
        public static T GetService<T>()
        {
            var builder = DependencyResolver();
            using (var container = builder.Build())
            {
                return container.Resolve<T>();
            }
        }
        public static ContainerBuilder DependencyResolver()
        {
            var builder = new ContainerBuilder();
            Type basetype = typeof(IDependency); //获取顶级接口类型
            builder.RegisterAssemblyTypes(
                Assembly.GetExecutingAssembly(),
                AssemblyLoadContext.Default.LoadFromAssemblyName(new AssemblyName("TodoApp.Service")),
                AssemblyLoadContext.Default.LoadFromAssemblyName(new AssemblyName("TodoApp.IService"))
                )
            .Where(t => basetype.IsAssignableFrom(t) && t.IsClass) //查询继承自顶级接口IDependency的实现类，如果没有这句，则注册所有当前运行环境中接口实现类
            .AsImplementedInterfaces().InstancePerLifetimeScope();
            return builder;
        }
    }
}
