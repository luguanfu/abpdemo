namespace TodoApp.WebFramework
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Todo_Menu
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public Guid? MenuId { get; set; }

        public Guid? CreateBy { get; set; }

        public DateTimeOffset? CreateTime { get; set; }

        public Guid? UpdateBy { get; set; }

        public int UpdateVersion { get; set; }

        public DateTimeOffset? UpdateTime { get; set; }

        public Guid? DeleteBy { get; set; }

        public DateTimeOffset? DeleteTime { get; set; }

        public bool IsDeleted { get; set; }

        public int OrderIndex { get; set; }

        public string FilterContent { get; set; }

        public Guid? ParentId { get; set; }

        public int Level { get; set; }

        public bool HasChildren { get; set; }
    }
}
