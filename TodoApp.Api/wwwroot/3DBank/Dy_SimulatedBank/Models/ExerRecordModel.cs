using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dy_SimulatedBank.Models
{
    public class ExerRecordModel
    {
        public string TotalResultId { get; set; }
        public string ExamId { get; set; }
        public string TaskId { get; set; }
        public string CustomerId { get; set; }
        public string LinkId { get; set; }
        public string Satisfaction { get; set; }
        public string CompletionOrNot { get; set; }

        public string Type_All { get; set; }
        public string Type_AllString { get; set; }

        public string UserType { get; set; }

        public int CountNum { get; set; } 

        public string openTime { get; set; }

    }
}