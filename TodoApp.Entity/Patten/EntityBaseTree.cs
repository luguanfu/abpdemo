using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Entity.Patten
{
    public class EntityBaseTree<TKey> : EntityBase<TKey>, ITreeEntity<TKey>
    {
        [Display(Name ="父级Id")]
        public Guid? ParentId { get; set; }
        [Display(Name ="层级")]
        public int Level { get; set; }
        [Display(Name ="是否有子级")]
        public bool HasChildren { get; set; }
        [NotMapped]
        public object Children { get; set; }
    }
}
