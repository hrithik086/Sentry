using Microsoft.AspNetCore.Mvc;
using Sentry_Core_Service.Models.RequestDTO;
using Sentry.Core.Service.Helper;
using Sentry.Core.Service.Helper.ContextAccessor;
using Sentry.Core.Service.Services;

namespace Sentry_Core_Service.Controller;

[ApiController]
[Route("api/[controller]")]
public class MasterKeyController(IMasterKeyService masterKeyService,
                                    IContextAccessor contextAccessor) : ControllerBase
{
    [HttpPost("create")]
    public async Task<ActionResult<ApiResponse<bool>>> CreateMasterKey([FromBody] MasterKeyRequest masterKeyRequest)
    {
        var isMasterKeyAddSuccess = await masterKeyService.CreateMasterKey(masterKeyRequest.MasterKey);
        
        if(isMasterKeyAddSuccess)
            return Ok(new ApiResponse<bool>(true));
        return Conflict(new ApiResponse<bool>(false, "Unable to add master key"));
    }

    [HttpPost("verify")]
    public async Task<ActionResult<ApiResponse<bool>>> VerifyMasterKey(MasterKeyRequest masterKeyRequest)
    {
        var isMasterKeyValidForUser = await masterKeyService.VerifyMasterKey(masterKeyRequest.MasterKey);
        
        if(isMasterKeyValidForUser)
            return Ok(new ApiResponse<bool>(true));
        return Conflict(new ApiResponse<bool>(false, "Invalid Master Key"));
    }
}