using Microsoft.International.Converters.PinYinConverter;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

public static partial class Extention
{
    public static string FirstToLower(this string str)
    {
        return str[0].ToString().ToLower() + str.Substring(1);
    }
    public static string LeftSubstring(this string str, Func<int,string> func)
    {
        if (string.IsNullOrEmpty(str))
            throw new Exception("长度不够");

        //return str.Substring(0, length);
        return func(3);
    }
    public static int Amount(this List<string> source, Func<string, bool> func)
    {
        int amount = 0;
        source?.ForEach(item =>
        {
            if (func(item))
                amount++;
        });
        return amount;
    }
    public static string GetPinyin(this string @this, string strSplit = ";")
    {
        if (string.IsNullOrEmpty(@this))
        {
            return "";
        }
        if (@this.Length > 50)
        {
            @this = @this.Substring(0, 50);
        }
        List<string> list = new List<string>();
        List<string> list2 = new List<string>();
        string text = @this;
        for (int i = 0; i < text.Length; i++)
        {
            char ch = text[i];
            string[] array2;
            if (ChineseChar.IsValidChar(ch))
            {
                ReadOnlyCollection<string> pinyins = new ChineseChar(ch).Pinyins;
                list2.Clear();
                foreach (string item4 in pinyins)
                {
                    if (string.IsNullOrEmpty(item4))
                    {
                        break;
                    }
                    string item = item4.Substring(0, item4.Length - 1);
                    if (!list2.Contains(item))
                    {
                        list2.Add(item);
                    }
                }
                if (list2.Count <= 0)
                {
                    continue;
                }
                if (list.Count > 2000)
                {
                    break;
                }
                string[] array = list.ToArray();
                list.Clear();
                foreach (string item5 in list2)
                {
                    if (array.Length == 0)
                    {
                        if (!list.Contains(item5))
                        {
                            list.Add(item5);
                        }
                        continue;
                    }
                    array2 = array;
                    for (int j = 0; j < array2.Length; j++)
                    {
                        string item2 = array2[j] + item5;
                        if (!list.Contains(item2))
                        {
                            list.Add(item2);
                        }
                    }
                }
                continue;
            }
            string[] array3 = list.ToArray();
            list.Clear();
            if (array3.Length == 0)
            {
                if (!list.Contains(ch.ToString()))
                {
                    list.Add(ch.ToString());
                }
                continue;
            }
            array2 = array3;
            for (int j = 0; j < array2.Length; j++)
            {
                string item3 = array2[j] + ch;
                if (!list.Contains(item3))
                {
                    list.Add(item3);
                }
            }
        }
        return string.Join(strSplit, list);
    }
}