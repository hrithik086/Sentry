namespace Sentry.Core.Service.Helper.Context;

public class ContextAccessor : IContextAccessor
{
    public UserContext UserDetails { get; set; }
}