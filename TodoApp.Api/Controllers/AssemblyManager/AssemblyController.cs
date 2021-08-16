using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace TodoApp.Api.Controllers.AssemblyManager
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssemblyController : ControllerBase
    {
        [HttpGet("Test")]
        public List<string> Test()
        {
            List<string> result = new List<string>();
            Assembly a = Assembly.LoadFrom("C:\\workSpaces\\ym\\abpdemo\\TodoApp.Api\\wwwroot\\lib\\TypeTest.dll");
            var t = a.GetType("TypeTest.Class1");
            object o = System.Activator.CreateInstance(t);//创建实例
            System.Reflection.MethodInfo mi = t.GetMethod("Test1");//获得方法
            var pars = mi.GetParameters();
            pars.ToList().ForEach(item =>
            {
                result.Add(item.Name + "," + item.ParameterType);
            });

            var proName = t.GetProperty("Name");
            proName.SetValue(o, "aaa");

            Func<string, string> s = (a) => a;
            var n1 = proName.GetValue(o);
            var v1 = mi.Invoke(o, new object[] { n1, s });
            result.Add("V1:" + v1);


            Action<string> ac = (b) =>
               {
                   proName.SetValue(o, "456");
               };

            t.GetProperty("reset").SetValue(o, ac, null);

            var n2 = proName.GetValue(o);
            var v2 = mi.Invoke(o, new object[] { n2, s });
            result.Add("V2:" + v2);

            return result;
        }
    }
}
