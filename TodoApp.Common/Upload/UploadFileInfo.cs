using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Common.Upload
{
    public class UploadFileInfo
    {
        public static MessageEntity Save(IFormFile file)
        {
            long size = file.Length; 
            string fileName = file.FileName; 

            MessageEntity message = new MessageEntity();
            if (size <= 0 || string.IsNullOrEmpty(fileName))
            {
                message.Code = -1;
                message.Msg = "文件上传失败";
                return message;
            }
            long fileSize = 0;
            string filePath = $"{Extention.GetConfigValue("UploadFile")}/{DateTime.Now.ToString("yyyy-MM-dd")}";
            string saveFileName = $"{Guid.NewGuid().ToString()}{Path.GetExtension(fileName)}";
            string dirPath = Path.Combine(filePath, saveFileName);
            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }

            //如果有文件
            if (file.Length > 0)
            {
                fileSize = file.Length;

                using (var stream = new FileStream(dirPath, FileMode.OpenOrCreate))
                {
                    file.CopyTo(stream);                           
                }
            }

            message.Code = 0;
            message.Msg = "";
            return message;
        }
    }
}
