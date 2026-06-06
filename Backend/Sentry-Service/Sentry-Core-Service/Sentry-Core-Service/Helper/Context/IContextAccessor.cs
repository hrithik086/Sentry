namespace Sentry.Core.Service.Helper.Context;

public interface IContextAccessor
{
    UserContext UserDetails { get; set; }
}