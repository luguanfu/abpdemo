using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Common.DelegateManager
{
    /// <summary>
    /// 士兵C
    /// </summary>
    public class SoldierC
    {
        /// <summary>
        /// 首领
        /// </summary>
        public Chief chief { get; set; }
        public SoldierC(Chief chief)
        {
            this.chief = chief;
            this.chief.RaiseEvent += (a) =>
            {
                if (a.Equals("右"))
                {
                    Action();
                }
            };
            this.chief.FallEvent += () =>
            {
                Action();
            };
        }
        public void Action()
        {
            this.chief.result.Add("士兵C发起了攻击");
        }
    }
}
