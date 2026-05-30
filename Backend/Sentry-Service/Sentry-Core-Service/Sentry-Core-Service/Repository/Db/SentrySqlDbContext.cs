using Microsoft.EntityFrameworkCore;
using Sentry.Core.Service.Repository.Db.Models;

namespace Sentry.Core.Service.Repository.Db;

public class SentrySqlDbContext(DbContextOptions<SentrySqlDbContext> options) : DbContext(options)
{
    public DbSet<MasterKeys>  MasterKeys { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}