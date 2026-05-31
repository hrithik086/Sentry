using System.ComponentModel.DataAnnotations;

namespace Sentry.Core.Service.Repository.Db.Models;

public class MasterKeys
{
    [Key]
    public Guid UserId { get; set; }
    [MaxLength(250)] public required string Hash { get; set; }
    public required DateTimeOffset CreatedAt { get; set; }
    [EmailAddress, MaxLength(250)] public required string CreatedBy { get; set; }
    public required DateTimeOffset ModifiedAt { get; set; }
    [EmailAddress, MaxLength(250)] public required string ModifiedBy { get; set; }
}