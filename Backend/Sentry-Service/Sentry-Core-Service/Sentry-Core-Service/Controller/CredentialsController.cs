using System.Net;
using Microsoft.AspNetCore.Mvc;
using Sentry_Core_Service.Models;
using Sentry_Core_Service.Models.RequestDTO;
using Sentry.Core.Service.Helper;
using Sentry.Core.Service.Models.RequestDTO;
using Sentry.Core.Service.Services.CredentialsService;

namespace Sentry_Core_Service.Controller;

[ApiController]
[Route("api/[controller]")]
public class CredentialsController : ControllerBase
{
    private readonly ICredentialsService _credentialsService;
    
    public CredentialsController( ICredentialsService credentialsService)
    {
        _credentialsService = credentialsService;
    }

    [HttpGet("get")]
    public async Task<ActionResult<ApiResponse<IList<Credential>>>> Get()
    {
        return await _credentialsService.GetAllCredentialsForCurrentlyLoggedInUser();
    }
    
    [HttpPost("create")]
    public async Task<ActionResult<ApiResponse<IList<Credential>>>> CreateCredentials([FromBody] CreateCredentialRequest request)
    {
        return await _credentialsService.CreateNewCredentials(request.Credential);
    }
    
    [HttpPut("update")]
    public async Task<ActionResult<ApiResponse<IList<Credential>>>> UpdateCredentials([FromBody] CreateCredentialRequest request)
    {
        return await _credentialsService.UpdateCredentials(request.Credential);
    }

    [HttpDelete("delete")]
    public async Task<ActionResult<ApiResponse<IList<Credential>>>> DeleteCredentials(
        [FromBody] IList<CredentialIdentfier> credentialDetails)
    {
        var response = await _credentialsService.DeleteCredentials(credentialDetails);
        if (response.Data.Count == credentialDetails.Count)
            return Ok(response);
        else if (response.Data.Count == 0 && credentialDetails.Count > 0)
            return BadRequest(response);
        else
            return new ObjectResult(response)
            {
                StatusCode = (int)HttpStatusCode.MultiStatus
            };
    }
}