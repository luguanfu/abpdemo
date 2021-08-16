using System;
using System.Globalization;

public static partial class Extention
{
    public static string ToDateFormat(this DateTime @this)
    {
        return @this.ToString("yyyy-MM-dd HH:mm:ss");
    }
    public static string ToDateFormat(this DateTime? @this)
    {
        if (@this.HasValue)
        {
            return @this.Value.ToDateFormat();
        }
        return string.Empty;
    }
    public static int WeekOfYear(this in DateTime date)
    {
        return new GregorianCalendar().GetWeekOfYear(date, CalendarWeekRule.FirstDay, DayOfWeek.Sunday);
    }
    public static int WeekOfYear(this in DateTime date, DayOfWeek week)
    {
        return new GregorianCalendar().GetWeekOfYear(date, CalendarWeekRule.FirstDay, week);
    }
}
