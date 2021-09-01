using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

public static partial class Extention
{
    public static string ConvertToJsonByNewtonsoft(this DataTable dt)
    {
        JsonSerializerSettings jsonSerializerSettings = new JsonSerializerSettings();


        return JsonConvert.SerializeObject(dt, Newtonsoft.Json.Formatting.Indented, jsonSerializerSettings);
    }
}