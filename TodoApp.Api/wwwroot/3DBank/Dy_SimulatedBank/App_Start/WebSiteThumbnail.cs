using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Drawing;
using System.Threading;
using System.Web.Mvc;
using System.IO;
using System.Drawing.Imaging;
using Font = System.Drawing.Font;
using Point = System.Drawing.Point;

namespace Dy_SimulatedBank.App_Start
{
    public class WebSiteThumbnail
    {
        #region 图片转化
        /// <summary>
        /// base64 的字符串
        /// </summary>
        /// <param name="img"></param>
        /// <returns>图片转成32的名字</returns>
        public static string PDUploadImage(string img, string userCode)
        {
            try
            {
                string str = DateTime.Now.ToString("yyyyMMdd");
                string timeStr = DateTime.Now.ToString("yyyyMMddHHmmss");
                string error = "";
                string url = SaveImage(System.AppDomain.CurrentDomain.BaseDirectory+"/kaoshi/" + str + "/", userCode + "_" + timeStr, img, ref error);

                WaterMarkBll bll = new WaterMarkBll();
                bll.addWaterMark(url, System.AppDomain.CurrentDomain.BaseDirectory+"/kaoshi/" + str + "/sy_" + userCode + "_" + timeStr + ".png", WaterMarkPosition.WMP_Right_Bottom, WaterMarkType.TextMark, DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss"));
                return url;
            }
            catch (Exception ex)
            {
                var e = ex;
                return "";
            }
        }
        #endregion

        #region 截取data:image/jpeg;base64,提取图片，并保存图片
        /// <summary>
        /// 截取data:image/jpeg;base64,提取图片，并保存图片
        /// </summary>
        /// <param name="file_name"></param>
        /// <param name="img_string">base64的字符串</param>
        /// <param name="error">错误的图片格式</param>
        /// <returns>路径 + 图片的名称</returns>
        private static string SaveImage(string path, string file_name, string img_string, ref string error)
        {
            try
            {
                string[] img_array = img_string.Split(',');
                byte[] arr = Convert.FromBase64String(img_array[1]);
                using (MemoryStream ms = new MemoryStream(arr))
                {
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }

                    Bitmap bmp = new Bitmap(ms);
                    if (img_array[0].ToLower() == "data:image/jpeg;base64")
                    {
                        bmp.Save(path + file_name + ".jpg");
                        return SetImg(path + file_name, "jpg", arr);
                    }
                    else if (img_array[0].ToLower() == "data:image/png;base64")
                    {
                        bmp.Save(path + file_name + ".png");
                        return SetImg(path + file_name, "png", arr);
                    }
                    else if (img_array[0].ToLower() == "data:image/gif;base64")
                    {
                        bmp.Save(path + file_name + ".gif");
                        return SetImg(path + file_name, "gif", arr);
                    }
                    else
                    {
                        error = "不支持该文件格式。";
                        return "错";
                    }
                }
            }
            catch (Exception ex)
            {
                var s = ex;
                return "";
            }
        }
        #endregion

        #region 保存图片路径及设置名称
        /// <summary>
        /// 保存到文件路径
        /// </summary>
        /// <param name="ImgName">保存的文件名称</param>
        /// <param name="suffix">后缀名</param>
        /// <param name="arr">base64</param>
        /// <returns>图片的路径</returns>
        public static string SetImg(string ImgName, string suffix, byte[] arr)
        {
            //string str3 = System.AppDomain.CurrentDomain.BaseDirectory;//找到相对路径
            System.IO.File.WriteAllBytes(ImgName + "." + suffix + "", arr);
            return ImgName + "." + suffix + "";
        }
        #endregion

        

        
    }
}