using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TodoApp.WebFramework.FormManager.Forms;

namespace TodoApp.WebFramework.Controllers
{
    public class FormsController : BaseController<Form_Data>
    {
        // GET: Forms
        public ActionResult ToForm()
        {
            string formId = Request["FormId"];
            return View("Form" + formId);
        }
        public ActionResult List()
        {
            string formId = Request["FormId"];
            var list = service.GetQuery().Where(s => s.FormId.Equals("Form" + formId)).ToList();

            if (formId.Equals("01"))
            {
                var dataList = list.GroupBy(s => s.DataId)
                   .Select(s => new Form01()
                   {
                       Name = GetValue<string>("Name", s.ToList().FirstOrDefault(k => k.FieldName.Equals("Name"))),
                       Age = GetValue<int>("Age", s.ToList().FirstOrDefault(k => k.FieldName.Equals("Age")))
                   }).ToList();

                ViewBag.DataList = dataList;
            }
            if (formId.Equals("02"))
            {
                var dataList = list.GroupBy(s => s.DataId)
                   .Select(s => new Form02()
                   {
                       Name = GetValue<string>("Name", s.ToList().FirstOrDefault(k => k.FieldName.Equals("Name"))),
                       Age = GetValue<int>("Age", s.ToList().FirstOrDefault(k => k.FieldName.Equals("Age"))),
                       Birthday = GetValue<DateTime?>("Birthday", s.ToList().FirstOrDefault(k => k.FieldName.Equals("Birthday")))
                   }).ToList();

                ViewBag.DataList = dataList;
            }

            return View($"Form{formId}_List");
        }
        private T GetValue<T>(string fieldName, Form_Data model)
        {
            try
            {
                var t = typeof(T);

                if (model != null && !string.IsNullOrEmpty(model.Value))
                {
                    if (t.IsGenericType && t.GetGenericTypeDefinition() == typeof(Nullable<>))
                    {
                        return (T)Convert.ChangeType(model.Value, t.GetGenericArguments()[0]);
                    }
                    else
                    {
                        return (T)Convert.ChangeType(model.Value, typeof(T));
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("数据转换错误：" + ex.Message);
            }
            return default(T);
        }
        [HttpPost]
        public ActionResult Add(FormCollection form, string formId)
        {
            Guid dataId = Guid.NewGuid();
            List<Form_Data> datas = new List<Form_Data>();
            var item = form.GetEnumerator();
            while (item.MoveNext())
            {
                datas.Add(new Form_Data()
                {
                    Id = Guid.NewGuid(),
                    FormId = $"Form{formId}",
                    DataId = dataId,
                    FieldName = item.Current.ToString(),
                    Value = form.GetValue(item.Current.ToString()).AttemptedValue
                });
            }
            service.BulkInsert(datas);

            return new ContentResult() { Content = "true" };
        }
    }
}