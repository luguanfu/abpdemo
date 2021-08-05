using IdentityModel;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Api.Model;
using TodoApp.Entity.Model.UserModel;
using TodoApp.IService.DTO.UserManager;

namespace TodoApp.Api.Helper
{
    public class JWTUtil
    {
        /// <summary>
        /// 把源数据转换成JWT加密串
        /// </summary>
        /// <param name="payload"></param>
        /// <returns></returns>
        public static string GetToken(User payload)
        {
            return GetToken(payload, Appsettings.SecretKey);
        }

        /// <summary>
        /// 把源数据转换成JWT加密串
        /// </summary>
        /// <param name="payload">源数据</param>
        /// <param name="key">密钥</param>
        /// <returns></returns>
        public static string GetToken(User payload, string key)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            byte[] byteKey = Encoding.UTF8.GetBytes(key);
            var authTime = DateTime.Now;//授权时间
            var expiresAt = authTime.AddMinutes(Appsettings.TokenValidMinutes);//过期时间
            //string timeStamp = authTime.ToString("yyyy-MM-dd HH:mm:ss.fff");
            string timeStamp = DateTimeUtil.Datetime2Unix(authTime).ToString();
            var tokenDescripor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(JwtClaimTypes.Audience,Appsettings.Audience),
                    new Claim(JwtClaimTypes.Issuer,Appsettings.Issuer),
                    new Claim(JwtClaimTypes.Name, payload.LoginName.ToString()),
                    new Claim(JwtClaimTypes.Id, payload.Id.ToString()),
                    //new Claim(JwtClaimTypes.PhoneNumber, payload.Phone.ToString()),
                    new Claim(JwtClaimTypes.Expiration, timeStamp)
                }),
                Expires = expiresAt,
                //对称秘钥SymmetricSecurityKey
                //签名证书(秘钥，加密算法)SecurityAlgorithms
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(byteKey), SecurityAlgorithms.HmacSha256Signature)
            };
            SecurityToken securityToken = tokenHandler.CreateToken(tokenDescripor);
            string token = tokenHandler.WriteToken(securityToken);
            return token;
        }

        /// <summary>
        /// 校验用户是否已登陆
        /// </summary>
        /// <returns></returns>
        public static bool ValidateLogin(ClaimsIdentity claimIdentity)
        {
            try
            {
                string expirationTimeStamp = claimIdentity.FindFirst(JwtClaimTypes.Expiration)?.Value;
                if (string.IsNullOrEmpty(expirationTimeStamp))
                {
                    return false;
                }
                DateTime expiration = DateTimeUtil.Unix2Datetime(Convert.ToInt64(expirationTimeStamp));
                if (DateTime.Now > expiration.AddMinutes(Appsettings.TokenCacheMinutes))
                {
                    return false;
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
