using Autofac;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.Loader;
using System.Threading.Tasks;
using TodoApp.IService.IService.Patten;
using TodoApp.Service.Patten;

namespace TodoApp.Api.Api.Patten
{
    /// <summary>
    /// 控制器基类
    /// </summary>
    [Authorize]
    public abstract class ApiBase : ControllerBase
    {
        /// <summary>
        /// 获取服务接口
        /// </summary>
        /// <typeparam name="TService">接口泛型类</typeparam>
        /// <returns></returns>
        protected virtual TService GetService<TService>() where TService : IDependency
        {
            return ServiceLocator.GetService<TService>();
            //var builder = ServiceLocator.DependencyResolver();
            //using (var container = builder.Build())
            //{
            //    return container.Resolve<TService>();
            //}
        }
        private ContainerBuilder DependencyResolver()
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
