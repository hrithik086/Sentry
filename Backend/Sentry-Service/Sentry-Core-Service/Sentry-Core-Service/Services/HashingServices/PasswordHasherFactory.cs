using Sentry.Core.Service.Services.HashingServices.HashingAlgorithms;

namespace Sentry.Core.Service.Services.HashingServices;

public class PasswordHasherFactory : IPasswordHasherFactory
{
    private IPasswordHasher? _passwordHasher;

    public IPasswordHasherFactory CreatePasswordHasher(HashAlgorithms hashAlgorithmName)
    {
        switch (hashAlgorithmName)
        {
            case HashAlgorithms.Argon2:
                _passwordHasher = new PasswordHasher(new Argon2Hashing());
                break;
        }
        return this;
    }

    public IPasswordHasher GetPasswordHasher()
    {
        if (_passwordHasher is null)
            //todo: change this with custom exception
            throw new InvalidOperationException("PasswordHasher is not initialized.");
        return _passwordHasher;
    }
}