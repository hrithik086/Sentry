namespace Sentry.Core.Service.Helper.AutoMapper;

public static class MapperExtensions
{
    public static IServiceCollection AddSentryAutoMapper(this IServiceCollection services)
    {
        services.AddAutoMapper(cfg => { }, typeof(SentryMappingProfile));
        return services;
    }
}