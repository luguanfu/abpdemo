using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Common.DelegateManager
{
    /// <summary>
    /// 士兵
    /// </summary>
    public class SoldierB
    {
        /// <summary>
        /// 首领
        /// </summary>
        public Chief chief { get; set; }
        public SoldierB(Chief chief)
        {
            this.chief = chief;
            this.chief.RaiseEvent += (a) =>
             {
                 if (a.Equals("左"))
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
            this.chief.result.Add("士兵B发起了攻击");
        }
    }
}
