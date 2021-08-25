using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Todo.App.Cache;
using TodoApp.Api.Api.DetailTable;
using TodoApp.Api.Api.LoadOptions;
using TodoApp.Common;
using TodoApp.Entity.Patten;
using TodoApp.IService.IService.Patten;
using TodoApp.IService.IService.UserManager;
using TodoApp.IService.UnitManager;
using TodoApp.Service.Patten;

namespace TodoApp.Api.Api.Patten
{
    /// <summary>
    /// 控制器基类
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <typeparam name="TKey"></typeparam>
    [ApiController]
    public abstract class ApiBase<TEntity, TKey> : ApiBase
        where TEntity : class, IEntity<TKey>, new()
        where TKey : struct
    {
        /// <summary>
        /// 服务基类
        /// </summary>
        protected ServiceBase<TEntity, TKey> services = new ServiceBase<TEntity, TKey>();
        /// <summary>
        /// 返回类型对象
        /// </summary>
        protected virtual ApiResult ApiResult => new ApiResult();
        /// <summary>
        /// 是否写入缓存
        /// </summary>
        protected virtual bool IsWriteCache => false;
        /// <summary>
        /// 添加或修改层表结构
        /// </summary>
        protected virtual List<IDetailTableInfo<TKey>> DetailsTableInfo => null;
        /// <summary>
        /// 是否获取已删除的数据
        /// </summary>
        protected virtual bool? IsDeleted => false;
        /// <summary>
        /// 是否显示全部数据
        /// </summary>
        protected virtual bool IgnoreAuth => false;
        /// <summary>
        /// 编号自动生成对象
        /// </summary>
        protected virtual BillNumberRule billNumberRule => null;

        /// <summary>
        /// 租户Id
        /// </summary>
        protected Guid TenantId
        {
            get
            {
                Guid? userId = UserId;
                var model = GetService<IUserService>().GetModelById(userId);
                if (model == null)
                {
                    throw new MyException("登录信息异常");
                }
                if (model.TenantId != null)
                    return services.TenantId = model.TenantId.Value;

                return services.TenantId = model.Id;
            }
        }
        private Guid? UserId
        {
            get
            {
                foreach (var item in User.Claims)
                {
                    if (item.Type.Equals("id"))
                    {
                        return Guid.Parse(item.Value);
                    }
                }
                return null;
            }
        }

        #region GetList
        /// <summary>
        /// 获取列表
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        [HttpPost, Route("GetList")]
        public virtual async Task<ApiResult<LoadResult>> GetList([FromBody] LoadOptions options)
        {
            var loadResult = ProcessGetLoadResult(options);

            GetListReload(loadResult, options);

            return await ApiResult.Of(loadResult);
        }
        protected virtual LoadResult ProcessGetLoadResult(LoadOptions options)
        {
            var list = services.GetQuery(IsDeleted);

            Type type = typeof(TEntity);
            var propertys = type.GetProperties();
            if (!IgnoreAuth)
            {
                if (propertys.FirstOrDefault(s => s.Name.Equals("CreateBy")) != null)
                {
                    list = list.WhereFilter(new SearchField[] { new SearchField { Field = "CreateBy", Op = "=", Value = UserCacheProject.LoginUserId.ToString() } });
                }
            }
            //return DataSourceLoader.Load(list, options);
            return Search(list, options);
        }
        /// <summary>
        /// 按条件筛选和排序
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="list"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        protected virtual LoadResult Search<T>(IQueryable<T> list, LoadOptions options)
        {
            //条件筛选
            list = list.WhereFilter(options.Filter);

            //总记录数
            int totalSummary = list.Count();

            //排序
            list = Order(list, options.sortfilter);

            //汇总数据
            var data = list.ToList();
            T countEntity = default(T);
            if (options.IsCountQuery)
            {
                countEntity = data.Summary(options.CountField);
            }

            //分页
            if (options.Take > 0)
            {
                data = data.Skip(options.Skip).Take(options.Take).ToList();
            }

            LoadResult result = new LoadResult()
            {
                Data = SelectData(data, options.select),
                TModel = countEntity,
                TotalSummary = totalSummary
            };

            return result;
        }
        /// <summary>
        /// 返回指定字段匿名对象
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="list"></param>
        /// <param name="select"></param>
        /// <returns></returns>
        private IEnumerable<dynamic> SelectData<T>(List<T> list, string[] select)
        {
            if (select != null && select.Length > 0)
            {
                List<dynamic> result = new List<dynamic>();
                Type t = typeof(T);
                var propertys = t.GetProperties();

                list.ForEach(item =>
                {
                    dynamic obj = new System.Dynamic.ExpandoObject();
                    foreach (string field in select)
                    {
                        var propertyInfo = propertys.FirstOrDefault(s => s.Name.ToLower().Equals(field.ToLower()));
                        if (propertyInfo != null)
                        {
                            ((IDictionary<string, object>)obj).Add(propertyInfo.Name.FirstToLower(), propertyInfo.GetValue(item));
                        }
                    }
                    result.Add(obj);
                });
                return result;
            }
            return list.Select(s => (dynamic)s);
        }
        /// <summary>
        /// 处理结果集
        /// </summary>
        /// <param name="list"></param>
        protected virtual void GetListReload(LoadResult list, LoadOptions options)
        {

        }
        private IQueryable<T> Order<T>(IQueryable<T> query, OrderField[] sortFilter)
        {
            if (sortFilter != null && sortFilter.Length > 0)
            {
                for (int k = 0; k < sortFilter.Length; k++)
                {
                    if (k > 0)
                    {
                        if (sortFilter[k].IsDESC)
                        {
                            query = query.ThenByDescending(sortFilter[k].FieldName);
                        }
                        else
                        {
                            query = query.ThenByAsc(sortFilter[k].FieldName);
                        }
                    }
                    else
                    {
                        if (sortFilter[k].IsDESC)
                        {
                            query = query.OrderByDescending(sortFilter[k].FieldName);
                        }
                        else
                        {
                            query = query.OrderByAsc(sortFilter[k].FieldName);
                        }
                    }
                }
            }
            return query;
        }

        #endregion

        /// <summary>
        /// 新增
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        [Route("Insert")]
        [HttpPost]
        public async Task<ApiResult<TEntity>> Insert([FromBody] TEntity entity)
        {
            var unitOfWork = new UnitOfWork(services.context);
            try
            {
                ProcessNumberBeforeSave(entity);

                if (entity is ITenantEntity tenantEntity)
                {
                    tenantEntity.TenantId = TenantId;
                }

                entity = services.Insert(entity);

                ProcessSaveDetailTableData(entity);

                unitOfWork.Commit();
            }
            catch (Exception ex)
            {
                unitOfWork.Rollback();

                throw;
            }

            return await ApiResult.Of(entity);
        }
        /// <summary>
        /// 生成编号
        /// </summary>
        /// <param name="entity"></param>
        protected virtual void ProcessNumberBeforeSave(TEntity entity)
        {
            if (billNumberRule != null)
            {
                Type t = entity.GetType();
                var propertys = t.GetProperties();
                var pro = propertys.FirstOrDefault(s => s.Name.Equals(billNumberRule.NumberName));
                if (pro != null)
                {
                    string lastNumber = string.Empty;
                    var temp = services.GetQuery().OrderByAsc("CreateTime").LastOrDefault();
                    if (temp != null && temp is IBillNumberEntity billEntity)
                    {
                        lastNumber = billEntity.BillNumber;
                        //lastNumber = pro.GetValue(temp)?.ToString();
                    }
                    pro.SetValue(entity, billNumberRule.ResultNumber(lastNumber));
                }
            }
        }
        /// <summary>
        /// 添加层表数据
        /// </summary>
        /// <param name="model"></param>
        protected virtual void ProcessSaveDetailTableData(TEntity model)
        {
            if (DetailsTableInfo != null)
            {

                foreach (IDetailTableInfo<TKey> item in DetailsTableInfo)
                {
                    string formStringData = base.Request.GetFormStringData(item.TableName);
                    string formStringDataDelete = base.Request.GetFormStringData(item.TableName + "_Deleted");

                    List<TKey> deletedKeys = new List<TKey>();
                    if (!string.IsNullOrEmpty(formStringDataDelete))
                    {
                        deletedKeys = JsonConvert.DeserializeObject<List<TKey>>(formStringDataDelete);
                    }

                    item.SaveDetails(formStringData, deletedKeys, model.Id, model);
                }
            }
        }
        /// <summary>
        /// 修改
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        [HttpPost, Route("Update")]
        public async Task<ApiResult<TEntity>> Update([FromBody] TEntity entity)
        {
            var unitOfWork = new UnitOfWork(services.context);
            try
            {
                entity = services.Update(entity);

                ProcessSaveDetailTableData(entity);

                unitOfWork.Commit();
            }
            catch
            {
                unitOfWork.Rollback();

                throw;
            }

            return await ApiResult.Of(entity);
        }
        /// <summary>
        /// 获取对象
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet, Route("GetModelById")]
        public async Task<ApiResult<TEntity>> GetModelById(TKey id)
        {
            return await ApiResult.Of(services.GetModelById(id));
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost, Route("Delete")]
        public async Task<ApiResult<bool>> Delete(List<TKey> ids)
        {
            var unitOfWork = new UnitOfWork(services.context);
            try
            {
                //var result = services.Delete(ids);
                Dictionary<TKey, TEntity> deleteModelDic = new Dictionary<TKey, TEntity>();
                foreach (var id in ids)
                {
                    if (deleteModelDic.ContainsKey(id))
                        continue;

                    TEntity model = services.GetModelById(id);
                    if (model == null)
                        continue;

                    deleteModelDic.Add(id, model);
                }

                foreach (var (key, value) in deleteModelDic)
                {
                    ProcessDelete(key, value);
                }

                unitOfWork.Commit();

                return await ApiResult.Of(true);
            }
            catch (Exception ex)
            {
                unitOfWork.Rollback();
                throw new Exception(ex.Message);
            }
        }
        protected virtual void ProcessDelete(TKey id, TEntity model)
        {
            ProcessDeleteRecord(id, model);

        }
        protected virtual void ProcessDeleteRecord(TKey id, TEntity deleteModel)
        {
            ProcessBeforeDelete(id);

            services.DeleteLogic(deleteModel);

            if (DetailsTableInfo != null)
            {
                foreach (IDetailTableInfo<TKey> item in DetailsTableInfo)
                {
                    item.MainDataDeleteExecute(id, deleteModel);
                }
            }

            if (deleteModel is ITreeEntity<TKey> treeEntity)
            {
                var childrenList = services.GetQuery().Where("ParentId == @0", treeEntity.Id).ToList();
                foreach (var childrenModel in childrenList)
                {
                    ProcessDeleteRecord(childrenModel.Id, childrenModel);
                }
            }

            ProcessAfterDelete(id);
        }
        protected virtual void ProcessBeforeDelete(TKey id)
        {

        }
        protected virtual void ProcessAfterDelete(TKey id)
        {

        }
        /// <summary>
        /// 取消删除
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost, Route("CancelDelete")]
        public async Task<ApiResult<bool>> CancelDelete(List<TKey> ids)
        {
            var result = services.CancelDelete(ids);

            return await ApiResult.Of(result);
        }

        protected virtual void ProcessInsertOrUpdateBeginTransaction(bool newCreate)
        {

        }
    }
}
