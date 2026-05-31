using System.Security.Cryptography;
using System.Text;
using Konscious.Security.Cryptography;

namespace Sentry.Core.Service.Services.HashingServices.HashingAlgorithms;

public class Argon2Hashing : IHashing
{
    private const int SaltSize = 16;
    private const int HashSize = 32;
    private const int DegreeOfParallelism = 4;
    private const int NumberOfIterations = 3;
    private const int MemorySize = 64 * 1024;
    
    private byte[] GetHash(string password, byte[] salt)
    {
        var argon2 = new Argon2id(System.Text.Encoding.UTF8.GetBytes(password))
        {
            Salt = salt,
            DegreeOfParallelism = DegreeOfParallelism,
            Iterations = NumberOfIterations,
            MemorySize = MemorySize
        };

        var hash = argon2.GetBytes(HashSize);
        return hash;
    }

    private byte[] GetSalt()
    {
        return RandomNumberGenerator.GetBytes(SaltSize);
    }

    public string GetBase64HashWithMetaData(string passsword)
    {
        var salt = GetSalt();
        var hash = GetHash(passsword, salt);
        var hashConfiguration = $"{nameof(DegreeOfParallelism)}={DegreeOfParallelism}:" +
                                $"{nameof(NumberOfIterations)}={NumberOfIterations}:" +
                                $"{nameof(MemorySize)}={MemorySize}:" +
                                $"{nameof(HashSize)}={HashSize}";

        return $"{Convert.ToBase64String(Encoding.UTF8.GetBytes(hashConfiguration))}@" +
               $"{Convert.ToBase64String(salt)}@" +
               $"{Convert.ToBase64String(hash)}";
    }

    public bool VerifyHash(string password, string detailedHash)
    {
        var hashSplit = detailedHash.Split('@');
        var configuration = Encoding.UTF8.GetString(Convert.FromBase64String(hashSplit[0]));
        var salt = Convert.FromBase64String(hashSplit[1]);
        var expectedHash = Convert.FromBase64String(hashSplit[2]);
        
        var configurationSplit = configuration.Split(':');
        var degreeOfParallelismParse = Int32.TryParse(configurationSplit
                                                .FirstOrDefault(x => x.StartsWith(nameof(DegreeOfParallelism)))?
                                                .Split('=')[1], out var degreeOfParallelism);
        var numberOfIterationParse = Int32.TryParse(configurationSplit
                                            .FirstOrDefault(x => x.StartsWith(nameof(NumberOfIterations)))?
                                            .Split('=')[1], out var numberOfIteration);
        var memorySizeParse = Int32.TryParse(configurationSplit
                                        .FirstOrDefault(x => x.StartsWith(nameof(MemorySize)))?
                                        .Split('=')[1], out var memorySize);
        var hashSizeParse = Int32.TryParse(configurationSplit
            .FirstOrDefault(x => x.StartsWith(nameof(HashSize)))?
            .Split('=')[1], out var hashSize);
        

        if (degreeOfParallelismParse && numberOfIterationParse && memorySizeParse && hashSizeParse)
        {
            var argon2 = new Argon2id(Encoding.UTF8.GetBytes(password))
            {
                Salt = salt,
                DegreeOfParallelism = degreeOfParallelism,
                Iterations = numberOfIteration,
                MemorySize = memorySize
            };
            
            var actualHash = argon2.GetBytes(hashSize);
            return CryptographicOperations.FixedTimeEquals(actualHash, expectedHash);
        }
        
        return false;
    }
}