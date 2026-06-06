namespace Sentry.Core.Service.Services;

public interface IMasterKeyService
{
    Task<bool> CreateMasterKey(string masterKey);
    Task<bool> VerifyMasterKey(string actualMasterKey);
}