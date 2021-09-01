using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace TodoApp.IService.DTO.MenuManager
{
    public class MenuInput
    {
        public string Name { get; set; }
        public int? Level { get; set; }
    }
    public class MenuImportDto
    { 
        public string FileUrl { get; set; }
    }
    public class MenuImportModel
    { 
        [JsonPropertyName("Name1")]
        public string Name1 { get; set; }
        [JsonPropertyName("Name2")]
        public string Name2 { get; set; }
        [JsonPropertyName("Name3")]
        public string Name3 { get; set; }
        [JsonPropertyName("Name4")]
        public string Name4 { get; set; }
    }
}
