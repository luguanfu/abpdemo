using Aspose.Cells;
using System.Collections.Generic;

public static partial class Extention
{
    /// <summary>
    /// 导出Excel字节流
    /// </summary>       
    /// <param name="list"></param>
    /// <returns>返回Excel字节流</returns>
    public static byte[] ExportExcel(this IEnumerable<string> list)
    {
        Workbook wb = new Workbook();
        Worksheet sheet = (Worksheet)wb.Worksheets[0];

        // 为单元格添加样式
        Aspose.Cells.Style style = wb.CreateStyle();
        style.HorizontalAlignment = Aspose.Cells.TextAlignmentType.Center;  //设置居中
        style.Font.Size = 12;//文字大小
        style.Font.IsBold = true;//粗体
        style.HorizontalAlignment = TextAlignmentType.Center;//文字居中

        int rowIndex = 0, col = 0;
        foreach (var item in list)
        {
            sheet.Cells[rowIndex, col].PutValue(item);
            sheet.Cells[rowIndex, col].SetStyle(style);
            sheet.Cells.SetColumnWidth(col, 20);//设置宽度

            col++;
        }
        var ms = wb.SaveToStream();
        var bytes = ms.ToArray();
        ms.Close();
        return bytes;
    }
}
