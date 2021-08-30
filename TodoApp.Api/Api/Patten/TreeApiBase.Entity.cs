using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;
using TodoApp.IService.IService.MenuManager;

namespace TodoApp.Api.Api.Patten
{
    public abstract class TreeApiBase<TEntity, TKey> : ApiBase<TEntity, TKey>
        where TEntity :class, ITreeEntity<TKey>,new()
        where TKey : struct
    {
        /// <summary>
        /// 获取树型结构数据集合
        /// </summary>
        /// <returns></returns>
        [HttpGet, Route("GetTreeData")]
        public virtual async Task<ApiResult<List<TEntity>>> GetTreeData()
        {
            var list = TreeData(null);

            return await ApiResult.Of(list);
        }
        protected abstract List<TEntity> GetListByParentId(Guid? parentId);

        protected virtual List<TEntity> TreeData(Guid? parentId)
        {
            var list = GetListByParentId(parentId);
            if (list?.Count > 0)
            {
                foreach (var item in list)
                {
                    Guid? id = (item as ITreeEntity<TKey>).Id as Guid?;
                    item.Children = TreeData(id);
                }
                return list;
            }
            return null;
        }
    }
}
