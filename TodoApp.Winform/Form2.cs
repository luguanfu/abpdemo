using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace TodoApp.Winform
{
    public partial class Form2 : Form
    {
        public Action<string> action;

        public Form2()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if (action != null)
            {
                action(this.textBox1.Text);
            }
        }
    }
}
