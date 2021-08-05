using DotXxlJob.Core;
using DotXxlJob.Core.Model;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoApp.Api.Job.ProductManager
{
    [JobHandler(name: "ProductHandler")]
    public class ProductHandler : AbstractJobHandler
    {
        private readonly ILogger<ProductHandler> logger;

        public ProductHandler(ILogger<ProductHandler> logger)
        {
            this.logger = logger;
        }

        public override Task<ReturnT> Execute(JobExecuteContext context)
        {
            logger.LogInformation("Handler start");

            return Task.FromResult(ReturnT.SUCCESS);
        }
    }
}
