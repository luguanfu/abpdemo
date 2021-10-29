using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dy_SimulatedBank.Models
{
    public class TaskDetailRowCModel
    {
        public int TaskDetailId { get; set; }
        public string AbilityString { get; set; }
        public int SceneId { get; set; }
        public int SubLinkId { get; set; }
        public int LinkId { get; set; }
        public string OperationName { get; set; }
        public int Types { get; set; }
        public string Answer { get; set; }
        public string TMName { get; set; }
        public string CustomerQuestion { get; set; }
        public string InquiryAnswer { get; set; }
        public string StuOperationalAnswers { get; set; }
        public double Scores { get; set; }
        public string CustomerName { get; set;}
        public string SName { get; set; }
        public string AccountNo { get; set; }
    }
}