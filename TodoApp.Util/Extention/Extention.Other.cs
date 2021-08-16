public static partial class Extention
{
    public static T SafeValue<T>(this T? value) where T : struct
    {
        return value.GetValueOrDefault();
    }
}
