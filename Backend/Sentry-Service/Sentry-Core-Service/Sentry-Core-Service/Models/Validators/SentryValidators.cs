using FluentValidation;

namespace Sentry.Core.Service.Models.Validators;

public class SentryValidators
{
    private static SentryValidators? _instance = null;
    private readonly List<Type> _allSentryValidators = new ();
    private SentryValidators(){}

    public static void ParseAllValidators()
    {
        if (_instance == null)
            _instance = new SentryValidators();
        
        if(_instance._allSentryValidators.Count == 0)
        {
            var assembly = AppDomain.CurrentDomain.GetAssemblies().FirstOrDefault(x => x.GetName().Name.StartsWith("Sentry-Core-Service"));
            var validatorTypes = assembly.GetTypes()
                .Where(t => t.IsClass 
                            && !t.IsAbstract 
                            && t.Namespace is not null
                            && t.Namespace.StartsWith("Sentry.Core")
                            && t.Namespace.EndsWith("Validators"));
            
            _instance._allSentryValidators.AddRange(validatorTypes);
        }
    }
    
    public static bool IsValidatorRegisteredForRequestModelType(Type type)
    {
        return _instance?._allSentryValidators
            .Any(x => x.IsSubclassOf(typeof(AbstractValidator<>).MakeGenericType(type))) 
               ?? false;
    }
}