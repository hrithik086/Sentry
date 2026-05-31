using Sentry.Core.Service.Services.HashingServices.HashingAlgorithms;

namespace Sentry.Core.Service.Services.HashingServices;

public interface IPasswordHasher
{
    string HashPassword(string password);
    bool VerfiyPasswordAndHash(string password, string hashedPassword);
}