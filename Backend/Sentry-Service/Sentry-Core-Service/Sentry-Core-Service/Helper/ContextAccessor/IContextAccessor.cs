namespace Sentry.Core.Service.Helper.ContextAccessor;

public interface IContextAccessor
{
    UserContext UserContext { get; set; }
}