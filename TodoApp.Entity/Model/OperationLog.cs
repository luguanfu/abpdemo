using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Entity.Patten;

namespace TodoApp.Entity.Model
{
    public class OperationLog : IEntity<Guid>
    {
        /// <summary>
        /// 主键Id
        /// </summary>
        [Display(Name= "主键Id")]
        public Guid Id { get; set; }
        /// <summary>
        /// 操作人
        /// </summary>
        [Display(Name ="操作人")]
        public Guid? OperationUser { get; set; }
        /// <summary>
        /// 操作时间
        /// </summary>
        [Display(Name ="操作时间")]
        public DateTimeOffset OperationTime { get; set; }
        /// <summary>
        /// 数据库表
        /// </summary>
        public string TableName { get; set; }

        /// <summary>
        /// 操作(Insert/Delete/Update)
        /// </summary>
        [Display(Name = "操作(Insert/Delete/Update)")]
        public string Operation { get; set; }
        /// <summary>
        /// 操作内容
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 删除方式(True:物理删除,False:逻辑删除)
        /// </summary>
        [Display(Name = "删除方式(True:物理删除,False:逻辑删除)")]
        public bool DeleteFlag { get; set; }
        /// <summary>
        /// 关联主键Id
        /// </summary>
        [Display(Name = "关联主键Id")]
        public Guid? KeyId { get; set; }
    }
    public enum OperationLog_Operation
    {
        /// <summary>
        /// 新增
        /// </summary>
        Insert,
        /// <summary>
        /// 逻辑删除
        /// </summary>
        LogicDelete,
        /// <summary>
        /// 物理删除
        /// </summary>
        Delete,
        /// <summary>
        /// 撤销删除
        /// </summary>
        CancelDelete,
        /// <summary>
        /// 修改
        /// </summary>
        Update
    }
}
