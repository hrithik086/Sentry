using FluentValidation;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Sentry_Core_Service.Filters;

public class RequestModelValidationFilter() : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        foreach (var (key, value) in context.ActionArguments)
        {
            var modelType = value?.GetType();
            var validator = context.HttpContext
                .RequestServices.GetService(typeof(IValidator<>)
                    .MakeGenericType(modelType)) as IValidator;
            
            var result = await validator.ValidateAsync(new ValidationContext<object>(value));
        }
        
        await next();
    }
}