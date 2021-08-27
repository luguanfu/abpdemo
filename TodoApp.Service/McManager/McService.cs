using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Model.McDataManage;
using TodoApp.Util.Helper;

namespace TodoApp.Service.McManager
{
    public class McService
    {
        public const string api = "http://sukon-cloud.com/api/v1/base/";

        public List<Project> GetProjectList(Dictionary<string,object> items)
        {
            List<Project> result = new List<Project>();
            ApiHelper.Post(api + "projects", items, ref result);

            return result;
        }
    }
}
