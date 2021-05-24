using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using CybersecurityPortal.API.Exceptions;
using CybersecurityPortal.API.Infrastructure;
using CybersecurityPortal.API.Models;
using CybersecurityPortal.API.Models.Dtos;
using Microsoft.EntityFrameworkCore;

namespace CybersecurityPortal.API.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public CategoryService(DataContext dataContext, IMapper mapper)
        {
            _context = dataContext;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CategoryDto>> GetAll()
        {
           return await _context.Categories
                .ProjectTo<CategoryDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<CategoryDto> Add(CategoryDto categoryDto)
        {
            if (categoryDto == null) 
                throw new ArgumentNullException(nameof(categoryDto));

            var category = _mapper.Map<Category>(categoryDto);
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return _mapper.Map<CategoryDto>(category);
        }

        public async Task Update(CategoryDto categoryDto)
        {
            if (categoryDto == null) 
                throw new ArgumentNullException(nameof(categoryDto));

            var category = _mapper.Map<Category>(categoryDto);
            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(category.Id))
                {
                    throw new NotFoundException(nameof(Category));
                }

                throw;
            }
        }

        public async Task Delete(Guid id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                throw new NotFoundException(nameof(Category));
            }

            if (_context.Categories.Count() == 1)
                throw new DomainException("Невозможно удалить единственную категорию");

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
        }

        private bool CategoryExists(Guid id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}
