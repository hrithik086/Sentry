using Microsoft.EntityFrameworkCore;
using Sentry.Core.Service.Repository.NoSqlDb.Models;

namespace Sentry.Core.Service.Repository.NoSqlDb;

public class SentryNoSqlDbContext(DbContextOptions<SentryNoSqlDbContext> options) : DbContext(options)
{
    public DbSet<UserCredential> UserCredentials { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}