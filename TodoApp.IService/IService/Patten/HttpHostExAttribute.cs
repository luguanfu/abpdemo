using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApiClientCore;
using WebApiClientCore.Attributes;

namespace TodoApp.IService.IService.Patten
{
    public class HttpHostExAttribute : ApiActionAttribute
    {
        public override Task OnRequestAsync(ApiRequestContext context)
        {
            throw new NotImplementedException();
        }
    }
}
