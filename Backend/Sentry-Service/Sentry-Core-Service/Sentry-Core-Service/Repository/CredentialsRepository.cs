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
            var user = await GetUserCredentialByUserIdTrackedAsync(userId);
            var filtered = user?.Credentials?
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
    
    public async Task<bool> UpdateUserCredentialsAsnc(Guid userId, IList<Entities.Credential> sourceCredentials)
    {
        try
        {
            var userCredential = await GetUserCredentialByUserIdTrackedAsync(userId);
            if (userCredential == null || userCredential.Credentials == null)
            {
                return false;
            }

            foreach (var targetCredential in userCredential.Credentials)
            {
                var sourceCredential = sourceCredentials.FirstOrDefault(source => 
                    source.DomainName == targetCredential.DomainName
                    && source.UserName == targetCredential.UserName
                    && source.Email == targetCredential.Email
                );

                if (sourceCredential is not null)
                {
                    targetCredential.PhoneNumber = sourceCredential.PhoneNumber;
                    targetCredential.Password = sourceCredential.Password;
                    targetCredential.Pin = sourceCredential.Pin;
                    targetCredential.SecurityKeys = sourceCredential.SecurityKeys;
                    targetCredential.AdditionalInfo = sourceCredential.AdditionalInfo;
                }
            }
            
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
    
    public async Task<IList<Entities.Credential>> DeleteUserCredentialsAsnc(Guid userId, IList<CredentialIdentfier> credentialIdentfiers)
    {
        try
        {
            var userCredential = await GetUserCredentialByUserIdTrackedAsync(userId);
            if (userCredential == null || userCredential.Credentials == null)
            {
                return new List<Entities.Credential>();
            }

            List<Entities.Credential> credentialsRemovedFromSource = new();
            foreach (var credential in credentialIdentfiers)
            {
                var credentialToRemoveFromSource = userCredential.Credentials.FirstOrDefault(source =>
                    source.DomainName == credential.DomainName
                    && source.Email == credential.Email
                    && source.UserName == credential.Username
                    );

                if (credentialToRemoveFromSource is not null)
                {
                    userCredential.Credentials.Remove(credentialToRemoveFromSource);
                    credentialsRemovedFromSource.Add(credentialToRemoveFromSource);
                } 
            }
            
            await _dbContext.SaveChangesAsync();
            return credentialsRemovedFromSource;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Error updating credentials for user {userId}", ex);
        }
    }
}