using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static ServiceStack.Redis.RedisPubSubServer;

namespace TodoApp.Api.Filters
{
    public class FileUploadOperation: IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            if (operation.OperationId.ToLower() == "apivaluesuploadpost")
            {
                operation.Parameters.Clear();
                operation.Parameters.Add(new OpenApiParameter
                {
                    Name = "uploadedFile",
                    In = ParameterLocation.Query,
                    Description = "Upload File",
                    Required = true,
                });
                operation.Summary = "multipart/form-data";
            }
        }
    }
}
