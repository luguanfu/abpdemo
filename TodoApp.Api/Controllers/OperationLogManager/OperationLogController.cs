using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Api.Api.Patten;
using TodoApp.Entity.Model;

namespace TodoApp.Api.Controllers.OperationLogManager
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationLogController : ApiControllerBase<OperationLog, Guid>
    {
    }
}
