using System.Security.Claims;
using Sentry.Core.Service.Helper.ContextAccessor;

namespace Sentry_Core_Service.Helper;

public static class Extensions
{
    private const string ClaimTypeName = "name";
    public static IServiceCollection AddSentryCoreDependencies(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddScoped<UserContext>();
        services.AddScoped<IContextAccessor>(sp =>
        {
            var currentPrincipal = sp.GetService<IHttpContextAccessor>()?.HttpContext?.User;
            var userContext = sp.GetService<UserContext>();

            if (userContext is not null)
            {
                userContext.Name = currentPrincipal.Claims.FirstOrDefault(c => c.Type.Equals(ClaimTypeName))?.Value ?? "Unknown";
                userContext.Email = currentPrincipal.Claims.FirstOrDefault(c => c.Type.Equals(ClaimTypes.Email))?.Value ?? "";
            }
            return new ContextAccessor()
            {
                UserContext = userContext
            };
        });
        
        return services;
    }
}