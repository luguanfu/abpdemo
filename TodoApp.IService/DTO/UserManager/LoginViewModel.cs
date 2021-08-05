using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.IService.DTO.UserManager
{
    public class LoginViewModel
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "用户名不能为空")]
        public string LoginName { get; set; }
        [Required(AllowEmptyStrings = false, ErrorMessage = "密码不能为空")]
        public string Id { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }
        public DateTime Expiration { get; set; } = DateTime.Now.AddMinutes(100);
        public string Email { get; set; }
    }
}
