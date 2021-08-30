using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Api.Api.Patten;
using TodoApp.Entity.Model.MenuManager;
using TodoApp.IService.DTO;
using TodoApp.IService.DTO.MenuManager;
using TodoApp.IService.Patten;
using TodoApp.Service.MenuManager;

namespace TodoApp.Api.Controllers.ApiManager
{
    [ApiController]
    [Route("api/apitest/[controller]")]
    public class ApiTestController : ControllerBase
    {
        ApiResult ApiResult => new ApiResult();
        public IUnitOfWork unitOfWork;
        public ApiTestController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        [HttpPost("GetMenu")]
        [Authorize]
        public async Task<ApiResult<List<Menu>>> GetMenu(PageInput<MenuInput> input)
        {
            var list = new MenuService().GetQuery()
                .WhereIf(input.Input.Level.HasValue, s => s.Level == input.Input.Level)
                .WhereIf(!string.IsNullOrEmpty(input.Input.Name), s => s.Name.Contains(input.Input.Name)).ToList();

            return await ApiResult.Of(list);
        }
    }
}
