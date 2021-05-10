using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using CybersecurityPortal.API.Models;
using CybersecurityPortal.API.Models.Dtos;
using CybersecurityPortal.API.Models.ViewModels;
using CybersecurityPortal.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CybersecurityPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public UsersController(UserManager<User> userManager, IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users
                .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
            return Ok(users);
        }

        [HttpGet("{userName}")]
        public async Task<IActionResult> GetByUserName(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            return Ok(_mapper.Map<UserDto>(user));
        }

        [HttpGet("{userName}/bookmarks")]
        public async Task<IActionResult> GetUserBookmarks(
            string userName, [FromQuery] PaginationRequest pagination, [FromServices] IArticleService articleService)
        {
            var currentUserName = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var articles = await articleService.GetUserBookmarkedAsync(currentUserName, userName, pagination);
            return Ok(articles);
        }
    }
}
