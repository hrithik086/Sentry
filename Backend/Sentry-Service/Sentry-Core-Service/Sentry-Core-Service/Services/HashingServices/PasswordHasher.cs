using Sentry.Core.Service.Services.HashingServices.HashingAlgorithms;

namespace Sentry.Core.Service.Services.HashingServices;

public sealed class PasswordHasher : IPasswordHasher
{
    private IHashing Hashing { get;}

    public PasswordHasher(IHashing hashing)
    {
        Hashing = hashing;
    }
    
    public string HashPassword(string password)
    {
        return Hashing.GetBase64HashWithMetaData(password);
    }

    public bool VerfiyPasswordAndHash(string password, string hashedPassword)
    {
        return Hashing.VerifyHash(password, hashedPassword);
    }
}