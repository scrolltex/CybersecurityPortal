using System;
using System.Security.Claims;
using System.Threading.Tasks;
using CybersecurityPortal.API.Models.Dtos;
using CybersecurityPortal.API.Models.ViewModels;
using CybersecurityPortal.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CybersecurityPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ArticlesController : ControllerBase
    {
        private readonly IArticleService _articleService;

        public ArticlesController(IArticleService articleService)
        {
            _articleService = articleService;
        }

        // GET: api/Articles
        [HttpGet]
        [AllowAnonymous]
        public Task<PaginatedViewModel<ArticleDto>> GetArticles(
            [FromQuery] PaginationRequest pagination,
            [FromQuery] string? userName = null,
            [FromQuery] Guid? categoryId = null)
        {
            var currentUserName = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return string.IsNullOrWhiteSpace(userName)
                ? _articleService.GetAllAsync(currentUserName, pagination, categoryId)
                : _articleService.GetByUserAsync(currentUserName, userName, pagination);
        }

        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<PaginatedViewModel<ArticleDto>> Search(
            [FromQuery] PaginationRequest pagination,
            [FromQuery] string searchRequest)
        {
            var currentUserName = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return await _articleService.SearchAsync(currentUserName, pagination, searchRequest);
        }

        // GET: api/Articles/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ArticleDto>> GetArticle(Guid id)
        {
            var currentUserName = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return await _articleService.FindByIdAsync(currentUserName, id);
        }

        // POST: api/Articles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<ActionResult<ArticleDto>> PostArticle(CreateArticleDto articleDto)
        {
            var userName = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var article = await _articleService.AddAsync(articleDto, userName);

            return CreatedAtAction(nameof(GetArticle), new { id = article.Id }, article);
        }

        // PUT: api/Articles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PutArticle(Guid id, ArticleDto articleDto)
        {
            if (id != articleDto.Id)
            {
                return BadRequest();
            }

            await _articleService.UpdateAsync(articleDto);

            return NoContent();
        }

        // DELETE: api/Articles/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteArticle(Guid id)
        {
            await _articleService.DeleteAsync(id);

            return NoContent();
        }

        [HttpPost("{articleId}/bookmark")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ToggleBookmark(Guid articleId)
        {
            var userName = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _articleService.ToggleBookmarkAsync(articleId, userName);
            return Ok(result);
        }

        [HttpPost("{articleId}/like")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ToggleLike(Guid articleId)
        {
            var userName = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var (state, count) = await _articleService.ToggleLikeAsync(articleId, userName);
            return Ok(new { state, count });
        }
    }
}
