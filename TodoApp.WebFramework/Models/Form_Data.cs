namespace TodoApp.WebFramework
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Form_Data
    {
        public Guid Id { get; set; }

        [StringLength(50)]
        public string FormId { get; set; }

        public Guid? DataId { get; set; }

        [StringLength(50)]
        public string FieldName { get; set; }

        public string Value { get; set; }
    }
}
