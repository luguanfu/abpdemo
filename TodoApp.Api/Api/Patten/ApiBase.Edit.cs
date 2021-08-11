using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Api.Api.Patten
{
    public abstract class ApiBase<TEntity, TGetViewModel, TGetListViewModel, TKey> : ApiBase<TEntity, TGetListViewModel, TKey>
        where TEntity : class, IEntity<TKey>, new()
        where TGetListViewModel : class
        where TKey : struct
    {
        /// <summary>
        /// 获取视图模型对象
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet, Route("GetViewModelById")]
        public virtual TGetViewModel GetViewModelById(Guid id)
        {
            return ProcessGetViewModelById(id);
        }
        protected virtual TGetViewModel ProcessGetViewModelById(Guid id)
        {
            return default(TGetViewModel);
        }
    }
}
