using Sentry.Core.Service.Helper.Context;
using Sentry.Core.Service.Repository;
using Sentry.Core.Service.Services.HashingServices;

namespace Sentry.Core.Service.Services;

public class MasterKeyService(IPasswordHasherFactory passwordHasherFactory,
                                IMasterKeyRepository masterKeyRepository,
                                IContextAccessor contextAccessor) : IMasterKeyService
{
    public async Task<bool> CreateMasterKey(string masterKey)
    {
        var hasher = passwordHasherFactory.GetPasswordHasher();
        var hashedPassword = hasher.HashPassword(masterKey);
        return await masterKeyRepository.AddMasterKeyAsync(contextAccessor.UserDetails.UserId, hashedPassword);
    }

    public async Task<bool> VerifyMasterKey(string actualMasterKey)
    {
        var expectedMasterKeyHash = await masterKeyRepository.GetMasterKeyAsync(contextAccessor.UserDetails.UserId);
        var hasher = passwordHasherFactory.GetPasswordHasher();
        
        return hasher.VerfiyPasswordAndHash(actualMasterKey, expectedMasterKeyHash);
    }
}