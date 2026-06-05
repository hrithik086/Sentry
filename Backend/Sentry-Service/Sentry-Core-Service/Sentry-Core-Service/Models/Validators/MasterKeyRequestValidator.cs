using FluentValidation;
using Sentry_Core_Service.Models.RequestDTO;

namespace Sentry_Core_Service.Models.Validators;

public class MasterKeyRequestValidator : AbstractValidator<MasterKeyRequest>
{
    public MasterKeyRequestValidator()
    {
        RuleFor(request => request.MasterKey)
            .NotEmpty();
    }
}