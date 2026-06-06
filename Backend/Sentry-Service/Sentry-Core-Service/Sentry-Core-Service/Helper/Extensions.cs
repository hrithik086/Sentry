using System.Security.Claims;
using Sentry.Core.Service.Models.Validators;
using Sentry.Core.Service.Helper.Context;
using Sentry.Core.Service.Repository;
using Sentry.Core.Service.Services;
using Sentry.Core.Service.Services.HashingServices;
using Sentry.Core.Service.Services.HashingServices.HashingAlgorithms;

namespace Sentry.Core.Service.Helper;

public static class Extensions
{
    private const string ClaimTypeName = "name";
    public static IServiceCollection AddSentryCoreDependencies(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddScoped<IContextAccessor>(sp =>
        {
            var currentPrincipal = sp.GetService<IHttpContextAccessor>()?.HttpContext?.User;
            var userContext = new UserContext()
            {
                UserId = currentPrincipal?.Claims
                        .FirstOrDefault(c => c.Type.Equals(ClaimTypes.NameIdentifier))?
                        .Value is string userIdStr && Guid.TryParse(userIdStr, out var userId) 
                            ? userId 
                            : Guid.Empty,
                Name = currentPrincipal?.Claims
                        .FirstOrDefault(c => c.Type.Equals(ClaimTypeName))?
                        .Value ?? "Unknown",
                Email = currentPrincipal?.Claims
                        .FirstOrDefault(c => c.Type.Equals(ClaimTypes.Email))?
                        .Value ?? ""
            };

            return new ContextAccessor()
            {
                UserDetails = userContext
            };
        });
        
        services.AddScoped<IPasswordHasherFactory>(sp => new PasswordHasherFactory()
                                                    .CreatePasswordHasher(HashAlgorithms.Argon2));
        services.AddScoped<IMasterKeyRepository, MasterKeyRepository>();
        services.AddScoped<IMasterKeyService, MasterKeyService>();
        
        SentryValidators.ParseAllValidators();
        
        return services;
    }
}