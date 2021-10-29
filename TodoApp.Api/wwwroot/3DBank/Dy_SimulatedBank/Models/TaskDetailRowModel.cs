﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dy_SimulatedBank.Models
{
    public class TaskDetailRowModel
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


    }
}