using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoApp.Entity.Patten
{
    public interface IArchiveEntity
    {
        bool? IsArchived { get; set; }
        Guid? ArchivedUserId { get; set; }
        DateTimeOffset? ArchivedTime { get; set; }
        Guid? CancelArchivedUserId { get; set; }
        DateTimeOffset? CancelArchivedTime { get; set; }
    }
}
