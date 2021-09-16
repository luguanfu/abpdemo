namespace TodoApp.WebFramework
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Todo_OperationLog
    {
        public Guid Id { get; set; }

        public Guid? OperationUser { get; set; }

        public DateTimeOffset OperationTime { get; set; }

        public string TableName { get; set; }

        public string Operation { get; set; }

        public string Content { get; set; }

        public bool DeleteFlag { get; set; }

        public Guid? KeyId { get; set; }
    }
}
