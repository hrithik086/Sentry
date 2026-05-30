using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Sentry.Core.Service.Repository.Db.Models;

public class MasterKeys
{
    [Key]
    public Guid UserId { get; set; }
    public required String Salt { get; set; }
    public required String Hash { get; set; }
}