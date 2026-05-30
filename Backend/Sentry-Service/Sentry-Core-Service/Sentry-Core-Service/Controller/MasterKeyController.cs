using Microsoft.AspNetCore.Mvc;
using Sentry_Core_Service.Models.RequestDTO;
using Sentry.Core.Service.Helper;

namespace Sentry_Core_Service.Controller;

[ApiController]
[Route("api/[controller]")]
public class MasterKeyController : ControllerBase
{
    [HttpPost("/create")]
    public ActionResult<ApiResponse<bool>> CreateMasterKey([FromBody] MasterKeyRequest masterKeyRequest)
    {
        return new ActionResult<ApiResponse<bool>>(new ApiResponse<bool>(true));
    }
}