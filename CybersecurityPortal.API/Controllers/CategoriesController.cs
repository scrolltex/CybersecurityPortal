using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CybersecurityPortal.API.Models.Dtos;
using CybersecurityPortal.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CybersecurityPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<IEnumerable<CategoryDto>> GetCategory()
        {
            return await _categoryService.GetAll();
        }

        // POST: api/Categories
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> PostCategory(CategoryDto categoryDto)
        {
            var newCategory = await _categoryService.Add(categoryDto);

            return CreatedAtAction(nameof(GetCategory), new { id = newCategory.Id }, newCategory);
        }

        // PUT: api/Categories/5
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PutCategory(Guid id, CategoryDto categoryDto)
        {
            if (id != categoryDto.Id)
            {
                return BadRequest();
            }

            await _categoryService.Update(categoryDto);

            return NoContent();
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            await _categoryService.Delete(id);

            return NoContent();
        }
    }
}
