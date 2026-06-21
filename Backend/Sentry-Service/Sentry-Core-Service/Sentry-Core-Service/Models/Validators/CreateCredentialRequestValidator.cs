using FluentValidation;
using Sentry_Core_Service.Models.RequestDTO;

namespace Sentry.Core.Service.Models.Validators;

public class CreateCredentialRequestValidator : AbstractValidator<CreateCredentialRequest>
{
    public CreateCredentialRequestValidator()
    {
        RuleFor(x => x.UserId)
            .NotNull()
            .NotEqual(Guid.Empty)
            .WithMessage("UserId is required.");
        
        RuleFor(x => x.Credential)
            .NotNull()
            .ChildRules(credential =>
            {
                credential.RuleFor(c => c.UserName)
                    .NotEmpty()
                    .WithMessage("UserName is required.");
                
                credential.RuleFor(c => c.Email)
                    .NotEmpty()
                    .EmailAddress()
                    .WithMessage("A valid Email is required.");
                
                credential.RuleFor(c => c.DomainName)
                    .NotNull()
                    .NotEmpty()
                    .WithMessage("DomainName is required.");
                
                credential.RuleFor(c => c.Password)
                    .NotNull()
                    .NotEmpty()
                    .WithMessage("Password must be at least 8 characters long.");
            });
    }
}