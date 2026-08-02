using Microsoft.EntityFrameworkCore;
using Sentry_Core_Service.Models;
using Sentry.Core.Service.Repository.NoSqlDb;
using Entities = Sentry.Core.Service.Repository.NoSqlDb.Models;

namespace Sentry.Core.Service.Repository;

public class CredentialsRepository : ICredentialsRepository
{
    private readonly SentryNoSqlDbContext _dbContext;
    
    public CredentialsRepository(SentryNoSqlDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Entities.UserCredential?> GetUserCredentialByUserIdNoTrackingAsync(Guid userId)
    {
        try
        {
            return await _dbContext.UserCredentials.AsNoTracking().FirstOrDefaultAsync(x => x.Id == userId);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Error retrieving user credential with ID {userId}", ex);
        }
    }
    
    public async Task<Entities.UserCredential?> GetUserCredentialByUserIdTrackedAsync(Guid userId)
    {
        try
        {
            return await _dbContext.UserCredentials.FirstOrDefaultAsync(x => x.Id == userId);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Error retrieving tracked user credential with ID {userId}", ex);
        }
    }

    public async Task<IList<Entities.Credential>> GetAllMatchingCredentialsAsync(IList<CredentialIdentfier> identifiers, Guid userId)
    {
        try
        {
            var user = await _dbContext.UserCredentials
                .FirstOrDefaultAsync(x => x.Id == userId);

            var filtered = user?.Credentials
                .Where(c =>
                    identifiers.Any(i =>
                        i.Username == c.UserName &&
                        i.Email == c.Email &&
                        i.DomainName == c.DomainName))
                .ToList();

            return filtered ?? new List<Entities.Credential>();
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Error retrieving matching credentials for user {userId}", ex);
        }
    }
    
    public async Task<bool> UpdateUserCredentialsAsnc(Guid userId, IList<Entities.Credential> credentials)
    {
        try
        {
            var userCredential = await _dbContext.UserCredentials.FindAsync(userId);
            if (userCredential == null)
            {
                return false;
            }
            userCredential.Credentials = credentials;
            _dbContext.UserCredentials.Update(userCredential);
            await _dbContext.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Error updating credentials for user {userId}", ex);
        }
    }

    public async Task<int> CreateNewUserCredentialsAsync(IList<Entities.Credential> credentials, Guid userId)
    {
        try
        {
            var existingUserCredential = await _dbContext.UserCredentials.FindAsync(userId);

            if (existingUserCredential is null)
            {
                _dbContext.UserCredentials.Add(new Entities.UserCredential()
                {
                    Id = userId,
                    Credentials = credentials
                });
            }
            else
            {
                foreach (var newCredential in credentials)
                {
                    var isSameCredentialAlreadyExists = existingUserCredential.Credentials
                                                                    .Any(cred => cred.DomainName == newCredential.DomainName 
                                                                                        && cred.UserName == newCredential.UserName 
                                                                                        && cred.Email == newCredential.Email);

                    if (!isSameCredentialAlreadyExists)
                        _dbContext.UserCredentials.Add(new Entities.UserCredential());
                }
                _dbContext.UserCredentials.Update(existingUserCredential);
            }
            return await _dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Error creating user credentials for user {userId}", ex);
        }
    }
}