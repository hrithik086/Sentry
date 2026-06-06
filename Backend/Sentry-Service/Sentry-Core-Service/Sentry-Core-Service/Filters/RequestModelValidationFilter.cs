using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Sentry.Core.Service.Helper;
using Sentry.Core.Service.Models.Validators;

namespace Sentry.Core.Service.Filters;

public class RequestModelValidationFilter() : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        foreach (var (key, value) in context.ActionArguments)
        {
            var modelType = value?.GetType();
            if (modelType is not null 
                && SentryValidators.IsValidatorRegisteredForRequestModelType(modelType))
            {
                var validator = context.HttpContext
                    .RequestServices.GetService(typeof(IValidator<>)
                        .MakeGenericType(modelType)) as IValidator;
            
                var result = await validator?.ValidateAsync(new ValidationContext<object>(value));

                if (!result.IsValid)
                {
                    result.Errors.ForEach(error => 
                        context.ModelState.AddModelError(key, error.ErrorMessage));
                    
                    context.Result = new BadRequestObjectResult(new ApiResponse<Dictionary<string, string>>()
                    {
                        Data = result.Errors
                            .ToDictionary(error => 
                                "errorMessage", error => error.ErrorMessage),
                        IsError = true,
                        ErrorMessage = "Request Validation Failed"
                    });
                    return;
                }
                    
            }
        }
        
        await next();
    }
}