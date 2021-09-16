namespace TodoApp.WebFramework
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Todo_User
    {
        public Guid Id { get; set; }

        public string LoginName { get; set; }

        public string Password { get; set; }

        public string UserName { get; set; }

        public DateTimeOffset? Birthday { get; set; }

        public string Department { get; set; }

        public Guid? TenantId { get; set; }

        public Guid? TenantProjectId { get; set; }
    }
}
