using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace WebSPA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigurationController : ControllerBase
    {
        [HttpGet]
        public ClientConfiguration GetConfiguration([FromServices] IOptions<ClientConfiguration> options)
        {
            return options.Value;
        }
    }
}
