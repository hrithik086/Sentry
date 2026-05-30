using System.Security.Claims;
using Sentry.Core.Service.Helper.ContextAccessor;
using Sentry.Core.Service.Repository;

namespace Sentry_Core_Service.Helper;

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
                UserContext = userContext
            };
        });
        
        services.AddScoped<IMasterKeyRepository, MasterKeyRepository>();
        
        return services;
    }
}