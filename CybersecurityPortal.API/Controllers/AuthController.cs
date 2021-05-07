using System.Security.Claims;
using System.Threading.Tasks;
using CybersecurityPortal.API.Models;
using CybersecurityPortal.API.Models.ViewModels;
using CybersecurityPortal.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CybersecurityPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IJwtGenerator _jwtGenerator;

        public AuthController(
            UserManager<User> userManager, 
            SignInManager<User> signInManager,
            IJwtGenerator jwtGenerator)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtGenerator = jwtGenerator;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> SignIn([FromBody] SignInViewModel vm)
        {
            var user = await _userManager.FindByNameAsync(vm.UserName);

            if (user == null)
            {
                return Unauthorized();
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, vm.Password, false);
            
            if (!result.Succeeded)
            {
                return Unauthorized();
            }

            return Ok(new
            {
                access_token = _jwtGenerator.CreateToken(user)
            });
        }

        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            var user = new User
            {
                UserName = model.UserName,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return NoContent();
            }

            foreach (var identityError in result.Errors)
            {
                ModelState.AddModelError("identity", identityError.Description);
            }

            return ValidationProblem(ModelState);
        }

        [Authorize]
        [HttpPost("changePassword")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordViewModel model)
        {
            var userName = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userName))
            {
                return BadRequest();
            }

            var user = await _userManager.FindByNameAsync(userName);
            if (user == null)
            {
                ModelState.AddModelError(string.Empty, "Пользователь не найден");
                return ValidationProblem(ModelState);
            }

            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.CurrentPassword);
            if (result.Succeeded)
                return NoContent();

            foreach (var identityError in result.Errors)
                ModelState.AddModelError(string.Empty, identityError.Description);

            return ValidationProblem(ModelState);
        }
    }
}
