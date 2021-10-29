using Aspose.Cells;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dy_SimulatedBank.Models
{
    public class OfficeHelper
    {
        #region DataTable 导出到 Excel
        /// <summary>  
        /// DataTable 导出到 Excel  
        /// </summary>  
        /// <param name="dt">数据表</param>  
        /// <param name="captions">要导出的列标题</param>  
        /// <param name="fieldNames">要导出的列名</param>  
        /// <param name="sheetName">工作簿名称</param>    
        /// <param name="fileName">导出文件名</param>    
        public string DtToExcel(DataTable dt, string captions, string[] fieldNames, string sheetName, string fileName)
        {
            //第一步判断给出标题和查出来的数据是否相同
            //if (dt.Columns.Count != fieldNames.Length) { return "ERROR"; }

            Workbook workbook = new Workbook(); //工作簿 

            Worksheet sheet = workbook.Worksheets[0]; //工作表 
            sheet.Name = sheetName;    //设置工作表的名称
            Cells cells = sheet.Cells;//单元格 
            //为标题设置样式     
            Style styleTitle = workbook.Styles[workbook.Styles.Add()];//新增样式 
            styleTitle.HorizontalAlignment = TextAlignmentType.Center;//文字居中 
            styleTitle.Font.Name = "宋体";//文字字体 
            styleTitle.Font.Size = 18;//文字大小 
            styleTitle.Font.IsBold = true;//粗体 

            //样式2 
            Style style2 = workbook.Styles[workbook.Styles.Add()];//新增样式 
            style2.HorizontalAlignment = TextAlignmentType.Center;//文字居中 
            style2.Font.Name = "宋体";//文字字体 
            style2.Font.Size = 14;//文字大小 
            style2.Font.IsBold = true;//粗体 
            style2.IsTextWrapped = true;//单元格内容自动换行 
            style2.Borders[BorderType.LeftBorder].LineStyle = CellBorderType.Thin;
            style2.Borders[BorderType.RightBorder].LineStyle = CellBorderType.Thin;
            style2.Borders[BorderType.TopBorder].LineStyle = CellBorderType.Thin;
            style2.Borders[BorderType.BottomBorder].LineStyle = CellBorderType.Thin;

            //样式3 
            Style style3 = workbook.Styles[workbook.Styles.Add()];//新增样式 
            style3.HorizontalAlignment = TextAlignmentType.Center;//文字居中 
            style3.Font.Name = "宋体";//文字字体 
            style3.Font.Size = 12;//文字大小 
            style3.Borders[BorderType.LeftBorder].LineStyle = CellBorderType.Thin;
            style3.Borders[BorderType.RightBorder].LineStyle = CellBorderType.Thin;
            style3.Borders[BorderType.TopBorder].LineStyle = CellBorderType.Thin;
            style3.Borders[BorderType.BottomBorder].LineStyle = CellBorderType.Thin;

            int Colnum = dt.Columns.Count;//表格列数 
            int Rownum = dt.Rows.Count;//表格行数 

            //生成行1 标题行    
            cells.Merge(0, 0, 1, Colnum);//合并单元格 
            cells[0, 0].PutValue(captions);//填写内容 
            cells[0, 0].SetStyle(styleTitle);
            cells.SetRowHeight(0, 38);

            //生成行2 列名行 
            for (int i = 0; i < Colnum; i++)
            {
                //cells[1, i].PutValue(dt.Columns[i].ColumnName);
                cells[1, i].PutValue(fieldNames[i]);
                cells[1, i].SetStyle(style2);
                cells.SetRowHeight(1, 25);
            }

            //生成数据行 
            for (int i = 0; i < Rownum; i++)
            {
                for (int k = 0; k < Colnum; k++)
                {
                    cells[2 + i, k].PutValue(dt.Rows[i][k].ToString());
                    cells[2 + i, k].SetStyle(style3);
                }
                cells.SetRowHeight(2 + i, 24);
            }

            sheet.AutoFitColumns();     //设置单元格自适应
            workbook.Save(AppDomain.CurrentDomain.BaseDirectory + @"Export\" + fileName + ".xlsx", SaveFormat.Auto);
            return "SUCCESS";
        }
        #endregion
    }
}
