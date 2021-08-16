using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace TodoApp.Api.Api.LoadOptions
{
    public class DataSourceLoaderEx: DataSourceLoader
    {
        public static LoadResult LoadList<T>(IQueryable<T> source, DataSourceLoadOptionsBase options)
        {
            LoadResult loadResult = DataSourceLoader.Load(source, options);
            List<object> list = (List<object>)(loadResult.data = loadResult.data?.ToDynamicList());
            return loadResult;
        }
    }
}
