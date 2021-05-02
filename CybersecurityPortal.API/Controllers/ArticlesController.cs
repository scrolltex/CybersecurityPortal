using System;
using System.Threading.Tasks;
using CybersecurityPortal.API.Models.Dtos;
using CybersecurityPortal.API.Models.ViewModels;
using CybersecurityPortal.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CybersecurityPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticlesController : ControllerBase
    {
        private readonly IArticleService _articleService;

        public ArticlesController(IArticleService articleService)
        {
            _articleService = articleService;
        }

        // GET: api/Articles
        [HttpGet]
        public async Task<PaginatedViewModel<ArticleDto>> GetArticles(
            [FromQuery] int pageSize = 10, 
            [FromQuery] int pageIndex = 0,
            [FromQuery] Guid? categoryId = null)
        {
            return await _articleService.GetAll(pageSize, pageIndex, categoryId);
        }

        // GET: api/Articles/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ArticleDto>> GetArticle(Guid id)
        {
            return await _articleService.GetById(id);
        }

        // POST: api/Articles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<ActionResult<ArticleDto>> PostArticle(CreateArticleDto articleDto)
        {
            var article = await _articleService.Add(articleDto);

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

            await _articleService.Update(articleDto);

            return NoContent();
        }

        // DELETE: api/Articles/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteArticle(Guid id)
        {
            await _articleService.Delete(id);

            return NoContent();
        }
    }
}
