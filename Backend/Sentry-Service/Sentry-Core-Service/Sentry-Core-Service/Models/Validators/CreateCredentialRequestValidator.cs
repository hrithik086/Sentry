using FluentValidation;
using Sentry_Core_Service.Models.RequestDTO;

namespace Sentry.Core.Service.Models.Validators;

public class CreateCredentialRequestValidator : AbstractValidator<CreateCredentialRequest>
{
    public CreateCredentialRequestValidator()
    {
        RuleFor(c => c.Credential)
            .NotEmpty()
            .WithMessage("Credentials is required.");
        
        RuleForEach(x => x.Credential)
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
                    .WithMessage("DomainName must be at least 8 characters long.");
            });
    }
}