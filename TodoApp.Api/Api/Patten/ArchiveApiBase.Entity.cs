using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Api.Api.IPatten;
using TodoApp.Entity.Patten;

namespace TodoApp.Api.Api.Patten
{
    public abstract class ArchiveApiBase<TEntity> : ApiBase<TEntity, Guid>,IApiBase
        where TEntity : class, IEntity<Guid>, new()
    {
        /// <summary>
        /// 归档
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost, Route("Archive")]
        public async Task<ApiResult> Archive(List<Guid> ids)
        {
            return await this.Archive(ids);
        }
    }
}
