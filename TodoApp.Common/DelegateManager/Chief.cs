using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Common.DelegateManager
{
    /// <summary>
    /// 首领
    /// </summary>
    public class Chief
    {
        public event Action<string> RaiseEvent;
        public event Action FallEvent;

        public List<string> result = new List<string>();

        public void Raise(string name)
        {
            result.Add($"首领{name}举杯");
            if (RaiseEvent != null)
            {
                RaiseEvent(name);
            }
        }
        public void Fall()
        {
            result.Add($"首领摔杯");
            if (FallEvent != null)
            {
                FallEvent();
            }
        }
    }
}
