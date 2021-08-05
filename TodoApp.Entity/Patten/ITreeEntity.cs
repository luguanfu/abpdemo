using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Entity.Patten
{
    public interface ITreeEntity<TKey> : IEntity<TKey>
    {
        Guid? ParentId { get; set; }
        int Level { get; set; }
        bool HasChildren { get; set; }
        object Children { get; set; }
    }
}
