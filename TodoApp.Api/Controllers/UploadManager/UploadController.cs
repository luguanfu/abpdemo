using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Api.Model;
using TodoApp.Common.Upload;

namespace TodoApp.Api.Controllers.UploadManager
{
    /// <summary>
    /// 上传文件
    /// </summary>
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        [Consumes("multipart/form-data")]
        [HttpPost, Route("FileSave")]
        public async Task<MessageEntity> FileSave(IFormCollection collection)
        {
            MessageEntity entity = null;
            int count = collection.Files?.Count ?? 0;
            for (int i = 0; i < count; i++)
            {
                var file = collection.Files[i];

                entity = UploadFileInfo.Save(file);
            }
            return await Task.FromResult(entity);
        }

        [HttpGet("Test")]
        public string Test()
        {
            return "aa";
        }
    }
}
