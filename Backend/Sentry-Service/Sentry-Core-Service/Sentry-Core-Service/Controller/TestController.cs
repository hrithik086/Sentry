using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sentry.Core.Service.Helper.ContextAccessor;

namespace Sentry_Core_Service.Controller;

[ApiController]
[Route("api/[controller]")]
public class TestController(IContextAccessor _context): ControllerBase
{
    [HttpGet("test")]
    public string TestEndPoint()
    {
        return _context.UserContext.Email;
    }
}