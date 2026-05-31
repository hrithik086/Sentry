namespace Sentry.Core.Service.Services.HashingServices.HashingAlgorithms;

public interface IHashing
{
    string GetBase64HashWithMetaData(string hash);
    bool VerifyHash(string password, string hash);
}