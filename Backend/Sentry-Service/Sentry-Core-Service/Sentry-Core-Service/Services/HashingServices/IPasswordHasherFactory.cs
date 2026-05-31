using Sentry.Core.Service.Services.HashingServices.HashingAlgorithms;

namespace Sentry.Core.Service.Services.HashingServices;

public interface IPasswordHasherFactory
{
    IPasswordHasherFactory CreatePasswordHasher(HashAlgorithms hashAlgorithmName);
    IPasswordHasher GetPasswordHasher();
}