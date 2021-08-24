using System;
using System.ComponentModel;
using System.Reflection;

public static partial class Extention
{
    public static string ToText(this Enum @enum)
    {
        return @enum.ToString();
    }
    public static string GetEnumDescription(this Enum enumValue)
    {
        string value = enumValue.ToString();
        FieldInfo field = enumValue.GetType().GetField(value);
        object[] objs = field.GetCustomAttributes(typeof(DescriptionAttribute), false);  //获取描述属性
        if (objs == null || objs.Length == 0)  //当描述属性没有时，直接返回名称
            return value;
        DescriptionAttribute descriptionAttribute = (DescriptionAttribute)objs[0];
        return descriptionAttribute.Description;
    }
}