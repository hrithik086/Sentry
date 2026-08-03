using AutoMapper;
using Sentry_Core_Service.Models;
using Sentry.Core.Service.Helper;
using Sentry.Core.Service.Helper.Context;
using DTO = Sentry.Core.Service.Models.RequestDTO;
using Sentry.Core.Service.Repository;
using Entities = Sentry.Core.Service.Repository.NoSqlDb.Models;

namespace Sentry.Core.Service.Services.CredentialsService;

public class CredentialsService : ICredentialsService
{
    private readonly ICredentialsRepository _credentialsRepository;
    private readonly IContextAccessor _contextAccessor;
    private readonly IMapper _mapper;
    
    public CredentialsService(
        ICredentialsRepository credentialsRepository,
        IContextAccessor contextAccessor,
        IMapper mapper)
    {
        _credentialsRepository = credentialsRepository;
        _contextAccessor = contextAccessor;
        _mapper = mapper;
    }

    public async Task<ApiResponse<IList<DTO.Credential>>> GetAllCredentialsForCurrentlyLoggedInUser()
    {
        var userId = _contextAccessor.UserDetails.UserId;
        var userCredentials = await _credentialsRepository.GetUserCredentialByUserIdNoTrackingAsync(userId);
        if (userCredentials == null)
            return new(null, "No Credentials foudn for this user");
        else
            return new(_mapper.Map<IList<DTO.Credential>>(userCredentials.Credentials));
    }

    public async Task<ApiResponse<IList<DTO.Credential>>> CreateNewCredentials(IList<DTO.Credential> credentials)
    {
        var rowsAffected = await _credentialsRepository.CreateNewUserCredentialsAsync(_mapper.Map<IList<Entities.Credential>>(credentials), _contextAccessor.UserDetails.UserId);
        return rowsAffected > 0 ? new(credentials) : new(credentials, "Failed to create new credentials");
    }

    public async Task<ApiResponse<IList<DTO.Credential>>> UpdateCredentials(IList<DTO.Credential> credentials)
    {
        var allCredentialIdentifer = credentials.Select(x => new CredentialIdentfier(x.UserName,  x.Email, x.DomainName)).ToList();
        var allTrackedCredentials = await _credentialsRepository.GetAllMatchingCredentialsAsync(allCredentialIdentifer, _contextAccessor.UserDetails.UserId);

        if (allTrackedCredentials.Count != allCredentialIdentifer.Count)
        {
            return new(credentials, "few or all of the details were not found in the database");
        }
        else
        {
            var isRecordsUpdated = await _credentialsRepository.UpdateUserCredentialsAsnc(_contextAccessor.UserDetails.UserId, _mapper.Map<IList<Entities.Credential>>(credentials));
            return isRecordsUpdated ? new(credentials) : new(credentials, "Failed to update credentials");
        }
    }

    public async Task<ApiResponse<IList<DTO.Credential>>> DeleteCredentials(IList<CredentialIdentfier> credentials)
    {
        var credentialsRemovedFromSource =
            await _credentialsRepository.DeleteUserCredentialsAsnc(_contextAccessor.UserDetails.UserId, credentials);

        return new ApiResponse<IList<DTO.Credential>>(_mapper.Map<IList<DTO.Credential>>(credentialsRemovedFromSource));
    }
}