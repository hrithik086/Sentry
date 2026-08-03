using Sentry_Core_Service.Models;
using Sentry.Core.Service.Helper;
using DTO = Sentry.Core.Service.Models.RequestDTO;

namespace Sentry.Core.Service.Services.CredentialsService;

public interface ICredentialsService
{
    Task<ApiResponse<IList<DTO.Credential>>> GetAllCredentialsForCurrentlyLoggedInUser();
    Task<ApiResponse<IList<DTO.Credential>>> CreateNewCredentials(IList<Models.RequestDTO.Credential> credentials);
    Task<ApiResponse<IList<DTO.Credential>>> UpdateCredentials(IList<DTO.Credential> credentials);
    Task<ApiResponse<IList<DTO.Credential>>> DeleteCredentials(IList<CredentialIdentfier> credentials);
}